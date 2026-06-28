out vec3 vPos;
out vec2 vUv;
out vec3 vNormal;

void main() {
    vPos = position;
    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}