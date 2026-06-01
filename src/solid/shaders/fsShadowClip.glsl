// Same logic as in fsClip.

#include <sCommon>

uniform vec2 resolution;
uniform vec3 cameraPos;
uniform mat4 vpMat;         // view-projection matrix of the main camera
uniform mat4 invVpMat;      // inverse of vpMap
uniform float time;
uniform sampler2D backDepthTex;
uniform sampler2D frontDepthTex;
uniform sampler2D backIdTex;
uniform sampler2D frontIdTex;
uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;

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

        outDummy = vec4(0.0);
        gl_FragDepth = fDepth;
        return;
    } 

    // Case of unmatched pair: render mesh interior at volumeI.x.
    outDummy = vec4(0.0);
    gl_FragDepth = volumeI.x;
    // outDepth = vec4(volumeI.x, 0.0, 0.0, 0.0);
}