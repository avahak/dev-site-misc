#include <sCommon>
#include <sExtensions>

uniform float phase;
uniform vec3 size;      // (w,h,d)
uniform float gap;

uniform float time;

in vec3 vPos;
in float part;

layout(location = 0) out vec4 outColor;

#include <sWood>
#include <sTrunkPeel>


void main() {
    float phase0 = max(PI * size.z / 2.0, phase);
    vec3 p = vPos;

    vec3 pTrunk;

    if (part < 0.5) {
        // uncut part
        float r = spiralRadius(phase0, 0.0, 0.0, size.z);
        float angle = spiralAngle(size.x, 0.0, size.z) - spiralAngle(phase0, 0.0, size.z);
        p.z = r - p.z;
        pTrunk = vec3(p.x*cos(angle)-p.z*sin(angle), p.z*cos(angle)+p.x*sin(angle), p.y);
    }
    else {
        // cut part
        pTrunk = peelGeometry(vec3(p.x+phase0, p.yz), size.x, 0.0, size.z) 
               - peelGeometry(vec3(0.0), size.x, 0.0, size.z);
    }

    outColor = wood(pTrunk);
}