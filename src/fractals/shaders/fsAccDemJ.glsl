precision highp float;

uniform sampler2D juliaMap;
uniform sampler2D accumulatorMap;
uniform vec2 resolution;
uniform int restart;            // 1: restart from zero
varying vec4 vPosition;
varying vec2 vUv;

#define PI 3.14159265359

vec4 getColor(vec2 uv) {
    vec4 tex = texture2D(juliaMap, uv);
    vec2 z = tex.xy;
    vec2 w = tex.zw;

    float rz2 = z.x*z.x + z.y*z.y;
    float rw2 = w.x*w.x + w.y*w.y;

    if (rz2 < 100.0)
        return vec4(0.0, 0.0, 1.0, 1.0);        // 0
    if (rw2 > 1.0e24)
        return vec4(0.0, 0.0, 1.0, 1.0);        // -1

    float d = sqrt(rz2/rw2)*log(rz2);

    float b = 0.5;

    float s = log(d/b);

    if (d > b)
        return vec4(0.0, 0.0, 0.0, 1.0);

    if (d > 0.1*b) {
        float t = smoothstep(0.1*b, b, d);
        return vec4(mix(vec3(0.1, 0.1, 0.1), vec3(0.0, 0.0, 0.0), t), 1.0);
    }

    if (d > 0.01*b) {
        float t = smoothstep(0.01*b, 0.1*b, d);
        return vec4(mix(vec3(0.2, 0.2, 0.2), vec3(0.1, 0.1, 0.1), t), 1.0);
    }

    if (d > 0.001*b) {
        float t = smoothstep(0.001*b, 0.01*b, d);
        return vec4(mix(vec3(0.4, 0.4, 0.4), vec3(0.2, 0.2, 0.2), t), 1.0);
    }

    float t = smoothstep(0.0, 0.001*b, d);
    return vec4(mix(vec3(1.0, 1.0, 1.0), vec3(0.4, 0.4, 0.4), t), 1.0);
}

void main() {
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);
    float iter = accOld.a;
    vec4 color = getColor(vUv);
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);
    gl_FragColor = vec4(accNewColor, iter+1.0);
}