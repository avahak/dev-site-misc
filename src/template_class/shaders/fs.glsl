precision highp float;

uniform vec2 resolution;
uniform float time;

in vec3 vPos;
in vec2 vUv;

void main() {
    // float aspect = resolution.x / resolution.y;
    gl_FragColor = vec4(0.2+0.2*sin(5.0*vPos.xy+vec2(time)), 0.4, 1.0);
}