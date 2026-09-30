varying vec2 v_uv;

void main() {
    v_uv = position.xy; 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}