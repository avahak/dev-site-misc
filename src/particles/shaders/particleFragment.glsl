// uPosition1 is prev positions, uPosition2 is current

/*
Idea: 
1) Compute distance d0 between current pos and initial pos.
2) Create "homefinding" force F0 
3) Create "orbiting" force F1 that tries to
    - force distance from center to 1
    - force velocity length to 1
4) Compute combined force F=mix of F0 and F1 based on ...
5) apply Verlet integration with force F
    - if d0 is small then apply F1
    - if d0 is large, apply F0
*/

uniform vec3 uPositionObject;
uniform sampler2D uPosition0;
uniform sampler2D uPosition1;
uniform sampler2D uPosition2;
varying vec2 vUv;
varying vec3 vPosition; // same as uPosition2, clean up at some point

vec3 safeNormalize(vec3 v) {
    float d = length(v);
    if (d > 0.0)
        return v / d;
    else 
        return vec3(0., 0., 1.);
}

vec3 computeForce(vec3 p0, vec3 p1, vec3 p2) {
    vec3 v02 = p2-p0;
    vec3 v = p2-p1;
    vec3 F0 = safeNormalize(v)*(0.1-length(v)) + safeNormalize(v02);

    vec3 vp = p2-uPositionObject;
    vec3 F1 = safeNormalize(v)*(0.1-length(v)) + safeNormalize(vp)*(0.1-length(vp));


    float d0 = length(v02); // distance home
    float d1 = length(vp);  // distance to object
    float t = 1.-smoothstep(0.2, 0.3, min(d0/3., d1));

    return t*F0 + (1.-t)*F1;
}

void main() {
    vec3 p0 = texture2D(uPosition0, vUv).xyz;
    vec3 p1 = texture2D(uPosition1, vUv).xyz;
    vec3 p2 = texture2D(uPosition2, vUv).xyz;

    vec3 F = computeForce(p0, p1, p2);
    vec3 newPos = 2.*p2-p1 + 0.01*F;

    gl_FragColor = vec4(newPos, 1.);
}
