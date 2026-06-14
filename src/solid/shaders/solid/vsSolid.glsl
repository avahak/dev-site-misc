out vec4 vPos;

void main() {
    vPos = vec4(position.xyz, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vPos;
}