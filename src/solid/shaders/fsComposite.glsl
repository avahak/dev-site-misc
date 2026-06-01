// Shadows reference: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js

#include <sCommon>
#include <sSolidTex>

uniform vec2 resolution;
uniform vec3 cameraPos;
uniform mat4 vpMat;         // view-projection matrix of the main camera
uniform mat4 invVpMat;      // inverse of vpMap
uniform float time;
uniform sampler2D opaqueDepthTex;
uniform sampler2D opaqueColorTex;
uniform sampler2D frontNormalTex;
uniform sampler2D regularTex;
uniform sampler2D regularDepthTex;
uniform sampler2D regularNormalTex;

#define MAX_LIGHTS 4
uniform mat4 shadowMatrices[MAX_LIGHTS];
uniform vec3 lightPositions[MAX_LIGHTS];
uniform float shadowMapSize;
uniform float shadowRadius;
uniform int numLights;
uniform sampler2DShadow shadowMapsClip[MAX_LIGHTS];
uniform sampler2DShadow shadowMapsRegular[MAX_LIGHTS];

uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;

in vec4 vPos;
in vec2 vUv;

layout(location = 0) out vec4 outColor;

#include <sVolume>


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

    float phi = interleavedGradientNoise(gl_FragCoord.xy) * TAU;
    float sum = 0.0;
    for (int k = 0; k < 5; k++) {
        vec2 offset = vogelDiskSample(k, 5, phi) * shadowRadius/shadowMapSize;
        vec3 v = vec3(shadowCoord.xy + offset, shadowCoord.z);
        float result = texture(shadowMap, v);
        sum += 0.2*result;
    }

    return sum;
}

float computeShadows(vec3 worldPos, vec3 normal, int useClip) {
    float sum = 0.0; 
    for (int k = 0; k < MAX_LIGHTS; k++) {
        if (k >= numLights)
            break;
        vec3 lightPos = lightPositions[k];
        vec3 lightDir = normalize(lightPos - worldPos);
        float dp = dot(normal, lightDir);
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
        sum += term * max(dp, 0.0);
    }
    sum = clamp(sum/float(numLights), 0.0, 1.0);
    float ambient = 0.25;
    return mix(ambient, 1.0, sum);
}


vec3 worldPosition(float depth) {
    vec3 ndc = 2.0*vec3(gl_FragCoord.xy/resolution, depth) - 1.0;
    vec4 ph = invVpMat * vec4(ndc, 1.0);
    return ph.xyz / ph.w;
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

    // float oShadow = computeShadows(op, normal, 1);
    float oShadow = debug3*computeShadows(op, normal, 1) + (1.0-debug3)*computeShadows(op, normal, 0);
    opaqueColor *= (state < 2) ? oShadow : 1.0;

    vec3 color = opaqueColor;

    if ((rObjectId > 0) && (rDepth < opaqueDepth)) {
        // Add regular objects in front of opaque ones semitransparently
        vec3 rp = worldPosition(rDepth);
        vec3 rNormal = octDecode(texture(regularNormalTex, vUv).xy);
        float rShadow = computeShadows(rp, rNormal, 0);
        vec3 rColor = solid_compound(rp, rObjectId) * rShadow;

        color = debug3*opaqueColor + (1.0-debug3)*rColor;
    }

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