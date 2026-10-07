precision highp float;

uniform vec2 resolution;
uniform float time;
uniform int u_sideCount;

#define MAX_SIDES 12

uniform vec4 u_T_re[MAX_SIDES];
uniform vec4 u_T_im[MAX_SIDES];

uniform vec4 u_g_re[MAX_SIDES];
uniform vec4 u_g_im[MAX_SIDES];

varying vec2 vUv;

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
    // Map screen UV to Poincaré disk coordinates centered at origin
    vec2 st = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y) * 1.1;

    float r = length(st);

    // Render boundary ring outside disk
    if (r >= 1.0) {
        if (r < 1.01) {
            gl_FragColor = vec4(0.8, 0.8, 0.85, 1.0);
        } else {
            gl_FragColor = vec4(0.05, 0.05, 0.07, 1.0);
        }
        return;
    }

    vec2 z = st;
    int steps = 0;
    const int MAX_ITER = 256;
    bool inFundamentalPolygon = false;

    // Iterative domain folding loop
    for (int iter = 0; iter < MAX_ITER; iter++) {
        bool moved = false;
        for (int i = 0; i < MAX_SIDES; i++) {
            if (i >= u_sideCount) break;

            // Check if point lies inside edge i: Im(T_i(z)) > 0
            vec2 Tz = applyMobius(u_T_re[i], u_T_im[i], z);
            if (Tz.y <= 0.0) {
                // Point is outside edge i -> fold back using g_i
                z = applyMobius(u_g_re[i], u_g_im[i], z);
                moved = true;
                steps++;
                break; // Restart side tests from edge 0
            }
        }
        if (!moved) {
            inFundamentalPolygon = true;
            break;
        }
    }

    if (inFundamentalPolygon) {
        // Hyperbolic distance from disk center
        float distHyp = log((1.0 + length(z)) / max(1.0 - length(z), 1e-5));

        // Base tile color tinted by iteration count
        float fSteps = float(steps);
        vec3 col = vec3(0.2, 0.45, 0.7);
        col += 0.62 * vec3(sin(fSteps * 0.8), cos(fSteps * 0.5), sin(fSteps * 0.3 + 1.0));

        col += vec3(sin(28.0*z.x), 0.5*cos(28.0*z.y), sin(24.0*z.x*z.y)) - 0.5;

        // Hyperbolic distance ring grid
        float grid = smoothstep(0.02, 0.25, abs(fract(distHyp * 8.0 - 0.1) - 0.1));
        col *= 0.75 + 0.25 * grid;

        gl_FragColor = vec4(col, 1.0);
    } else {
        gl_FragColor = vec4(0.1, 0.1, 0.15, 1.0);
    }
}