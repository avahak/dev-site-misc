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
    float aspect = resolution.x/resolution.y;
    vec2 q = vec2(mod(p.x+aspect, 2.*aspect)-aspect, mod(p.y+1., 2.)-1.);
    return q;
}

vec4 newPosition(vec4 p) {
    float a = 1.1;
    float b = 0.01;
    float speed = 0.01;
    float sensorAngle = 45.0/180.0*3.14159;
    float turningAngle = 15.0/180.0*3.14159;
    float sensorDist = 2.0*speed;
    float aspect = resolution.x/resolution.y;
    vec2 res = 2.*vec2(aspect, 1.);
    vec2 offset = vec2(0.5);

    vec2 v0 = p.xy + sensorDist*vec2(cos(p.z), sin(p.z));
    vec2 v1 = p.xy + sensorDist*vec2(cos(p.z+sensorAngle), sin(p.z+sensorAngle));
    vec2 v2 = p.xy + sensorDist*vec2(cos(p.z-sensorAngle), sin(p.z-sensorAngle));
    vec2 w0 = p.xy + speed*vec2(cos(p.z), sin(p.z));
    vec2 w1 = p.xy + speed*vec2(cos(p.z+turningAngle), sin(p.z+turningAngle));
    vec2 w2 = p.xy + speed*vec2(cos(p.z-turningAngle), sin(p.z-turningAngle));

    vec4 q0 = vec4(w0, p.z, p.w);
    vec4 q1 = vec4(w1, p.z+turningAngle, p.w);
    vec4 q2 = vec4(w2, p.z-turningAngle, p.w);
    vec2 uv0 = v0/res + offset;
    vec2 uv1 = v1/res + offset;
    vec2 uv2 = v2/res + offset;

    vec4 trail0 = texture2D(trailMap, uv0);
    vec4 trail1 = texture2D(trailMap, uv1);
    vec4 trail2 = texture2D(trailMap, uv2);
    float b0 = brightness(trail0);
    float b1 = brightness(trail1);
    float b2 = brightness(trail2);

    if ((b0 > a*b1+b) && (b0 > a*b2+b))
        return q0;
    if ((b0 <= a*b1+b) && (b0 <= a*b2+b)) {
        if (random21(p.xy+vec2(time)) > 0.5)
            return q1;
        return q2;
    }
    if (b1 < b2)
        return q2;
    return q1;
}

void main() {
    vec4 p = texture2D(uPosition, vUv);
    vec4 q = newPosition(vec4(wrap(p.xy), p.zw));
    gl_FragColor = vec4(wrap(q.xy), q.zw);
}