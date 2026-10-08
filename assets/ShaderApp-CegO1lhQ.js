import{a as e,n as t,t as n}from"./jsx-runtime-BaSZ_JNh.js";import{n as r,o as i,s as a}from"./chunk-OB3PAWPO-BISt63PO.js";import{n as o,t as s}from"./index-8A4gUUUc.js";import{$t as c,Ft as l,Gr as u,Or as d,Qt as f,Zt as p,dr as m,qr as h,tn as g,ur as _}from"./three.core-D2c_NNN8.js";import{r as v}from"./three.module-vR93GfxR.js";import{t as y}from"./lil-gui.module.min-F6ktE2kk.js";import{t as b}from"./OrbitControls-BXCy7p_l.js";import{t as x}from"./hyperbolic-9uDANQLP.js";var S=e(t(),1),C=`varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = vec4(position, 1.0);\r
}`,w=`precision highp float;\r
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
    // Map screen UV to Poincaré disk coordinates centered at origin\r
    vec2 st = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y) * 1.1;\r
\r
    float r = length(st);\r
\r
    // Render boundary ring outside disk\r
    if (r >= 1.0) {\r
        if (r < 1.01) {\r
            gl_FragColor = vec4(0.8, 0.8, 0.85, 1.0);\r
        } else {\r
            gl_FragColor = vec4(0.05, 0.05, 0.07, 1.0);\r
        }\r
        return;\r
    }\r
\r
    vec2 z = st;\r
    int steps = 0;\r
    bool inFundamentalPolygon = false;\r
\r
    // Iterative domain folding loop\r
    for (int iter = 0; iter < MAX_ITER; iter++) {\r
        bool moved = false;\r
        for (int i = 0; i < MAX_SIDES; i++) {\r
            if (i >= u_sideCount) break;\r
\r
            // Check if point lies inside edge i: Im(T_i(z)) > 0\r
            vec2 Tz = applyMobius(u_T_re[i], u_T_im[i], z);\r
            if (Tz.y <= 0.0) {\r
                // Point is outside edge i -> fold back using g_i\r
                z = applyMobius(u_g_re[i], u_g_im[i], z);\r
                moved = true;\r
                steps++;\r
                break; // Restart side tests from edge 0\r
            }\r
        }\r
        if (!moved) {\r
            inFundamentalPolygon = true;\r
            break;\r
        }\r
    }\r
\r
    if (inFundamentalPolygon) {\r
        // Hyperbolic distance from disk center\r
        float distHyp = log((1.0 + length(z)) / max(1.0 - length(z), 1e-5));\r
\r
        // Base tile color tinted by iteration count\r
        float fSteps = float(steps);\r
        vec3 col = vec3(0.2, 0.45, 0.7);\r
        col += 0.62 * vec3(sin(fSteps * 0.8), cos(fSteps * 0.5), sin(fSteps * 0.3 + 1.0));\r
\r
        col += vec3(sin(28.0*z.x), 0.5*cos(28.0*z.y), sin(24.0*z.x*z.y)) - 0.5;\r
\r
        // Hyperbolic distance ring grid\r
        float grid = smoothstep(0.02, 0.25, abs(fract(distHyp * 8.0 - 0.1) - 0.1));\r
        col *= 0.75 + 0.25 * grid;\r
\r
        gl_FragColor = vec4(col, 1.0);\r
    } else {\r
        gl_FragColor = vec4(0.1, 0.1, 0.15, 1.0);\r
    }\r
}`;function T(e){return E({a:{re:Math.cos(e),im:Math.sin(e)},b:{re:0,im:0},c:{re:0,im:0},d:{re:1,im:0},isReflected:!1})}function E(e){let t=Math.hypot(e.a.re,e.a.im,e.b.re,e.b.im,e.c.re,e.c.im,e.d.re,e.d.im)||1;return{a:x.scale(e.a,1/t),b:x.scale(e.b,1/t),c:x.scale(e.c,1/t),d:x.scale(e.d,1/t),isReflected:!!e.isReflected}}function D(e,t){let n=e.isReflected?x.conj(t):t,r=x.add(x.mul(e.a,n),e.b),i=x.add(x.mul(e.c,n),e.d);return x.div(r,i)}function O(e,t){let n=!!e.isReflected,r=!!t.isReflected,i=n?x.matrixConj(t):t;return E({a:x.add(x.mul(e.a,i.a),x.mul(e.b,i.c)),b:x.add(x.mul(e.a,i.b),x.mul(e.b,i.d)),c:x.add(x.mul(e.c,i.a),x.mul(e.d,i.c)),d:x.add(x.mul(e.c,i.b),x.mul(e.d,i.d)),isReflected:n!==r})}function k(e,t,n=1e-6){for(let r of[{re:0,im:0},{re:.2,im:.1},{re:-.3,im:.25}]){let i=D(e,r),a=D(t,r);if(x.abs(x.sub(i,a))>n)return!1}return!0}function A(e,t,n){let r=Math.cos(Math.PI/t)/Math.sin(Math.PI/e),i=r/Math.sqrt(r*r-1),a=Math.tanh(Math.acosh(r)/2),o=1/Math.tan(Math.PI/e)*(1/Math.tan(Math.PI/t)),s=Math.tanh(Math.acosh(o)/2),c=[],l=[];for(let t=1;t<=e;t++){let n=2*Math.PI*(t-1)/e;l.push(n),c.push({re:a*Math.cos(n),im:a*Math.sin(n)})}let u=[];for(let t=0;t<e;t++){let e=c[t],n=-(l[t]+Math.PI/2),r={a:{re:1,im:0},b:x.scale(e,-1),c:x.scale(x.conj(e),-1),d:{re:1,im:0},isReflected:!1},i=O(T(n),r);u.push(i);let o=D(i,{re:0,im:0});(Math.abs(o.re)>1e-4||Math.abs(o.im-a)>1e-4)&&console.error(`Sanity check failed for T_${t+1}(0): expected (0, ${a.toFixed(4)}), got (${o.re.toFixed(4)}, ${o.im.toFixed(4)})`,i)}let d=E({a:{re:1,im:0},b:{re:0,im:0},c:{re:0,im:0},d:{re:1,im:0},isReflected:!0}),f=Math.PI/e*2,p=E({a:{re:Math.cos(f),im:Math.sin(f)},b:{re:0,im:0},c:{re:0,im:0},d:{re:1,im:0},isReflected:!0}),m=E({a:{re:i,im:0},b:{re:-1,im:0},c:{re:1,im:0},d:{re:-i,im:0},isReflected:!0}),h=E({a:{re:1,im:0},b:{re:0,im:0},c:{re:0,im:0},d:{re:1,im:0},isReflected:!1});k(O(d,d),h)||console.error(`Sanity check failed: r1^2 != I`,d),k(O(p,p),h)||console.error(`Sanity check failed: r2^2 != I`,p),k(O(m,m),h)||console.error(`Sanity check failed: r3^2 != I`,m);let g=O(d,p),_=h;for(let t=0;t<e;t++)_=O(_,g);k(_,h)||console.error(`Sanity check failed: (r1 * r2)^p != I`,d,p);let v=O(p,m),y=h;for(let e=0;e<t;e++)y=O(y,v);k(y,h)||console.error(`Sanity check failed: (r2 * r3)^q != I`,p,m);let b=O(m,d);k(O(b,b),h)||console.error(`Sanity check failed: (r3 * r1)^2 != I`,m,d);let S=[],C=[];for(let t=0;t<e;t++){let e=n.find(e=>e.edgeIndex===t);if(!e)throw Error(`Missing side pairing for edge e_${t+1}`);let r=e.targetEdgeIndex,i=e.sign??-1,a=T(l[r]),o=T(-l[t]),s;s=i===-1?O(a,O(d,O(m,o))):O(a,O(m,o)),C.push(s)}for(let t=0;t<e;t++){let e=n.find(e=>e.edgeIndex===t).targetEdgeIndex,r=D(C[t],c[t]);x.abs(x.sub(r,c[e]))>1e-4&&console.error(`Sanity check failed: g_${t+1}(m_${t+1}) != m_${e+1}. Expected (${c[e].re.toFixed(4)}, ${c[e].im.toFixed(4)}), got (${r.re.toFixed(4)}, ${r.im.toFixed(4)})`,C[t])}for(let t=0;t<e;t++){let e=n.find(e=>e.edgeIndex===t).targetEdgeIndex;n[e].targetEdgeIndex!==t&&console.error(`Side pairing non-involution failure: edge ${t+1} maps to ${e+1}, but ${e+1} maps to ${n[e].targetEdgeIndex+1}`),k(O(C[e],C[t]),h)||console.error(`Sanity check failed: g_${e+1} * g_${t+1} != I`,C[e],C[t]),S.push({test:u[t],fold:C[t]})}return{sideData:S,rA:a,rV:s}}var j=12,M=class{constructor(e){this.cleanUpTasks=[],this.timer=new d,this.containerSize=new u(0,0),this.container=e,this.isInitialized=!1,p.DEFAULT_UP.set(0,0,1)}async init(e){this.renderer=new v({antialias:!0,alpha:!0}),this.renderer.setClearColor(1118481,1),this.container.appendChild(this.renderer.domElement),this.setupCamera(),this.setupScene(),this.createGUI(),this.isInitialized=!0,e.aborted?this.dispose():(this.animate=this.animate.bind(this),this.renderer.setAnimationLoop(this.animate))}dispose(){if(this.isInitialized){this.renderer.setAnimationLoop(null),this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.controls.dispose(),this.shaderMaterial?.dispose(),this.timer.dispose(),this.gui.destroy(),this.renderer.dispose()}}handleResize(){let e=this.container.clientWidth,t=this.container.clientHeight;if(e<=0||t<=0||this.containerSize.x===e&&this.containerSize.y===t)return;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.containerSize.set(e,t),this.renderer.setSize(e,t);let n=e/t;this.camera instanceof f?(this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()):this.camera instanceof c&&(this.camera.aspect=n,this.camera.updateProjectionMatrix());let r=new u;this.renderer.getDrawingBufferSize(r),this.shaderMaterial.uniforms.resolution.value=r}createGUI(){this.gui=new y,this.gui.add({timeScale:0},`timeScale`,-6,2,1).name(`Log time scale`).onChange(e=>{this.timer.setTimescale(Math.exp(e))})}setupCamera(){this.camera=new f(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.controls=new b(this.camera,this.renderer.domElement),this.controls.enableRotate=!1}setupScene(){this.scene=new _;let e=A(6,4,[{edgeIndex:0,targetEdgeIndex:3,sign:-1},{edgeIndex:1,targetEdgeIndex:5,sign:-1},{edgeIndex:2,targetEdgeIndex:4,sign:-1},{edgeIndex:3,targetEdgeIndex:0,sign:-1},{edgeIndex:4,targetEdgeIndex:2,sign:-1},{edgeIndex:5,targetEdgeIndex:1,sign:-1}]),t=Array.from({length:j},()=>new h),n=Array.from({length:j},()=>new h),r=Array.from({length:j},()=>new h),i=Array.from({length:j},()=>new h);for(let a=0;a<6;a++){let o=e.sideData[a].test;t[a].set(o.a.re,o.b.re,o.c.re,o.d.re),n[a].set(o.a.im,o.b.im,o.c.im,o.d.im);let s=e.sideData[a].fold;r[a].set(s.a.re,s.b.re,s.c.re,s.d.re),i[a].set(s.a.im,s.b.im,s.c.im,s.d.im)}this.shaderMaterial=new m({uniforms:{resolution:{value:new u},time:{value:0},u_sideCount:{value:6},u_T_re:{value:t},u_T_im:{value:n},u_g_re:{value:r},u_g_im:{value:i}},vertexShader:C,fragmentShader:w,side:2});let a=new g(2,2);this.scene.add(new l(a,this.shaderMaterial)),this.cleanUpTasks.push(()=>a.dispose()),this.cleanUpTasks.push(()=>this.shaderMaterial.dispose())}animate(){this.timer.update(),this.controls.update(),this.handleResize(),this.render()}render(){let e=this.timer.getElapsed();this.shaderMaterial.uniforms.time.value=e,this.renderer.render(this.scene,this.camera)}},N=n(),P=()=>{let e=(0,S.useRef)(null);return(0,S.useEffect)(()=>{if(!e.current)return;let t=new AbortController,n=new M(e.current);return n.init(t.signal),()=>{t.abort(),n.dispose()}},[]),(0,N.jsx)(`div`,{ref:e,style:{position:`relative`,width:`100%`,height:`100%`,overflow:`hidden`}})},F=()=>(0,N.jsxs)(s,{maxWidth:`xl`,children:[(0,N.jsx)(o,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,N.jsx)(a,{variant:`h2`,children:`Hyperbolic space`})}),(0,N.jsx)(o,{sx:{position:`relative`,width:`100%`,height:`600px`},children:(0,N.jsx)(P,{})}),(0,N.jsx)(i,{component:r,to:`/`,variant:`body1`,color:`primary`,children:`Back`})]});export{F as default};