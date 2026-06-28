out vec3 vPos;

void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}