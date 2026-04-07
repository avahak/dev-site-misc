// Draft for fat splines

precision highp float;

uniform vec2 resolution;
uniform int numSegments;
uniform sampler2D controlPointTexture;
uniform isampler2D indexTexture;

out vec3 color;
flat out vec3 vP0;
flat out vec3 vP1;
out vec3 basePos;

#define MAX_WIDTH 1024

vec4 splineCoeffs(float t) {
    float s1 = 1.0 - t;
    float s2 = s1*s1;
    float s3 = s2*s1;
    float t2 = t*t;
    float t3 = t2*t;
    return vec4(s3, 3.0*t3-6.0*t2+4.0, 3.0*t2*s1+3.0*t+1.0, t3) / 6.0;
}

vec3 evalSpline(int baseIndex, float t) {
    vec3 p0 = texelFetch(controlPointTexture, ivec2(baseIndex % MAX_WIDTH, baseIndex / MAX_WIDTH), 0).rgb;
    vec3 p1 = texelFetch(controlPointTexture, ivec2((baseIndex+2) % MAX_WIDTH, (baseIndex+2) / MAX_WIDTH), 0).rgb;
    vec3 p2 = texelFetch(controlPointTexture, ivec2((baseIndex+4) % MAX_WIDTH, (baseIndex+4) / MAX_WIDTH), 0).rgb;
    vec3 p3 = texelFetch(controlPointTexture, ivec2((baseIndex+6) % MAX_WIDTH, (baseIndex+6) / MAX_WIDTH), 0).rgb;

    vec4 w = splineCoeffs(t);
    return w.x*p0 + w.y*p1 + w.z*p2 + w.w*p3;
}

vec3 evalColor(int baseIndex, float t) {
    vec3 c0 = texelFetch(controlPointTexture, ivec2((baseIndex+1) % MAX_WIDTH, (baseIndex+1) / MAX_WIDTH), 0).rgb;
    vec3 c1 = texelFetch(controlPointTexture, ivec2((baseIndex+3) % MAX_WIDTH, (baseIndex+3) / MAX_WIDTH), 0).rgb;
    vec3 c2 = texelFetch(controlPointTexture, ivec2((baseIndex+5) % MAX_WIDTH, (baseIndex+5) / MAX_WIDTH), 0).rgb;
    vec3 c3 = texelFetch(controlPointTexture, ivec2((baseIndex+7) % MAX_WIDTH, (baseIndex+7) / MAX_WIDTH), 0).rgb;

    vec4 w = splineCoeffs(t);
    return w.x*c0 + w.y*c1 + w.z*c2 + w.w*c3;
}

void main() {
    int iIndex = gl_InstanceID;
    int v = gl_VertexID;
    bool useP1 = (v == 1 || v == 2 || v == 5);
    bool usePositiveSide = (v == 2 || v == 3 || v == 5);

    int i = iIndex / numSegments;
    int index = 2 * texelFetch(indexTexture, ivec2(i % MAX_WIDTH, i / MAX_WIDTH), 0).r;

    float t0 = float(iIndex % numSegments) / float(numSegments);
    float t1 = float((iIndex % numSegments) + 1) / float(numSegments);

    vec3 p0w = evalSpline(index, t0);
    vec3 p1w = evalSpline(index, t1);

    vec3 p0v = (modelViewMatrix * vec4(p0w, 1.0)).xyz;
    vec3 p1v = (modelViewMatrix * vec4(p1w, 1.0)).xyz;

    float near = 0.1;
    float eps = 1e-6;

    bool p0Inside = (p0v.z < -near - eps);
    bool p1Inside = (p1v.z < -near - eps);

    // Clip segment to near plane
    if (!p0Inside || !p1Inside) {
        if (!p0Inside && !p1Inside) {
            // Fully behind: mark degenerate safely
            p1v = p0v;
        } else {
            vec3 a = p0v;
            vec3 b = p1v;
            float dz = b.z - a.z;

            // Guard against parallel / near-parallel
            float t = 0.0;
            if (abs(dz) > eps) {
                t = (-near - a.z) / dz;
            }

            vec3 pClip = a + t * (b - a);

            if (!p0Inside) {
                p0v = pClip;
            } else {
                p1v = pClip;
            }
        }
    }

    vP0 = p0v;
    vP1 = p1v;

    color = evalColor(index, useP1 ? t1 : t0);

    vec4 clip0 = projectionMatrix * vec4(p0v, 1.0);
    vec4 clip1 = projectionMatrix * vec4(p1v, 1.0);

    vec2 ndc0 = clip0.xy / clip0.w;
    vec2 ndc1 = clip1.xy / clip1.w;

    vec2 delta = ndc1 - ndc0;
    float len2 = dot(delta, delta);

    // Handle degenerate or collapsed segments
    bool degenerate = (len2 < 1e-12);

    vec2 dir = degenerate ? vec2(1.0, 0.0) : normalize(delta);
    vec2 ortho = vec2(-dir.y, dir.x);

    vec2 pixel = 2.0 / resolution;

    float halfWidth = 7.0;
    float halfLength = 7.0;
    
    vec2 offsetDir = dir * halfLength * pixel;
    vec2 offsetOrtho = ortho * halfWidth * pixel;

    vec4 clip = useP1 ? clip1 : clip0;
    vec2 ndc = useP1 ? ndc1 : ndc0;

    vec2 finalOffset = (useP1 ? offsetDir : -offsetDir) +
                       (usePositiveSide ? offsetOrtho : -offsetOrtho);

    // If degenerate, collapse safely to avoid large artifacts
    if (degenerate) {
        finalOffset = vec2(0.0);
    }

    vec2 finalNdc = ndc + finalOffset;
    clip.xy = finalNdc * clip.w;

    basePos = useP1 ? p1v : p0v;

    gl_Position = clip;
}