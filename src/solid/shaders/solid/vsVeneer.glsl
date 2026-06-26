#include <sCommon>
#include <sExtensions>

uniform float phase;
uniform vec3 size;      // (w,h,d)
uniform float gap;
uniform int numSegments;

uniform float time;

out vec3 vPos;
out float part;

#include <sTrunkPeel>


void main() {
    float phase0 = max(PI * size.z / 2.0, phase);

    vec2 p = vec2(0.0);
    
    int i = int(round(position.x));
    if (i == numSegments-1) {
        p = vec2(size.x - phase0, size.z);
    }
    if (i == numSegments-2) {
        p = vec2(size.x - phase0, 0.0);
    }

    if (i <= numSegments-3) {
        // for i = 0 to i = numSegments-3 we wrap around the spiral

        float theta = TAU * float(i) / float(numSegments - 3);        // in [0,TAU]
        float angle0 = spiralAngle(phase0, 0.0, size.z);
        float r0 = spiralRadius(phase0, 0.0, 0.0, size.z);

        float angle = max(0.0, angle0 - TAU + theta);
        float x = spiralAngleInverse(angle, 0.0, size.z);
        float r = spiralRadius(x, 0.0, 0.0, size.z);
        p = vec2(r*sin(theta), r0 - r*cos(theta));
    }


    vPos = vec3(p.x, position.z*size.y, p.y);
    part = position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}