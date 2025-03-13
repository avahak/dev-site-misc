import * as THREE from 'three';
import vsText from './shaders/vsText.glsl?raw';
import fsText from './shaders/fsText.glsl?raw';
import { MCDFFont } from './font';

/**
 * Renders text.
 */
class TextGroup {
    // MAX_WIDTH has to match value in vsText.glsl.
    // This is used to avoid limitations on texture dimensions.
    static MAX_WIDTH = 1024;

    font!: MCDFFont;
    shader!: THREE.ShaderMaterial;
    ibGeometry!: THREE.InstancedBufferGeometry;
    offsetCoordsTexture!: THREE.Texture;
    atlasCoordsTexture!: THREE.Texture;
    mesh: THREE.Object3D;

    offsetCoords!: Float32Array;
    atlasCoords!: Float32Array;
    numChars!: number;

    constructor(font: MCDFFont) {
        this.font = font;

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                offsetCoordsTexture: { value: null },
                atlasCoordsTexture: { value: null },
                atlasTexture: { value: font.atlas },
                atlasSize: { value: [this.font.layoutData.atlas.width, this.font.layoutData.atlas.height] },
                numChars: { value: null },
                color: { value: [0.5, 0.7, 1.0] }
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

        this.offsetCoords = new Float32Array(TextGroup.MAX_WIDTH);
        this.atlasCoords = new Float32Array(TextGroup.MAX_WIDTH);
        this.offsetCoordsTexture = new THREE.DataTexture(this.offsetCoords, this.offsetCoords.length/4, 1, THREE.RGBAFormat, THREE.FloatType);
        this.atlasCoordsTexture = new THREE.DataTexture(this.atlasCoords, this.atlasCoords.length/4, 1, THREE.RGBAFormat, THREE.FloatType);
        this.shader.uniforms.offsetCoordsTexture.value = this.offsetCoordsTexture;
        this.shader.uniforms.atlasCoordsTexture.value = this.atlasCoordsTexture;
        this.offsetCoordsTexture.needsUpdate = true;
        this.atlasCoordsTexture.needsUpdate = true;

        this.mesh = new THREE.Mesh(this.ibGeometry, this.shader);
        this.mesh.frustumCulled = false;

        this.reset();
    }

    addText(text: string) {
        let x = 0;
        let y = 0;
        let previousCharCode = -1;
        for (let k = 0; k < text.length; k++) {
            const code = text.charCodeAt(k);
            if (code == 10) {
                x = 0;
                y += this.font.layoutData.metrics.lineHeight;
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

                if (4*this.numChars >= this.offsetCoords.length)
                    this._extendArrays();

                // Add offsets (4 floats) and atlas coords (4 floats)
                this.offsetCoords[4*this.numChars + 0] = x + glyph.planeBounds.left;
                this.offsetCoords[4*this.numChars + 1] = y + glyph.planeBounds.bottom;
                this.offsetCoords[4*this.numChars + 2] = x + glyph.planeBounds.right;
                this.offsetCoords[4*this.numChars + 3] = y + glyph.planeBounds.top;

                this.atlasCoords[4*this.numChars + 0] = glyph.atlasBounds.left / this.font.layoutData.atlas.width;
                this.atlasCoords[4*this.numChars + 1] = glyph.atlasBounds.bottom / this.font.layoutData.atlas.height;
                this.atlasCoords[4*this.numChars + 2] = glyph.atlasBounds.right / this.font.layoutData.atlas.width;
                this.atlasCoords[4*this.numChars + 3] = glyph.atlasBounds.top / this.font.layoutData.atlas.height;

                this.numChars++;
                previousCharCode = code;
            } else {
                previousCharCode = -1;
            }
            x += glyph.advance ?? 0;
        }
        this.ibGeometry.instanceCount = this.numChars;
        this.shader.uniforms.numChars.value = this.numChars;
        this.offsetCoordsTexture.needsUpdate = true;
        this.atlasCoordsTexture.needsUpdate = true;
    }

    /**
     * Doubles this.offsetCoords and this.atlasCoords.
     */
    _extendArrays() {
        const n = this.offsetCoords.length;
        // Create new arrays with double size
        const newArray1 = new Float32Array(2*n);
        const newArray2 = new Float32Array(2*n);
        
        // Copy existing data from previous array
        newArray1.set(this.offsetCoords, 0);
        newArray2.set(this.atlasCoords, 0);
        this.offsetCoords = newArray1;
        this.atlasCoords = newArray2;

        // Hook new arrays into textures
        this.offsetCoordsTexture.dispose();
        this.atlasCoordsTexture.dispose();
        const m = 2*n / 4;
        this.offsetCoordsTexture = new THREE.DataTexture(
            this.offsetCoords, 
            Math.min(m, TextGroup.MAX_WIDTH), 
            Math.ceil(m / TextGroup.MAX_WIDTH),
            THREE.RGBAFormat, THREE.FloatType
        );
        this.atlasCoordsTexture = new THREE.DataTexture(
            this.atlasCoords, 
            Math.min(m, TextGroup.MAX_WIDTH), 
            Math.ceil(m / TextGroup.MAX_WIDTH),
            THREE.RGBAFormat, THREE.FloatType
        );
        this.shader.uniforms.offsetCoordsTexture.value = this.offsetCoordsTexture;
        this.shader.uniforms.atlasCoordsTexture.value = this.atlasCoordsTexture;
        this.offsetCoordsTexture.needsUpdate = true;
        this.atlasCoordsTexture.needsUpdate = true;
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