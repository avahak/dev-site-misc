uniform sampler2D uPosition;
varying vec2 vUv;

#define PI 3.14159265359

vec2 random22(vec2 p) {
    // Source: The Book of Shaders
    return fract(sin(vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5, 183.3))))*43758.5453);
}

float random21(vec2 p) {
    // Source: The Book of Shaders
    return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453123);
}

vec3 safeNormalize(vec3 v) {
    float d = length(v);
    if (d > 0.0)
        return v / d;
    else 
        return vec3(0., 0., 1.);
}

vec4 newPosition(vec4 p) {
    float d = 0.001;
    float sensorAngle = 0.5;

    vec2 v = vec2(cos(p.z), sin(p.z));
    vec2 v1 = vec2(cos(p.z+sensorAngle), sin(p.z+sensorAngle));
    vec2 v2 = vec2(cos(p.z-sensorAngle), sin(p.z-sensorAngle));

    vec4 q = p + d*vec4(v, 0., 0.);
    vec4 q1 = p + d*vec4(v1, 0., 0.);
    vec4 q2 = p + d*vec4(v2, 0., 0.);
    // Here we need double buffering for canvas also to read values from

    return q;
}

void main() {
    vec4 p = texture2D(uPosition, vUv);
    gl_FragColor = newPosition(p);
}
