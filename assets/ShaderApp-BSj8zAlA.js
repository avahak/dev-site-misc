import{a as e,n as t,t as n}from"./jsx-runtime-BaSZ_JNh.js";import{n as r,o as i,s as a}from"./chunk-OB3PAWPO-BISt63PO.js";import{n as o,t as s}from"./index-CXoYqqKz.js";import{$t as c,E as l,Ft as u,H as d,Jr as f,Kr as p,Qt as m,Rr as h,Zr as g,Zt as _,bt as v,dr as y,fr as b,h as x,kr as S,mn as C,qt as w,tn as T}from"./three.core-BlnPZLIB.js";import{r as E}from"./three.module-DmTPPf6k.js";import{t as D}from"./lil-gui.module.min-F6ktE2kk.js";import{t as O}from"./inputListener-DlWw6-Pr.js";import{a as k,i as A,n as j,r as M,t as N}from"./poincare-DNJHXbsR.js";var P=e(t(),1),F=class e{static minkowskiInnerProduct(e,t){return e.x*t.x+e.y*t.y-e.t*t.t}static distance(t,n){let r=-e.minkowskiInnerProduct(t,n);return Math.acosh(Math.max(1,r))}static poincareToHyperboloid(e){let t=k.absSq(e),n=Math.max(1e-10,1-t);return{x:2*e.re/n,y:2*e.im/n,t:(1+t)/n}}static hyperboloidToPoincare(e){let t=1+e.t;return{re:e.x/t,im:e.y/t}}};function I(e,t){if(!e)throw Error(`Assertion failed: ${t}`)}function L(){let e=M.build(8,8),{r1:t,r2:n,r3:r}=e.reflections,i=A.identity();I(A.areTransformsEqual(A.multiply(t,t),i),`r1^2 == I`),I(A.areTransformsEqual(A.multiply(n,n),i),`r2^2 == I`),I(A.areTransformsEqual(A.multiply(r,r),i),`r3^2 == I`);let a=i,o=A.multiply(t,n);for(let e=0;e<8;e++)a=A.multiply(a,o);I(A.areTransformsEqual(a,i),`(r1 * r2)^p == I`);let s=i,c=A.multiply(n,r);for(let e=0;e<8;e++)s=A.multiply(s,c);I(A.areTransformsEqual(s,i),`(r2 * r3)^q == I`);for(let t=0;t<8;t++){let n=e.edgeReflections[t],r=A.multiply(n,n);I(A.areTransformsEqual(r,i),`sigma_${t}^2 == I`);let a=A.apply(n,e.midpoints[t]);I(k.abs(k.sub(a,e.midpoints[t]))<1e-4,`sigma_${t} fixes edge midpoint m_${t}`);let o=(t-1+8)%8,s=A.apply(n,e.vertices[o]),c=A.apply(n,e.vertices[t]),l=k.abs(k.sub(s,e.vertices[o])),u=k.abs(k.sub(c,e.vertices[t]));I(l<1e-4,`sigma_${t} fixes bounding vertex v_${o}`),I(u<1e-4,`sigma_${t} fixes bounding vertex v_${t}`)}}function R(){console.log(`Running math library tests...`);let e=A.rotation(Math.PI/3),t=A.mapToOrigin({re:.3,im:-.2}),n=A.multiply(e,t),r=A.inverse(n),i=A.multiply(n,r);I(A.areTransformsEqual(i,A.identity()),`Mobius composition with inverse should equal Identity`);let a={re:.4,im:-.5},o=F.poincareToHyperboloid(a),s=F.minkowskiInnerProduct(o,o);I(Math.abs(s- -1)<1e-6,`Hyperboloid point must have Minkowski norm -1, got ${s}`);let c=F.hyperboloidToPoincare(o),l=k.abs(k.sub(a,c));I(l<1e-6,`Roundtrip Poincaré-Minkowski error too large: ${l}`);let u={re:.1,im:.2},d={re:-.4,im:.3},f=N.distance(u,d),p=F.poincareToHyperboloid(u),m=F.poincareToHyperboloid(d),h=F.distance(p,m);I(Math.abs(f-h)<1e-5,`Distances in Poincaré (${f}) and Minkowski (${h}) must match`),L(),console.log(`All math library tests passed successfully!`)}function z(e,t){let n=[],r=e.metrics.circumradiusH,i=Math.cosh(r),a=0,o=t*1e3;for(;n.length<t&&a<o;){a++;let r=Math.random(),o=Math.random(),s=Math.acosh(1+r*(i-1)),c=Math.tanh(s/2),l=2*Math.PI*o,u={re:c*Math.cos(l),im:c*Math.sin(l)},d=!0;for(let t=0;t<e.sideTests.length;t++)if(A.apply(e.sideTests[t],u).im<=0){d=!1;break}if(d){let e=n.length/t,r=new x().setHSL(e,.7,.55);n.push({id:n.length,point:u,color:r})}}return console.log(`attempts/seed`,a/t),n}function B(e,t,n,r=.25){let i=n.metrics.circumradiusH,a=3*i+2*r,o=i+r,s=Math.tanh(o/2),c=[];for(let n of e)for(let e of t){let t=A.apply(e.matrix,n.point);N.distance({re:0,im:0},t)<=a&&c.push({point:t,color:n.color})}return console.log(`|expandedSeeds|`,c.length),console.log(`R_tex`,s),{expandedSeeds:c,R_tex:s}}function V(e,t,n){let r=e.length,i=new Float32Array(r*2*4);for(let t=0;t<r;t++){let n=e[t],a=t*4;i[a+0]=n.point.re,i[a+1]=n.point.im,i[a+2]=0,i[a+3]=0;let o=(r+t)*4;i[o+0]=n.color.r,i[o+1]=n.color.g,i[o+2]=n.color.b,i[o+3]=1}let a=new l(i,r,2,C,d);return a.minFilter=w,a.magFilter=w,a.needsUpdate=!0,{dataTexture:a,seedCount:r,R_tex:t,margin:n}}var H=`varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = vec4(position, 1.0);\r
}`,U=`precision highp float;\r
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
}`,W=class{constructor(e=1024){this.R_tex=.5,this.renderTarget=new g(e,e,{minFilter:v,magFilter:v,format:C,type:h}),this.offscreenScene=new y,this.offscreenCamera=new m(-1,1,1,-1,.1,10),this.offscreenCamera.position.set(0,0,1),this.offscreenMaterial=new b({uniforms:{u_seedData:{value:null},u_seedCount:{value:0},u_R_tex:{value:.5}},vertexShader:H,fragmentShader:U,depthTest:!1,depthWrite:!1});let t=new T(2,2);this.quadMesh=new u(t,this.offscreenMaterial),this.offscreenScene.add(this.quadMesh)}updateBaseTexture(e,t,n,r=100,i=.25){let{expandedSeeds:a,R_tex:o}=B(z(t,r),n,t,i),s=V(a,o,i);this.R_tex=o,this.offscreenMaterial.uniforms.u_seedData.value=s.dataTexture,this.offscreenMaterial.uniforms.u_seedCount.value=s.seedCount,this.offscreenMaterial.uniforms.u_R_tex.value=o;let c=e.getRenderTarget();return e.setRenderTarget(this.renderTarget),e.clear(),e.render(this.offscreenScene,this.offscreenCamera),e.setRenderTarget(c),{texture:this.renderTarget.texture,R_tex:o}}getTexture(){return this.renderTarget.texture}dispose(){this.renderTarget.dispose(),this.offscreenMaterial.dispose(),this.quadMesh.geometry.dispose()}};function G(e,t,n,r=64){let i=A.apply(e,{re:0,im:0}),a=A.identity(),o=t.sideTests.length;for(let e=0;e<r;e++){let e=!1;for(let r=0;r<o;r++)if(A.apply(t.sideTests[r],i).im<=0){let t=n[r];i=A.apply(t,i),a=A.multiply(t,a),e=!0;break}if(!e)break}let s=A.multiply(a,e);return A.normalize(s)}function K(e,t,n,r,i){let a=t.re*t.re+t.im*t.im,o=n.re*n.re+n.im*n.im;if(a>=.999||o>=.999)return e;let s=A.mapToOrigin(n),c=A.mapOriginTo(t),l=A.multiply(c,s);return G(A.multiply(e,l),r,i)}var q=`precision highp float;\r
\r
uniform vec2 resolution;\r
uniform float time;\r
uniform int u_sideCount;\r
\r
#define MAX_SIDES 12\r
\r
uniform vec4 u_T_re[MAX_SIDES];\r
uniform vec4 u_T_im[MAX_SIDES];\r
\r
uniform vec4 u_g_re[MAX_SIDES];\r
uniform vec4 u_g_im[MAX_SIDES];\r
\r
// Base texture uniforms\r
uniform sampler2D u_baseTexture;\r
uniform float u_R_tex;\r
\r
// Panning / rotation\r
uniform vec4 u_gView_re;\r
uniform vec4 u_gView_im;\r
uniform float scale;\r
\r
varying vec2 vUv;\r
\r
const int MAX_ITER = 128;\r
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
void main() {\r
    vec2 st = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y) * scale;\r
    float r = length(st);\r
\r
    if (r >= 1.0) {\r
        if (r < 1.01) {\r
            gl_FragColor = vec4(0.8, 0.8, 0.85, 1.0);\r
        } else {\r
            // gl_FragColor = vec4(0.05, 0.05, 0.07, 1.0);\r
            gl_FragColor = texture2D(u_baseTexture, gl_FragCoord.xy/resolution);\r
        }\r
        return;\r
    }\r
\r
    vec2 z = applyMobius(u_gView_re, u_gView_im, st);\r
    int steps = 0;\r
    bool inFundamentalPolygon = false;\r
\r
    // Fold screen point z back into fundamental polygon P_0\r
    for (int iter = 0; iter < MAX_ITER; iter++) {\r
        bool moved = false;\r
        for (int i = 0; i < MAX_SIDES; i++) {\r
            if (i >= u_sideCount) break;\r
\r
            vec2 Tz = applyMobius(u_T_re[i], u_T_im[i], z);\r
            if (Tz.y <= 0.0) {\r
                z = applyMobius(u_g_re[i], u_g_im[i], z);\r
                moved = true;\r
                steps++;\r
                break;\r
            }\r
        }\r
        if (!moved) {\r
            inFundamentalPolygon = true;\r
            break;\r
        }\r
    }\r
\r
    if (inFundamentalPolygon) {\r
        // Map folded point w in P_0 to base texture UV space [0, 1]^2\r
        vec2 texUv = (z / u_R_tex) * 0.5 + 0.5;\r
\r
        // Sample baked hyperbolic Voronoi base texture\r
        vec4 texColor = texture2D(u_baseTexture, texUv);\r
\r
        // Subtle tile edge highlight based on folding iteration steps\r
        float edgeDim = 1.0;// - min(float(steps) * 0.25, 0.9);\r
        gl_FragColor = vec4(texColor.rgb * edgeDim, 1.0);\r
    } else {\r
        gl_FragColor = vec4(0.1, 0.1, 0.15, 1.0);\r
    }\r
}`,J=12,Y=class{constructor(e){this.cleanUpTasks=[],this.timer=new S,this.containerSize=new p(0,0),this.gView=A.identity(),this.resolution=new p,this.scale=1.8,this.container=e,this.isInitialized=!1,_.DEFAULT_UP.set(0,0,1)}async init(e){this.renderer=new E({antialias:!0,alpha:!0}),this.renderer.setClearColor(1118481,1),this.container.appendChild(this.renderer.domElement),R(),this.setupCamera(),this.setupScene(),this.createGUI(),this.isInitialized=!0,e.aborted?this.dispose():(this.animate=this.animate.bind(this),this.renderer.setAnimationLoop(this.animate))}dispose(){if(this.isInitialized){this.renderer.setAnimationLoop(null),this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.shaderMaterial?.dispose(),this.timer.dispose(),this.gui.destroy(),this.renderer.dispose()}}handleResize(){let e=this.container.clientWidth,t=this.container.clientHeight;if(e<=0||t<=0||this.containerSize.x===e&&this.containerSize.y===t)return;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.containerSize.set(e,t),this.renderer.setSize(e,t);let n=e/t;this.camera instanceof m?(this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()):this.camera instanceof c&&(this.camera.aspect=n,this.camera.updateProjectionMatrix()),this.renderer.getDrawingBufferSize(this.resolution),this.shaderMaterial.uniforms.resolution.value=this.resolution}createGUI(){this.gui=new D,this.gui.add({timeScale:0},`timeScale`,-6,2,1).name(`Log time scale`).onChange(e=>{this.timer.setTimescale(Math.exp(e))})}setupCamera(){this.camera=new m(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1)}setupScene(){this.scene=new y;let e=[{edgeIndex:0,targetEdgeIndex:3,sign:-1},{edgeIndex:1,targetEdgeIndex:5,sign:-1},{edgeIndex:2,targetEdgeIndex:4,sign:-1},{edgeIndex:3,targetEdgeIndex:0,sign:-1},{edgeIndex:4,targetEdgeIndex:2,sign:-1},{edgeIndex:5,targetEdgeIndex:1,sign:-1}];this.polygon=M.build(6,4),this.folds=M.getTilingFolds(this.polygon,e);let t=Array.from({length:J},()=>new f),n=Array.from({length:J},()=>new f),r=Array.from({length:J},()=>new f),i=Array.from({length:J},()=>new f);for(let e=0;e<6;e++){let a=this.polygon.sideTests[e];t[e].set(a.a.re,a.b.re,a.c.re,a.d.re),n[e].set(a.a.im,a.b.im,a.c.im,a.d.im);let o=this.folds[e];r[e].set(o.a.re,o.b.re,o.c.re,o.d.re),i[e].set(o.a.im,o.b.im,o.c.im,o.d.im)}let a=j.computeSidePairingGenerators(this.polygon,e,!1),o=j.exploreSubgroupBounded(a,.98,10,!1),s=new W(2048),{texture:c,R_tex:l}=s.updateBaseTexture(this.renderer,this.polygon,o,20,.05);this.cleanUpTasks.push(()=>s.dispose()),this.shaderMaterial=new b({uniforms:{resolution:{value:new p},time:{value:0},u_sideCount:{value:6},u_T_re:{value:t},u_T_im:{value:n},u_g_re:{value:r},u_g_im:{value:i},u_baseTexture:{value:c},u_R_tex:{value:l},u_gView_re:{value:null},u_gView_im:{value:null},scale:{value:this.scale}},vertexShader:H,fragmentShader:q});let d=new T(2,2);this.scene.add(new u(d,this.shaderMaterial)),this.cleanUpTasks.push(()=>d.dispose()),this.cleanUpTasks.push(()=>this.shaderMaterial.dispose())}inputTransform(e,t,n,r){let i=this.container.clientWidth,a=this.container.clientHeight,o=this.scale/Math.min(i,a),s={re:o*(e-i/2),im:-o*(t-a/2)},c={re:o*n,im:-o*r};this.gView=K(this.gView,s,k.add(s,c),this.polygon,this.folds)}animate(){this.timer.update(),this.handleResize(),this.render()}render(){let e=this.timer.getElapsed();this.shaderMaterial.uniforms.time.value=e,this.shaderMaterial.uniforms.u_gView_re.value=new f(this.gView.a.re,this.gView.b.re,this.gView.c.re,this.gView.d.re),this.shaderMaterial.uniforms.u_gView_im.value=new f(this.gView.a.im,this.gView.b.im,this.gView.c.im,this.gView.d.im),this.shaderMaterial.uniforms.scale.value=this.scale,this.renderer.render(this.scene,this.camera)}},X=n(),Z=()=>{let e=(0,P.useRef)(null);return(0,P.useEffect)(()=>{if(!e.current)return;let t=new AbortController,n=new Y(e.current);n.init(t.signal);let r=new O(e.current,{mouse:{drag:e=>{e.buttons&1&&n.inputTransform(e.x,e.y,e.dx,e.dy),e.buttons&2&&n.inputTransform(e.x,e.y,e.dx,e.dy)}},wheel:{},touch:{dragSingle:e=>n.inputTransform(e.x,e.y,e.dx,e.dy),dragPair:e=>n.inputTransform(e.x,e.y,e.dx,e.dy)}});return()=>{t.abort(),n.dispose(),r.cleanup()}},[]),(0,X.jsx)(`div`,{ref:e,style:{position:`relative`,width:`100%`,height:`100%`,overflow:`hidden`}})},Q=()=>(0,X.jsxs)(s,{maxWidth:`xl`,children:[(0,X.jsx)(o,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,X.jsx)(a,{variant:`h2`,children:`Hyperbolic space`})}),(0,X.jsx)(o,{sx:{position:`relative`,width:`100%`,height:`600px`},children:(0,X.jsx)(Z,{})}),(0,X.jsx)(i,{component:r,to:`/`,variant:`body1`,color:`primary`,children:`Back`})]});export{Q as default};