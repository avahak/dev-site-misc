precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_controlPointTexture;
uniform isampler2D u_capDataTexture;
uniform int u_V;
uniform vec3 u_radii;     // (world, screen_min_pixels, screen_max_pixels)
uniform int u_TEXTURE_WIDTH;

out vec3 color;

#define PI 3.141592653589793

vec4 splineCoeffs(float t) {
    float s1 = 1.0 - t;
    float s2 = s1*s1;
    float s3 = s2*s1;
    float t2 = t*t;
    float t3 = t2*t;
    return vec4(s3, 3.0*t3 - 6.0*t2 + 4.0, 3.0*t2*s1 + 3.0*t + 1.0, t3) / 6.0;
}

vec4 splineCoeffsDeriv(float t) {
    float s1 = 1.0 - t;
    float t2 = t*t;
    return vec4(
        -3.0*s1*s1,
        9.0*t2 - 12.0*t,
        -9.0*t2 + 6.0*t + 3.0,
        3.0*t2
    ) / 6.0;
}

vec3 buildNormal(vec3 T) {
    vec3 ref = abs(T.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    return normalize(cross(T, ref));
}

void main() {
    int capInstanceID = gl_InstanceID;
    ivec2 capDataCoord = ivec2(capInstanceID % u_TEXTURE_WIDTH, capInstanceID / u_TEXTURE_WIDTH);
    ivec2 data = texelFetch(u_capDataTexture, capDataCoord, 0).rg;

    int base = 2 * data.r;
    int side = data.g;

    // --- Fetch control points ---
    vec3 p0 = texelFetch(u_controlPointTexture, ivec2(base % u_TEXTURE_WIDTH, base / u_TEXTURE_WIDTH), 0).rgb;
    vec3 p1 = texelFetch(u_controlPointTexture, ivec2((base+2) % u_TEXTURE_WIDTH, (base+2) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 p2 = texelFetch(u_controlPointTexture, ivec2((base+4) % u_TEXTURE_WIDTH, (base+4) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 p3 = texelFetch(u_controlPointTexture, ivec2((base+6) % u_TEXTURE_WIDTH, (base+6) / u_TEXTURE_WIDTH), 0).rgb;

    vec3 c0 = texelFetch(u_controlPointTexture, ivec2((base+1) % u_TEXTURE_WIDTH, (base+1) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 c1 = texelFetch(u_controlPointTexture, ivec2((base+3) % u_TEXTURE_WIDTH, (base+3) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 c2 = texelFetch(u_controlPointTexture, ivec2((base+5) % u_TEXTURE_WIDTH, (base+5) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 c3 = texelFetch(u_controlPointTexture, ivec2((base+7) % u_TEXTURE_WIDTH, (base+7) / u_TEXTURE_WIDTH), 0).rgb;

    // --- Decode topology ---
    int tri = gl_VertexID / 3;
    int vert = gl_VertexID % 3;
    int quad = tri / 2;
    int u = quad / u_V;
    int v = quad % u_V;

    int u0 = u;
    int u1 = u + 1;
    int v0 = v;
    int v1 = (v + 1) % u_V;

    bool secondTri = (tri % 2) == 1;
    bool flip = (side == 1); // start cap needs opposite winding

    int uu, vv;

    if (!secondTri) {
        if (!flip) {
            // normal
            if (vert == 0) { uu = u0; vv = v0; }
            if (vert == 1) { uu = u1; vv = v1; }
            if (vert == 2) { uu = u1; vv = v0; }
        } else {
            // flipped
            if (vert == 0) { uu = u0; vv = v0; }
            if (vert == 1) { uu = u1; vv = v0; }
            if (vert == 2) { uu = u1; vv = v1; }
        }
    } else {
        if (!flip) {
            // normal
            if (vert == 0) { uu = u0; vv = v0; }
            if (vert == 1) { uu = u0; vv = v1; }
            if (vert == 2) { uu = u1; vv = v1; }
        } else {
            // flipped
            if (vert == 0) { uu = u0; vv = v0; }
            if (vert == 1) { uu = u1; vv = v1; }
            if (vert == 2) { uu = u0; vv = v1; }
        }
    }

    float lat = (float(uu) / float(u_V)) * (PI * 0.5);
    float lon = (float(vv) / float(u_V)) * (2.0 * PI);

    // --- Correct endpoint evaluation ---
    float t = (side == 0) ? 0.0 : 1.0;

    vec4 w = splineCoeffs(t);
    vec4 dw = splineCoeffsDeriv(t);

    vec3 centerW =
        w.x * p0 +
        w.y * p1 +
        w.z * p2 +
        w.w * p3;

    vec3 T = normalize(
        dw.x * p0 +
        dw.y * p1 +
        dw.z * p2 +
        dw.w * p3
    );

    vec3 N = buildNormal(T);
    vec3 B = cross(T, N);

    // --- Hemisphere direction ---
    vec3 radial = cos(lon) * N + sin(lon) * B;

    vec3 dir = (side == 0)
        ? (sin(lat) * radial - cos(lat) * T)
        : (sin(lat) * radial + cos(lat) * T);

    // --- Radius ---
    vec3 viewPos = (modelViewMatrix * vec4(centerW, 1.0)).xyz;
    float pixelRadius = u_radii.z;
    float projScaleY = projectionMatrix[1][1];
    float r_screen_min = (u_radii.y * 2.0 / u_resolution.y) * (-viewPos.z) / projScaleY;
    float r_screen_max = (pixelRadius * 2.0 / u_resolution.y) * (-viewPos.z) / projScaleY;
    float r_world = u_radii.x;
    float r = clamp(r_world, r_screen_min, r_screen_max);

    vec3 posW = centerW + r * dir;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(posW, 1.0);

    color = w.x*c0 + w.y*c1 + w.z*c2 + w.w*c3;
}