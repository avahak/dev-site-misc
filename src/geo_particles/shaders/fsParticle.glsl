// uPosition1 is prev positions, uPosition2 is current, uPosition0 is resting position

/*
vPosition.w is state, which encodes (stateI,stateF), where stateI is int
and stateF is lower precision float. stateI is -1 if particle is attached to home position,
and >=0 when the particle is attached to objects[stateI].
*/

/*
Steering forces:
1) enforce |steering|=maxSpeed
2) steering = steering-velocity
3) enforce |steering|<=maxForce

acceleration = sum(steering forces)
*/

#define NUM_OBJECTS 16       // NOTE! This has to be same as in config.ts

uniform vec3 uPositionObjects[NUM_OBJECTS];
uniform sampler2D uPosition0;   // initial positions for particles
uniform sampler2D uPosition1;   // particles previous positions
uniform sampler2D uPosition2;   // current particle positions
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

float encodeIntAndFloat(int i, float f) {
    float t = 0.5 + atan(f)/PI;
    return float(i) + t;
}
int decodeInt(float encoded) {
    return int(floor(encoded));
}
float decodeFloat(float encoded) {
    float t = fract(encoded);
    return tan(PI*(t-0.5));
}

// float encodeIntAndFloat(int i, float f) {
//     return float(i) + f;
// }
// int decodeInt(float encoded) {
//     return int(floor(encoded));
// }
// float decodeFloat(float encoded) {
//     return fract(encoded);
// }

vec3 safeNormalize(vec3 v) {
    float d = length(v);
    if (d > 0.0)
        return v / d;
    else 
        return vec3(0., 0., 1.);
}

float computeState(vec3 p0, vec3 p1, vec3 p2, float state) {
    int stateI = decodeInt(state);
    float stateF = decodeFloat(state);

    vec2 rand1 = random22(vUv);

    // for debug:
    if (stateI < -1 || stateI >= NUM_OBJECTS)
        return state;

    if (stateI == -1)
        stateF = max(0.0, stateF-0.005);
    if (stateI >= 0)
        stateF = min(1.0, stateF+0.005);

    int newStateI = stateI;

    vec3 v02 = p2-vec3(p0.xy, 0.0);
    float dist0 = length(v02); // distance home

    if (stateI == -1) {
        // Get attached to the object if we are home and object is close
        for (int k = 0; k < NUM_OBJECTS; k++) {
            vec3 vp = p2-uPositionObjects[k];
            float dist1 = length(vp);  // distance to object

            vec2 rand2 = random22(vUv + vec2(float(k), 0.0));

            // BUG ON MOBILE!!! INSANITY!
            // The following logically equivalent code blocks yield different 
            // results on OnePlus Nord mobile phone (commented code yields incorrect result).
            // if ((dist0 < 0.01) && (dist1 < 0.25+0.5*rand.x*rand.y)) 
            //     newStateI = k;
            if (dist0 < 0.01)
                if (dist1 < -0.22+0.5*rand2.x*rand2.y)
                // if (dist1 < 0.3)
                    newStateI = k;
        }
        return encodeIntAndFloat(newStateI, stateF);
    }

    // Now stateI >= 0:

    // Return home if distance home is too long
    if (dist0 > 0.4+0.2*rand1.y) {
        newStateI = -1;
    }
    return encodeIntAndFloat(newStateI, stateF);
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
    int stateI = decodeInt(state);
    float stateF = decodeFloat(state);

    vec3 v02 = p2-vec3(p0.xy, 0.0);
    vec3 v = p2-p1;

    float maxForce = 5.;
    float maxSpeedHome = min(0.02, 0.1*sqrt(length(v02)));
    if (length(v02) < 0.005)
        maxSpeedHome *= 0.1;
    float maxSpeedOrbit = 0.1;
    float maxForceOrbit = 1.;

    vec3 steeringHome = computeSteering(-v02, v, maxSpeedHome, maxForce);
    vec3 steeringSpeedHome = computeSteering(v*(0.2-length(v)), v, maxSpeedHome, maxForce);

    if (stateI == -1)
        return steeringHome + steeringSpeedHome;

    vec3 vp = p2-uPositionObjects[stateI];
    vec3 steeringOrbit = computeSteering(vp*(0.1-length(vp)), v, maxSpeedOrbit*0.4, maxForceOrbit);
    vec3 steeringSpeedOrbit = computeSteering(v*(0.05-length(v)), v, maxSpeedOrbit, maxForceOrbit);

    return steeringOrbit + steeringSpeedOrbit;
}

// float debug(vec3 p0, vec3 p1, vec3 p2, float state) {
//     int stateI = decodeInt(state);
//     float stateF = decodeFloat(state);
//     float newState = computeState(p0, p1, p2, state);
//     return newState;
// }

void main() {
    vec4 p = texture2D(uPosition2, vUv);
    vec3 p0 = texture2D(uPosition0, vUv).xyz;
    vec3 p1 = texture2D(uPosition1, vUv).xyz;
    vec3 p2 = p.xyz;

    float state = computeState(p0, p1, p2, p.w);
    vec3 F = 0.007*computeForce(p0, p1, p2, state);
    vec3 newPos = p2 + 0.8*(p2-p1) + F;     // Verlet integration
    gl_FragColor = vec4(newPos, state);
    // gl_FragColor = vec4(p0, p.w);
}
