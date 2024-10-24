uniform sampler2D particleMap;
varying vec3 vPosition;

void main() {
    vPosition = position;
    gl_PointSize = 50.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}