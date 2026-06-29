precision highp float;

out vec3 vPos;
out vec2 vUv;

void main() {
    vPos = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}