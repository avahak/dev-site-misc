// Vertex shader for endcap parts of fat b-splines. Geometry is generated fully here.
precision highp float;

uniform sampler2D controlPointTexture;
uniform isampler2D capDataTexture;
uniform vec2 resolution;
uniform int vSegments;
uniform float minPixelRadius;
uniform int TEXTURE_WIDTH;

out vec3 v_color;

#define PI 3.141592653589793
#define PI_OVER_2 0.5*PI
#define TAU 2.0*PI

const int LUT[12] = int[12](
    0, 2, 1,    // first tri, side = 0
    0, 1, 2,    // first tri, side = 1
    0, 3, 2,    // second tri, side = 0
    0, 2, 3     // second tri, side = 1
);

vec3 buildNormal(vec3 T) {
    // NOTE: this has to match between caps and tube shaders
    vec3 ref = abs(T.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    return normalize(cross(T, ref));
}

void main() {
    int instanceID = gl_InstanceID;
    ivec2 capDataCoord = ivec2(instanceID % TEXTURE_WIDTH, instanceID / TEXTURE_WIDTH);
    ivec2 data = texelFetch(capDataTexture, capDataCoord, 0).rg;

    int index = 2 * data.r;
    int side = data.g;

    // --- Control points and colors ---
    vec4 texel0 = texelFetch(controlPointTexture, ivec2(index % TEXTURE_WIDTH, index / TEXTURE_WIDTH), 0);
    vec4 texel1 = texelFetch(controlPointTexture, ivec2((index+1) % TEXTURE_WIDTH, (index+1) / TEXTURE_WIDTH), 0);
    vec4 texel2 = texelFetch(controlPointTexture, ivec2((index+2) % TEXTURE_WIDTH, (index+2) / TEXTURE_WIDTH), 0);
    vec4 texel3 = texelFetch(controlPointTexture, ivec2((index+3) % TEXTURE_WIDTH, (index+3) / TEXTURE_WIDTH), 0);
    vec4 texel4 = texelFetch(controlPointTexture, ivec2((index+4) % TEXTURE_WIDTH, (index+4) / TEXTURE_WIDTH), 0);
    vec4 texel5 = texelFetch(controlPointTexture, ivec2((index+5) % TEXTURE_WIDTH, (index+5) / TEXTURE_WIDTH), 0);
    vec4 texel6 = texelFetch(controlPointTexture, ivec2((index+6) % TEXTURE_WIDTH, (index+6) / TEXTURE_WIDTH), 0);
    vec4 texel7 = texelFetch(controlPointTexture, ivec2((index+7) % TEXTURE_WIDTH, (index+7) / TEXTURE_WIDTH), 0);

    vec3 p0 = texel0.rgb;
    vec3 p1 = texel2.rgb;
    vec3 p2 = texel4.rgb;
    vec3 p3 = texel6.rgb;

    vec3 c0 = texel1.rgb;
    vec3 c1 = texel3.rgb;
    vec3 c2 = texel5.rgb;
    vec3 c3 = texel7.rgb;

    vec4 worldRadii = vec4(texel0.a, texel2.a, texel4.a, texel6.a);
    vec4 maxPixelRadii = vec4(texel1.a, texel3.a, texel5.a, texel7.a);

    // --- Topology ---
    int tri = gl_VertexID / 3;
    int vert = gl_VertexID % 3;

    int quad = tri >> 1;
    int secondTri = tri & 1;

    int u = quad / vSegments;
    int v = quad % vSegments;

    ivec2 quadCorners[4] = ivec2[4](
        ivec2(u, v),
        ivec2(u + 1, v),
        ivec2(u + 1, (v + 1) % vSegments),
        ivec2(u, (v + 1) % vSegments)
    );

    int cornerIndex = LUT[((secondTri << 1) | side) * 3 + vert];
    ivec2 uv = quadCorners[cornerIndex];

    float lat = float(uv.x) / float(vSegments) * PI_OVER_2;
    float lon = float(uv.y) / float(vSegments) * TAU;

    // --- Endpoint ---
    vec4 w = (side == 0) 
        ? vec4(1.0, 4.0, 1.0, 0.0) / 6.0    // splineCoeffs(0.0)
        : vec4(0.0, 1.0, 4.0, 1.0) / 6.0;   // splineCoeffs(1.0)
    vec4 dw = (side == 0) 
        ? vec4(-0.5, 0.0, 0.5, 0.0)     // splineDerivCoeffs(0.0)
        : vec4(0.0, -0.5, 0.0, 0.5);    // splineDerivCoeffs(1.0)

    v_color = w.x*c0 + w.y*c1 + w.z*c2 + w.w*c3;

    vec3 center = w.x*p0 + w.y*p1 + w.z*p2 + w.w*p3;
    vec3 centerDer = dw.x*p0 + dw.y*p1 + dw.z*p2 + dw.w*p3;

    // --- Hemisphere position ---
    vec3 T = normalize(centerDer);
    vec3 N = buildNormal(T);
    vec3 B = cross(T, N);

    vec3 radial = cos(lon) * N + sin(lon) * B;

    vec3 dir = (side == 0)
        ? (sin(lat) * radial - cos(lat) * T)
        : (sin(lat) * radial + cos(lat) * T);

    // --- Radius (screen-space capped) ---
    float worldRadius = dot(w, worldRadii);
    vec2 pixelRadiusBounds = vec2(minPixelRadius, dot(w, maxPixelRadii));
    vec3 viewPos = (modelViewMatrix * vec4(center, 1.0)).xyz;
    vec2 worldRadiusBounds = (pixelRadiusBounds * 2.0 / resolution.y) * (-viewPos.z) / projectionMatrix[1][1];
    // Not using clamp here to make sure lower bound to dominates
    float r = max(min(worldRadius, worldRadiusBounds.y), worldRadiusBounds.x);  

    vec3 pos = center + r * dir;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}