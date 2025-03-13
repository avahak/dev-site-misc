import * as THREE from 'three';

class MCDFFont {
    name: string|null;
    layoutData: any;
    glyphLookup: any;
    kerningLookup: any;
    atlas: THREE.Texture|null;

    constructor() {
        this.name = null;
        this.atlas = null;
        this.layoutData = null;
        this.glyphLookup = null;
        this.kerningLookup = null;
    }

    /**
     * Loads the font layout data (.json file) and starts loading the atlas,
     * but does not wait for it.
     */
    async load(name: string) {
        this.name = name;

        this.atlas = new THREE.TextureLoader().load(`/dev-site-misc/fonts/${this.name}.png`);
        this.atlas.needsUpdate = true;
        // this.atlas.generateMipmaps = false;
        this.atlas.anisotropy = 4;

        try {
            const response = await fetch(`/dev-site-misc/fonts/${this.name}.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch JSON file');
            }
            this.layoutData = await response.json();
            this._createLookups();
            // console.log('glyphLookup', this.glyphLookup);
            // console.log('kerningLookup', this.kerningLookup);
        } catch (error) {
            console.error('Error loading JSON:', error);
            throw error;
        }
    }

    _createLookups() {
        // glyphLookup
        this.glyphLookup = { };
        this.layoutData.glyphs.forEach((glyph: any) => {
            this.glyphLookup[glyph.unicode] = glyph;
        });

        // kerningLookup
        this.kerningLookup = { };
        this.layoutData.kerning.forEach((entry: any) => {
            this.kerningLookup[entry.unicode1] ??= { };
            this.kerningLookup[entry.unicode1][entry.unicode2] = entry.advance;
        });
    }
}

export { MCDFFont };