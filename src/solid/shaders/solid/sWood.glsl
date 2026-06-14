// Based on https://dl.acm.org/doi/10.1145/3528223.3530081, see also
// https://www.youtube.com/watch?v=mMvoTtipJac https://www.shadertoy.com/view/fsyyzt


struct Knot {
    vec3 start;
    float death;        // in [0,1]
    float strength;     // in [0,1] to prevent overlapping branches
    vec3 dir;           // (knot direction \beta, knot asymptotic verticality a, knot instant verticality b)
    float f;            // smoothness coefficient
    // etc.
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
    return 0.0*vnoise33(vec3(0.0, 0.0, z)).xy;
}


Knot knotLookupPlaceholder(vec3 p) {
    // Here we should use texture lookups, etc. 
    // Instead we use hardcoded values for testing.

    Knot knot;
    knot.start = vec3(getPith(0.0), 0.0);
    knot.death = debug2;
    knot.strength = 1.0;
    knot.dir = vec3(-PI/2.0, debug3, debug4);
    knot.f = -debug1;
    return knot;
}


vec4 wood(vec3 p) {
    p = vec3(p.x, -p.z, p.y);        // TODO find more systematic way to do this

    Knot knot = knotLookupPlaceholder(p);
    vec2 pith = getPith(p.z);

    vec2 v = p.xy - pith;
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
    float dRay = length(p - cp);
    float dKnot = dRay;
    
    // For the "butterfly" effect (i.e. nonuniform deformation around the axis of the knot)
    float cosBetaKnot = dot(vec3(-knotDirXY.y, knotDirXY.x, 0.0), p-cp) / dRay;
    float xx = cosBetaKnot * cosBetaKnot;
    float f = mix(-0.4, 0.1, xx);   // TODO improve
    float fk = mix(10.0, 5.0, xx);  // TODO improve

    float t0 = dPith;
    float t1 = 5.0 * dKnot;
    float t = sminPow(t0, t1, 2.0);

    float delta = t - min(t0, t1);

    float isAlive = 1.0;
    
    // Death
    if (t > knot.death) {
        isAlive = 0.0;
        float s = abs(t0 - knot.death);
        float kDelta = 2.0 + fk*s;
        t1 += s;
        delta = f * (sminPow(t0, t1, kDelta) - min(t0, t1));
    }
    t = min(t0, t1) + delta;

    t = mix(t0, t, knot.strength);

    // return vec4(vec3(mix(0.0, 1.0, cosBetaKnot*cosBetaKnot), mix(0.0, 1.0, 1.0-cosBetaKnot*cosBetaKnot), 0.0), 1.0);
    return vec4(vec2(sin(100.0/(0.1+debug5)*t)), isAlive, 1.0);
}