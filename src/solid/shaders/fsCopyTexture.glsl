#include <sCommon>
#include <sGlobalUBO>

uniform sampler2D clipColorTex;
uniform sampler2D clipDepthTex;
uniform sampler2D regularColorTex;
uniform sampler2D regularDepthTex;

in vec3 vPos;
in vec2 vUv;
in vec3 vNormal;

layout(location = 0) out vec4 outColor;


void main() {
    vec4 c1 = texture(clipColorTex, vUv);
    float d1 = texture(clipDepthTex, vUv).r;
    vec4 c2 = texture(regularColorTex, vUv);
    float d2 = texture(regularDepthTex, vUv).r;

    vec4 col = c1;
    if ((d2 < d1) || (c1.a == 0.0))     // c1.a=0 means color came from front/clip, not overlay
        col = mix(c1, c2, debug3);

    outColor = vec4(col.rgb, 1.0);
}