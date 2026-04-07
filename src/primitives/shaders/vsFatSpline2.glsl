precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_controlPointTexture;
uniform isampler2D u_indexTexture;
uniform int u_numSegments;
uniform int u_V;
uniform vec3 u_radii;     // tube radii (world, screen_min, screen_max)
uniform int u_TEXTURE_WIDTH;

out vec3 color;

vec4 splineCoeffs(float t) {
    float s1 = 1.0 - t;
    float s2 = s1*s1;
    float s3 = s2*s1;
    float t2 = t*t;
    float t3 = t2*t;
    return vec4(s3, 3.0*t3 - 6.0*t2 + 4.0, 3.0*t2*s1 + 3.0*t + 1.0, t3) / 6.0;
}

vec4 splineDerivCoeffs(float t) {
    float s1 = 1.0 - t;
    float t2 = t*t;
    return vec4(-3.0*s1*s1, 9.0*t2 - 12.0*t, -9.0*t2 + 6.0*t + 3.0, 3.0*t2) / 6.0;
}

vec3 buildNormal(vec3 T) {
    vec3 ref = abs(T.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    return normalize(cross(T, ref));
}

void main() {
    // --- Spline index ---
    int splineIndex = gl_InstanceID;
    int index = 2 * texelFetch(u_indexTexture, ivec2(splineIndex % u_TEXTURE_WIDTH, splineIndex / u_TEXTURE_WIDTH), 0).r;

    // --- Decode vertex topology ---
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
    int uu, vv;

    if (!secondTri) {
        if (vert == 0) { uu = u0; vv = v0; }
        if (vert == 1) { uu = u1; vv = v1; }
        if (vert == 2) { uu = u1; vv = v0; }
    } else {
        if (vert == 0) { uu = u0; vv = v0; }
        if (vert == 1) { uu = u0; vv = v1; }
        if (vert == 2) { uu = u1; vv = v1; }
    }

    float fu = float(uu) / float(u_numSegments);
    float fv = float(vv) / float(u_V) * 6.28318530718;

    // --- Fetch control points and colors once ---
    vec3 p0 = texelFetch(u_controlPointTexture, ivec2(index % u_TEXTURE_WIDTH, index / u_TEXTURE_WIDTH), 0).rgb;
    vec3 p1 = texelFetch(u_controlPointTexture, ivec2((index+2) % u_TEXTURE_WIDTH, (index+2) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 p2 = texelFetch(u_controlPointTexture, ivec2((index+4) % u_TEXTURE_WIDTH, (index+4) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 p3 = texelFetch(u_controlPointTexture, ivec2((index+6) % u_TEXTURE_WIDTH, (index+6) / u_TEXTURE_WIDTH), 0).rgb;

    vec3 c0 = texelFetch(u_controlPointTexture, ivec2((index+1) % u_TEXTURE_WIDTH, (index+1) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 c1 = texelFetch(u_controlPointTexture, ivec2((index+3) % u_TEXTURE_WIDTH, (index+3) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 c2 = texelFetch(u_controlPointTexture, ivec2((index+5) % u_TEXTURE_WIDTH, (index+5) / u_TEXTURE_WIDTH), 0).rgb;
    vec3 c3 = texelFetch(u_controlPointTexture, ivec2((index+7) % u_TEXTURE_WIDTH, (index+7) / u_TEXTURE_WIDTH), 0).rgb;

    // --- Spline coefficients ---
    vec4 w = splineCoeffs(fu);
    vec4 dw = splineDerivCoeffs(fu);

    // --- Evaluate spline position and derivative ---
    vec3 centerW = w.x*p0 + w.y*p1 + w.z*p2 + w.w*p3;
    vec3 d1 = dw.x*p0 + dw.y*p1 + dw.z*p2 + dw.w*p3;

    // --- Evaluate color ---
    color = w.x*c0 + w.y*c1 + w.z*c2 + w.w*c3;

    vec4 dw0 = splineDerivCoeffs(0.0);
    vec4 dw1 = splineDerivCoeffs(1.0);

    vec3 T0 = normalize(dw0.x*p0 + dw0.y*p1 + dw0.z*p2 + dw0.w*p3);
    vec3 T1 = normalize(dw1.x*p0 + dw1.y*p1 + dw1.z*p2 + dw1.w*p3);
    vec3 N0 = buildNormal(T0);
    vec3 N1 = buildNormal(T1);

    vec3 T = normalize(d1);
    float angle = acos(clamp(dot(N0, N1), -1.0, 1.0));
    float s = sin(angle);
    vec3 N = N0;
    if (s > 1e-5) {
        float w0 = sin((1.0 - fu) * angle) / s;
        float w1 = sin(fu * angle) / s;
        N = normalize(w0 * N0 + w1 * N1);
    }
    N = normalize(N - T * dot(T, N));
    vec3 B = cross(T, N);

    // --- Radius (screen-space capped) ---
    vec3 viewPos = (modelViewMatrix * vec4(centerW, 1.0)).xyz;
    float pixelRadius = u_radii.z;
    float projScaleY = projectionMatrix[1][1];
    float r_screen_min = (u_radii.y * 2.0 / u_resolution.y) * (-viewPos.z) / projScaleY;
    float r_screen_max = (pixelRadius * 2.0 / u_resolution.y) * (-viewPos.z) / projScaleY;
    float r_world = u_radii.x;
    float r = clamp(r_world, r_screen_min, r_screen_max);

    // --- Final vertex position ---
    vec3 offset = cos(fv) * N + sin(fv) * B;
    vec3 posW = centerW + r * offset;
    vec4 view = modelViewMatrix * vec4(posW, 1.0);
    gl_Position = projectionMatrix * view;
}