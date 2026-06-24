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

layout(location = 0) out vec4 outIndices;
layout(location = 1) out vec4 outValues;


struct MinInfo {
    ivec4 indices;
    vec4 values;
};

struct BranchState {
    float tb;
    float delta;
    float death;
    float beta;

    float isAlive;
};


// vec3 closestRayPoint(vec3 p, vec3 base, vec3 dir){
//     // Returns closest point on ray { base+t*dir: t>=0 } to p
//     float t = max(0.0, dot(p - base, dir));
//     vec3 cp = base + t*dir;
//     return cp;
// }
// float pointRayDistance(vec3 p, vec3 base, vec3 dir){
//     // Returns dist(p, { base+t*dir: t>=0 })
//     float t = max(0.0, dot(p - base, dir));
//     vec3 cp = base + t*dir;
//     return length(p - cp);
// }

float sminPow(float a, float b, float k) {
    // Power smooth minumim, see: https://iquilezles.org/articles/smin/
    a = pow(a, k);
    b = pow(b, k);
    return pow((a*b)/(a+b), 1.0/k);
}


vec2 getPith(float z) {
    return 0.1*vnoise33(5.0*vec3(0.0, 0.0, z)).xy;
}

// This should match between setup and lookup
BranchState computeBranchState(vec3 p, float r, float phi, float z, float ts, int index) {
    float z0 = branchesZASD[index].x;
    vec2 dir = branchesZASD[index].yz;
    float death = branchesZASD[index].w;
    float br = branchesR[index].x;

    vec3 start = vec3(getPith(z0), z0);
    vec2 dirXY = vec2(cos(dir.x), sin(dir.x));

    // branchP is the "pseudo-closest" point to p on the branch skeleton 
    float branchZ = dir.y*(r < 1.0 ? r - 0.5*r*r : 0.5);
    vec3 branchP = start + vec3(r*dirXY, branchZ);

    vec3 diff = p - branchP;
    diff.z -= zRange * round(diff.z / zRange);        // for z-tiling
    float dBranch = length(diff);
    float beta = atan(diff.z, dot(diff.xy, vec2(-dirXY.y, dirXY.x)));
    float rBranch = br - 0.1*sqrt(r) + 0.01*snoise(1.0*vec3(cos(beta), sin(beta), r));

    float tb = dBranch / rBranch;

    float tDelta = ts - tb;
    float k = 1.75*tDelta/(0.3+abs(tDelta)) + 3.25;
    // NOTE x/(a+abs(x)) is C^1, ->-1 at -\infty, ->1 at \infty, derivative at 0 is 1/a.

    float t = sminPow(ts, tb, k);
    float delta = t - min(ts, tb);

    // Death
    float isAlive = 1.0;
    if (t > death) {
        isAlive = 0.0;
        float tDead = abs(ts - death);
        tb += tDead;

        float kDeath = k + 5.0*tDead;
        float t = sminPow(ts, tb, kDeath);
        float tempDelta = t - min(ts, tb);

        float s = 8.0*tDead - 1.0;
        float f = 0.35 - 0.85*s/(0.3+abs(s));
        delta = f*tempDelta;
    }

    return BranchState(tb, delta, death, beta, isAlive);
}

float computeRatio(float phi, float z, int index) {
    float bestRatio = 1e38;

    const int RN = 10;
    for (int rk = 1; rk < RN; rk++) {
        float r = float(rk) / float(RN);
        vec2 pith = getPith(z);
        vec3 p = vec3(pith + r*vec2(cos(phi), sin(phi)), z);
        float rStem = (4.0 + 0.5*snoise(1.0*vec3(normalize(p.xy-pith), p.z))) / 3.0;
        float ts = r / rStem;

        BranchState bs = computeBranchState(p, r, phi, z, ts, index);

        float ratio = bs.tb / ts;
        bestRatio = min(ratio, bestRatio);
    }
    return bestRatio;
}


MinInfo computeMinValues(float phi, float z) {
    const int M = 4;
    float minValues[M];
    int minIndices[M];
    for (int i = 0; i < M; i++) {
        minValues[i] = 3e38; 
        minIndices[i] = -1;
    }

    for (int i = 0; i < MAX_BRANCHES; i++) {
        if (i >= int(round(numBranches)))
            break;

        float val = computeRatio(phi, z, i);

        for (int j = M - 1; j >= 0; j--) {
            if (val < minValues[j]) {
                if (j < M - 1) {
                    minValues[j + 1] = minValues[j];
                    minIndices[j + 1] = minIndices[j];
                }
                minValues[j] = val;
                minIndices[j] = i;
            } else
                break;
        }
    }

    MinInfo result;
    result.indices = ivec4(minIndices[0], minIndices[1], minIndices[2], minIndices[3]);
    result.values = vec4(minValues[0], minValues[1], minValues[2], minValues[3]);
    return result;
}

void main() {
    // - Transform pixel gl_FragCoord.xy/resolution to (phi,z)
    // - Loop over r\in(0,1] to get p=(r,phi,z), ts
    // - Loop over branches and compute tb for each branch
    // - Store index to smallest tb/ts
    // - Write out color from index

    vec2 xy = gl_FragCoord.xy / resolution;
    float phi = TAU * xy.x;
    float z = xy.y * zRange;

    MinInfo minInfo = computeMinValues(phi, z);

    // vec3 h = hash33(vec3(float(index)));
    // outColor = vec4(h, 1.0);
    outIndices = vec4(minInfo.indices) / float(MAX_BRANCHES);
    outValues = minInfo.values;
}