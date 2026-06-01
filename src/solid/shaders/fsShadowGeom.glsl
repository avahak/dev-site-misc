#include <sCommon>

uniform vec2 resolution;
uniform vec3 cameraPos;
uniform mat4 vpMat;         // view-projection matrix of the main camera
uniform mat4 invVpMat;      // inverse of vpMap
uniform float time;
uniform int phase; 
uniform int objectId;
uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;

in vec4 vPos;
in vec2 vUv;

layout(location = 0) out vec4 outDepth;
layout(location = 1) out vec4 outObjectId;

#include <sVolume>


void main() {
    float depth = gl_FragCoord.z;

    vec2 volumeI = volumeInterval();
    if ((depth < volumeI.x) && (phase != 2))
        discard;

    float id = float(objectId) / 1024.0;
    outDepth = vec4(depth, 0.0, 0.0, 0.0);
    outObjectId = vec4(id, 0.0, 0.0, 0.0);
}