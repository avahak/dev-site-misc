var R=Object.defineProperty;var F=(i,e,r)=>e in i?R(i,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[e]=r;var t=(i,e,r)=>F(i,typeof e!="symbol"?e+"":e,r);import{r as x,j as q}from"./index-zS4SkAAL.js";import{l as T,O as m,p as z,q as f,r as g,N as u,s as b,t as M,f as w,u as y,W as I,B as k,w as A,x as S,e as C,i as P}from"./three.module-BxuQ6Me3.js";const D=`varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = vec4(position.xy, 0.0, 1.);\r
}`,U=`/*\r
020 no change\r
202 turn randomly \r
012 turn right\r
210 turn left \r
*/\r
\r
uniform sampler2D trailMap;\r
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
    // maybe easier with mod\r
    float aspect = resolution.x/resolution.y;\r
    // vec2 q = p;\r
    vec2 q = vec2(mod(p.x+aspect, 2.*aspect)-aspect, mod(p.y+1., 2.)-1.);\r
    // q.x = mod(q.x+aspect, 2.*aspect)-aspect;\r
    // q.y = mod(q.x+1., 2.)-1.;\r
    // if (q.x > aspect)\r
    //     q.x -= aspect;\r
    // if (q.x < -aspect)\r
    //     q.x += aspect;\r
    // if (q.y > 1.)\r
    //     q.y -= 1.;\r
    // if (q.y < -1.)\r
    //     q.y += 1.;\r
    return q;\r
}\r
\r
vec4 newPosition(vec4 p) {\r
    float d = 0.02;\r
    float sensorAngle = 0.2;\r
    float aspect = resolution.x/resolution.y;\r
    vec2 res = 2.*vec2(aspect, 1.);\r
    vec2 offset = vec2(0.5);\r
\r
    vec2 v0 = vec2(cos(p.z), sin(p.z));\r
    vec2 v1 = vec2(cos(p.z+sensorAngle), sin(p.z+sensorAngle));\r
    vec2 v2 = vec2(cos(p.z-sensorAngle), sin(p.z-sensorAngle));\r
\r
    vec4 q0 = vec4(p.xy + d*v0, p.z, p.w);\r
    vec4 q1 = vec4(p.xy + d*v1, p.z+sensorAngle, p.w);\r
    vec4 q2 = vec4(p.xy + d*v2, p.z-sensorAngle, p.w);\r
    vec2 uv0 = wrap(p.xy + d*v0)/res + offset;\r
    vec2 uv1 = wrap(p.xy + d*v1)/res + offset;\r
    vec2 uv2 = wrap(p.xy + d*v2)/res + offset;\r
\r
    vec4 trail0 = texture2D(trailMap, uv0);\r
    vec4 trail1 = texture2D(trailMap, uv1);\r
    vec4 trail2 = texture2D(trailMap, uv2);\r
    float b0 = brightness(trail0);\r
    float b1 = brightness(trail1);\r
    float b2 = brightness(trail2);\r
\r
    if ((b0 > b1) && (b0 > b2))\r
        return q0;\r
    if ((b0 <= b1) && (b0 <= b2)) {\r
        if (random21(p.xy+vec2(time)) > 0.5)\r
            return q1;\r
        return q2;\r
    }\r
    if ((b0 <= b1) && (b0 > b2))\r
        return q1;\r
    return q2;\r
}\r
\r
void main() {\r
    vec4 p = texture2D(uPosition, vUv);\r
    vec4 q = newPosition(p);\r
    q.xy = wrap(q.xy);\r
    gl_FragColor = q;\r
}\r
`,s=512;class E{constructor(e){t(this,"baseScene");t(this,"scene");t(this,"camera");t(this,"shaderMaterial");t(this,"initialPositionsTexture");t(this,"fbos");t(this,"currentFboIndex");this.baseScene=e,this.scene=new T,this.camera=new m(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const r=new Float32Array(s*s*4);for(let o=0;o<s;o++)for(let l=0;l<s;l++){let h=o*s+l,d=Math.random()*Math.PI*2,a=.3+.7*Math.random();r[h*4+0]=a*Math.cos(d),r[h*4+1]=a*Math.sin(d),r[h*4+2]=Math.random()*2*Math.PI,r[h*4+3]=0}this.initialPositionsTexture=new z(r,s,s,f,g),this.initialPositionsTexture.minFilter=u,this.initialPositionsTexture.magFilter=u,this.initialPositionsTexture.needsUpdate=!0,this.shaderMaterial=new b({uniforms:{uPosition:{value:this.initialPositionsTexture},trailMap:{value:this.baseScene.fbos[0].texture},resolution:{value:this.baseScene.getResolution()},time:{value:0}},vertexShader:D,fragmentShader:U});const n=new M(2,2),c=new w(n,this.shaderMaterial);this.scene.add(c),this.fbos=[];for(let o=0;o<2;o++){const l=this.createRenderTarget();this.fbos.push(l),this.baseScene.renderer.setRenderTarget(l),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new y(s,s,{minFilter:u,magFilter:u,format:f,type:g})}step(e){const[r,n]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.shaderMaterial.uniforms.uPosition.value=this.fbos[r].texture,e.setRenderTarget(this.fbos[n]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=n}}const _=`// From three.js: position, uv, normal\r
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
    gl_FragColor = vec4(0.2, 0.5, 1., 0.001);\r
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
    vec2 uv = 0.5*(vPosition.xy+vec2(1.0));\r
\r
    vec2 texelSize = 1.0/resolution;\r
\r
    vec4 colorSum = vec4(0.0);\r
\r
    // Apply 3x3 Gaussian blur\r
    for (int k = 0; k < 9; k++) {\r
        vec2 elementUV = uv + gaussianOffsets[k]*texelSize;\r
        vec4 value = texture2D(trailMap, elementUV);\r
        colorSum += value*gaussianKernel[k];\r
    }\r
    vec4 blurredFadedColor = 0.99*colorSum;\r
\r
    gl_FragColor = vec4(blurredFadedColor.rgb, 1.0);\r
}\r
`;class W{constructor(e){t(this,"container");t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"cleanUpTasks");t(this,"animationRequestID",null);t(this,"lastTime",null);t(this,"isStopped",!1);t(this,"fbos",[]);t(this,"currentFboIndex",-1);t(this,"disposeFbos");t(this,"particleScene");t(this,"shaderMaterialPoints",null);t(this,"shaderMaterialTrail",null);this.container=e,this.cleanUpTasks=[],this.renderer=new I({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.renderer.getContext().getExtension("EXT_float_blend"),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.disposeFbos=()=>this.fbos.forEach(n=>n.dispose()),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new E(this),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID),this.disposeFbos()}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:r}=this.container;this.renderer.setSize(e,r),console.log(`Resize! (${e}, ${r})`);const n=e/r;this.camera instanceof m&&(this.camera.top=1,this.camera.bottom=-1,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderMaterialTrail.uniforms.resolution.value=this.getResolution(),this.particleScene&&(this.particleScene.shaderMaterial.uniforms.resolution.value=this.getResolution())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}setupFbos(){this.disposeFbos(),this.fbos=[];for(let e=0;e<2;e++){const r=this.createRenderTarget();this.fbos.push(r)}this.currentFboIndex=0}createRenderTarget(){const{clientWidth:e,clientHeight:r}=this.container;return new y(e,r,{minFilter:u,magFilter:u,format:f,type:g})}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new T,r=new k,n=new Float32Array(s*s*3);for(let a=0;a<s;a++)for(let v=0;v<s;v++){let p=a*s+v;n[p*3+0]=a/s,n[p*3+1]=v/s,n[p*3+2]=0}r.setAttribute("position",new A(n,3)),this.shaderMaterialPoints=new b({uniforms:{particleMap:{value:null},time:{value:0}},vertexShader:_,fragmentShader:j,blending:S,depthWrite:!1});const c=new C(r,this.shaderMaterialPoints);c.frustumCulled=!1,e.add(c);const o=[[-1,1],[0,1],[1,1],[-1,0],[0,0],[1,0],[-1,-1],[0,-1],[1,-1]],l=[1/16,2/16,1/16,2/16,4/16,2/16,1/16,2/16,1/16];this.shaderMaterialTrail=new b({uniforms:{trailMap:{value:null},resolution:{value:null},gaussianOffsets:{value:o.map(a=>new P(a[0],a[1]))},gaussianKernel:{value:l},time:{value:0}},vertexShader:B,fragmentShader:O,blending:S,depthWrite:!1});const h=new M(2,2),d=new w(h,this.shaderMaterialTrail);return e.add(d),e}setupCamera(){const e=new m(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}getResolution(){const{clientWidth:e,clientHeight:r}=this.container;return new P(e,r)}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const r=(this.lastTime??0)+(e?0:.01);this.lastTime=r;const[n,c]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.particleScene.shaderMaterial.uniforms.time.value=r,this.particleScene.shaderMaterial.uniforms.trailMap.value=this.fbos[n].texture,e||this.particleScene.step(this.renderer),this.shaderMaterialPoints.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture,this.shaderMaterialTrail.uniforms.trailMap.value=this.fbos[n].texture,this.renderer.setRenderTarget(this.fbos[c]),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.currentFboIndex=c,this.renderer.render(this.scene,this.camera)}}const H=()=>{const i=x.useRef(null);return x.useEffect(()=>{console.log("useEffect: ",i.current);const e=new W(i.current);return()=>{e.cleanUp()}},[]),q.jsx("div",{ref:i,style:{width:"100%",height:"100%"}})};export{H as default};
