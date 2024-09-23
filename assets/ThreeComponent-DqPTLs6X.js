var y=Object.defineProperty;var z=(i,e,r)=>e in i?y(i,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[e]=r;var t=(i,e,r)=>z(i,typeof e!="symbol"?e+"":e,r);import{r as x,j as A}from"./index-FK1fruWa.js";import{l as P,O as f,p as I,q as m,r as g,N as h,s as b,t as M,f as R,u as F,R as S,W as k,B as D,w as q,x as w,e as C,i as T}from"./three.module-BxuQ6Me3.js";const U=`varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = vec4(position.xy, 0.0, 1.);\r
}`,E=`uniform sampler2D trailMap;\r
uniform sampler2D uPosition;\r
uniform vec2 resolution;    // dimensions of trailMap\r
uniform float time;\r
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
// see https://en.wikipedia.org/wiki/Relative_luminance\r
float brightness(vec4 color) {\r
    return (0.2126*color.r + 0.7152*color.g + 0.0722*color.b)*color.a;\r
}\r
\r
vec2 wrap(vec2 p) {\r
    float aspect = resolution.x/resolution.y;\r
    vec2 q = vec2(mod(p.x+aspect, 2.*aspect)-aspect, mod(p.y+1., 2.)-1.);\r
    return q;\r
}\r
\r
vec4 newPosition(vec4 p) {\r
    float a = 1.2;\r
    float b = 0.01;\r
    float c = 0.7;\r
    float speed = 0.01;\r
    float sensorAngle = 45.0/180.0*3.14159;\r
    float turningAngle = 15.0/180.0*3.14159;\r
    float sensorDist = 2.0*speed;\r
    float aspect = resolution.x/resolution.y;\r
    vec2 res = 2.*vec2(aspect, 1.);\r
    vec2 offset = vec2(0.5);\r
\r
    vec2 v0 = p.xy + sensorDist*vec2(cos(p.z), sin(p.z));\r
    vec2 v1 = p.xy + sensorDist*vec2(cos(p.z+sensorAngle), sin(p.z+sensorAngle));\r
    vec2 v2 = p.xy + sensorDist*vec2(cos(p.z-sensorAngle), sin(p.z-sensorAngle));\r
    vec2 w0 = p.xy + speed*vec2(cos(p.z), sin(p.z));\r
    vec2 w1 = p.xy + speed*vec2(cos(p.z+turningAngle), sin(p.z+turningAngle));\r
    vec2 w2 = p.xy + speed*vec2(cos(p.z-turningAngle), sin(p.z-turningAngle));\r
\r
    vec4 q0 = vec4(w0, p.z, p.w);\r
    vec4 q1 = vec4(w1, p.z+turningAngle, p.w);\r
    vec4 q2 = vec4(w2, p.z-turningAngle, p.w);\r
    vec2 uv0 = v0/res + offset;\r
    vec2 uv1 = v1/res + offset;\r
    vec2 uv2 = v2/res + offset;\r
\r
    vec4 trail0 = texture2D(trailMap, uv0);\r
    vec4 trail1 = texture2D(trailMap, uv1);\r
    vec4 trail2 = texture2D(trailMap, uv2);\r
    float b0 = brightness(trail0);\r
    float b1 = brightness(trail1);\r
    float b2 = brightness(trail2);\r
\r
    if ((b0 > a*b1+b) && (b0 > a*b2+b) && (b0 < c))\r
        return q0;\r
    if ((b0 <= a*b1+b) && (b0 <= a*b2+b)) {\r
        if (random21(p.xy+vec2(time)) > 0.5)\r
            return q1;\r
        return q2;\r
    }\r
    if (b1 < b2)\r
        return q2;\r
    return q1;\r
}\r
\r
void main() {\r
    vec4 p = texture2D(uPosition, vUv);\r
    vec4 q = newPosition(vec4(wrap(p.xy), p.zw));\r
    gl_FragColor = vec4(wrap(q.xy), q.zw);\r
}`,s=512;class _{constructor(e){t(this,"baseScene");t(this,"scene");t(this,"camera");t(this,"shaderMaterial");t(this,"initialPositionsTexture");t(this,"fbos");t(this,"currentFboIndex");this.baseScene=e,this.scene=new P,this.camera=new f(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const r=new Float32Array(s*s*4);for(let o=0;o<s;o++)for(let l=0;l<s;l++){let u=o*s+l,d=Math.random()*Math.PI*2,a=.3+.7*Math.random();r[u*4+0]=a*Math.cos(d),r[u*4+1]=a*Math.sin(d),r[u*4+2]=Math.random()*2*Math.PI,r[u*4+3]=0}this.initialPositionsTexture=new I(r,s,s,m,g),this.initialPositionsTexture.minFilter=h,this.initialPositionsTexture.magFilter=h,this.initialPositionsTexture.needsUpdate=!0,this.shaderMaterial=new b({uniforms:{uPosition:{value:this.initialPositionsTexture},trailMap:{value:this.baseScene.fbos[0].texture},resolution:{value:this.baseScene.getResolution()},time:{value:0}},vertexShader:U,fragmentShader:E});const n=new M(2,2),c=new R(n,this.shaderMaterial);this.scene.add(c),this.fbos=[];for(let o=0;o<2;o++){const l=this.createRenderTarget();this.fbos.push(l),this.baseScene.renderer.setRenderTarget(l),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new F(s,s,{minFilter:h,magFilter:h,wrapS:S,wrapT:S,format:m,type:g})}step(e){const[r,n]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.shaderMaterial.uniforms.uPosition.value=this.fbos[r].texture,e.setRenderTarget(this.fbos[n]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=n}}const W=`// From three.js: position, uv, normal\r
\r
uniform sampler2D particleMap;\r
varying vec4 vParticle;\r
\r
void main() {\r
    vParticle = texture2D(particleMap, position.xy);\r
    gl_PointSize = 3.;\r
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
    gl_FragColor = vec4(0.2, 0.5, 1., 0.02);\r
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
    vec2 uv = 0.5*(vPosition.xy+vec2(1.));\r
\r
    vec2 texelSize = 1.0/resolution;\r
\r
    vec4 colorSum = vec4(0.);\r
\r
    // Apply 3x3 Gaussian blur\r
    for (int k = 0; k < 9; k++) {\r
        vec2 elementUV = uv + gaussianOffsets[k]*texelSize;\r
        vec4 value = texture2D(trailMap, elementUV);\r
        colorSum += value*gaussianKernel[k];\r
    }\r
    vec4 blurredFadedColor = 0.9*colorSum;\r
\r
    gl_FragColor = vec4(blurredFadedColor.rgb, 1.0);\r
}\r
`;class G{constructor(e){t(this,"container");t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"cleanUpTasks");t(this,"animationRequestID",null);t(this,"lastTime",null);t(this,"isStopped",!1);t(this,"fbos",[]);t(this,"currentFboIndex",-1);t(this,"disposeFbos");t(this,"particleScene");t(this,"shaderMaterialPoints",null);t(this,"shaderMaterialTrail",null);this.container=e,this.cleanUpTasks=[],this.renderer=new k({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.renderer.getContext().getExtension("EXT_float_blend"),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.disposeFbos=()=>this.fbos.forEach(n=>n.dispose()),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new _(this),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID),this.disposeFbos()}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:r}=this.container;this.renderer.setSize(e,r),console.log(`Resize! (${e}, ${r})`);const n=e/r;this.camera instanceof f&&(this.camera.top=1,this.camera.bottom=-1,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderMaterialTrail.uniforms.resolution.value=this.getResolution(),this.particleScene&&(this.particleScene.shaderMaterial.uniforms.resolution.value=this.getResolution())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}setupFbos(){this.disposeFbos(),this.fbos=[];for(let e=0;e<2;e++){const r=this.createRenderTarget();this.fbos.push(r)}this.currentFboIndex=0}createRenderTarget(){const{clientWidth:e,clientHeight:r}=this.container;return new F(e,r,{minFilter:h,magFilter:h,format:m,type:g})}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new P,r=new D,n=new Float32Array(s*s*3);for(let a=0;a<s;a++)for(let p=0;p<s;p++){let v=a*s+p;n[v*3+0]=a/s,n[v*3+1]=p/s,n[v*3+2]=0}r.setAttribute("position",new q(n,3)),this.shaderMaterialPoints=new b({uniforms:{particleMap:{value:null},time:{value:0}},vertexShader:W,fragmentShader:j,blending:w,depthWrite:!1,depthTest:!1});const c=new C(r,this.shaderMaterialPoints);c.frustumCulled=!1,e.add(c);const o=[[-1,1],[0,1],[1,1],[-1,0],[0,0],[1,0],[-1,-1],[0,-1],[1,-1]],l=[1/16,2/16,1/16,2/16,4/16,2/16,1/16,2/16,1/16];this.shaderMaterialTrail=new b({uniforms:{trailMap:{value:null},resolution:{value:null},gaussianOffsets:{value:o.map(a=>new T(a[0],a[1]))},gaussianKernel:{value:l},time:{value:0}},vertexShader:B,fragmentShader:O,blending:w,depthWrite:!1});const u=new M(2,2),d=new R(u,this.shaderMaterialTrail);return e.add(d),e}setupCamera(){const e=new f(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}getResolution(){const{clientWidth:e,clientHeight:r}=this.container;return new T(e,r)}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const r=(this.lastTime??0)+(e?0:.01);this.lastTime=r;const[n,c]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.particleScene.shaderMaterial.uniforms.time.value=r,this.particleScene.shaderMaterial.uniforms.trailMap.value=this.fbos[n].texture,e||this.particleScene.step(this.renderer),this.shaderMaterialPoints.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture,this.shaderMaterialTrail.uniforms.trailMap.value=this.fbos[n].texture,this.renderer.setRenderTarget(this.fbos[c]),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.currentFboIndex=c,this.renderer.render(this.scene,this.camera)}}const L=()=>{const i=x.useRef(null);return x.useEffect(()=>{console.log("useEffect: ",i.current);const e=new G(i.current);return()=>{e.cleanUp()}},[]),A.jsx("div",{ref:i,style:{width:"100%",height:"100%"}})};export{L as default};
