out vec4 vPos;
out vec2 vUv;
out mat4 pvmMat;

void main() {
    vPos = vec4(position.xyz, 1.0);
    vUv = uv;
    pvmMat = projectionMatrix * modelViewMatrix;
    gl_Position = projectionMatrix * modelViewMatrix * vPos;
}