var I=Object.defineProperty;var F=(r,e,t)=>e in r?I(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var n=(r,e,t)=>F(r,typeof e!="symbol"?e+"":e,t);import{r as m,j as T}from"./index-Q8DXOFeC.js";import{l as g,p as R,q as E,r as f,s as p,N as v,t as P,V as x,u as y,f as w,v as j,W as M,m as b,I as z,w as U,n as Z,A,B as C,x as S,e as k,O as D}from"./OrbitControls-DV_4SOBH.js";const O=`// From three.js: position, uv, normal, time, etc.\r
\r
varying vec2 vUv;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vPosition = position;\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,_=`// uPosition1 is prev positions, uPosition2 is current\r
\r
/*\r
Idea: manage state in gl_FragCoord.w. How to code it?\r
*/\r
\r
uniform vec3 uPositionObject;\r
uniform sampler2D uPosition0;\r
uniform sampler2D uPosition1;\r
uniform sampler2D uPosition2;\r
varying vec2 vUv;\r
varying vec3 vPosition; // same as uPosition2, clean up at some point\r
\r
vec2 random22(vec2 p) {\r
    // Source: The Book of Shaders\r
    return fract(sin(vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5, 183.3))))*43758.5453);\r
}\r
\r
float random21(vec2 p) {\r
    // Source: The Book of Shaders\r
    return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453123);\r
}\r
\r
float encodeIntAndFloat(int i, float f) {\r
    // Transform unbounded float to (0, 1)\r
    float f_bounded = (0.5 + atan(f) / (2.0 * 3.14159265359));  \r
    return float(i) + f_bounded;\r
}\r
\r
void decodeIntAndFloat(float encoded, out int i, out float f) {\r
    i = int(floor(encoded));\r
    float f_bounded = encoded - float(i);\r
    f = tan(3.14159265359 * (f_bounded - 0.5));  \r
}\r
\r
vec3 safeNormalize(vec3 v) {\r
    float d = length(v);\r
    if (d > 0.0)\r
        return v / d;\r
    else \r
        return vec3(0., 0., 1.);\r
}\r
\r
float computeState(vec3 p0, vec3 p1, vec3 p2, float state) {\r
    vec3 v02 = p2-p0;\r
    vec3 vp = p2-uPositionObject;\r
    float d0 = length(v02); // distance home\r
    float d1 = length(vp);  // distance to object\r
\r
    vec2 rand = random22(vUv);\r
\r
    // Get attached to the object if we are home and object is close\r
    if ((state < 0.5) && (d0 < 0.01) && (d1 < 0.2+0.2*rand.x))\r
        return 1.0;\r
    // Return home if distance home is too long\r
    if ((state > 0.5) && (d0 > 0.5+0.5*rand.y))\r
        return 0.0;\r
    return state;\r
}\r
\r
vec3 computeForce(vec3 p0, vec3 p1, vec3 p2, float state) {\r
    vec3 v02 = p2-p0;\r
    vec3 v = p2-p1;\r
    vec3 F0 = safeNormalize(v)*(0.05-length(v)) - safeNormalize(v02);\r
\r
    if (state < 0.5)\r
        return F0;\r
\r
    vec3 vp = p2-uPositionObject;\r
    vec3 F1 = safeNormalize(v)*(0.05-length(v)) + safeNormalize(vp)*(0.2-length(vp));\r
\r
    return F1;\r
}\r
\r
void main() {\r
    vec4 p = texture2D(uPosition2, vUv);\r
    vec3 p0 = texture2D(uPosition0, vUv).xyz;\r
    vec3 p1 = texture2D(uPosition1, vUv).xyz;\r
    vec3 p2 = p.xyz;\r
\r
    float state = computeState(p0, p1, p2, p.w);\r
    vec3 F = 0.01*computeForce(p0, p1, p2, state);\r
\r
    // Verlet integration\r
    vec3 newPos = p2 + 0.9*(p2-p1) + F;\r
\r
    gl_FragColor = vec4(newPos, state);\r
}\r
`;class N{constructor(e){n(this,"scene");n(this,"camera");n(this,"material");n(this,"SIZE",1024);n(this,"initialPositionsTexture");n(this,"fbos");n(this,"currentFboIndex");this.scene=new g,this.camera=new R(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const t=new Float32Array(this.SIZE*this.SIZE*4);for(let s=0;s<this.SIZE;s++)for(let i=0;i<this.SIZE;i++){let o=s*this.SIZE+i,h=Math.random()*Math.PI*2,a=.5+.4*Math.random();t[o*4+0]=a*Math.cos(h),t[o*4+1]=a*Math.sin(h),t[o*4+2]=Math.random()*.1-.05,t[o*4+3]=1}this.initialPositionsTexture=new E(t,this.SIZE,this.SIZE,f,p),this.initialPositionsTexture.minFilter=v,this.initialPositionsTexture.magFilter=v,this.initialPositionsTexture.needsUpdate=!0,this.material=new P({uniforms:{uPositionObject:{value:new x(0,0,0)},uPosition0:{value:this.initialPositionsTexture},uPosition1:{value:this.initialPositionsTexture},uPosition2:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:O,fragmentShader:_});const c=new y(2,2),l=new w(c,this.material);this.scene.add(l),this.fbos=[];for(let s=0;s<3;s++){const i=this.createRenderTarget();this.fbos.push(i),e.setRenderTarget(i),e.render(this.scene,this.camera)}this.currentFboIndex=2,e.setRenderTarget(null)}createRenderTarget(){return new j(this.SIZE,this.SIZE,{minFilter:v,magFilter:v,format:f,type:p})}step(e){const[t,c,l]=[this.currentFboIndex,(this.currentFboIndex+1)%3,(this.currentFboIndex+2)%3];this.material.uniforms.uPosition1.value=this.fbos[l].texture,this.material.uniforms.uPosition2.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[c]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=c}setObjectPosition(e){this.material.uniforms.uPositionObject.value=e}}const G=`// From three.js: position, uv, normal\r
\r
uniform sampler2D uPosition;\r
varying vec2 vUv;\r
varying vec4 vPosition;\r
\r
void main() {\r
    vPosition = texture2D(uPosition, uv);\r
    vUv = uv;\r
    gl_PointSize = 1.;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition.xyz, 1.);\r
}`,q=`varying vec2 vUv;\r
varying vec4 vPosition;\r
\r
void main() {\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
    // float t = 1.-smoothstep(0.4, 0.5, dist);\r
    if (dist > 0.5)\r
        discard;\r
    vec4 color = vPosition.w < 0.5 ? vec4(1., 1., 0., 1.) : vec4(1., 0., 1., 1.);\r
    gl_FragColor = color;\r
}\r
`;class B{constructor(e){n(this,"container");n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"cleanUpTasks");n(this,"animationRequestID",null);n(this,"lastTime",null);n(this,"cube",null);n(this,"fboScene");n(this,"material",null);this.container=e,this.cleanUpTasks=[],this.renderer=new M({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.fboScene=new N(this.renderer),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.setupResizeRenderer(),this.resizeRenderer(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof b&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new g,t=new z(.1,1),c=new U({flatShading:!0}),l=new w(t,c);e.add(l),this.cube=l;const s=new Z(16777215,200,0);s.position.set(0,50,0),e.add(new A(14544639,.8)),e.add(s);const i=new C,o=new Float32Array(this.fboScene.SIZE*this.fboScene.SIZE*2);for(let a=0;a<this.fboScene.SIZE;a++)for(let u=0;u<this.fboScene.SIZE;u++){let d=a*this.fboScene.SIZE+u;o[d*2+0]=a/this.fboScene.SIZE,o[d*2+1]=u/this.fboScene.SIZE}i.setAttribute("position",new S(new Float32Array(this.fboScene.SIZE*this.fboScene.SIZE*3),3)),i.setAttribute("uv",new S(o,2)),this.material=new P({uniforms:{uPosition:{value:null},time:{value:0}},vertexShader:G,fragmentShader:q});const h=new k(i,this.material);return h.frustumCulled=!1,e.add(h),e}setupCamera(){const e=new b(60,1,.1,1e3),t=new D(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e.position.set(1,1,1.5),e.lookAt(new x(0,0,0)),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate);const e=performance.now()/1e3,t=this.lastTime?Math.max(Math.min(e-this.lastTime,.1),0):0;this.lastTime=e,this.fboScene.material.uniforms.time.value=e,this.cube.rotateY(.1*t),this.cube.position.set(1*Math.cos(.1*e),1*Math.sin(.2*e),0),this.fboScene.setObjectPosition(this.cube.position),this.fboScene.step(this.renderer),this.material.uniforms.uPosition.value=this.fboScene.fbos[this.fboScene.currentFboIndex].texture,this.renderer.render(this.scene,this.camera)}}const $=()=>{const r=m.useRef(null);return m.useEffect(()=>{console.log("useEffect: ",r.current);const e=new B(r.current);return()=>{e.cleanUp()}},[]),T.jsx("div",{ref:r,style:{width:"100%",height:"100%"}})};export{$ as default};
