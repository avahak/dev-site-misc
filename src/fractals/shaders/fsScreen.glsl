precision highp float;

uniform sampler2D accumulatorMap1;
uniform sampler2D accumulatorMap2;
uniform vec2 resolution;
uniform int showJulia;
varying vec4 vPosition;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
    vec4 color1 = texture2D(accumulatorMap1, vUv);
    vec4 color2 = texture2D(accumulatorMap2, vUv);
    gl_FragColor = showJulia == 1 ? 
        vec4(color1.rgb*(0.3-0.25*color2.b), 1.0) + vec4(color2.rrr, color2.b) : 
        vec4(color1.rgb, 1.0);
}