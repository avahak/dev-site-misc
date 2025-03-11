uniform sampler2D particleMap;
varying vec3 vPosition;
flat out int vertexID;

void main() {
    vPosition = position;
    vertexID = gl_VertexID;
    gl_PointSize = 50.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}