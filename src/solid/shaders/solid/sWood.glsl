// Based on https://dl.acm.org/doi/10.1145/3528223.3530081, see also
// https://www.youtube.com/watch?v=mMvoTtipJac https://www.shadertoy.com/view/fsyyzt


mat4 precomputePlaceholder(vec3 p) {

    vec2 stem = vec3(0.05*snoise(p).xy, p.z);

    vec3 v = p - stem;
    float phi = atan2(v.y, v.x);

    vec3 knotStart = vec3(0.0, 0.0, 0.0);
    float knotDeath = 0.5;
}


vec4 wood(vec3 p) {
    return vec4(0.0);
}