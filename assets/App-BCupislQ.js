import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{t as r}from"./Box-CFEfsCq7.js";import{a as i,i as a,r as o,t as s}from"./index-DazcREDu.js";import{F as c,It as l,Jt as u,Kt as d,Lr as f,Rr as p,Xt as m,ar as h,br as g,ir as _,jt as v,qt as y,r as b,u as x}from"./three.module-BrMVvVOI.js";import{t as S}from"./OrbitControls-CT6IiSB_.js";import{t as C}from"./lil-gui.module.min--1wMio4V.js";var w=e(t(),1),T=`precision highp float;\r
\r
out vec3 vPos;\r
out vec2 vUv;\r
\r
void main() {\r
    vPos = position;\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);\r
}`,E=`precision highp float;\r
\r
uniform vec2 resolution;\r
uniform float time;\r
\r
in vec3 vPos;\r
in vec2 vUv;\r
\r
void main() {\r
    // float aspect = resolution.x / resolution.y;\r
    gl_FragColor = vec4(0.2+0.2*sin(5.0*vPos.xy+vec2(time)), 0.4, 1.0);\r
}`,D=class{constructor(e){this.cleanUpTasks=[],this.timer=new g,this.containerSize=new f(0,0),this.container=e,this.isInitialized=!1,d.DEFAULT_UP.set(0,0,1)}async init(e){if(this.renderer=new b({antialias:!0,alpha:!0}),this.renderer.setClearColor(1118481,1),this.container.appendChild(this.renderer.domElement),this.setupCamera(),this.setupScene(),this.createGUI(),this.isInitialized=!0,e.aborted){this.dispose();return}this.animate=this.animate.bind(this),this.renderer.setAnimationLoop(this.animate)}dispose(){if(this.isInitialized){this.renderer.setAnimationLoop(null),this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.controls.dispose(),this.shaderMaterial?.dispose(),this.timer.dispose(),this.gui.destroy(),this.renderer.dispose()}}handleResize(){let e=this.container.clientWidth,t=this.container.clientHeight;if(e<=0||t<=0||this.containerSize.x===e&&this.containerSize.y===t)return;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.containerSize.set(e,t),this.renderer.setSize(e,t);let n=e/t;this.camera instanceof y?(this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()):this.camera instanceof u&&(this.camera.aspect=n,this.camera.updateProjectionMatrix());let r=new f;this.renderer.getDrawingBufferSize(r),console.log(`Resize to (${r.x}, ${r.y})`),this.shaderMaterial.uniforms.resolution.value=r}createGUI(){this.gui=new C,this.gui.add({timeScale:0},`timeScale`,-6,2,1).name(`Log time scale`).onChange(e=>{this.timer.setTimescale(Math.exp(e))})}setupCamera(){this.camera=new u,this.controls=new S(this.camera,this.renderer.domElement),this.camera.position.set(2,0,1),this.camera.lookAt(new p(0,0,0))}setupScene(){this.scene=new _;let e=new x(.5,.5,.5),t=new l;this.cube=new v(e,t),this.scene.add(this.cube),this.cleanUpTasks.push(()=>e.dispose()),this.cleanUpTasks.push(()=>t.dispose()),this.shaderMaterial=new h({uniforms:{resolution:{value:null},time:{value:null}},vertexShader:T,fragmentShader:E,side:2});let n=new m(2,2);this.scene.add(new v(n,this.shaderMaterial)),this.cleanUpTasks.push(()=>n.dispose())}animate(){this.timer.update(),this.controls.update(),this.handleResize(),this.render()}render(){let e=this.timer.getElapsed();this.shaderMaterial.uniforms.time.value=e,this.cube.setRotationFromEuler(new c(.2*e,.25*e,.3*e)),this.renderer.render(this.scene,this.camera)}},O=n(),k=()=>{let e=(0,w.useRef)(null);return(0,w.useEffect)(()=>{console.log(`useEffect: `,e.current);let t=new AbortController,n=new D(e.current);return n.init(t.signal),()=>{t.abort(),n.dispose()}},[]),(0,O.jsx)(`div`,{ref:e,style:{width:`100%`,height:`100%`}})},A=()=>(0,O.jsxs)(a,{maxWidth:`xl`,children:[(0,O.jsx)(r,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,O.jsx)(i,{variant:`h2`,children:`Three.js class template`})}),(0,O.jsx)(r,{sx:{position:`relative`,width:`100%`,height:`600px`},children:(0,O.jsx)(k,{})}),(0,O.jsx)(o,{component:s,to:`/`,variant:`body1`,color:`primary`,children:`Back`})]});export{A as default};