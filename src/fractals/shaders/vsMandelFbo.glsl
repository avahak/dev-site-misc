precision highp float;

varying vec4 vPosition;
varying vec2 vUv;

void main() {
    vPosition = vec4(position.xy, 0.0, 1.0);
    vUv = uv;
    gl_Position = vPosition;
}