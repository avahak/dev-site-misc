// Based on https://dl.acm.org/doi/10.1145/3528223.3530081, see also
// https://www.youtube.com/watch?v=mMvoTtipJac https://www.shadertoy.com/view/fsyyzt
// and https://github.com/marialarsson/procedural_knots



struct Knot {
    vec3 start;
    float death;        // in [0,1]
    float strength;     // in [0,1] to prevent overlapping branches
    vec3 dir;           // (knot direction \beta, knot asymptotic verticality a, knot instant verticality b)
    // etc.
};

struct LookupInfo {
    float rStem;
    vec2 pith;
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
    return 0.02*vnoise33(5.0*vec3(0.0, 0.0, z)).xy;
}


LookupInfo lookupPlaceholder(vec3 p) {
    // Here we should use texture lookups, etc. 
    // Instead we use hardcoded values for testing.

    Knot knot;
    knot.start = vec3(getPith(0.0), 0.0);
    knot.death = debug2;
    knot.strength = 1.0;
    knot.dir = vec3(-PI/2.0, debug3, debug4);

    LookupInfo lookup;
    lookup.knot = knot;
    lookup.pith = getPith(p.z);
    lookup.rStem = (2.0 + 0.2*snoise(0.5*vec3(normalize(p.xy-lookup.pith), p.z))) / 3.0;

    return lookup;
}


vec4 wood(vec3 p) {
    p = vec3(p.x, -p.z, p.y);        // TODO find more systematic way to do this

    LookupInfo lookup = lookupPlaceholder(p);
    Knot knot = lookup.knot;

    vec2 v = p.xy - lookup.pith;
    float phi = atan(v.y, v.x);
    float r = length(v);
    // Now p is (r,phi,p.z) in cylinder coordinates.

    // knotP is considered closest point to p on the knot skeleton (NOTE this is an approximation)
    vec2 knotDirXY = vec2(cos(knot.dir.x), sin(knot.dir.x));
    vec3 knotP = knot.start + vec3(
        r*knotDirXY, 
        knot.dir.y*r + knot.dir.z*r/(0.1+r)
    );

    float dPith = r;
    vec3 cp = closestRayPoint(p, knotP, vec3(knotDirXY, knot.dir.y));
    float dKnot = distance(p, cp);      // or just: distance(p, knotP);
    
    vec3 betaVec = p - knotP;
    float betaKnot = atan(betaVec.z, dot(betaVec.xy, vec2(-knotDirXY.y, knotDirXY.x)));
    // float cosBetaKnot = cos(betaKnot);
    float rKnot = 0.2 - 0.0*sqrt(dPith) + 0.02*snoise(1.0*vec3(cos(betaKnot), sin(betaKnot), dPith));

    float t0 = dPith / lookup.rStem;
    float t1 = dKnot / rKnot;

    float tDelta = t0 - t1;
    float k = 1.75*tDelta/(0.3+abs(tDelta)) + 3.25;

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


    // t = mix(t0, t, knot.strength);

    return vec4(vec2(sin(100.0/(0.1+debug5)*t)), isAlive, 1.0);
}