uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(offset);
    // float t = 1.-smoothstep(0.4, 0.5, dist);
    if (dist > 0.5)
        discard;
    gl_FragColor = vec4(1., 1., 0., 1.);
}
