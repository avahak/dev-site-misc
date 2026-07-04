import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{t as r}from"./Box-CFEfsCq7.js";import{a as i,i as a,r as o,t as s}from"./index-DoWmB566.js";import{A as c,At as l,B as u,C as d,Cr as f,Dr as p,E as m,Er as h,Hr as g,Ht as _,It as ee,Jt as v,K as y,Kn as b,Kt as x,Lr as S,M as C,Mt as w,Nr as te,Nt as ne,Rr as T,Sr as re,Vn as ie,W as E,Xt as ae,Yn as D,_t as O,ar as k,cn as oe,d as se,dr as ce,f as le,h as ue,ir as A,jt as j,kr as M,ln as N,m as de,qt as P,r as fe,u as F,w as pe,zr as I}from"./three.module-BrMVvVOI.js";import{t as L}from"./OrbitControls-CT6IiSB_.js";import{n as me,t as he}from"./MTLLoader-BTFkgZ_R.js";import{t as R}from"./lil-gui.module.min--1wMio4V.js";import{n as z,t as B}from"./font-Bj3W4Yz0.js";var V=e(t(),1),H=`// Shadows reference: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js\r
\r
#include <sCommon>\r
#include <sPBR>\r
\r
#include <sGlobalUBO>\r
\r
#include <sSolidTex>\r
\r
uniform sampler2D backTex;\r
uniform sampler2D frontTex;\r
uniform sampler2D backDepthTex;\r
uniform sampler2D frontDepthTex;\r
uniform sampler2D frontNormalTex;\r
\r
uniform sampler2DShadow shadowMaps[MAX_LIGHTS];\r
\r
in vec3 vPos;\r
in vec2 vUv;\r
\r
layout(location = 0) out vec4 outColor;\r
\r
#include <sVolume>\r
\r
struct ClipOut {\r
    vec3 color;\r
    float depth;\r
    int state;      // 0: miss, 1: front, 2: clip\r
};\r
\r
vec3 worldPosition(float depth) {\r
    vec3 ndc = 2.0*vec3(gl_FragCoord.xy/resolution, depth) - 1.0;\r
    vec4 ph = invVpMat * vec4(ndc, 1.0);\r
    return ph.xyz / ph.w;\r
}\r
\r
ClipOut clip() {\r
    /*\r
    Consider the viewing ray cameraPos+t*v for t>0. The ray intersects the volume at\r
    [tEntry,tExit] or misses it completely. The geometry phase provides tBack (or bObjectId=0)\r
    and tFront (or fObjectId=0). By construction, these are not necessarily a paired entry/exit \r
    of the same solid mesh segment, and tFront>tBack is possible. \r
\r
    The camera only sees the intersection of the volume and the solid mesh. Therefore, for any\r
    solid mesh segment S along the viewing ray, the visible point along the ray is the closest hit, \r
    found via min([tEntry,tExit]\\cap S). We separate three cases:\r
\r
    Ray miss) \r
        If volume interval does not exist or no back exists, nothing is visible.\r
\r
    Matched pair) \r
        If front exists and tFront<tBack, by construction they form a mesh solid segment \r
        and tEntry<tFront. We evaluate two subcases:\r
        - If tExit<tFront: [tEntry,tExit]\\cap[tFront,tBack] is empty and nothing is visible.\r
        - If tExit>tFront: min([tEntry,tExit]\\cap[tFront,tBack])=tFront.\r
        Therefore the camera sees the mesh front at tFront.\r
\r
    Unmatched pair) \r
        If front does not exist or tFront>tBack, there exists another frontside \r
        front' (and tFront') associated with back. By construction tFront'<tEntry and tBack>tEntry. \r
        Thus min([tEntry,tExit]\\cap[tFront',tBack])=tEntry.\r
        Therefore the camera sees the volume entrypoint at tEntry.\r
\r
    NOTE: For simplicity we have not considered cases with equality above.\r
    */\r
    float bDepth = texture(backDepthTex, vUv).r;\r
    float fDepth = texture(frontDepthTex, vUv).r;\r
\r
    float bTexColor = texture(backTex, vUv).r;\r
    float fTexColor = texture(frontTex, vUv).r;\r
    int bObjectId = int(round(bTexColor * 1024.0));\r
    int fObjectId = int(round(fTexColor * 1024.0));\r
\r
    if (bObjectId == 0)\r
        return ClipOut(vec3(0.0), 0.0, 0);        // No back => ray miss\r
\r
    vec2 volumeI = volumeInterval(resolution, sphereMain);\r
    if (volumeI.x == volumeI.y)\r
        return ClipOut(vec3(0.0), 0.0, 0);        // No volume intersection => ray miss\r
\r
    // Z-fighting problem:\r
    // ep=0 below -> z-fighting when two objects are close to each other\r
    // ep=1e-5 below -> near edges where |fDepth-bDepth|<ep\r
    //     we get matchedPair=0 but correct value is 1 -> we jump to pEntry that has \r
    //     nothing to do with it -> we use plane z that is completely wrong -> artifacts\r
    // Fix used: use ep=0 when the objects are the same but ep=1e-5 if they are different:\r
    float ep = (fObjectId == bObjectId) ? 0.0 : EP;\r
    int matchedPair = (fObjectId > 0 && fDepth < bDepth-ep) ? 1 : 0;\r
    if (matchedPair == 1) {\r
        if (fDepth >= volumeI.y) \r
            discard;\r
        // Now fDepth < volumeI.y so we should render front\r
\r
        vec3 fp = worldPosition(fDepth);\r
        vec3 fColor = solid_compound(fp, fObjectId);\r
\r
        return ClipOut(fColor, fDepth, 1);\r
    } \r
\r
    // Case of unmatched pair: render mesh interior at volumeI.x.\r
    vec3 pEntry = worldPosition(volumeI.x);\r
    vec3 color = solid_compound(pEntry, bObjectId);\r
\r
    return ClipOut(color, volumeI.x, 2);\r
}\r
\r
\r
// Interleaved Gradient Noise for randomizing sampling patterns\r
// Source: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js\r
float interleavedGradientNoise(vec2 position) {\r
    return fract(52.9829189 * fract(dot(position, vec2(0.06711056, 0.00583715))));\r
}\r
\r
// Vogel disk sampling for uniform circular distribution\r
// Source: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js\r
vec2 vogelDiskSample(int sampleIndex, int samplesCount, float phi) {\r
    float r = sqrt((float(sampleIndex) + 0.5) / float(samplesCount));\r
    float theta = float(sampleIndex) * 2.399963229728653 + phi;\r
    return vec2(cos(theta), sin(theta)) * r;\r
}\r
\r
\r
float computeShadowTerm(vec3 worldPos, vec3 normal, int lightIndex, sampler2DShadow shadowMap) {\r
    // Normal-based bias: larger when surface is nearly parallel to light rays\r
    // vec3 lightPos = lightPositions[lightIndex];\r
    // vec3 lightDir = normalize(lightPos - worldPos);\r
    // float dp = dot(normal, lightDir);\r
    // float bias = debug2*max(0.01 * (1.0 - dp), 0.001);\r
    // worldPos += normal*bias;\r
\r
    vec4 shadowCoord = shadowMatrices[lightIndex] * vec4(worldPos, 1.0);\r
    shadowCoord.xyz /= shadowCoord.w;\r
    shadowCoord.z -= 2e-4;     // bias\r
\r
    float r = lightPos[lightIndex].w / shadowMapSize;\r
\r
    float phi = interleavedGradientNoise(gl_FragCoord.xy) * TAU;\r
    float sum = 0.0;\r
    for (int k = 0; k < 5; k++) {\r
        vec2 offset = r * vogelDiskSample(k, 5, phi);\r
        vec3 v = vec3(shadowCoord.xy + offset, shadowCoord.z);\r
        sum += texture(shadowMap, v);\r
    }\r
\r
    return 0.2*sum;\r
}\r
\r
float computeShadow(vec3 worldPos, vec3 normal, int k) {\r
    float term;\r
    switch (k) {\r
        case 0: \r
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[0]);\r
            break;\r
        case 1: \r
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[1]);\r
            break;\r
        case 2: \r
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[2]);\r
            break;\r
        case 3: \r
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[3]);\r
            break;\r
    }\r
    return term;\r
}\r
\r
\r
void computeWeights(out vec3 weights[MAX_LIGHTS], vec3 P, vec3 N, vec3 baseColor, float roughness, float metallic) {\r
    for (int k = 0; k < MAX_LIGHTS; k++) {\r
        if (k >= int(round(numLights)))\r
            break;\r
        vec3 lPos = lightPos[k].xyz;\r
        weights[k] = evalDirectLightWeighting(P, N, cameraPos, baseColor, roughness, metallic, lPos);\r
    }\r
}\r
\r
vec3 computeLight(in vec3 weights[MAX_LIGHTS], vec3 P, vec3 N) {\r
    vec3 color = vec3(0.0);\r
    for (int k = 0; k < MAX_LIGHTS; k++) {\r
        if (k >= int(round(numLights)))\r
            break;\r
\r
        vec3 lPos = lightPos[k].xyz;\r
        float lRadius = lightPos[k].w;\r
        float x = 1.0 + length(P - lPos)/lRadius;\r
\r
        float shadow = computeShadow(P, N, k);\r
        vec3 radiance = lightCol[k].xyz * shadow * lightCol[k].w / (x*x);\r
\r
        color += radiance * weights[k];\r
    }\r
    return color;\r
}\r
\r
\r
void main() {\r
    ClipOut clipResult = clip();\r
    float opaqueDepth = clipResult.depth;\r
    vec3 opaqueColor = clipResult.color;\r
    int state = clipResult.state;       // 0: miss, 1: front, 2: clip\r
\r
    if (state == 0) {\r
        // miss\r
        discard;\r
    }\r
\r
    vec3 op = worldPosition(opaqueDepth);\r
\r
    vec3 fNormal = octDecode(texture(frontNormalTex, vUv).xy);\r
    vec3 normal = (state == 2) ? evalVolumeNormal(op, sphereMain) : fNormal;\r
\r
    vec3 oWeights[MAX_LIGHTS];\r
    computeWeights(oWeights, op, normal, opaqueColor, debug2, 0.0);\r
\r
    vec3 color = computeLight(oWeights, op, normal);\r
\r
    color = linearToSRGB(ACESFilm(color));\r
    gl_FragDepth = opaqueDepth;\r
    outColor = vec4(color, 0.0);\r
\r
    // For debugging:\r
    int di = int(round(8.0*debug4));\r
    switch (di) {\r
        case 0: \r
            outColor = vec4(fNormal*0.5+0.5, 1.0);\r
            break;\r
        // case 1: \r
        //     float s1 = 2.5+0.1/log(1.0e-9+0.99999*unpackRGBAToDepth(texture(shadowMaps[0], vUv)));\r
        //     outColor = vec4(s1, s1, s1, 1.0);\r
        //     break;\r
        // case 2: \r
        //     float s3 = 2.5+0.1/log(1.0e-9+0.99999*texture(shadowMapRegular, vUv).r);\r
        //     outColor = vec4(s3, s3, s3, 1.0);\r
        //     break;\r
        // case 3: \r
        //     float s2 = 2.5+0.1/log(1.0e-9+0.99999*texture(shadowMapClip, vUv).r);\r
        //     outColor = vec4(s2, s2, s2, 1.0);\r
        //     break;\r
        case 4: \r
            outColor = vec4(state == 0 ? 1.0 : 0.0, state == 1 ? 1.0 : 0.0, state == 2 ? 1.0 : 0.0, 1.0);\r
            break;\r
        case 5:\r
            float err1 = 1000000.0*length(vUv-gl_FragCoord.xy/resolution);\r
            outColor = vec4(err1, 10.0*err1, 100.0*err1, 1.0);\r
            break;\r
        // case 6:\r
        //     float err2 = 1000.0*abs(unpackRGBAToDepth(texture(shadowMaps[0], vUv)-texture(shadowMapRegular, vUv).r));\r
        //     outColor = vec4(err2, 10.0*err2, 100.0*err2, 1.0);\r
        //     break;\r
    }\r
}`,ge=`// Shadows reference: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js\r
\r
#include <sCommon>\r
#include <sPBR>\r
\r
#include <sGlobalUBO>\r
\r
#include <sSolidTex>\r
\r
uniform sampler2D frontTex;\r
uniform sampler2D frontDepthTex;\r
uniform sampler2D frontNormalTex;\r
\r
uniform sampler2DShadow shadowMaps[MAX_LIGHTS];\r
\r
in vec3 vPos;\r
in vec2 vUv;\r
\r
layout(location = 0) out vec4 outColor;\r
\r
\r
vec3 worldPosition(float depth) {\r
    vec3 ndc = 2.0*vec3(gl_FragCoord.xy/resolution, depth) - 1.0;\r
    vec4 ph = invVpMat * vec4(ndc, 1.0);\r
    return ph.xyz / ph.w;\r
}\r
\r
\r
// Interleaved Gradient Noise for randomizing sampling patterns\r
// Source: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js\r
float interleavedGradientNoise(vec2 position) {\r
    return fract(52.9829189 * fract(dot(position, vec2(0.06711056, 0.00583715))));\r
}\r
\r
// Vogel disk sampling for uniform circular distribution\r
// Source: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js\r
vec2 vogelDiskSample(int sampleIndex, int samplesCount, float phi) {\r
    float r = sqrt((float(sampleIndex) + 0.5) / float(samplesCount));\r
    float theta = float(sampleIndex) * 2.399963229728653 + phi;\r
    return vec2(cos(theta), sin(theta)) * r;\r
}\r
\r
\r
float computeShadowTerm(vec3 worldPos, vec3 normal, int lightIndex, sampler2DShadow shadowMap) {\r
    // Normal-based bias: larger when surface is nearly parallel to light rays\r
    // vec3 lightPos = lightPositions[lightIndex];\r
    // vec3 lightDir = normalize(lightPos - worldPos);\r
    // float dp = dot(normal, lightDir);\r
    // float bias = debug2*max(0.01 * (1.0 - dp), 0.001);\r
    // worldPos += normal*bias;\r
\r
    vec4 shadowCoord = shadowMatrices[lightIndex] * vec4(worldPos, 1.0);\r
    shadowCoord.xyz /= shadowCoord.w;\r
    shadowCoord.z -= 2e-4;     // bias\r
\r
    float r = lightPos[lightIndex].w / shadowMapSize;\r
\r
    float phi = interleavedGradientNoise(gl_FragCoord.xy) * TAU;\r
    float sum = 0.0;\r
    for (int k = 0; k < 5; k++) {\r
        vec2 offset = r * vogelDiskSample(k, 5, phi);\r
        vec3 v = vec3(shadowCoord.xy + offset, shadowCoord.z);\r
        sum += texture(shadowMap, v);\r
    }\r
\r
    return 0.2*sum;\r
}\r
\r
float computeShadow(vec3 worldPos, vec3 normal, int k) {\r
    float term;\r
    switch (k) {\r
        case 0: \r
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[0]);\r
            break;\r
        case 1: \r
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[1]);\r
            break;\r
        case 2: \r
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[2]);\r
            break;\r
        case 3: \r
            term = computeShadowTerm(worldPos, normal, k, shadowMaps[3]);\r
            break;\r
    }\r
    return term;\r
}\r
\r
\r
void computeWeights(out vec3 weights[MAX_LIGHTS], vec3 P, vec3 N, vec3 baseColor, float roughness, float metallic) {\r
    for (int k = 0; k < MAX_LIGHTS; k++) {\r
        if (k >= int(round(numLights)))\r
            break;\r
        vec3 lPos = lightPos[k].xyz;\r
        weights[k] = evalDirectLightWeighting(P, N, cameraPos, baseColor, roughness, metallic, lPos);\r
    }\r
}\r
\r
vec3 computeLight(in vec3 weights[MAX_LIGHTS], vec3 P, vec3 N) {\r
    vec3 color = vec3(0.0);\r
    for (int k = 0; k < MAX_LIGHTS; k++) {\r
        if (k >= int(round(numLights)))\r
            break;\r
\r
        vec3 lPos = lightPos[k].xyz;\r
        float lRadius = lightPos[k].w;\r
        float x = 1.0 + length(P - lPos)/lRadius;\r
\r
        float shadow = computeShadow(P, N, k);\r
        vec3 radiance = lightCol[k].xyz * shadow * lightCol[k].w / (x*x);\r
\r
        color += radiance * weights[k];\r
    }\r
    return color;\r
}\r
\r
\r
void main() {\r
    float opaqueDepth = texture(frontDepthTex, vUv).r;\r
    float fTexColor = texture(frontTex, vUv).r;\r
    int fObjectId = int(round(fTexColor * 1024.0));\r
\r
    if (fObjectId == 0) {\r
        // miss\r
        discard;\r
    }\r
\r
    vec3 op = worldPosition(opaqueDepth);\r
    vec3 opaqueColor = solid_compound(op, fObjectId);\r
\r
    vec3 normal = octDecode(texture(frontNormalTex, vUv).xy);\r
\r
    vec3 oWeights[MAX_LIGHTS];\r
    computeWeights(oWeights, op, normal, opaqueColor, debug2, 0.0);\r
\r
    vec3 color = computeLight(oWeights, op, normal);\r
\r
    color = linearToSRGB(ACESFilm(color));\r
    gl_FragDepth = opaqueDepth;\r
    outColor = vec4(color, 0.0);\r
}`,_e=`#include <sCommon>\r
#include <sGlobalUBO>\r
\r
uniform sampler2D clipColorTex;\r
uniform sampler2D clipDepthTex;\r
uniform sampler2D regularColorTex;\r
uniform sampler2D regularDepthTex;\r
\r
in vec3 vPos;\r
in vec2 vUv;\r
in vec3 vNormal;\r
\r
layout(location = 0) out vec4 outColor;\r
\r
\r
void main() {\r
    vec4 c1 = texture(clipColorTex, vUv);\r
    float d1 = texture(clipDepthTex, vUv).r;\r
    vec4 c2 = texture(regularColorTex, vUv);\r
    float d2 = texture(regularDepthTex, vUv).r;\r
\r
    vec4 col = c1;\r
    if ((d2 < d1) || (c1.a == 0.0))     // c1.a=0 means color came from front/clip, not overlay\r
        col = mix(c1, c2, debug3);\r
\r
    outColor = vec4(col.rgb, 1.0);\r
}`,ve=`#include <sCommon>\r
\r
#include <sGlobalUBO>\r
\r
uniform int phase; \r
uniform int objectId;\r
\r
in vec3 vPos;\r
in vec2 vUv;\r
\r
layout(location = 0) out vec4 outObjectId;\r
\r
#include <sVolume>\r
\r
\r
void main() {\r
    float depth = gl_FragCoord.z;\r
\r
    if (phase != 2) {\r
        vec2 volumeI = volumeInterval(resolution, sphereMain);\r
        if (depth < volumeI.x)\r
            discard;\r
    }\r
\r
    float id = float(objectId) / 1024.0;\r
    outObjectId = vec4(id, 0.0, 0.0, 0.0);\r
}`,ye=`#include <sCommon>\r
\r
#include <sGlobalUBO>\r
\r
uniform int phase; \r
uniform int objectId;\r
\r
in vec3 vPos;\r
in vec2 vUv;\r
in vec3 vNormal;\r
\r
layout(location = 0) out vec4 outObjectId;\r
layout(location = 1) out vec2 outNormal;\r
\r
#include <sVolume>\r
\r
\r
void main() {\r
    vec3 v = vPos;\r
    float depth = gl_FragCoord.z;\r
\r
    if (phase != 2) {\r
        vec2 volumeI = volumeInterval(resolution, sphereMain);\r
        if (depth < volumeI.x)\r
            discard;\r
    }\r
\r
    float id = float(objectId) / 1024.0;\r
    outObjectId = vec4(id, 0.0, 0.0, 0.0);\r
    outNormal = octEncode(vNormal);\r
}`,be=`// Same logic as in non-shadow side.\r
\r
#include <sCommon>\r
\r
#include <sGlobalUBO>\r
\r
uniform sampler2D backDepthTex;\r
uniform sampler2D frontDepthTex;\r
uniform sampler2D backIdTex;\r
uniform sampler2D frontIdTex;\r
uniform int lightIndex;\r
\r
in vec3 vPos;\r
in vec2 vUv;\r
\r
layout(location = 0) out vec4 outDummy;\r
\r
#include <sVolume>\r
\r
\r
void main() {\r
    float bDepth = texture(backDepthTex, vUv).r;\r
    float fDepth = texture(frontDepthTex, vUv).r;\r
\r
    int bObjectId = int(round(texture(backIdTex, vUv).r * 1024.0));\r
    int fObjectId = int(round(texture(frontIdTex, vUv).r * 1024.0));\r
\r
    if (bObjectId == 0)\r
        discard;        // No back => ray miss\r
\r
    vec2 volumeI = volumeInterval(vec2(shadowMapSize), shadowSpheres[lightIndex]);\r
    if (volumeI.x == volumeI.y)\r
        discard;        // No volume intersection => ray miss\r
\r
    float ep = (fObjectId == bObjectId) ? 0.0 : EP;\r
    int matchedPair = (fObjectId > 0 && fDepth < bDepth-ep) ? 1 : 0;\r
    if (matchedPair == 1) {\r
        if (fDepth >= volumeI.y) \r
            discard;\r
        // Now fDepth < volumeI.y so we should render front\r
\r
        // outDepth = vec4(fDepth, 0.0, 0.0, 0.0);\r
        outDummy = vec4(0.0);\r
        gl_FragDepth = fDepth;\r
        return;\r
    } \r
\r
    // Case of unmatched pair: render mesh interior at volumeI.x.\r
    // outDepth = vec4(volumeI.x, 0.0, 0.0, 0.0);\r
    outDummy = vec4(0.0);\r
    gl_FragDepth = volumeI.x;\r
}`,U=`#include <sCommon>\r
\r
#include <sGlobalUBO>\r
\r
uniform int objectId;\r
uniform int lightIndex;\r
\r
in vec3 vPos;\r
in vec2 vUv;\r
\r
layout(location = 0) out vec4 outDepth;\r
layout(location = 1) out vec4 outObjectId;\r
\r
#include <sVolume>\r
\r
\r
void main() {\r
    float depth = gl_FragCoord.z;\r
\r
    vec2 volumeI = volumeInterval(vec2(shadowMapSize), shadowSpheres[lightIndex]);\r
    if (depth < volumeI.x)\r
        discard;\r
\r
    float id = float(objectId) / 1024.0;\r
    outDepth = vec4(depth, 0.0, 0.0, 0.0);\r
    outObjectId = vec4(id, 0.0, 0.0, 0.0);\r
}`,xe=`in vec3 vPos;\r
\r
layout(location = 0) out vec4 outDummy;\r
\r
void main() {\r
    outDummy = vec4(0.0);\r
}`,Se=`/**\r
 * Source for hash-functions below:\r
 * uint-shader-hash, David Hoskins (MMqd), \r
 * https://github.com/MMqd/uint-shader-hash\r
 *\r
 * Source for simplex noise: \r
 * Noise for GLSL 1.20, Copyright (C) 2011 Ashima Arts. \r
 * (MIT license https://github.com/stegu/webgl-noise/blob/master/LICENSE)\r
 * https://github.com/stegu/webgl-noise \r
 */\r
\r
precision highp float;\r
\r
const float PI = 3.1415926535898;\r
const float TAU = 6.28318530718;\r
const float SQRT2 = 1.4142135623731;\r
\r
const int MAX_LIGHTS = 4;\r
const float EP = 1.0e-5;\r
\r
\r
vec2 octEncode(vec3 n) {\r
    // Encodes unit vec3 vector to vec2\r
    n /= (abs(n.x) + abs(n.y) + abs(n.z));\r
    vec2 p = n.xy;\r
    if (n.z < 0.0) {\r
        vec2 signP = step(0.0, p) * 2.0 - 1.0;\r
        p = (1.0 - abs(p.yx)) * signP;\r
    }\r
    return p * 0.5 + 0.5;\r
}\r
\r
vec3 octDecode(vec2 e) {\r
    // Decoder for octEncode, recovers the original unit vector\r
    vec2 p = e * 2.0 - 1.0;\r
    vec3 n = vec3(p, 1.0 - abs(p.x) - abs(p.y));\r
    if (n.z < 0.0) {\r
        vec2 signP = step(0.0, n.xy) * 2.0 - 1.0;\r
        n.xy = (1.0 - abs(n.yx)) * signP;\r
    }\r
    return normalize(n);\r
}\r
\r
// From uint-shader-hash:\r
\r
\r
const uint MAGIC_NUMBERS[7] = uint[7](\r
    0x21f0aaadu, 0x7feb352du, 0x846ca68bu,\r
    0xd168aaadu, 0xaf723597u, 0x9e485565u, 0xef1d6b47u\r
);\r
\r
highp uint fixZero(highp float f) {\r
    return floatBitsToUint(f + uintBitsToFloat(0x00800000u));\r
}\r
\r
highp uint hashUint(highp uint h, highp uint magic) {\r
    h++; h ^= h >> 16u; h *= magic; return h;\r
}\r
\r
highp float uintTo01Float(highp uint h) {\r
    return uintBitsToFloat((h >> 9u) | floatBitsToUint(1.0)) - 1.0;\r
}\r
\r
vec2 uvec2To01Vec2(uvec2 h) {\r
    return vec2(uintTo01Float(h.x), uintTo01Float(h.y));\r
}\r
\r
vec3 uvec3To01Vec3(uvec3 h) {\r
    return vec3(uintTo01Float(h.x), uintTo01Float(h.y), uintTo01Float(h.z));\r
}\r
\r
vec4 uvec4To01Vec4(uvec4 h) {\r
    return vec4(uintTo01Float(h.x), uintTo01Float(h.y), uintTo01Float(h.z), uintTo01Float(h.w));\r
}\r
\r
uvec2 uintHashVec2ToVec2(highp vec2 f) {\r
    uint fx = fixZero(f.x), fy = fixZero(f.y);\r
    highp uint h = 2u;\r
    h = hashUint(h + fx, MAGIC_NUMBERS[0]);\r
    h = hashUint(h + fy, MAGIC_NUMBERS[1]);\r
    return uvec2(\r
        hashUint(h, MAGIC_NUMBERS[0]),\r
        hashUint(h, MAGIC_NUMBERS[1])\r
    );\r
}\r
\r
uvec3 uintHashVec3ToVec3(highp vec3 f) {\r
    uint fx = fixZero(f.x), fy = fixZero(f.y), fz = fixZero(f.z);\r
    highp uint h = 3u;\r
    h = hashUint(h + fx, MAGIC_NUMBERS[0]);\r
    h = hashUint(h + fy, MAGIC_NUMBERS[1]);\r
    h = hashUint(h + fz, MAGIC_NUMBERS[2]);\r
    return uvec3(\r
        hashUint(h, MAGIC_NUMBERS[0]),\r
        hashUint(h, MAGIC_NUMBERS[1]),\r
        hashUint(h, MAGIC_NUMBERS[2])\r
    );\r
}\r
\r
uvec4 uintHashVec4ToVec4(highp vec4 f) {\r
    uint fx = fixZero(f.x), fy = fixZero(f.y), fz = fixZero(f.z), fw = fixZero(f.w);\r
    highp uint h = 4u;\r
    h = hashUint(h + fx, MAGIC_NUMBERS[0]);\r
    h = hashUint(h + fy, MAGIC_NUMBERS[1]);\r
    h = hashUint(h + fz, MAGIC_NUMBERS[2]);\r
    h = hashUint(h + fw, MAGIC_NUMBERS[3]);\r
    return uvec4(\r
        hashUint(h, MAGIC_NUMBERS[0]),\r
        hashUint(h, MAGIC_NUMBERS[1]),\r
        hashUint(h, MAGIC_NUMBERS[2]),\r
        hashUint(h, MAGIC_NUMBERS[3])\r
    );\r
}\r
\r
float hash(highp float f) {\r
    highp uint fx = fixZero(f);\r
    highp uint h = 1u; \r
    h = hashUint(h + fx, MAGIC_NUMBERS[0]);\r
    return uintTo01Float(h);\r
}\r
\r
vec2 hash22(highp vec2 f) {\r
    return uvec2To01Vec2(uintHashVec2ToVec2(f));\r
}\r
\r
vec3 hash33(highp vec3 f) {\r
    return uvec3To01Vec3(uintHashVec3ToVec3(f));\r
}\r
\r
vec4 hash44(highp vec4 f) {\r
    return uvec4To01Vec4(uintHashVec4ToVec4(f));\r
}\r
\r
\r
// From webgl-noise:\r
\r
\r
vec3 mod289(vec3 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec2 mod289(vec2 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec4 mod289(vec4 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec3 permute(vec3 x) {\r
    return mod289(((x*34.0)+10.0)*x);\r
}\r
\r
vec4 permute(vec4 x) {\r
    return mod289(((x*34.0)+10.0)*x);\r
}\r
\r
vec4 taylorInvSqrt(vec4 r) {\r
    return 1.79284291400159 - 0.85373472095314 * r;\r
}\r
\r
float snoise(vec2 v) {\r
    const vec4 C = vec4(0.211324865405187,      // (3.0-sqrt(3.0))/6.0\r
                        0.366025403784439,      // 0.5*(sqrt(3.0)-1.0)\r
                        -0.577350269189626,     // -1.0 + 2.0 * C.x\r
                        0.024390243902439);     // 1.0 / 41.0\r
    // First corner\r
    vec2 i  = floor(v + dot(v, C.yy) );\r
    vec2 x0 = v -   i + dot(i, C.xx);\r
\r
    // Other corners\r
    vec2 i1;\r
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\r
    //i1.y = 1.0 - i1.x;\r
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\r
    // x0 = x0 - 0.0 + 0.0 * C.xx ;\r
    // x1 = x0 - i1 + 1.0 * C.xx ;\r
    // x2 = x0 - 1.0 + 2.0 * C.xx ;\r
    vec4 x12 = x0.xyxy + C.xxzz;\r
    x12.xy -= i1;\r
\r
    // Permutations\r
    i = mod289(i); // Avoid truncation effects in permutation\r
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\r
            + i.x + vec3(0.0, i1.x, 1.0 ));\r
\r
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\r
    m = m*m ;\r
    m = m*m ;\r
\r
    // Gradients: 41 points uniformly over a line, mapped onto a diamond.\r
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\r
\r
    vec3 x = 2.0 * fract(p * C.www) - 1.0;\r
    vec3 h = abs(x) - 0.5;\r
    vec3 ox = floor(x + 0.5);\r
    vec3 a0 = x - ox;\r
\r
    // Normalise gradients implicitly by scaling m\r
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );\r
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\r
\r
    // Compute final noise value at P\r
    vec3 g;\r
    g.x  = a0.x  * x0.x  + h.x  * x0.y;\r
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;\r
    return 130.0 * dot(m, g);\r
}\r
\r
float snoise(vec3 v) { \r
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\r
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\r
\r
    // First corner\r
    vec3 i  = floor(v + dot(v, C.yyy) );\r
    vec3 x0 =   v - i + dot(i, C.xxx) ;\r
\r
    // Other corners\r
    vec3 g = step(x0.yzx, x0.xyz);\r
    vec3 l = 1.0 - g;\r
    vec3 i1 = min( g.xyz, l.zxy );\r
    vec3 i2 = max( g.xyz, l.zxy );\r
\r
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;\r
    //   x1 = x0 - i1  + 1.0 * C.xxx;\r
    //   x2 = x0 - i2  + 2.0 * C.xxx;\r
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;\r
    vec3 x1 = x0 - i1 + C.xxx;\r
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\r
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\r
\r
    // Permutations\r
    i = mod289(i); \r
    vec4 p = permute( permute( permute( \r
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\r
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \r
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\r
\r
    // Gradients: 7x7 points over a square, mapped onto an octahedron.\r
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\r
    float n_ = 0.142857142857; // 1.0/7.0\r
    vec3  ns = n_ * D.wyz - D.xzx;\r
\r
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\r
\r
    vec4 x_ = floor(j * ns.z);\r
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\r
\r
    vec4 x = x_ *ns.x + ns.yyyy;\r
    vec4 y = y_ *ns.x + ns.yyyy;\r
    vec4 h = 1.0 - abs(x) - abs(y);\r
\r
    vec4 b0 = vec4( x.xy, y.xy );\r
    vec4 b1 = vec4( x.zw, y.zw );\r
\r
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\r
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\r
    vec4 s0 = floor(b0)*2.0 + 1.0;\r
    vec4 s1 = floor(b1)*2.0 + 1.0;\r
    vec4 sh = -step(h, vec4(0.0));\r
\r
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\r
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\r
\r
    vec3 p0 = vec3(a0.xy,h.x);\r
    vec3 p1 = vec3(a0.zw,h.y);\r
    vec3 p2 = vec3(a1.xy,h.z);\r
    vec3 p3 = vec3(a1.zw,h.w);\r
\r
    //Normalise gradients\r
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\r
    p0 *= norm.x;\r
    p1 *= norm.y;\r
    p2 *= norm.z;\r
    p3 *= norm.w;\r
\r
    // Mix final noise value\r
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\r
    m = m * m;\r
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \r
                                    dot(p2,x2), dot(p3,x3) ) );\r
}\r
\r
// End of code from webgl-noise.\r
\r
// Value noise\r
vec3 vnoise33(vec3 p) {\r
    vec3 i = floor(p);\r
    vec3 f = fract(p);\r
\r
    vec3 c000 = hash33(i);\r
    vec3 c001 = hash33(i + vec3(0,0,1));\r
    vec3 c010 = hash33(i + vec3(0,1,0));\r
    vec3 c011 = hash33(i + vec3(0,1,1));\r
    vec3 c100 = hash33(i + vec3(1,0,0));\r
    vec3 c101 = hash33(i + vec3(1,0,1));\r
    vec3 c110 = hash33(i + vec3(1,1,0));\r
    vec3 c111 = hash33(i + vec3(1,1,1));\r
\r
    // vec3 u = f * f * (3.0 - 2.0 * f);\r
    vec3 u = f*f*f*(f*(f*6.0 - 15.0) + 10.0);\r
\r
    vec3 cx00 = mix(c000, c100, u.x);\r
    vec3 cx01 = mix(c001, c101, u.x);\r
    vec3 cx10 = mix(c010, c110, u.x);\r
    vec3 cx11 = mix(c011, c111, u.x);\r
\r
    vec3 cxy0 = mix(cx00, cx10, u.y);\r
    vec3 cxy1 = mix(cx01, cx11, u.y);\r
\r
    return mix(cxy0, cxy1, u.z);\r
}\r
\r
// Fractional Brownian Noise based on value noise\r
vec3 fbm33(vec3 p, float H) {\r
    const int OCTAVES = 6;\r
    float G = exp2(-H);\r
    float f = 1.0;\r
    float a = 1.0;\r
    vec3 sum = vec3(0.0);\r
    vec3 q = p;\r
\r
    for (int k = 0; k < OCTAVES; k++) {\r
        sum += a * vnoise33(q * f);\r
        q = 2.0*q + vec3(37.1, 61.7, 12.4);\r
        f *= 2.0;\r
        a *= G;\r
    }\r
    return sum;\r
}`,Ce=`uniform globalUBO {\r
    vec2 resolution;\r
    vec3 cameraPos;\r
    vec4 cameraParams;      // (near,far,_,_)\r
    mat4 vpMat;\r
    mat4 invVpMat;\r
    float time;\r
    mat4 sphereMain;\r
    float debug1;\r
    float debug2;\r
    float debug3;\r
    float debug4;\r
\r
    float numLights;\r
    vec4 lightPos[MAX_LIGHTS];      // (pos(x,y,z), radius)\r
    vec4 lightCol[MAX_LIGHTS];      // (col(r,g,b), intensity)\r
    float shadowMapSize;\r
    vec4 shadowCameraParams[MAX_LIGHTS];      // (near,far,_,_)\r
    mat4 shadowMatrices[MAX_LIGHTS];\r
    mat4 shadowSpheres[MAX_LIGHTS];\r
};`,we=`vec3 linearToSRGB(vec3 x) {\r
    bvec3 cutoff = lessThanEqual(x, vec3(0.0031308));\r
    vec3 lower = x * 12.92;\r
    vec3 higher = 1.055 * pow(x, vec3(1.0 / 2.4)) - 0.055;\r
    return mix(higher, lower, cutoff);\r
}\r
\r
vec3 sRGBToLinear(vec3 x) {\r
    bvec3 cutoff = lessThanEqual(x, vec3(0.04045));\r
    vec3 lower = x / 12.92;\r
    vec3 higher = pow((x + 0.055) / 1.055, vec3(2.4));\r
    return mix(higher, lower, cutoff);\r
}\r
\r
\r
// ACES Filmic Tone Mapping (HDR -> LDR)\r
vec3 ACESFilm(vec3 x) {\r
    vec3 v = (x*(2.51*x + 0.03)) / (x*(2.43*x + 0.59) + 0.14);\r
    return clamp(v, 0.0, 1.0);\r
}\r
\r
\r
// Schlick Fresnel approximation. Approximates angle-dependent reflectance.\r
vec3 fresnelSchlick(float cosTheta, vec3 F0) {\r
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);\r
}\r
\r
// GGX / Trowbridge-Reitz Normal Distribution Function. Controls microfacet orientation distribution.\r
float distributionGGX(float NdotH, float roughness) {\r
    float a = roughness * roughness;\r
    float a2 = a * a;\r
    float denom = (NdotH * NdotH) * (a2 - 1.0) + 1.0;\r
    return a2 / (PI * denom * denom);\r
}\r
\r
// Schlick-GGX Geometry term. Approximates masking and shadowing of microfacets.\r
float geometrySchlickGGX(float NdotV, float roughness) {\r
    float r = roughness + 1.0;\r
    float k = (r * r) / 8.0;\r
    return NdotV / (NdotV * (1.0 - k) + k);\r
}\r
\r
// Smith geometry term. Combines masking/shadowing for view and light directions.\r
float geometrySmith(float NdotV, float NdotL, float roughness) {\r
    float ggxV = geometrySchlickGGX(NdotV, roughness);\r
    float ggxL = geometrySchlickGGX(NdotL, roughness);\r
    return ggxV * ggxL;\r
}\r
\r
vec3 evalDirectLightWeighting(\r
    vec3 P, vec3 N, vec3 camPos, \r
    vec3 baseColor, float roughness, float metallic, \r
    vec3 lightPos\r
) {\r
    // P is world position\r
    // N is world normal (normalized)\r
    // V is view direction (towards camera)\r
\r
    vec3 lightDir = normalize(lightPos - P);   // direction from point to light\r
    vec3 V = normalize(camPos - P);\r
\r
    vec3 L = normalize(lightDir);\r
    vec3 H = normalize(V + L);\r
\r
    float NdotL = max(dot(N, L), 0.0);\r
    float NdotV = max(dot(N, V), 0.0);\r
    float NdotH = max(dot(N, H), 0.0);\r
    float VdotH = max(dot(V, H), 0.0);\r
\r
    if (NdotL <= 0.0 || NdotV <= 0.0)\r
        return vec3(0.0);\r
        \r
    vec3 F0 = mix(vec3(0.04), baseColor, metallic);\r
\r
    // Fresnel\r
    vec3 F = fresnelSchlick(VdotH, F0);\r
    // GGX microfacet terms\r
    float D = distributionGGX(NdotH, roughness);\r
    float G = geometrySmith(NdotV, NdotL, roughness);\r
\r
    // Cook-Torrance microfacet BRDF\r
    vec3 specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);\r
\r
    vec3 kS = F;\r
    vec3 kD = (1.0 - kS) * (1.0 - metallic);\r
    vec3 diffuse = kD * baseColor / PI;     // Lambert diffuse BRDF\r
    vec3 brdf = diffuse + specular;\r
    return brdf * NdotL;\r
    // Final color = evalDirectLightWeighting(...) * radiance, where\r
    // radiance = lightColor * lightIntensity * shadow\r
}`,Te=`// Surface from f=0 with quadratic equation f(v) = v\\cdot Av + B\\cdot v + C\r
\r
// Sphere of radius r>0 that has outward pointing normal n\\in\\S^2 at p\\in\\R^3:\r
// (center) c=p-rn, A=I, B=-2c, C=|c|^2-r^2\r
\r
// To find (1-t)p+tq on the sphere, we write d=q-p and the quadratic equation becomes\r
// at^2+bt+c0=0, where a=d\\cdot d, b=2d\\cdot (p-c), c0=|p-c|^2-r^2.\r
// Solutions exist if D=b^2-4ac>=0. Then the solutions are t=\\pm (-b\\pm\\sqrt{D})/(2a).\r
\r
// Sphere constants contain (sphere center x,y,z,r) and camera related parameters.\r
\r
float evalVolumeField(vec3 p, mat4 sphere) {\r
    // Negative value means inside\r
    // |p-c|^2-r^2\r
    vec3 v = p - sphere[0].xyz;\r
    return dot(v, v) - sphere[0].w*sphere[0].w;\r
}\r
\r
vec3 evalVolumeNormal(vec3 p, mat4 sphere) {\r
    // Normal for the volume on the boundary\r
    vec3 v = p - sphere[0].xyz;\r
    return normalize(v);\r
}\r
\r
vec2 volumeInterval(vec2 res, mat4 sphere) {\r
    // Returns (-,+ solution) depths (in window space z).\r
    vec2 ndcXy = 2.0*gl_FragCoord.xy/res - 1.0;\r
    vec3 dir = sphere[1].xyz * vec3(ndcXy, 1.0);\r
    vec3 v = sphere[3].xyz;\r
\r
    float a = dot(dir, dir);\r
    float b = 2.0*dot(dir, v);\r
    float c = dot(v, v) - sphere[0].w*sphere[0].w;\r
    float discr = b*b - 4.0*a*c;\r
    if (discr <= 0.0)\r
        return vec2(0.0);   // no solutions\r
    float sd = sqrt(discr);\r
    vec2 ts = vec2(-b-sd, -b+sd) / (2.0*a);\r
\r
    vec2 zs = sphere[2].x + sphere[2].y / ts;\r
\r
    float tNear = sphere[3].w;\r
    return vec2(ts.x > tNear ? zs.x : 0.0, ts.y > tNear ? zs.y : 0.0);\r
}\r
\r
// vec2 _volumeInterval() {\r
//     // Returns (-,+ solution) depths (in window space z).\r
//     vec2 ndcXy = 2.0*gl_FragCoord.xy/resolution - 1.0;\r
//     vec4 ph = invVpMat * vec4(ndcXy, 0.0, 1.0);\r
//     vec3 wp = ph.xyz / ph.w;\r
\r
//     vec3 dir = wp - cameraPos;\r
//     vec3 v = cameraPos - sphere.xyz;\r
//     float a = dot(dir, dir);\r
//     float b = 2.0*dot(dir, v);\r
//     float c = dot(v, v) - sphere.w*sphere.w;\r
//     float discr = b*b - 4.0*a*c;\r
//     if (discr <= 0.0)\r
//         return vec2(0.0);   // no solutions\r
//     // Picking negative sign corresponding to entering the sphere\r
//     float tMinus = (-b - sqrt(discr)) / (2.0*a);\r
//     float tPlus = (-b + sqrt(discr)) / (2.0*a);\r
//     vec4 iwpMinus = vec4(cameraPos + tMinus*dir, 1.0);\r
//     vec4 iwpPlus = vec4(cameraPos + tPlus*dir, 1.0);\r
//     vec4 clipMinus = vpMat * iwpMinus;\r
//     vec4 clipPlus = vpMat * iwpPlus;\r
//     vec3 ndcMinus = clipMinus.xyz / clipMinus.w;\r
//     vec3 ndcPlus = clipPlus.xyz / clipPlus.w;\r
//     float zMinus = ndcMinus.z * 0.5 + 0.5;\r
//     float zPlus = ndcPlus.z * 0.5 + 0.5;\r
//     return vec2(tMinus > 0.0 ? zMinus : 0.0, tPlus > 0.0 ? zPlus : 0.0);    // TODO FIX with camera.near\r
// }`,Ee=`#include <sCommon>\r
#include <sExtensions>\r
\r
uniform vec2 size;\r
\r
uniform float time;\r
\r
in vec3 vPos;\r
\r
layout(location = 0) out vec4 outColor;\r
\r
#include <sWood>\r
\r
\r
vec3 herringtonParquet(vec2 p, float w, float h) {\r
    // Computes Herrington parquet tiling for the given position and size of tiles.\r
    // Returns vec3(x,y,seed), where \r
    // - (x,y) is location within the tile\r
    // - seed is float in [0,1] that is unique for each tile. \r
    //   seed < 0.5 for vertical tiles and seed > 0.5 for horizontal tiles.\r
\r
    vec2 A = vec2(h, -h);\r
    vec2 B = vec2(w);\r
\r
    float iu = floor((p.x - p.y) / (2.0*h));\r
    float iv = floor((p.x + p.y) / (2.0*w));\r
    p = p - iu*A - iv*B;\r
    // Now p is localized and there are only a few possible tiles it can belong to.\r
\r
    // Check if p is in first horizontal line of tiles:\r
    float i = floor(p.x / h);\r
    vec2 q = p - i*A;\r
    if (q.y >= 0.0 && q.y <= w)\r
        return vec3(q.y, h - q.x, 0.51 + 0.49*hash(round(iu+i) + round(iv)*PI));\r
\r
    // Check if p is in second vertical line of tiles:\r
    i = floor((p.y - w) / h);\r
    q = p + i*A;\r
    if (q.x >= 0.0 && q.x <= w)\r
        return vec3(q.x, q.y - w, 0.49*hash(round(iu-i) + round(iv)*PI));\r
\r
    // Check if p is in first vertical line of tiles:\r
    i = floor(p.y / h);\r
    q = p + i*A;\r
    // if (q.x >= -w && q.x <= 0.0)     // Should always be true barring floating point issues\r
    return vec3(q.x + w, q.y, 0.49*hash(round(iu-i) + round(iv-1.0)*PI));\r
}\r
\r
\r
void main() {\r
    vec3 p = vPos;\r
\r
    vec3 hp = herringtonParquet(p.xy, size.x, size.y);\r
\r
    float hw = 5.0 * hash(1.0 + hp.z);\r
    float rw = 1.2 + 0.4 * hash(2.0 + hp.z);    // avoid heartwood\r
    float aw = TAU * hash(3.0 + hp.z);\r
    vec3 pPlank = vec3(rw*cos(aw)+hp.y-0.5*size.y, rw*sin(aw)+p.z, hw+hp.x);\r
\r
    outColor = wood(pPlank);\r
    // outColor = vec4(vec3(hp.z), 1.0);\r
    // outColor = vec4(hp.x/w, hp.y/h, hp.z, 1.0);\r
}`,De=`#include <sCommon>\r
#include <sExtensions>\r
\r
uniform vec3 size;\r
uniform int numLayers;\r
\r
uniform float time;\r
\r
in vec3 vPos;\r
\r
layout(location = 0) out vec4 outColor;\r
\r
#include <sTrunkPeel>\r
#include <sWood>\r
\r
\r
void main() {\r
    vec3 p = vPos;\r
\r
    float width = size.x;\r
    float depth = size.z / float(numLayers);        // depth of one layer\r
    int layer = clamp(int(floor(p.z/depth)), 0, numLayers-1);\r
    p.z = p.z - float(layer)*depth;      // p.z is now depth within its layer\r
    if (layer%2 == 0) {\r
        // Cross-graining: 90 degree rotation for every other layer\r
        p.xy = vec2(p.y, size.y-p.x);\r
    }\r
    if (layer > numLayers/2) {\r
        // Flip sheets so that tight side of each sheet faces the nearest border (top/bottom).\r
        // The tight side (opposite to loose side) is the outer-radius side of the veneer \r
        // that was compressed when it was straightened.\r
        // In the spiral geometry larger z corresponds to smaller r, i.e. loose side.\r
        p = vec3(p.x, size.y-p.y, depth-p.z);\r
    }\r
\r
    p.x = p.x + 50.0;       // Move from center a bit, TODO what is the best way to handle this?\r
    vec3 pTrunk = spiralGeometry(p, 0.0, depth);\r
\r
    outColor = wood(pTrunk);\r
}`,Oe=`#include <sCommon>\r
#include <sExtensions>\r
\r
uniform vec3 cameraPos;\r
uniform vec2 cameraNearFar;\r
uniform mat4 vMat;\r
uniform mat4 pvMat;\r
uniform mat4 pvMatInv;\r
\r
uniform vec2 resolution;\r
uniform float time;\r
\r
uniform vec4 clipPlane; // (dirX,dirY,dirY,offset), dir is unit length, points in half-space are vec3 p with dot(p,clipPlane.xyz)>=clipPlane.w\r
\r
in vec4 vPos;\r
\r
layout(location = 0) out vec4 outColor;\r
\r
#include <sWood>\r
\r
\r
\r
float worldToDepth(vec3 worldPos) {\r
    vec4 clipPos = pvMat * vec4(worldPos, 1.0);\r
    return (clipPos.z / clipPos.w) * 0.5 + 0.5;\r
}\r
\r
vec3 depthToWorldPosition(float depth) {\r
    vec2 uv = gl_FragCoord.xy / resolution;\r
    vec4 ndc = vec4(uv*2.0 - 1.0, depth*2.0 - 1.0, 1.0);\r
    vec4 worldPos = pvMatInv * ndc;\r
    return worldPos.xyz / worldPos.w;\r
}\r
\r
vec2 cubeClip(float r) {\r
    vec3 rd0 = depthToWorldPosition(1.0) - cameraPos;   // Using far-plane is better for accuracy\r
    float tFar = length(rd0);\r
    float tNear = cameraNearFar.x / cameraNearFar.y * tFar;\r
    vec3 rd = rd0 / tFar;\r
\r
    // Avoid division by zero\r
    vec3 safeRd = vec3(\r
        rd.x == 0.0 ? 1e-6 : rd.x,\r
        rd.y == 0.0 ? 1e-6 : rd.y,\r
        rd.z == 0.0 ? 1e-6 : rd.z\r
    );\r
    vec3 invDir = 1.0 / safeRd;\r
    \r
    vec3 t0 = (vec3(-r) - cameraPos) * invDir;\r
    vec3 t1 = (vec3(r) - cameraPos) * invDir;\r
    \r
    vec3 tMin3 = min(t0, t1);\r
    vec3 tMax3 = max(t0, t1);\r
    \r
    float tMin = max(max(tMin3.x, tMin3.y), tMin3.z);\r
    float tMax = min(min(tMax3.x, tMax3.y), tMax3.z);\r
    \r
    if (tMax <= tNear || tMin >= tMax)\r
        return vec2(0.0);       // Ray miss\r
    \r
    float tStart = max(tNear, tMin);\r
    float tEnd = tMax;\r
    \r
    return vec2(worldToDepth(cameraPos + rd*tStart), worldToDepth(cameraPos + rd*tEnd));\r
}\r
\r
vec2 ballClip(float r) {\r
    vec3 rd0 = depthToWorldPosition(1.0) - cameraPos;   // Using far-plane is better for accuracy\r
    float tFar = length(rd0);\r
    float tNear = cameraNearFar.x / cameraNearFar.y * tFar;\r
    vec3 rd = rd0 / tFar;\r
\r
    float b = dot(cameraPos, rd);\r
    float c = dot(cameraPos, cameraPos) - r*r;\r
    float h = b*b - c;\r
    \r
    if (h <= 0.0)\r
        return vec2(0.0);       // Ray miss\r
    \r
    float sqrtH = sqrt(h);\r
    float tMin = -b - sqrtH;\r
    float tMax = -b + sqrtH;\r
    \r
    // The sphere is entirely behind the camera near plane\r
    if (tMax <= tNear)\r
        return vec2(0.0);\r
    \r
    // Clamp tMin to tNear if the camera near plane is inside the sphere\r
    float tStart = max(tNear, tMin);\r
    float tEnd = tMax;\r
    \r
    return vec2(worldToDepth(cameraPos + rd*tStart), worldToDepth(cameraPos + rd*tEnd));\r
}\r
\r
vec2 cylinderClip(float r) {\r
    vec3 rd0 = depthToWorldPosition(1.0) - cameraPos;   // Using far-plane is better for accuracy\r
    float tFar = length(rd0);\r
    float tNear = cameraNearFar.x / cameraNearFar.y * tFar;\r
    vec3 rd = rd0 / tFar;\r
\r
    vec3 cylinderDir = normalize(vec3(0.0, 1.0, 0.0));\r
    float cylinderLength = 2.0*r;\r
    float cylinderRadius = r;\r
\r
    float halfL = cylinderLength * 0.5;\r
    \r
    // Project ray and camera position onto the cylinder axis orientation\r
    float dv = dot(rd, cylinderDir);\r
    float ov = dot(cameraPos, cylinderDir);\r
    \r
    // Infinite tube intersection coefficients (at^2 + 2bt + c = 0)\r
    float a = 1.0 - dv * dv;\r
    float b = dot(cameraPos, rd) - ov * dv;\r
    float c = dot(cameraPos, cameraPos) - ov * ov - cylinderRadius * cylinderRadius;\r
    \r
    float tTubeMin = -1e30;\r
    float tTubeMax = 1e30;\r
    \r
    // Handle infinite tube intersection if the ray is not parallel to the axis\r
    if (a > 1e-6) {\r
        float h = b * b - a * c;\r
        if (h <= 0.0)\r
            return vec2(0.0);   // Ray miss (misses the infinite tube)\r
        \r
        float sqrtH = sqrt(h);\r
        tTubeMin = (-b - sqrtH) / a;\r
        tTubeMax = (-b + sqrtH) / a;\r
    } else {\r
        // Ray is parallel to the axis; check if it is within the tube radius\r
        float distSq = dot(cameraPos, cameraPos) - ov * ov;\r
        if (distSq > cylinderRadius * cylinderRadius)\r
            return vec2(0.0);   // Ray miss (parallel and outside tube)\r
    }\r
    \r
    // Finite caps (slab) intersection\r
    float tSlabMin = -1e30;\r
    float tSlabMax = 1e30;\r
    if (abs(dv) > 1e-6) {\r
        float t0 = (-halfL - ov) / dv;\r
        float t1 = (halfL - ov) / dv;\r
        tSlabMin = min(t0, t1);\r
        tSlabMax = max(t0, t1);\r
    } else if (abs(ov) > halfL) {\r
        return vec2(0.0);       // Ray miss (parallel and outside caps)\r
    }\r
    \r
    // Overlap the tube interval and the cap slab interval\r
    float tMin = max(tTubeMin, tSlabMin);\r
    float tMax = min(tTubeMax, tSlabMax);\r
    \r
    if (tMin > tMax)\r
        return vec2(0.0);       // Ray miss (intervals do not overlap)\r
    \r
    // The cylinder is entirely behind the camera near plane\r
    if (tMax <= tNear)\r
        return vec2(0.0);\r
    \r
    // Clamp tMin to tNear if the camera near plane is inside the cylinder\r
    float tStart = max(tNear, tMin);\r
    float tEnd = tMax;\r
    \r
    return vec2(worldToDepth(cameraPos + rd * tStart), worldToDepth(cameraPos + rd * tEnd));\r
}\r
\r
vec2 clipPlaneIntersect(vec2 interval) {\r
    if (interval.x == interval.y)\r
        return vec2(0.0);\r
\r
    // Convert start and end depths to world positions\r
    vec3 p1 = depthToWorldPosition(interval.x);\r
    vec3 p2 = depthToWorldPosition(interval.y);\r
\r
    // Evaluate the half-space condition: dot(p, dir) - offset\r
    // Negative means inside the half-space, positive means outside\r
    float v1 = dot(p1, clipPlane.xyz) - clipPlane.w;\r
    float v2 = dot(p2, clipPlane.xyz) - clipPlane.w;\r
\r
    // Case 1: Both points are inside the half-space (no clipping needed)\r
    if (v1 <= 0.0 && v2 <= 0.0)\r
        return interval;\r
\r
    // Case 2: Both points are outside the half-space (entire segment is clipped)\r
    if (v1 >= 0.0 && v2 >= 0.0)\r
        return vec2(0.0);\r
\r
    // Case 3: The ray segment crosses the boundary plane.\r
    vec3 pIntersect = mix(p1, p2, v1 / (v1 - v2));\r
    float depthIntersect = worldToDepth(pIntersect);\r
\r
    if (v1 <= 0.0)\r
        return vec2(interval.x, depthIntersect);    // Segment starts inside, but exits outside.\r
    else\r
        return vec2(depthIntersect, interval.y);    // Segment starts outside, but enters inside.\r
}\r
\r
vec3 testSolid(vec3 p) {\r
    vec3 q = 2.0 * p;\r
    return 0.5*fbm33(q, 1.5);\r
    // return 0.5 + 0.5*vec3(snoise(q), snoise(q+vec3(1000.0)), snoise(q+vec3(-1000.0)));\r
}\r
\r
void main() {\r
    // vec2 interval = ballClip(1.0);\r
    vec2 interval = cubeClip(1.0);\r
    // vec2 interval = cylinderClip(1.0);\r
\r
    interval = clipPlaneIntersect(interval);\r
    if (interval.x == interval.y)\r
        discard;\r
    vec3 pStart = depthToWorldPosition(interval.x);\r
    vec3 pEnd = depthToWorldPosition(interval.y);\r
    \r
    outColor = vec4(wood(pStart).rgb, 1.0);\r
    // outColor = vec4(testSolid(pStart), 1.0);\r
\r
    // vec3 c = 0.5 + 0.5*texture(noiseTexture, 0.5*pStart).rab;\r
    // outColor = vec4(c, 1.0);\r
\r
    // float r = length(pStart.xz);\r
    // vec2 v = vec2(r < 1.0 ? 0.5*r : 0.5 + mod(r-0.5, 0.5), 0.5);\r
    // vec3 col = texture(profileTexture, v).rgb;\r
    // outColor = vec4(col, 1.0);\r
}`,ke=`#include <sCommon>\r
#include <sExtensions>\r
\r
uniform float phase;\r
uniform vec3 size;      // (w,h,d)\r
uniform float gap;\r
\r
uniform float time;\r
\r
in vec3 vPos;\r
in float part;\r
\r
layout(location = 0) out vec4 outColor;\r
\r
#include <sWood>\r
#include <sTrunkPeel>\r
\r
\r
void main() {\r
    float phase0 = max(PI * size.z / 2.0, phase);\r
    vec3 p = vPos;\r
\r
    vec3 pTrunk;\r
\r
    if (part < 0.5) {\r
        // uncut part\r
        float r = spiralRadius(phase0, 0.0, 0.0, size.z);\r
        float angle = spiralAngle(size.x, 0.0, size.z) - spiralAngle(phase0, 0.0, size.z);\r
        p.z = r - p.z;\r
        pTrunk = vec3(p.x*cos(angle)-p.z*sin(angle), p.z*cos(angle)+p.x*sin(angle), p.y);\r
    }\r
    else {\r
        // cut part\r
        pTrunk = peelGeometry(vec3(p.x+phase0, p.yz), size.x, 0.0, size.z) \r
               - peelGeometry(vec3(0.0), size.x, 0.0, size.z);\r
    }\r
\r
    outColor = wood(pTrunk);\r
}`,Ae=`// See sWood.glsl\r
\r
#include <sCommon>\r
#include <sExtensions>\r
\r
uniform vec2 resolution;\r
\r
const int MAX_WOOD_TYPES = 4;\r
const int MAX_BRANCHES = 1024;\r
\r
layout(std140) uniform branchUBO {\r
    vec4 zRanges[MAX_WOOD_TYPES];               // (start,end,length,-) for each wood type\r
    vec4 branchIndices[MAX_WOOD_TYPES];         // (start,end,length,-) for each wood type\r
    vec4 knotColors[MAX_WOOD_TYPES];\r
    \r
    vec4 branchesZASD[MAX_BRANCHES];\r
    vec4 branchesR[MAX_BRANCHES];\r
};\r
\r
in vec3 vPos;\r
\r
layout(location = 0) out vec4 outIndices;\r
layout(location = 1) out vec4 outValues;\r
\r
\r
struct MinInfo {\r
    ivec4 indices;\r
    vec4 values;\r
};\r
\r
struct BranchState {\r
    float tb;\r
    float delta;\r
    float death;\r
    float beta;\r
\r
    float isAlive;\r
};\r
\r
\r
// vec3 closestRayPoint(vec3 p, vec3 base, vec3 dir){\r
//     // Returns closest point on ray { base+t*dir: t>=0 } to p\r
//     float t = max(0.0, dot(p - base, dir));\r
//     vec3 cp = base + t*dir;\r
//     return cp;\r
// }\r
// float pointRayDistance(vec3 p, vec3 base, vec3 dir){\r
//     // Returns dist(p, { base+t*dir: t>=0 })\r
//     float t = max(0.0, dot(p - base, dir));\r
//     vec3 cp = base + t*dir;\r
//     return length(p - cp);\r
// }\r
\r
float sminPow(float a, float b, float k) {\r
    // Power smooth minumim, see: https://iquilezles.org/articles/smin/\r
    a = pow(a, k);\r
    b = pow(b, k);\r
    return pow((a*b)/(a+b), 1.0/k);\r
}\r
\r
\r
vec2 getPith(float z) {\r
    return 0.05*vnoise33(3.0*vec3(0.0, 0.0, z)).xy;\r
}\r
\r
// This should match between setup and lookup\r
BranchState computeBranchState(vec3 p, float r, float phi, float z, float ts, int index, int woodTypeIndex) {\r
    float z0 = branchesZASD[index].x;\r
    vec2 dir = branchesZASD[index].yz;\r
    float death = branchesZASD[index].w;\r
    float br = branchesR[index].x;\r
\r
    vec3 start = vec3(getPith(z0), z0);\r
    vec2 dirXY = vec2(cos(dir.x), sin(dir.x));\r
\r
    // branchP is the "pseudo-closest" point to p on the branch skeleton \r
    float branchZ = dir.y*(r < 1.0 ? r - 0.5*r*r : 0.5);\r
    vec3 branchP = start + vec3(r*dirXY, branchZ);\r
\r
    float zRange = zRanges[woodTypeIndex].z;\r
    vec3 diff = p - branchP;\r
    diff.z -= zRange * round(diff.z / zRange);        // for z-tiling\r
    float dBranch = length(diff);\r
    float beta = atan(diff.z, dot(diff.xy, vec2(-dirXY.y, dirXY.x)));\r
    float rBranch = br - 0.1*sqrt(r) + 0.01*snoise(1.0*vec3(cos(beta), sin(beta), r));\r
\r
    float tb = dBranch / rBranch;\r
\r
    float tDelta = ts - tb;\r
    float k = 1.75*tDelta/(0.3+abs(tDelta)) + 3.25;\r
    // NOTE x/(a+abs(x)) is C^1, ->-1 at -\\infty, ->1 at \\infty, derivative at 0 is 1/a.\r
\r
    float t = sminPow(ts, tb, k);\r
    float delta = t - min(ts, tb);\r
\r
    // Death\r
    float isAlive = 1.0;\r
    if (t > death) {\r
        isAlive = 0.0;\r
        float tDead = abs(ts - death);\r
        tb += tDead;\r
\r
        float kDeath = k + 5.0*tDead;\r
        float t = sminPow(ts, tb, kDeath);\r
        float tempDelta = t - min(ts, tb);\r
\r
        float s = 8.0*tDead - 1.0;\r
        float f = 0.35 - 0.85*s/(0.3+abs(s));\r
        delta = f*tempDelta;\r
    }\r
\r
    return BranchState(tb, delta, death, beta, isAlive);\r
}\r
\r
float computeRatio(float phi, float z, int index, int woodTypeIndex) {\r
    float bestRatio = 1e38;\r
\r
    const int RN = 10;\r
    for (int rk = 1; rk < RN; rk++) {\r
        float r = float(rk) / float(RN);\r
        vec2 pith = getPith(z);\r
        vec3 p = vec3(pith + r*vec2(cos(phi), sin(phi)), z);\r
        float rStem = (4.0 + 0.5*snoise(1.0*vec3(normalize(p.xy-pith), p.z))) / 3.0;\r
        float ts = r / rStem;\r
\r
        BranchState bs = computeBranchState(p, r, phi, z, ts, index, woodTypeIndex);\r
\r
        float ratio = bs.tb / ts;\r
        bestRatio = min(ratio, bestRatio);\r
    }\r
    return bestRatio;\r
}\r
\r
\r
MinInfo computeMinValues(float phi, float z, int woodTypeIndex) {\r
    const int M = 4;\r
    float minValues[M];\r
    int minIndices[M];\r
    for (int i = 0; i < M; i++) {\r
        minValues[i] = 3e38; \r
        minIndices[i] = -1;\r
    }\r
\r
    ivec4 bIndices = ivec4(round(branchIndices[woodTypeIndex]));\r
    for (int i0 = 0; i0 < MAX_BRANCHES; i0++) {\r
        if (i0 >= bIndices.z)\r
            break;\r
        int i = bIndices.x + i0;\r
\r
        float val = computeRatio(phi, z, i, woodTypeIndex);\r
\r
        for (int j = M - 1; j >= 0; j--) {\r
            if (val < minValues[j]) {\r
                if (j < M - 1) {\r
                    minValues[j + 1] = minValues[j];\r
                    minIndices[j + 1] = minIndices[j];\r
                }\r
                minValues[j] = val;\r
                minIndices[j] = i;\r
            } else\r
                break;\r
        }\r
    }\r
\r
    MinInfo result;\r
    result.indices = ivec4(minIndices[0], minIndices[1], minIndices[2], minIndices[3]);\r
    result.values = vec4(minValues[0], minValues[1], minValues[2], minValues[3]);\r
    return result;\r
}\r
\r
void main() {\r
    // - Transform pixel gl_FragCoord.xy/resolution to (phi,z)\r
    // - Loop over r\\in(0,1] to get p=(r,phi,z), ts\r
    // - Loop over branches and compute tb for each branch\r
    // - Store index to smallest tb/ts\r
    // - Write out color from index\r
\r
    vec2 xy = gl_FragCoord.xy / resolution;\r
\r
    float zRangeTotal = zRanges[MAX_WOOD_TYPES-1].y;\r
\r
    // Determine which wood type section we are in:\r
    int woodTypeIndex = 0;\r
    for (int k = 0; k < MAX_WOOD_TYPES; k++)\r
        if (zRanges[k].x / zRangeTotal < xy.y)\r
            woodTypeIndex = k;\r
\r
    float phi = TAU * xy.x;\r
    float z = xy.y*zRangeTotal - zRanges[woodTypeIndex].x;\r
\r
    MinInfo minInfo = computeMinValues(phi, z, woodTypeIndex);\r
\r
    // vec3 h = hash33(vec3(float(index)));\r
    // outColor = vec4(h, 1.0);\r
    outIndices = vec4(minInfo.indices) / float(MAX_BRANCHES);\r
    outValues = minInfo.values;\r
}`,je=`#ifdef USE_DEBUG\r
    uniform vec4 debug1;\r
    uniform vec4 debug2;\r
    uniform int debugMode;\r
#endif\r
\r
\r
#ifdef USE_NOISE\r
    uniform sampler3D noiseTexture;\r
#endif\r
\r
\r
#ifdef USE_WOOD\r
    const int MAX_WOOD_TYPES = 4;\r
    const int MAX_BRANCHES = 1024;\r
    \r
    uniform sampler2D branchIndexTex;\r
    uniform sampler2D profileTexture;\r
    uniform int woodTypeIndex;\r
\r
    layout(std140) uniform branchUBO {\r
        vec4 zRanges[MAX_WOOD_TYPES];               // (start,end,length,-) for each wood type\r
        vec4 branchIndices[MAX_WOOD_TYPES];         // (start,end,length,-) for each wood type\r
        vec4 knotColors[MAX_WOOD_TYPES];\r
        \r
        vec4 branchesZASD[MAX_BRANCHES];\r
        vec4 branchesR[MAX_BRANCHES];\r
    };\r
#endif`,Me=`// Code for placeholder solid textures, mostly AI generated\r
\r
\r
/**\r
 * Solid base texture: returns a color from one of 10 hard-edged patterns.\r
 * All patterns have a characteristic feature scale of roughly 1 unit.\r
 */\r
vec3 solid_base(vec3 p, int pattern) {\r
    // Pattern 0: 3D checkerboard, cells of size 1, red vs blue\r
    if (pattern == 0) {\r
        vec3 cell = floor(p);\r
        float mask = mod(cell.x + cell.y + cell.z, 2.0);\r
        return mask < 0.5 ? vec3(1.0, 0.2, 0.2) : vec3(0.2, 0.4, 1.0);\r
    }\r
    // Pattern 1: X‑axis stripes, period 1, yellow vs green\r
    if (pattern == 1) {\r
        float stripe = step(0.0, sin(p.x * TAU));\r
        return mix(vec3(0.9, 0.9, 0.1), vec3(0.1, 0.8, 0.1), stripe);\r
    }\r
    // Pattern 2: Diagonal bands along (1,1,1) with spacing 1, hue from band id\r
    if (pattern == 2) {\r
        float id = floor(dot(p, normalize(vec3(1.0, 1.0, 1.0))));\r
        float hue = fract(id * 0.142857 + 0.3);\r
        return 0.5 + 0.5 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));\r
    }\r
    // Pattern 3: Each unit cube gets a random solid color\r
    if (pattern == 3) {\r
        vec3 cell = floor(p);\r
        vec3 h = hash33(cell);\r
        float hue = h.x;\r
        float bright = 0.7 + 0.3 * h.y;\r
        vec3 col = 0.5 + 0.5 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));\r
        return col * bright;\r
    }\r
    // Pattern 4: FBM noise thresholded into 4 colour bands\r
    if (pattern == 4) {\r
        float n = (fbm33(p, 1.0).x + 1.0) * 0.5; // roughly 0..1\r
        if (n < 0.25) return vec3(1.0, 0.0, 1.0); // magenta\r
        if (n < 0.5)  return vec3(0.0, 1.0, 1.0); // cyan\r
        if (n < 0.75) return vec3(1.0, 1.0, 0.0); // yellow\r
        return vec3(1.0, 0.5, 0.0);               // orange\r
    }\r
    // Pattern 5: Spherical shells, radius step = 1, alternating green and purple\r
    if (pattern == 5) {\r
        float r = length(p);\r
        float shell = floor(r);\r
        float mask = mod(shell, 2.0);\r
        return mask < 0.5 ? vec3(0.2, 0.9, 0.4) : vec3(0.9, 0.3, 0.9);\r
    }\r
    // Pattern 6: Voronoi-like cells (shifted grid), each cell a random color\r
    if (pattern == 6) {\r
        vec3 cell = floor(p + 0.5);\r
        vec3 h = hash33(cell);\r
        float hue = h.x;\r
        float bright = 0.6 + 0.4 * h.y;\r
        vec3 col = 0.5 + 0.5 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));\r
        return col * bright;\r
    }\r
    // Pattern 7: Value noise quantized into 6 discrete colours\r
    if (pattern == 7) {\r
        float val = vnoise33(p).x;\r
        if (val < 0.2)      return vec3(0.8, 0.0, 0.0);\r
        else if (val < 0.4) return vec3(0.0, 0.8, 0.0);\r
        else if (val < 0.6) return vec3(0.0, 0.0, 0.8);\r
        else if (val < 0.8) return vec3(0.8, 0.8, 0.0);\r
        else                return vec3(0.8, 0.4, 0.0);\r
    }\r
    // Pattern 8: Sine product egg‑crate, period 1, black vs yellow\r
    if (pattern == 8) {\r
        float s = sin(p.x * TAU) * sin(p.y * TAU) * sin(p.z * TAU);\r
        float band = step(0.0, s);\r
        return band < 0.5 ? vec3(0.1, 0.1, 0.1) : vec3(0.9, 0.9, 0.0);\r
    }\r
    // Pattern 9: Turbulent marble with sharp threshold, orange vs blue\r
    // (fallback / default)\r
    float n = fbm33(p, 1.2).x;\r
    n = abs(n);\r
    n = fract(n * 4.0);\r
    float band = step(0.5, n);\r
    return band < 0.5 ? vec3(0.95, 0.4, 0.1) : vec3(0.1, 0.5, 0.95);\r
}\r
\r
/**\r
 * Compound solid texture: combines three base patterns in a patchwork,\r
 * with a dimmed FBM underlay that adds variation at all scales.\r
 *\r
 * - The space is divided into cubic cells of size 3.\r
 * - Each cell randomly selects one of three base patterns, giving sharp boundaries.\r
 * - A low‑amplitude FBM is added everywhere; its hue depends on \`pattern\`.\r
 * - The three base patterns are chosen from \`pattern\` using:\r
 *   a = pattern % 10, b = (pattern + 3) % 10, c = (pattern + 7) % 10.\r
 */\r
vec3 solid_compound(vec3 p, int pattern) {\r
    p = 5.0*p + vec3(TAU/SQRT2);  // trying to avoid pattern changes exactly at mesh boundaries\r
    // Cell size for the patchwork – large enough to make each texture region visible\r
    const float cellSize = 3.0;\r
\r
    // Three base pattern indices derived from the compound pattern number\r
    int a = pattern % 10;\r
    int b = (pattern + 3) % 10;\r
    int c = (pattern + 7) % 10;\r
\r
    // Which base pattern to use for this cell\r
    ivec3 cell = ivec3(floor(p / cellSize));\r
    float sel = hash33(vec3(cell)).x;\r
    int chosen;\r
    if (sel < 0.333)      chosen = a;\r
    else if (sel < 0.666) chosen = b;\r
    else                  chosen = c;\r
\r
    // Evaluate the selected base pattern\r
    vec3 col = solid_base(p, chosen);\r
\r
    // Dimmed FBM overlay with hue varying per compound pattern\r
    float fbm_val = fbm33(p * 1.0, 0.7).x * 0.42;\r
    float fbm_hue = fract(float(pattern) * 0.1618033);\r
    vec3 fbm_color = 0.5 + 0.5 * cos(TAU * (fbm_hue + vec3(0.0, 0.33, 0.67)));\r
\r
    // Mix the FBM variation into the solid base colour\r
    col = clamp(col + fbm_color * fbm_val, 0.0, 1.0);\r
\r
    return col;\r
}`,Ne=`// Functions for peeling a cylinder into a long sheet. \r
\r
\r
float sheetThickness(float x, float g, float d) {\r
    // Thickness profile of the sheet. The sheet thickness is tapered for small x \r
    // so that the spiral maps the sheet perfectly to the cylinder core without spill or gaps.\r
\r
    float wedgeLength = PI * (d + 2.0*g) / 2.0;\r
    if (x < wedgeLength)\r
        return d * sqrt(x / wedgeLength);\r
    return d;\r
}\r
\r
\r
float spiralAngle(float x, float g, float d) {\r
    // Winding angle for the Archimedean spiral.\r
    // Derived from the arc-length formula of an Archimedean spiral.\r
\r
    float wedgeLength = PI * (d + 2.0*g) / 2.0;\r
\r
    if (x < wedgeLength)\r
        return TAU * sqrt(x / wedgeLength);\r
\r
    float a = PI*d / (d + g);\r
    float b = TAU * (2.0*x - PI*d) / (d + g);\r
    return a + sqrt(a*a + b);\r
}\r
\r
\r
float spiralAngleInverse(float angle, float g, float d) {\r
    // Inverse to spiralAngle\r
\r
    if (angle < TAU)\r
        return (d + 2.0*g) / (4.0 * TAU) * angle*angle;\r
    return (((d + g) / TAU)*angle*angle - d*angle + PI*d) / 2.0;\r
}\r
\r
\r
float spiralRadius(float x, float z, float g, float d) {\r
    // Distance from the cylinder center for the Archimedean spiral.\r
\r
    return spiralAngle(x, g, d) * (d + g) / TAU - z;\r
}\r
\r
\r
vec3 spiralGeometry(vec3 p, float g, float d) {\r
    // Geometry for just a spiral inside the trunk\r
\r
    p.x = max(0.0, p.x);\r
    float theta = spiralAngle(p.x, g, d);\r
    float r = spiralRadius(p.x, p.z, g, d);\r
    float Z = r*cos(theta);\r
    float X = r*sin(theta);\r
    return vec3(X, -Z, p.y);\r
}\r
\r
\r
vec3 peelGeometry(vec3 p, float peelFront, float g, float d) {\r
    // Maps sheet coordinates into a partially peeled cylinder.\r
    // Material with x < peelFront remains wrapped in a spiral.\r
    // Material with x > peelFront is already peeled flat.\r
    // The wrapped region is represented by a Archimedean spiral with a wedge-shaped core. \r
    // The peeled region is represented by the original flat sheet translated so that the \r
    // peel front lies at x=0.\r
\r
    // Arguments: p: position, peelFront: x for transition, g: gap, d: max thickness.\r
\r
    // NOTE: there can be slight interpenetration between the spiral part (x < peelFront) and \r
    //       the flat part (x > peelFront) but for thin sheets this is practically a non-issue.\r
    //       Fixing this would be nontrivial.\r
\r
    // Clamp z so that (x,y,z) is in thickness adjusted box\r
    p.x = max(0.0, p.x);\r
    p.z = clamp(p.z, 0.0, sheetThickness(p.x, g, d));\r
\r
    if (p.x >= peelFront)\r
        return vec3(p.x-peelFront, -p.z, p.y);       // flat part\r
\r
    // Now x < peelFront: spiral\r
    // TODO check if we should do clamping for peelFront as well?\r
    float theta = spiralAngle(p.x, g, d) - spiralAngle(peelFront, g, d);\r
    float r = spiralRadius(p.x, p.z, g, d);\r
    float zOffset = spiralRadius(peelFront, 0.0, g, d);\r
    float Z = zOffset - r*cos(theta);\r
    float X = r*sin(theta);      // translated so that X=0 for x=peelFront\r
    return vec3(X, -Z, p.y);\r
}`,Pe=`// Based on https://dl.acm.org/doi/10.1145/3528223.3530081, see also\r
// https://www.youtube.com/watch?v=mMvoTtipJac https://www.shadertoy.com/view/fsyyzt\r
// and https://github.com/marialarsson/procedural_knots\r
\r
// See https://www.reddit.com/r/woodworking/comments/1u9m1d1/heard_yall_like_grain/\r
\r
const float INFLUENCE_LOW = 7.0;\r
const float INFLUENCE_HIGH = 8.5;\r
\r
struct BranchState {\r
    float tb;\r
    float delta;\r
    float death;\r
    float beta;\r
\r
    float isAlive;\r
\r
    float oldT;        // For DEBUG\r
};\r
\r
// vec3 closestRayPoint(vec3 p, vec3 base, vec3 dir){\r
//     // Returns closest point on ray { base+t*dir: t>=0 } to p\r
//     float t = max(0.0, dot(p - base, dir));\r
//     vec3 cp = base + t*dir;\r
//     return cp;\r
// }\r
// float pointRayDistance(vec3 p, vec3 base, vec3 dir){\r
//     // Returns dist(p, { base+t*dir: t>=0 })\r
//     float t = max(0.0, dot(p - base, dir));\r
//     vec3 cp = base + t*dir;\r
//     return length(p - cp);\r
// }\r
\r
float bump(float x1, float x2, float y1, float y2, float t) {\r
    float s1 = smoothstep(x1, x2, t);\r
    float s2 = smoothstep(y1, y2, t);\r
    return s1 * (1.0-s2);\r
}\r
\r
float sminPow(float a, float b, float k) {\r
    // Power smooth minimum, see: https://iquilezles.org/articles/smin/\r
    a = pow(a, k);\r
    b = pow(b, k);\r
    return pow((a*b) / (a+b), 1.0 / k);\r
}\r
\r
float sminPow4(vec4 A, float k) {\r
    vec4 Ak = pow(A, vec4(k));\r
    vec4 prod3s = Ak.yzwx * Ak.zwxy * Ak.wxyz;\r
    float prod4 = Ak.x * prod3s.x;\r
    float sum = dot(prod3s, vec4(1.0));\r
    return pow(prod4 / sum, 1.0 / k);\r
}\r
\r
vec2 getPith(float z) {\r
    return 0.05*vnoise33(3.0*vec3(0.0, 0.0, z)).xy;\r
}\r
\r
// This should match between setup and lookup\r
BranchState computeBranchState(vec3 p, float r, float phi, float z, float ts, int index) {\r
    float z0 = branchesZASD[index].x;\r
    vec2 dir = branchesZASD[index].yz;\r
    float death = branchesZASD[index].w;\r
    float br = branchesR[index].x;\r
\r
    vec3 start = vec3(getPith(z0), z0);\r
    vec2 dirXY = vec2(cos(dir.x), sin(dir.x));\r
\r
    // branchP is the "pseudo-closest" point to p on the branch skeleton \r
    float branchZ = dir.y*(r < 1.0 ? r - 0.5*r*r : 0.5);\r
    vec3 branchP = start + vec3(r*dirXY, branchZ);\r
\r
    float zRange = zRanges[woodTypeIndex].z;\r
    vec3 diff = p - branchP;\r
    diff.z -= zRange * round(diff.z / zRange);        // for z-tiling\r
    float dBranch = length(diff);\r
    float beta = atan(diff.z, dot(diff.xy, vec2(-dirXY.y, dirXY.x)));\r
    float rBranch = br - 0.1*sqrt(r) + 0.01*snoise(1.0*vec3(cos(beta), sin(beta), r));\r
\r
    float tb = dBranch / rBranch;\r
\r
    float tDelta = ts - tb;\r
    float k = 1.75*tDelta/(0.3+abs(tDelta)) + 3.25;\r
    // NOTE x/(a+abs(x)) is C^1, ->-1 at -\\infty, ->1 at \\infty, derivative at 0 is 1/a.\r
\r
    float t = sminPow(ts, tb, k);\r
    float delta = t - min(ts, tb);\r
\r
    // Death\r
    float isAlive = 1.0;\r
    float oldT = t;\r
    if (t > death) {\r
        isAlive = 0.0;\r
        float tDead = abs(ts - death);\r
        tb += tDead;\r
\r
        float kDeath = k + 5.0*tDead;\r
        t = sminPow(ts, tb, kDeath);\r
        float tempDelta = t - min(ts, tb);\r
\r
        float s = 8.0*tDead - 1.0;\r
        float f = 0.35 - 0.85*s/(0.3+abs(s));\r
        delta = f*tempDelta;\r
    }\r
\r
    return BranchState(tb, delta, death, beta, isAlive, oldT);\r
}\r
\r
\r
vec4 wood(vec3 p) {\r
    // p.z += time;\r
    float zRange = zRanges[woodTypeIndex].z;\r
\r
    vec2 pith = getPith(p.z);\r
\r
    float deadColorFactor = 0.0;\r
    float deadOutlineFactor = 1.0;\r
\r
    // Write p in cylinder coordinates as (r,phi,p.z).\r
    vec2 v = p.xy - getPith(p.z);\r
    float phi = atan(v.y, v.x);\r
    float r = length(v);\r
float rStem = (4.0 + 0.5*snoise(0.5*vec3((0.5+debug2.w*sin(r))*normalize(p.xy-pith), p.z))) / 3.0;\r
    float ts = r / rStem;\r
\r
    vec2 bCoord = vec2(phi/TAU, (zRanges[woodTypeIndex].x+zRange*fract(p.z/zRange))/zRanges[MAX_WOOD_TYPES-1].y);\r
    ivec4 branchIndices = ivec4(round(float(MAX_BRANCHES)*texture(branchIndexTex, bCoord)));\r
\r
    float tb, delta, death, beta, isAlive, oldT;\r
    float deltaSum = 0.0;\r
    vec4 tbVec = vec4(0.0);\r
    for (int bk = 3; bk >= 0; bk--) {   // dominating term last\r
        BranchState bs = computeBranchState(p, r, phi, p.z, ts, branchIndices[bk]);\r
        tb = bs.tb;\r
        delta = bs.delta; \r
        death = bs.death;\r
        beta = bs.beta;\r
        isAlive = bs.isAlive;\r
        oldT = bs.oldT;\r
\r
        // Localize branch influence\r
        float branchInfluence = 1.0 - smoothstep(INFLUENCE_LOW, INFLUENCE_HIGH, tb/ts);    // 0 if tb > c*ts\r
        delta = mix(0.0, delta, branchInfluence);\r
\r
        deltaSum += delta;\r
        tbVec[bk] = tb;\r
    }\r
\r
    float tbMin = min(min(tbVec.x, tbVec.y), min(tbVec.z, tbVec.w));\r
    float tbSmoothMin = sminPow4(tbVec, 2.0);\r
    float t = min(ts, tbMin) + deltaSum;\r
\r
    if (tb < death) {\r
        // Since a point can only belong to one knot, this only needs to be done for the dominant branch\r
        // Inside dead knot\r
        deadColorFactor = max(0.0, ts - death);\r
\r
        // Dead knot outline\r
        float noise = snoise(vec3(cos(beta), sin(beta), ts));\r
        float thickness = 0.02 + 0.02*noise;  // 0 <~ thickness <~ 0.04\r
        if (abs(oldT - death) < thickness)\r
            deadOutlineFactor = 0.5;     // 0.65\r
    }\r
\r
\r
    vec2 vProfile = vec2(fract(t), (2.0*float(woodTypeIndex)+step(1.0, t)+0.5)/(2.0 * float(MAX_WOOD_TYPES)));\r
    vec4 knotColor = knotColors[woodTypeIndex];\r
    vec3 texColor = texture(profileTexture, vProfile).rgb;\r
    float g0 = clamp(1.2*tbSmoothMin-ts, 0.001, 1.0) + 1.0;    // 1.2\r
    float g = 0.5 / pow(g0, 14.0);\r
    texColor -= g * knotColor.rgb;      // darken knot (alive and dead)\r
    texColor -= g * clamp(3.0*deadColorFactor, 0.0, 0.5) * knotColor.rgb;  //further darken dead knot\r
    texColor = deadOutlineFactor * texColor;    //outline of dead knot\r
\r
    if (debug1.x > 0.8) {\r
        float x = (1.0+debug2.z)*tbSmoothMin - ts;\r
        float s = bump(-0.02, -0.01, 0.01, 0.02, x) * 0.0 + 1.0;\r
        s = tb < death && ts > death ? s : 0.0;\r
        return vec4(s, s, s, 1.0);\r
    }\r
    if (debug1.x > 0.6) {\r
        float s = abs(oldT - death);\r
        float s1 = bump(-1.0, 0.0, 0.09*debug2.w, 0.11*debug2.w, s);\r
        float s2 = tb < death ? 1.0 : 0.0;\r
        float s3 = ts > death ? 1.0 : 0.0;\r
        return vec4(s1, s2, s3, 1.0);\r
    }\r
    if (debug1.x > 0.4) {\r
        float t2 = min(ts, tb) + delta;\r
        float s = abs(t2 - death);\r
        return vec4(tb < death ? 1.0 : 0.0, 0.0, 0.0, 1.0);\r
    }\r
    if (debug1.x > 0.2) {\r
        if (deadOutlineFactor < 1.0)\r
            return vec4(1.0, 0.0, 0.0, 1.0);\r
        return vec4(texColor, 1.0);\r
    }\r
\r
    // return vec4(fract(0.5+atan(p.y, p.x)/TAU), fract(0.0*p.y), fract(0.0*p.z), 1.0);\r
\r
    return vec4(texColor, 1.0);\r
}`,Fe=`// For more realistic model, see https://dl.acm.org/doi/10.1145/3528223.3530081,\r
// https://www.youtube.com/watch?v=mMvoTtipJac https://www.shadertoy.com/view/fsyyzt\r
\r
\r
const float BRANCH_ANGLE = 0.5;\r
const float BRANCH_RADIUS = 0.05;\r
const float AGE_YEARS = 50.0;\r
const float BRANCH_AGE_YEARS = 8.0;\r
const vec3 COLOR1 = vec3(218.0,109.0,66.0)/255.0;\r
const vec3 COLOR2 = vec3(255.0,193.0,140.0)/255.0;\r
\r
\r
// Flow of fbm noise vectorfield, integrated with RK4.\r
vec3 flowWarp(vec3 p) {\r
    float H = debug1;\r
    float WARP = debug2/10.0;     // time parameter for flow\r
    float s = WARP;\r
\r
    vec3 offset = vec3(0.0);\r
\r
    vec3 k1 = fbm33(p, H);\r
    vec3 k2 = fbm33(p + 0.5*s*k1, H);\r
    vec3 k3 = fbm33(p + 0.5*s*k2, H); \r
    vec3 k4 = fbm33(p + s*k3, H);\r
    offset += (s / 6.0) * (k1 + 2.0*k2 + 2.0*k3 + k4);\r
\r
    return p + offset;\r
}\r
\r
float rays(vec3 q) {\r
    float phi = atan(q.y, q.x);\r
    float r = length(q.xy);\r
    int iScale = 15;\r
    float scale = float(iScale);\r
    vec2 st = scale * vec2(0.5+phi/TAU, q.z/TAU);\r
\r
    const float MEDULLARY_THRESHOLD = 0.25;\r
    const float RAY_THRESHOLD = 0.5;\r
\r
    for (int kx = -1; kx <= 1; kx++) {\r
        for (int ky = -1; ky <= 1; ky++) {\r
            vec2 kxy = vec2(float(kx), float(ky));\r
            ivec2 p = ivec2((iScale + kx + int(floor(st.x))) % iScale, iScale + ky + int(floor(st.y)));\r
            vec3 jitter = hash33(vec3(p, 0.0));\r
            vec2 rand = hash22(vec2(p));\r
            rand.xy = vec2(min(rand.x, rand.y), max(rand.x, rand.y));\r
            vec2 spot = kxy + floor(st) + jitter.xy;\r
            vec2 diff = spot - st;\r
            diff.x *= 20.0;\r
            if (jitter.z < RAY_THRESHOLD) {\r
                if (jitter.z < MEDULLARY_THRESHOLD && length(diff) < 0.5)\r
                    return 1.0;\r
                float s = clamp((r-rand.x) / (rand.y-rand.x), 0.0, 1.0);\r
                s = 2.0 * min(s, 1.0-s);\r
                if (length(vec3(diff, s)) < 0.5)\r
                    return 1.0;\r
            }\r
        }\r
    }\r
    return 0.0;\r
}\r
\r
bool branches(vec3 q, out vec3 qNew) {\r
    float phi = atan(q.y, q.x);\r
    int iScale = 2;     // number of branches at a time\r
    float yScaleFactor = 2.0;   // scales vertical distance between branches\r
    float scale = float(iScale);\r
    vec2 st = scale * vec2(0.5+phi/TAU, yScaleFactor*q.z/TAU);\r
\r
    float s = length(q.xy);\r
\r
    float r = min(s-0.4, BRANCH_RADIUS);\r
\r
    for (int kx = -1; kx <= 1; kx++) {\r
        for (int ky = -1; ky <= 1; ky++) {\r
            vec2 kxy = vec2(float(kx), float(ky));\r
            ivec2 p = ivec2((iScale + kx + int(floor(st.x))) % iScale, iScale + ky + int(floor(st.y)));\r
            vec3 jitter = hash33(vec3(p.y, 1.0, 0.0));\r
            vec2 spot = vec2(kxy.x + floor(st.x) + jitter.x, kxy.y + floor(st.y) + 0.5);\r
            vec2 diff = spot - st;\r
            if (length(vec2(diff.x, diff.y/yScaleFactor/s)) < r && p.y % 1 == 0) {\r
                qNew = vec3(s * vec2(diff.x, diff.y/yScaleFactor/s), s) / BRANCH_RADIUS;\r
                return true;\r
            }\r
        }\r
    }\r
    return false;\r
}\r
\r
float annualRings(vec3 q, float age) {\r
    float r = length(q.xy);\r
    float s = 0.5 + 0.5*sin(r*TAU*age);\r
    return s*s;\r
}\r
\r
vec3 wood(vec3 p0) {\r
    vec3 p = flowWarp(p0);\r
    // vec3 p = p0;\r
\r
    // return mix(COLOR1, COLOR2, 0.5);\r
\r
    // float d = spots(p);\r
    float c = 0.2;\r
    float age = AGE_YEARS;\r
\r
    // Add branches\r
    vec3 bOut;\r
    bool hasBranch = branches(p, bOut);\r
    if (hasBranch) {\r
        c = 0.9;\r
        p = bOut;\r
        age = BRANCH_AGE_YEARS;\r
        // if (branches(p, bOut))\r
        //     c = 0.5;\r
    }\r
\r
    c = rays(p);\r
    if (c < 0.3)\r
        c = annualRings(p, age);\r
\r
    return mix(COLOR1, COLOR2, c);\r
}`,Ie=`#include <sCommon>\r
#include <sExtensions>\r
\r
uniform float time;\r
\r
out vec3 vPos;\r
\r
void main() {\r
    vPos = position;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}`,Le=`#include <sCommon>\r
#include <sExtensions>\r
\r
uniform float time;\r
\r
out vec3 vPos;\r
\r
#include <sTrunkPeel>\r
\r
\r
void main() {\r
    vPos = position;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}`,Re=`out vec4 vPos;\r
\r
void main() {\r
    vPos = vec4(position.xyz, 1.0);\r
    gl_Position = projectionMatrix * modelViewMatrix * vPos;\r
}`,ze=`#include <sCommon>\r
#include <sExtensions>\r
\r
uniform float phase;\r
uniform vec3 size;      // (w,h,d)\r
uniform float gap;\r
uniform int numSegments;\r
\r
uniform float time;\r
\r
out vec3 vPos;\r
out float part;\r
\r
#include <sTrunkPeel>\r
\r
\r
void main() {\r
    float phase0 = max(PI * size.z / 2.0, phase);\r
\r
    vec2 p = vec2(0.0);\r
    \r
    int i = int(round(position.x));\r
    if (i == numSegments-1) {\r
        p = vec2(size.x - phase0, size.z);\r
    }\r
    if (i == numSegments-2) {\r
        p = vec2(size.x - phase0, 0.0);\r
    }\r
\r
    if (i <= numSegments-3) {\r
        // for i = 0 to i = numSegments-3 we wrap around the spiral\r
\r
        float theta = TAU * float(i) / float(numSegments - 3);        // in [0,TAU]\r
        float angle0 = spiralAngle(phase0, 0.0, size.z);\r
        float r0 = spiralRadius(phase0, 0.0, 0.0, size.z);\r
\r
        float angle = max(0.0, angle0 - TAU + theta);\r
        float x = spiralAngleInverse(angle, 0.0, size.z);\r
        float r = spiralRadius(x, 0.0, 0.0, size.z);\r
        p = vec2(r*sin(theta), r0 - r*cos(theta));\r
    }\r
\r
\r
    vPos = vec3(p.x, position.z*size.y, p.y);\r
    part = position.y;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);\r
}`,Be=`out vec3 vPos;\r
out vec2 vUv;\r
out vec3 vNormal;\r
\r
void main() {\r
    vPos = position;\r
    vUv = uv;\r
    vNormal = normal;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);\r
}`,Ve=`out vec3 vPos;\r
\r
void main() {\r
    vPos = position;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);\r
}`;function He(e){let t={};for(let[n,r]of Object.entries(e)){let e=n.split(`/`).pop().replace(/\.glsl$/,``);t[e]=r}return t}function W(e,t,n=new Set){if(!t[e])throw Error(`Unknown shader chunk: ${e}`);return t[e].replace(/#include\s+<\s*(\S+?)\s*>/g,(e,r)=>{if(n.has(r))throw Error(`Circular shader include: ${r}`);if(!t[r])throw Error(`Unknown shader chunk: ${r}`);n.add(r);let i=W(r,t,n);return n.delete(r),i})}var G=He(Object.assign({"./shaders/fsCompositeClip.glsl":H,"./shaders/fsCompositeRegular.glsl":ge,"./shaders/fsCopyTexture.glsl":_e,"./shaders/fsGeom.glsl":ve,"./shaders/fsGeomNormals.glsl":ye,"./shaders/fsShadowClip.glsl":be,"./shaders/fsShadowGeom.glsl":U,"./shaders/fsShadowRegular.glsl":xe,"./shaders/sCommon.glsl":Se,"./shaders/sGlobalUBO.glsl":Ce,"./shaders/sPBR.glsl":we,"./shaders/sVolume.glsl":Te,"./shaders/solid/fsParquet.glsl":Ee,"./shaders/solid/fsPlywood.glsl":De,"./shaders/solid/fsSolid.glsl":Oe,"./shaders/solid/fsVeneer.glsl":ke,"./shaders/solid/fsWoodSetup.glsl":Ae,"./shaders/solid/sExtensions.glsl":je,"./shaders/solid/sSolidTex.glsl":Me,"./shaders/solid/sTrunkPeel.glsl":Ne,"./shaders/solid/sWood.glsl":Pe,"./shaders/solid/sWoodOld.glsl":Fe,"./shaders/solid/vsParquet.glsl":Ie,"./shaders/solid/vsPlywood.glsl":Le,"./shaders/solid/vsSolid.glsl":Re,"./shaders/solid/vsVeneer.glsl":ze,"./shaders/vs.glsl":Be,"./shaders/vsPlain.glsl":Ve})),K=3,q=4,Ue=3,J=512,We=new l;We.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);var Ge=(e,t,n)=>{e.traverse(e=>{e instanceof j&&(e.castShadow=t,e.receiveShadow=n)})};function Ke(e){return e.isMesh===!0}function qe(){let e=new ue().setHSL(Math.random(),1,.8);return new I(e.r,e.g,e.b,8+2*Math.random())}var Je=class{constructor(e){this.cleanUpTasks=[],this.animationRequestID=null,this.lastTime=0,this.isStopped=!1,this.shadowCameras=[],this.shadowRTs=[],this.container=e,this.isInitialized=!1,x.DEFAULT_UP.set(0,1,0)}async init(e){if(this.renderer=new fe({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,1),this.renderer.autoClear=!1,this.container.appendChild(this.renderer.domElement),this.font=new B,await this.font.load(`times64`),this.setupCamera(),this.setupScene(),this.createRenderTargets(),this.setupResizeRenderer(),this.createGUI(),this.isInitialized=!0,e.aborted){this.dispose();return}this.animate=this.animate.bind(this),this.animate()}dispose(){if(this.isInitialized){this.animationRequestID&&cancelAnimationFrame(this.animationRequestID),this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.font?.dispose(),this.disposeRenderTargets(),this.disposeShaders(),this.globalUBO.dispose(),this.renderer.dispose(),this.controls.dispose(),this.gui.destroy()}}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let{clientWidth:e,clientHeight:t}=this.container;console.log(`Resize! (${e}, ${t})`),this.renderer.setSize(e,t);let n=e/t;this.mainCamera instanceof P?(this.mainCamera.left=-n,this.mainCamera.right=n,this.mainCamera.updateProjectionMatrix()):this.mainCamera instanceof v&&(this.mainCamera.aspect=n,this.mainCamera.updateProjectionMatrix());let r=new S;this.renderer.getDrawingBufferSize(r),this.renderer.getDrawingBufferSize(this.globalUniforms.resolution.value),this.geometryBackRT?.setSize(r.x,r.y),this.geometryFrontRT?.setSize(r.x,r.y),this.compositeClipRT?.setSize(r.x,r.y),this.compositeRegularRT?.setSize(r.x,r.y)}setupResizeRenderer(){let e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container))}createRenderTargets(){this.disposeRenderTargets();let e=this.getResolution(),t=Math.min(this.renderer.getPixelRatio(),2),[n,r]=[t*e.x,t*e.y];this.geometryBackRT=new g(n,r,{format:b,type:y,minFilter:_,magFilter:_,depthTexture:new C(n,r,u)}),this.geometryFrontRT=new g(n,r,{depthTexture:new C(n,r,u),count:2}),this.geometryFrontRT.textures[0].minFilter=_,this.geometryFrontRT.textures[0].magFilter=_,this.geometryFrontRT.textures[0].format=b,this.geometryFrontRT.textures[0].type=y,this.geometryFrontRT.textures[1].minFilter=_,this.geometryFrontRT.textures[1].magFilter=_,this.geometryFrontRT.textures[1].format=ie,this.geometryFrontRT.textures[1].type=y,this.shadowBackRT=new g(J,J,{count:2}),this.shadowBackRT.textures[0].format=b,this.shadowBackRT.textures[0].type=u,this.shadowBackRT.textures[0].minFilter=O,this.shadowBackRT.textures[0].magFilter=O,this.shadowBackRT.textures[1].format=b,this.shadowBackRT.textures[1].type=y,this.shadowBackRT.textures[1].minFilter=_,this.shadowBackRT.textures[1].magFilter=_,this.shadowFrontRT=new g(J,J,{count:2}),this.shadowFrontRT.textures[0].format=b,this.shadowFrontRT.textures[0].type=u,this.shadowFrontRT.textures[0].minFilter=O,this.shadowFrontRT.textures[0].magFilter=O,this.shadowFrontRT.textures[1].format=b,this.shadowFrontRT.textures[1].type=y,this.shadowFrontRT.textures[1].minFilter=_,this.shadowFrontRT.textures[1].magFilter=_;let i=this.renderer.getContext();for(let e=0;e<K;e++){let e=new g(J,J,{format:b,type:M,depthTexture:new C(J,J),depthBuffer:!0}),t=e.depthTexture;t.format=c,t.type=te,t.minFilter=O,t.magFilter=O,this.renderer.setRenderTarget(e);let n=this.renderer.properties.get(t).__webglTexture;i.bindTexture(i.TEXTURE_2D,n),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_COMPARE_FUNC,i.LEQUAL),i.bindTexture(i.TEXTURE_2D,null),this.renderer.setRenderTarget(null),this.shadowRTs.push(e)}this.compositeClipRT=new g(n,r,{format:N,type:M,minFilter:_,magFilter:_,depthTexture:new C(n,r,u)}),this.compositeRegularRT=new g(n,r,{format:N,type:M,minFilter:_,magFilter:_,depthTexture:new C(n,r,u)})}createGUI(){this.gui=new R({container:this.container}),this.container.style.position=`relative`,this.gui.domElement.style.position=`absolute`,this.gui.domElement.style.top=`0px`,this.gui.domElement.style.right=`0px`;let e={animateButton:()=>this.animateStep(!0),toggleStop:()=>{this.isStopped=!this.isStopped},debugInfo:()=>{console.log(`1`,this.mainCamera.matrixWorldInverse.elements),console.log(`2`,this.shadowCameras[0].matrixWorldInverse.elements)},debug1:this.globalUniforms.debug1.value,debug2:this.globalUniforms.debug2.value,debug3:this.globalUniforms.debug3.value,debug4:this.globalUniforms.debug4.value};this.gui.add(e,`animateButton`).name(`Animate step`),this.gui.add(e,`toggleStop`).name(`Toggle stop/play`),this.gui.add(e,`debugInfo`).name(`Debug info`),this.gui.add(e,`debug1`,.1,2).name(`Debug1 (H)`).onChange(e=>{this.globalUniforms.debug1.value=e}),this.gui.add(e,`debug2`,0,1).name(`Debug2 (prev. WARP*10)`).onChange(e=>{this.globalUniforms.debug2.value=e}),this.gui.add(e,`debug3`,0,1).name(`Debug3 (-)`).onChange(e=>{this.globalUniforms.debug3.value=e}),this.gui.add(e,`debug4`,0,1).name(`Debug4 (-)`).onChange(e=>{this.globalUniforms.debug4.value=e}),this.gui.close()}disposeRenderTargets(){let e=[this.geometryBackRT,this.geometryFrontRT,this.compositeClipRT,this.compositeRegularRT,this.shadowBackRT,this.shadowFrontRT];for(let t of this.shadowRTs)e.push(t);for(let t of e)t?.depthTexture?.dispose(),t?.dispose()}disposeShaders(){let e=[this.geometryMaterial,this.geometryMaterialNormals,this.compositeClipMaterial,this.compositeRegularMaterial,this.shadowMaterialGeom,this.shadowMaterialClip,this.shadowMaterialRegular,this.copyMaterial];for(let t of e)t?.dispose()}setupCamera(){this.mainCamera=new v(50),this.controls=new L(this.mainCamera,this.renderer.domElement),this.mainCamera.position.set(0,0,5),this.quadCamera=new P,this.quadCamera.position.set(0,0,1)}setupScene(){this.globalUniforms={resolution:new h(new S),cameraPos:new h(new T),cameraParams:new h(new I),vpMat:new h(new l),invVpMat:new h(new l),time:new h(0),sphereMain:new h(new l),debug1:new h(0),debug2:new h(0),debug3:new h(.9),debug4:new h(1),numLights:new h(K),lightPos:Array.from({length:q},()=>new h(new I)),lightCol:Array.from({length:q},()=>new h(qe())),shadowMapSize:new h(J),shadowCameraParams:Array.from({length:q},()=>new h(new I)),shadowMatrices:Array.from({length:q},()=>new h(new l)),shadowSpheres:Array.from({length:q},()=>new h(new l))},this.globalUBO=new p,this.globalUBO.setName(`globalUBO`),this.globalUBO.add(this.globalUniforms.resolution),this.globalUBO.add(this.globalUniforms.cameraPos),this.globalUBO.add(this.globalUniforms.cameraParams),this.globalUBO.add(this.globalUniforms.vpMat),this.globalUBO.add(this.globalUniforms.invVpMat),this.globalUBO.add(this.globalUniforms.time),this.globalUBO.add(this.globalUniforms.sphereMain),this.globalUBO.add(this.globalUniforms.debug1),this.globalUBO.add(this.globalUniforms.debug2),this.globalUBO.add(this.globalUniforms.debug3),this.globalUBO.add(this.globalUniforms.debug4),this.globalUBO.add(this.globalUniforms.numLights),this.globalUBO.add(this.globalUniforms.lightPos),this.globalUBO.add(this.globalUniforms.lightCol),this.globalUBO.add(this.globalUniforms.shadowMapSize),this.globalUBO.add(this.globalUniforms.shadowCameraParams),this.globalUBO.add(this.globalUniforms.shadowMatrices),this.globalUBO.add(this.globalUniforms.shadowSpheres),this.quadScene=new A,this.quadScene.add(new j(new ae(2,2))),this.geometryScene=new A,this.geometryMaterial=new k({uniforms:{phase:{value:null},objectId:{value:null}},vertexShader:W(`vs`,G),fragmentShader:W(`fsGeom`,G),uniformsGroups:[this.globalUBO],depthWrite:!0,depthTest:!0,glslVersion:E}),this.geometryMaterialNormals=new k({uniforms:{phase:{value:null},objectId:{value:null}},vertexShader:W(`vs`,G),fragmentShader:W(`fsGeomNormals`,G),uniformsGroups:[this.globalUBO],depthWrite:!0,depthTest:!0,glslVersion:E});for(let e=0;e<K;e++){let e=new v(40,1,1,20);e.position.set(10*(Math.random()-.5),10,10*(Math.random()-.5)),e.lookAt(0,0,0),this.shadowCameras.push(e)}let e=new ne({depthPacking:oe,side:1}),t=1;new he().load(`/dev-site-misc/solid/solid.mtl`,n=>{n.preload();let r=new me;r.setMaterials(n),r.load(`/dev-site-misc/solid/solid.obj`,n=>{n.position.set(0,0,0),this.geometryScene.add(n),n.traverse(n=>{Ke(n)&&(n.material,n.userData.objectId=t++,n.customDepthMaterial=e)}),this.geometryObject=n,Ge(this.geometryObject,!0,!0)})}),this.compositeClipMaterial=new k({uniforms:{backTex:{value:null},frontTex:{value:null},backDepthTex:{value:null},frontDepthTex:{value:null},frontNormalTex:{value:null},shadowMaps:{value:Array(q).fill(null)}},vertexShader:W(`vs`,G),fragmentShader:W(`fsCompositeClip`,G),uniformsGroups:[this.globalUBO],depthWrite:!0,depthTest:!0,glslVersion:E}),this.compositeRegularMaterial=new k({uniforms:{frontTex:{value:null},frontDepthTex:{value:null},frontNormalTex:{value:null},shadowMaps:{value:Array(q).fill(null)}},vertexShader:W(`vs`,G),fragmentShader:W(`fsCompositeRegular`,G),uniformsGroups:[this.globalUBO],depthWrite:!0,depthTest:!0,glslVersion:E}),this.overlayScene=new A;let n=new w({color:65280});this.sphereObject=new j(new ce(.2),n),this.overlayScene.add(this.sphereObject);let r=new ee,i=new j(new f(.6,.2,100,16,3,2),r);i.position.x=-1.5;let a=new j(new re(.6,.2,16,100),r);a.position.x=1.5,this.overlayScene.add(i,a);for(let e of this.shadowCameras){let t=new w({color:16777215}),n=new j(new ce(.2),t);n.position.copy(e.position),this.overlayScene.add(n)}let o=new z(this.font,.5);for(let e=0;e<20;e++){let e=[5*(Math.random()-.5),2*Math.random(),5*(Math.random()-.5)],t=Math.random()*2*Math.PI,n=.1+.1*Math.random(),r=[Math.cos(t),0,Math.sin(t)],i=(t,i)=>[e[0]+n*t*r[0],e[1]+n*i,e[2]+n*t*r[2]],a=[.5+Math.random()*.5,.5+Math.random()*.5,.5+Math.random()*.5];o.addText(`Test_${Math.random()}`,i,a,[0,0],.1+.1*Math.random())}this.overlayScene.add(o.getObject()),this.shadowMaterialGeom=new k({uniforms:{objectId:{value:null},lightIndex:{value:null}},vertexShader:W(`vs`,G),fragmentShader:W(`fsShadowGeom`,G),uniformsGroups:[this.globalUBO],depthWrite:!0,depthTest:!0,glslVersion:E}),this.shadowMaterialRegular=new k({uniforms:{},vertexShader:W(`vsPlain`,G),fragmentShader:W(`fsShadowRegular`,G),depthWrite:!0,depthTest:!0,glslVersion:E}),this.shadowMaterialClip=new k({uniforms:{backIdTex:{value:null},frontIdTex:{value:null},backDepthTex:{value:null},frontDepthTex:{value:null},lightIndex:{value:null}},vertexShader:W(`vs`,G),fragmentShader:W(`fsShadowClip`,G),uniformsGroups:[this.globalUBO],depthWrite:!0,depthTest:!0,glslVersion:E}),this.copyMaterial=new k({uniforms:{clipColorTex:{value:null},clipDepthTex:{value:null},regularColorTex:{value:null},regularDepthTex:{value:null}},vertexShader:W(`vs`,G),fragmentShader:W(`fsCopyTexture`,G),uniformsGroups:[this.globalUBO],depthWrite:!1,depthTest:!1,glslVersion:E}),this.geometryMaterial.onBeforeRender=(e,t,n,r,i)=>{this.geometryMaterial.uniforms.objectId.value=i.userData.objectId,this.geometryMaterial.uniformsNeedUpdate=!0},this.geometryMaterialNormals.onBeforeRender=(e,t,n,r,i)=>{this.geometryMaterialNormals.uniforms.objectId.value=i.userData.objectId,this.geometryMaterialNormals.uniformsNeedUpdate=!0},this.shadowMaterialGeom.onBeforeRender=(e,t,n,r,i)=>{this.shadowMaterialGeom.uniforms.objectId.value=i.userData.objectId,this.shadowMaterialGeom.uniformsNeedUpdate=!0}}getResolution(){let{clientWidth:e,clientHeight:t}=this.container;return new S(e,t)}getSphere(e,t,n,r){let i=new T(e.x-n*t.x,e.y-n*t.y,e.z-n*t.z),a=new I(1,1,0,1).applyMatrix4(r.projectionMatrixInverse),o=r.projectionMatrix.elements,s=a.z/a.w,c=i.clone().applyMatrix4(r.matrixWorldInverse),u=-r.near/s,d=[i.x,i.y,i.z,n,a.x/a.w,a.y/a.w,s,0,.5*(o[10]+o[11])/o[11],.5*o[14]/o[11]/s,0,0,-c.x,-c.y,-c.z,u];return new l().fromArray(d)}animate(){this.controls.update(),this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(!1)}animateStep(e){(!this.isStopped||e)&&(this.lastTime=(this.lastTime??0)+.002),this.render()}updateGlobalUniforms(e){this.globalUniforms.cameraPos.value=this.mainCamera.position,this.globalUniforms.cameraParams.value.set(this.mainCamera.near,this.mainCamera.far,0,0),this.globalUniforms.time.value=e;let t=this.mainCamera.projectionMatrix.clone().multiply(this.mainCamera.matrixWorldInverse),n=this.mainCamera.matrixWorld.clone().multiply(this.mainCamera.projectionMatrixInverse);this.globalUniforms.vpMat.value=t,this.globalUniforms.invVpMat.value=n;for(let e=0;e<q;e++){let t=e<K?e:0,n=We.clone().multiply(this.shadowCameras[t].projectionMatrix.clone().multiply(this.shadowCameras[t].matrixWorldInverse));this.globalUniforms.shadowMatrices[e].value=n,this.globalUniforms.lightPos[e].value.set(this.shadowCameras[t].position.x,this.shadowCameras[t].position.y,this.shadowCameras[t].position.z,Ue),this.globalUniforms.shadowCameraParams[e].value.set(this.shadowCameras[t].near,this.shadowCameras[t].far,0,0)}let r=new T(Math.cos(e),1+Math.sin(2*e),Math.sin(3*e)),i=new T(Math.cos(4*e),Math.sin(5*e)).normalize(),a=3/(1+.4*Math.sin(6*e)),o=this.getSphere(r,i,a,this.mainCamera);this.sphereObject.position.set(o.elements[0],o.elements[1],o.elements[2]),this.globalUniforms.sphereMain.value=o;for(let e=0;e<K;e++){let t=this.shadowCameras[e],n=this.getSphere(r,i,a,t);this.globalUniforms.shadowSpheres[e].value=n}}renderClip(){for(let e=0;e<K;e++){let t=this.shadowCameras[e];this.renderer.setRenderTarget(this.shadowBackRT),this.renderer.clear(),this.shadowMaterialGeom.side=1,this.shadowMaterialGeom.uniforms.lightIndex.value=e,this.geometryScene.overrideMaterial=this.shadowMaterialGeom,this.renderer.render(this.geometryScene,t),this.renderer.setRenderTarget(this.shadowFrontRT),this.renderer.clear(),this.shadowMaterialGeom.side=0,this.geometryScene.overrideMaterial=this.shadowMaterialGeom,this.renderer.render(this.geometryScene,t),this.renderer.setRenderTarget(this.shadowRTs[e]),this.renderer.clear(),this.shadowMaterialClip.uniforms.backDepthTex.value=this.shadowBackRT.textures[0],this.shadowMaterialClip.uniforms.frontDepthTex.value=this.shadowFrontRT.textures[0],this.shadowMaterialClip.uniforms.backIdTex.value=this.shadowBackRT.textures[1],this.shadowMaterialClip.uniforms.frontIdTex.value=this.shadowFrontRT.textures[1],this.shadowMaterialClip.uniforms.lightIndex.value=e,this.quadScene.overrideMaterial=this.shadowMaterialClip,this.renderer.render(this.quadScene,this.quadCamera)}this.renderer.setRenderTarget(this.geometryBackRT),this.renderer.clear(),this.geometryMaterial.side=1,this.geometryMaterial.uniforms.phase.value=0,this.geometryScene.overrideMaterial=this.geometryMaterial,this.renderer.render(this.geometryScene,this.mainCamera),this.renderer.setRenderTarget(this.geometryFrontRT),this.renderer.clear(),this.geometryMaterialNormals.side=0,this.geometryMaterialNormals.uniforms.phase.value=1,this.geometryScene.overrideMaterial=this.geometryMaterialNormals,this.renderer.render(this.geometryScene,this.mainCamera),this.renderer.setRenderTarget(this.compositeClipRT),this.renderer.clear(),this.compositeClipMaterial.uniforms.backTex.value=this.geometryBackRT.texture,this.compositeClipMaterial.uniforms.frontTex.value=this.geometryFrontRT.textures[0],this.compositeClipMaterial.uniforms.backDepthTex.value=this.geometryBackRT.depthTexture,this.compositeClipMaterial.uniforms.frontDepthTex.value=this.geometryFrontRT.depthTexture,this.compositeClipMaterial.uniforms.frontNormalTex.value=this.geometryFrontRT.textures[1];for(let e=0;e<q;e++){let t=e<K?e:0;this.compositeClipMaterial.uniforms.shadowMaps.value[e]=this.shadowRTs[t].depthTexture}this.quadScene.overrideMaterial=this.compositeClipMaterial,this.renderer.render(this.quadScene,this.quadCamera)}renderRegular(){for(let e=0;e<K;e++){let t=this.shadowCameras[e];this.renderer.setRenderTarget(this.shadowRTs[e]),this.renderer.clear(),this.shadowMaterialRegular.side=0,this.geometryScene.overrideMaterial=this.shadowMaterialRegular,this.renderer.render(this.geometryScene,t)}this.renderer.setRenderTarget(this.geometryFrontRT),this.renderer.clear(),this.geometryMaterialNormals.side=0,this.geometryMaterialNormals.uniforms.phase.value=2,this.geometryScene.overrideMaterial=this.geometryMaterialNormals,this.renderer.render(this.geometryScene,this.mainCamera),this.renderer.setRenderTarget(this.compositeRegularRT),this.renderer.clear(),this.compositeRegularMaterial.uniforms.frontTex.value=this.geometryFrontRT.textures[0],this.compositeRegularMaterial.uniforms.frontDepthTex.value=this.geometryFrontRT.depthTexture,this.compositeRegularMaterial.uniforms.frontNormalTex.value=this.geometryFrontRT.textures[1];for(let e=0;e<q;e++){let t=e<K?e:0;this.compositeRegularMaterial.uniforms.shadowMaps.value[e]=this.shadowRTs[t].depthTexture}this.quadScene.overrideMaterial=this.compositeRegularMaterial,this.renderer.render(this.quadScene,this.quadCamera)}render(){this.updateGlobalUniforms(this.lastTime),this.renderClip(),this.renderer.setRenderTarget(this.compositeClipRT),this.renderer.render(this.overlayScene,this.mainCamera),this.renderRegular(),this.renderer.setRenderTarget(null),this.copyMaterial.uniforms.clipColorTex.value=this.compositeClipRT?.texture,this.copyMaterial.uniforms.clipDepthTex.value=this.compositeClipRT?.depthTexture,this.copyMaterial.uniforms.regularColorTex.value=this.compositeRegularRT?.texture,this.copyMaterial.uniforms.regularDepthTex.value=this.compositeRegularRT?.depthTexture,this.quadScene.overrideMaterial=this.copyMaterial,this.renderer.render(this.quadScene,this.quadCamera)}},Ye=class e extends A{constructor(t,n,r,i,a){super(),this.veneerSize=new T(100,2,.05),this.veneerMaterial=new k({uniforms:{phase:{value:50},size:{value:this.veneerSize},gap:{value:0},numSegments:{value:128}},vertexShader:W(`vsVeneer`,t),fragmentShader:W(`fsVeneer`,t),depthWrite:!0,depthTest:!0,glslVersion:E}),n.addToShaderMaterial(this.veneerMaterial,1),r.addToShaderMaterial(this.veneerMaterial),i.addToShaderMaterial(this.veneerMaterial);let o=new j(e.createVeneerCylinder(128,!0),this.veneerMaterial);o.frustumCulled=!1,this.add(o),o.rotateX(Math.PI/2),o.rotateY(Math.PI),o.rotateOnWorldAxis(new T(0,0,1),-1),this.plywoodSize=new T(1,1,.05),this.plywoodMaterial=new k({uniforms:{size:{value:this.plywoodSize},numLayers:{value:21}},vertexShader:W(`vsPlywood`,t),fragmentShader:W(`fsPlywood`,t),depthWrite:!0,depthTest:!0,glslVersion:E}),n.addToShaderMaterial(this.plywoodMaterial,2),r.addToShaderMaterial(this.plywoodMaterial),i.addToShaderMaterial(this.plywoodMaterial);let s=new F(this.plywoodSize.x,this.plywoodSize.y,this.plywoodSize.z);s.translate(this.plywoodSize.x/2,this.plywoodSize.y/2,this.plywoodSize.z/2);let c=new j(s,this.plywoodMaterial);this.add(c),c.position.set(3,0,1),this.parquetSize=new S(3,.3),this.parquetMaterial=new k({uniforms:{size:{value:this.parquetSize},time:{value:0}},vertexShader:W(`vsParquet`,t),fragmentShader:W(`fsParquet`,t),depthWrite:!0,depthTest:!0,glslVersion:E}),n.addToShaderMaterial(this.parquetMaterial,3),r.addToShaderMaterial(this.parquetMaterial),i.addToShaderMaterial(this.parquetMaterial);let l=new j(new F(20,20,.1),this.parquetMaterial);this.add(l),this.textGroup=new z(a),this.textGroup.addText(`Parquet`,[-5,-5,1],[1,.5,.5],[0,-1],1.5),this.textGroup.addText(`Veneer`,[1,.5,2.5],[.5,.5,1],[0,-1],.5),this.textGroup.addText(`Plywood`,[3.5,.5,1.25],[.5,1,.5],[0,-1],.25),this.add(this.textGroup.getObject())}static createVeneerCylinder(e,t=!1){let n=new le,r=[],i=(n,i,a,o,s,c)=>{let l=n===e-1||n===e-2,u=a===e-1||a===e-2,d=s===e-1||s===e-2,f=l||u||d?1:0;r.push(n,f,i,t?s:a,f,t?c:o,t?a:s,f,t?o:c)};for(let t=0;t<e;t++){let n=(t+1)%e;i(t,0,n,0,t,1),i(t,1,n,0,n,1),t>=1&&t<e-1&&(i(0,0,t+1,0,t,0),i(0,1,t,1,t+1,1))}return n.setAttribute(`position`,new se(new Float32Array(r),3)),n}prepareRender(e){this.veneerMaterial.uniforms.phase.value=(.5+.5*Math.sin(2*e.lastTime))*this.veneerSize.x,this.parquetMaterial.uniforms.time.value=e.lastTime}dispose(){this.textGroup.dispose()}};function Y(){let e=Math.max(Number.MIN_VALUE,Math.random()),t=Math.sqrt(-2*Math.log(e)),n=2*Math.PI*Math.random();return[t*Math.cos(n),t*Math.sin(n)]}function Xe(e,t){let n=[],r=0;for(let i=0;i<e;i++){let e=Y()[0],i=Math.exp(t*e);n.push(i),r+=i}return n.map(e=>e/r)}function Ze(e){let t=e.reduce((e,[t,n])=>e+n,0),n=Math.random()*t;for(let[t,r]of e)if(n-=r,n<=0)return t;return e[e.length-1][0]}function X(e){return Math.max(0,Math.min(1,e))}function Qe(e,t,n){return{x:X(e.x+(t.x-e.x)*n),y:X(e.y+(t.y-e.y)*n),z:X(e.z+(t.z-e.z)*n)}}function $e(e,t){return{x:X(e.x*t),y:X(e.y*t),z:X(e.z*t)}}function et(e,t,n){let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)}function tt(e){let t=[...e].sort((e,t)=>e-t),n=t.length,r=0,i=1/0,a=-1/0;for(let e=0;e<n;e++){let n=t[e];r+=n,i=Math.min(n,i),a=Math.max(n,a)}let o=r/n,s=0;for(let e=0;e<n;e++){let n=t[e]-o;s+=n*n}let c=Math.sqrt(s/n);return{min:i,max:a,mean:o,std:c,percentiles:{p10:t[Math.floor(n*.1)],p50:t[Math.floor(n*.5)],p90:t[Math.floor(n*.9)]}}}function nt(e){return e>0&&(e&e-1)==0}function rt(e){let t=1;for(;t<e;)t<<=1;return t}function it(e,t){let n=0;for(let r=0;r<t;r++)n=n<<1|e&1,e>>>=1;return n}var Z=class e{static transform(t,n,r,i=`auto`){if(t.length!==n.length)throw Error(`Real and imaginary arrays must have equal length.`);let a=t.length;if(i===`radix2`){if(!nt(a))throw Error(`Radix-2 requires power-of-two length.`);e.radix2(t,n,r);return}if(i===`bluestein`){e.bluestein(t,n,r);return}nt(a)?e.radix2(t,n,r):e.bluestein(t,n,r)}static radix2(e,t,n){let r=e.length,i=Math.log2(r);for(let n=0;n<r;n++){let r=it(n,i);r<=n||([e[n],e[r]]=[e[r],e[n]],[t[n],t[r]]=[t[r],t[n]])}for(let i=2;i<=r;i<<=1){let a=i>>>1,o=(n?2:-2)*Math.PI/i,s=Math.cos(o),c=Math.sin(o);for(let n=0;n<r;n+=i){let r=1,i=0;for(let o=0;o<a;o++){let l=n+o,u=l+a,d=r*e[u]-i*t[u],f=r*t[u]+i*e[u];e[u]=e[l]-d,t[u]=t[l]-f,e[l]+=d,t[l]+=f;let p=r*s-i*c;i=r*c+i*s,r=p}}}if(n){let n=1/r;for(let i=0;i<r;i++)e[i]*=n,t[i]*=n}}static bluestein(t,n,r){let i=t.length;if(i===0)return;let a=rt((i<<1)-1),o=new Float32Array(a),s=new Float32Array(a),c=new Float32Array(a),l=new Float32Array(a),u=r?1:-1;for(let e=0;e<i;e++){let r=u*Math.PI*e*e/i,a=Math.cos(r),c=Math.sin(r);o[e]=t[e]*a-n[e]*c,s[e]=t[e]*c+n[e]*a}for(let e=0;e<i;e++){let t=-u*Math.PI*e*e/i,n=Math.cos(t),r=Math.sin(t);c[e]=n,l[e]=r,e!==0&&(c[a-e]=n,l[a-e]=r)}e.convolveComplex(o,s,c,l);for(let e=0;e<i;e++){let r=u*Math.PI*e*e/i,a=Math.cos(r),c=Math.sin(r),l=o[e]*a-s[e]*c,d=o[e]*c+s[e]*a;t[e]=l,n[e]=d}if(r){let e=1/i;for(let r=0;r<i;r++)t[r]*=e,n[r]*=e}}static convolveComplex(t,n,r,i){e.radix2(t,n,!1),e.radix2(r,i,!1);let a=t.length;for(let e=0;e<a;e++){let a=t[e]*r[e]-n[e]*i[e],o=t[e]*i[e]+n[e]*r[e];t[e]=a,n[e]=o}e.radix2(t,n,!0)}static fft1D(t,n,r){e.transform(t,n,r)}static fft2D(t,n,r,i,a=`auto`){let o=Math.max(n,r),s=new Float32Array(o),c=new Float32Array(o);for(let o=0;o<r;o++){for(let e=0;e<n;e++){let r=(o*n+e)*2;s[e]=t[r],c[e]=t[r+1]}e.transform(s.subarray(0,n),c.subarray(0,n),i,a);for(let e=0;e<n;e++){let r=(o*n+e)*2;t[r]=s[e],t[r+1]=c[e]}}let l=new Float32Array(o),u=new Float32Array(o);for(let o=0;o<n;o++){for(let e=0;e<r;e++){let r=(e*n+o)*2;l[e]=t[r],u[e]=t[r+1]}e.transform(l.subarray(0,r),u.subarray(0,r),i,a);for(let e=0;e<r;e++){let r=(e*n+o)*2;t[r]=l[e],t[r+1]=u[e]}}}static fft3D(t,n,r,i,a,o=`auto`){let s=Math.max(n,r,i),c=new Float32Array(s),l=new Float32Array(s);for(let s=0;s<i;s++)for(let i=0;i<r;i++){for(let e=0;e<n;e++){let a=((s*r+i)*n+e)*2;c[e]=t[a],l[e]=t[a+1]}e.transform(c.subarray(0,n),l.subarray(0,n),a,o);for(let e=0;e<n;e++){let a=((s*r+i)*n+e)*2;t[a]=c[e],t[a+1]=l[e]}}for(let s=0;s<i;s++)for(let i=0;i<n;i++){for(let e=0;e<r;e++){let a=((s*r+e)*n+i)*2;c[e]=t[a],l[e]=t[a+1]}e.transform(c.subarray(0,r),l.subarray(0,r),a,o);for(let e=0;e<r;e++){let a=((s*r+e)*n+i)*2;t[a]=c[e],t[a+1]=l[e]}}for(let s=0;s<r;s++)for(let u=0;u<n;u++){for(let e=0;e<i;e++){let i=((e*r+s)*n+u)*2;c[e]=t[i],l[e]=t[i+1]}e.transform(c.subarray(0,i),l.subarray(0,i),a,o);for(let e=0;e<i;e++){let i=((e*r+s)*n+u)*2;t[i]=c[e],t[i+1]=l[e]}}}static generateNoise1D(t,n){let r=new Float32Array(t),i=new Float32Array(t);for(let e=0;e<t;e++){let[t,n]=Y();r[e]=t,i[e]=n}let a=0,o=t>>>1;for(let e=0;e<t;e++){let s=e<=o?e:e-t,c=Math.abs(s);if(c===0){r[e]=0,i[e]=0;continue}let l=1/c**(n/2);r[e]*=l,i[e]*=l;let u=2*e%t==0;a+=(u?1:2)*l*l}for(let e=1;e<t;e++){let n=t-e;e<n&&(r[n]=r[e],i[n]=-i[e])}t&1||(i[t>>1]=0),e.fft1D(r,i,!0);let s=Math.sqrt(a)/t;for(let e=0;e<t;e++)r[e]/=s;return new Float32Array(r)}static generateNoise2D(t,n,r){let i=t*n,a=new Float32Array(i*2);for(let e=0;e<i;e++){let[t,n]=Y();a[e*2]=t,a[e*2+1]=n}let o=0,s=t>>>1,c=n>>>1;for(let e=0;e<n;e++){let i=e<=c?e:e-n;for(let c=0;c<t;c++){let l=c<=s?c:c-t,u=(e*t+c)*2,d=l*l+i*i;if(d===0){a[u]=0,a[u+1]=0;continue}let f=1/d**(r/4);a[u]*=f,a[u+1]*=f;let p=2*c%t==0&&2*e%n==0;o+=(p?1:2)*f*f}}for(let e=0;e<n;e++){let r=(n-e)%n;for(let n=0;n<t;n++){let i=(t-n)%t,o=(e*t+n)*2,s=(r*t+i)*2;o<s?(a[s]=a[o],a[s+1]=-a[o+1]):o===s&&(a[o+1]=0)}}e.fft2D(a,t,n,!0);let l=Math.sqrt(o)/i,u=new Float32Array(i);for(let e=0;e<i;e++)u[e]=a[e*2]/l;return u}static generateNoise3D(t,n,r,i){let a=t*n*r,o=new Float32Array(a*2);for(let e=0;e<a;e++){let[t,n]=Y();o[e*2]=t,o[e*2+1]=n}let s=0,c=t>>>1,l=n>>>1,u=r>>>1;for(let e=0;e<r;e++){let a=e<=u?e:e-r;for(let u=0;u<n;u++){let d=u<=l?u:u-n;for(let l=0;l<t;l++){let f=l<=c?l:l-t,p=((e*n+u)*t+l)*2,m=f*f+d*d+a*a;if(m===0){o[p]=0,o[p+1]=0;continue}let h=1/m**(i/4);o[p]*=h,o[p+1]*=h;let g=2*l%t==0&&2*u%n==0&&2*e%r==0;s+=(g?1:2)*h*h}}}for(let e=0;e<r;e++){let i=(r-e)%r;for(let r=0;r<n;r++){let a=(n-r)%n;for(let s=0;s<t;s++){let c=(t-s)%t,l=((e*n+r)*t+s)*2,u=((i*n+a)*t+c)*2;l<u?(o[u]=o[l],o[u+1]=-o[l+1]):l===u&&(o[l+1]=0)}}}e.fft3D(o,t,n,r,!0);let d=Math.sqrt(s)/a,f=new Float32Array(a);for(let e=0;e<a;e++)f[e]=o[e*2]/d;return f}},at=class{constructor(e,t){this.woodConfig=t,this.branches=this.generateBranches(),this.profile=this.generateRadialProfile(e)}generateBranches(){let e=this.woodConfig,t=[],n=e.whorlSizes.length==1&&e.whorlSizes[0][0]==1,r=Xe(e.whorlNum,e.whorlOffsetDispersion),i=Math.random()*e.zRange,a=Math.random()*2*Math.PI;for(let o=0;o<e.whorlNum;o++){a=n?a+e.alternateAngle:Math.random()*2*Math.PI;let s=Ze(e.whorlSizes);for(let n=0;n<s;n++){let r=e.verticalSlopeRange[0]+Math.random()*(e.verticalSlopeRange[1]-e.verticalSlopeRange[0]),o=e.deathRange[0]+Math.random()*(e.deathRange[1]-e.deathRange[0]),c=e.radiusRange[0]+Math.random()*(e.radiusRange[1]-e.radiusRange[0]),l=n/s*2*Math.PI,u={zStart:i%e.zRange,xyAngle:(a+l)%(2*Math.PI),initialSlope:r,death:o,radius:c};t.push(u)}i+=e.zRange*r[o]}return t}generateRadialProfile(e){let t=this.woodConfig,n=Math.max(1,Math.round(t.ageAtOne)),r=Z.generateNoise1D(n,t.ringWidthNoiseAlpha).map(e=>Math.exp(t.ringWidthDispersion*e)),i=r.reduce((e,t)=>e+t,0);for(let e=0;e<n;e++)r[e]/=i;let a=[0],o=0;for(let e=0;e<n;e++)o+=r[e],a.push(o);a[n]=1;let s=t.heartwoodRadius-t.transitionWidth/2,c=t.heartwoodRadius+t.transitionWidth/2,l=2*e,u=new Float32Array(4*l),d=Z.generateNoise1D(n,1),f=Z.generateNoise1D(e,1),p=1;for(let r=0;r<l;r++){let i=r/e,o=t.sapwoodColor;if(i<=1){let e=et(s,c,i);o=Qe(t.heartwoodColor,t.sapwoodColor,e)}let l=0,m=0;if(r===e&&(p=1),r<e){for(;p<n&&i>=a[p];)p++;l=p,m=(i-a[p-1])/(a[p]-a[p-1])}else{for(;p<n&&i-1>=a[p];)p++;l=p+n,m=(i-1-a[p-1])/(a[p]-a[p-1])}let h=m**+t.ringShapeExponent,g=Qe($e(o,t.earlywoodLighten),$e(o,t.latewoodDarken),h),_=d[l%n]*t.yearlyNoiseAmplitude+f[r%e]*t.grainNoiseAmplitude;u[4*r+0]=X(g.x+_),u[4*r+1]=X(g.y+_),u[4*r+2]=X(g.z+_),u[4*r+3]=1}return u}},ot=class e{static{this.MAX_WOOD_TYPES=4}static{this.MAX_BRANCHES=1024}static{this.PROFILE_WIDTH=2048}static{this.setupResolution=new S(256,512*e.MAX_WOOD_TYPES)}constructor(t,n,r){this.uniforms={zRanges:Array.from({length:e.MAX_WOOD_TYPES},()=>new h(new I)),branchIndices:Array.from({length:e.MAX_WOOD_TYPES},()=>new h(new I)),knotColors:Array.from({length:e.MAX_WOOD_TYPES},()=>new h(new I)),branchesZASD:Array.from({length:e.MAX_BRANCHES},()=>new h(new I)),branchesR:Array.from({length:e.MAX_BRANCHES},()=>new h(new I))},this.woodSetups=[];let i=new Float32Array(8*e.MAX_WOOD_TYPES*e.PROFILE_WIDTH),a=0,o=0;for(let t=0;t<e.MAX_WOOD_TYPES;t++){let n=new at(e.PROFILE_WIDTH,r[t]);this.woodSetups.push(n);let s=n.branches.length,c=n.woodConfig.zRange;this.uniforms.zRanges[t].value.set(o,o+c,c,0),this.uniforms.branchIndices[t].value.set(a,a+s,s,0),this.uniforms.knotColors[t].value.set(...n.woodConfig.knotColor,1);for(let e=0;e<s;e++){let t=n.branches[e],r=a+e;this.uniforms.branchesZASD[r].value.x=t.zStart,this.uniforms.branchesZASD[r].value.y=t.xyAngle,this.uniforms.branchesZASD[r].value.z=t.initialSlope,this.uniforms.branchesZASD[r].value.w=t.death,this.uniforms.branchesR[r].value.x=t.radius}a+=s,o+=n.woodConfig.zRange;let l=8*e.PROFILE_WIDTH;i.set(n.profile,t*l)}this.ubo=new p,this.ubo.setName(`branchUBO`),this.ubo.add(this.uniforms.zRanges),this.ubo.add(this.uniforms.branchIndices),this.ubo.add(this.uniforms.knotColors),this.ubo.add(this.uniforms.branchesZASD),this.ubo.add(this.uniforms.branchesR),this.setupRT=new g(e.setupResolution.x,e.setupResolution.y,{count:2,format:N,type:u,minFilter:_,magFilter:_,wrapS:D,wrapT:D}),this.setupMaterial=new k({uniforms:{resolution:{value:e.setupResolution}},vertexShader:W(`vsPlain`,t),fragmentShader:W(`fsWoodSetup`,t),uniformsGroups:[this.ubo],depthWrite:!1,depthTest:!1,glslVersion:E}),n.addToShaderMaterial(this.setupMaterial),this.profileTexture=new m(i,e.PROFILE_WIDTH,2*e.MAX_WOOD_TYPES),this.profileTexture.type=u,this.profileTexture.format=N,this.profileTexture.wrapT=de,this.profileTexture.magFilter=O,this.profileTexture.minFilter=O,this.profileTexture.needsUpdate=!0}addToShaderMaterial(e,t){e.uniformsGroups.push(this.ubo),e.uniforms.branchIndexTex={value:this.setupRT.textures[0]},e.uniforms.profileTexture={value:this.profileTexture},e.uniforms.woodTypeIndex={value:t},e.defines.USE_WOOD=!0,e.needsUpdate=!0}computeSetupRTTextureStats(e){let t=this.setupRT.width,n=this.setupRT.height,r=t*n,i=new Float32Array(r*4);e.readRenderTargetPixels(this.setupRT,0,0,t,n,i,0,1);let a=new Float32Array(r),o=[`r`,`g`,`b`,`a`],s={};for(let e=0;e<4;e++){for(let t=0;t<r;t++)a[t]=i[t*4+e];let t=tt(a);s[o[e]]=t}return s}dispose(){this.profileTexture.dispose(),this.ubo.dispose(),this.setupRT.dispose(),this.setupMaterial.dispose()}},st=class e{constructor(){this.noise3d=e.noiseTexture3D(64,3)}static noiseTexture3D(e,t){let n=e*e*e,r=new Float32Array(4*n);for(let i=0;i<4;i++){let a=Z.generateNoise3D(e,e,e,t),o=1/0,s=-1/0;for(let e=0;e<a.length;e++)o=Math.min(a[e],o),s=Math.max(a[e],s);for(let e=0;e<n;e++){let t=-1+2*(a[e]-o)/(s-o);r[4*e+i]=t}}let i=new pe(r,e,e,e);return i.format=N,i.type=u,i.minFilter=O,i.magFilter=O,i.wrapS=D,i.wrapT=D,i.wrapR=D,i.needsUpdate=!0,i}addToShaderMaterial(e){e.uniforms.noiseTexture={value:this.noise3d},e.defines.USE_NOISE=!0,e.needsUpdate=!0}dispose(){this.noise3d.dispose()}},ct=class{constructor(){this.debug1=new h(new I(0,0,0,0)),this.debug2=new h(new I(0,0,0,0)),this.debugMode=new h(0)}addToShaderMaterial(e){e.uniforms.debug1=this.debug1,e.uniforms.debug2=this.debug2,e.uniforms.debugMode=this.debugMode,e.defines.USE_DEBUG=!0,e.needsUpdate=!0}dispose(){}},lt={name:`Scots_Pine`,zRange:8,whorlSizes:[[3,.3],[4,.5],[5,.2]],whorlNum:8,whorlOffsetDispersion:.12,verticalSlopeRange:[.8,1.2],radiusRange:[.2,.3],deathRange:[.1,.7],medullaryRayFrequency:0,knotColor:[.25,.12,.08],heartwoodColor:{x:.65,y:.42,z:.28},sapwoodColor:{x:.82,y:.72,z:.53},heartwoodRadius:.65,transitionWidth:.05,ageAtOne:40,ringWidthDispersion:.18,ringWidthNoiseAlpha:.15,ringShapeExponent:7,earlywoodLighten:1.08,latewoodDarken:.55,yearlyNoiseAmplitude:.05,grainNoiseAmplitude:.03},ut={name:`European_Beech`,zRange:8,whorlSizes:[[1,1]],whorlNum:24,whorlOffsetDispersion:.08,verticalSlopeRange:[1.1,1.5],radiusRange:[.15,.22],deathRange:[.4,.9],medullaryRayFrequency:18,alternateAngle:2.4,knotColor:[.3,.2,.15],heartwoodColor:{x:.68,y:.52,z:.42},sapwoodColor:{x:.74,y:.61,z:.48},heartwoodRadius:.4,transitionWidth:.35,ageAtOne:70,ringWidthDispersion:.08,ringWidthNoiseAlpha:.05,ringShapeExponent:2.2,earlywoodLighten:1.03,latewoodDarken:.88,yearlyNoiseAmplitude:.02,grainNoiseAmplitude:.04},dt={name:`Sugar_Maple`,zRange:8,whorlSizes:[[2,1]],whorlNum:14,whorlOffsetDispersion:.1,verticalSlopeRange:[1,1.3],radiusRange:[.15,.2],deathRange:[.3,.8],medullaryRayFrequency:5,knotColor:[.35,.25,.15],heartwoodColor:{x:.55,y:.38,z:.28},sapwoodColor:{x:.88,y:.82,z:.68},heartwoodRadius:.25,transitionWidth:.15,ageAtOne:55,ringWidthDispersion:.12,ringWidthNoiseAlpha:.08,ringShapeExponent:3,earlywoodLighten:1.02,latewoodDarken:.82,yearlyNoiseAmplitude:.015,grainNoiseAmplitude:.02},ft={name:`English_Oak`,zRange:8,whorlSizes:[[1,1]],whorlNum:10,whorlOffsetDispersion:.2,verticalSlopeRange:[1.2,1.6],radiusRange:[.2,.3],deathRange:[.2,.7],medullaryRayFrequency:28,alternateAngle:2.4,knotColor:[.2,.15,.1],heartwoodColor:{x:.52,y:.41,z:.31},sapwoodColor:{x:.78,y:.71,z:.58},heartwoodRadius:.75,transitionWidth:.08,ageAtOne:50,ringWidthDispersion:.22,ringWidthNoiseAlpha:.18,ringShapeExponent:4.5,earlywoodLighten:1.12,latewoodDarken:.72,yearlyNoiseAmplitude:.06,grainNoiseAmplitude:.05},pt={name:`Black_Walnut_Parquet`,zRange:8,whorlSizes:[[1,1]],whorlNum:12,whorlOffsetDispersion:.15,verticalSlopeRange:[.2,.4],radiusRange:[.2,.3],deathRange:[.1,.4],medullaryRayFrequency:2,alternateAngle:2.4,knotColor:[.15,.1,.08],heartwoodColor:{x:.38,y:.27,z:.2},sapwoodColor:{x:.82,y:.74,z:.6},heartwoodRadius:.72,transitionWidth:.12,ageAtOne:50,ringWidthDispersion:.14,ringWidthNoiseAlpha:.1,ringShapeExponent:4,earlywoodLighten:1.05,latewoodDarken:.78,yearlyNoiseAmplitude:.03,grainNoiseAmplitude:.04},Q=He(Object.assign({"./shaders/fsCompositeClip.glsl":H,"./shaders/fsCompositeRegular.glsl":ge,"./shaders/fsCopyTexture.glsl":_e,"./shaders/fsGeom.glsl":ve,"./shaders/fsGeomNormals.glsl":ye,"./shaders/fsShadowClip.glsl":be,"./shaders/fsShadowGeom.glsl":U,"./shaders/fsShadowRegular.glsl":xe,"./shaders/sCommon.glsl":Se,"./shaders/sGlobalUBO.glsl":Ce,"./shaders/sPBR.glsl":we,"./shaders/sVolume.glsl":Te,"./shaders/solid/fsParquet.glsl":Ee,"./shaders/solid/fsPlywood.glsl":De,"./shaders/solid/fsSolid.glsl":Oe,"./shaders/solid/fsVeneer.glsl":ke,"./shaders/solid/fsWoodSetup.glsl":Ae,"./shaders/solid/sExtensions.glsl":je,"./shaders/solid/sSolidTex.glsl":Me,"./shaders/solid/sTrunkPeel.glsl":Ne,"./shaders/solid/sWood.glsl":Pe,"./shaders/solid/sWoodOld.glsl":Fe,"./shaders/solid/vsParquet.glsl":Ie,"./shaders/solid/vsPlywood.glsl":Le,"./shaders/solid/vsSolid.glsl":Re,"./shaders/solid/vsVeneer.glsl":ze,"./shaders/vs.glsl":Be,"./shaders/vsPlain.glsl":Ve})),mt=class{constructor(e){this.cleanUpTasks=[],this.animationRequestID=null,this.lastTime=0,this.isStopped=!1,this.updateClip=!1,this.useHelperScene=!0,this.container=e,this.isInitialized=!1,x.DEFAULT_UP.set(0,0,1)}async init(e){if(this.renderer=new fe({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,1),this.container.appendChild(this.renderer.domElement),this.font=new B,await this.font.load(`times64`),this.setupCamera(),this.setupScene(),this.setupResizeRenderer(),this.createGUI(),this.isInitialized=!0,e.aborted){this.dispose();return}this.animate=this.animate.bind(this),this.animate()}dispose(){if(this.isInitialized){this.animationRequestID&&cancelAnimationFrame(this.animationRequestID),this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.font?.dispose(),this.woodScene?.dispose(),this.splineGroup?.dispose(),this.material?.dispose(),this.woodExtension.dispose(),this.noiseExtension.dispose(),this.debugExtension.dispose(),this.renderer.dispose(),this.controls?.dispose(),this.gui.destroy()}}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let{clientWidth:e,clientHeight:t}=this.container;console.log(`Resize! (${e}, ${t})`),this.renderer.setSize(e,t);let n=e/t;this.mainCamera.aspect=n,this.mainCamera.updateProjectionMatrix();let r=new S;this.renderer.getDrawingBufferSize(r),this.material.uniforms.resolution.value=r,this.splineGroup?.setResolution(this.renderer)}setupResizeRenderer(){let e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container))}createGUI(){this.gui=new R({container:this.container}),this.container.style.position=`relative`,this.gui.domElement.style.position=`absolute`,this.gui.domElement.style.top=`0px`,this.gui.domElement.style.right=`0px`;let e={animateButton:()=>this.animateStep(!0),toggleStop:()=>{this.isStopped=!this.isStopped},debugInfo:()=>{console.log(`time`,this.lastTime),console.log(`camera`,this.mainCamera.position)},debug1x:this.debugExtension.debug1.value.x,debug1y:this.debugExtension.debug1.value.y,debug1z:this.debugExtension.debug1.value.z,debug1w:this.debugExtension.debug1.value.w,debug2x:this.debugExtension.debug2.value.x,debug2y:this.debugExtension.debug2.value.y,debug2z:this.debugExtension.debug2.value.z,debug2w:this.debugExtension.debug2.value.w,debugMode:this.debugExtension.debugMode.value,updateClip:this.updateClip,useHelperScene:this.useHelperScene};this.gui.add(e,`animateButton`).name(`Animate step`),this.gui.add(e,`toggleStop`).name(`Toggle stop/play`),this.gui.add(e,`debugInfo`).name(`Debug info`),this.gui.add(e,`debugMode`,0,10,1).name(`debugMode`).onChange(e=>{this.debugExtension.debugMode.value=e}),this.gui.add(e,`debug1x`,0,1).name(`debug1.x`).onChange(e=>{this.debugExtension.debug1.value.x=e}),this.gui.add(e,`debug1y`,0,1).name(`debug1.y`).onChange(e=>{this.debugExtension.debug1.value.y=e}),this.gui.add(e,`debug1z`,0,1).name(`debug1.z`).onChange(e=>{this.debugExtension.debug1.value.z=e}),this.gui.add(e,`debug1w`,0,1).name(`debug1.w`).onChange(e=>{this.debugExtension.debug1.value.w=e}),this.gui.add(e,`debug2x`,0,1).name(`debug2.x`).onChange(e=>{this.debugExtension.debug2.value.x=e}),this.gui.add(e,`debug2y`,0,1).name(`debug2.y`).onChange(e=>{this.debugExtension.debug2.value.y=e}),this.gui.add(e,`debug2z`,0,1).name(`debug2.z`).onChange(e=>{this.debugExtension.debug2.value.z=e}),this.gui.add(e,`debug2w`,0,1).name(`debug2.w`).onChange(e=>{this.debugExtension.debug2.value.w=e}),this.gui.add(e,`updateClip`).name(`Update clip direction`).onChange(e=>{this.updateClip=e}),this.gui.add(e,`useHelperScene`).name(`Use helper scene`).onChange(e=>{this.useHelperScene=e,this.resetCamera()}),this.gui.close()}setupCamera(){this.mainCamera=new v,this.controls=new L(this.mainCamera,this.renderer.domElement),this.resetCamera(),this.mainCamera.lookAt(new T(0,0,0)),this.quadCamera=new P,this.quadCamera.position.set(0,0,1)}resetCamera(){if(this.useHelperScene)this.mainCamera.position.set(6,.5,4);else{let e=.5;this.mainCamera.position.set(3.5*e,2.5*e,3*e)}}setupScene(){let e=[lt,ut,dt,pt,ft];this.noiseExtension=new st,this.debugExtension=new ct,this.woodExtension=new ot(Q,this.noiseExtension,e),this.material=new k({uniforms:{cameraPos:{value:new T},cameraNearFar:{value:new S},vMat:{value:null},pvMat:{value:null},pvMatInv:{value:null},resolution:{value:new S},time:{value:null},clipPlane:{value:new I(1,0,0,0)}},vertexShader:W(`vsSolid`,Q),fragmentShader:W(`fsSolid`,Q),depthWrite:!0,depthTest:!0,glslVersion:E}),this.woodExtension.addToShaderMaterial(this.material,0),this.noiseExtension.addToShaderMaterial(this.material),this.debugExtension.addToShaderMaterial(this.material),this.quadScene=new A;let t=new j(new ae(2,2),this.material);this.quadScene.add(t),this.helperScene=new A,new j(new d(1,1,10),new ee);let n=new j(new F,new w({map:this.woodExtension.setupRT.textures[0]}));this.helperScene.add(n),this.renderer.setRenderTarget(this.woodExtension.setupRT),this.quadScene.overrideMaterial=this.woodExtension.setupMaterial,this.renderer.render(this.quadScene,this.quadCamera),console.table(this.woodExtension.computeSetupRTTextureStats(this.renderer)),this.woodScene=new Ye(Q,this.woodExtension,this.noiseExtension,this.debugExtension,this.font)}getResolution(){let{clientWidth:e,clientHeight:t}=this.container;return new S(e,t)}animate(){this.controls.update(),this.animateStep(!1),this.animationRequestID=requestAnimationFrame(this.animate)}animateStep(e){if(!this.isStopped||e){let e=(this.lastTime??0)+.002;this.lastTime=e;let t=Math.max(-.95,1.2*Math.sin(10*e));this.material.uniforms.clipPlane.value.w=t}if(this.updateClip){let e=this.mainCamera.getWorldDirection(new T);this.material.uniforms.clipPlane.value.x=-e.x,this.material.uniforms.clipPlane.value.y=-e.y,this.material.uniforms.clipPlane.value.z=-e.z}this.render()}render(){let e=this.lastTime;this.material.uniforms.cameraNearFar.value.set(this.mainCamera.near,this.mainCamera.far),this.material.uniforms.cameraPos.value=this.mainCamera.position;let t=this.mainCamera.matrixWorldInverse,n=this.mainCamera.projectionMatrix;this.material.uniforms.vMat.value=t,this.material.uniforms.pvMat.value=n.clone().multiply(t),this.material.uniforms.pvMatInv.value=n.clone().multiply(t).invert(),this.material.uniforms.time.value=e,this.renderer.setRenderTarget(null),this.useHelperScene?(this.woodScene.prepareRender(this),this.renderer.render(this.woodScene,this.mainCamera)):(this.quadScene.overrideMaterial=null,this.renderer.render(this.quadScene,this.quadCamera))}},$=n(),ht=({solidTest:e})=>{let t=(0,V.useRef)(null);return(0,V.useEffect)(()=>{console.log(`useEffect: `,t.current);let n=new AbortController,r=e?new mt(t.current):new Je(t.current);return r.init(n.signal),()=>{n.abort(),r.dispose()}},[]),(0,$.jsx)(`div`,{ref:t,style:{width:`100%`,height:`100%`}})},gt=({solidTest:e})=>(0,$.jsxs)(a,{maxWidth:`xl`,children:[(0,$.jsx)(r,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,$.jsxs)(i,{variant:`h2`,children:[e&&`Solid textures and wood`,!e&&`Solid textures and clipping`]})}),(0,$.jsx)(r,{style:{width:`100%`,height:`600px`},children:(0,$.jsx)(ht,{solidTest:e})}),e&&(0,$.jsx)(r,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,$.jsxs)(i,{variant:`body1`,children:[`Based and modified from: "Procedural texturing of solid wood with knots." Larsson, M., et al.`,(0,$.jsx)(`em`,{children:`ACM Trans. Graph.`}),`, vol. 41, no. 4, 2022.`]})}),(0,$.jsx)(o,{component:s,to:`/`,variant:`body1`,color:`primary`,children:`Back`})]});export{gt as default};