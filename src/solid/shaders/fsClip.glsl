/*
Consider the viewing ray cameraPos+t*v for t>0. The ray intersects the volume at
[tEntry,tExit] or misses it completely. The geometry phase provides tBack (or bObjectId=0)
and tFront (or fObjectId=0). By construction, these are not necessarily a paired entry/exit 
of the same solid mesh segment, and tFront>tBack is possible. 

The camera only sees the intersection of the volume and the solid mesh. Therefore, for any
solid mesh segment S along the viewing ray, the visible point along the ray is the closest hit, 
found via min([tEntry,tExit]\cap S). We separate three cases:

Ray miss) 
    If volume interval does not exist or no back exists, nothing is visible.

Matched pair) 
    If front exists and tFront<tBack, by construction they form a mesh solid segment 
    and tEntry<tFront. We evaluate two subcases:
    - If tExit<tFront: [tEntry,tExit]\cap[tFront,tBack] is empty and nothing is visible.
    - If tExit>tFront: min([tEntry,tExit]\cap[tFront,tBack])=tFront.
      Therefore the camera sees the mesh front at tFront.

Unmatched pair) 
    If front does not exist or tFront>tBack, there exists another frontside 
    front' (and tFront') associated with back. By construction tFront'<tEntry and tBack>tEntry. 
    Thus min([tEntry,tExit]\cap[tFront',tBack])=tEntry.
    Therefore the camera sees the volume entrypoint at tEntry.

NOTE: For simplicity we have not considered cases with equality above.
*/

#include <sCommon>
#include <sSolidTex>

#include <sGlobalUBO>

uniform vec2 resolution;
uniform sampler2D backTex;
uniform sampler2D frontTex;
uniform sampler2D backDepthTex;
uniform sampler2D frontDepthTex;

in vec4 vPos;
in vec2 vUv;

layout(location = 0) out vec4 outColor;

#include <sVolume>


vec3 worldPosition(float depth) {
    vec3 ndc = 2.0*vec3(gl_FragCoord.xy/resolution, depth) - 1.0;
    vec4 ph = invVpMat * vec4(ndc, 1.0);
    return ph.xyz / ph.w;
}

void main() {
    float bDepth = texture(backDepthTex, vUv).r;
    float fDepth = texture(frontDepthTex, vUv).r;

    float bTexColor = texture(backTex, vUv).r;
    float fTexColor = texture(frontTex, vUv).r;
    int bObjectId = int(round(bTexColor * 1024.0));
    int fObjectId = int(round(fTexColor * 1024.0));

    if (bObjectId == 0)
        discard;        // No back => ray miss

    vec2 volumeI = volumeInterval();
    if (volumeI.x == volumeI.y)
        discard;        // No volume intersection => ray miss

    // Z-fighting problem:
    // ep=0 below -> z-fighting when two objects are close to each other
    // ep=1e-5 below -> near edges where |fDepth-bDepth|<ep
    //     we get matchedPair=0 but correct value is 1 -> we jump to pEntry that has 
    //     nothing to do with it -> we use plane z that is completely wrong -> artifacts
    // Fix used: use ep=0 when the objects are the same but ep=1e-5 if they are different:
    float ep = (fObjectId == bObjectId) ? 0.0 : EP;
    int matchedPair = (fObjectId > 0 && fDepth < bDepth-ep) ? 1 : 0;
    if (matchedPair == 1) {
        if (fDepth >= volumeI.y) 
            discard;
        // Now fDepth < volumeI.y so we should render front

        vec3 fp = worldPosition(fDepth);
        vec3 fColor = solid_compound(fp, fObjectId);

        gl_FragDepth = fDepth;
        outColor = vec4(fColor, 0.0);        // encode state in alpha-channel
        return;
    } 

    // Case of unmatched pair: render mesh interior at volumeI.x.
    vec3 pEntry = worldPosition(volumeI.x);
    vec3 color = solid_compound(pEntry, bObjectId);

    gl_FragDepth = volumeI.x;
    outColor = vec4(color, 0.01);        // encode state in alpha-channel
}