// From three.js: position, uv, normal

uniform float time;
uniform sampler2D u_pos;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vPosition = texture2D(u_pos, uv).xyz;
    vUv = uv;
    gl_PointSize = 5.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition.xyz, 1.);
}