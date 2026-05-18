uniform vec2 resolution;
uniform vec3 cameraPos;
uniform mat4 vpMat;         // view-projection matrix of the main camera
uniform mat4 invVpMat;      // inverse of vpMap
uniform float time;
uniform sampler2D opaqueDepthTex;
uniform sampler2D opaqueColorTex;
uniform sampler2D frontTex;
uniform sampler2D regularTex;
uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;

in vec4 vPos;
in vec2 vUv;
in mat4 pvmMat;

vec3 worldPosition(float depth) {
    vec3 ndc = 2.0*vec3(vUv.x, vUv.y, depth) - 1.0;
    vec4 ph = invVpMat * vec4(ndc, 1.0);
    return ph.xyz / ph.w;
}

void main() {
    vec4 plane = vec4(cos(time), 0.0, sin(time), 0.25);

    vec2 fTexColor = texture(frontTex, vUv).rg;
    vec2 rTexColor = texture(regularTex, vUv).rg;
    float opaqueDepth = texture(opaqueDepthTex, vUv).r;
    vec3 opaqueColor = texture(opaqueColorTex, vUv).rgb;

    float fDepth = fTexColor.r;
    float rDepth = rTexColor.r;
    int fObjectId = int(round(fTexColor.g * 1024.0));
    int rObjectId = int(round(rTexColor.g * 1024.0));

    vec3 color = opaqueColor;

    if (((rDepth < fDepth-EP) || (fObjectId == 0)) && (rObjectId > 0) && (rDepth < opaqueDepth-EP)) {
        vec3 rp = worldPosition(rDepth);
        vec3 rColor = solid_compound(rp, rObjectId);

        color = debug3*opaqueColor + (1.0-debug3)*rColor;
    }

    gl_FragColor = vec4(color, 1.0);
}