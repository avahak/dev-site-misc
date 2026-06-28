#include <sCommon>

#include <sGlobalUBO>

uniform int phase; 
uniform int objectId;

in vec3 vPos;
in vec2 vUv;
in vec3 vNormal;

layout(location = 0) out vec4 outObjectId;
layout(location = 1) out vec2 outNormal;

#include <sVolume>


void main() {
    vec3 v = vPos;
    float depth = gl_FragCoord.z;

    if (phase != 2) {
        vec2 volumeI = volumeInterval(resolution, sphereMain);
        if (depth < volumeI.x)
            discard;
    }

    float id = float(objectId) / 1024.0;
    outObjectId = vec4(id, 0.0, 0.0, 0.0);
    outNormal = octEncode(vNormal);
}