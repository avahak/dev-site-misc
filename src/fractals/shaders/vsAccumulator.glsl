precision highp float;

varying vec4 vPosition;
varying vec2 vUv;

void main() {
    vPosition = vec4(position.xy, 0., 1.);
    vUv = uv;
    gl_Position = vPosition;
}