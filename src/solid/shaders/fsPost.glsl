uniform vec2 resolution;
uniform vec3 cameraPos;
uniform float time;
uniform sampler2D gOne;
uniform sampler2D gTwo;

in vec4 vPos;
in vec2 vUv;
in mat4 pvmMat;

void main() {
    vec4 color = texture(gOne, vUv) + texture(gTwo, vUv);
    gl_FragColor = vec4(color.rgb, 1.0);
}