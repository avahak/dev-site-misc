#include <sCommon>

#include <sGlobalUBO>

uniform vec2 resolution;
uniform int phase; 
uniform int objectId;

in vec4 vPos;
in vec2 vUv;

layout(location = 0) out vec4 outObjectId;

#include <sVolume>


void main() {
    float depth = gl_FragCoord.z;

    vec2 volumeI = volumeInterval();
    if ((depth < volumeI.x) && (phase != 2))
        discard;

    float id = float(objectId) / 1024.0;
    outObjectId = vec4(id, 0.0, 0.0, 0.0);
}