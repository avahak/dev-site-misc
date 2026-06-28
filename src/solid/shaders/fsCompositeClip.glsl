// Shadows reference: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js

#include <sCommon>
#include <sPBR>

#include <sGlobalUBO>

#include <sSolidTex>

uniform sampler2D backTex;
uniform sampler2D frontTex;
uniform sampler2D backDepthTex;
uniform sampler2D frontDepthTex;
uniform sampler2D frontNormalTex;

uniform sampler2DShadow shadowMaps[MAX_LIGHTS];

in vec3 vPos;
in vec2 vUv;

layout(location = 0) out vec4 outColor;

#include <sVolume>

struct ClipOut {
    vec3 color;
    float depth;
    int state;      // 0: miss, 1: front, 2: clip
};

vec3 worldPosition(float depth) {
    vec3 ndc = 2.0*vec3(gl_FragCoord.xy/resolution, depth) - 1.0;
    vec4 ph = invVpMat * vec4(ndc, 1.0);
    return ph.xyz / ph.w;
}

ClipOut clip() {
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
    float bDepth = texture(backDepthTex, vUv).r;
    float fDepth = texture(frontDepthTex, vUv).r;

    float bTexColor = texture(backTex, vUv).r;
    float fTexColor = texture(frontTex, vUv).r;
    int bObjectId = int(round(bTexColor * 1024.0));
    int fObjectId = int(round(fTexColor * 1024.0));

    if (bObjectId == 0)
        return ClipOut(vec3(0.0), 0.0, 0);        // No back => ray miss

    vec2 volumeI = volumeInterval(resolution, sphereMain);
    if (volumeI.x == volumeI.y)
        return ClipOut(vec3(0.0), 0.0, 0);        // No volume intersection => ray miss

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

        return ClipOut(fColor, fDepth, 1);
    } 

    // Case of unmatched pair: render mesh interior at volumeI.x.
    vec3 pEntry = worldPosition(volumeI.x);
    vec3 color = solid_compound(pEntry, bObjectId);

    return ClipOut(color, volumeI.x, 2);
}


// Interleaved Gradient Noise for randomizing sampling patterns
// Source: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js
float interleavedGradientNoise(vec2 position) {
    return fract(52.9829189 * fract(dot(position, vec2(0.06711056, 0.00583715))));
}

// Vogel disk sampling for uniform circular distribution
// Source: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js
vec2 vogelDiskSample(int sampleIndex, int samplesCount, float phi) {
    float r = sqrt((float(sampleIndex) + 0.5) / float(samplesCount));
    float theta = float(sampleIndex) * 2.399963229728653 + phi;
    return vec2(cos(theta), sin(theta)) * r;
}


float computeShadowTerm(vec3 worldPos, vec3 normal, int lightIndex, sampler2DShadow shadowMap) {
    // Normal-based bias: larger when surface is nearly parallel to light rays
    // vec3 lightPos = lightPositions[lightIndex];
    // vec3 lightDir = normalize(lightPos - worldPos);
    // float dp = dot(normal, lightDir);
    // float bias = debug2*max(0.01 * (1.0 - dp), 0.001);
    // worldPos += normal*bias;

    vec4 shadowCoord = shadowMatrices[lightIndex] * vec4(worldPos, 1.0);
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z -= 2e-4;     // bias

    float r = lightPos[lightIndex].w / shadowMapSize;

    float phi = interleavedGradientNoise(gl_FragCoord.xy) * TAU;
    float sum = 0.0;
    for (int k = 0; k < 5; k++) {
        vec2 offset = r * vogelDiskSample(k, 5, phi);
        vec3 v = vec3(shadowCoord.xy + offset, shadowCoord.z);
        sum += texture(shadowMap, v);
    }

    return 0.2*sum;
}

float computeShadow(vec3 worldPos, vec3 normal, int k) {
    float term;
    switch (k) {
        case 0: 
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[0]);
            break;
        case 1: 
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[1]);
            break;
        case 2: 
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[2]);
            break;
        case 3: 
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[3]);
            break;
    }
    return term;
}


void computeWeights(out vec3 weights[MAX_LIGHTS], vec3 P, vec3 N, vec3 baseColor, float roughness, float metallic) {
    for (int k = 0; k < MAX_LIGHTS; k++) {
        if (k >= int(round(numLights)))
            break;
        vec3 lPos = lightPos[k].xyz;
        weights[k] = evalDirectLightWeighting(P, N, cameraPos, baseColor, roughness, metallic, lPos);
    }
}

vec3 computeLight(in vec3 weights[MAX_LIGHTS], vec3 P, vec3 N) {
    vec3 color = vec3(0.0);
    for (int k = 0; k < MAX_LIGHTS; k++) {
        if (k >= int(round(numLights)))
            break;

        vec3 lPos = lightPos[k].xyz;
        float lRadius = lightPos[k].w;
        float x = 1.0 + length(P - lPos)/lRadius;

        float shadow = computeShadow(P, N, k);
        vec3 radiance = lightCol[k].xyz * shadow * lightCol[k].w / (x*x);

        color += radiance * weights[k];
    }
    return color;
}


void main() {
    ClipOut clipResult = clip();
    float opaqueDepth = clipResult.depth;
    vec3 opaqueColor = clipResult.color;
    int state = clipResult.state;       // 0: miss, 1: front, 2: clip

    if (state == 0) {
        // miss
        discard;
    }

    vec3 op = worldPosition(opaqueDepth);

    vec3 fNormal = octDecode(texture(frontNormalTex, vUv).xy);
    vec3 normal = (state == 2) ? evalVolumeNormal(op, sphereMain) : fNormal;

    vec3 oWeights[MAX_LIGHTS];
    computeWeights(oWeights, op, normal, opaqueColor, debug2, 0.0);

    vec3 color = computeLight(oWeights, op, normal);

    color = linearToSRGB(ACESFilm(color));
    gl_FragDepth = opaqueDepth;
    outColor = vec4(color, 0.0);

    // For debugging:
    int di = int(round(8.0*debug4));
    switch (di) {
        case 0: 
            outColor = vec4(fNormal*0.5+0.5, 1.0);
            break;
        // case 1: 
        //     float s1 = 2.5+0.1/log(1.0e-9+0.99999*unpackRGBAToDepth(texture(shadowMaps[0], vUv)));
        //     outColor = vec4(s1, s1, s1, 1.0);
        //     break;
        // case 2: 
        //     float s3 = 2.5+0.1/log(1.0e-9+0.99999*texture(shadowMapRegular, vUv).r);
        //     outColor = vec4(s3, s3, s3, 1.0);
        //     break;
        // case 3: 
        //     float s2 = 2.5+0.1/log(1.0e-9+0.99999*texture(shadowMapClip, vUv).r);
        //     outColor = vec4(s2, s2, s2, 1.0);
        //     break;
        case 4: 
            outColor = vec4(state == 0 ? 1.0 : 0.0, state == 1 ? 1.0 : 0.0, state == 2 ? 1.0 : 0.0, 1.0);
            break;
        case 5:
            float err1 = 1000000.0*length(vUv-gl_FragCoord.xy/resolution);
            outColor = vec4(err1, 10.0*err1, 100.0*err1, 1.0);
            break;
        // case 6:
        //     float err2 = 1000.0*abs(unpackRGBAToDepth(texture(shadowMaps[0], vUv)-texture(shadowMapRegular, vUv).r));
        //     outColor = vec4(err2, 10.0*err2, 100.0*err2, 1.0);
        //     break;
    }
}