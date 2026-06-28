// Shadows reference: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js

#include <sCommon>
#include <sPBR>

#include <sGlobalUBO>

#include <sSolidTex>

uniform sampler2D frontTex;
uniform sampler2D frontDepthTex;
uniform sampler2D frontNormalTex;

uniform sampler2DShadow shadowMaps[MAX_LIGHTS];

in vec3 vPos;
in vec2 vUv;

layout(location = 0) out vec4 outColor;


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
    float opaqueDepth = texture(frontDepthTex, vUv).r;
    float fTexColor = texture(frontTex, vUv).r;
    int fObjectId = int(round(fTexColor * 1024.0));

    if (fObjectId == 0) {
        // miss
        discard;
    }

    vec3 op = worldPosition(opaqueDepth);
    vec3 opaqueColor = solid_compound(op, fObjectId);

    vec3 normal = octDecode(texture(frontNormalTex, vUv).xy);

    vec3 oWeights[MAX_LIGHTS];
    computeWeights(oWeights, op, normal, opaqueColor, debug2, 0.0);

    vec3 color = computeLight(oWeights, op, normal);

    color = linearToSRGB(ACESFilm(color));
    gl_FragDepth = opaqueDepth;
    outColor = vec4(color, 0.0);
}