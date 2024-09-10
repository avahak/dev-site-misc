// From three.js: position, uv, normal

uniform sampler2D uPosition;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vPosition = texture2D(uPosition, uv).xyz;
    vUv = uv;
    gl_PointSize = 1.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition.xyz, 1.);
}