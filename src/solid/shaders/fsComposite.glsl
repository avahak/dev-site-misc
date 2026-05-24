#include <sCommon>
#include <sSolidTex>

uniform vec2 resolution;
uniform vec3 cameraPos;
uniform mat4 vpMat;         // view-projection matrix of the main camera
uniform mat4 invVpMat;      // inverse of vpMap
uniform float time;
uniform sampler2D opaqueDepthTex;
uniform sampler2D opaqueColorTex;
uniform sampler2D regularTex;

#define MAX_LIGHTS 4
uniform sampler2D shadowMaps[MAX_LIGHTS];
uniform mat4 shadowMatrices[MAX_LIGHTS];
uniform float shadowMapSize;
uniform int numLights;

uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;

in vec4 vPos;
in vec2 vUv;
in mat4 pvmMat;


float unpackRGBAToDepth(vec4 v) {
    // https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/packing.glsl.js
    const float UnpackDownscale = 255. / 256.;
    const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
    const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
    return dot(v, UnpackFactors4);
}

float computeShadow0(vec3 worldPos) {
    vec4 shadowCoord = shadowMatrices[0] * vec4(worldPos, 1.0);
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z -= 1e-4;     // bias
    float depthInMap = unpackRGBAToDepth(texture(shadowMaps[0], shadowCoord.xy));

    return ((shadowCoord.z > depthInMap) ? 0.5 : 1.0);
}

vec4 sampleShadowMap(int k, vec2 uv) {
    switch (k) {
        case 0: return texture(shadowMaps[0], uv);
        case 1: return texture(shadowMaps[1], uv);
        case 2: return texture(shadowMaps[2], uv);
        case 3: return texture(shadowMaps[3], uv);
    }
    return vec4(0.0);
}

float computeShadows(vec3 worldPos) {
    float shadow = 1.0;
    for (int k = 0; k < MAX_LIGHTS; k++) {
        if (k >= numLights) 
            break;

        vec4 shadowCoord = shadowMatrices[k] * vec4(worldPos, 1.0);
        shadowCoord.xyz /= shadowCoord.w;
        shadowCoord.z -= 1e-4;     // bias

        float depthInMap = unpackRGBAToDepth(sampleShadowMap(k, shadowCoord.xy));

        shadow *= ((shadowCoord.z > depthInMap) ? 0.5 : 1.0);
    }
    return shadow;
}

vec3 worldPosition(float depth) {
    vec3 ndc = 2.0*vec3(vUv.x, vUv.y, depth) - 1.0;
    vec4 ph = invVpMat * vec4(ndc, 1.0);
    return ph.xyz / ph.w;
}


void main() {
    vec2 rTexColor = texture(regularTex, vUv).rg;
    float opaqueDepth = texture(opaqueDepthTex, vUv).r;
    vec4 opaqueColor4 = texture(opaqueColorTex, vUv);
    vec3 opaqueColor = opaqueColor4.rgb;
    int clipping = (opaqueColor4.a > 0.5) ? 1 : 0;

    float rDepth = rTexColor.r;
    int rObjectId = int(round(rTexColor.g * 1024.0));

    vec3 op = worldPosition(opaqueDepth);
    float oShadow = computeShadows(op);
    opaqueColor *= (clipping == 1) ? 1.0 : oShadow;     // no shadows when clipping

    vec3 color = opaqueColor;

    if ((rObjectId > 0) && (rDepth < opaqueDepth)) {
        // Add regular objects in front of clipping plane semitransparently
        vec3 rp = worldPosition(rDepth);
        float rShadow = computeShadows(rp);
        vec3 rColor = solid_compound(rp, rObjectId) * rShadow;

        color = debug3*opaqueColor + (1.0-debug3)*rColor;
    }

    if (debug4 > 1.0) {
        float s = 2.5+0.1/log(unpackRGBAToDepth(texture(shadowMaps[0], vUv)));
        gl_FragColor = vec4(s, s, s, 1.0);
        return;
    }
    gl_FragColor = vec4(color, 1.0);
}