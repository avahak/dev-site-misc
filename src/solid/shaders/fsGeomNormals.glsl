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
in vec3 vNormal;

layout(location = 0) out vec4 outObjectId;
layout(location = 1) out vec2 outNormal;

#include <sVolume>


void main() {
    vec3 v = vPos.xyz;
    float depth = gl_FragCoord.z;

    vec2 volumeI = volumeInterval();
    if ((depth < volumeI.x) && (phase != 2))
        discard;

    float id = float(objectId) / 1024.0;
    outObjectId = vec4(id, 0.0, 0.0, 0.0);
    outNormal = octEncode(vNormal);
}