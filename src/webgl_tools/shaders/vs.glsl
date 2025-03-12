precision highp float;

uniform vec2 resolution;
uniform int numSegments;
uniform float time;
uniform sampler2D controlPointTexture;
uniform isampler2D indexTexture;

out vec4 vPos;
out vec2 vUv;
flat out int segment;

// MAX_WIDTH has to match with value in uniformBSpline.ts
#define MAX_WIDTH 1024

vec3 spline(float t, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {
    float s1 = 1.0 - t;
    float s2 = s1*s1;
    float s3 = s2*s1;
    float t2 = t*t;
    float t3 = t2*t;
    return (s3*p0 + (3.0*t3-6.0*t2+4.0)*p1 + (3.0*t2*s1+3.0*t+1.0)*p2 + t3*p3) / 6.0;
}

void main() {
    int vIndex = gl_VertexID;       // 0 or 1
    int iIndex = gl_InstanceID;

    int i = iIndex / numSegments;
    int index = texelFetch(indexTexture, ivec2(i % MAX_WIDTH, i / MAX_WIDTH), 0).r;

    vec3 p0 = texelFetch(controlPointTexture, ivec2(index % MAX_WIDTH, index / MAX_WIDTH), 0).rgb;
    vec3 p1 = texelFetch(controlPointTexture, ivec2((index+1) % MAX_WIDTH, (index+1) / MAX_WIDTH), 0).rgb;
    vec3 p2 = texelFetch(controlPointTexture, ivec2((index+2) % MAX_WIDTH, (index+2) / MAX_WIDTH), 0).rgb;
    vec3 p3 = texelFetch(controlPointTexture, ivec2((index+3) % MAX_WIDTH, (index+3) / MAX_WIDTH), 0).rgb;

    float t = float((iIndex % numSegments) + vIndex) / float(numSegments);
    vec3 p = spline(t, p0, p1, p2, p3);

    vPos = vec4(p, 1.0);
    vUv = uv;
    segment = iIndex / numSegments;
    gl_Position = projectionMatrix * modelViewMatrix * vPos;
}