// Surface from f=0 with quadratic equation f(v) = v\cdot Av + B\cdot v + C

// Sphere of radius r>0 that has outward pointing normal n\in\S^2 at p\in\R^3:
// (center) c=p-rn, A=I, B=-2c, C=|c|^2-r^2

// To find (1-t)p+tq on the sphere, we write d=q-p and the quadratic equation becomes
// at^2+bt+c0=0, where a=d\cdot d, b=2d\cdot (p-c), c0=|p-c|^2-r^2.
// Solutions exist if D=b^2-4ac>=0. Then the solutions are t=\pm (-b\pm\sqrt{D})/(2a).

// These have to be defined in the shader using this
// uniform vec3 cameraPos;
// uniform mat4 vpMat;

uniform mat4 sphere;        // contains (sphere center x,y,z,r) and camera related parameters

float evalVolumeField(vec3 p) {
    // Negative value means inside
    // |p-c|^2-r^2
    vec3 v = p - sphere[0].xyz;
    return dot(v, v) - sphere[0].w*sphere[0].w;
}

// vec2 _volumeInterval() {
//     // Returns (-,+ solution) depths (in window space z).
//     vec2 ndcXy = 2.0*gl_FragCoord.xy/resolution - 1.0;
//     vec4 ph = invVpMat * vec4(ndcXy, 0.0, 1.0);
//     vec3 wp = ph.xyz / ph.w;

//     vec3 dir = wp - cameraPos;
//     vec3 v = cameraPos - sphere.xyz;
//     float a = dot(dir, dir);
//     float b = 2.0*dot(dir, v);
//     float c = dot(v, v) - sphere.w*sphere.w;
//     float discr = b*b - 4.0*a*c;
//     if (discr <= 0.0)
//         return vec2(0.0);   // no solutions
//     // Picking negative sign corresponding to entering the sphere
//     float tMinus = (-b - sqrt(discr)) / (2.0*a);
//     float tPlus = (-b + sqrt(discr)) / (2.0*a);
//     vec4 iwpMinus = vec4(cameraPos + tMinus*dir, 1.0);
//     vec4 iwpPlus = vec4(cameraPos + tPlus*dir, 1.0);
//     vec4 clipMinus = vpMat * iwpMinus;
//     vec4 clipPlus = vpMat * iwpPlus;
//     vec3 ndcMinus = clipMinus.xyz / clipMinus.w;
//     vec3 ndcPlus = clipPlus.xyz / clipPlus.w;
//     float zMinus = ndcMinus.z * 0.5 + 0.5;
//     float zPlus = ndcPlus.z * 0.5 + 0.5;
//     return vec2(tMinus > 0.0 ? zMinus : 0.0, tPlus > 0.0 ? zPlus : 0.0);    // TODO FIX with camera.near
// }

vec2 volumeInterval() {
    // Returns (-,+ solution) depths (in window space z).
    vec2 ndcXy = 2.0*gl_FragCoord.xy/resolution - 1.0;
    vec3 dir = sphere[1].xyz * vec3(ndcXy, 1.0);
    vec3 v = sphere[3].xyz;

    float a = dot(dir, dir);
    float b = 2.0*dot(dir, v);
    float c = dot(v, v) - sphere[0].w*sphere[0].w;
    float discr = b*b - 4.0*a*c;
    if (discr <= 0.0)
        return vec2(0.0);   // no solutions
    float sd = sqrt(discr);
    vec2 ts = vec2(-b-sd, -b+sd) / (2.0*a);

    vec2 zs = sphere[2].x + sphere[2].y / ts;

    float tNear = sphere[3].w;
    return vec2(ts.x > tNear ? zs.x : 0.0, ts.y > tNear ? zs.y : 0.0);
}

// vec4 intervalEntry(vec3 p0, vec3 dir) {
//     // Solving when is p0+t*dir on the sphere.
//     // Returns (pos,w), where w=1 if solution exists, 0 otherwise, and pos is sol with smaller t.
//     vec3 v = p0 - sphere.xyz;
//     float a = dot(dir, dir);
//     float b = 2.0*dot(dir, v);
//     float c = dot(v, v) - sphere.w*sphere.w;
//     float discr = b*b - 4.0*a*c;
//     if (discr < 0.0)
//         return vec4(0.0);   // no solutions
//     // Picking negative sign corresponding to entering the sphere
//     float t = (-b - sqrt(discr)) / (2.0*a);
//     return vec4(p0 + t*dir, 1.0);
// }