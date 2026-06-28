uniform sampler2D particleMap;
out vec4 vParticle;

void main() {
    vParticle = texture(particleMap, position.xy);
    gl_PointSize = vParticle.w > 1.0 ? 1.0 : 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xyz, 1.);
}