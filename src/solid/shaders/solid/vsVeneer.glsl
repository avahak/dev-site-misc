#include <sCommon>

uniform float phase;
uniform vec3 size;      // (w,h,d)
uniform float gap;

uniform float time;

uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;
uniform float debug5;
uniform float debug6;
uniform float debug7;
uniform float debug8;

out vec4 vPos;

#include <sTrunkPeel>

void main() {
    vec3 p = peelGeometry(position, phase, gap, size.z);
    vec3 pTrunk = peelGeometry(position, size.x, 0.0, size.z) - peelGeometry(vec3(0.0), size.x, 0.0, size.z);

    p = vec3(p.x, p.z, -p.y);   // TODO remove, adjust model matrix instead

    vPos = vec4(pTrunk, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}