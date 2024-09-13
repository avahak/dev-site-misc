// uPosition1 is prev positions, uPosition2 is current

/*
Steering forces:
1) enforce |steering|=maxSpeed
2) steering = steering-velocity
3) enforce |steering|<=maxForce

acceleration = sum(steering forces)
*/

uniform vec3 uPositionObject;
uniform sampler2D uPosition0;
uniform sampler2D uPosition1;
uniform sampler2D uPosition2;
varying vec2 vUv;
varying vec3 vPosition; // same as uPosition2, clean up at some point

vec2 random22(vec2 p) {
    // Source: The Book of Shaders
    return fract(sin(vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5, 183.3))))*43758.5453);
}

float random21(vec2 p) {
    // Source: The Book of Shaders
    return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453123);
}

float encodeIntAndFloat(int i, float f) {
    // Transform unbounded float to (0, 1)
    float f_bounded = (0.5 + atan(f) / (2.0 * 3.14159265359));  
    return float(i) + f_bounded;
}

void decodeIntAndFloat(float encoded, out int i, out float f) {
    i = int(floor(encoded));
    float f_bounded = encoded - float(i);
    f = tan(3.14159265359 * (f_bounded - 0.5));  
}

vec3 safeNormalize(vec3 v) {
    float d = length(v);
    if (d > 0.0)
        return v / d;
    else 
        return vec3(0., 0., 1.);
}

float computeState(vec3 p0, vec3 p1, vec3 p2, float state) {
    vec3 v02 = p2-p0;
    vec3 vp = p2-uPositionObject;
    float d0 = length(v02); // distance home
    float d1 = length(vp);  // distance to object

    vec2 rand = random22(vUv);

    // Get attached to the object if we are home and object is close
    if ((state < 0.5) && (d0 < 0.01) && (d1 < 0.2+0.2*rand.x))
        return 1.0;
    // Return home if distance home is too long
    if ((state > 0.5) && (d0 > 0.5+0.5*rand.y))
        return 0.0;
    return state;
}

vec3 computeSteering(vec3 vSteer, vec3 v, float maxSpeed, float maxForce) {
    vec3 steering = maxSpeed*safeNormalize(vSteer);
    steering = steering-v;
    float len = length(steering);
    if (len > 0.0) 
        steering = steering*min(maxForce/len, 1.0);
    return steering;
}

vec3 computeForce(vec3 p0, vec3 p1, vec3 p2, float state) {
    vec3 v02 = p2-p0;
    vec3 v = p2-p1;
    vec3 vp = p2-uPositionObject;

    float maxForce = 5.0;
    float maxSpeedHome = min(0.02, 0.1*length(v02));
    float maxSpeedOrbit = 0.1;
    // float maxForceOrbit = min(5., 5.*length(v)/maxSpeedOrbit+0.00001);
    float maxForceOrbit = 5.;

    vec3 steeringHome = computeSteering(-v02, v, maxSpeedHome, maxForce);
    vec3 steeringSpeedHome = computeSteering(v*(0.2-length(v)), v, maxSpeedHome, maxForce);

    vec3 steeringOrbit = computeSteering(vp*(0.2-length(vp)), v, maxSpeedOrbit, maxForceOrbit);
    vec3 steeringSpeedOrbit = computeSteering(v*(0.1-length(v)), v, maxSpeedOrbit, maxForceOrbit);

    if (state < 0.5)
        return steeringHome + steeringSpeedHome;
    return steeringOrbit + steeringSpeedOrbit;
}

void main() {
    vec4 p = texture2D(uPosition2, vUv);
    vec3 p0 = texture2D(uPosition0, vUv).xyz;
    vec3 p1 = texture2D(uPosition1, vUv).xyz;
    vec3 p2 = p.xyz;

    float state = computeState(p0, p1, p2, p.w);
    vec3 F = 0.01*computeForce(p0, p1, p2, state);

    // Verlet integration
    vec3 newPos = p2 + 0.9*(p2-p1) + F;

    gl_FragColor = vec4(newPos, state);
}
