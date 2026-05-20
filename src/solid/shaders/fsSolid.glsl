uniform vec2 resolution;
uniform vec3 cameraPos;
uniform mat4 vpMat;         // view-projection matrix of the main camera
uniform mat4 invVpMat;      // inverse of vpMap
uniform float time;
uniform sampler2D backTex;
uniform sampler2D frontTex;
// uniform sampler2D regularTex;      // Handling semi-transparency moved to later processing step
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

    vec2 bTexColor = texture(backTex, vUv).rg;
    vec2 fTexColor = texture(frontTex, vUv).rg;

    float bDepth = bTexColor.r;
    float fDepth = fTexColor.r;
    int bObjectId = int(round(bTexColor.g * 1024.0));
    int fObjectId = int(round(fTexColor.g * 1024.0));

    // EP=0 below -> z-fighting when two objects close to each other
    // EP=1e-5 below -> near edges where |fDepth-bDepth| < EP 
    //     we get nullify=0 but correct value 1 -> we jump to plane that has 
    //     nothing to do with it -> we use plane z that is completely wrong -> artifacts
    // Possible fix: use EP=0 when the objects are the same but EP=1e-5 if they are different:
    float ep = (fObjectId == bObjectId) ? 0.0 : EP;
    int nullify = ((fObjectId > 0) && (fDepth < bDepth-ep)) ? 1 : 0;

    vec4 fClip = vec4(vUv.x, vUv.y, fDepth, 1.0);
    vec3 fNdc = 2.0*fClip.xyz - 1.0;
    vec3 fp = worldPosition(fDepth);
    vec3 fColor = fObjectId > 0 ? solid_compound(fp, fObjectId) : vec3(0.0);

    float depth = fDepth;
    vec3 color = fColor;

    int clipping = (nullify == 0 && bObjectId > 0) ? 1 : 0;
    if (clipping == 1) {
        // Find a point q on the viewing ray in world space
        vec4 qh = invVpMat*vec4(fNdc, 1.0);
        vec3 q = qh.xyz / qh.w;
        // t*cameraPos + (1-t)*q     on plane: 
        // t*dot(cameraPos, plane.xyz) + (1-t)*dot(q, plane.xyz) + plane.w = 0
        // t*dot(cameraPos-q, plane.xyz) = -plane.w - dot(q, plane.xyz)
        float t = -(plane.w+dot(q, plane.xyz)) / dot(cameraPos-q, plane.xyz);
        vec3 p = t*cameraPos + (1.0-t)*q;       // intersection of viewing ray and clipping plane

        vec4 pClip = vpMat * vec4(p, 1.0);
        depth = (pClip.z/pClip.w) * 0.5 + 0.5;

        color = solid_compound(p, bObjectId);
    }

    gl_FragColor = vec4(color, float(clipping));        // store clipping in alpha-channel
    gl_FragDepth = (fObjectId > 0 || bObjectId > 0) ? depth : 1.0; // assigning depth here so we recover a correctly z-buffered scene
}