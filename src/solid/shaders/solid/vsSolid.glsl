uniform vec4 clipPlane;

out vec4 vPos;

void main() {
    vec3 p = position.xyz;
    if (dot(p, clipPlane.xyz) > clipPlane.w)
        p -= clipPlane.xyz * (dot(p, clipPlane.xyz) - clipPlane.w);
    vPos = vec4(p, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vPos;
}