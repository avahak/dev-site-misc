varying vec4 vPosition;

void main() {
    vPosition = vec4(position.xy, 0., 1.);
    gl_Position = vPosition;
}