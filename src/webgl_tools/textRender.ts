import * as THREE from 'three';
import vsText from './shaders/vsText.glsl?raw';
import fsText from './shaders/fsText.glsl?raw';
import { MCDFFont } from './font';

/**
 * Renders text.
 */
class TextGroup {
    // TEXTURE_MAX_WIDTH has to match value in vsText.glsl.
    // This is used to avoid limitations on texture dimensions.
    static TEXTURE_MAX_WIDTH = 1024;
    // FLOATS_PER_CHAR is number of floats stored for 1 text character
    // (4 atlasCoords, 3 pos, 3 e1, 3 e2, 3 color)
    static FLOATS_PER_CHAR = 16;
    // affects sharpness on text edges, default 0.75
    static SHARPNESS = 0.75;

    font!: MCDFFont;
    shader!: THREE.ShaderMaterial;
    ibGeometry!: THREE.InstancedBufferGeometry;
    dataTexture!: THREE.Texture;
    mesh: THREE.Object3D;

    data!: Float32Array;
    numChars!: number;

    constructor(font: MCDFFont) {
        this.font = font;

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                dataTexture: { value: null },
                atlasTexture: { value: font.atlas },
                unitRange: { value: [TextGroup.SHARPNESS/this.font.layoutData.atlas.width, TextGroup.SHARPNESS/this.font.layoutData.atlas.height] },
                numChars: { value: null },
            },
            vertexShader: vsText,
            fragmentShader: fsText,
            transparent: true,
            // blending: THREE.AdditiveBlending,        // There is no easy solution here
            // depthWrite: false,
            // depthTest: false
        });

        this.ibGeometry = new THREE.InstancedBufferGeometry();
        const square = new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]);
        const squareIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);
        this.ibGeometry.setAttribute('position', new THREE.BufferAttribute(square, 3));
        this.ibGeometry.setIndex(new THREE.BufferAttribute(squareIndices, 1));

        this.data = new Float32Array(TextGroup.TEXTURE_MAX_WIDTH/TextGroup.FLOATS_PER_CHAR);
        this.dataTexture = new THREE.DataTexture(this.data, this.data.length/4, 1, THREE.RGBAFormat, THREE.FloatType);
        this.shader.uniforms.dataTexture.value = this.dataTexture;
        this.dataTexture.needsUpdate = true;

        this.mesh = new THREE.Mesh(this.ibGeometry, this.shader);
        this.mesh.frustumCulled = false;

        this.reset();
    }

    addText(text: string, pos: (x: number, y: number) => number[], color: number[]) {
        let x = 0;
        let y = 0;
        let previousCharCode = -1;
        for (let k = 0; k < text.length; k++) {
            const code = text.charCodeAt(k);
            if (code == 10) {
                x = 0;
                y -= this.font.layoutData.metrics.lineHeight;
                previousCharCode = -1;
                continue;
            }

            const glyph = this.font.glyphLookup?.[code];
            if (!glyph) {
                previousCharCode = -1;
                continue;
            }
            if (glyph.planeBounds) {
                const kerning = this.font.kerningLookup?.[previousCharCode]?.[code] ?? 0;
                x += kerning;

                const x1 = x + glyph.planeBounds.left;
                const x2 = x + glyph.planeBounds.right;
                const y1 = y + glyph.planeBounds.bottom;
                const y2 = y + glyph.planeBounds.top;
                const pLeft = pos(x1, 0.5*(y1+y2));
                const pRight = pos(x2, 0.5*(y1+y2));
                const pBottom = pos(0.5*(x1+x2), y1);
                const pTop = pos(0.5*(x1+x2), y2);
                const p = [
                    (pLeft[0] + pRight[0] + pBottom[0] + pTop[0]) / 4.0,
                    (pLeft[1] + pRight[1] + pBottom[1] + pTop[1]) / 4.0,
                    (pLeft[2] + pRight[2] + pBottom[2] + pTop[2]) / 4.0,
                ];
                const e1 = [pRight[0] - pLeft[0], pRight[1] - pLeft[1], pRight[2] - pLeft[2]];
                const e2 = [pTop[0] - pBottom[0], pTop[1] - pBottom[1], pTop[2] - pBottom[2]];

                if (TextGroup.FLOATS_PER_CHAR*this.numChars >= this.data.length)
                    this._extendArray();

                const m = TextGroup.FLOATS_PER_CHAR * this.numChars;

                // 4 atlas coords
                this.data[m + 0] = glyph.atlasBounds.left / this.font.layoutData.atlas.width;
                this.data[m + 1] = glyph.atlasBounds.bottom / this.font.layoutData.atlas.height;
                this.data[m + 2] = glyph.atlasBounds.right / this.font.layoutData.atlas.width;
                this.data[m + 3] = glyph.atlasBounds.top / this.font.layoutData.atlas.height;
                // 3 pos
                this.data[m + 4] = p[0];
                this.data[m + 5] = p[1];
                this.data[m + 6] = p[2];
                // 3 e1
                this.data[m + 7] = e1[0];
                this.data[m + 8] = e1[1];
                this.data[m + 9] = e1[2];
                // 3 e2
                this.data[m + 10] = e2[0];
                this.data[m + 11] = e2[1];
                this.data[m + 12] = e2[2];
                // 3 color
                this.data[m + 13] = color[0];
                this.data[m + 14] = color[1];
                this.data[m + 15] = color[2];
                
                this.numChars++;
                previousCharCode = code;
            } else {
                previousCharCode = -1;
            }
            x += glyph.advance ?? 0;
        }
        this.ibGeometry.instanceCount = this.numChars;
        this.shader.uniforms.numChars.value = this.numChars;
        this.dataTexture.needsUpdate = true;
    }

    /**
     * Doubles this.data.
     */
    _extendArray() {
        const n = this.data.length;
        // Create new arrays with double size
        const newArray = new Float32Array(2*n);
        
        // Copy existing data from previous array
        newArray.set(this.data, 0);
        this.data = newArray;

        // Hook new arrays into textures
        this.dataTexture.dispose();
        const m = 2*n / 4;
        this.dataTexture = new THREE.DataTexture(
            this.data, 
            Math.min(m, TextGroup.TEXTURE_MAX_WIDTH), 
            Math.ceil(m / TextGroup.TEXTURE_MAX_WIDTH),
            THREE.RGBAFormat, THREE.FloatType
        );
        this.shader.uniforms.dataTexture.value = this.dataTexture;
        this.dataTexture.needsUpdate = true;
    }

    reset() {
        this.numChars = 0;
        this.ibGeometry.instanceCount = 0;
        this.shader.uniforms.numChars.value = 0;
    }

    getObject(): THREE.Object3D {
        return this.mesh;
    }
}

export { TextGroup };