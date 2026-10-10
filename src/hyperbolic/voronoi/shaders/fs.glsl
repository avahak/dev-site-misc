precision highp float;

#define MAX_SIDES 12

uniform vec2 resolution;
uniform int u_sideCount;
uniform vec4 u_T_re[MAX_SIDES];
uniform vec4 u_T_im[MAX_SIDES];
uniform vec4 u_g_re[MAX_SIDES];
uniform vec4 u_g_im[MAX_SIDES];
uniform float u_gReflected[MAX_SIDES];
uniform sampler2D u_paintTexture;
uniform float u_R_tex;
uniform vec4 u_gView_re;
uniform vec4 u_gView_im;
uniform float u_gViewReflected;
uniform float u_overlay;
uniform float u_scale;

// Edge overlay uniforms
uniform float u_edgeA[MAX_SIDES];
uniform float u_edgeB[MAX_SIDES];
uniform vec4 u_edgeMapRe[MAX_SIDES];
uniform vec4 u_edgeMapIm[MAX_SIDES];
uniform float u_edgeReflected[MAX_SIDES];

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
    return c_div(c_mul(a, z) + b, c_mul(c, z) + d);
}

vec2 applyMobiusReflected(vec4 mRe, vec4 mIm, vec2 z, float reflected) {
    vec2 z_in = (reflected > 0.5) ? vec2(z.x, -z.y) : z;
    vec2 a = vec2(mRe.x, mIm.x);
    vec2 b = vec2(mRe.y, mIm.y);
    vec2 c = vec2(mRe.z, mIm.z);
    vec2 d = vec2(mRe.w, mIm.w);
    return c_div(c_mul(a, z_in) + b, c_mul(c, z_in) + d);
}

float hypDistToSegment(vec2 z, float a, float b) {
    float u = z.x;
    float v = z.y;
    float zLenSq = dot(z, z);
    float x_star = 0.0;
    if (abs(u) > 1e-6) {
        float disc = (1.0 - zLenSq) * (1.0 - zLenSq) + 4.0 * v * v;
        x_star = (1.0 + zLenSq - sqrt(max(disc, 0.0))) / (2.0 * u);
    }
    float p = clamp(x_star, a, b);
    if (x_star >= a && x_star <= b) {
        return 2.0 * asinh(abs(v) / max(1.0 - zLenSq, 1e-10));
    } else {
        vec2 endpoint = vec2(p, 0.0);
        vec2 diff = z - endpoint;
        vec2 den = vec2(1.0 - endpoint.x * z.x - endpoint.y * z.y, endpoint.x * z.y - z.x * endpoint.y);
        float delta = clamp(length(diff) / max(length(den), 1e-10), 0.0, 0.99999);
        return 2.0 * atanh(delta);
    }
}

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y) * u_scale;
    float r = length(st);

    if (r >= 0.999) {
        gl_FragColor = vec4(0.05, 0.05, 0.05, 1.0);
        return;
    }

    vec2 z = applyMobiusReflected(u_gView_re, u_gView_im, st, u_gViewReflected);

    // Domain folding into P_0 with reflection support
    for (int iter = 0; iter < 64; iter++) {
        bool folded = false;
        for (int i = 0; i < MAX_SIDES; i++) {
            if (i >= u_sideCount) 
                break;
            vec2 Tz = applyMobius(u_T_re[i], u_T_im[i], z);
            if (Tz.y <= 0.0) {
                z = applyMobiusReflected(u_g_re[i], u_g_im[i], z, u_gReflected[i]);
                folded = true;
                break;
            }
        }
        if (!folded) 
            break;
    }

    // Sample underlying paint / Voronoi texture
    vec2 texUv = (z / u_R_tex) * 0.5 + 0.5;
    vec4 paintColor = texture2D(u_paintTexture, texUv);

    // Compute distance to fundamental polygon edges for boundary overlay
    float minEdgeDist = 1e10;
    for (int i = 0; i < MAX_SIDES; i++) {
        if (i >= u_sideCount) 
            break;
        vec2 z_canon = applyMobiusReflected(u_edgeMapRe[i], u_edgeMapIm[i], z, u_edgeReflected[i]);
        float d = hypDistToSegment(z_canon, u_edgeA[i], u_edgeB[i]);
        minEdgeDist = min(minEdgeDist, d);
    }

    // Overlay boundary lines (gold/yellow glow)
    float edgeAlpha = u_overlay * smoothstep(0.01 * (1.0 + 10.0 * u_overlay), 0.001, minEdgeDist);
    vec3 overlayColor = vec3(1.0, 0.85, 0.3);

    vec3 finalColor = mix(paintColor.rgb, overlayColor, edgeAlpha);

    gl_FragColor = vec4(finalColor, 1.0);
}