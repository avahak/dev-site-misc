precision highp float;

uniform int numChars;
uniform sampler2D atlasTexture;
uniform vec2 unitRange;

in vec2 atlasCoords;
in vec3 color;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
    vec2 screenTexSize = vec2(1.0) / fwidth(atlasCoords);
    return max(dot(unitRange, screenTexSize), 1.0);
}

void main() {
    vec3 msd = texture(atlasTexture, atlasCoords).rgb;
    float sd = median(msd.r, msd.g, msd.b);
    float screenPxDistance = screenPxRange()*(sd - 0.5);
    float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);

    // Hacky
    if (opacity > 0.1) {
        gl_FragColor = vec4(color, opacity);
    } else {
        discard;
    }
}