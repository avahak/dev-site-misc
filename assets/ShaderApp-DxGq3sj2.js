import{a as e,n as t,t as n}from"./jsx-runtime-BaSZ_JNh.js";import{n as r,o as i,s as a}from"./chunk-OB3PAWPO-BISt63PO.js";import{n as o,t as s}from"./index-DTzw7fYA.js";import{$t as c,E as l,Ft as u,H as d,It as f,Jr as p,Kr as m,Qt as h,Rr as g,Zr as _,Zt as ee,bt as v,dr as y,fr as b,h as x,mn as S,qr as C,qt as w,tn as T}from"./three.core-BlnPZLIB.js";import{r as E}from"./three.module-DmTPPf6k.js";import{t as D}from"./lil-gui.module.min-F6ktE2kk.js";import{t as O}from"./inputListener-DlWw6-Pr.js";import{a as k,i as A,n as j,r as M,t as N}from"./poincare-8NjnIBbT.js";import{n as P}from"./tilingSerialization-35jAFUbX.js";var F=e(t(),1),I=class e{static minkowskiInnerProduct(e,t){return e.x*t.x+e.y*t.y-e.t*t.t}static distance(t,n){let r=-e.minkowskiInnerProduct(t,n);return Math.acosh(Math.max(1,r))}static poincareToHyperboloid(e){let t=k.absSq(e),n=Math.max(1e-10,1-t);return{x:2*e.re/n,y:2*e.im/n,t:(1+t)/n}}static hyperboloidToPoincare(e){let t=1+e.t;return{re:e.x/t,im:e.y/t}}};function L(e,t){if(!e)throw Error(`Assertion failed: ${t}`)}function R(){let e=M.build(8,8),{r1:t,r2:n,r3:r}=e.reflections,i=A.identity();L(A.areTransformsEqual(A.multiply(t,t),i),`r1^2 == I`),L(A.areTransformsEqual(A.multiply(n,n),i),`r2^2 == I`),L(A.areTransformsEqual(A.multiply(r,r),i),`r3^2 == I`);let a=i,o=A.multiply(t,n);for(let e=0;e<8;e++)a=A.multiply(a,o);L(A.areTransformsEqual(a,i),`(r1 * r2)^p == I`);let s=i,c=A.multiply(n,r);for(let e=0;e<8;e++)s=A.multiply(s,c);L(A.areTransformsEqual(s,i),`(r2 * r3)^q == I`);for(let t=0;t<8;t++){let n=e.edgeReflections[t],r=A.multiply(n,n);L(A.areTransformsEqual(r,i),`sigma_${t}^2 == I`);let a=A.apply(n,e.midpoints[t]);L(k.abs(k.sub(a,e.midpoints[t]))<1e-4,`sigma_${t} fixes edge midpoint m_${t}`);let o=(t-1+8)%8,s=A.apply(n,e.vertices[o]),c=A.apply(n,e.vertices[t]),l=k.abs(k.sub(s,e.vertices[o])),u=k.abs(k.sub(c,e.vertices[t]));L(l<1e-4,`sigma_${t} fixes bounding vertex v_${o}`),L(u<1e-4,`sigma_${t} fixes bounding vertex v_${t}`)}}function z(){console.log(`Running math library tests...`);let e=A.rotation(Math.PI/3),t=A.mapToOrigin({re:.3,im:-.2}),n=A.multiply(e,t),r=A.inverse(n),i=A.multiply(n,r);L(A.areTransformsEqual(i,A.identity()),`Mobius composition with inverse should equal Identity`);let a={re:.4,im:-.5},o=I.poincareToHyperboloid(a),s=I.minkowskiInnerProduct(o,o);L(Math.abs(s- -1)<1e-6,`Hyperboloid point must have Minkowski norm -1, got ${s}`);let c=I.hyperboloidToPoincare(o),l=k.abs(k.sub(a,c));L(l<1e-6,`Roundtrip Poincaré-Minkowski error too large: ${l}`);let u={re:.1,im:.2},d={re:-.4,im:.3},f=N.distance(u,d),p=I.poincareToHyperboloid(u),m=I.poincareToHyperboloid(d),h=I.distance(p,m);L(Math.abs(f-h)<1e-5,`Distances in Poincaré (${f}) and Minkowski (${h}) must match`),R(),console.log(`All math library tests passed successfully!`)}function B(e,t,n=.7){let r=[],i=e.metrics.circumradiusH,a=Math.cosh(i),o=0,s=t*1e3,c=n*.85,l=.15+n*.45;for(;r.length<t&&o<s;){o++;let n=Math.random(),i=Math.random(),s=Math.acosh(1+n*(a-1)),u=Math.tanh(s/2),d=2*Math.PI*i,f={re:u*Math.cos(d),im:u*Math.sin(d)},p=!0;for(let t=0;t<e.sideTests.length;t++)if(A.apply(e.sideTests[t],f).im<=0){p=!1;break}if(p){let e=r.length/t,n=new x().setHSL(e,c,l);r.push({id:r.length,point:f,color:n})}}return console.log(`attempts/seed`,o/t),r}function V(e,t,n,r=.25){let i=n.metrics.circumradiusH,a=3*i+2*r,o=i+r,s=Math.tanh(o/2),c=[];for(let n of e)for(let e of t){let t=A.apply(e.matrix,n.point);N.distance({re:0,im:0},t)<=a&&c.push({point:t,color:n.color})}return console.log(`|expandedSeeds|`,c.length),console.log(`R_tex`,s),{expandedSeeds:c,R_tex:s}}function H(e,t,n){let r=e.length,i=new Float32Array(r*2*4);for(let t=0;t<r;t++){let n=e[t],a=t*4;i[a+0]=n.point.re,i[a+1]=n.point.im,i[a+2]=0,i[a+3]=0;let o=(r+t)*4;i[o+0]=n.color.r,i[o+1]=n.color.g,i[o+2]=n.color.b,i[o+3]=1}let a=new l(i,r,2,S,d);return a.minFilter=w,a.magFilter=w,a.needsUpdate=!0,{dataTexture:a,seedCount:r,R_tex:t,margin:n}}var U=`varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = vec4(position, 1.0);\r
}`,W=`precision highp float;\r
\r
uniform sampler2D u_seedData; // Row 0 = position, Row 1 = RGB color\r
uniform int u_seedCount;\r
uniform float u_R_tex;\r
\r
varying vec2 vUv;\r
\r
// Hyperbolic distance formula in Poincaré disk model\r
float _hypDistance(vec2 z1, vec2 z2) {\r
    vec2 diff = z1 - z2;\r
    // (1 - z2_conj * z1) = (1 - x1*x2 - y1*y2) + i (x2*y1 - x1*y2)\r
    vec2 den = vec2(\r
        1.0 - z2.x * z1.x - z2.y * z1.y,\r
        z2.x * z1.y - z1.x * z2.y\r
    );\r
    \r
    float numLen = length(diff);\r
    float denLen = length(den);\r
    float delta = clamp(numLen / max(denLen, 1e-10), 0.0, 0.99999);\r
    \r
    return 2.0 * atanh(delta); // 2 * artanh(delta) = log((1+delta)/(1-delta))\r
}\r
\r
// Alternative direct artanh formulation\r
float hypDistance(vec2 z1, vec2 z2) {\r
    vec2 diff = z1 - z2;\r
    float numSq = dot(diff, diff);\r
    \r
    vec2 den = vec2(\r
        1.0 - (z2.x * z1.x + z2.y * z1.y),\r
        z2.x * z1.y - z1.x * z2.y\r
    );\r
    float denSq = dot(den, den);\r
    float delta = sqrt(clamp(numSq / max(denSq, 1e-10), 0.0, 0.99999));\r
    \r
    return log((1.0 + delta) / max(1.0 - delta, 1e-8));\r
}\r
\r
void main() {\r
    // Convert screen UV [0,1]^2 to Poincaré coordinates [-R_tex, R_tex]^2\r
    vec2 z = (vUv * 2.0 - 1.0) * u_R_tex;\r
\r
    // Background color if outside Poincaré disk unit circle\r
    if (dot(z, z) >= 1.0) {\r
        gl_FragColor = vec4(0.05, 0.05, 0.07, 1.0);\r
        return;\r
    }\r
\r
    float minDistance = 1e10;\r
    vec3 winningColor = vec3(0.1);\r
\r
    // Loop through all expanded orbit seeds in S\r
    for (int k = 0; k < 4096; k++) {\r
        if (k >= u_seedCount) \r
            break;\r
\r
        // Fetch position from row 0 (y = 0.25 in normalized texel UV)\r
        vec2 seedPos = texture2D(u_seedData, vec2((float(k) + 0.5) / float(u_seedCount), 0.25)).xy;\r
        \r
        float dist = hypDistance(z, seedPos);\r
\r
        if (dist < minDistance) {\r
            minDistance = dist;\r
            // Fetch color from row 1 (y = 0.75 in normalized texel UV)\r
            winningColor = texture2D(u_seedData, vec2((float(k) + 0.5) / float(u_seedCount), 0.75)).rgb;\r
        }\r
    }\r
\r
    // Output winning cell color with subtle edge shading\r
    vec3 col = winningColor * (0.5 + 0.5 * smoothstep(0.0, 0.5, pow(minDistance, 1.5)));\r
    // vec3 col = winningColor;\r
    gl_FragColor = vec4(col, 1.0);\r
}`,G=class{constructor(e=1024){this.R_tex=.5,this.renderTarget=new _(e,e,{minFilter:v,magFilter:v,format:S,type:g}),this.offscreenScene=new y,this.offscreenCamera=new h(-1,1,1,-1,.1,10),this.offscreenCamera.position.set(0,0,1),this.offscreenMaterial=new b({uniforms:{u_seedData:{value:null},u_seedCount:{value:0},u_R_tex:{value:.5}},vertexShader:U,fragmentShader:W,depthTest:!1,depthWrite:!1});let t=new T(2,2);this.quadMesh=new u(t,this.offscreenMaterial),this.offscreenScene.add(this.quadMesh)}updateBaseTexture(e,t,n,r=100,i=.25,a=.7){let{expandedSeeds:o,R_tex:s}=V(B(t,r,a),n,t,i),c=H(o,s,i);this.R_tex=s,this.offscreenMaterial.uniforms.u_seedData.value=c.dataTexture,this.offscreenMaterial.uniforms.u_seedCount.value=c.seedCount,this.offscreenMaterial.uniforms.u_R_tex.value=s;let l=e.getRenderTarget();return e.setRenderTarget(this.renderTarget),e.clear(),e.render(this.offscreenScene,this.offscreenCamera),e.setRenderTarget(l),{texture:this.renderTarget.texture,R_tex:s}}getTexture(){return this.renderTarget.texture}dispose(){this.renderTarget.dispose(),this.offscreenMaterial.dispose(),this.quadMesh.geometry.dispose()}},K=`precision highp float;\r
\r
uniform sampler2D u_prevTexture;\r
uniform float u_segA;\r
uniform float u_segB;\r
uniform vec4 u_mapRe;\r
uniform vec4 u_mapIm;\r
uniform float u_radius;\r
uniform vec3 u_brushColor;\r
uniform float u_R_tex;\r
\r
uniform sampler2D u_subgroupTexture;\r
uniform int u_subgroupCount;\r
\r
varying vec2 vUv;\r
\r
vec2 c_mul(vec2 u, vec2 v) {\r
    return vec2(u.x * v.x - u.y * v.y, u.x * v.y + u.y * v.x);\r
}\r
\r
vec2 c_div(vec2 u, vec2 v) {\r
    float denom = dot(v, v);\r
    return vec2(dot(u, v), u.y * v.x - u.x * v.y) / max(denom, 1e-10);\r
}\r
\r
vec2 applyMobius(vec4 mRe, vec4 mIm, vec2 z) {\r
    vec2 a = vec2(mRe.x, mIm.x);\r
    vec2 b = vec2(mRe.y, mIm.y);\r
    vec2 c = vec2(mRe.z, mIm.z);\r
    vec2 d = vec2(mRe.w, mIm.w);\r
\r
    vec2 num = c_mul(a, z) + b;\r
    vec2 den = c_mul(c, z) + d;\r
    return c_div(num, den);\r
}\r
\r
float hypDistToSegment(vec2 z, float a, float b) {\r
    float u = z.x;\r
    float v = z.y;\r
    float zLenSq = dot(z, z);\r
\r
    float x_star = 0.0;\r
    if (abs(u) > 1e-6) {\r
        float disc = (1.0 - zLenSq) * (1.0 - zLenSq) + 4.0 * v * v;\r
        x_star = (1.0 + zLenSq - sqrt(max(disc, 0.0))) / (2.0 * u);\r
    }\r
\r
    float p = clamp(x_star, a, b);\r
\r
    if (x_star >= a && x_star <= b) {\r
        return 2.0 * asinh(abs(v) / max(1.0 - zLenSq, 1e-10));\r
    } else {\r
        vec2 endpoint = vec2(p, 0.0);\r
        vec2 diff = z - endpoint;\r
        vec2 den = vec2(1.0 - endpoint.x * z.x - endpoint.y * z.y, endpoint.x * z.y - z.x * endpoint.y);\r
        float delta = clamp(length(diff) / max(length(den), 1e-10), 0.0, 0.99999);\r
        return 2.0 * atanh(delta);\r
    }\r
}\r
\r
void main() {\r
    vec4 prevColor = texture2D(u_prevTexture, vUv);\r
    vec2 w = (vUv * 2.0 - 1.0) * u_R_tex;\r
\r
    float minDist = 1e10;\r
\r
    for (int i = 0; i < 4096; i++) {\r
        if (i >= u_subgroupCount) break;\r
\r
        float u_coord = (float(i) + 0.5) / float(u_subgroupCount);\r
        vec4 row0 = texture2D(u_subgroupTexture, vec2(u_coord, 0.25));\r
        vec4 row1 = texture2D(u_subgroupTexture, vec2(u_coord, 0.75));\r
\r
        vec4 mRe = vec4(row0.x, row0.z, row1.x, row1.z);\r
        vec4 mIm = vec4(row0.y, row0.w, row1.y, row1.w);\r
\r
        vec2 z_inv = applyMobius(mRe, mIm, w);\r
        vec2 z_canon = applyMobius(u_mapRe, u_mapIm, z_inv);\r
\r
        float dist = hypDistToSegment(z_canon, u_segA, u_segB);\r
        minDist = min(minDist, dist);\r
    }\r
\r
    float alpha = smoothstep(u_radius, u_radius - 0.005, minDist);\r
    vec3 finalColor = mix(prevColor.rgb, u_brushColor, alpha);\r
\r
    gl_FragColor = vec4(finalColor, 1.0);\r
}`,q=class{constructor(e,t=2048){this.isTargetAActive=!0,this.subgroupCount=0,this.renderer=e,this.resolution=t;let n={minFilter:v,magFilter:v,format:S,type:g};this.renderTargetA=new _(t,t,n),this.renderTargetB=new _(t,t,n),this.scene=new y,this.camera=new h(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.paintMaterial=new b({uniforms:{u_prevTexture:{value:null},u_segA:{value:0},u_segB:{value:0},u_mapRe:{value:new p(1,0,0,1)},u_mapIm:{value:new p(0,0,0,0)},u_radius:{value:.1},u_brushColor:{value:new C(1,0,0)},u_subgroupTexture:{value:null},u_subgroupCount:{value:0},u_R_tex:{value:.5}},vertexShader:U,fragmentShader:K,depthTest:!1,depthWrite:!1});let r=new T(2,2);this.quadMesh=new u(r,this.paintMaterial),this.scene.add(this.quadMesh)}setSubgroup(e){this.subgroupCount=e.length;let t=new Float32Array(this.subgroupCount*2*4);for(let n=0;n<this.subgroupCount;n++){let r=e[n].matrix,i=A.inverse(r),a=n*4;t[a+0]=i.a.re,t[a+1]=i.a.im,t[a+2]=i.b.re,t[a+3]=i.b.im;let o=(this.subgroupCount+n)*4;t[o+0]=i.c.re,t[o+1]=i.c.im,t[o+2]=i.d.re,t[o+3]=i.d.im}this.subgroupTexture&&this.subgroupTexture.dispose(),this.subgroupTexture=new l(t,this.subgroupCount,2,S,d),this.subgroupTexture.minFilter=w,this.subgroupTexture.magFilter=w,this.subgroupTexture.needsUpdate=!0,this.paintMaterial.uniforms.u_subgroupTexture.value=this.subgroupTexture,this.paintMaterial.uniforms.u_subgroupCount.value=this.subgroupCount}setR_tex(e){this.paintMaterial.uniforms.u_R_tex.value=e}initializeWithTexture(e){let t=this.renderer.getRenderTarget();this.renderer.setRenderTarget(this.renderTargetA);let n=new f({map:e});this.quadMesh.material=n,this.renderer.render(this.scene,this.camera),this.quadMesh.material=this.paintMaterial,this.renderer.setRenderTarget(t),this.isTargetAActive=!0}addStroke(e,t,n,r){if(e.re*e.re+e.im*e.im>=.99||t.re*t.re+t.im*t.im>=.99)return;let i=A.mapToOrigin(e),a=A.apply(i,t),o=Math.atan2(a.im,a.re),s=A.rotation(-o),c=A.multiply(s,i),l=A.apply(c,e),u=A.apply(c,t),d=l.re,f=u.re;if(d>f){let e=d;d=f,f=e}let p=this.isTargetAActive?this.renderTargetA:this.renderTargetB,m=this.isTargetAActive?this.renderTargetB:this.renderTargetA;this.paintMaterial.uniforms.u_prevTexture.value=p.texture,this.paintMaterial.uniforms.u_segA.value=d,this.paintMaterial.uniforms.u_segB.value=f,this.paintMaterial.uniforms.u_mapRe.value.set(c.a.re,c.b.re,c.c.re,c.d.re),this.paintMaterial.uniforms.u_mapIm.value.set(c.a.im,c.b.im,c.c.im,c.d.im),this.paintMaterial.uniforms.u_radius.value=n,this.paintMaterial.uniforms.u_brushColor.value.set(r.r,r.g,r.b);let h=this.renderer.getRenderTarget();this.renderer.setRenderTarget(m),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(h),this.isTargetAActive=!this.isTargetAActive}saveTextureAsPNG(e=`poincare_paint.png`){let t=this.resolution,n=this.resolution,r=new Uint8Array(t*n*4),i=this.renderer.getRenderTarget(),a=this.isTargetAActive?this.renderTargetA:this.renderTargetB;this.renderer.setRenderTarget(a),this.renderer.readRenderTargetPixels(a,0,0,t,n,r),this.renderer.setRenderTarget(i);let o=document.createElement(`canvas`);o.width=t,o.height=n;let s=o.getContext(`2d`);if(!s)return;let c=s.createImageData(t,n);for(let e=0;e<n;e++){let i=n-1-e;for(let n=0;n<t;n++){let a=(i*t+n)*4,o=(e*t+n)*4;c.data[o+0]=r[a+0],c.data[o+1]=r[a+1],c.data[o+2]=r[a+2],c.data[o+3]=r[a+3]}}s.putImageData(c,0,0);let l=document.createElement(`a`);l.download=e,l.href=o.toDataURL(`image/png`),l.click()}getCurrentTexture(){return(this.isTargetAActive?this.renderTargetA:this.renderTargetB).texture}dispose(){this.renderTargetA.dispose(),this.renderTargetB.dispose(),this.subgroupTexture?.dispose(),this.paintMaterial.dispose(),this.quadMesh.geometry.dispose()}};function J(e,t,n,r=64){let i=A.apply(e,{re:0,im:0}),a=A.identity(),o=t.sideTests.length;for(let e=0;e<r;e++){let e=!1;for(let r=0;r<o;r++)if(A.apply(t.sideTests[r],i).im<=0){let t=n[r];i=A.apply(t,i),a=A.multiply(t,a),e=!0;break}if(!e)break}let s=A.multiply(a,e);return A.normalize(s)}function Y(e,t,n,r,i){let a=t.re*t.re+t.im*t.im,o=n.re*n.re+n.im*n.im;if(a>=.999||o>=.999)return e;let s=A.mapToOrigin(n),c=A.mapOriginTo(t),l=A.multiply(c,s);return J(A.multiply(e,l),r,i)}var X=`precision highp float;\r
\r
#define MAX_SIDES 12\r
\r
uniform vec2 resolution;\r
uniform int u_sideCount;\r
uniform vec4 u_T_re[MAX_SIDES];\r
uniform vec4 u_T_im[MAX_SIDES];\r
uniform vec4 u_g_re[MAX_SIDES];\r
uniform vec4 u_g_im[MAX_SIDES];\r
uniform float u_gReflected[MAX_SIDES];\r
uniform sampler2D u_paintTexture;\r
uniform float u_R_tex;\r
uniform vec4 u_gView_re;\r
uniform vec4 u_gView_im;\r
uniform float u_gViewReflected;\r
uniform float u_overlay;\r
uniform float u_scale;\r
\r
// Edge overlay uniforms\r
uniform float u_edgeA[MAX_SIDES];\r
uniform float u_edgeB[MAX_SIDES];\r
uniform vec4 u_edgeMapRe[MAX_SIDES];\r
uniform vec4 u_edgeMapIm[MAX_SIDES];\r
uniform float u_edgeReflected[MAX_SIDES];\r
\r
vec2 c_mul(vec2 u, vec2 v) {\r
    return vec2(u.x * v.x - u.y * v.y, u.x * v.y + u.y * v.x);\r
}\r
\r
vec2 c_div(vec2 u, vec2 v) {\r
    float denom = dot(v, v);\r
    return vec2(dot(u, v), u.y * v.x - u.x * v.y) / max(denom, 1e-10);\r
}\r
\r
vec2 applyMobius(vec4 mRe, vec4 mIm, vec2 z) {\r
    vec2 a = vec2(mRe.x, mIm.x);\r
    vec2 b = vec2(mRe.y, mIm.y);\r
    vec2 c = vec2(mRe.z, mIm.z);\r
    vec2 d = vec2(mRe.w, mIm.w);\r
    return c_div(c_mul(a, z) + b, c_mul(c, z) + d);\r
}\r
\r
vec2 applyMobiusReflected(vec4 mRe, vec4 mIm, vec2 z, float reflected) {\r
    vec2 z_in = (reflected > 0.5) ? vec2(z.x, -z.y) : z;\r
    vec2 a = vec2(mRe.x, mIm.x);\r
    vec2 b = vec2(mRe.y, mIm.y);\r
    vec2 c = vec2(mRe.z, mIm.z);\r
    vec2 d = vec2(mRe.w, mIm.w);\r
    return c_div(c_mul(a, z_in) + b, c_mul(c, z_in) + d);\r
}\r
\r
float hypDistToSegment(vec2 z, float a, float b) {\r
    float u = z.x;\r
    float v = z.y;\r
    float zLenSq = dot(z, z);\r
    float x_star = 0.0;\r
    if (abs(u) > 1e-6) {\r
        float disc = (1.0 - zLenSq) * (1.0 - zLenSq) + 4.0 * v * v;\r
        x_star = (1.0 + zLenSq - sqrt(max(disc, 0.0))) / (2.0 * u);\r
    }\r
    float p = clamp(x_star, a, b);\r
    if (x_star >= a && x_star <= b) {\r
        return 2.0 * asinh(abs(v) / max(1.0 - zLenSq, 1e-10));\r
    } else {\r
        vec2 endpoint = vec2(p, 0.0);\r
        vec2 diff = z - endpoint;\r
        vec2 den = vec2(1.0 - endpoint.x * z.x - endpoint.y * z.y, endpoint.x * z.y - z.x * endpoint.y);\r
        float delta = clamp(length(diff) / max(length(den), 1e-10), 0.0, 0.99999);\r
        return 2.0 * atanh(delta);\r
    }\r
}\r
\r
void main() {\r
    vec2 st = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y) * u_scale;\r
    float r = length(st);\r
\r
    if (r >= 0.999) {\r
        gl_FragColor = vec4(0.05, 0.05, 0.05, 1.0);\r
        return;\r
    }\r
\r
    vec2 z = applyMobiusReflected(u_gView_re, u_gView_im, st, u_gViewReflected);\r
\r
    // Domain folding into P_0 with reflection support\r
    for (int iter = 0; iter < 64; iter++) {\r
        bool folded = false;\r
        for (int i = 0; i < MAX_SIDES; i++) {\r
            if (i >= u_sideCount) \r
                break;\r
            vec2 Tz = applyMobius(u_T_re[i], u_T_im[i], z);\r
            if (Tz.y <= 0.0) {\r
                z = applyMobiusReflected(u_g_re[i], u_g_im[i], z, u_gReflected[i]);\r
                folded = true;\r
                break;\r
            }\r
        }\r
        if (!folded) \r
            break;\r
    }\r
\r
    // Sample underlying paint / Voronoi texture\r
    vec2 texUv = (z / u_R_tex) * 0.5 + 0.5;\r
    vec4 paintColor = texture2D(u_paintTexture, texUv);\r
\r
    // Compute distance to fundamental polygon edges for boundary overlay\r
    float minEdgeDist = 1e10;\r
    for (int i = 0; i < MAX_SIDES; i++) {\r
        if (i >= u_sideCount) \r
            break;\r
        vec2 z_canon = applyMobiusReflected(u_edgeMapRe[i], u_edgeMapIm[i], z, u_edgeReflected[i]);\r
        float d = hypDistToSegment(z_canon, u_edgeA[i], u_edgeB[i]);\r
        minEdgeDist = min(minEdgeDist, d);\r
    }\r
\r
    // Overlay boundary lines (gold/yellow glow)\r
    float edgeAlpha = u_overlay * smoothstep(0.01 * (1.0 + 10.0 * u_overlay), 0.001, minEdgeDist);\r
    vec3 overlayColor = vec3(1.0, 0.85, 0.3);\r
\r
    vec3 finalColor = mix(paintColor.rgb, overlayColor, edgeAlpha);\r
\r
    gl_FragColor = vec4(finalColor, 1.0);\r
}`,Z=12,Q=class{constructor(e){this.cleanUpTasks=[],this.containerSize=new m(0,0),this.gView=A.identity(),this.resolution=new m,this.overlay=.1,this.scale=1.5,this.brushRadius=.04,this.brushColor=`#ff3344`,this.voronoiSeedCount=10,this.voronoiProminence=.1,this.u_edgeA=new Float32Array(Z),this.u_edgeB=new Float32Array(Z),this.u_edgeMapRe=Array.from({length:Z},()=>new p),this.u_edgeMapIm=Array.from({length:Z},()=>new p),this.u_edgeReflected=new Float32Array(Z),this.u_T_re=Array.from({length:Z},()=>new p),this.u_T_im=Array.from({length:Z},()=>new p),this.u_g_re=Array.from({length:Z},()=>new p),this.u_g_im=Array.from({length:Z},()=>new p),this.u_gReflected=new Float32Array(Z),this.container=e,this.isInitialized=!1,ee.DEFAULT_UP.set(0,0,1)}async init(e){this.renderer=new E({antialias:!0,alpha:!0}),this.renderer.setClearColor(1118481,1),this.container.appendChild(this.renderer.domElement),z(),this.setupCamera(),this.setupScene(),this.createGUI(),this.isInitialized=!0,e.aborted?this.dispose():(this.animate=this.animate.bind(this),this.renderer.setAnimationLoop(this.animate))}dispose(){if(this.isInitialized){this.renderer.setAnimationLoop(null),this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.shaderMaterial?.dispose(),this.paintPipeline?.dispose(),this.gui.destroy(),this.renderer.dispose()}}handleResize(){let e=this.container.clientWidth,t=this.container.clientHeight;if(e<=0||t<=0||this.containerSize.x===e&&this.containerSize.y===t)return;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.containerSize.set(e,t),this.renderer.setSize(e,t);let n=e/t;this.camera instanceof h?(this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()):this.camera instanceof c&&(this.camera.aspect=n,this.camera.updateProjectionMatrix()),this.renderer.getDrawingBufferSize(this.resolution),this.shaderMaterial&&(this.shaderMaterial.uniforms.resolution.value=this.resolution)}createGUI(){this.gui=new D;let e=this.gui.addFolder(`Brush Settings`);e.add(this,`brushRadius`,.01,.5,.001).name(`Radius`);let t=e.addColor(this,`brushColor`).name(`Color`);e.add({randomColor:()=>{let e=`#`+Math.floor(Math.random()*16777215).toString(16).padStart(6,`0`);this.brushColor=e,t.setValue(e)}},`randomColor`).name(`Random Color`);let n=this.gui.addFolder(`Voronoi Background`);n.add(this,`voronoiSeedCount`,3,50,1).name(`Seed Count`),n.add(this,`voronoiProminence`,0,1,.05).name(`Prominence`),n.add(this,`resetCanvas`).name(`Reset & Re-bake`);let r=this.gui.addFolder(`View Settings`);r.add(this,`scale`,.25,2.05,.05).name(`Scale / Zoom`),r.add(this,`overlay`,0,.8).name(`Overlay`),r.add({savePNG:()=>this.paintPipeline.saveTextureAsPNG(`poincare_painting.png`)},`savePNG`).name(`Save Paint as PNG`),r.add({importClipboard:()=>this.importTilingFromClipboard()},`importClipboard`).name(`Import Tiling from Clipboard`)}setupCamera(){this.camera=new h(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1)}setupScene(){this.scene=new y;let e=[{edgeIndex:0,targetEdgeIndex:3,sign:-1},{edgeIndex:1,targetEdgeIndex:5,sign:-1},{edgeIndex:2,targetEdgeIndex:4,sign:-1},{edgeIndex:3,targetEdgeIndex:0,sign:-1},{edgeIndex:4,targetEdgeIndex:2,sign:-1},{edgeIndex:5,targetEdgeIndex:1,sign:-1}];this.paintPipeline=new q(this.renderer,1024),this.shaderMaterial=new b({uniforms:{resolution:{value:new m},u_sideCount:{value:6},u_T_re:{value:this.u_T_re},u_T_im:{value:this.u_T_im},u_g_re:{value:this.u_g_re},u_g_im:{value:this.u_g_im},u_gReflected:{value:this.u_gReflected},u_paintTexture:{value:null},u_R_tex:{value:1},u_gView_re:{value:null},u_gView_im:{value:null},u_gViewReflected:{value:0},u_overlay:{value:.1},u_scale:{value:this.scale},u_edgeA:{value:this.u_edgeA},u_edgeB:{value:this.u_edgeB},u_edgeMapRe:{value:this.u_edgeMapRe},u_edgeMapIm:{value:this.u_edgeMapIm},u_edgeReflected:{value:this.u_edgeReflected}},vertexShader:U,fragmentShader:X}),this.applyTiling(6,4,e);let t=new T(2,2);this.scene.add(new u(t,this.shaderMaterial)),this.cleanUpTasks.push(()=>t.dispose()),this.cleanUpTasks.push(()=>this.shaderMaterial.dispose()),this.cleanUpTasks.push(()=>this.paintPipeline.dispose())}applyTiling(e,t,n){this.polygon=M.build(e,t),this.folds=M.getTilingFolds(this.polygon,n);for(let t=0;t<Z;t++)if(t<e){let n=this.polygon.vertices[t],r=this.polygon.vertices[(t+1)%e],i=A.mapToOrigin(n),a=A.apply(i,r),o=Math.atan2(a.im,a.re),s=A.rotation(-o),c=A.multiply(s,i),l=A.apply(c,n),u=A.apply(c,r),d=l.re,f=u.re;if(d>f){let e=d;d=f,f=e}this.u_edgeA[t]=d,this.u_edgeB[t]=f,this.u_edgeMapRe[t].set(c.a.re,c.b.re,c.c.re,c.d.re),this.u_edgeMapIm[t].set(c.a.im,c.b.im,c.c.im,c.d.im),this.u_edgeReflected[t]=+!!c.isReflected;let p=this.polygon.sideTests[t];this.u_T_re[t].set(p.a.re,p.b.re,p.c.re,p.d.re),this.u_T_im[t].set(p.a.im,p.b.im,p.c.im,p.d.im);let m=this.folds[t];this.u_g_re[t].set(m.a.re,m.b.re,m.c.re,m.d.re),this.u_g_im[t].set(m.a.im,m.b.im,m.c.im,m.d.im),this.u_gReflected[t]=+!!m.isReflected}else this.u_edgeA[t]=0,this.u_edgeB[t]=0,this.u_edgeMapRe[t].set(1,0,0,1),this.u_edgeMapIm[t].set(0,0,0,0),this.u_edgeReflected[t]=0,this.u_T_re[t].set(1,0,0,1),this.u_T_im[t].set(0,0,0,0),this.u_g_re[t].set(1,0,0,1),this.u_g_im[t].set(0,0,0,0),this.u_gReflected[t]=0;let r=j.computeSidePairingGenerators(this.polygon,n,!1);this.subgroup=j.exploreSubgroupBounded(r,.98,10,!1),this.paintPipeline.setSubgroup(this.subgroup);let{R_tex:i}=this.rebuildVoronoiCanvas();this.shaderMaterial&&(this.shaderMaterial.uniforms.u_sideCount.value=e,this.shaderMaterial.uniforms.u_R_tex.value=i,this.shaderMaterial.uniforms.u_paintTexture.value=this.paintPipeline.getCurrentTexture(),this.shaderMaterial.uniforms.u_edgeA.value=this.u_edgeA,this.shaderMaterial.uniforms.u_edgeB.value=this.u_edgeB,this.shaderMaterial.uniforms.u_edgeMapRe.value=this.u_edgeMapRe,this.shaderMaterial.uniforms.u_edgeMapIm.value=this.u_edgeMapIm,this.shaderMaterial.uniforms.u_edgeReflected.value=this.u_edgeReflected,this.shaderMaterial.uniforms.u_T_re.value=this.u_T_re,this.shaderMaterial.uniforms.u_T_im.value=this.u_T_im,this.shaderMaterial.uniforms.u_g_re.value=this.u_g_re,this.shaderMaterial.uniforms.u_g_im.value=this.u_g_im,this.shaderMaterial.uniforms.u_gReflected.value=this.u_gReflected),this.gView=A.identity()}resetCanvas(){let{R_tex:e}=this.rebuildVoronoiCanvas();this.shaderMaterial&&(this.shaderMaterial.uniforms.u_paintTexture.value=this.paintPipeline.getCurrentTexture(),this.shaderMaterial.uniforms.u_R_tex.value=e)}rebuildVoronoiCanvas(){let e=new G(2048),{texture:t,R_tex:n}=e.updateBaseTexture(this.renderer,this.polygon,this.subgroup,Math.round(this.voronoiSeedCount),.05,this.voronoiProminence);return this.paintPipeline.setR_tex(n),this.paintPipeline.initializeWithTexture(t),e.dispose(),{R_tex:n}}async importTilingFromClipboard(){try{let e=await navigator.clipboard.readText(),t=P(e);this.applyTiling(t.p,t.q,t.sidePairings),console.log(`Successfully imported {${t.p}, ${t.q}} tiling from clipboard!`)}catch(e){console.error(`Failed to import tiling from clipboard. Make sure clipboard contains valid tiling JSON.`,e)}}inputTransform(e,t,n,r){let i=this.container.clientWidth,a=this.container.clientHeight,o=this.scale/Math.min(i,a),s={re:o*(e-i/2),im:-o*(t-a/2)},c={re:o*n,im:-o*r};this.gView=Y(this.gView,s,k.add(s,c),this.polygon,this.folds)}inputStroke(e,t,n,r){let i=this.container.clientWidth,a=this.container.clientHeight,o=this.scale/Math.min(i,a),s={re:o*(e-i/2),im:-o*(t-a/2)},c={re:o*(e+n-i/2),im:-o*(t+r-a/2)},l=A.apply(this.gView,s),u=A.apply(this.gView,c);l.re*l.re+l.im*l.im>=.99||u.re*u.re+u.im*u.im>=.99||(this.paintPipeline.addStroke(l,u,this.brushRadius,new x(this.brushColor)),this.shaderMaterial.uniforms.u_paintTexture.value=this.paintPipeline.getCurrentTexture())}animate(){this.handleResize(),this.render()}render(){this.shaderMaterial.uniforms.u_gView_re.value=new p(this.gView.a.re,this.gView.b.re,this.gView.c.re,this.gView.d.re),this.shaderMaterial.uniforms.u_gView_im.value=new p(this.gView.a.im,this.gView.b.im,this.gView.c.im,this.gView.d.im),this.shaderMaterial.uniforms.u_gViewReflected.value=+!!this.gView.isReflected,this.shaderMaterial.uniforms.u_scale.value=this.scale,this.shaderMaterial.uniforms.u_overlay.value=this.overlay,this.renderer.render(this.scene,this.camera)}},$=n(),te=()=>{let e=(0,F.useRef)(null);return(0,F.useEffect)(()=>{if(!e.current)return;let t=new AbortController,n=new Q(e.current);n.init(t.signal);let r=new O(e.current,{mouse:{drag:e=>{e.buttons&1&&n.inputStroke(e.x,e.y,e.dx,e.dy),e.buttons&2&&n.inputTransform(e.x,e.y,e.dx,e.dy)},down:e=>{e.button===0&&n.inputStroke(e.x,e.y,0,0)}},wheel:{},touch:{dragSingle:e=>n.inputTransform(e.x,e.y,e.dx,e.dy),dragPair:e=>n.inputTransform(e.x,e.y,e.dx,e.dy)}});return()=>{t.abort(),n.dispose(),r.cleanup()}},[]),(0,$.jsx)(`div`,{ref:e,style:{position:`relative`,width:`100%`,height:`100%`,overflow:`hidden`}})},ne=()=>(0,$.jsxs)(s,{maxWidth:`xl`,children:[(0,$.jsx)(o,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,$.jsx)(a,{variant:`h2`,children:`Hyperbolic space`})}),(0,$.jsx)(o,{sx:{position:`relative`,width:`100%`,height:`600px`},children:(0,$.jsx)(te,{})}),(0,$.jsx)(i,{component:r,to:`/`,variant:`body1`,color:`primary`,children:`Back`})]});export{ne as default};