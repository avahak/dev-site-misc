/*
020 no change
202 turn randomly 
012 turn right
210 turn left 
*/

uniform sampler2D trailMap;
uniform sampler2D uPosition;
uniform vec2 resolution;    // dimensions of trailMap
uniform float time;
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

// see https://en.wikipedia.org/wiki/Relative_luminance
float brightness(vec4 color) {
    return (0.2126*color.r + 0.7152*color.g + 0.0722*color.b)*color.a;
}

vec2 wrap(vec2 p) {
    // maybe easier with mod
    float aspect = resolution.x/resolution.y;
    // vec2 q = p;
    vec2 q = vec2(mod(p.x+aspect, 2.*aspect)-aspect, mod(p.y+1., 2.)-1.);
    // q.x = mod(q.x+aspect, 2.*aspect)-aspect;
    // q.y = mod(q.x+1., 2.)-1.;
    // if (q.x > aspect)
    //     q.x -= aspect;
    // if (q.x < -aspect)
    //     q.x += aspect;
    // if (q.y > 1.)
    //     q.y -= 1.;
    // if (q.y < -1.)
    //     q.y += 1.;
    return q;
}

vec4 newPosition(vec4 p) {
    float d = 0.02;
    float sensorAngle = 0.2;
    float aspect = resolution.x/resolution.y;
    vec2 res = 2.*vec2(aspect, 1.);
    vec2 offset = vec2(0.5);

    vec2 v0 = vec2(cos(p.z), sin(p.z));
    vec2 v1 = vec2(cos(p.z+sensorAngle), sin(p.z+sensorAngle));
    vec2 v2 = vec2(cos(p.z-sensorAngle), sin(p.z-sensorAngle));

    vec4 q0 = vec4(p.xy + d*v0, p.z, p.w);
    vec4 q1 = vec4(p.xy + d*v1, p.z+sensorAngle, p.w);
    vec4 q2 = vec4(p.xy + d*v2, p.z-sensorAngle, p.w);
    vec2 uv0 = wrap(p.xy + d*v0)/res + offset;
    vec2 uv1 = wrap(p.xy + d*v1)/res + offset;
    vec2 uv2 = wrap(p.xy + d*v2)/res + offset;

    vec4 trail0 = texture2D(trailMap, uv0);
    vec4 trail1 = texture2D(trailMap, uv1);
    vec4 trail2 = texture2D(trailMap, uv2);
    float b0 = brightness(trail0);
    float b1 = brightness(trail1);
    float b2 = brightness(trail2);

    if ((b0 > b1) && (b0 > b2))
        return q0;
    if ((b0 <= b1) && (b0 <= b2)) {
        if (random21(p.xy+vec2(time)) > 0.5)
            return q1;
        return q2;
    }
    if ((b0 <= b1) && (b0 > b2))
        return q1;
    return q2;
}

void main() {
    vec4 p = texture2D(uPosition, vUv);
    vec4 q = newPosition(p);
    q.xy = wrap(q.xy);
    gl_FragColor = q;
}
