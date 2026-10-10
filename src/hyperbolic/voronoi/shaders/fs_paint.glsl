precision highp float;

uniform sampler2D u_prevTexture;
uniform float u_segA;
uniform float u_segB;
uniform vec4 u_mapRe;
uniform vec4 u_mapIm;
uniform float u_radius;
uniform vec3 u_brushColor;
uniform float u_R_tex;

uniform sampler2D u_subgroupTexture;
uniform int u_subgroupCount;

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
    vec4 prevColor = texture2D(u_prevTexture, vUv);
    vec2 w = (vUv * 2.0 - 1.0) * u_R_tex;

    float minDist = 1e10;

    for (int i = 0; i < 4096; i++) {
        if (i >= u_subgroupCount) break;

        float u_coord = (float(i) + 0.5) / float(u_subgroupCount);
        vec4 row0 = texture2D(u_subgroupTexture, vec2(u_coord, 0.25));
        vec4 row1 = texture2D(u_subgroupTexture, vec2(u_coord, 0.75));

        vec4 mRe = vec4(row0.x, row0.z, row1.x, row1.z);
        vec4 mIm = vec4(row0.y, row0.w, row1.y, row1.w);

        vec2 z_inv = applyMobius(mRe, mIm, w);
        vec2 z_canon = applyMobius(u_mapRe, u_mapIm, z_inv);

        float dist = hypDistToSegment(z_canon, u_segA, u_segB);
        minDist = min(minDist, dist);
    }

    float alpha = smoothstep(u_radius, u_radius - 0.005, minDist);
    vec3 finalColor = mix(prevColor.rgb, u_brushColor, alpha);

    gl_FragColor = vec4(finalColor, 1.0);
}