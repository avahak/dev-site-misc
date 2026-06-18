// See sWood.glsl

#include <sCommon>

const int MAX_BRANCHES = 1024;

uniform sampler3D noiseTexture;

uniform vec2 resolution;
uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;
uniform float debug5;
uniform float debug6;
uniform float debug7;
uniform float debug8;

uniform globalUBO {
    uniform float zRange;
    uniform float numBranches;
    vec4 branchesZASD[MAX_BRANCHES];
    vec4 branchesR[MAX_BRANCHES];
};

in vec4 vPos;

layout(location = 0) out vec4 outColor;


struct Knot {
    vec3 start;         // Position on pith where the branch starts, could just be `float startHeight;`
    float death;        // time of death, in [0,1]
    vec2 dir;           // (knot direction, knot verticality at stem)

    float strength;     // used to fade the branch influence to prevent overlapping branches, in [0,1]
};

struct LookupInfo {
    float rStem;        // Growth rate for the stem at given height, direction
    vec2 pith;          // (x,y) coordinates for the stem at given height
    Knot knot;
};


vec3 closestRayPoint(vec3 p, vec3 base, vec3 dir){
    // Returns closest point on ray { base+t*dir: t>=0 } to p
    float t = max(0.0, dot(p - base, dir));
    vec3 cp = base + t*dir;
    return cp;
}

float pointRayDistance(vec3 p, vec3 base, vec3 dir){
    // Returns dist(p, { base+t*dir: t>=0 })
    float t = max(0.0, dot(p - base, dir));
    vec3 cp = base + t*dir;
    return length(p - cp);
}

float sminPow(float a, float b, float k) {
    // Power smooth minumim, see: https://iquilezles.org/articles/smin/
    a = pow(a, k);
    b = pow(b, k);
    return pow((a*b)/(a+b), 1.0/k);
}


vec2 getPith(float z) {
    return 0.0*vnoise33(5.0*vec3(0.0, 0.0, z)).xy;
}


int computeIndex(float phi, float z) {
    int bestIndex = 0;
    float bestRatio = 1e6;
    LookupInfo lookup;
    Knot knot;
    lookup.pith = getPith(z);

    const int RN = 10;
    for (int bk = 0; bk < MAX_BRANCHES; bk++) {
        if (bk >= int(round(numBranches)))
            break;
        for (int rk = 1; rk < RN; rk++) {
            float r = float(rk) / float(RN);
            vec3 p = vec3(lookup.pith, 0.0) + vec3(r*cos(phi), r*sin(phi), z);

            lookup.rStem = (4.0 + 0.2*snoise(0.5*vec3(normalize(p.xy-lookup.pith), p.z))) / 3.0;
            float z0 = branchesZASD[bk].x;
            float br = branchesR[bk].x;
            knot.start = vec3(getPith(z0), z0);
            knot.death = branchesZASD[bk].w;
            knot.dir = branchesZASD[bk].yz;

            // knotP is considered closest point to p on the knot skeleton (NOTE this is an approximation)
            vec2 knotDirXY = vec2(cos(knot.dir.x), sin(knot.dir.x));
            vec3 knotP = knot.start + vec3(
                r*knotDirXY, 
                knot.dir.y*(r < 1.0 ? r - 0.5*r*r : 0.5)
            );

            float dPith = r;
            vec3 diff = p - knotP;
            diff.z -= zRange * round(diff.z / zRange);        // z-tiling!
            float dKnot = length(diff);
            
            float betaKnot = atan(diff.z, dot(diff.xy, vec2(-knotDirXY.y, knotDirXY.x)));
            float rKnot = br - 0.05*sqrt(dPith) + 0.02*snoise(1.0*vec3(cos(betaKnot), sin(betaKnot), dPith));

            float t0 = dPith / lookup.rStem;
            float t1 = dKnot / rKnot;

            float tDelta = t0 - t1;
            float k = 1.75*tDelta/(0.3+abs(tDelta)) + 3.25;
            // NOTE x/(a+abs(x)) is C^1, ->-1 at -\infty, ->1 at \infty, derivative at 0 is 1/a.

            float t = sminPow(t0, t1, k);
            float delta = t - min(t0, t1);

            // Death
            float isAlive = 1.0;
            if (t > knot.death) {
                isAlive = 0.0;
                float tDead = abs(t0 - knot.death);
                t1 += tDead;

                float kDead = k + 5.0*tDead;
                float t = sminPow(t0, t1, kDead);
                float tempDelta = t - min(t0, t1);

                float s = 8.0*tDead - 1.0;
                float f = 0.35 - 0.85*s/(0.3+abs(s));
                delta = f*tempDelta;
            }

            t = min(t0, t1) + delta;

            float ratio = t1 / t0;
            if (ratio < bestRatio) {
                bestIndex = bk;
                bestRatio = ratio;
            }
        }
    }
    return bestIndex;
}

void main() {
    // - Transform pixel gl_FragCoord.xy/resolution to (phi,z)
    // - Loop over r\in(0,1] to get p=(r,phi,z)
    // - Loop over branches and compute t0,t1 for each branch
    // - (TODO rethink) Store index to smallest t1/t0
    // - Write out color from index

    vec2 xy = gl_FragCoord.xy / resolution;
    float phi = TAU * xy.x;
    float z = xy.y * zRange;

    int index = computeIndex(phi, z);

    // vec3 h = hash33(vec3(float(index)));
    // outColor = vec4(h, 1.0);
    outColor = vec4(float(index)/float(MAX_BRANCHES), 0.0, 0.0, 0.0);
}