#include <sCommon>

const int MAX_BRANCHES = 1024;

uniform vec3 cameraPos;
uniform vec2 cameraNearFar;
uniform mat4 vMat;
uniform mat4 pvMat;
uniform mat4 pvMatInv;

uniform vec2 resolution;
uniform float time;

uniform sampler3D noiseTexture;
uniform sampler2D branchIndexTex;
uniform sampler2D profileTexture;

uniform vec3 knotColor;     // (0.2, 0.2, 0.15)

uniform vec4 clipPlane; // (dirX,dirY,dirY,offset), dir is unit length, points in half-space are vec3 p with dot(p,clipPlane.xyz)>=clipPlane.w

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


float worldToDepth(vec3 worldPos) {
    vec4 clipPos = pvMat * vec4(worldPos, 1.0);
    return (clipPos.z / clipPos.w) * 0.5 + 0.5;
}

vec3 depthToWorldPosition(float depth) {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 ndc = vec4(uv*2.0 - 1.0, depth*2.0 - 1.0, 1.0);
    vec4 worldPos = pvMatInv * ndc;
    return worldPos.xyz / worldPos.w;
}

vec2 cubeClip(float r) {
    vec3 rd0 = depthToWorldPosition(1.0) - cameraPos;   // Using far-plane is better for accuracy
    float tFar = length(rd0);
    float tNear = cameraNearFar.x / cameraNearFar.y * tFar;
    vec3 rd = rd0 / tFar;

    // Avoid division by zero
    vec3 safeRd = vec3(
        rd.x == 0.0 ? 1e-6 : rd.x,
        rd.y == 0.0 ? 1e-6 : rd.y,
        rd.z == 0.0 ? 1e-6 : rd.z
    );
    vec3 invDir = 1.0 / safeRd;
    
    vec3 t0 = (vec3(-r) - cameraPos) * invDir;
    vec3 t1 = (vec3(r) - cameraPos) * invDir;
    
    vec3 tMin3 = min(t0, t1);
    vec3 tMax3 = max(t0, t1);
    
    float tMin = max(max(tMin3.x, tMin3.y), tMin3.z);
    float tMax = min(min(tMax3.x, tMax3.y), tMax3.z);
    
    if (tMax <= tNear || tMin >= tMax)
        return vec2(0.0);       // Ray miss
    
    float tStart = max(tNear, tMin);
    float tEnd = tMax;
    
    return vec2(worldToDepth(cameraPos + rd*tStart), worldToDepth(cameraPos + rd*tEnd));
}

vec2 ballClip(float r) {
    vec3 rd0 = depthToWorldPosition(1.0) - cameraPos;   // Using far-plane is better for accuracy
    float tFar = length(rd0);
    float tNear = cameraNearFar.x / cameraNearFar.y * tFar;
    vec3 rd = rd0 / tFar;

    float b = dot(cameraPos, rd);
    float c = dot(cameraPos, cameraPos) - r*r;
    float h = b*b - c;
    
    if (h <= 0.0)
        return vec2(0.0);       // Ray miss
    
    float sqrtH = sqrt(h);
    float tMin = -b - sqrtH;
    float tMax = -b + sqrtH;
    
    // The sphere is entirely behind the camera near plane
    if (tMax <= tNear)
        return vec2(0.0);
    
    // Clamp tMin to tNear if the camera near plane is inside the sphere
    float tStart = max(tNear, tMin);
    float tEnd = tMax;
    
    return vec2(worldToDepth(cameraPos + rd*tStart), worldToDepth(cameraPos + rd*tEnd));
}

vec2 cylinderClip(float r) {
    vec3 rd0 = depthToWorldPosition(1.0) - cameraPos;   // Using far-plane is better for accuracy
    float tFar = length(rd0);
    float tNear = cameraNearFar.x / cameraNearFar.y * tFar;
    vec3 rd = rd0 / tFar;

    vec3 cylinderDir = normalize(vec3(0.0, 1.0, 0.0));
    float cylinderLength = 2.0*r;
    float cylinderRadius = r;

    float halfL = cylinderLength * 0.5;
    
    // Project ray and camera position onto the cylinder axis orientation
    float dv = dot(rd, cylinderDir);
    float ov = dot(cameraPos, cylinderDir);
    
    // Infinite tube intersection coefficients (at^2 + 2bt + c = 0)
    float a = 1.0 - dv * dv;
    float b = dot(cameraPos, rd) - ov * dv;
    float c = dot(cameraPos, cameraPos) - ov * ov - cylinderRadius * cylinderRadius;
    
    float tTubeMin = -1e30;
    float tTubeMax = 1e30;
    
    // Handle infinite tube intersection if the ray is not parallel to the axis
    if (a > 1e-6) {
        float h = b * b - a * c;
        if (h <= 0.0)
            return vec2(0.0);   // Ray miss (misses the infinite tube)
        
        float sqrtH = sqrt(h);
        tTubeMin = (-b - sqrtH) / a;
        tTubeMax = (-b + sqrtH) / a;
    } else {
        // Ray is parallel to the axis; check if it is within the tube radius
        float distSq = dot(cameraPos, cameraPos) - ov * ov;
        if (distSq > cylinderRadius * cylinderRadius)
            return vec2(0.0);   // Ray miss (parallel and outside tube)
    }
    
    // Finite caps (slab) intersection
    float tSlabMin = -1e30;
    float tSlabMax = 1e30;
    if (abs(dv) > 1e-6) {
        float t0 = (-halfL - ov) / dv;
        float t1 = (halfL - ov) / dv;
        tSlabMin = min(t0, t1);
        tSlabMax = max(t0, t1);
    } else if (abs(ov) > halfL) {
        return vec2(0.0);       // Ray miss (parallel and outside caps)
    }
    
    // Overlap the tube interval and the cap slab interval
    float tMin = max(tTubeMin, tSlabMin);
    float tMax = min(tTubeMax, tSlabMax);
    
    if (tMin > tMax)
        return vec2(0.0);       // Ray miss (intervals do not overlap)
    
    // The cylinder is entirely behind the camera near plane
    if (tMax <= tNear)
        return vec2(0.0);
    
    // Clamp tMin to tNear if the camera near plane is inside the cylinder
    float tStart = max(tNear, tMin);
    float tEnd = tMax;
    
    return vec2(worldToDepth(cameraPos + rd * tStart), worldToDepth(cameraPos + rd * tEnd));
}

vec2 clipPlaneIntersect(vec2 interval) {
    if (interval.x == interval.y)
        return vec2(0.0);

    // Convert start and end depths to world positions
    vec3 p1 = depthToWorldPosition(interval.x);
    vec3 p2 = depthToWorldPosition(interval.y);

    // Evaluate the half-space condition: dot(p, dir) - offset
    // Negative means inside the half-space, positive means outside
    float v1 = dot(p1, clipPlane.xyz) - clipPlane.w;
    float v2 = dot(p2, clipPlane.xyz) - clipPlane.w;

    // Case 1: Both points are inside the half-space (no clipping needed)
    if (v1 <= 0.0 && v2 <= 0.0)
        return interval;

    // Case 2: Both points are outside the half-space (entire segment is clipped)
    if (v1 >= 0.0 && v2 >= 0.0)
        return vec2(0.0);

    // Case 3: The ray segment crosses the boundary plane.
    vec3 pIntersect = mix(p1, p2, v1 / (v1 - v2));
    float depthIntersect = worldToDepth(pIntersect);

    if (v1 <= 0.0)
        return vec2(interval.x, depthIntersect);    // Segment starts inside, but exits outside.
    else
        return vec2(depthIntersect, interval.y);    // Segment starts outside, but enters inside.
}

vec3 testSolid(vec3 p) {
    vec3 q = 2.0 * p;
    return 0.5*fbm33(q, 1.5);
    // return 0.5 + 0.5*vec3(snoise(q), snoise(q+vec3(1000.0)), snoise(q+vec3(-1000.0)));
}

void main() {
    // vec2 interval = ballClip(1.0);
    // vec2 interval = cubeClip(1.0);
    vec2 interval = cylinderClip(1.0);

    interval = clipPlaneIntersect(interval);
    if (interval.x == interval.y)
        discard;
    vec3 pStart = depthToWorldPosition(interval.x);
    vec3 pEnd = depthToWorldPosition(interval.y);
    
    outColor = vec4(wood(pStart).rgb, 1.0);
    // outColor = vec4(testSolid(pStart), 1.0);

    // float x = texture(noiseTexture, 2.0*pStart).r;
    // outColor = vec4(x, x, x, 1.0);

    // float r = length(pStart.xz);
    // vec2 v = vec2(r < 1.0 ? 0.5*r : 0.5 + mod(r-0.5, 0.5), 0.5);
    // vec3 col = texture(profileTexture, v).rgb;
    // outColor = vec4(col, 1.0);
}