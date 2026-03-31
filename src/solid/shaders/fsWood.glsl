uniform vec2 resolution;
uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;

in vec4 vPos;
in vec2 vUv;

const float BRANCH_ANGLE = 0.5;
const float BRANCH_RADIUS = 0.05;
const float AGE_YEARS = 50.0;
const float BRANCH_AGE_YEARS = 8.0;
const vec3 COLOR1 = vec3(218.0,109.0,66.0)/255.0;
const vec3 COLOR2 = vec3(255.0,193.0,140.0)/255.0;

// float modDist(float x, float y, float s) {
//     float d = x - y;
//     d = mod(d + 0.5*s, s) - 0.5*s;
//     return abs(d);
// }

// Flow of fbm noise vectorfield, integrated with RK4.
vec3 flowWarp(vec3 p) {
    const int ITERS = 3;
    float H = debug1;
    float WARP = debug2/10.0;     // time parameter for flow
    float step = WARP / float(ITERS);

    vec3 offset = vec3(0.0);
    
    for(int i = 0; i < ITERS; i++) {
        vec3 k1 = fbm33(p, H);
        vec3 k2 = fbm33(p + 0.5*step*k1, H);
        vec3 k3 = fbm33(p + 0.5*step*k2, H); 
        vec3 k4 = fbm33(p + step*k3, H);
        
        offset += (step / 6.0) * (k1 + 2.0*k2 + 2.0*k3 + k4);
    }
    return p + offset;
}

float rays(vec3 q) {
    float phi = atan(q.y, q.x);
    float r = length(q.xy);
    int iScale = 15;
    float scale = float(iScale);
    vec2 st = scale * vec2(0.5+phi/TAU, q.z/TAU);

    const float MEDULLARY_THRESHOLD = 0.25;
    const float RAY_THRESHOLD = 0.5;

    for (int kx = -1; kx <= 1; kx++) {
        for (int ky = -1; ky <= 1; ky++) {
            vec2 kxy = vec2(float(kx), float(ky));
            ivec2 p = ivec2((iScale + kx + int(floor(st.x))) % iScale, iScale + ky + int(floor(st.y)));
            vec3 jitter = hash33(vec3(p, 0.0));
            vec2 rand = hash22(vec2(p));
            rand.xy = vec2(min(rand.x, rand.y), max(rand.x, rand.y));
            vec2 spot = kxy + floor(st) + jitter.xy;
            vec2 diff = spot - st;
            diff.x *= 20.0;
            if (jitter.z < RAY_THRESHOLD) {
                if (jitter.z < MEDULLARY_THRESHOLD && length(diff) < 0.5)
                    return 1.0;
                float s = clamp((r-rand.x) / (rand.y-rand.x), 0.0, 1.0);
                s = 2.0 * min(s, 1.0-s);
                if (length(vec3(diff, s)) < 0.5)
                    return 1.0;
            }
        }
    }
    return 0.0;
}

bool branches(vec3 q, out vec3 qNew) {
    float phi = atan(q.y, q.x);
    int iScale = 2;     // number of branches at a time
    float yScaleFactor = 2.0;   // scales vertical distance between branches
    float scale = float(iScale);
    vec2 st = scale * vec2(0.5+phi/TAU, yScaleFactor*q.z/TAU);

    float s = length(q.xy);

    float r = min(s-0.4, BRANCH_RADIUS);

    for (int kx = -1; kx <= 1; kx++) {
        for (int ky = -1; ky <= 1; ky++) {
            vec2 kxy = vec2(float(kx), float(ky));
            ivec2 p = ivec2((iScale + kx + int(floor(st.x))) % iScale, iScale + ky + int(floor(st.y)));
            vec3 jitter = hash33(vec3(p.y, 1.0, 0.0));
            vec2 spot = vec2(kxy.x + floor(st.x) + jitter.x, kxy.y + floor(st.y) + 0.5);
            vec2 diff = spot - st;
            if (length(vec2(diff.x, diff.y/yScaleFactor/s)) < r && p.y % 1 == 0) {
                qNew = vec3(s * vec2(diff.x, diff.y/yScaleFactor/s), s) / BRANCH_RADIUS;
                return true;
            }
        }
    }
    return false;
}

float annualRings(vec3 q, float age) {
    float r = length(q.xy);
    float s = 0.5 + 0.5*sin(r*TAU*age);
    return s*s;
}

void main() {
    vec3 p = vPos.xyz;
    p = flowWarp(p);

    // float d = spots(p);
    float c = 0.2;
    float age = AGE_YEARS;

    // Add branches
    vec3 bOut;
    bool hasBranch = branches(p, bOut);
    if (hasBranch) {
        c = 0.9;
        p = bOut;
        age = BRANCH_AGE_YEARS;
        // if (branches(p, bOut))
        //     c = 0.5;
    }

    c = rays(p);
    if (c < 0.3)
        c = annualRings(p, age);

    vec3 color = mix(COLOR1, COLOR2, c);

    // vec3 w = vnoise33(vPos.xyz);
    // vec3 w = fbm33(vPos.xyz, 2.0);
    // gl_FragColor = vec4(w, 1.0);
    gl_FragColor = vec4(color, 1.0);
}