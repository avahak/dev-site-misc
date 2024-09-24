uniform sampler2D trailMap;
uniform vec2 resolution;
uniform vec2 kernelOffsets[9];
uniform float kernelWeights[9];
varying vec4 vPosition;

#define PI 3.14159265359

// see https://en.wikipedia.org/wiki/Relative_luminance
float brightness(vec4 color) {
    // return (0.2126*color.r + 0.7152*color.g + 0.0722*color.b)*color.a;
    return (color.r + color.g + color.b)*color.a/3.0;
}

void main() {
    vec2 uv = 0.5*(vPosition.xy+vec2(1.));

    vec2 texelSize = 1.0/resolution;

    vec4 colorSum = vec4(0.);

    // Apply 3x3 Gaussian blur
    for (int k = 0; k < 9; k++) {
        vec2 elementUV = uv + kernelOffsets[k]*texelSize;
        vec4 value = texture2D(trailMap, elementUV);
        colorSum += value*kernelWeights[k];
    }
    vec4 blurredFadedColor = 0.8*colorSum;
    // vec4 blurredFadedColor = brightness(colorSum) > 0.1 ? 0.8*colorSum : colorSum;

    gl_FragColor = vec4(blurredFadedColor.rgb, 1.0);
}
