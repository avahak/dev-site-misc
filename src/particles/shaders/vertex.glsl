// From three.js: position, uv, normal

uniform sampler2D uPosition;
varying vec2 vUv;
varying vec4 vPosition;

void main() {
    vPosition = texture2D(uPosition, uv);
    vUv = uv;
    gl_PointSize = vPosition.w > 1.0 ? 1.0 : 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition.xyz, 1.);
}