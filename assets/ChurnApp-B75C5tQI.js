import{a as e,n as t,t as n}from"./jsx-runtime-BaSZ_JNh.js";import{n as r,o as i,s as a}from"./chunk-OB3PAWPO-BISt63PO.js";import{n as o,t as s}from"./index-BzKYcBqo.js";import{F as c,Ft as l,Gr as u,It as d,Kr as f,Or as p,Qt as m,Zt as h,dr as g,gt as _,h as v,p as y,ur as b,vt as x}from"./three.core-D2c_NNN8.js";import{r as S}from"./three.module-vR93GfxR.js";import{t as C}from"./lil-gui.module.min-F6ktE2kk.js";import{t as w}from"./OrbitControls-BXCy7p_l.js";var T=e(t(),1),E=`varying vec2 v_uv;\r
\r
void main() {\r
    v_uv = position.xy; \r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}`,D=`precision highp float;\r
\r
uniform float u_time;\r
uniform float u_shift;\r
uniform vec3 u_n1;\r
uniform vec3 u_n2;\r
uniform vec3 u_n3;\r
\r
varying vec2 v_uv;\r
\r
const float PI = 3.1415926535898;\r
\r
\r
////////////////////////////////\r
/**\r
 * Source for hash-functions below:\r
 * uint-shader-hash, David Hoskins (MMqd), \r
 * https://github.com/MMqd/uint-shader-hash\r
 *\r
 * Source for simplex noise: \r
 * Noise for GLSL 1.20, Copyright (C) 2011 Ashima Arts. \r
 * (MIT license https://github.com/stegu/webgl-noise/blob/master/LICENSE)\r
 * https://github.com/stegu/webgl-noise \r
 */\r
\r
\r
vec2 octEncode(vec3 n) {\r
    // Encodes unit vec3 vector to vec2\r
    n /= (abs(n.x) + abs(n.y) + abs(n.z));\r
    vec2 p = n.xy;\r
    if (n.z < 0.0) {\r
        vec2 signP = step(0.0, p) * 2.0 - 1.0;\r
        p = (1.0 - abs(p.yx)) * signP;\r
    }\r
    return p * 0.5 + 0.5;\r
}\r
\r
vec3 octDecode(vec2 e) {\r
    // Decoder for octEncode, recovers the original unit vector\r
    vec2 p = e * 2.0 - 1.0;\r
    vec3 n = vec3(p, 1.0 - abs(p.x) - abs(p.y));\r
    if (n.z < 0.0) {\r
        vec2 signP = step(0.0, n.xy) * 2.0 - 1.0;\r
        n.xy = (1.0 - abs(n.yx)) * signP;\r
    }\r
    return normalize(n);\r
}\r
\r
// From uint-shader-hash:\r
\r
\r
const uint MAGIC_NUMBERS[7] = uint[7](\r
    0x21f0aaadu, 0x7feb352du, 0x846ca68bu,\r
    0xd168aaadu, 0xaf723597u, 0x9e485565u, 0xef1d6b47u\r
);\r
\r
highp uint fixZero(highp float f) {\r
    return floatBitsToUint(f + uintBitsToFloat(0x00800000u));\r
}\r
\r
highp uint hashUint(highp uint h, highp uint magic) {\r
    h++; h ^= h >> 16u; h *= magic; return h;\r
}\r
\r
highp float uintTo01Float(highp uint h) {\r
    return uintBitsToFloat((h >> 9u) | floatBitsToUint(1.0)) - 1.0;\r
}\r
\r
vec2 uvec2To01Vec2(uvec2 h) {\r
    return vec2(uintTo01Float(h.x), uintTo01Float(h.y));\r
}\r
\r
vec3 uvec3To01Vec3(uvec3 h) {\r
    return vec3(uintTo01Float(h.x), uintTo01Float(h.y), uintTo01Float(h.z));\r
}\r
\r
vec4 uvec4To01Vec4(uvec4 h) {\r
    return vec4(uintTo01Float(h.x), uintTo01Float(h.y), uintTo01Float(h.z), uintTo01Float(h.w));\r
}\r
\r
uvec2 uintHashVec2ToVec2(highp vec2 f) {\r
    uint fx = fixZero(f.x), fy = fixZero(f.y);\r
    highp uint h = 2u;\r
    h = hashUint(h + fx, MAGIC_NUMBERS[0]);\r
    h = hashUint(h + fy, MAGIC_NUMBERS[1]);\r
    return uvec2(\r
        hashUint(h, MAGIC_NUMBERS[0]),\r
        hashUint(h, MAGIC_NUMBERS[1])\r
    );\r
}\r
\r
uvec3 uintHashVec3ToVec3(highp vec3 f) {\r
    uint fx = fixZero(f.x), fy = fixZero(f.y), fz = fixZero(f.z);\r
    highp uint h = 3u;\r
    h = hashUint(h + fx, MAGIC_NUMBERS[0]);\r
    h = hashUint(h + fy, MAGIC_NUMBERS[1]);\r
    h = hashUint(h + fz, MAGIC_NUMBERS[2]);\r
    return uvec3(\r
        hashUint(h, MAGIC_NUMBERS[0]),\r
        hashUint(h, MAGIC_NUMBERS[1]),\r
        hashUint(h, MAGIC_NUMBERS[2])\r
    );\r
}\r
\r
uvec4 uintHashVec4ToVec4(highp vec4 f) {\r
    uint fx = fixZero(f.x), fy = fixZero(f.y), fz = fixZero(f.z), fw = fixZero(f.w);\r
    highp uint h = 4u;\r
    h = hashUint(h + fx, MAGIC_NUMBERS[0]);\r
    h = hashUint(h + fy, MAGIC_NUMBERS[1]);\r
    h = hashUint(h + fz, MAGIC_NUMBERS[2]);\r
    h = hashUint(h + fw, MAGIC_NUMBERS[3]);\r
    return uvec4(\r
        hashUint(h, MAGIC_NUMBERS[0]),\r
        hashUint(h, MAGIC_NUMBERS[1]),\r
        hashUint(h, MAGIC_NUMBERS[2]),\r
        hashUint(h, MAGIC_NUMBERS[3])\r
    );\r
}\r
\r
float hash(highp float f) {\r
    highp uint fx = fixZero(f);\r
    highp uint h = 1u; \r
    h = hashUint(h + fx, MAGIC_NUMBERS[0]);\r
    return uintTo01Float(h);\r
}\r
\r
vec2 hash22(highp vec2 f) {\r
    return uvec2To01Vec2(uintHashVec2ToVec2(f));\r
}\r
\r
vec3 hash33(highp vec3 f) {\r
    return uvec3To01Vec3(uintHashVec3ToVec3(f));\r
}\r
\r
vec4 hash44(highp vec4 f) {\r
    return uvec4To01Vec4(uintHashVec4ToVec4(f));\r
}\r
\r
\r
// From webgl-noise:\r
\r
\r
vec3 mod289(vec3 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec2 mod289(vec2 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec4 mod289(vec4 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec3 permute(vec3 x) {\r
    return mod289(((x*34.0)+10.0)*x);\r
}\r
\r
vec4 permute(vec4 x) {\r
    return mod289(((x*34.0)+10.0)*x);\r
}\r
\r
vec4 taylorInvSqrt(vec4 r) {\r
    return 1.79284291400159 - 0.85373472095314 * r;\r
}\r
\r
float snoise(vec2 v) {\r
    const vec4 C = vec4(0.211324865405187,      // (3.0-sqrt(3.0))/6.0\r
                        0.366025403784439,      // 0.5*(sqrt(3.0)-1.0)\r
                        -0.577350269189626,     // -1.0 + 2.0 * C.x\r
                        0.024390243902439);     // 1.0 / 41.0\r
    // First corner\r
    vec2 i  = floor(v + dot(v, C.yy) );\r
    vec2 x0 = v -   i + dot(i, C.xx);\r
\r
    // Other corners\r
    vec2 i1;\r
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\r
    //i1.y = 1.0 - i1.x;\r
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\r
    // x0 = x0 - 0.0 + 0.0 * C.xx ;\r
    // x1 = x0 - i1 + 1.0 * C.xx ;\r
    // x2 = x0 - 1.0 + 2.0 * C.xx ;\r
    vec4 x12 = x0.xyxy + C.xxzz;\r
    x12.xy -= i1;\r
\r
    // Permutations\r
    i = mod289(i); // Avoid truncation effects in permutation\r
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\r
            + i.x + vec3(0.0, i1.x, 1.0 ));\r
\r
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\r
    m = m*m ;\r
    m = m*m ;\r
\r
    // Gradients: 41 points uniformly over a line, mapped onto a diamond.\r
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\r
\r
    vec3 x = 2.0 * fract(p * C.www) - 1.0;\r
    vec3 h = abs(x) - 0.5;\r
    vec3 ox = floor(x + 0.5);\r
    vec3 a0 = x - ox;\r
\r
    // Normalise gradients implicitly by scaling m\r
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );\r
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\r
\r
    // Compute final noise value at P\r
    vec3 g;\r
    g.x  = a0.x  * x0.x  + h.x  * x0.y;\r
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;\r
    return 130.0 * dot(m, g);\r
}\r
\r
float snoise(vec3 v) { \r
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\r
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\r
\r
    // First corner\r
    vec3 i  = floor(v + dot(v, C.yyy) );\r
    vec3 x0 =   v - i + dot(i, C.xxx) ;\r
\r
    // Other corners\r
    vec3 g = step(x0.yzx, x0.xyz);\r
    vec3 l = 1.0 - g;\r
    vec3 i1 = min( g.xyz, l.zxy );\r
    vec3 i2 = max( g.xyz, l.zxy );\r
\r
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;\r
    //   x1 = x0 - i1  + 1.0 * C.xxx;\r
    //   x2 = x0 - i2  + 2.0 * C.xxx;\r
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;\r
    vec3 x1 = x0 - i1 + C.xxx;\r
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\r
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\r
\r
    // Permutations\r
    i = mod289(i); \r
    vec4 p = permute( permute( permute( \r
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\r
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \r
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\r
\r
    // Gradients: 7x7 points over a square, mapped onto an octahedron.\r
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\r
    float n_ = 0.142857142857; // 1.0/7.0\r
    vec3  ns = n_ * D.wyz - D.xzx;\r
\r
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\r
\r
    vec4 x_ = floor(j * ns.z);\r
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\r
\r
    vec4 x = x_ *ns.x + ns.yyyy;\r
    vec4 y = y_ *ns.x + ns.yyyy;\r
    vec4 h = 1.0 - abs(x) - abs(y);\r
\r
    vec4 b0 = vec4( x.xy, y.xy );\r
    vec4 b1 = vec4( x.zw, y.zw );\r
\r
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\r
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\r
    vec4 s0 = floor(b0)*2.0 + 1.0;\r
    vec4 s1 = floor(b1)*2.0 + 1.0;\r
    vec4 sh = -step(h, vec4(0.0));\r
\r
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\r
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\r
\r
    vec3 p0 = vec3(a0.xy,h.x);\r
    vec3 p1 = vec3(a0.zw,h.y);\r
    vec3 p2 = vec3(a1.xy,h.z);\r
    vec3 p3 = vec3(a1.zw,h.w);\r
\r
    //Normalise gradients\r
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\r
    p0 *= norm.x;\r
    p1 *= norm.y;\r
    p2 *= norm.z;\r
    p3 *= norm.w;\r
\r
    // Mix final noise value\r
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\r
    m = m * m;\r
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \r
                                    dot(p2,x2), dot(p3,x3) ) );\r
}\r
\r
// End of code from webgl-noise.\r
\r
// Value noise\r
vec3 vnoise33(vec3 p) {\r
    vec3 i = floor(p);\r
    vec3 f = fract(p);\r
\r
    vec3 c000 = hash33(i);\r
    vec3 c001 = hash33(i + vec3(0,0,1));\r
    vec3 c010 = hash33(i + vec3(0,1,0));\r
    vec3 c011 = hash33(i + vec3(0,1,1));\r
    vec3 c100 = hash33(i + vec3(1,0,0));\r
    vec3 c101 = hash33(i + vec3(1,0,1));\r
    vec3 c110 = hash33(i + vec3(1,1,0));\r
    vec3 c111 = hash33(i + vec3(1,1,1));\r
\r
    // vec3 u = f * f * (3.0 - 2.0 * f);\r
    vec3 u = f*f*f*(f*(f*6.0 - 15.0) + 10.0);\r
\r
    vec3 cx00 = mix(c000, c100, u.x);\r
    vec3 cx01 = mix(c001, c101, u.x);\r
    vec3 cx10 = mix(c010, c110, u.x);\r
    vec3 cx11 = mix(c011, c111, u.x);\r
\r
    vec3 cxy0 = mix(cx00, cx10, u.y);\r
    vec3 cxy1 = mix(cx01, cx11, u.y);\r
\r
    return mix(cxy0, cxy1, u.z);\r
}\r
\r
// Fractional Brownian Noise based on value noise\r
vec3 fbm33(vec3 p, float H) {\r
    const int OCTAVES = 6;\r
    float G = exp2(-H);\r
    float f = 1.0;\r
    float a = 1.0;\r
    vec3 sum = vec3(0.0);\r
    vec3 q = p;\r
\r
    for (int k = 0; k < OCTAVES; k++) {\r
        sum += a * vnoise33(q * f);\r
        q = 2.0*q + vec3(37.1, 61.7, 12.4);\r
        f *= 2.0;\r
        a *= G;\r
    }\r
    return sum;\r
}\r
////////////////////////////////\r
\r
\r
void main() {\r
    vec2 z = v_uv;\r
    float r2 = dot(z, z);\r
    \r
    if (r2 >= 1.0) \r
        discard;\r
\r
    // 1. Apply Hyperbolic Translation (Inverse Camera Transform)\r
    float v = u_shift;\r
    float c = 1.0 + z.x * v;\r
    float d = z.y * v;\r
    float denom = c * c + d * d;\r
\r
    vec2 zw;\r
    zw.x = ((z.x + v) * c + z.y * d) / denom;\r
    zw.y = (z.y * c - (z.x + v) * d) / denom;\r
\r
    float zw_r2 = dot(zw, zw);\r
\r
    // 2. Convert from Poincaré disk to Minkowski Hyperboloid R^{2,1}\r
    float den = 1.0 - zw_r2;\r
    vec3 p = vec3(2.0 * zw.x / den, 2.0 * zw.y / den, (1.0 + zw_r2) / den);\r
    // p += 0.5*(fbm33(p, 2.0) - vec3(1.0));\r
    // r^2 = z^2 - 1, z>0\r
    // p.z = sqrt(p.x*p.x + p.y*p.y + 1.0);\r
\r
    // 4. Space Folding (Kaleidoscope Algorithm)\r
    ivec3 parity = ivec3(0, 0, 0);\r
\r
    for (int i = 0; i < 100; i++) {\r
        bool folded = false;\r
        \r
        float d1 = p.x * u_n1.x + p.y * u_n1.y - p.z * u_n1.z;\r
        if (d1 < 0.0) { \r
            p -= 2.0 * d1 * u_n1; \r
            parity.x++; \r
            folded = true; \r
        }\r
\r
        float d2 = p.x * u_n2.x + p.y * u_n2.y - p.z * u_n2.z;\r
        if (d2 < 0.0) { \r
            p -= 2.0 * d2 * u_n2; \r
            parity.y++; \r
            folded = true; \r
        }\r
\r
        float d3 = p.x * u_n3.x + p.y * u_n3.y - p.z * u_n3.z;\r
        if (d3 < 0.0) { \r
            p -= 2.0 * d3 * u_n3; \r
            parity.z++; \r
            folded = true; \r
        }\r
\r
        if (!folded) break;\r
    }\r
\r
    int paritySum = parity.x + parity.y + parity.z;\r
    vec3 col = (paritySum % 2 == 0) ? vec3(0.5, 0.5, 0.7) : vec3(0.2, 0.2, 0.4);\r
    // vec3 col = vec3(0.4, 0.4, 0.4);\r
    // if (parity.x % 2 == 1)\r
    //     col += vec3(0.1, 0.0, 0.0);\r
    // if (parity.y % 2 == 1)\r
    //     col += vec3(0.0, 0.1, 0.0);\r
    // if (parity.z % 2 == 1)\r
    //     col += vec3(0.0, 0.0, 0.6);\r
\r
    float d1 = p.x * u_n1.x + p.y * u_n1.y - p.z * u_n1.z;\r
    float d2 = p.x * u_n2.x + p.y * u_n2.y - p.z * u_n2.z;\r
    float d3 = p.x * u_n3.x + p.y * u_n3.y - p.z * u_n3.z;\r
    // col *= 0.25+0.75*(1.0-smoothstep(0.1, 0.925, d1));\r
    // col *= 0.25+0.75*(1.0-smoothstep(0.1, 0.925, d2));\r
    // col *= 0.25+0.75*(1.0-smoothstep(0.1, 0.925, d3));\r
    float LINE_WIDTH = 0.5;\r
    // col += vec3(0.2*(1.0-smoothstep(0.0, LINE_WIDTH, d1)), 0.0, 0.0);\r
    // col += vec3(0.0, 0.2*(1.0-smoothstep(0.0, LINE_WIDTH, d2)), 0.0);\r
    // col += vec3(0.0, 0.0, 0.5*(1.0-smoothstep(0.0, LINE_WIDTH, d3)));\r
    vec3 dv = vec3(d1, d2, d3);\r
    // dv += 3.0*(fbm33(0.5*vec3(5.0*d1+0.0001*u_time, 0.0*0.25*d2+0.0*0.0002*u_time, 0.0*0.1*d3+0.0*0.0003*u_time), 1.0) - vec3(1.0));\r
    vec3 adv = abs(dv);\r
    // if (adv.x < LINE_WIDTH && adv.x < adv.y && adv.x < adv.z)\r
    //     col = vec3(0.3, 0.0, 0.0);\r
    // if (adv.y < LINE_WIDTH && adv.y < adv.x && adv.y < adv.z)\r
    //     col = vec3(0.0, 0.3, 0.0);\r
    // if (adv.z < LINE_WIDTH && adv.z < adv.x && adv.z < adv.y)\r
    //     col = vec3(0.0, 0.0, 0.5);\r
    float t = 0.161 + 0.0*0.00001*u_time;\r
    col = 2.0*fbm33(2.0*vec3(d1+t, 0.5*d2+t, 0.2*d3+t), 1.0);\r
    // col += vec3(0.0, 0.0, 5.0*(1.0-smoothstep(0.0, 0.1, abs(d3))));\r
\r
    col = 0.5*col+0.5*vec3(0.1, 0.1, 0.2);\r
    col = 0.2*col;\r
\r
    gl_FragColor = vec4(col, 1.0);\r
}`,O=200,k=1e-9,A=.001,j=.005,M=.02,N=class{constructor(e){this.cleanUpTasks=[],this.timer=new p,this.containerSize=new u(0,0),this.regionMeshes=[],this.currentTime=0,this.regionCenters=[],this.settings={S:2,timeScale:0,pq:[6,5]},this.container=e,this.isInitialized=!1,h.DEFAULT_UP.set(0,0,1)}async init(e){this.renderer=new S({antialias:!0,alpha:!0}),this.renderer.setClearColor(1118481,1),this.container.appendChild(this.renderer.domElement),this.setupCamera(),this.setupScene(),this.createGUI(),this.isInitialized=!0,e.aborted?this.dispose():(this.animate=this.animate.bind(this),this.renderer.setAnimationLoop(this.animate))}dispose(){if(this.isInitialized){this.renderer.setAnimationLoop(null),this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.controls.dispose(),this.timer.dispose(),this.gui.destroy(),this.renderer.dispose()}}handleResize(){let e=this.container.clientWidth,t=this.container.clientHeight;if(e<=0||t<=0||this.containerSize.x===e&&this.containerSize.y===t)return;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.containerSize.set(e,t),this.renderer.setSize(e,t);let n=e/t,r=1.2/n;this.camera.left=-r*n,this.camera.right=r*n,this.camera.top=r,this.camera.bottom=-r,this.camera.updateProjectionMatrix()}createGUI(){this.gui=new C,this.gui.add(this.settings,`S`,1.1,4.1,.1).name(`Constant S`).onChange(()=>{this.resetSimulation()}),this.gui.add(this.settings,`pq`,[[3,7],[7,3],[3,8],[8,3],[4,5],[5,4],[4,6],[6,4],[4,7],[7,4],[5,5],[5,6],[6,5]]).name(`{p, q}`).onChange(()=>{this.resetSimulation()}),this.gui.add(this.settings,`timeScale`,-6,5,1).name(`Log time scale`).onChange(e=>{this.timer.setTimescale(e===-6?0:Math.exp(e))}),this.gui.add({reset:()=>this.resetSimulation()},`reset`).name(`Reset Time`)}setupCamera(){this.camera=new m(-1,1,1,-1,.1,100),this.camera.position.set(0,0,10),this.camera.lookAt(new f(0,0,0)),this.controls=new w(this.camera,this.renderer.domElement),this.controls.enableRotate=!1,this.controls.zoomSpeed=2}setupScene(){this.scene=new b;let e=new y(1,32),t=new d({color:16777215,depthTest:!1});this.objectMesh=new l(e,t),this.objectMesh.position.set(0,0,0),this.objectMesh.renderOrder=2,this.scene.add(this.objectMesh),this.cleanUpTasks.push(()=>e.dispose()),this.cleanUpTasks.push(()=>t.dispose());let n=new y(1,128),r=new g({vertexShader:E,fragmentShader:D,uniforms:{u_time:{value:0},u_shift:{value:0},u_n1:{value:new f},u_n2:{value:new f},u_n3:{value:new f}},transparent:!1,depthTest:!1,depthWrite:!1});this.poincareBoundaryMesh=new l(n,r),this.poincareBoundaryMesh.renderOrder=0,this.scene.add(this.poincareBoundaryMesh);let i=new c(n),a=new _({color:5592405}),o=new x(i,a);this.poincareBoundaryMesh.add(o),this.cleanUpTasks.push(()=>n.dispose()),this.cleanUpTasks.push(()=>i.dispose()),this.cleanUpTasks.push(()=>r.dispose()),this.cleanUpTasks.push(()=>a.dispose());let s=new y(1,128),u=new c(s);for(let e=0;e<=O;e++){let t=new v().setHSL(e/7.7,1,.6),n=new _({color:t}),r=new x(u,n);r.renderOrder=1,this.scene.add(r),this.regionMeshes.push(r),this.regionCenters.push(0),this.cleanUpTasks.push(()=>n.dispose())}this.cleanUpTasks.push(()=>s.dispose()),this.cleanUpTasks.push(()=>u.dispose()),this.resetSimulation()}resetSimulation(){this.currentTime=0;for(let e=0;e<=O;e++)this.regionCenters[e]=0;this.camera.position.set(0,0,10),this.controls.target.set(0,0,0),this.controls.update()}updateSimulation(e){let t=this.currentTime+M*e/A;for(;this.regionCenters[0]+1<=t+k;){this.regionCenters[0]+=1;let e=this.regionCenters[0],t=1;for(let n=1;n<=O;n++){let r=this.regionCenters[n],i=this.settings.S**+n;if(Math.abs(r-e)+t<=i+k)break;this.regionCenters[n]=e,e=this.regionCenters[n],t=i}}this.currentTime=t}animate(){this.timer.update(),this.controls.update(),this.handleResize();let e=this.timer.getDelta();this.updateSimulation(e),this.render()}render(){let[e,t]=this.settings.pq,n=new f(0,1,0),r=new f(Math.sin(Math.PI/e),-Math.cos(Math.PI/e),0),i=-Math.cos(Math.PI/t)/Math.sin(Math.PI/e),a=-Math.sqrt(i*i-1),o=new f(i,0,a),s=Math.acosh(Math.cos(Math.PI/e)/Math.sin(Math.PI/t)),c=Math.acosh(Math.cos(Math.PI/t)/Math.sin(Math.PI/e)),l=Math.acosh(1/(Math.tan(Math.PI/e)*Math.tan(Math.PI/t))),u=e%2==0?2*c:t%2==0?2*(c+l):2*(s+c+l),d=this.currentTime*A,p=d-Math.floor(d/u)*u-u/2,m=Math.tanh(p/2);this.poincareBoundaryMesh.material instanceof g&&(this.poincareBoundaryMesh.material.uniforms.u_time.value=performance.now(),this.poincareBoundaryMesh.material.uniforms.u_shift.value=m,this.poincareBoundaryMesh.material.uniforms.u_n1.value.copy(n),this.poincareBoundaryMesh.material.uniforms.u_n2.value.copy(r),this.poincareBoundaryMesh.material.uniforms.u_n3.value.copy(o));for(let e=0;e<=O;e++){let t=A*(this.regionCenters[e]-this.currentTime),n=A*this.settings.S**+e,r=t-n,i=t+n,a=Math.tanh(r/2),o=Math.tanh(i/2),s=(o+a)/2,c=(o-a)/2;this.regionMeshes[e].position.set(s,0,0),this.regionMeshes[e].scale.set(c,c,1)}this.objectMesh.scale.set(j/this.camera.zoom,j/this.camera.zoom),this.renderer.render(this.scene,this.camera)}},P=n(),F=()=>{let e=(0,T.useRef)(null);return(0,T.useEffect)(()=>{if(!e.current)return;let t=new AbortController,n=new N(e.current);return n.init(t.signal),()=>{t.abort(),n.dispose()}},[]),(0,P.jsx)(o,{sx:{position:`relative`,width:`100%`,height:`600px`},children:(0,P.jsx)(`div`,{ref:e,style:{width:`100%`,height:`100%`}})})},I=()=>(0,P.jsxs)(s,{maxWidth:`xl`,children:[(0,P.jsx)(i,{component:r,to:`/`,variant:`body1`,color:`primary`,children:`Back`}),(0,P.jsx)(o,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,P.jsx)(a,{variant:`h2`,children:`Collision detection churn for n=1`})}),(0,P.jsx)(o,{sx:{position:`relative`,width:`100%`,height:`600px`},children:(0,P.jsx)(F,{})}),(0,P.jsx)(i,{component:r,to:`/collision_detection_notes`,variant:`body1`,color:`primary`,children:`Notes`})]});export{I as default};