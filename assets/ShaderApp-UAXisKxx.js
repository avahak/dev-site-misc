import{a as e,n as t,t as n}from"./jsx-runtime-BaSZ_JNh.js";import{n as r,o as i,s as a}from"./chunk-OB3PAWPO-BISt63PO.js";import{n as o,t as s}from"./index-cLhhDHg6.js";import{$t as c,Ft as l,Jr as u,Kr as d,Qt as f,Zt as p,dr as m,fr as h,kr as g,tn as _}from"./three.core-BlnPZLIB.js";import{r as v}from"./three.module-DmTPPf6k.js";import{t as y}from"./lil-gui.module.min-F6ktE2kk.js";import{t as b}from"./OrbitControls-Q21aKHVu.js";import{i as x,n as S,r as C,t as w}from"./poincare-C1vtDXdL.js";var T=e(t(),1),E=`varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = vec4(position, 1.0);\r
}`,D=`precision highp float;\r
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
}`,O=class e{static minkowskiInnerProduct(e,t){return e.x*t.x+e.y*t.y-e.t*t.t}static distance(t,n){let r=-e.minkowskiInnerProduct(t,n);return Math.acosh(Math.max(1,r))}static poincareToHyperboloid(e){let t=x.absSq(e),n=Math.max(1e-10,1-t);return{x:2*e.re/n,y:2*e.im/n,t:(1+t)/n}}static hyperboloidToPoincare(e){let t=1+e.t;return{re:e.x/t,im:e.y/t}}};function k(e,t){if(!e)throw Error(`Assertion failed: ${t}`)}function A(){let e=S.build(8,8),{r1:t,r2:n,r3:r}=e.reflections,i=C.identity();k(C.areTransformsEqual(C.multiply(t,t),i),`r1^2 == I`),k(C.areTransformsEqual(C.multiply(n,n),i),`r2^2 == I`),k(C.areTransformsEqual(C.multiply(r,r),i),`r3^2 == I`);let a=i,o=C.multiply(t,n);for(let e=0;e<8;e++)a=C.multiply(a,o);k(C.areTransformsEqual(a,i),`(r1 * r2)^p == I`);let s=i,c=C.multiply(n,r);for(let e=0;e<8;e++)s=C.multiply(s,c);k(C.areTransformsEqual(s,i),`(r2 * r3)^q == I`);for(let t=0;t<8;t++){let n=e.edgeReflections[t],r=C.multiply(n,n);k(C.areTransformsEqual(r,i),`sigma_${t}^2 == I`);let a=C.apply(n,e.midpoints[t]);k(x.abs(x.sub(a,e.midpoints[t]))<1e-4,`sigma_${t} fixes edge midpoint m_${t}`);let o=(t-1+8)%8,s=C.apply(n,e.vertices[o]),c=C.apply(n,e.vertices[t]),l=x.abs(x.sub(s,e.vertices[o])),u=x.abs(x.sub(c,e.vertices[t]));k(l<1e-4,`sigma_${t} fixes bounding vertex v_${o}`),k(u<1e-4,`sigma_${t} fixes bounding vertex v_${t}`)}}function j(){console.log(`Running math library tests...`);let e=C.rotation(Math.PI/3),t=C.mapToOrigin({re:.3,im:-.2}),n=C.multiply(e,t),r=C.inverse(n),i=C.multiply(n,r);k(C.areTransformsEqual(i,C.identity()),`Mobius composition with inverse should equal Identity`);let a={re:.4,im:-.5},o=O.poincareToHyperboloid(a),s=O.minkowskiInnerProduct(o,o);k(Math.abs(s- -1)<1e-6,`Hyperboloid point must have Minkowski norm -1, got ${s}`);let c=O.hyperboloidToPoincare(o),l=x.abs(x.sub(a,c));k(l<1e-6,`Roundtrip Poincaré-Minkowski error too large: ${l}`);let u={re:.1,im:.2},d={re:-.4,im:.3},f=w.distance(u,d),p=O.poincareToHyperboloid(u),m=O.poincareToHyperboloid(d),h=O.distance(p,m);k(Math.abs(f-h)<1e-5,`Distances in Poincaré (${f}) and Minkowski (${h}) must match`),A(),console.log(`All math library tests passed successfully!`)}var M=12,N=class{constructor(e){this.cleanUpTasks=[],this.timer=new g,this.containerSize=new d(0,0),this.container=e,this.isInitialized=!1,p.DEFAULT_UP.set(0,0,1)}async init(e){this.renderer=new v({antialias:!0,alpha:!0}),this.renderer.setClearColor(1118481,1),this.container.appendChild(this.renderer.domElement),j(),this.setupCamera(),this.setupScene(),this.createGUI(),this.isInitialized=!0,e.aborted?this.dispose():(this.animate=this.animate.bind(this),this.renderer.setAnimationLoop(this.animate))}dispose(){if(this.isInitialized){this.renderer.setAnimationLoop(null),this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.controls.dispose(),this.shaderMaterial?.dispose(),this.timer.dispose(),this.gui.destroy(),this.renderer.dispose()}}handleResize(){let e=this.container.clientWidth,t=this.container.clientHeight;if(e<=0||t<=0||this.containerSize.x===e&&this.containerSize.y===t)return;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.containerSize.set(e,t),this.renderer.setSize(e,t);let n=e/t;this.camera instanceof f?(this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()):this.camera instanceof c&&(this.camera.aspect=n,this.camera.updateProjectionMatrix());let r=new d;this.renderer.getDrawingBufferSize(r),this.shaderMaterial.uniforms.resolution.value=r}createGUI(){this.gui=new y,this.gui.add({timeScale:0},`timeScale`,-6,2,1).name(`Log time scale`).onChange(e=>{this.timer.setTimescale(Math.exp(e))})}setupCamera(){this.camera=new f(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.controls=new b(this.camera,this.renderer.domElement),this.controls.enableRotate=!1}setupScene(){this.scene=new m;let e=[{edgeIndex:0,targetEdgeIndex:3,sign:-1},{edgeIndex:1,targetEdgeIndex:5,sign:-1},{edgeIndex:2,targetEdgeIndex:4,sign:-1},{edgeIndex:3,targetEdgeIndex:0,sign:-1},{edgeIndex:4,targetEdgeIndex:2,sign:-1},{edgeIndex:5,targetEdgeIndex:1,sign:-1}],t=S.build(6,4),n=S.getTilingFolds(t,e),r=Array.from({length:M},()=>new u),i=Array.from({length:M},()=>new u),a=Array.from({length:M},()=>new u),o=Array.from({length:M},()=>new u);for(let e=0;e<6;e++){let s=t.sideTests[e];r[e].set(s.a.re,s.b.re,s.c.re,s.d.re),i[e].set(s.a.im,s.b.im,s.c.im,s.d.im);let c=n[e];a[e].set(c.a.re,c.b.re,c.c.re,c.d.re),o[e].set(c.a.im,c.b.im,c.c.im,c.d.im)}this.shaderMaterial=new h({uniforms:{resolution:{value:new d},time:{value:0},u_sideCount:{value:6},u_T_re:{value:r},u_T_im:{value:i},u_g_re:{value:a},u_g_im:{value:o}},vertexShader:E,fragmentShader:D,side:2});let s=new _(2,2);this.scene.add(new l(s,this.shaderMaterial)),this.cleanUpTasks.push(()=>s.dispose()),this.cleanUpTasks.push(()=>this.shaderMaterial.dispose())}animate(){this.timer.update(),this.controls.update(),this.handleResize(),this.render()}render(){let e=this.timer.getElapsed();this.shaderMaterial.uniforms.time.value=e,this.renderer.render(this.scene,this.camera)}},P=n(),F=()=>{let e=(0,T.useRef)(null);return(0,T.useEffect)(()=>{if(!e.current)return;let t=new AbortController,n=new N(e.current);return n.init(t.signal),()=>{t.abort(),n.dispose()}},[]),(0,P.jsx)(`div`,{ref:e,style:{position:`relative`,width:`100%`,height:`100%`,overflow:`hidden`}})},I=()=>(0,P.jsxs)(s,{maxWidth:`xl`,children:[(0,P.jsx)(o,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,P.jsx)(a,{variant:`h2`,children:`Hyperbolic space`})}),(0,P.jsx)(o,{sx:{position:`relative`,width:`100%`,height:`600px`},children:(0,P.jsx)(F,{})}),(0,P.jsx)(i,{component:r,to:`/`,variant:`body1`,color:`primary`,children:`Back`})]});export{I as default};