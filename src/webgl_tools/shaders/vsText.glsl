precision highp float;

uniform int numChars;
uniform sampler2D dataTexture;

out vec2 atlasCoords;
out vec3 color;

#define TEXTURE_MAX_WIDTH 1024

void main() {
    // Read data
    int iIndex = 4 * gl_InstanceID;
    ivec2 texelIndex0 = ivec2(iIndex % TEXTURE_MAX_WIDTH, iIndex / TEXTURE_MAX_WIDTH);
    ivec2 texelIndex1 = ivec2((iIndex+1) % TEXTURE_MAX_WIDTH, (iIndex+1) / TEXTURE_MAX_WIDTH);
    ivec2 texelIndex2 = ivec2((iIndex+2) % TEXTURE_MAX_WIDTH, (iIndex+2) / TEXTURE_MAX_WIDTH);
    ivec2 texelIndex3 = ivec2((iIndex+3) % TEXTURE_MAX_WIDTH, (iIndex+3) / TEXTURE_MAX_WIDTH);
    vec4 tf0 = texelFetch(dataTexture, texelIndex0, 0);
    vec4 tf1 = texelFetch(dataTexture, texelIndex1, 0);
    vec4 tf2 = texelFetch(dataTexture, texelIndex2, 0);
    vec4 tf3 = texelFetch(dataTexture, texelIndex3, 0);

    // Unpack values
    vec4 atlas4 = tf0;
    vec3 posCenter = tf1.xyz;
    vec3 e1 = vec3(tf1.w, tf2.xy);
    vec3 e2 = vec3(tf2.zw, tf3.x);
    color = tf3.yzw;

    vec2 vUv = position.xy;
    vec4 vPos = vec4(posCenter + (vUv.x-0.5)*e1 + (vUv.y-0.5)*e2, 1.0);

    atlasCoords = atlas4.xy + vUv*(atlas4.zw - atlas4.xy);

    gl_Position = projectionMatrix * modelViewMatrix * vPos;
}