import * as THREE from 'three';
import vsText from './shaders/vsText.glsl?raw';
import fsText from './shaders/fsText.glsl?raw';
import { MCDFFont } from './font';

/**
 * Renders text.
 */
class TextGroup {
    font: MCDFFont;
    shader!: THREE.ShaderMaterial;
    ibGeometry!: THREE.InstancedBufferGeometry;

    offsetCoordsTexture!: THREE.Texture;
    atlasCoordsTexture!: THREE.Texture;
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
                resolution: { value: null },
                numChars: { value: null },
            },
            vertexShader: vsText,
            fragmentShader: fsText,
            transparent: true,
            // blending: THREE.AdditiveBlending,
            // depthWrite: true,
            // depthTest: false
        });

        this.ibGeometry = new THREE.InstancedBufferGeometry();
        const square = new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]);
        const squareIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);
        this.ibGeometry.setAttribute('position', new THREE.BufferAttribute(square, 3));
        this.ibGeometry.setIndex(new THREE.BufferAttribute(squareIndices, 1));

        this.reset();
    }

    addText(text: string) {
        let x = 0;
        let y = 0;
        let previousCharCode = -1;
        for (let k = 0; k < text.length; k++) {
            const code = text.charCodeAt(k);
            if (code == 13) {
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
            if (glyph?.planeBounds) {
                const kerning = this.font.kerningLookup?.[previousCharCode]?.[code] ?? 0;
                x += kerning;

                // Add offsets (4 floats) and atlas coords (4 floats)
                this.offsetCoords[4*this.numChars + 0] = x + glyph.planeBounds.left;
                this.offsetCoords[4*this.numChars + 1] = y + glyph.planeBounds.bottom;
                this.offsetCoords[4*this.numChars + 2] = x + glyph.planeBounds.right;
                this.offsetCoords[4*this.numChars + 3] = y + glyph.planeBounds.top;

                this.atlasCoords[4*this.numChars + 0] = glyph.atlasBounds.left / 384.0;
                this.atlasCoords[4*this.numChars + 1] = glyph.atlasBounds.bottom / 384.0;
                this.atlasCoords[4*this.numChars + 2] = glyph.atlasBounds.right / 384.0;
                this.atlasCoords[4*this.numChars + 3] = glyph.atlasBounds.top / 384.0;

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

    reset() {
        this.offsetCoords = new Float32Array(1024); // TODO fix these
        this.atlasCoords = new Float32Array(1024);
        this.numChars = 0;
        this.ibGeometry.instanceCount = 0;
        this.shader.uniforms.numChars.value = 0;

        this.offsetCoordsTexture = new THREE.DataTexture(this.offsetCoords, this.offsetCoords.length/4, 1, THREE.RGBAFormat, THREE.FloatType);
        this.atlasCoordsTexture = new THREE.DataTexture(this.atlasCoords, this.atlasCoords.length/4, 1, THREE.RGBAFormat, THREE.FloatType);
        this.shader.uniforms.offsetCoordsTexture.value = this.offsetCoordsTexture;
        this.shader.uniforms.atlasCoordsTexture.value = this.atlasCoordsTexture;
        this.offsetCoordsTexture.needsUpdate = true;
        this.atlasCoordsTexture.needsUpdate = true;
    }

    getObject(): THREE.Object3D {
        const mesh = new THREE.Mesh(this.ibGeometry, this.shader);
        mesh.frustumCulled = false;
        return mesh;
    }
}

export { TextGroup };