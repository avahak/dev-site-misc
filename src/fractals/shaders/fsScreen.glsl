precision highp float;

uniform sampler2D accumulatorMap;
uniform vec2 resolution;
varying vec4 vPosition;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
    vec4 color = texture2D(accumulatorMap, vUv);
    gl_FragColor = vec4(color.rgb, 1.0);
}