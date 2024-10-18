precision highp float;

uniform sampler2D accumulatorMap1;
uniform sampler2D accumulatorMap2;
uniform vec2 resolution;
uniform int showMandelbrot;
uniform int showJulia;
varying vec4 vPosition;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
    vec4 color1 = texture2D(accumulatorMap1, vUv);
    vec4 color2 = texture2D(accumulatorMap2, vUv);
    if (showMandelbrot != 1 || showJulia != 1) {
        gl_FragColor = vec4(float(showMandelbrot)*color1.rgb + float(showJulia)*color2.rrr, 1.0);
        return;
    }
    gl_FragColor = vec4(color1.rgb*(0.3-0.25*color2.b), 1.0) + vec4(color2.rrr, color2.b);
}