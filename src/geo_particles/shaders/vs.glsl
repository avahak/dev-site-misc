uniform sampler2D particleMap;
flat out vec4 vParticle;
flat out vec3 vPosition;

void main() {
    vPosition = position;
    vParticle = texture2D(particleMap, position.xy);
    // gl_PointSize = vParticle.w > 0.0 ? 30.0 : 6.0;
    gl_PointSize = 30.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xyz, 1.);
}