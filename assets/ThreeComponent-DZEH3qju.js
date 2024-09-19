var w=Object.defineProperty;var R=(i,e,r)=>e in i?w(i,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[e]=r;var t=(i,e,r)=>R(i,typeof e!="symbol"?e+"":e,r);import{r as x,j as I}from"./index-O8VaClI2.js";import{l as S,O as f,p as y,q as p,r as g,N as d,s as b,t as T,f as M,u as F,W as z,i as P,B as k,w as A,e as C,x as U}from"./three.module-BxuQ6Me3.js";const E=`varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,D=`uniform sampler2D uPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
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
vec3 safeNormalize(vec3 v) {\r
    float d = length(v);\r
    if (d > 0.0)\r
        return v / d;\r
    else \r
        return vec3(0., 0., 1.);\r
}\r
\r
vec4 newPosition(vec4 p) {\r
    float d = 0.001;\r
    float sensorAngle = 0.5;\r
\r
    vec2 v = vec2(cos(p.z), sin(p.z));\r
    vec2 v1 = vec2(cos(p.z+sensorAngle), sin(p.z+sensorAngle));\r
    vec2 v2 = vec2(cos(p.z-sensorAngle), sin(p.z-sensorAngle));\r
\r
    vec4 q = p + d*vec4(v, 0., 0.);\r
    vec4 q1 = p + d*vec4(v1, 0., 0.);\r
    vec4 q2 = p + d*vec4(v2, 0., 0.);\r
    // Here we need double buffering for canvas also to read values from\r
\r
    return q;\r
}\r
\r
void main() {\r
    vec4 p = texture2D(uPosition, vUv);\r
    gl_FragColor = newPosition(p);\r
}\r
`,s=128;class _{constructor(e){t(this,"baseScene");t(this,"scene");t(this,"camera");t(this,"shaderMaterial");t(this,"initialPositionsTexture");t(this,"fbos");t(this,"currentFboIndex");this.baseScene=e,this.scene=new S,this.camera=new f(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const r=new Float32Array(s*s*4);for(let c=0;c<s;c++)for(let l=0;l<s;l++){let h=c*s+l,u=Math.random()*Math.PI*2,o=.3+.7*Math.random();r[h*4+0]=o*Math.cos(u),r[h*4+1]=o*Math.sin(u),r[h*4+2]=Math.random()*2*Math.PI,r[h*4+3]=0}this.initialPositionsTexture=new y(r,s,s,p,g),this.initialPositionsTexture.minFilter=d,this.initialPositionsTexture.magFilter=d,this.initialPositionsTexture.needsUpdate=!0,this.shaderMaterial=new b({uniforms:{uPosition:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:E,fragmentShader:D});const n=new T(2,2),a=new M(n,this.shaderMaterial);this.scene.add(a),this.fbos=[];for(let c=0;c<2;c++){const l=this.createRenderTarget();this.fbos.push(l),this.baseScene.renderer.setRenderTarget(l),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new F(s,s,{minFilter:d,magFilter:d,format:p,type:g})}step(e){const[r,n]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.shaderMaterial.uniforms.uPosition.value=this.fbos[r].texture,e.setRenderTarget(this.fbos[n]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=n}}const q=`// From three.js: position, uv, normal\r
\r
uniform sampler2D particleMap;\r
varying vec4 vParticle;\r
\r
void main() {\r
    vParticle = texture2D(particleMap, position.xy);\r
    gl_PointSize = 4.;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xy, 0.5, 1.);\r
}`,j=`varying vec4 vParticle;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
    // float t = 1.-smoothstep(0.4, 0.5, dist);\r
    if (dist > 0.5)\r
        discard;\r
\r
    gl_FragColor = vec4(0.2, 0.2, 1., 1.);\r
}\r
`,B=`varying vec4 vPosition;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0., 1.);\r
    gl_Position = vPosition;\r
}`,O=`uniform sampler2D trailMap;\r
uniform vec2 resolution;\r
uniform vec2 gaussianOffsets[9];\r
uniform float gaussianKernel[9];\r
varying vec4 vPosition;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec2 uv = 0.5*(vPosition.xy+vec2(1., 1.));\r
\r
    vec2 texelSize = 1.0 / resolution;\r
\r
    vec4 colorSum = vec4(0.0);\r
\r
    // Apply 3x3 Gaussian blur\r
    for (int k = 0; k < 9; k++) {\r
        vec2 elementUV = uv + gaussianOffsets[k]*texelSize;\r
        vec4 value = texture2D(trailMap, elementUV);\r
        colorSum += value*gaussianKernel[k];\r
    }\r
\r
    vec4 blurredFadedColor = 0.99*colorSum;\r
    gl_FragColor = vec4(blurredFadedColor.rgb, 1.);\r
}\r
`;class G{constructor(e){t(this,"container");t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"cleanUpTasks");t(this,"animationRequestID",null);t(this,"lastTime",null);t(this,"isStopped",!1);t(this,"fbos",[]);t(this,"currentFboIndex",-1);t(this,"disposeFbos");t(this,"particleScene");t(this,"shaderMaterialPoints",null);t(this,"shaderMaterialTrail",null);this.container=e,this.cleanUpTasks=[],this.renderer=new z({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.renderer.getContext().getExtension("EXT_float_blend"),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.disposeFbos=()=>this.fbos.forEach(n=>n.dispose()),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new _(this),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID),this.disposeFbos()}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:r}=this.container;this.renderer.setSize(e,r),console.log(`Resize! (${e}, ${r})`);const n=e/r;if(this.camera instanceof f){const a=this.camera.top-this.camera.bottom;this.camera.left=-a*n/2,this.camera.right=a*n/2,this.camera.updateProjectionMatrix()}this.setupFbos(),this.shaderMaterialTrail.uniforms.resolution.value=new P(e,r)}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}setupFbos(){this.disposeFbos(),this.fbos=[];for(let e=0;e<2;e++){const r=this.createRenderTarget();this.fbos.push(r)}this.currentFboIndex=0}createRenderTarget(){const{clientWidth:e,clientHeight:r}=this.container;return new F(e,r,{minFilter:d,magFilter:d,format:p,type:g})}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new S,r=new k,n=new Float32Array(s*s*3);for(let o=0;o<s;o++)for(let v=0;v<s;v++){let m=o*s+v;n[m*3+0]=o/s,n[m*3+1]=v/s,n[m*3+2]=0}r.setAttribute("position",new A(n,3)),this.shaderMaterialPoints=new b({uniforms:{particleMap:{value:null},time:{value:0}},vertexShader:q,fragmentShader:j});const a=new C(r,this.shaderMaterialPoints);a.frustumCulled=!1,e.add(a);const c=[[-1,1],[0,1],[1,1],[-1,0],[0,0],[1,0],[-1,-1],[0,-1],[1,-1]],l=[1/16,2/16,1/16,2/16,4/16,2/16,1/16,2/16,1/16];this.shaderMaterialTrail=new b({uniforms:{trailMap:{value:null},resolution:{value:null},gaussianOffsets:{value:c.map(o=>new P(o[0],o[1]))},gaussianKernel:{value:l},time:{value:0}},vertexShader:B,fragmentShader:O,blending:U,depthWrite:!1});const h=new T(2,2),u=new M(h,this.shaderMaterialTrail);return e.add(u),e}setupCamera(){const e=new f(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const r=(this.lastTime??0)+(e?0:.01);this.lastTime=r,this.particleScene.shaderMaterial.uniforms.time.value=r,e||this.particleScene.step(this.renderer),this.shaderMaterialPoints.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture;const[n,a]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.shaderMaterialTrail.uniforms.trailMap.value=this.fbos[n].texture,this.renderer.setRenderTarget(this.fbos[a]),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.currentFboIndex=a,this.renderer.render(this.scene,this.camera)}}const K=()=>{const i=x.useRef(null);return x.useEffect(()=>{console.log("useEffect: ",i.current);const e=new G(i.current);return()=>{e.cleanUp()}},[]),I.jsx("div",{ref:i,style:{width:"100%",height:"100%"}})};export{K as default};
