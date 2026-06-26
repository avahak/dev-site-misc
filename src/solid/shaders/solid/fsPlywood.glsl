#include <sCommon>
#include <sExtensions>

uniform vec3 size;
uniform int numLayers;

uniform float time;

in vec3 vPos;

layout(location = 0) out vec4 outColor;

#include <sTrunkPeel>
#include <sWood>


void main() {
    vec3 p = vPos;

    float width = size.x;
    float depth = size.z / float(numLayers);        // depth of one layer
    int layer = clamp(int(floor(p.z/depth)), 0, numLayers-1);
    p.z = p.z - float(layer)*depth;      // p.z is now depth within its layer
    if (layer%2 == 0) {
        // Cross-graining: 90 degree rotation for every other layer
        p.xy = vec2(p.y, size.y-p.x);
    }
    if (layer > numLayers/2) {
        // Flip sheets so that tight side of each sheet faces the nearest border (top/bottom).
        // The tight side (opposite to loose side) is the outer-radius side of the veneer 
        // that was compressed when it was straightened.
        // In the spiral geometry larger z corresponds to smaller r, i.e. loose side.
        p = vec3(p.x, size.y-p.y, depth-p.z);
    }

    p.x = p.x + 50.0;       // Move from center a bit, TODO what is the best way to handle this?
    vec3 pTrunk = spiralGeometry(p, 0.0, depth);

    outColor = wood(pTrunk);
}