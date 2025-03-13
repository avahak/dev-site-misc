precision highp float;

uniform int numChars;
uniform sampler2D offsetCoordsTexture;
uniform sampler2D atlasCoordsTexture;

out vec2 atlasCoords;

#define MAX_WIDTH 1024

void main() {
    int iIndex = gl_InstanceID;
    ivec2 texelIndex = ivec2(iIndex % MAX_WIDTH, iIndex / MAX_WIDTH);

    vec2 p = position.xy;

    vec4 offset4 = texelFetch(offsetCoordsTexture, texelIndex, 0);
    vec2 offsetCoords = offset4.xy + p*(offset4.zw-offset4.xy);
    vec4 vPos = vec4(offsetCoords, 0.0, 1.0);

    vec4 atlas4 = texelFetch(atlasCoordsTexture, texelIndex, 0);
    atlasCoords = atlas4.xy + p*(atlas4.zw - atlas4.xy);

    gl_Position = projectionMatrix * modelViewMatrix * vPos;
}