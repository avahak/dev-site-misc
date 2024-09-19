var S=Object.defineProperty;var M=(i,e,r)=>e in i?S(i,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[e]=r;var t=(i,e,r)=>M(i,typeof e!="symbol"?e+"":e,r);import{r as g,j as F}from"./index-BCuL6Ogt.js";import{l as b,O as v,p as R,q as m,r as p,N as u,s as f,t as x,f as P,u as T,W as w,B as I,w as y,e as C,x as z}from"./three.module-BxuQ6Me3.js";const A=`varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,k=`uniform sampler2D uPosition;\r
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
`,s=128;class E{constructor(e){t(this,"baseScene");t(this,"scene");t(this,"camera");t(this,"shaderMaterial");t(this,"initialPositionsTexture");t(this,"fbos");t(this,"currentFboIndex");this.baseScene=e,this.scene=new b,this.camera=new v(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const r=new Float32Array(s*s*4);for(let c=0;c<s;c++)for(let l=0;l<s;l++){let o=c*s+l,h=Math.random()*Math.PI*2,d=.3+.7*Math.random();r[o*4+0]=d*Math.cos(h),r[o*4+1]=d*Math.sin(h),r[o*4+2]=Math.random()*2*Math.PI,r[o*4+3]=0}this.initialPositionsTexture=new R(r,s,s,m,p),this.initialPositionsTexture.minFilter=u,this.initialPositionsTexture.magFilter=u,this.initialPositionsTexture.needsUpdate=!0,this.shaderMaterial=new f({uniforms:{uPosition:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:A,fragmentShader:k});const n=new x(2,2),a=new P(n,this.shaderMaterial);this.scene.add(a),this.fbos=[];for(let c=0;c<2;c++){const l=this.createRenderTarget();this.fbos.push(l),this.baseScene.renderer.setRenderTarget(l),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new T(s,s,{minFilter:u,magFilter:u,format:m,type:p})}step(e){const[r,n]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.shaderMaterial.uniforms.uPosition.value=this.fbos[r].texture,e.setRenderTarget(this.fbos[n]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=n}}const U=`// From three.js: position, uv, normal\r
\r
uniform sampler2D particleMap;\r
varying vec4 vParticle;\r
\r
void main() {\r
    vParticle = texture2D(particleMap, position.xy);\r
    gl_PointSize = 4.;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xy, 0.5, 1.);\r
}`,_=`varying vec4 vParticle;\r
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
`,D=`varying vec4 vPosition;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0., 1.);\r
    gl_Position = vPosition;\r
}`,q=`uniform sampler2D trailMap;\r
varying vec4 vPosition;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec2 uv = 0.5*(vPosition.xy+vec2(1., 1.));\r
    vec4 oldColor = texture2D(trailMap, uv);\r
\r
    // gl_FragColor = mix(vec4(0.2, 0.5, 1., 1.), oldColor, 0.15);\r
    gl_FragColor = vec4(0.99*oldColor.rgb, 1.);\r
}\r
`;class j{constructor(e){t(this,"container");t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"cleanUpTasks");t(this,"animationRequestID",null);t(this,"lastTime",null);t(this,"isStopped",!1);t(this,"fbos",[]);t(this,"currentFboIndex",-1);t(this,"disposeFbos");t(this,"particleScene");t(this,"shaderMaterialPoints",null);t(this,"shaderMaterialTrail",null);this.container=e,this.cleanUpTasks=[],this.renderer=new w({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.renderer.getContext().getExtension("EXT_float_blend"),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.disposeFbos=()=>this.fbos.forEach(n=>n.dispose()),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new E(this),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID),this.disposeFbos()}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:r}=this.container;this.renderer.setSize(e,r),console.log(`Resize! (${e}, ${r})`);const n=e/r;if(this.camera instanceof v){const a=this.camera.top-this.camera.bottom;this.camera.left=-a*n/2,this.camera.right=a*n/2,this.camera.updateProjectionMatrix()}this.setupFbos()}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}setupFbos(){this.disposeFbos(),this.fbos=[];for(let e=0;e<2;e++){const r=this.createRenderTarget();this.fbos.push(r)}this.currentFboIndex=0}createRenderTarget(){const{clientWidth:e,clientHeight:r}=this.container;return new T(e,r,{minFilter:u,magFilter:u,format:m,type:p})}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new b,r=new I,n=new Float32Array(s*s*3);for(let o=0;o<s;o++)for(let h=0;h<s;h++){let d=o*s+h;n[d*3+0]=o/s,n[d*3+1]=h/s,n[d*3+2]=0}r.setAttribute("position",new y(n,3)),this.shaderMaterialPoints=new f({uniforms:{particleMap:{value:null},time:{value:0}},vertexShader:U,fragmentShader:_});const a=new C(r,this.shaderMaterialPoints);a.frustumCulled=!1,e.add(a),this.shaderMaterialTrail=new f({uniforms:{trailMap:{value:null},time:{value:0}},vertexShader:D,fragmentShader:q,blending:z,depthWrite:!1});const c=new x(2,2),l=new P(c,this.shaderMaterialTrail);return e.add(l),e}setupCamera(){const e=new v(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const r=(this.lastTime??0)+(e?0:.01);this.lastTime=r,this.particleScene.shaderMaterial.uniforms.time.value=r,e||this.particleScene.step(this.renderer),this.shaderMaterialPoints.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture;const[n,a]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.shaderMaterialTrail.uniforms.trailMap.value=this.fbos[n].texture,this.renderer.setRenderTarget(this.fbos[a]),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.currentFboIndex=a,this.renderer.render(this.scene,this.camera)}}const H=()=>{const i=g.useRef(null);return g.useEffect(()=>{console.log("useEffect: ",i.current);const e=new j(i.current);return()=>{e.cleanUp()}},[]),F.jsx("div",{ref:i,style:{width:"100%",height:"100%"}})};export{H as default};
