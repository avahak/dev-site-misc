var R=Object.defineProperty;var x=(r,e,t)=>e in r?R(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var n=(r,e,t)=>x(r,typeof e!="symbol"?e+"":e,t);import{r as d,j as E}from"./index-CCY9mv2F.js";import{l as b,p as T,q as y,r as v,s as p,N as u,t as w,u as Z,f as I,v as F,W as P,m as S,I as M,w as U,n as _,A,B as C,x as g,e as z,O as k,V as j}from"./OrbitControls-DV_4SOBH.js";const D=`// From three.js: position, uv, normal\r
\r
uniform float time;\r
varying vec2 vUv;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vPosition = position;\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,q=`uniform float time;\r
uniform sampler2D u_pos;\r
varying vec2 vUv;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vec4 pos = texture2D(u_pos, vUv);\r
    pos.x += 0.0001;\r
    gl_FragColor = vec4(pos);\r
}\r
`;class G{constructor(e){n(this,"scene");n(this,"camera");n(this,"material");n(this,"SIZE",256);n(this,"fbo");n(this,"fbo2");this.scene=new b,this.camera=new T(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const t=new Float32Array(this.SIZE*this.SIZE*4);for(let s=0;s<this.SIZE;s++)for(let i=0;i<this.SIZE;i++){let h=s*this.SIZE+i,a=Math.random()*Math.PI*2,o=.5+.4*Math.random();t[h*4+0]=o*Math.cos(a),t[h*4+1]=o*Math.sin(a),t[h*4+2]=0,t[h*4+3]=1}const c=new y(t,this.SIZE,this.SIZE,v,p);c.minFilter=u,c.magFilter=u,c.needsUpdate=!0,this.material=new w({uniforms:{u_pos:{value:c},time:{value:0}},vertexShader:D,fragmentShader:q});const l=new Z(2,2),m=new I(l,this.material);this.scene.add(m),this.fbo=this.createRenderTarget(),this.fbo2=this.createRenderTarget(),e.setRenderTarget(this.fbo2),e.render(this.scene,this.camera),e.setRenderTarget(null)}createRenderTarget(){return new F(this.SIZE,this.SIZE,{minFilter:u,magFilter:u,format:v,type:p})}step(e){this.material.uniforms.u_pos.value=this.fbo2.texture,e.setRenderTarget(this.fbo),e.render(this.scene,this.camera),e.setRenderTarget(null);const t=this.fbo;this.fbo=this.fbo2,this.fbo2=t}}const O=`// From three.js: position, uv, normal\r
\r
uniform float time;\r
uniform sampler2D u_pos;\r
varying vec2 vUv;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vPosition = texture2D(u_pos, uv).xyz;\r
    vUv = uv;\r
    gl_PointSize = 5.;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition.xyz, 1.);\r
}`,V=`uniform float time;\r
varying vec2 vUv;\r
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
`;class B{constructor(e){n(this,"container");n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"cleanUpTasks");n(this,"animationRequestID",null);n(this,"lastTime",null);n(this,"cube",null);n(this,"fboScene");n(this,"material",null);this.container=e,this.cleanUpTasks=[],this.renderer=new P({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.fboScene=new G(this.renderer),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.setupResizeRenderer(),this.resizeRenderer(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof S&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new b,t=new M(.2,1),c=new U({flatShading:!0}),l=new I(t,c);e.add(l),this.cube=l;const m=new _(16777215,200,0);m.position.set(0,50,0),e.add(new A(14544639,.8)),e.add(m);const s=new C,i=new Float32Array(this.fboScene.SIZE*this.fboScene.SIZE*2);for(let a=0;a<this.fboScene.SIZE;a++)for(let o=0;o<this.fboScene.SIZE;o++){let f=a*this.fboScene.SIZE+o;i[f*2+0]=a/this.fboScene.SIZE,i[f*2+1]=o/this.fboScene.SIZE}s.setAttribute("position",new g(new Float32Array(this.fboScene.SIZE*this.fboScene.SIZE*3),3)),s.setAttribute("uv",new g(i,2)),this.material=new w({uniforms:{u_pos:{value:null},time:{value:0}},vertexShader:O,fragmentShader:V});const h=new z(s,this.material);return e.add(h),e}setupCamera(){const e=new S(60,1,.1,1e3),t=new k(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e.position.set(1,1,1.5),e.lookAt(new j(0,0,0)),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate);const e=performance.now()/1e3,t=this.lastTime?Math.max(Math.min(e-this.lastTime,.1),0):0;this.lastTime=e,this.fboScene.material.uniforms.time.value=e,this.cube.rotateY(.1*t),this.fboScene.step(this.renderer),this.material.uniforms.u_pos.value=this.fboScene.fbo.texture,this.renderer.render(this.scene,this.camera)}}const $=()=>{const r=d.useRef(null);return d.useEffect(()=>{console.log("useEffect: ",r.current);const e=new B(r.current);return()=>{e.cleanUp()}},[]),E.jsx("div",{ref:r,style:{width:"100%",height:"100%"}})};export{$ as default};
