#include <sCommon>
#include <sWood>

in vec4 vPos;

layout(location = 0) out vec4 outColor;

vec3 test(vec3 p) {
    vec3 q = 2.0 * p;
    return 0.5*fbm33(q, 1.5);
    // return 0.5 + 0.5*vec3(snoise(q), snoise(q+vec3(1000.0)), snoise(q+vec3(-1000.0)));
}

void main() {
    
    outColor = vec4(wood(vPos.xyz).rgb, 1.0);

    // outColor = vec4(test(vPos.xyz), 1.0);
}