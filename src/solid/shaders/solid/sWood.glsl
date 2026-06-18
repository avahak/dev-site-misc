// Based on https://dl.acm.org/doi/10.1145/3528223.3530081, see also
// https://www.youtube.com/watch?v=mMvoTtipJac https://www.shadertoy.com/view/fsyyzt
// and https://github.com/marialarsson/procedural_knots



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


LookupInfo lookupPlaceholder(vec3 p) {
    // Here we should use texture lookups, etc. 
    // Instead we use hardcoded values for testing.

    Knot knot;
    knot.start = vec3(getPith(0.0), 0.0);
    knot.death = debug2;
    knot.strength = 1.0;
    knot.dir = vec2(-PI/2.0, 2.0*debug3);

    LookupInfo lookup;
    lookup.knot = knot;
    lookup.pith = getPith(p.z);
    lookup.rStem = (4.0 + 0.2*snoise(0.5*vec3(normalize(p.xy-lookup.pith), p.z))) / 3.0;

    return lookup;
}


vec4 wood(vec3 p) {
    p = vec3(p.x, -p.z, p.y+time);        // TODO find more systematic way to do this

    float deadColorFactor = 0.0;
    float deadOutlineFactor = 1.0;

    LookupInfo lookup = lookupPlaceholder(p);
    Knot knot = lookup.knot;

    // Write p in cylinder coordinates as (r,phi,p.z).
    vec2 v = p.xy - getPith(p.z);
    float phi = atan(v.y, v.x);
    float r = length(v);

    int branchIndex = int(round(float(MAX_BRANCHES)*texture(branchIndexTex, vec2(phi/TAU, p.z/zRange)).r));
    vec4 branchZASD = branchesZASD[branchIndex];
    vec4 branchR = branchesR[branchIndex];
    knot.start = vec3(0.0, 0.0, branchZASD.x);
    knot.dir = vec2(branchZASD.y, branchZASD.z);
    knot.death = branchZASD.w;
    float br = branchR.x;
    vec3 h = hash33(vec3(float(branchIndex)));
    // vec3 h = hash33(vec3(float(int(20.0*phi))));
    // return vec4(h, 1.0);



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

    // Localize branch influence
    // float branchInfluence = 1.0 - smoothstep(3.0, 5.0, t1/t0);    // 0 if t1 > 5*t0
    float branchInfluence = 1.0 - smoothstep(3.5, 4.0, t1/t0);    // 0 if t1 > 5*t0
    t = mix(t0, t, branchInfluence);

    if (debug6 > 2.0/3.0)
        t = t0;

    if (t1 < knot.death) {
        // Inside dead knot
        deadColorFactor = max(0.0, t0 - knot.death);

        // Dead knot outline
        float noise = snoise(vec3(cos(betaKnot), sin(betaKnot), t0));
        float thickness = 0.02 + 0.02*noise;  // 0 <~ thickness <~ 0.04
        if (abs(t - knot.death) < thickness)
            deadOutlineFactor = 0.65;
    }

    vec3 texColor = texture(profileTexture, vec2(t, 0.5)).rgb;
    float g = 1.0 / pow(clamp(1.2*t1-t0, 0.001, 1.0) + 1.0, 14.0);
    texColor -= g * knotColor;      // darken knot (alive and dead)
    texColor -= g * clamp(3.0*deadColorFactor, 0.0, 0.5) * knotColor;  //further darken dead knot
    texColor = deadOutlineFactor * texColor;    //outline of dead knot

    return vec4(texColor, 1.0);
}