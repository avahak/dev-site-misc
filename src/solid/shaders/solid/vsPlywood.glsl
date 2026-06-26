#include <sCommon>
#include <sExtensions>

uniform float time;

out vec3 vPos;

#include <sTrunkPeel>


void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}