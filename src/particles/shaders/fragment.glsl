varying vec2 vUv;
varying vec4 vPosition;

#define PI 3.14159265359

void decodeIntAndFloat(float encoded, out int i, out float f) {
    i = int(floor(encoded));
    float f_bounded = fract(encoded);
    f = tan(PI*(f_bounded - 0.5));  
}

void main() {
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(offset);
    // float t = 1.-smoothstep(0.4, 0.5, dist);
    if (dist > 0.5)
        discard;
    int stateI;
    float stateF;
    decodeIntAndFloat(vPosition.w, stateI, stateF);
    float t = mix(0.0, 1.0, stateF);
    // vec4 col0 = mix(vec4(0.2, 0.2, 0.2, 1.), vec4(1.0, 0.2, 0.2, 1.), t);
    // vec4 col1 = mix(vec4(0.2, 0.2, 0.2, 1.), vec4(0.2, 0.2, 1.0, 1.), t);
    // vec4 color = stateI == 0 ? col0 : col1;
    // vec4 color = stateI == 0 ? col0 : col1;
    vec4 color = mix(vec4(0.2, 0.2, 0.5, 1.), vec4(1.0, 0.5, 0.2, 1.), t);
    // vec4 color = vec4(t, t, t, 1.0);
    gl_FragColor = color;
}