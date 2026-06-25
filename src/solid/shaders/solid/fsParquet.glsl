#include <sCommon>

const int MAX_BRANCHES = 1024;

uniform vec2 size;

uniform float time;

uniform sampler3D noiseTexture;
uniform sampler2D branchIndexTex;
uniform sampler2D profileTexture;

uniform vec3 knotColor;

uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;
uniform float debug5;
uniform float debug6;
uniform float debug7;
uniform float debug8;

uniform globalUBO {
    uniform float zRange;
    uniform int numBranches;
    vec4 branchesZASD[MAX_BRANCHES];
    vec4 branchesR[MAX_BRANCHES];
};

in vec3 vPos;

layout(location = 0) out vec4 outColor;

#include <sWood>


vec3 herringtonParquet(vec2 p, float w, float h) {
    // Computes Herrington parquet tiling for the given position and size of tiles.
    // Returns vec3(x,y,seed), where 
    // - (x,y) is location within the tile
    // - seed is float in [0,1] that is unique for each tile. 
    //   seed < 0.5 for vertical tiles and seed > 0.5 for horizontal tiles.

    vec2 A = vec2(h, -h);
    vec2 B = vec2(w);

    float iu = floor((p.x - p.y) / (2.0*h));
    float iv = floor((p.x + p.y) / (2.0*w));
    p = p - iu*A - iv*B;
    // Now p is localized and there are only a few possible tiles it can belong to.

    // Check if p is in first horizontal line of tiles:
    float i = floor(p.x / h);
    vec2 q = p - i*A;
    if (q.y >= 0.0 && q.y <= w)
        return vec3(q.y, h - q.x, 0.51 + 0.49*hash(round(iu+i) + round(iv)*PI));

    // Check if p is in second vertical line of tiles:
    i = floor((p.y - w) / h);
    q = p + i*A;
    if (q.x >= 0.0 && q.x <= w)
        return vec3(q.x, q.y - w, 0.49*hash(round(iu-i) + round(iv)*PI));

    // Check if p is in first vertical line of tiles:
    i = floor(p.y / h);
    q = p + i*A;
    // if (q.x >= -w && q.x <= 0.0)     // Should always be true barring floating point issues
    return vec3(q.x + w, q.y, 0.49*hash(round(iu-i) + round(iv-1.0)*PI));
}


void main() {
    vec3 p = vPos;

    vec3 hp = herringtonParquet(p.xy, size.x, size.y);

    float hw = zRange * hash(1.0 + hp.z);
    float rw = 1.0 + 0.4 * hash(2.0 + hp.z);    // avoid heartwood
    float aw = TAU * hash(3.0 + hp.z);
    vec3 pPlank = vec3(rw*cos(aw)+hp.y-0.5*size.y, rw*sin(aw)+p.z, hw+hp.x);

    outColor = wood(pPlank);
    // outColor = vec4(vec3(hp.z), 1.0);
    // outColor = vec4(hp.x/w, hp.y/h, hp.z, 1.0);
}