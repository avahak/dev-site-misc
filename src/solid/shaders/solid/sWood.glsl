// Based on https://dl.acm.org/doi/10.1145/3528223.3530081, see also
// https://www.youtube.com/watch?v=mMvoTtipJac https://www.shadertoy.com/view/fsyyzt
// and https://github.com/marialarsson/procedural_knots


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
    // Power smooth minimum, see: https://iquilezles.org/articles/smin/
    a = pow(a, k);
    b = pow(b, k);
    return pow((a*b) / (a+b), 1.0 / k);
}

float sminPow4(vec4 A, float k) {
    vec4 Ak = pow(A, vec4(k));
    vec4 prod3s = Ak.yzwx * Ak.zwxy * Ak.wxyz;
    float prod4 = Ak.x * prod3s.x;
    float sum = dot(prod3s, vec4(1.0));
    return pow(prod4 / sum, 1.0 / k);
}

vec2 getPith(float z) {
    return 0.01*vnoise33(5.0*vec3(0.0, 0.0, z)).xy;
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
    float rBranch = br - 0.1*sqrt(r) + 0.02*snoise(1.0*vec3(cos(beta), sin(beta), r));

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


vec4 wood(vec3 p) {
    p = vec3(p.x, -p.z, p.y+time);        // TODO find more systematic way to do this

    vec2 pith = getPith(p.z);
    float rStem = (4.0 + 0.2*snoise(0.5*vec3(normalize(p.xy-pith), p.z))) / 3.0;

    float deadColorFactor = 0.0;
    float deadOutlineFactor = 1.0;

    // Write p in cylinder coordinates as (r,phi,p.z).
    vec2 v = p.xy - getPith(p.z);
    float phi = atan(v.y, v.x);
    float r = length(v);
    float ts = r / rStem;

    ivec4 branchIndices = ivec4(round(float(MAX_BRANCHES)*texture(branchIndexTex, vec2(phi/TAU, p.z/zRange))));

    float tb, delta, death, beta, isAlive;
    float deltaSum = 0.0;
    vec4 tbVec = vec4(0.0);
    for (int bk = 3; bk >= 0; bk--) {   // dominating term last
        BranchState bs = computeBranchState(p, r, phi, p.z, ts, branchIndices[bk]);
        tb = bs.tb;
        delta = bs.delta; 
        death = bs.death;
        beta = bs.beta;
        isAlive = bs.isAlive;

        // Localize branch influence
        float branchInfluence = 1.0 - smoothstep(6.0, 9.0, tb/ts);    // 0 if tb > c*ts
        delta = mix(0.0, delta, branchInfluence);

        deltaSum += delta;
        tbVec[bk] = tb;
    }

    if (tb < death) {
        // Since a point can only belong to one knot, this only needs to be done for the dominant branch
        // Inside dead knot
        deadColorFactor = max(0.0, ts - death);

        // Dead knot outline
        float noise = snoise(vec3(cos(beta), sin(beta), ts));
        float thickness = 0.02 + 0.02*noise;  // 0 <~ thickness <~ 0.04
        float tTemp = min(ts, tb) + delta;      // TODO rethink 
        if (abs(tTemp - death) < thickness)
            deadOutlineFactor = 0.65;
    }

    float tbMin = min(min(tbVec.x, tbVec.y), min(tbVec.z, tbVec.w));
    float tbSmoothMin = sminPow4(tbVec, 2.0);
    float t = min(ts, tbMin) + deltaSum;

    vec3 texColor = texture(profileTexture, vec2(t, 0.5)).rgb;
    float g = 1.0 / pow(clamp(1.2*tbSmoothMin-ts, 0.001, 1.0) + 1.0, 14.0);
    texColor -= g * knotColor;      // darken knot (alive and dead)
    texColor -= g * clamp(3.0*deadColorFactor, 0.0, 0.5) * knotColor;  //further darken dead knot
    texColor = deadOutlineFactor * texColor;    //outline of dead knot

    return vec4(texColor, 1.0);
}