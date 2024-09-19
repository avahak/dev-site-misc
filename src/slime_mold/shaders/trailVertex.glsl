varying vec2 vUv;
varying vec4 vPosition;

void main() {
    vPosition = vec4(position.xy, 0., 1.);
    vUv = uv;
    gl_Position = vPosition;
}