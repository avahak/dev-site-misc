varying vec2 vUv;
varying vec4 vPosition;

#define PI 3.14159265359

float decodeFloat(float encoded) {
    float t = fract(encoded);
    return tan(PI*(t-0.5));
}

void main() {
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(offset);
    // float t = 1.-smoothstep(0.4, 0.5, dist);
    if (dist > 0.5)
        discard;

    float stateF = decodeFloat(vPosition.w);
    float t = mix(0.0, 1.0, stateF);
    vec4 color = mix(vec4(0.2, 0.2, 0.5, 1.), vec4(1.0, 0.5, 0.2, 1.), t);
    gl_FragColor = color;
}
