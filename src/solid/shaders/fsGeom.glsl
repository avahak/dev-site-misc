#include <sCommon>

#include <sGlobalUBO>

uniform int phase; 
uniform int objectId;

in vec4 vPos;
in vec2 vUv;

layout(location = 0) out vec4 outObjectId;

#include <sVolume>


void main() {
    float depth = gl_FragCoord.z;

    if (phase != 2) {
        vec2 volumeI = volumeInterval(resolution, sphereMain);
        if (depth < volumeI.x)
            discard;
    }

    float id = float(objectId) / 1024.0;
    outObjectId = vec4(id, 0.0, 0.0, 0.0);
}