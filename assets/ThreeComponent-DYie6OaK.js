var F=Object.defineProperty;var I=(i,e,t)=>e in i?F(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var n=(i,e,t)=>I(i,typeof e!="symbol"?e+"":e,t);import{r as d,j as T}from"./index-Bz2kcCRm.js";import{l as P,p as y,q as R,r as f,s as p,N as m,t as S,V as x,u as E,f as w,v as z,W as Z,m as b,I as C,w as U,n as j,A as M,B as D,x as g,e as A,O as k}from"./OrbitControls-DV_4SOBH.js";const O=`// From three.js: position, uv, normal, time, etc.\r
\r
varying vec2 vUv;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vPosition = position;\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,N=`// uPosition1 is prev positions, uPosition2 is current\r
\r
/*\r
Idea: \r
1) Compute distance d0 between current pos and initial pos.\r
2) Create "homefinding" force F0 \r
3) Create "orbiting" force F1 that tries to\r
    - force distance from center to 1\r
    - force velocity length to 1\r
4) Compute combined force F=mix of F0 and F1 based on ...\r
5) apply Verlet integration with force F\r
    - if d0 is small then apply F1\r
    - if d0 is large, apply F0\r
*/\r
\r
uniform vec3 uPositionObject;\r
uniform sampler2D uPosition0;\r
uniform sampler2D uPosition1;\r
uniform sampler2D uPosition2;\r
varying vec2 vUv;\r
varying vec3 vPosition; // same as uPosition2, clean up at some point\r
\r
vec3 safeNormalize(vec3 v) {\r
    float d = length(v);\r
    if (d > 0.0)\r
        return v / d;\r
    else \r
        return vec3(0., 0., 1.);\r
}\r
\r
vec3 computeForce(vec3 p0, vec3 p1, vec3 p2) {\r
    vec3 v02 = p2-p0;\r
    vec3 v = p2-p1;\r
    vec3 F0 = safeNormalize(v)*(0.1-length(v)) + safeNormalize(v02);\r
\r
    vec3 vp = p2-uPositionObject;\r
    vec3 F1 = safeNormalize(v)*(0.1-length(v)) + safeNormalize(vp)*(0.1-length(vp));\r
\r
\r
    float d0 = length(v02); // distance home\r
    float d1 = length(vp);  // distance to object\r
    float t = 1.-smoothstep(0.2, 0.3, min(d0/3., d1));\r
\r
    return t*F0 + (1.-t)*F1;\r
}\r
\r
void main() {\r
    vec3 p0 = texture2D(uPosition0, vUv).xyz;\r
    vec3 p1 = texture2D(uPosition1, vUv).xyz;\r
    vec3 p2 = texture2D(uPosition2, vUv).xyz;\r
\r
    vec3 F = computeForce(p0, p1, p2);\r
    vec3 newPos = 2.*p2-p1 + 0.01*F;\r
\r
    gl_FragColor = vec4(newPos, 1.);\r
}\r
`;class q{constructor(e){n(this,"scene");n(this,"camera");n(this,"material");n(this,"SIZE",256);n(this,"initialPositionsTexture");n(this,"fbos");n(this,"currentFboIndex");this.scene=new P,this.camera=new y(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const t=new Float32Array(this.SIZE*this.SIZE*4);for(let s=0;s<this.SIZE;s++)for(let r=0;r<this.SIZE;r++){let o=s*this.SIZE+r,l=Math.random()*Math.PI*2,a=.5+.4*Math.random();t[o*4+0]=a*Math.cos(l),t[o*4+1]=a*Math.sin(l),t[o*4+2]=0,t[o*4+3]=1}this.initialPositionsTexture=new R(t,this.SIZE,this.SIZE,f,p),this.initialPositionsTexture.minFilter=m,this.initialPositionsTexture.magFilter=m,this.initialPositionsTexture.needsUpdate=!0,this.material=new S({uniforms:{uPositionObject:{value:new x(0,0,0)},uPosition0:{value:this.initialPositionsTexture},uPosition1:{value:this.initialPositionsTexture},uPosition2:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:O,fragmentShader:N});const c=new E(2,2),h=new w(c,this.material);this.scene.add(h),this.fbos=[];for(let s=0;s<3;s++){const r=this.createRenderTarget();this.fbos.push(r),e.setRenderTarget(r),e.render(this.scene,this.camera)}this.currentFboIndex=2,e.setRenderTarget(null)}createRenderTarget(){return new z(this.SIZE,this.SIZE,{minFilter:m,magFilter:m,format:f,type:p})}step(e){const[t,c,h]=[this.currentFboIndex,(this.currentFboIndex+1)%3,(this.currentFboIndex+2)%3];this.material.uniforms.uPosition1.value=this.fbos[h].texture,this.material.uniforms.uPosition2.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[c]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=c}setObjectPosition(e){this.material.uniforms.uPositionObject.value=e}}const G=`// From three.js: position, uv, normal\r
\r
uniform sampler2D uPosition;\r
varying vec2 vUv;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vPosition = texture2D(uPosition, uv).xyz;\r
    vUv = uv;\r
    gl_PointSize = 1.;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition.xyz, 1.);\r
}`,_=`varying vec2 vUv;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
    // float t = 1.-smoothstep(0.4, 0.5, dist);\r
    if (dist > 0.5)\r
        discard;\r
    gl_FragColor = vec4(1., 1., 0., 1.);\r
}\r
`;class V{constructor(e){n(this,"container");n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"cleanUpTasks");n(this,"animationRequestID",null);n(this,"lastTime",null);n(this,"cube",null);n(this,"fboScene");n(this,"material",null);this.container=e,this.cleanUpTasks=[],this.renderer=new Z({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.fboScene=new q(this.renderer),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.setupResizeRenderer(),this.resizeRenderer(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof b&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new P,t=new C(.2,1),c=new U({flatShading:!0}),h=new w(t,c);e.add(h),this.cube=h;const s=new j(16777215,200,0);s.position.set(0,50,0),e.add(new M(14544639,.8)),e.add(s);const r=new D,o=new Float32Array(this.fboScene.SIZE*this.fboScene.SIZE*2);for(let a=0;a<this.fboScene.SIZE;a++)for(let u=0;u<this.fboScene.SIZE;u++){let v=a*this.fboScene.SIZE+u;o[v*2+0]=a/this.fboScene.SIZE,o[v*2+1]=u/this.fboScene.SIZE}r.setAttribute("position",new g(new Float32Array(this.fboScene.SIZE*this.fboScene.SIZE*3),3)),r.setAttribute("uv",new g(o,2)),this.material=new S({uniforms:{uPosition:{value:null},time:{value:0}},vertexShader:G,fragmentShader:_});const l=new A(r,this.material);return l.frustumCulled=!1,e.add(l),e}setupCamera(){const e=new b(60,1,.1,1e3),t=new k(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e.position.set(1,1,1.5),e.lookAt(new x(0,0,0)),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate);const e=performance.now()/1e3,t=this.lastTime?Math.max(Math.min(e-this.lastTime,.1),0):0;this.lastTime=e,this.fboScene.material.uniforms.time.value=e,this.cube.rotateY(.1*t),this.fboScene.setObjectPosition(this.cube.position),this.fboScene.step(this.renderer),this.material.uniforms.uPosition.value=this.fboScene.fbos[this.fboScene.currentFboIndex].texture,this.renderer.render(this.scene,this.camera)}}const $=()=>{const i=d.useRef(null);return d.useEffect(()=>{console.log("useEffect: ",i.current);const e=new V(i.current);return()=>{e.cleanUp()}},[]),T.jsx("div",{ref:i,style:{width:"100%",height:"100%"}})};export{$ as default};
