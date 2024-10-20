precision highp float;

uniform sampler2D mandelMap;
uniform sampler2D accumulatorMap;
uniform vec2 resolution;
uniform int restart;            // 1: restart from zero
uniform float scale;
varying vec4 vPosition;
varying vec2 vUv;

#define PI 3.14159265359

vec3 baseColor = vec3(0.9, 0.9, 1.0);

vec3 hsv2rgb(vec3 c) {
    // Source: https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 getColor(vec2 uv) {
    vec4 tex = texture2D(mandelMap, uv);
    vec2 z = tex.xy;
    vec2 w = tex.zw;

    float rz = length(z);
    float rw = length(w);

    if (rz < 1.0e2)
        return vec4(0.0, 0.0, 0.0, 1.0);        // 0
    if (rw > 1.0e32)
        return vec4(baseColor, 1.0);        // -1

    float d = 2.0*(rz/rw)*log(rz);

    float b = 0.1*scale;

    float s = log(d/b);
    vec3 colorOut = hsv2rgb(vec3(fract(s), 1.0, 1.0));

    if (d > b)
        return vec4(0.0*colorOut, 1.0);

    if (d > 0.1*b) {
        float t = smoothstep(0.1*b, b, d);
        return vec4(mix(0.1*baseColor, vec3(0.0), t), 1.0);
    }

    if (d > 0.01*b) {
        float t = smoothstep(0.01*b, 0.1*b, d);
        return vec4(mix(0.2*baseColor, 0.1*baseColor, t), 1.0);
    }

    if (d > 0.001*b) {
        float t = smoothstep(0.001*b, 0.01*b, d);
        return vec4(mix(0.4*baseColor, 0.2*baseColor, t), 1.0);
    }

    float t = smoothstep(0.0, 0.001*b, d);
    return vec4(mix(baseColor, 0.4*baseColor, t), 1.0);
}

void main() {
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);
    float iter = accOld.a;
    vec4 color = getColor(vUv);
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);
    gl_FragColor = vec4(accNewColor, iter+1.0);
}