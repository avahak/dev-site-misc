varying vec4 vParticle;

#define PI 3.14159265359

void main() {
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(offset);
    // float t = 1.-smoothstep(0.4, 0.5, dist);
    if (dist > 0.5)
        discard;

    gl_FragColor = vec4(0.2, 0.5, 1., 0.001);
}
