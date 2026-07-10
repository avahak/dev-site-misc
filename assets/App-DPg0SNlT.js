import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{t as r}from"./Box-CFEfsCq7.js";import{a as i,i as a,r as o,t as s}from"./index-B4F24wVg.js";import{Br as c,Gn as l,H as u,Hr as d,L as f,O as p,Pt as m,Vr as h,Xn as g,Yt as _,Zt as v,cr as y,f as b,fn as x,it as S,p as C,pt as w,q as T,r as E,sr as D,tt as O,zt as k}from"./three.module-Dtgo5Ffh.js";import{t as A}from"./OrbitControls-DKC0dmvR.js";import{n as j,t as M}from"./ODESolver-B4yqZhAt.js";import{t as N}from"./lil-gui.module.min--1wMio4V.js";import{n as P,t as F}from"./font-CQ1yx8Qt.js";var I=e(t(),1),L=`precision highp float;\r
\r
uniform vec2 resolution;\r
uniform int useFisheye;\r
uniform float focalLength;\r
uniform int numSegments;\r
uniform sampler2D controlPointTexture;\r
uniform isampler2D indexTexture;\r
\r
out vec3 v_color;\r
\r
#define PI 3.14159265359\r
\r
// MAX_WIDTH has to match with value in uniformBSpline.ts\r
#define MAX_WIDTH 1024\r
\r
vec4 splineCoeffs(float t) {\r
    float s1 = 1.0 - t;\r
    float s2 = s1*s1;\r
    float s3 = s2*s1;\r
    float t2 = t*t;\r
    float t3 = t2*t;\r
    return vec4(s3, 3.0*t3-6.0*t2+4.0, 3.0*t2*s1+3.0*t+1.0, t3) / 6.0;\r
}\r
\r
vec3 fisheyeStereographic(vec3 p0) {\r
    float r0 = length(p0);\r
    float r0xy = length(p0.xy);\r
    float phi = 0.5 * atan(r0xy, -p0.z);\r
    vec3 p = r0 * vec3(2.0*focalLength * sin(phi)*p0.xy/r0xy, -cos(phi));\r
    return p;\r
    // Now r on image plane is c*|p.xy|/(-p.z) = c*2f*tan(phi) = c*2f*tan(theta/2), \r
    // i.e. r = c*2f tan(theta/2), which is the formula for fisheye lens \r
    // with stereographic projection.\r
}\r
\r
void main() {\r
    int vIndex = gl_VertexID;       // 0 or 1\r
    int iIndex = gl_InstanceID;\r
\r
    int i = iIndex / numSegments;\r
    int index = 2 * texelFetch(indexTexture, ivec2(i % MAX_WIDTH, i / MAX_WIDTH), 0).r;\r
\r
    vec3 p0 = texelFetch(controlPointTexture, ivec2(index % MAX_WIDTH, index / MAX_WIDTH), 0).rgb;\r
    vec3 c0 = texelFetch(controlPointTexture, ivec2((index+1) % MAX_WIDTH, (index+1) / MAX_WIDTH), 0).rgb;\r
    vec3 p1 = texelFetch(controlPointTexture, ivec2((index+2) % MAX_WIDTH, (index+2) / MAX_WIDTH), 0).rgb;\r
    vec3 c1 = texelFetch(controlPointTexture, ivec2((index+3) % MAX_WIDTH, (index+3) / MAX_WIDTH), 0).rgb;\r
    vec3 p2 = texelFetch(controlPointTexture, ivec2((index+4) % MAX_WIDTH, (index+4) / MAX_WIDTH), 0).rgb;\r
    vec3 c2 = texelFetch(controlPointTexture, ivec2((index+5) % MAX_WIDTH, (index+5) / MAX_WIDTH), 0).rgb;\r
    vec3 p3 = texelFetch(controlPointTexture, ivec2((index+6) % MAX_WIDTH, (index+6) / MAX_WIDTH), 0).rgb;\r
    vec3 c3 = texelFetch(controlPointTexture, ivec2((index+7) % MAX_WIDTH, (index+7) / MAX_WIDTH), 0).rgb;\r
\r
    float t = float((iIndex % numSegments) + vIndex) / float(numSegments);\r
    vec4 w = splineCoeffs(t);\r
\r
    vec3 p = w.x*p0 + w.y*p1 + w.z*p2 + w.w*p3;\r
    v_color = w.x*c0 + w.y*c1 + w.z*c2 + w.w*c3;\r
\r
    vec4 vPos = vec4(p, 1.0);\r
\r
    if (useFisheye == 0) {\r
        gl_Position = projectionMatrix * modelViewMatrix * vPos;\r
    } else {\r
        vec3 q = (modelViewMatrix * vPos).xyz;\r
        vec3 qFisheye = fisheyeStereographic(q);\r
        gl_Position = projectionMatrix * vec4(qFisheye, 1.0);\r
    }\r
}`,R=`precision highp float;\r
\r
in vec3 v_color;\r
\r
void main() {\r
    gl_FragColor = vec4(v_color, 1.0);\r
}`,z=class e{static{this.MAX_WIDTH=1024}constructor(e=16){this.numControlPoints=0,this.numIndexes=0,this.numSegments=e,this.shader=new y({uniforms:{resolution:{value:null},numSegments:{value:this.numSegments},controlPointTexture:{value:null},indexTexture:{value:null},useFisheye:{value:0},focalLength:{value:.5}},vertexShader:L,fragmentShader:R}),this.ibGeometry=new O,this.ibGeometry.setAttribute(`position`,new C(new Float32Array(6),3)),this.controlPointArray=new Float32Array,this.indexArray=new Int32Array,this.controlPointTexture=new p(this.controlPointArray,this.controlPointArray.length/4,1,x,u),this.indexTexture=new p(this.indexArray,this.indexArray.length,1,g,S),this.shader.uniforms.controlPointTexture.value=this.controlPointTexture,this.shader.uniforms.indexTexture.value=this.indexTexture,this.mesh=new w(this.ibGeometry,this.shader),this.mesh.frustumCulled=!1,this.reset()}addSpline(e,t,n=!1){if(e.length<4)throw Error(`Too few points to create spline, at least 4 are needed.`);let r=this.numControlPoints+e.length+(n?3:0),i=this.numIndexes+e.length+(n?0:-3);8*r>this.controlPointArray.length&&this.extendControlPointArray(8*r),i>this.indexArray.length&&this.extendIndexArray(i);for(let r=0;r<e.length+(n?3:0);r++){let i=r%e.length,a=e[i],o=t(i),s=8*this.numControlPoints;this.controlPointArray[s+0]=a.x,this.controlPointArray[s+1]=a.y,this.controlPointArray[s+2]=a.z,this.controlPointArray[s+4]=o[0],this.controlPointArray[s+5]=o[1],this.controlPointArray[s+6]=o[2],r<e.length+(n?0:-3)&&(this.indexArray[this.numIndexes]=this.numControlPoints,this.numIndexes+=1),this.numControlPoints+=1}this.ibGeometry.instanceCount=this.numIndexes*this.numSegments,this.controlPointTexture.needsUpdate=!0,this.indexTexture.needsUpdate=!0}extendControlPointArray(t){let n=new Float32Array(2**Math.ceil(Math.log2(t)));n.set(this.controlPointArray,0),this.controlPointArray=n,this.controlPointTexture.dispose();let r=this.controlPointArray.length/4;this.controlPointTexture=new p(this.controlPointArray,Math.min(r,e.MAX_WIDTH),Math.ceil(r/e.MAX_WIDTH),x,u),this.shader.uniforms.controlPointTexture.value=this.controlPointTexture}extendIndexArray(t){let n=new Int32Array(2**Math.ceil(Math.log2(t)));n.set(this.indexArray,0),this.indexArray=n,this.indexTexture.dispose(),this.indexTexture=new p(this.indexArray,Math.min(this.indexArray.length,e.MAX_WIDTH),Math.ceil(this.indexArray.length/e.MAX_WIDTH),g,S),this.shader.uniforms.indexTexture.value=this.indexTexture}reset(){this.numControlPoints=0,this.numIndexes=0,this.ibGeometry.instanceCount=0}getObject(){return this.mesh}dispose(){this.shader.dispose(),this.controlPointTexture.dispose(),this.indexTexture.dispose(),this.ibGeometry.dispose()}};function B(e){let t=e=>1-Math.sin(Math.PI*2*e)**2;return[t(3*e+42),t(2*e+51),t(e+73)]}var V=class{constructor(e){this.animationRequestID=null,this.lastTime=0,this.isStopped=!1,this.container=e,this.cleanUpTasks=[],this.renderer=new E({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),_.DEFAULT_UP.set(0,1,0),this.renderer.getContext().getExtension(`EXT_float_blend`),this.setupCamera(),this.setupScene(),this.setupResizeRenderer(),this.resizeRenderer(),this.createGUI(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID),this.splineGroup.dispose()}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let{clientWidth:e,clientHeight:t}=this.container;console.log(`Resize! (${e}, ${t})`),this.renderer.setSize(e,t);let n=e/t;this.camera instanceof v&&(this.camera.aspect=n,this.camera.updateProjectionMatrix())}setupResizeRenderer(){let e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container))}createGUI(){this.gui=new N({container:this.container}),this.container.style.position=`relative`,this.gui.domElement.style.position=`absolute`,this.gui.domElement.style.top=`0px`,this.gui.domElement.style.right=`0px`;let e={animateButton:()=>{let e=this.isStopped;this.isStopped=!1,this.animateStep(),this.isStopped=e},toggleStop:()=>{this.isStopped=!this.isStopped},focalLength:.5,useFisheye:!1};this.gui.add(e,`animateButton`).name(`Animate step`),this.gui.add(e,`toggleStop`).name(`Toggle stop/play`),this.gui.add(e,`useFisheye`).name(`Switch fisheye/rectilinear`).onChange(e=>{this.splineGroup.shader.uniforms.useFisheye.value=e?1:0}),this.gui.add(e,`focalLength`,.1,1).name(`Set focal length`).onChange(e=>{this.splineGroup.shader.uniforms.focalLength.value=e}),this.gui.close()}dispose(){this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.renderer.dispose(),this.gui.destroy()}setupCamera(){this.camera=new v,this.controls=new A(this.camera,this.renderer.domElement),this.camera.position.set(0,.2,1),this.camera.lookAt(new h(0,0,0)),this.controls.update()}fillSplineGroup1(e,t){t&&this.splineGroup.reset();for(let t=0;t<1e3;t++){let n=[],r=Math.floor(4+(1+Math.sin(-10*t))*50);for(let i=0;i<r;i++){let r=new h(Math.sin(i+e-10*t),Math.sin(i*3.15+2*e+100*t),Math.sin(i*2.1+3*e+51.2*t));r.normalize(),r.multiplyScalar(.3),n.push(r)}this.splineGroup.addSpline(n,e=>B(t+e/r))}}fillSplineGroup2(e,t){t&&this.splineGroup.reset();let n=.3,r=.2;for(let t=0;t<50;t++){let i=[];for(let a=0;a<50;a++){let o=.75*t,s=2*a,c=10*e,l=.0025*s+.04*Math.cos(5.2*o+.5*3.6*s+.1*c),u=.005*t+.05*Math.sin(7.3*o+.5*2.1*s+.2*c),d=.0202*(1.41*(o+1.1*c)+2.12*(5*s+3.5*c)),f=.0406*(.76*(o+2*c)+4.27*(5*s+3.6*c)),p=new h((n+r*Math.cos(u+f))*Math.cos(l+d),(n+r*Math.cos(u+f))*Math.sin(l+d),r*Math.sin(u+f));i.push(p)}this.splineGroup.addSpline(i,e=>B(.02*(t+e/50)))}}fillSplineGroup3(e,t,n){n&&this.splineGroup.reset();function r(e,t){let n=Math.sqrt(e.x*e.x+e.y*e.y),r=Math.sqrt((e.z+Math.sqrt(e.z*e.z+n*n))/2),i=n/(2*r),a=Math.atan2(e.y,e.x),o=t*2*Math.PI+a,s=t*2*Math.PI;return new d(r*Math.cos(o),r*Math.sin(o),i*Math.cos(s),i*Math.sin(s))}function i(e){let t=e.length();return Math.abs(t-1)>1e-9?null:new h(e.y/(1-e.x),e.z/(1-e.x),e.w/(1-e.x))}let a=2*Math.PI;if(t==0){let t=.98*Math.sin(10*e);for(let e=0;e<2;e++)for(let n=0;n<1;n+=1/100*(e==0?1:50)){let o=[];for(let s=0;s<1;s+=1/60){let c=Math.sqrt(1-t*t),l=n*a,u=i(r(new h(c*Math.cos(l),c*Math.sin(l),(2*e-1)*t),s));if(u==null)return;u.multiplyScalar(.2),o.push(u)}this.splineGroup.addSpline(o,t=>B(e*100+n),!0)}}else if(t==1)for(let t=0;t<20;t++){let n=t/20,o=[];for(let t=0;t<400;t++){let s=t/400,c=-.4+.5*Math.cos(.1*n*a+3*s*a+10*e),l=1*n*a+20*s*a,u=Math.sqrt(1-c*c),d=i(r(new h(u*Math.cos(l),u*Math.sin(l),c),s));if(d==null)return;d.multiplyScalar(.3),o.push(d)}this.splineGroup.addSpline(o,e=>B(400*n+e/400),!0)}else if(t==2)for(let t=0;t<4;t++){let n=t/4;for(let o=0;o<200;o++){let s=o/200,c=[];for(let o=0;o<10;o++){let l=o/10,u=-.1+.89*Math.cos(t*113%4/4*a+3*e),d=s*a,f=Math.sqrt(1-u*u),p=i(r(new h(f*Math.cos(d),f*Math.sin(d),u),.5*e+n+l/4));if(p==null)return;p.multiplyScalar(.1),c.push(p)}this.splineGroup.addSpline(c,e=>B(n+s))}}else if(t==3)for(let t=0;t<3;t++)for(let n=0;n<128;n++){let o=n/128,s=[];for(let n=0;n<64;n++){let c=n/64,l=[-.85,.1,.7][t],u=-.5+.7*o*a,d=Math.sqrt(1-l*l),f=i(r(new h(d*Math.cos(u),d*Math.sin(u),l),c));if(f==null)return;f.multiplyScalar(.2);let p=.05*Math.sin(30*e);s.push(new h(f.x,Math.cos(p)*f.y-Math.sin(p)*f.z,Math.sin(p)*f.y+Math.cos(p)*f.z))}this.splineGroup.addSpline(s,e=>B(o),!0)}}setupScene(){this.scene=new D,this.splineGroup=new z(32),this.fillSplineGroup3(0,3,!0),this.splineObject=this.splineGroup.getObject(),this.splineObject.setRotationFromAxisAngle(new h(0,0,1),Math.PI/2),this.scene.add(this.splineObject)}getResolution(){let{clientWidth:e,clientHeight:t}=this.container;return new c(e,t)}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep()}animateStep(){this.lastTime=(this.lastTime??0)+(this.isStopped?0:1);let e=this.lastTime*.001;this.splineObject.setRotationFromEuler(new f(.02*Math.sin(30*e),.02*Math.cos(30*e),Math.PI/2)),this.renderer.render(this.scene,this.camera)}},H=`// Vertex shader for tube parts of fat b-splines. Geometry is generated fully here.\r
precision highp float;\r
\r
uniform sampler2D controlPointTexture;\r
uniform isampler2D indexTexture;\r
uniform vec2 resolution;\r
uniform int uSegments;\r
uniform int vSegments;\r
uniform float minPixelRadius;\r
uniform int TEXTURE_WIDTH;\r
\r
out vec3 v_color;\r
\r
const float PI = 3.141592653589793;\r
const float PI_OVER_2 = 0.5*PI;\r
const float TAU = 2.0*PI;\r
\r
// For tangentDirection\r
const float EP = 1e-6;\r
const float RIGHT_ENDPOINT_START = 1.0 - 1e-5;\r
\r
const int LUT[6] = int[6](\r
    0, 2, 1,   // first tri\r
    0, 3, 2    // second tri\r
);\r
\r
vec3 eval(vec4 w, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {\r
    return w.x*p0 + w.y*p1 + w.z*p2 + w.w*p3;\r
}\r
\r
vec4 splineCoeffs(float t) {\r
    float s1 = 1.0 - t;\r
    float s2 = s1*s1;\r
    float s3 = s2*s1;\r
    float t2 = t*t;\r
    float t3 = t2*t;\r
    return vec4(s3, 3.0*t3 - 6.0*t2 + 4.0, 3.0*t2*s1 + 3.0*t + 1.0, t3) / 6.0;\r
}\r
\r
vec4 d1Coeffs(float t) {\r
    float s = 1.0 - t;\r
    float t2 = t * t;\r
    return vec4(-s*s, 3.0*t2 - 4.0*t, -3.0*t2 + 2.0*t + 1.0, t2) * 0.5;\r
}\r
\r
vec4 d2Coeffs(float t) {\r
    return vec4(1.0 - t, 3.0*t - 2.0, -3.0*t + 1.0, t);\r
}\r
\r
vec4 d3Coeffs() {\r
    return vec4(-1.0, 3.0, -3.0, 1.0);\r
}\r
\r
// In case that the derivative of the path is zero at one of the endpoints,\r
// we use higher order derivatives to suss out a meaningful tangent direction.\r
// NOTE This only helps at the endpoints and does not solve situations like \r
//      gamma(t)=(t*(1-t),0,0) at t=1/2. \r
// NOTE In practice we could also fall back from zero 1st derivative to\r
//      a basic finite difference test.\r
vec3 tangentDirection(float t, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {\r
    // 1st derivative\r
    vec3 v = eval(d1Coeffs(t), p0, p1, p2, p3);\r
    float len = length(v);\r
    if (len > EP) \r
        return v / len;\r
\r
    // 2nd derivative\r
    v = eval(d2Coeffs(t), p0, p1, p2, p3);\r
    len = length(v);\r
    if (len > EP) {\r
        // flip at right endpoint for even-order fallback\r
        vec3 v0 = v / len;\r
        return (t > RIGHT_ENDPOINT_START) ? -v0 : v0;\r
    }\r
\r
    // 3rd derivative (odd -> no flip)\r
    v = eval(d3Coeffs(), p0, p1, p2, p3);\r
    len = length(v);\r
    if (len > EP) \r
        return v / len;\r
\r
    // fully degenerate\r
    return vec3(1.0, 0.0, 0.0);\r
}\r
\r
vec3 buildNormal(vec3 T) {\r
    // NOTE: this has to match between caps and tube shaders\r
    vec3 ref = abs(T.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);\r
    return normalize(cross(T, ref));\r
}\r
\r
void main() {\r
    int instanceID = gl_InstanceID;\r
    int index = 2 * texelFetch(indexTexture, ivec2(instanceID % TEXTURE_WIDTH, instanceID / TEXTURE_WIDTH), 0).r;\r
\r
    // --- Control points and colors ---\r
    vec4 texel0 = texelFetch(controlPointTexture, ivec2(index % TEXTURE_WIDTH, index / TEXTURE_WIDTH), 0);\r
    vec4 texel1 = texelFetch(controlPointTexture, ivec2((index+1) % TEXTURE_WIDTH, (index+1) / TEXTURE_WIDTH), 0);\r
    vec4 texel2 = texelFetch(controlPointTexture, ivec2((index+2) % TEXTURE_WIDTH, (index+2) / TEXTURE_WIDTH), 0);\r
    vec4 texel3 = texelFetch(controlPointTexture, ivec2((index+3) % TEXTURE_WIDTH, (index+3) / TEXTURE_WIDTH), 0);\r
    vec4 texel4 = texelFetch(controlPointTexture, ivec2((index+4) % TEXTURE_WIDTH, (index+4) / TEXTURE_WIDTH), 0);\r
    vec4 texel5 = texelFetch(controlPointTexture, ivec2((index+5) % TEXTURE_WIDTH, (index+5) / TEXTURE_WIDTH), 0);\r
    vec4 texel6 = texelFetch(controlPointTexture, ivec2((index+6) % TEXTURE_WIDTH, (index+6) / TEXTURE_WIDTH), 0);\r
    vec4 texel7 = texelFetch(controlPointTexture, ivec2((index+7) % TEXTURE_WIDTH, (index+7) / TEXTURE_WIDTH), 0);\r
\r
    vec3 p0 = texel0.rgb;\r
    vec3 p1 = texel2.rgb;\r
    vec3 p2 = texel4.rgb;\r
    vec3 p3 = texel6.rgb;\r
\r
    vec3 c0 = texel1.rgb;\r
    vec3 c1 = texel3.rgb;\r
    vec3 c2 = texel5.rgb;\r
    vec3 c3 = texel7.rgb;\r
\r
    vec4 worldRadii = vec4(texel0.a, texel2.a, texel4.a, texel6.a);\r
    vec4 maxPixelRadii = vec4(texel1.a, texel3.a, texel5.a, texel7.a);\r
\r
    // --- Topology ---\r
    int tri  = gl_VertexID / 3;\r
    int vert = gl_VertexID % 3;\r
\r
    int quad = tri >> 1;\r
    int u = quad / vSegments;\r
    int v = quad % vSegments;\r
\r
    ivec2 quadCorners[4] = ivec2[4](\r
        ivec2(u, v),\r
        ivec2(u + 1, v),\r
        ivec2(u + 1, (v + 1) % vSegments),\r
        ivec2(u, (v + 1) % vSegments)\r
    );\r
\r
    int cornerIndex = LUT[(tri & 1) * 3 + vert];\r
    ivec2 uv = quadCorners[cornerIndex];\r
\r
    float fu = float(uv.x) / float(uSegments);\r
    float fv = float(uv.y) / float(vSegments) * TAU;\r
\r
    // --- Spline evaluation ---\r
    vec4 w = splineCoeffs(fu);\r
\r
    v_color = w.x*c0 + w.y*c1 + w.z*c2 + w.w*c3;\r
\r
    vec3 center = w.x*p0 + w.y*p1 + w.z*p2 + w.w*p3;\r
    vec3 T = tangentDirection(fu, p0, p1, p2, p3);\r
    vec3 T0 = tangentDirection(0.0, p0, p1, p2, p3);\r
    vec3 T1 = tangentDirection(1.0, p0, p1, p2, p3);\r
    vec3 N0 = buildNormal(T0);\r
    vec3 N1 = buildNormal(T1);\r
\r
    float angle = acos(clamp(dot(N0, N1), -1.0, 1.0));\r
    float s = sin(angle);\r
    vec3 N = N0;\r
    if (s > 1e-5) {\r
        float w0 = sin((1.0 - fu) * angle) / s;\r
        float w1 = sin(fu * angle) / s;\r
        N = normalize(w0 * N0 + w1 * N1);\r
    }\r
    N = normalize(N - T * dot(T, N));\r
    vec3 B = cross(T, N);\r
\r
    // --- Radius (screen-space capped) ---\r
    float worldRadius = dot(w, worldRadii);\r
    vec2 pixelRadiusBounds = vec2(minPixelRadius, dot(w, maxPixelRadii));\r
    vec3 viewPos = (modelViewMatrix * vec4(center, 1.0)).xyz;\r
    vec2 worldRadiusBounds = (pixelRadiusBounds * 2.0 / resolution.y) * (-viewPos.z) / projectionMatrix[1][1];\r
    // Not using clamp here to make sure lower bound dominates\r
    float r = max(min(worldRadius, worldRadiusBounds.y), worldRadiusBounds.x);  \r
\r
    // --- Vertex position ---\r
    vec3 offset = cos(fv) * N + sin(fv) * B;\r
    vec3 pos = center + r * offset;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\r
}`,U=`// Vertex shader for endcap parts of fat b-splines. Geometry is generated fully here.\r
precision highp float;\r
\r
uniform sampler2D controlPointTexture;\r
uniform isampler2D capDataTexture;\r
uniform vec2 resolution;\r
uniform int vSegments;\r
uniform float minPixelRadius;\r
uniform int TEXTURE_WIDTH;\r
\r
out vec3 v_color;\r
\r
const float PI = 3.141592653589793;\r
const float PI_OVER_2 = 0.5*PI;\r
const float TAU = 2.0*PI;\r
\r
// For tangentDirection\r
const float EP = 1e-6;\r
const float RIGHT_ENDPOINT_START = 1.0 - 1e-5;\r
\r
const int LUT[12] = int[12](\r
    0, 2, 1,    // first tri, side = 0\r
    0, 1, 2,    // first tri, side = 1\r
    0, 3, 2,    // second tri, side = 0\r
    0, 2, 3     // second tri, side = 1\r
);\r
\r
vec3 eval(vec4 w, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {\r
    return w.x*p0 + w.y*p1 + w.z*p2 + w.w*p3;\r
}\r
\r
vec4 splineCoeffs(float t) {\r
    float s1 = 1.0 - t;\r
    float s2 = s1*s1;\r
    float s3 = s2*s1;\r
    float t2 = t*t;\r
    float t3 = t2*t;\r
    return vec4(s3, 3.0*t3 - 6.0*t2 + 4.0, 3.0*t2*s1 + 3.0*t + 1.0, t3) / 6.0;\r
}\r
\r
vec4 d1Coeffs(float t) {\r
    float s = 1.0 - t;\r
    float t2 = t * t;\r
    return vec4(-s*s, 3.0*t2 - 4.0*t, -3.0*t2 + 2.0*t + 1.0, t2) * 0.5;\r
}\r
\r
vec4 d2Coeffs(float t) {\r
    return vec4(1.0 - t, 3.0*t - 2.0, -3.0*t + 1.0, t);\r
}\r
\r
vec4 d3Coeffs() {\r
    return vec4(-1.0, 3.0, -3.0, 1.0);\r
}\r
\r
// In case that the derivative of the path is zero at one of the endpoints,\r
// we use higher order derivatives to suss out the tangent direction.\r
// NOTE In practice we could also fall back from zero 1st derivative to\r
//      a basic finite difference test.\r
// NOTE This only helps at the ends and does not solve situations like \r
//      gamma(t)=(t*(1-t),0,0) at t=1/2. \r
vec3 tangentDirection(float t, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {\r
    // 1st derivative\r
    vec3 v = eval(d1Coeffs(t), p0, p1, p2, p3);\r
    float len = length(v);\r
    if (len > EP) \r
        return v / len;\r
\r
    // 2nd derivative\r
    v = eval(d2Coeffs(t), p0, p1, p2, p3);\r
    len = length(v);\r
    if (len > EP) {\r
        // flip at right endpoint for even-order fallback\r
        vec3 v0 = v / len;\r
        return (t > RIGHT_ENDPOINT_START) ? -v0 : v0;\r
    }\r
\r
    // 3rd derivative (odd -> no flip)\r
    v = eval(d3Coeffs(), p0, p1, p2, p3);\r
    len = length(v);\r
    if (len > EP) \r
        return v / len;\r
\r
    // fully degenerate\r
    return vec3(1.0, 0.0, 0.0);\r
}\r
\r
vec3 buildNormal(vec3 T) {\r
    // NOTE: this has to match between caps and tube shaders\r
    vec3 ref = abs(T.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);\r
    return normalize(cross(T, ref));\r
}\r
\r
void main() {\r
    int instanceID = gl_InstanceID;\r
    ivec2 capDataCoord = ivec2(instanceID % TEXTURE_WIDTH, instanceID / TEXTURE_WIDTH);\r
    ivec2 data = texelFetch(capDataTexture, capDataCoord, 0).rg;\r
\r
    int index = 2 * data.r;\r
    int side = data.g;\r
\r
    // --- Control points and colors ---\r
    vec4 texel0 = texelFetch(controlPointTexture, ivec2(index % TEXTURE_WIDTH, index / TEXTURE_WIDTH), 0);\r
    vec4 texel1 = texelFetch(controlPointTexture, ivec2((index+1) % TEXTURE_WIDTH, (index+1) / TEXTURE_WIDTH), 0);\r
    vec4 texel2 = texelFetch(controlPointTexture, ivec2((index+2) % TEXTURE_WIDTH, (index+2) / TEXTURE_WIDTH), 0);\r
    vec4 texel3 = texelFetch(controlPointTexture, ivec2((index+3) % TEXTURE_WIDTH, (index+3) / TEXTURE_WIDTH), 0);\r
    vec4 texel4 = texelFetch(controlPointTexture, ivec2((index+4) % TEXTURE_WIDTH, (index+4) / TEXTURE_WIDTH), 0);\r
    vec4 texel5 = texelFetch(controlPointTexture, ivec2((index+5) % TEXTURE_WIDTH, (index+5) / TEXTURE_WIDTH), 0);\r
    vec4 texel6 = texelFetch(controlPointTexture, ivec2((index+6) % TEXTURE_WIDTH, (index+6) / TEXTURE_WIDTH), 0);\r
    vec4 texel7 = texelFetch(controlPointTexture, ivec2((index+7) % TEXTURE_WIDTH, (index+7) / TEXTURE_WIDTH), 0);\r
\r
    vec3 p0 = texel0.rgb;\r
    vec3 p1 = texel2.rgb;\r
    vec3 p2 = texel4.rgb;\r
    vec3 p3 = texel6.rgb;\r
\r
    vec3 c0 = texel1.rgb;\r
    vec3 c1 = texel3.rgb;\r
    vec3 c2 = texel5.rgb;\r
    vec3 c3 = texel7.rgb;\r
\r
    vec4 worldRadii = vec4(texel0.a, texel2.a, texel4.a, texel6.a);\r
    vec4 maxPixelRadii = vec4(texel1.a, texel3.a, texel5.a, texel7.a);\r
\r
    // --- Topology ---\r
    int tri = gl_VertexID / 3;\r
    int vert = gl_VertexID % 3;\r
\r
    int quad = tri >> 1;\r
    int secondTri = tri & 1;\r
\r
    int u = quad / vSegments;\r
    int v = quad % vSegments;\r
\r
    ivec2 quadCorners[4] = ivec2[4](\r
        ivec2(u, v),\r
        ivec2(u + 1, v),\r
        ivec2(u + 1, (v + 1) % vSegments),\r
        ivec2(u, (v + 1) % vSegments)\r
    );\r
\r
    int cornerIndex = LUT[((secondTri << 1) | side) * 3 + vert];\r
    ivec2 uv = quadCorners[cornerIndex];\r
\r
    float lat = float(uv.x) / float(vSegments) * PI_OVER_2;\r
    float lon = float(uv.y) / float(vSegments) * TAU;\r
\r
    // --- Endpoint ---\r
    vec4 w = (side == 0) \r
        ? vec4(1.0, 4.0, 1.0, 0.0) / 6.0    // splineCoeffs(0.0)\r
        : vec4(0.0, 1.0, 4.0, 1.0) / 6.0;   // splineCoeffs(1.0)\r
\r
    v_color = w.x*c0 + w.y*c1 + w.z*c2 + w.w*c3;\r
\r
    vec3 center = w.x*p0 + w.y*p1 + w.z*p2 + w.w*p3;\r
\r
    // --- Hemisphere position ---\r
    vec3 T = tangentDirection((side == 0) ? 0.0 : 1.0, p0, p1, p2, p3);\r
    vec3 N = buildNormal(T);\r
    vec3 B = cross(T, N);\r
\r
    vec3 radial = cos(lon) * N + sin(lon) * B;\r
\r
    vec3 dir = (side == 0)\r
        ? (sin(lat) * radial - cos(lat) * T)\r
        : (sin(lat) * radial + cos(lat) * T);\r
\r
    // --- Radius (screen-space capped) ---\r
    float worldRadius = dot(w, worldRadii);\r
    vec2 pixelRadiusBounds = vec2(minPixelRadius, dot(w, maxPixelRadii));\r
    vec3 viewPos = (modelViewMatrix * vec4(center, 1.0)).xyz;\r
    vec2 worldRadiusBounds = (pixelRadiusBounds * 2.0 / resolution.y) * (-viewPos.z) / projectionMatrix[1][1];\r
    // Not using clamp here to make sure lower bound dominates\r
    float r = max(min(worldRadius, worldRadiusBounds.y), worldRadiusBounds.x);  \r
\r
    vec3 pos = center + r * dir;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\r
}`,W=class e{static{this.TEXTURE_WIDTH=1024}constructor(t=16,n=8,r=.5){this.numControlPoints=0,this.numIndexes=0,this.numCaps=0,this.numSegments=t,this.tubeShader=new y({uniforms:{controlPointTexture:{value:null},indexTexture:{value:null},TEXTURE_WIDTH:{value:e.TEXTURE_WIDTH},resolution:{value:new c},uSegments:{value:this.numSegments},vSegments:{value:n},minPixelRadius:{value:r}},vertexShader:H,fragmentShader:R,depthWrite:!0,depthTest:!0}),this.capShader=new y({uniforms:{controlPointTexture:{value:null},capDataTexture:{value:null},TEXTURE_WIDTH:{value:e.TEXTURE_WIDTH},resolution:{value:new c},vSegments:{value:n},minPixelRadius:{value:r}},vertexShader:U,fragmentShader:R,depthWrite:!0,depthTest:!0}),this.tubeGeometry=this.createInstancedGeometry(this.numSegments*n*6),this.capGeometry=this.createInstancedGeometry(n*n*6),this.controlPointArray=new Float32Array,this.indexArray=new Int32Array,this.capDataArray=new Int32Array,this.controlPointTexture=new p(this.controlPointArray,1,1,x,u),this.indexTexture=new p(this.indexArray,1,1,g,S),this.capDataTexture=new p(this.capDataArray,1,1,l,S),this.tubeShader.uniforms.controlPointTexture.value=this.controlPointTexture,this.tubeShader.uniforms.indexTexture.value=this.indexTexture,this.capShader.uniforms.controlPointTexture.value=this.controlPointTexture,this.capShader.uniforms.capDataTexture.value=this.capDataTexture;let i=new m(this.tubeGeometry,this.tubeShader);i.frustumCulled=!1;let a=new m(this.capGeometry,this.capShader);a.frustumCulled=!1,this.group=new T,this.group.add(i),this.group.add(a),this.reset()}createInstancedGeometry(e){let t=new O,n=new Float32Array(e*3);return t.setAttribute(`position`,new C(n,3)),t}setResolution(e){e.getDrawingBufferSize(this.tubeShader.uniforms.resolution.value),e.getDrawingBufferSize(this.capShader.uniforms.resolution.value)}addSpline(e,t,n,r=!1,i=!1,a=!1){if(e.length<4)throw Error(`At least 4 control points required.`);let o=this.numIndexes,s=this.numControlPoints+e.length+(r?3:0),c=this.numIndexes+e.length+(r?0:-3);this.ensureCapacityControlPointArray(8*s),this.ensureCapacityIndexArray(c);for(let i=0;i<e.length+(r?3:0);i++){let a=i%e.length,o=e[a],s=t(a),c=n(a),l=8*this.numControlPoints;this.controlPointArray[l+0]=o.x,this.controlPointArray[l+1]=o.y,this.controlPointArray[l+2]=o.z,this.controlPointArray[l+3]=c[0],this.controlPointArray[l+4]=s[0],this.controlPointArray[l+5]=s[1],this.controlPointArray[l+6]=s[2],this.controlPointArray[l+7]=c[1],i<e.length+(r?0:-3)&&(this.indexArray[this.numIndexes++]=this.numControlPoints),this.numControlPoints++}this.tubeGeometry.instanceCount=this.numIndexes,this.controlPointTexture.needsUpdate=!0,this.indexTexture.needsUpdate=!0,r||(i&&this.addCapInstance(o,0),a&&this.addCapInstance(this.numIndexes-1,1))}addCapInstance(e,t){this.ensureCapacityCapDataArray(2*this.numCaps+2),this.capDataArray[2*this.numCaps]=this.indexArray[e],this.capDataArray[2*this.numCaps+1]=t,this.numCaps++,this.capGeometry.instanceCount=this.numCaps,this.capDataTexture.needsUpdate=!0}growArray(e,t){let n=2**Math.ceil(Math.log2(t)),r=new e.constructor(n);return r.set(e,0),r}ensureCapacityControlPointArray(t){if(t<=this.controlPointArray.length)return;this.controlPointArray=this.growArray(this.controlPointArray,t),this.controlPointTexture.dispose();let n=this.controlPointArray.length/4;this.controlPointTexture=new p(this.controlPointArray,Math.min(n,e.TEXTURE_WIDTH),Math.ceil(n/e.TEXTURE_WIDTH),x,u),this.tubeShader.uniforms.controlPointTexture.value=this.controlPointTexture,this.capShader.uniforms.controlPointTexture.value=this.controlPointTexture}ensureCapacityIndexArray(t){if(t<=this.indexArray.length)return;this.indexArray=this.growArray(this.indexArray,t),this.indexTexture.dispose();let n=this.indexArray.length;this.indexTexture=new p(this.indexArray,Math.min(n,e.TEXTURE_WIDTH),Math.ceil(n/e.TEXTURE_WIDTH),g,S),this.tubeShader.uniforms.indexTexture.value=this.indexTexture}ensureCapacityCapDataArray(t){if(t<=this.capDataArray.length)return;this.capDataArray=this.growArray(this.capDataArray,t),this.capDataTexture.dispose();let n=this.capDataArray.length/2;this.capDataTexture=new p(this.capDataArray,Math.min(n,e.TEXTURE_WIDTH),Math.ceil(n/e.TEXTURE_WIDTH),l,S),this.capShader.uniforms.capDataTexture.value=this.capDataTexture}reset(){this.numControlPoints=0,this.numIndexes=0,this.numCaps=0,this.tubeGeometry.instanceCount=0,this.capGeometry.instanceCount=0}getObject(){return this.group}dispose(){this.tubeShader.dispose(),this.capShader.dispose(),this.controlPointTexture.dispose(),this.indexTexture.dispose(),this.capDataTexture.dispose(),this.tubeGeometry.dispose(),this.capGeometry.dispose()}};function G(e){let t=e=>1-Math.sin(Math.PI*2*e)**2;return[t(3*e+42),t(2*e+51),t(e+73)]}function K(e){let t=e=>1-Math.sin(Math.PI*2*e)**2;return[t(3*e+42)*.25,t(2*e+51)*.25,t(e+73)]}function q(e){let t=e=>Math.abs(Math.sin(e)*43758.5453)%1,n=t(e)*t(e+1)*t(e+2);return[.02*n,10*n]}var J=class{constructor(e){this.animationRequestID=null,this.lastTime=0,this.isStopped=!1,this.container=e,this.cleanUpTasks=[],this.renderer=new E({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),_.DEFAULT_UP.set(0,1,0),this.renderer.getContext().getExtension(`EXT_float_blend`),this.setupCamera(),this.setupScene(),this.setupResizeRenderer(),this.resizeRenderer(),this.createGUI(),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let{clientWidth:e,clientHeight:t}=this.container;console.log(`Resize! (${e}, ${t})`),this.renderer.setSize(e,t);let n=e/t;this.camera instanceof v&&(this.camera.aspect=n,this.camera.updateProjectionMatrix()),this.splineGroup.setResolution(this.renderer)}setupResizeRenderer(){let e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container))}createGUI(){this.gui=new N({container:this.container}),this.container.style.position=`relative`,this.gui.domElement.style.position=`absolute`,this.gui.domElement.style.top=`0px`,this.gui.domElement.style.right=`0px`;let e={animateButton:()=>{let e=this.isStopped;this.isStopped=!1,this.animateStep(),this.isStopped=e},toggleStop:()=>{this.isStopped=!this.isStopped}};this.gui.add(e,`animateButton`).name(`Animate step`),this.gui.add(e,`toggleStop`).name(`Toggle stop/play`),this.gui.close()}dispose(){this.animationRequestID!==null&&cancelAnimationFrame(this.animationRequestID),this.splineGroup.dispose(),this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.renderer.dispose(),this.gui.destroy()}setupCamera(){this.camera=new v,this.controls=new A(this.camera,this.renderer.domElement),this.camera.position.set(0,0,1),this.camera.lookAt(new h(0,0,0)),this.controls.update()}fillSplineGroup1(e,t){t&&this.splineGroup.reset();for(let t=0;t<10;t++){let n=[],r=Math.floor(4+(1+Math.sin(-10*t))*50);for(let i=0;i<r;i++){let r=new h(Math.sin(i+e-10*t),Math.sin(i*3.15+2*e+100*t),Math.sin(i*2.1+3*e+51.2*t));r.normalize(),r.multiplyScalar(.3),n.push(r)}this.splineGroup.addSpline(n,e=>K(t+e/r),e=>q(e),!1,!0,!0)}}fillSplineGroup2(e,t){t&&this.splineGroup.reset();let n=.3,r=.2,[i,a]=[50,12];for(let t=0;t<i;t++){let o=[];for(let i=0;i<a;i++){let a=.75*t,s=2*i,c=10*e,l=.0025*s+.04*Math.cos(5.2*a+.5*3.6*s+.1*c),u=.005*t+.05*Math.sin(7.3*a+.5*2.1*s+.2*c),d=.0202*(1.41*(a+1.1*c)+2.12*(5*s+3.5*c)),f=.0406*(.76*(a+2*c)+4.27*(5*s+3.6*c)),p=new h((n+r*Math.cos(u+f))*Math.cos(l+d),(n+r*Math.cos(u+f))*Math.sin(l+d),r*Math.sin(u+f));o.push(p)}this.splineGroup.addSpline(o,e=>G(.02*(t+e/i)),e=>q(e+t),!1,!0,!0)}}fillSplineGroup3(e,t,n){n&&this.splineGroup.reset();function r(e,t){let n=Math.sqrt(e.x*e.x+e.y*e.y),r=Math.sqrt((e.z+Math.sqrt(e.z*e.z+n*n))/2),i=n/(2*r),a=Math.atan2(e.y,e.x),o=t*2*Math.PI+a,s=t*2*Math.PI;return new d(r*Math.cos(o),r*Math.sin(o),i*Math.cos(s),i*Math.sin(s))}function i(e){let t=e.length();return Math.abs(t-1)>1e-9?null:new h(e.y/(1-e.x),e.z/(1-e.x),e.w/(1-e.x))}let a=2*Math.PI;if(t==0){let t=.98*Math.sin(10*e);for(let e=0;e<2;e++)for(let n=0;n<1;n+=1/100*(e==0?1:50)){let o=[];for(let s=0;s<1;s+=1/60){let c=Math.sqrt(1-t*t),l=n*a,u=i(r(new h(c*Math.cos(l),c*Math.sin(l),(2*e-1)*t),s));if(u==null)return;u.multiplyScalar(.2),o.push(u)}this.splineGroup.addSpline(o,t=>G(e*100+n),e=>q(e),!1,!1)}}else if(t==1)for(let t=0;t<20;t++){let n=t/20,o=[];for(let t=0;t<400;t++){let s=t/400,c=-.4+.5*Math.cos(.1*n*a+3*s*a+10*e),l=1*n*a+20*s*a,u=Math.sqrt(1-c*c),d=i(r(new h(u*Math.cos(l),u*Math.sin(l),c),s));if(d==null)return;d.multiplyScalar(.3),o.push(d)}this.splineGroup.addSpline(o,e=>G(400*n+e/400),e=>q(e),!0,!1,!1)}else if(t==2)for(let t=0;t<4;t++){let n=t/4;for(let o=0;o<200;o++){let s=o/200,c=[];for(let o=0;o<10;o++){let l=o/10,u=-.1+.89*Math.cos(t*113%4/4*a+3*e),d=s*a,f=Math.sqrt(1-u*u),p=i(r(new h(f*Math.cos(d),f*Math.sin(d),u),.5*e+n+l/4));if(p==null)return;p.multiplyScalar(.1),c.push(p)}this.splineGroup.addSpline(c,e=>G(n+s),e=>q(e),!0,!1,!1)}}else if(t==3)for(let t=0;t<3;t++)for(let n=0;n<128;n++){let o=n/128,s=[];for(let n=0;n<64;n++){let c=n/64,l=[-.85,.1,.7][t],u=-.5+.7*o*a,d=Math.sqrt(1-l*l),f=i(r(new h(d*Math.cos(u),d*Math.sin(u),l),c));if(f==null)return;f.multiplyScalar(.2);let p=.05*Math.sin(30*e);s.push(new h(f.x,Math.cos(p)*f.y-Math.sin(p)*f.z,Math.sin(p)*f.y+Math.cos(p)*f.z))}this.splineGroup.addSpline(s,e=>G(o),e=>q(e),!0,!1,!1)}}setupScene(){this.scene=new D,this.splineGroup=new W(32),this.fillSplineGroup3(0,3,!0),this.splineObject=this.splineGroup.getObject(),this.splineObject.setRotationFromAxisAngle(new h(0,0,1),Math.PI/2),this.scene.add(this.splineObject)}getResolution(){let{clientWidth:e,clientHeight:t}=this.container;return new c(e,t)}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep()}animateStep(){this.lastTime=(this.lastTime??0)+(this.isStopped?0:1);let e=this.lastTime*.001;this.fillSplineGroup1(.1*e,!0),this.fillSplineGroup2(e,!1),this.splineObject.setRotationFromEuler(new f(.02*Math.sin(30*e),.02*Math.cos(30*e),Math.PI/2)),this.renderer.render(this.scene,this.camera)}};function Y(e,t){let n=.087,r=t[0],i=t[1],a=t[2];return[Math.sin(i)-n*r,Math.sin(a)-n*i,Math.sin(r)-n*a]}function X(e,t){let n=t[0],r=t[1],i=t[2];return[3*n*(1-r)-2.2*i,-1*r*(1-n*n),.001*n]}var Z={Euler:M.EULER,Midpoint:M.MIDPOINT,Heun:M.HEUN,RK4:M.RK4,RKF45:M.RKF45,RKDP:M.RKDP},Q=new Set([`Heun`,`RKF45`,`RKDP`]),ee=class{constructor(e){this.animationRequestID=null,this.lastTime=0,this.isStopped=!1,this.currentSystem=`bouali`,this.t0=0,this.t1=500,this.atol=1e-9,this.rtol=1e-7,this.stepNum=1e4,this.adaptive=!0,this.methodName=`RKDP`,this.container=e,this.cleanUpTasks=[],this.renderer=new E({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),_.DEFAULT_UP.set(0,1,0),this.renderer.getContext().getExtension(`EXT_float_blend`),this.setupCamera(),this.setupScene(),this.setupResizeRenderer(),this.resizeRenderer(),this.createGUI(),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t);let n=e/t;this.camera instanceof v&&(this.camera.aspect=n,this.camera.updateProjectionMatrix()),this.splineGroup?.setResolution(this.renderer)}setupResizeRenderer(){let e=new ResizeObserver(()=>this.resizeRenderer());e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container))}createGUI(){this.gui=new N({container:this.container}),this.container.style.position=`relative`,this.gui.domElement.style.position=`absolute`,this.gui.domElement.style.top=`0px`,this.gui.domElement.style.right=`0px`;let e={system:this.currentSystem,method:this.methodName,adaptive:this.adaptive,t_end:this.t1,steps_log:Math.log10(this.stepNum),atol_log:Math.log10(this.atol),rtol_log:Math.log10(this.rtol),recompute:()=>this.computeAndDisplaySpline()};this.gui.add(e,`system`,[`thomas`,`bouali`]).name(`System`).onChange(e=>{this.currentSystem=e,this.computeAndDisplaySpline()});let t=this.gui.add(e,`method`,Object.keys(Z)).name(`Integrator`).onChange(t=>{this.methodName=t;let r=Q.has(t);this.adaptive&&!r&&(this.adaptive=!1,e.adaptive=!1,n.setValue(!1)),n.disable(!r),this.updateGUIVisibility(),this.computeAndDisplaySpline()}),n=this.gui.add(e,`adaptive`).name(`Adaptive step`).onChange(t=>{if(t&&!Q.has(this.methodName)){console.warn(`${this.methodName} does not support adaptive stepping. Keeping fixed step.`),e.adaptive=!1,n.setValue(!1);return}this.adaptive=t,this.updateGUIVisibility(),this.computeAndDisplaySpline()});n.disable(!Q.has(this.methodName)),this.gui.add(e,`t_end`,100,1e4,10).name(`End time (t1)`).onChange(e=>{this.t1=e,this.computeAndDisplaySpline()});let r=this.gui.add(e,`steps_log`,2,6,.05).name(`log10(steps)`).onChange(e=>{this.stepNum=Math.floor(10**e),this.adaptive||this.computeAndDisplaySpline()});r.disable(this.adaptive);let i=this.gui.add(e,`atol_log`,-12,-3,.1).name(`log10(atol)`).onChange(e=>{this.atol=10**e,this.adaptive&&this.computeAndDisplaySpline()}),a=this.gui.add(e,`rtol_log`,-12,-3,.1).name(`log10(rtol)`).onChange(e=>{this.rtol=10**e,this.adaptive&&this.computeAndDisplaySpline()});i.disable(!this.adaptive),a.disable(!this.adaptive),this.gui.add(e,`recompute`).name(`Recompute trajectory`);let o=this.gui.addFolder(`Animation`);o.open(),o.add({animateButton:()=>{let e=this.isStopped;this.isStopped=!1,this.animateStep(),this.isStopped=e}},`animateButton`).name(`Animate step`),o.add({toggleStop:()=>{this.isStopped=!this.isStopped}},`toggleStop`).name(`Toggle stop/play`),this.adaptiveControllers={stepsCtrl:r,atolCtrl:i,rtolCtrl:a,adaptiveCtrl:n,methodCtrl:t},this.updateGUIVisibility(),this.gui.close()}updateGUIVisibility(){if(!this.adaptiveControllers)return;let{stepsCtrl:e,atolCtrl:t,rtolCtrl:n}=this.adaptiveControllers;e.disable(this.adaptive),t.disable(!this.adaptive),n.disable(!this.adaptive)}dispose(){this.animationRequestID!==null&&cancelAnimationFrame(this.animationRequestID),this.splineGroup?.dispose(),this.container.removeChild(this.renderer.domElement),this.cleanUpTasks.forEach(e=>e()),this.renderer.dispose(),this.gui.destroy()}setupCamera(){this.camera=new v(45,1,.1,1e3),this.controls=new A(this.camera,this.renderer.domElement),this.camera.position.set(2,2,3),this.camera.lookAt(0,0,0),this.controls.update()}setupScene(){this.scene=new D,this.splineGroup=new W(8,6),this.splineObject=this.splineGroup.getObject(),this.scene.add(this.splineObject),this.computeAndDisplaySpline()}computeAndDisplaySpline(){let e,t,n=[1,1,1];this.currentSystem===`thomas`?(e=Y,t=[-.1,.1,.1],n=[.4,.4,.4]):(e=X,t=[1,1,0],n=[.3,.3,10]);let r=Z[this.methodName];if(!r){console.error(`Unknown method: ${this.methodName}`);return}let i=new j(e,r),a=[];if(this.adaptive)if(r.vb2)try{a=i.adaptiveSolve(t,this.t0,this.t1,this.atol,this.rtol).ys.map(e=>new h(e[0]*n[0],e[1]*n[1],e[2]*n[2]))}catch(e){console.error(`Adaptive integration failed:`,e);return}else{console.error(`${this.methodName} does not support adaptive stepping. Falling back to fixed step.`);let e=Math.max(1e3,Math.floor((this.t1-this.t0)/.05)),r=(this.t1-this.t0)/e,o=t,s=this.t0,c=[];for(let t=0;t<=e;t++)c.push(new h(o[0]*n[0],o[1]*n[1],o[2]*n[2])),t<e&&(o=i.step(o,s,s+r),s+=r);a=c}else{let e=(this.t1-this.t0)/this.stepNum,r=t,o=this.t0,s=[];for(let t=0;t<=this.stepNum;t++)s.push(new h(r[0]*n[0],r[1]*n[1],r[2]*n[2])),t<this.stepNum&&(r=i.step(r,o,o+e),o+=e);a=s}if(a.length===0)return;this.splineGroup.reset();let o=a.length;this.splineGroup.addSpline(a,e=>[1/10*e%1,.5,.8],e=>[.002,3],!1,!0,!0),console.log(`ODE solved with ${o} points, t_end = ${this.t1}, method=${this.methodName}, adaptive=${this.adaptive}`)}getResolution(){return new c(this.container.clientWidth,this.container.clientHeight)}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep()}animateStep(){this.lastTime=(this.lastTime??0)+(this.isStopped?0:1);let e=this.lastTime*.001;this.splineObject.setRotationFromEuler(new f(.02*Math.sin(30*e),.02*Math.cos(30*e),Math.PI/2)),this.renderer.render(this.scene,this.camera)}},te=class{constructor(e,t,n,r){this.animationRequestID=null,this.lastTime=0,this.isStopped=!1,this.textGroups=[],this.container=e,this.font1=t,this.font2=n,this.sampleText=r,this.cleanUpTasks=[],this.renderer=new E({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),_.DEFAULT_UP.set(0,1,0),this.renderer.getContext().getExtension(`EXT_float_blend`),this.setupCamera(),this.setupScene(),this.setupResizeRenderer(),this.resizeRenderer(),this.createGUI(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let{clientWidth:e,clientHeight:t}=this.container;console.log(`Resize! (${e}, ${t})`),this.renderer.setSize(e,t);let n=e/t;this.camera instanceof v&&(this.camera.aspect=n,this.camera.updateProjectionMatrix())}setupResizeRenderer(){let e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container))}createGUI(){this.gui=new N({container:this.container}),this.container.style.position=`relative`,this.gui.domElement.style.position=`absolute`,this.gui.domElement.style.top=`0px`,this.gui.domElement.style.right=`0px`;let e={animateButton:()=>{let e=this.isStopped;this.isStopped=!1,this.animateStep(),this.isStopped=e},toggleStop:()=>{this.isStopped=!this.isStopped},focalLength:.5,useFisheye:!1};this.gui.add(e,`animateButton`).name(`Animate step`),this.gui.add(e,`toggleStop`).name(`Toggle stop/play`),this.gui.add(e,`useFisheye`).name(`Switch fisheye/rectilinear`).onChange(e=>{this.textGroups.forEach(t=>{t.shader.uniforms.useFisheye.value=e?1:0,this.bg.visible=!e})}),this.gui.add(e,`focalLength`,.1,1).name(`Set focal length`).onChange(e=>{this.textGroups.forEach(t=>{t.shader.uniforms.focalLength.value=e})}),this.gui.close()}dispose(){this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.renderer.dispose(),this.textGroups.forEach(e=>{e.dispose()}),this.font1.dispose(),this.font2.dispose(),this.gui.destroy()}setupCamera(){this.camera=new v,this.controls=new A(this.camera,this.renderer.domElement),this.camera.position.set(0,.5,.7),this.controls.target.set(0,0,0),this.controls.update()}setupScene(){this.scene=new D,this.bg=new T;let e=new m(new b(.05,.15,1),new k);this.bg.add(e),this.textGroups.push(new P(this.font2)),this.textGroups.push(new P(this.font1)),this.textGroups.push(new P(this.font2)),this.scene.add(this.bg),this.textGroups.forEach(e=>{this.scene.add(e.getObject())}),this.spiralText(this.textGroups[1],600,5e4,0),this.textGroups[2].addText(this.sampleText,(e,t)=>[.1*e,0,.1*t],[1,1,1],[-.05,1]),this.scene.rotateOnAxis(new h(1,0,0),-Math.PI/2)}getResolution(){let{clientWidth:e,clientHeight:t}=this.container;return new c(e,t)}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep()}spiralText(e,t,n,r){e.reset();let i=11*t,a=[.8,.7,.5],o=[1,.2,.1];for(let s=t;s<n;s++){let t=i+15*r,n=(e,n)=>[.01*(Math.sqrt(16*(e+t))+16*n/2)*Math.cos(Math.sqrt(16*(e+t))),-.01*(Math.sqrt(16*(e+t))+16*n/2)*Math.sin(Math.sqrt(16*(e+t))),0],c=i/100+r,l=i+Math.round(c)*1666196;l=(l*1664525+1013904223)%4294967296;let u=`$${((l>>>0)/4294967296).toFixed(16)}#`;s%50==0&&(u=`Font: ${e.font.name}`);let d=Math.max(Math.min(10*(Math.abs(c-Math.round(c))-.35),1),0)**2,f=[d*o[0]+(1-d)*a[0],d*o[1]+(1-d)*a[1],d*o[2]+(1-d)*a[2]];Math.round(1.629622*s+.01*r)%10==0?e.addText(u,n(0,0),f,[0,0],16/200):e.addText(u,n,f,[0,0]),i+=e.font==this.font1?11:12}}animateStep(){this.isStopped||(this.lastTime=(this.lastTime??0)+(this.isStopped?0:1));let e=this.lastTime*.001;this.bg.setRotationFromEuler(new f(Math.PI/2,.3*e,.5*e)),this.spiralText(this.textGroups[0],0,500,e),this.textGroups[2].mesh.position.set(0,0,e),this.renderer.render(this.scene,this.camera)}},$=n(),ne=({mode:e})=>{let t=(0,I.useRef)(null);return(0,I.useEffect)(()=>{console.log(`useEffect: `,t.current);let n=null;return n=e==`fat_splines`?new J(t.current):e==`fat_splines2`?new ee(t.current):new V(t.current),()=>{n.dispose()}},[]),(0,$.jsx)(r,{style:{width:`100%`,height:`600px`},children:(0,$.jsx)(I.Suspense,{fallback:(0,$.jsx)(r,{display:`flex`,justifyContent:`center`,children:(0,$.jsx)(i,{children:`Loading..`})}),children:(0,$.jsx)(`div`,{ref:t,style:{width:`100%`,height:`100%`}})})})},re=()=>{let e=(0,I.useRef)(null),[t,n]=(0,I.useState)(null),[a,o]=(0,I.useState)(null),[s,c]=(0,I.useState)(null);return(0,I.useEffect)(()=>{console.log(`useEffect: `,e.current),(async()=>{try{let e=new F;await e.load(`times64`);let t=new F;await t.load(`consola64`),n(e),o(t);let r=await fetch(`/dev-site-misc/text/cap.txt`);if(!r.ok)throw Error(`Failed to fetch text file`);let i=await r.text(),a={8217:`'`,8220:`"`,8221:`"`,95:``,13:``},s=RegExp(`[${Object.keys(a).map(Number).map(e=>String.fromCharCode(e)).join(``)}]`,`g`);i=i.replace(s,e=>a[e.charCodeAt(0)]),c(i)}catch(e){console.error(`Failed to load text resources:`,e)}})()},[]),(0,I.useEffect)(()=>{if(t&&a&&s){let n=new te(e.current,t,a,s);return()=>{n.dispose()}}},[t,a,s]),(0,$.jsx)(r,{style:{width:`100%`,height:`600px`},children:t&&a&&s?(0,$.jsx)(I.Suspense,{fallback:(0,$.jsx)(r,{display:`flex`,justifyContent:`center`,children:(0,$.jsx)(i,{children:`Loading..`})}),children:(0,$.jsx)(`div`,{ref:e,style:{width:`100%`,height:`100%`}})}):(0,$.jsx)(r,{display:`flex`,justifyContent:`center`,children:(0,$.jsx)(i,{children:`Loading font...`})})})},ie=({mode:e})=>(0,$.jsxs)(a,{maxWidth:`lg`,children:[(0,$.jsx)(r,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,$.jsx)(i,{variant:`h2`,children:`Rendering tools`})}),e==`text`&&(0,$.jsx)(r,{sx:{width:`100%`,height:`100%`},children:(0,$.jsx)(I.Suspense,{fallback:(0,$.jsx)(r,{justifyContent:`center`,children:(0,$.jsx)(i,{children:`Loading..`})}),children:(0,$.jsx)(re,{})})}),(e==`splines`||e==`fat_splines`||e==`fat_splines2`)&&(0,$.jsx)(r,{sx:{width:`100%`,height:`100%`},children:(0,$.jsx)(I.Suspense,{fallback:(0,$.jsx)(r,{justifyContent:`center`,children:(0,$.jsx)(i,{children:`Loading..`})}),children:(0,$.jsx)(ne,{mode:e})})}),(0,$.jsx)(r,{children:(0,$.jsx)(i,{sx:{my:2},children:`Rendering text using multi-channel signed distance fields and instancing. Rendering uniform cubic B-splines using instancing. Fisheye effect is using stereographic projection.`})}),(0,$.jsx)(r,{children:(0,$.jsx)(o,{component:s,to:`/`,variant:`body1`,color:`primary`,children:`Back`})})]});export{ie as default};