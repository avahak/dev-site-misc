uniform sampler2D trailMap;
uniform vec2 resolution;
uniform vec2 gaussianOffsets[9];
uniform float gaussianKernel[9];
varying vec4 vPosition;

#define PI 3.14159265359

void main() {
    vec2 uv = 0.5*(vPosition.xy+vec2(1.0));

    vec2 texelSize = 1.0/resolution;

    vec4 colorSum = vec4(0.0);

    // Apply 3x3 Gaussian blur
    for (int k = 0; k < 9; k++) {
        vec2 elementUV = uv + gaussianOffsets[k]*texelSize;
        vec4 value = texture2D(trailMap, elementUV);
        colorSum += value*gaussianKernel[k];
    }
    vec4 blurredFadedColor = 0.99*colorSum;

    gl_FragColor = vec4(blurredFadedColor.rgb, 1.0);
}
