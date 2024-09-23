// From three.js: position, uv, normal

uniform sampler2D particleMap;
varying vec4 vParticle;

void main() {
    vParticle = texture2D(particleMap, position.xy);
    gl_PointSize = 3.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xy, 0.5, 1.);
}