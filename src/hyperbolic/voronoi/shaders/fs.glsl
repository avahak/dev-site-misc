precision highp float;

uniform vec2 resolution;
uniform float time;
uniform int u_sideCount;

#define MAX_SIDES 12

uniform vec4 u_T_re[MAX_SIDES];
uniform vec4 u_T_im[MAX_SIDES];

uniform vec4 u_g_re[MAX_SIDES];
uniform vec4 u_g_im[MAX_SIDES];

// Base texture uniforms
uniform sampler2D u_paintTexture;
uniform float u_R_tex;

// Panning / rotation
uniform vec4 u_gView_re;
uniform vec4 u_gView_im;
uniform float scale;

varying vec2 vUv;

const int MAX_ITER = 128;

vec2 c_mul(vec2 u, vec2 v) {
    return vec2(u.x * v.x - u.y * v.y, u.x * v.y + u.y * v.x);
}

vec2 c_div(vec2 u, vec2 v) {
    float denom = dot(v, v);
    return vec2(dot(u, v), u.y * v.x - u.x * v.y) / max(denom, 1e-10);
}

vec2 applyMobius(vec4 mRe, vec4 mIm, vec2 z) {
    vec2 a = vec2(mRe.x, mIm.x);
    vec2 b = vec2(mRe.y, mIm.y);
    vec2 c = vec2(mRe.z, mIm.z);
    vec2 d = vec2(mRe.w, mIm.w);

    vec2 num = c_mul(a, z) + b;
    vec2 den = c_mul(c, z) + d;
    return c_div(num, den);
}

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y) * scale;
    float r = length(st);

    if (r >= 1.0) {
        if (r < 1.01) {
            gl_FragColor = vec4(0.8, 0.8, 0.85, 1.0);
        } else {
            // gl_FragColor = vec4(0.05, 0.05, 0.07, 1.0);
            gl_FragColor = texture2D(u_paintTexture, gl_FragCoord.xy/resolution);
        }
        return;
    }

    vec2 z = applyMobius(u_gView_re, u_gView_im, st);
    int steps = 0;
    bool inFundamentalPolygon = false;

    // Fold screen point z back into fundamental polygon P_0
    for (int iter = 0; iter < MAX_ITER; iter++) {
        bool moved = false;
        for (int i = 0; i < MAX_SIDES; i++) {
            if (i >= u_sideCount) break;

            vec2 Tz = applyMobius(u_T_re[i], u_T_im[i], z);
            if (Tz.y <= 0.0) {
                z = applyMobius(u_g_re[i], u_g_im[i], z);
                moved = true;
                steps++;
                break;
            }
        }
        if (!moved) {
            inFundamentalPolygon = true;
            break;
        }
    }

    if (inFundamentalPolygon) {
        vec2 texUv = (z / u_R_tex) * 0.5 + 0.5;
        vec4 paintColor = texture2D(u_paintTexture, texUv);

        float edgeDim = 1.0 - min(float(steps) * 0.015, 0.4);
        gl_FragColor = vec4(paintColor.rgb * edgeDim, 1.0);
    } else {
        gl_FragColor = vec4(0.1, 0.1, 0.15, 1.0);
    }
}