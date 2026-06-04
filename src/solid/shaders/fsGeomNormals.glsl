#include <sCommon>

#include <sGlobalUBO>

uniform vec2 resolution;
uniform int phase; 
uniform int objectId;

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