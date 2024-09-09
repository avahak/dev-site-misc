uniform float time;
uniform sampler2D u_pos;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vec4 pos = texture2D(u_pos, vUv);
    pos.x += 0.0001;
    gl_FragColor = vec4(pos);
}
