#include <sCommon>

uniform float time;

uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;
uniform float debug5;
uniform float debug6;
uniform float debug7;
uniform float debug8;

out vec3 vPos;

void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}