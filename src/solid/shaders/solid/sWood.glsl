// Based on https://dl.acm.org/doi/10.1145/3528223.3530081, see also
// https://www.youtube.com/watch?v=mMvoTtipJac https://www.shadertoy.com/view/fsyyzt


struct Knot {
    vec3 start;
    float death;        // in [0,1]
    float strength;     // in [0,1] to prevent overlapping branches
    vec3 dir;           // (knot direction \beta, knot asymptotic verticality a, knot instant verticality b)
    // etc.
};


float pointRayDistance(vec3 p, vec3 base, vec3 dir){
    // Returns dist(p, { base+t*dir: t>=0 })
    float t = max(0.0, dot(p - base, dir));
    vec3 cp = base + t*dir;
    return length(p - cp);
}


vec2 getPith(float z) {
    return 0.05*vnoise33(vec3(0.0, 0.0, z)).xy;
}


Knot knotLookupPlaceholder(vec3 p) {
    // Here we should use texture lookups, etc. 
    // Instead we use hardcoded values for testing.

    Knot knot;
    knot.start = vec3(getPith(0.0), 0.0);
    knot.death = 0.6;
    knot.strength = 1.0;
    knot.dir = vec3(-PI/2.0, 0.2, 0.5);
    return knot;
}


vec4 wood(vec3 p) {
    p = vec3(p.x, -p.z, p.y);        // TODO find more systematic way

    Knot knot = knotLookupPlaceholder(p);
    vec2 pith = getPith(p.z);

    vec2 v = p.xy - pith;
    float phi = atan(v.y, v.x);
    float r = length(v);
    // Now p is (r,phi,p.z) in cylinder coordinates.

    // knotP is considered closest point to p on the knot skeleton (NOTE this is an approximation)
    vec3 knotP = knot.start + vec3(
        r*cos(knot.dir.x), 
        r*sin(knot.dir.x), 
        knot.dir.y*r + knot.dir.z*sqrt(r)
    );

    float dPith = r;
    float dKnot = 5.0*pointRayDistance(p, knotP, vec3(cos(knot.dir.x), sin(knot.dir.x), 0.0));
    // float dKnot = length(p - knotP);

    return vec4(vec3(dKnot), 1.0);
}