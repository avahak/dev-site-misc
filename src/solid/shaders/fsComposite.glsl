// Shadows reference: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js

#include <sCommon>
#include <sSolidTex>
#include <sPBR>

#include <sGlobalUBO>

uniform vec2 resolution;
uniform sampler2D opaqueDepthTex;
uniform sampler2D opaqueColorTex;
uniform sampler2D frontNormalTex;
uniform sampler2D regularTex;
uniform sampler2D regularDepthTex;
uniform sampler2D regularNormalTex;

uniform sampler2DShadow shadowMapsClip[MAX_LIGHTS];
uniform sampler2DShadow shadowMapsRegular[MAX_LIGHTS];

in vec4 vPos;
in vec2 vUv;

layout(location = 0) out vec4 outColor;

#include <sVolume>


vec3 worldPosition(float depth) {
    vec3 ndc = 2.0*vec3(gl_FragCoord.xy/resolution, depth) - 1.0;
    vec4 ph = invVpMat * vec4(ndc, 1.0);
    return ph.xyz / ph.w;
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

float computeShadow(vec3 worldPos, vec3 normal, int useClip, int k) {
    float term;
    switch (k) {
        case 0: 
            term = (useClip == 1) ?
                computeShadowTerm(worldPos, normal, k, shadowMapsClip[0]) : 
                computeShadowTerm(worldPos, normal, k, shadowMapsRegular[0]);
            break;
        case 1: 
            term = (useClip == 1) ?
                computeShadowTerm(worldPos, normal, k, shadowMapsClip[1]) : 
                computeShadowTerm(worldPos, normal, k, shadowMapsRegular[1]);
            break;
        case 2: 
            term = (useClip == 1) ?
                computeShadowTerm(worldPos, normal, k, shadowMapsClip[2]) : 
                computeShadowTerm(worldPos, normal, k, shadowMapsRegular[2]);
            break;
        case 3: 
            term = (useClip == 1) ?
                computeShadowTerm(worldPos, normal, k, shadowMapsClip[3]) : 
                computeShadowTerm(worldPos, normal, k, shadowMapsRegular[3]);
            break;
    }
    return term;
}



// vec3 evalDirectLight(
//     vec3 P, vec3 N, vec3 camPos, 
//     vec3 baseColor, float roughness, float metallic, 
//     vec3 lightPos, vec3 lightColor, float lightIntensity
// ) {


void computeWeights(out vec3 weights[MAX_LIGHTS], vec3 P, vec3 N, vec3 baseColor, float roughness, float metallic) {
    for (int k = 0; k < MAX_LIGHTS; k++) {
        if (k >= int(round(numLights)))
            break;
        vec3 lPos = lightPos[k].xyz;
        weights[k] = evalDirectLightWeighting(P, N, cameraPos, baseColor, roughness, metallic, lPos);
    }
}

vec3 computeLight(in vec3 weights[MAX_LIGHTS], vec3 P, vec3 N, int useClip) {
    vec3 color = vec3(0.0);
    for (int k = 0; k < MAX_LIGHTS; k++) {
        if (k >= int(round(numLights)))
            break;

        vec3 lPos = lightPos[k].xyz;
        float lRadius = lightPos[k].w;
        float x = 1.0 + length(P - lPos)/lRadius;

        float shadow = computeShadow(P, N, useClip, k);
        vec3 radiance = lightCol[k].xyz * shadow * lightCol[k].w / (x*x);

        color += radiance * weights[k];
    }
    return color;
}


void main() {
    float rTexColor = texture(regularTex, vUv).r;
    float opaqueDepth = texture(opaqueDepthTex, vUv).r;
    vec4 opaqueColor4 = texture(opaqueColorTex, vUv);
    vec3 opaqueColor = opaqueColor4.rgb;
    vec3 op = worldPosition(opaqueDepth);
    int state = clamp(int(round(opaqueColor4.a*100.0)), 0, 2);
    // State 0:front, 1:volume, 2:external opaque addition. Regular render is not part of state
    float rDepth = texture(regularDepthTex, vUv).r;
    int rObjectId = int(round(rTexColor * 1024.0));

    vec3 fNormal = octDecode(texture(frontNormalTex, vUv).xy);
    vec3 normal = (state == 1) ? evalVolumeNormal(op) : fNormal;

    vec3 oWeights[MAX_LIGHTS];
    computeWeights(oWeights, op, normal, opaqueColor, debug2, 0.0);

    vec3 color = (1.0-debug3)*computeLight(oWeights, op, normal, 1) + debug3*computeLight(oWeights, op, normal, 0);
    color = (state >= 2) ? opaqueColor : color;

    if ((rObjectId > 0) && (rDepth < opaqueDepth)) {
        // Add regular objects in front of opaque ones semitransparently
        vec3 rp = worldPosition(rDepth);
        vec3 rNormal = octDecode(texture(regularNormalTex, vUv).xy);
        // float rShadow = computeShadows(rp, rNormal, 0);
        vec3 rColor = solid_compound(rp, rObjectId);

        vec3 rWeights[MAX_LIGHTS];
        computeWeights(rWeights, rp, rNormal, rColor, debug2, 0.0);

        rColor = computeLight(rWeights, rp, rNormal, 0);

        color = (1.0-debug3)*color + debug3*rColor;
    }

    color = linearToSRGB(ACESFilm(color));
    outColor = vec4(color, 1.0);

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