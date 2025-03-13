precision highp float;

uniform int numChars;
uniform sampler2D offsetCoordsTexture;
uniform sampler2D atlasCoordsTexture;
uniform vec2 resolution;

out vec4 vPos;
out vec2 vUv;
out vec4 atlasCoords;

void main() {
    int vIndex = gl_VertexID;
    int iIndex = gl_InstanceID;
    vec2 p = position.xy;

    vec4 offset = texelFetch(offsetCoordsTexture, ivec2(iIndex, 0), 0);

    vPos = vec4(
        offset.x + p.x*(offset.z-offset.x), 
        offset.y + p.y*(offset.w-offset.y),
        0.0, 
        1.0
    );

    atlasCoords = texelFetch(atlasCoordsTexture, ivec2(iIndex, 0), 0);
    vUv = p.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vPos;
}