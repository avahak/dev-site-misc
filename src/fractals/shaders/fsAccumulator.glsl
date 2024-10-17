precision highp float;

uniform sampler2D mandelMap;
uniform sampler2D accumulatorMap;
uniform vec2 resolution;
uniform int restart;            // 1: restart from zero
varying vec4 vPosition;
varying vec2 vUv;

#define PI 3.14159265359

vec3 hsv2rgb(vec3 c) {
    // Source: https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 getColor(vec2 uv) {
    vec4 tex = texture2D(mandelMap, uv);
    vec2 z = tex.xy;
    float iter = tex.z;

    float r2 = z.x*z.x + z.y*z.y;
    iter = iter - log(log(r2)/log(100.0))/log(2.0);

    if (r2 < 4.0)
        return vec4(0.0, 0.0, 0.0, 1.0);

    return vec4(hsv2rgb(vec3(fract(0.5*log(1.0+iter)), 0.9, 0.7)), 1.0);
}

void main() {
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);
    float iter = accOld.a;
    vec4 color = getColor(vUv);
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);
    gl_FragColor = vec4(accNewColor, iter+1.0);
}