// Same logic as in fsClip.

#include <sCommon>

#include <sGlobalUBO>

uniform vec2 resolution;
uniform sampler2D backDepthTex;
uniform sampler2D frontDepthTex;
uniform sampler2D backIdTex;
uniform sampler2D frontIdTex;

in vec4 vPos;
in vec2 vUv;

layout(location = 0) out vec4 outDummy;

#include <sVolume>


void main() {
    float bDepth = texture(backDepthTex, vUv).r;
    float fDepth = texture(frontDepthTex, vUv).r;

    int bObjectId = int(round(texture(backIdTex, vUv).r * 1024.0));
    int fObjectId = int(round(texture(frontIdTex, vUv).r * 1024.0));

    if (bObjectId == 0)
        discard;        // No back => ray miss

    vec2 volumeI = volumeInterval();
    if (volumeI.x == volumeI.y)
        discard;        // No volume intersection => ray miss

    float ep = (fObjectId == bObjectId) ? 0.0 : EP;
    int matchedPair = (fObjectId > 0 && fDepth < bDepth-ep) ? 1 : 0;
    if (matchedPair == 1) {
        if (fDepth >= volumeI.y) 
            discard;
        // Now fDepth < volumeI.y so we should render front

        // outDepth = vec4(fDepth, 0.0, 0.0, 0.0);
        outDummy = vec4(0.0);
        gl_FragDepth = fDepth;
        return;
    } 

    // Case of unmatched pair: render mesh interior at volumeI.x.
    // outDepth = vec4(volumeI.x, 0.0, 0.0, 0.0);
    outDummy = vec4(0.0);
    gl_FragDepth = volumeI.x;
}