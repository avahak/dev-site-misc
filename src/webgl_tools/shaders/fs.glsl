precision highp float;

uniform vec2 resolution;
uniform float time;

in vec4 vPos;
in vec2 vUv;
flat in int segment;

void main() {
    // float aspect = resolution.x / resolution.y;
    vec3 col = vec3(
        0.5+0.5*sin(float(segment/10)/16.0*3.14159+5.51), 
        0.5+0.5*cos(float(segment/10)/32.0*3.14159+7.51), 
        0.5+0.5*sin(float(segment/10)/64.0*3.14159+12.51)
    );
    vec3 col0 = 0.8*vec3(1.0, 1.0, 1.0);
    float t = 0.5;
    gl_FragColor = vec4(mix(col, col0, t), 1.0);
}