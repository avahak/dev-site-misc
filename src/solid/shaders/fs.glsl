// NOTE reference for shadows: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js
// Example for multiple render targets: https://github.com/mrdoob/three.js/blob/master/examples/webgl_multiple_rendertargets.html

// layout(location = 0) out vec4 gOne;
// layout(location = 0) out vec4 gTwo;

uniform vec2 resolution;
uniform vec3 cameraPos;
uniform float time;
uniform int phase; 
uniform int objectId;
uniform sampler2D texB;         // just for nullify phase
uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;

in vec4 vPos;
in vec2 vUv;
in mat4 pvmMat;


// Returns t such that (1-t)*cameraPos+t*v is on the plane
// float cutDistance(vec3 v, vec4 plane) {
//     // plane.xyz . ((1-t)*cameraPos + t*v) + plane.w = 0
//     float a = dot(plane.xyz, cameraPos);
//     float b = dot(plane.xyz, v);
//     // (1-t)*a + t*b + plane.w = 0
//     // t = -(a + plane.w) / (b - a)
//     return -(a + plane.w) / (b - a);
// }

void main() {
    vec4 plane = vec4(cos(time), 0.0, sin(time), 0.25);
    vec3 v = vPos.xyz;

    if (dot(v, plane.xyz) + plane.w < 0.0)
        discard;

    // vec4 clipPos = pvmMat * vPos;
    // float depth = 0.5 + 0.5*clipPos.z/clipPos.w;
    float depth = gl_FragCoord.z;

    if (phase == 1) {    // fronts for nullify
        vec2 st = gl_FragCoord.xy / resolution;
        float backDepth = texture(texB, st).r;
        if (depth <= backDepth)
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    // closest segment starts after clip boundary -> nullify
        return;
    }

    // backs (phase 0) and regular rendering (phase 2)
    float id = float(objectId) / 1024.0;
    gl_FragColor = vec4(depth, id, 0.0, 1.0);
}