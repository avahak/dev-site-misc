precision highp float;

uniform vec2 resolution;
uniform mat4 projectionMatrix;
uniform mat4 inverseProjectionMatrix;

in vec3 color;
flat in vec3 vP0;
flat in vec3 vP1;
in vec3 basePos;

void main() {
    // --- Ray reconstruction ---
    vec2 ndc = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
    vec4 clip = vec4(ndc, 0.0, 1.0);
    vec4 view = inverseProjectionMatrix * clip;       // TODO remove, slow

    vec3 ro = vec3(0.0);
    vec3 rd = normalize(view.xyz / view.w);

    // --- Segment (capsule axis) ---
    vec3 pa = vP0;
    vec3 pb = vP1;
    vec3 ba = pb - pa;

    float pixelRadius = 5.0;
    // projectionMatrix[1][1] = cot(fov/2)
    float projScaleY = projectionMatrix[1][1];
    // Convert pixel radius -> NDC -> view space
    float r_screen_min = (1.0 * 2.0 / resolution.y) * (-basePos.z) / projScaleY;
    float r_screen_max = (pixelRadius * 2.0 / resolution.y) * (-basePos.z) / projScaleY;
    // World distance cap
    float r_world = 0.001;
    float r = clamp(r_world, r_screen_min, r_screen_max);

    // --- Compute intersection ---
    vec3 oa = ro - pa;

    float baba = dot(ba, ba);
    float bard = dot(ba, rd);
    float baoa = dot(ba, oa);
    float rdoa = dot(rd, oa);
    float oaoa = dot(oa, oa);

    float a = baba - bard * bard;
    float b = baba * rdoa - baoa * bard;
    float c = baba * oaoa - baoa * baoa - r * r * baba;

    float h = b * b - a * c;

    float t = -1.0;

    if (h >= 0.0) {
        // --- Cylinder hit ---
        float sqrtH = sqrt(h);
        float t0 = (-b - sqrtH) / a;
        float t1 = (-b + sqrtH) / a;

        // pick nearest positive
        t = (t0 > 0.0) ? t0 : t1;

        // Check if within segment
        float y = baoa + t * bard;

        if (y < 0.0 || y > baba) {
            // --- Endcaps (sphere tests) ---
            vec3 oc = (y < 0.0) ? oa : ro - pb;

            float b2 = dot(rd, oc);
            float c2 = dot(oc, oc) - r * r;
            float h2 = b2 * b2 - c2;

            if (h2 < 0.0) discard;

            t = -b2 - sqrt(h2);
        }
    } else {
        discard;
    }

    if (t < 0.0) 
        discard;

    // --- Hit point ---
    vec3 hitPos = ro + t * rd;

    vec4 clipHit = projectionMatrix * vec4(hitPos, 1.0);
    gl_FragDepth = 0.5 * (clipHit.z / clipHit.w + 1.0);

    gl_FragColor = vec4(color, 1.0);
}