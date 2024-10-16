var w=Object.defineProperty;var S=(o,e,t)=>e in o?w(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var r=(o,e,t)=>S(o,typeof e!="symbol"?e+"":e,t);import{r as d,j as z}from"./index-BbOwRU_d.js";import{O as c,u as y,N as p,R as v,q as P,r as k,l,s as h,t as u,f as m,i as g,W as A}from"./three.module-BxuQ6Me3.js";const C=`precision highp float;\r
\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0., 1.);\r
    vUv = uv;\r
    gl_Position = vPosition;\r
}`,R=`precision highp float;\r
\r
uniform sampler2D accumulatorMap;\r
uniform vec2 resolution;\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec4 color = texture2D(accumulatorMap, vUv);\r
    gl_FragColor = vec4(color.rgb, 1.0);\r
}`,I=`precision highp float;\r
\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0.0, 1.0);\r
    vUv = uv;\r
    gl_Position = vPosition;\r
}`,U=`precision highp float;\r
\r
uniform sampler2D mandelMap;\r
uniform vec4 box;\r
uniform vec2 resolution;\r
uniform vec2 subpixelOffset;    // [-0.5,0.5]x[-0.5,0.5]\r
uniform int restart;            // 1: restart from zero\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec4 tex = (restart == 1) ? vec4(0.0, 0.0, 0.0, 1.0) : texture2D(mandelMap, vUv);\r
\r
    vec2 cSubpixelOffset = subpixelOffset / resolution * vec2(box.z-box.x, box.w-box.y);\r
    vec2 c = vec2(mix(box.x, box.z, vUv.x), mix(box.y, box.w, vUv.y)) + cSubpixelOffset;\r
    vec2 z = tex.xy;\r
    float iter = tex.z;\r
\r
    int k;\r
    for (k = 0; (k < 100) && (z.x*z.x + z.y*z.y < 100.0); k++) {\r
        float temp = 2.0*z.x*z.y + c.y;\r
        z.x = z.x*z.x - z.y*z.y + c.x;\r
        z.y = temp;\r
    }\r
    iter = iter + float(k);\r
\r
    gl_FragColor = vec4(z, iter, 1.0);\r
}\r
`,F=`precision highp float;\r
\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0., 1.);\r
    vUv = uv;\r
    gl_Position = vPosition;\r
}`,D=`precision highp float;\r
\r
uniform sampler2D mandelMap;\r
uniform sampler2D accumulatorMap;\r
uniform vec2 resolution;\r
uniform int restart;            // 1: restart from zero\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
vec3 hsv2rgb(vec3 c) {\r
    // Source: https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl\r
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\r
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\r
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\r
}\r
\r
vec4 getColor(vec2 uv) {\r
    vec4 tex = texture2D(mandelMap, uv);\r
    vec2 z = tex.xy;\r
    float iter = tex.z;\r
\r
    float r2 = z.x*z.x + z.y*z.y;\r
    iter = iter - log(log(r2)/log(100.0))/log(2.0);\r
\r
    if (r2 < 4.0)\r
        return vec4(0.0, 0.0, 0.0, 1.0);\r
\r
    return vec4(hsv2rgb(vec3(fract(log(1.0+iter)), 1.0, 1.0)), 1.0);\r
}\r
\r
// void main() {\r
//     vec4 color = vec4(0.0);\r
//     for (int k1 = 0; k1 < 4; k1++)\r
//         for (int k2 = 0; k2 < 4; k2++)\r
//             color = color + getColor(vUv+vec2(float(k1)/4.0, float(k2)/4.0)/resolution)/16.0;\r
\r
//     float aspect = resolution.x / resolution.y;\r
//     float t = length((vUv-vec2(0.5))*vec2(aspect, 1.0));\r
//     if (t < 0.05 && t > 0.048)\r
//         color = vec4(1.0, 1.0, 1.0, 1.0);\r
\r
//     gl_FragColor = color;\r
// }\r
\r
void main() {\r
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);\r
    float iter = accOld.a;\r
    vec4 color = getColor(vUv);\r
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);\r
    gl_FragColor = vec4(accNewColor, iter+1.0);\r
}`;class T{constructor(e){r(this,"container");r(this,"camera");r(this,"fbosMandelbrot",[]);r(this,"fbosAccumulator",[]);r(this,"currentFboIndexMandelbrot",0);r(this,"currentFboIndexAccumulator",0);r(this,"disposeFbos");r(this,"sceneMandelbrot");r(this,"sceneAccumulator");r(this,"shaderMandelbrot");r(this,"shaderAccumulator");r(this,"workProgress",null);this.container=e,this.setupMandelbrotScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosMandelbrot.forEach(t=>t.dispose()),this.fbosAccumulator.forEach(t=>t.dispose())},this.resize()}resize(){const{clientWidth:e,clientHeight:t}=this.container,n=e/t;this.camera instanceof c&&(this.camera.top=1,this.camera.bottom=-1,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderMandelbrot.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexMandelbrot=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosMandelbrot.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(){const{clientWidth:e,clientHeight:t}=this.container;return new y(e,t,{minFilter:p,magFilter:p,wrapS:v,wrapT:v,format:P,type:k})}setupMandelbrotScene(){this.sceneMandelbrot=new l,this.shaderMandelbrot=new h({uniforms:{box:{value:null},subpixelOffset:{value:null},mandelMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:I,fragmentShader:U});const e=new u(2,2),t=new m(e,this.shaderMandelbrot);this.sceneMandelbrot.add(t)}setupAccumulatorScene(){this.sceneAccumulator=new l,this.shaderAccumulator=new h({uniforms:{mandelMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:F,fragmentShader:D});const e=new u(2,2),t=new m(e,this.shaderAccumulator);this.sceneAccumulator.add(t)}setupCamera(){this.camera=new c(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new g(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;const{clientWidth:e,clientHeight:t}=this.container,n=e/t;this.shaderMandelbrot.uniforms.box.value=[this.workProgress.zoomCenter[0]-n*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]-this.workProgress.zoomScale,this.workProgress.zoomCenter[0]+n*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]+this.workProgress.zoomScale]}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentMandelbrotFboTexture(){return this.fbosMandelbrot[this.currentFboIndexMandelbrot].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){const n=e%t/t,s=Math.floor(e/t)/t;return[n+.5/t,s+.5/t]}iterateMandelbrot(e,t,n){const[s,i]=[this.currentFboIndexMandelbrot,(this.currentFboIndexMandelbrot+1)%2];this.shaderMandelbrot.uniforms.mandelMap.value=this.fbosMandelbrot[s].texture,this.shaderMandelbrot.uniforms.subpixelOffset.value=n,this.shaderMandelbrot.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosMandelbrot[i]),e.render(this.sceneMandelbrot,this.camera),e.setRenderTarget(null),this.currentFboIndexMandelbrot=i}accumulateSample(e,t){const[n,s]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.mandelMap.value=this.getCurrentMandelbrotFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[n].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosAccumulator[s]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=s}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;const t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateMandelbrot(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}}class E{constructor(e){r(this,"container");r(this,"scene");r(this,"camera");r(this,"renderer");r(this,"cleanUpTasks");r(this,"animationRequestID",null);r(this,"lastTime",null);r(this,"isStopped",!1);r(this,"mandelbrotScene");r(this,"mandelbrotStage");r(this,"shader",null);r(this,"zoomCenter",[-.5,0]);r(this,"zoomScale",1);this.container=e,this.cleanUpTasks=[],this.renderer=new A({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.renderer.getContext().getExtension("EXT_float_blend"),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.mandelbrotScene=new T(e),this.resetMandelbrotStage(),this.setupResizeRenderer(),this.resizeRenderer(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate(),this.handleInputs()}resizeRenderer(){var s;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),console.log(`Resize! (${e}, ${t})`);const n=e/t;this.camera instanceof c&&(this.camera.top=1,this.camera.bottom=-1,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.shader.uniforms.resolution.value=this.getResolution(),(s=this.mandelbrotScene)==null||s.resize(),this.resetMandelbrotStage()}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}handleInputs(){}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new l;this.shader=new h({uniforms:{accumulatorMap:{value:null},resolution:{value:null},time:{value:0}},vertexShader:C,fragmentShader:R});const t=new u(2,2),n=new m(t,this.shader);return e.add(n),e}setupCamera(){const e=new c(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new g(e,t)}saveAsImage(e){const n=this.renderer.domElement.toDataURL("image/png"),s=document.createElement("a");s.href=n,s.download=e+".png",document.body.appendChild(s),s.click(),document.body.removeChild(s)}resetMandelbrotStage(){this.mandelbrotStage=0,this.progressMandelbrotStage()}progressMandelbrotStage(){if(this.mandelbrotStage>=5)return;const e={zoomCenter:this.zoomCenter,zoomScale:this.zoomScale,iterations:[5,20,30,50,50][this.mandelbrotStage],samplesPerAxis:[1,1,2,4,10][this.mandelbrotStage]};this.mandelbrotScene.assignWork(e),this.mandelbrotStage++}pointerInput(e,t,n,s){const i=this.getResolution(),a=i.x/i.y;this.zoomCenter=[this.zoomCenter[0]-this.zoomScale*2*a*e/i.x,this.zoomCenter[1]+this.zoomScale*2*t/i.y],this.zoomScale=this.zoomScale*n,this.resetMandelbrotStage()}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const t=(this.lastTime??0)+(e?0:.01);this.lastTime=t,this.mandelbrotScene.step(this.renderer)&&(this.shader.uniforms.accumulatorMap.value=this.mandelbrotScene.getCurrentAccumulatorFboTexture(),this.renderer.render(this.scene,this.camera),this.progressMandelbrotStage())}}class O{constructor(e,t){r(this,"container");r(this,"handler");r(this,"pointers",new Map);r(this,"initialDistance",null);r(this,"initialAngle",null);r(this,"lastMidpoint",null);r(this,"onPointerDown",e=>{if(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.pointers.size===2){const[t,n]=Array.from(this.pointers.values());this.initialDistance=this.getDistance(t,n),this.initialAngle=this.getAngle(t,n),this.lastMidpoint=this.getMidpoint(t,n)}});r(this,"onPointerMove",e=>{if(this.pointers.has(e.pointerId)){if(this.pointers.size===1){const t=this.pointers.get(e.pointerId),n=e.clientX-t.x,s=e.clientY-t.y;this.handler.pointerInput(n,s,1,0)}else if(this.pointers.size===2){const[t,n]=Array.from(this.pointers.values()),s=this.getDistance(t,n),i=this.getAngle(t,n),a=this.getMidpoint(t,n);if(this.initialDistance&&this.initialAngle&&this.lastMidpoint){const f=s/this.initialDistance,b=i-this.initialAngle,x=a.x-this.lastMidpoint.x,M=a.y-this.lastMidpoint.y;this.handler.pointerInput(x,M,f,b),this.lastMidpoint=a}}this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY})}});r(this,"onPointerUp",e=>{this.pointers.delete(e.pointerId),this.pointers.size<2&&(this.initialDistance=null,this.initialAngle=null,this.lastMidpoint=null)});r(this,"onWheel",e=>{e.preventDefault();const t=e.deltaY<0?1/1.2:1.2;this.handler.pointerInput(0,0,t,0)});this.container=e,this.handler=t,this.container.addEventListener("pointerdown",this.onPointerDown),this.container.addEventListener("pointermove",this.onPointerMove),this.container.addEventListener("pointerup",this.onPointerUp),this.container.addEventListener("pointercancel",this.onPointerUp),this.container.addEventListener("wheel",this.onWheel)}getDistance(e,t){const n=t.x-e.x,s=t.y-e.y;return Math.sqrt(n*n+s*s)}getAngle(e,t){return Math.atan2(t.y-e.y,t.x-e.x)}getMidpoint(e,t){return{x:(e.x+t.x)/2,y:(e.y+t.y)/2}}cleanup(){this.container.removeEventListener("pointerdown",this.onPointerDown),this.container.removeEventListener("pointermove",this.onPointerMove),this.container.removeEventListener("pointerup",this.onPointerUp),this.container.removeEventListener("pointercancel",this.onPointerUp),this.container.removeEventListener("wheel",this.onWheel)}}const q=()=>{const o=d.useRef(null);return d.useEffect(()=>{console.log("useEffect: ",o.current);const e=new E(o.current),t=new O(o.current,e);return()=>{e.cleanUp(),t.cleanup()}},[]),z.jsx("div",{ref:o,style:{width:"100%",height:"100%"}})};export{q as default};
