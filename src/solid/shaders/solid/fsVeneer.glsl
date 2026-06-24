#include <sCommon>

const int MAX_BRANCHES = 1024;

uniform float phase;
uniform vec3 size;      // (w,h,d)
uniform float gap;

uniform float time;

uniform sampler3D noiseTexture;
uniform sampler2D branchIndexTex;
uniform sampler2D profileTexture;

uniform vec3 knotColor;     // (0.2, 0.2, 0.15)

uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;
uniform float debug5;
uniform float debug6;
uniform float debug7;
uniform float debug8;

uniform globalUBO {
    uniform float zRange;
    uniform int numBranches;
    vec4 branchesZASD[MAX_BRANCHES];
    vec4 branchesR[MAX_BRANCHES];
};

in vec4 vPos;

layout(location = 0) out vec4 outColor;

#include <sWood>


void main() {
    vec3 p = vPos.xyz;

    // float wWedge = PI * (size.z + 2.0*gap) / 2.0;
    // vec3 v = 2.0*boxCoords-vec3(1.0);
    // float c = 0.98;
    // int vc = (abs(v.x) > c ? 1 : 0) + (abs(v.y) > c ? 1 : 0) + (abs(v.z) > c ? 1 : 0);
    // if (abs(v.z) > 0.98 && abs(v.y) > 0.998) {
    //     outColor = vec4(1.0, boxCoords.x*size.x < wWedge ? 1.0 : 0.0, 0.0, 1.0);
    //     return;
    // }

    outColor = wood(p);
}