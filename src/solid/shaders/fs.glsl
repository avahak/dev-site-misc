// NOTE reference for shadows: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js
// Example for multiple render targets: https://github.com/mrdoob/three.js/blob/master/examples/webgl_multiple_rendertargets.html

layout(location = 0) out vec4 gOne;
layout(location = 1) out vec4 gTwo;

uniform vec2 resolution;
uniform vec3 cameraPos;
uniform float time;
uniform int side;       // 0 for front, 1 for back
uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;

in vec4 vPos;
in vec2 vUv;
in mat4 pvmMat;

// Volume that is removed is defined by positive values 
float cutVolume(vec3 p, vec4 plane) {
    return dot(p, plane.xyz) + plane.w;
}

// Returns t such that (1-t)*cameraPos+t*v is on the plane
float cutDistance(vec3 v, vec4 plane) {
    // plane.xyz . ((1-t)*cameraPos + t*v) + plane.w = 0
    float a = dot(plane.xyz, cameraPos);
    float b = dot(plane.xyz, v);
    // (1-t)*a + t*b + plane.w = 0
    // t = -(a + plane.w) / (b - a)
    return -(a + plane.w) / (b - a);
}

void main() {
    vec4 plane = vec4(cos(time), 0.0, sin(time), 0.0);
    vec3 v = vPos.xyz;

    if (side == 0) {    // front
        if (cutVolume(v, plane) < 0.0)
            discard;

        vec3 w = 0.3*fbm33(v, 0.5);

        vec4 clipPos = pvmMat * vec4(v, 1.0);

        gl_FragDepth = 0.5 + 0.5*clipPos.z/clipPos.w;
        gOne = vec4(w, 1.0);
        gTwo = vec4(0.5, 0.5, 0.5, 1.0);
        return;
    }
    if (side == 1) {    // back
        if (cutVolume(v, plane) < 0.0)
            discard;

        float t = cutDistance(v, plane);
        vec3 v0 = (1.0-t)*cameraPos + t*v;

        vec3 w = 0.3*fbm33(v0, 0.5);

        vec4 clipPos = pvmMat * vec4(v0, 1.0);

        gl_FragDepth = 0.5 + 0.5*clipPos.z/clipPos.w;
        gOne = vec4(w, 1.0);
        gTwo = vec4(0.5, 0.5, 0.5, 1.0);
    }
}