// Based on https://dl.acm.org/doi/10.1145/3528223.3530081, see also
// https://www.youtube.com/watch?v=mMvoTtipJac https://www.shadertoy.com/view/fsyyzt
// and https://github.com/marialarsson/procedural_knots

// See https://www.reddit.com/r/woodworking/comments/1u9m1d1/heard_yall_like_grain/


struct BranchState {
    float tb;
    float delta;
    float death;
    float beta;

    float isAlive;

    float oldT;        // For DEBUG
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

float bump(float x1, float x2, float y1, float y2, float t) {
    float s1 = smoothstep(x1, x2, t);
    float s2 = smoothstep(y1, y2, t);
    return s1 * (1.0-s2);
}

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
    float oldT = t;
    if (t > death) {
        isAlive = 0.0;
        float tDead = abs(ts - death);
        tb += tDead;

        float kDeath = k + 5.0*tDead;
        t = sminPow(ts, tb, kDeath);
        float tempDelta = t - min(ts, tb);

        float s = 8.0*tDead - 1.0;
        float f = 0.35 - 0.85*s/(0.3+abs(s));
        delta = f*tempDelta;
    }

    return BranchState(tb, delta, death, beta, isAlive, oldT);
}


vec4 wood(vec3 p) {
    p = vec3(p.x, -p.z, p.y+time);        // TODO find more systematic way to do this

    vec2 pith = getPith(p.z);

    float deadColorFactor = 0.0;
    float deadOutlineFactor = 1.0;

    // Write p in cylinder coordinates as (r,phi,p.z).
    vec2 v = p.xy - getPith(p.z);
    float phi = atan(v.y, v.x);
    float r = length(v);
float rStem = (4.0 + 0.5*snoise(0.5*vec3((0.5+debug8*sin(r))*normalize(p.xy-pith), p.z))) / 3.0;
    float ts = r / rStem;

    ivec4 branchIndices = ivec4(round(float(MAX_BRANCHES)*texture(branchIndexTex, vec2(phi/TAU, p.z/zRange))));

    float tb, delta, death, beta, isAlive, oldT;
    float deltaSum = 0.0;
    vec4 tbVec = vec4(0.0);
    for (int bk = 3; bk >= 0; bk--) {   // dominating term last
        BranchState bs = computeBranchState(p, r, phi, p.z, ts, branchIndices[bk]);
        tb = bs.tb;
        delta = bs.delta; 
        death = bs.death;
        beta = bs.beta;
        isAlive = bs.isAlive;
        oldT = bs.oldT;

        // Localize branch influence
        float branchInfluence = 1.0 - smoothstep(7.0, 8.5, tb/ts);    // 0 if tb > c*ts
        delta = mix(0.0, delta, branchInfluence);

        deltaSum += delta;
        tbVec[bk] = tb;
    }

    float tbMin = min(min(tbVec.x, tbVec.y), min(tbVec.z, tbVec.w));
    float tbSmoothMin = sminPow4(tbVec, 2.0);
    float t = min(ts, tbMin) + deltaSum;

    if (tb < death) {
        // Since a point can only belong to one knot, this only needs to be done for the dominant branch
        // Inside dead knot
        deadColorFactor = max(0.0, ts - death);

        // Dead knot outline
        float noise = snoise(vec3(cos(beta), sin(beta), ts));
        float thickness = 0.02 + 0.02*noise;  // 0 <~ thickness <~ 0.04
        if (abs(oldT - death) < thickness)
            deadOutlineFactor = 0.5;     // 0.65
    }


    vec2 vProfile = vec2(t < 1.0 ? 0.5*t : 0.5 + 0.5*mod(t-1.0, 1.0), 0.5);
    vec3 texColor = texture(profileTexture, vProfile).rgb;
    float g0 = clamp(1.2*tbSmoothMin-ts, 0.001, 1.0) + 1.0;    // 1.2
    float g = 0.5 / pow(g0, 14.0);
    texColor -= g * knotColor;      // darken knot (alive and dead)
    texColor -= g * clamp(3.0*deadColorFactor, 0.0, 0.5) * knotColor;  //further darken dead knot
    texColor = deadOutlineFactor * texColor;    //outline of dead knot

    if (debug1 > 0.8) {
        float x = (1.0+debug7)*tbSmoothMin - ts;
        float s = bump(-0.02, -0.01, 0.01, 0.02, x) * 0.0 + 1.0;
        s = tb < death && ts > death ? s : 0.0;
        return vec4(s, s, s, 1.0);
    }
    if (debug1 > 0.6) {
        float s = abs(oldT - death);
        float s1 = bump(-1.0, 0.0, 0.09*debug8, 0.11*debug8, s);
        float s2 = tb < death ? 1.0 : 0.0;
        float s3 = ts > death ? 1.0 : 0.0;
        return vec4(s1, s2, s3, 1.0);
    }
    if (debug1 > 0.4) {
        float t2 = min(ts, tb) + delta;
        float s = abs(t2 - death);
        return vec4(tb < death ? 1.0 : 0.0, 0.0, 0.0, 1.0);
    }
    if (debug1 > 0.2) {
        if (deadOutlineFactor < 1.0)
            return vec4(1.0, 0.0, 0.0, 1.0);
        return vec4(texColor, 1.0);
    }

    return vec4(fract(20.0*r), 0.0, 0.0, 1.0);

    // return vec4(texColor, 1.0);
}