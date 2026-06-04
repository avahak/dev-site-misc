uniform globalUBO {
    vec3 cameraPos;
    vec4 cameraParams;      // (near,far,_,_)
    mat4 vpMat;
    mat4 invVpMat;
    float time;
    float debug1;
    float debug2;
    float debug3;
    float debug4;

    float numLights;
    vec4 lightPos[MAX_LIGHTS];      // (pos(x,y,z), radius)
    vec4 lightCol[MAX_LIGHTS];      // (col(r,g,b), intensity)
    float shadowMapSize;
    vec4 shadowCameraParams[MAX_LIGHTS];      // (near,far,_,_)
    mat4 shadowMatrices[MAX_LIGHTS];
};