import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{B as r,I as i,Q as a,V as o,W as s,X as c,Y as l,dt as u,et as d,mt as f,nt as p,r as m,rt as h,v as g}from"./three.module-BYtFjljp.js";import{t as _}from"./index-IesZhgCH.js";var v=e(t(),1),y=`precision highp float;\r
\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0.0, 1.);\r
    vUv = uv;\r
    gl_Position = vPosition;\r
}`,b=`precision highp float;\r
\r
uniform sampler2D accumulatorMap1;\r
uniform sampler2D accumulatorMap2;\r
uniform vec2 resolution;\r
uniform int showMandelbrot;\r
uniform int showJulia;\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
vec3 juliaBaseColor = vec3(1.0, 0.9, 0.9);\r
\r
void main() {\r
    vec4 color1 = texture2D(accumulatorMap1, vUv);\r
    vec4 color2 = texture2D(accumulatorMap2, vUv);\r
    if (showMandelbrot != 1 || showJulia != 1) {\r
        gl_FragColor = vec4(float(showMandelbrot)*color1.rgb + float(showJulia)*color2.r*juliaBaseColor, 1.0);\r
        return;\r
    }\r
    gl_FragColor = vec4(color1.rgb*(0.3-0.25*color2.b), 1.0) + vec4(color2.r*juliaBaseColor, color2.b);\r
}`,x=`precision highp float;\r
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
    for (k = 0; (k < 1000) && (length(z) < 1.0e2); k++) {\r
        float temp = 2.0*z.x*z.y + c.y;\r
        z.x = z.x*z.x - z.y*z.y + c.x;\r
        z.y = temp;\r
    }\r
    iter = iter + float(k);\r
\r
    gl_FragColor = vec4(z, iter, 1.0);\r
}\r
`,S=`precision highp float;\r
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
    float r = length(z);\r
    iter = iter - log(log(r)/log(100.0))/log(2.0);\r
\r
    if (r < 2.0)\r
        return vec4(0.0, 0.0, 0.0, 1.0);\r
\r
    return vec4(hsv2rgb(vec3(fract(0.5*log(1.0+iter)), 0.9, 0.7)), 1.0);\r
}\r
\r
void main() {\r
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);\r
    float iter = accOld.a;\r
    vec4 color = getColor(vUv);\r
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);\r
    gl_FragColor = vec4(accNewColor, iter+1.0);\r
}`,C=`precision highp float;\r
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
    vec4 tex = (restart == 1) ? vec4(0.0, 0.0, 0.0, 0.0) : texture2D(mandelMap, vUv);\r
\r
    vec2 cSubpixelOffset = subpixelOffset / resolution * vec2(box.z-box.x, box.w-box.y);\r
    vec2 c = vec2(mix(box.x, box.z, vUv.x), mix(box.y, box.w, vUv.y)) + cSubpixelOffset;\r
    vec2 z = tex.xy;\r
    vec2 w = tex.zw;\r
\r
    int k;\r
    float temp;\r
    for (k = 0; (k < 1000) && (length(z) < 1.0e2); k++) {\r
\r
        if (length(w) < 1.0e32) {\r
            temp = 2.0*z.x*w.y + 2.0*z.y*w.x;\r
            w.x = 2.0*z.x*w.x - 2.0*z.y*w.y + 1.0;\r
            w.y = temp;\r
        }\r
\r
        temp = 2.0*z.x*z.y + c.y;\r
        z.x = z.x*z.x - z.y*z.y + c.x;\r
        z.y = temp;\r
    }\r
\r
    gl_FragColor = vec4(z, w);\r
}\r
`,w=`precision highp float;\r
\r
uniform sampler2D mandelMap;\r
uniform sampler2D accumulatorMap;\r
uniform vec2 resolution;\r
uniform int restart;            // 1: restart from zero\r
uniform float scale;\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
vec3 baseColor = vec3(0.9, 0.9, 1.0);\r
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
    vec2 w = tex.zw;\r
\r
    float rz = length(z);\r
    float rw = length(w);\r
\r
    if (rz < 1.0e2)\r
        return vec4(0.0, 0.0, 0.0, 1.0);        // 0\r
    if (rw > 1.0e32)\r
        return vec4(baseColor, 1.0);        // -1\r
\r
    float d = 2.0*(rz/rw)*log(rz);\r
\r
    float b = 0.1*scale;\r
\r
    float s = log(d/b);\r
    vec3 colorOut = hsv2rgb(vec3(fract(s), 1.0, 1.0));\r
\r
    if (d > b)\r
        return vec4(0.0*colorOut, 1.0);\r
\r
    if (d > 0.1*b) {\r
        float t = smoothstep(0.1*b, b, d);\r
        return vec4(mix(0.1*baseColor, vec3(0.0), t), 1.0);\r
    }\r
\r
    if (d > 0.01*b) {\r
        float t = smoothstep(0.01*b, 0.1*b, d);\r
        return vec4(mix(0.2*baseColor, 0.1*baseColor, t), 1.0);\r
    }\r
\r
    if (d > 0.001*b) {\r
        float t = smoothstep(0.001*b, 0.01*b, d);\r
        return vec4(mix(0.4*baseColor, 0.2*baseColor, t), 1.0);\r
    }\r
\r
    float t = smoothstep(0.0, 0.001*b, d);\r
    return vec4(mix(baseColor, 0.4*baseColor, t), 1.0);\r
}\r
\r
void main() {\r
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);\r
    float iter = accOld.a;\r
    vec4 color = getColor(vUv);\r
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);\r
    gl_FragColor = vec4(accNewColor, iter+1.0);\r
}`,T=class{constructor(e){this.fbosMandelbrot=[],this.fbosAccumulator=[],this.currentFboIndexMandelbrot=0,this.currentFboIndexAccumulator=0,this.mandelbrotMode=`basic`,this.workProgress=null,this.container=e,this.setupMandelbrotScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosMandelbrot.forEach(e=>e.dispose()),this.fbosAccumulator.forEach(e=>e.dispose())},this.resize()}resize(){let{clientWidth:e,clientHeight:t}=this.container,n=e/t,[r,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.camera instanceof o&&(this.camera.top=i,this.camera.bottom=-i,this.camera.left=-r,this.camera.right=r,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderMandelbrot.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexMandelbrot=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosMandelbrot.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(){let{clientWidth:e,clientHeight:t}=this.container;return new f(e,t,{minFilter:r,magFilter:r,wrapS:d,wrapT:d,format:l,type:g})}setupMandelbrotScene(){this.sceneMandelbrot=new p,this.shaderMandelbrot1=new h({uniforms:{box:{value:null},subpixelOffset:{value:null},mandelMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:y,fragmentShader:x}),this.shaderMandelbrot2=new h({uniforms:{box:{value:null},subpixelOffset:{value:null},mandelMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:y,fragmentShader:C}),this.shaderMandelbrot=this.shaderMandelbrot1,this.meshMandelbrot=new i(new s(2,2),this.shaderMandelbrot),this.sceneMandelbrot.add(this.meshMandelbrot)}setupAccumulatorScene(){this.sceneAccumulator=new p,this.shaderAccumulator1=new h({uniforms:{mandelMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},scale:{value:null},restart:{value:1}},vertexShader:y,fragmentShader:S}),this.shaderAccumulator2=new h({uniforms:{mandelMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},scale:{value:null},restart:{value:1}},vertexShader:y,fragmentShader:w}),this.shaderAccumulator=this.shaderAccumulator1,this.meshAccumulator=new i(new s(2,2),this.shaderAccumulator),this.sceneAccumulator.add(this.meshAccumulator)}setupCamera(){this.camera=new o(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){let{clientWidth:e,clientHeight:t}=this.container;return new u(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;let{clientWidth:e,clientHeight:t}=this.container,n=e/t,[r,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.box=[this.workProgress.zoomCenter[0]-r*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]-i*this.workProgress.zoomScale,this.workProgress.zoomCenter[0]+r*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]+i*this.workProgress.zoomScale],this.shaderMandelbrot.uniforms.box.value=this.box}switchMode(){this.mandelbrotMode===`basic`?(this.shaderAccumulator=this.shaderAccumulator2,this.shaderMandelbrot=this.shaderMandelbrot2):(this.shaderAccumulator=this.shaderAccumulator1,this.shaderMandelbrot=this.shaderMandelbrot1),this.mandelbrotMode=this.mandelbrotMode===`basic`?`DEM/M`:`basic`,this.meshMandelbrot.material=this.shaderMandelbrot,this.meshAccumulator.material=this.shaderAccumulator,this.resize()}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentMandelbrotFboTexture(){return this.fbosMandelbrot[this.currentFboIndexMandelbrot].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){let n=Math.floor(t/2)*(t+1),r=(e*1579+n)%(t*t),i=r%t/t,a=Math.floor(r/t)/t;return[i+.5/t,a+.5/t]}iterateMandelbrot(e,t,n){let[r,i]=[this.currentFboIndexMandelbrot,(this.currentFboIndexMandelbrot+1)%2];this.shaderMandelbrot.uniforms.mandelMap.value=this.fbosMandelbrot[r].texture,this.shaderMandelbrot.uniforms.subpixelOffset.value=n,this.shaderMandelbrot.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosMandelbrot[i]),e.render(this.sceneMandelbrot,this.camera),e.setRenderTarget(null),this.currentFboIndexMandelbrot=i}accumulateSample(e,t){let[n,r]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.mandelMap.value=this.getCurrentMandelbrotFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[n].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,this.shaderAccumulator.uniforms.scale.value=this.workProgress?.zoomScale,e.setRenderTarget(this.fbosAccumulator[r]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=r}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;let t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateMandelbrot(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}},E=`precision highp float;\r
\r
uniform sampler2D juliaMap;\r
uniform vec4 box;\r
uniform vec2 resolution;\r
uniform vec2 subpixelOffset;    // [-0.5,0.5]x[-0.5,0.5]\r
uniform vec2 c;\r
uniform int restart;            // 1: restart from zero\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec2 cSubpixelOffset = subpixelOffset / resolution * vec2(box.z-box.x, box.w-box.y);\r
    vec2 z0 = vec2(mix(box.x, box.z, vUv.x), mix(box.y, box.w, vUv.y)) + cSubpixelOffset;\r
    \r
    vec4 tex = (restart == 1) ? vec4(z0, 1.0, 0.0) : texture2D(juliaMap, vUv);\r
\r
    vec2 z = tex.xy;\r
    vec2 w = tex.zw;\r
\r
    int k;\r
    float temp;\r
    for (k = 0; (k < 2000) && (length(z) < 1.0e2); k++) {\r
\r
        if (length(w) < 1.0e32) {\r
            temp = 2.0*z.x*w.y + 2.0*z.y*w.x;\r
            w.x = 2.0*z.x*w.x - 2.0*z.y*w.y;\r
            w.y = temp;\r
        }\r
\r
        temp = 2.0*z.x*z.y + c.y;\r
        z.x = z.x*z.x - z.y*z.y + c.x;\r
        z.y = temp;\r
    }\r
\r
    gl_FragColor = vec4(z, w);\r
}\r
`,D=`// DEM/J algorithm, The Science of Fractal Images, p. 199\r
\r
precision highp float;\r
\r
uniform sampler2D juliaMap;\r
uniform sampler2D accumulatorMap;\r
uniform vec2 resolution;\r
uniform int restart;            // 1: restart from zero\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
vec4 getColor(vec2 uv) {\r
    vec4 tex = texture2D(juliaMap, uv);\r
    vec2 z = tex.xy;\r
    vec2 w = tex.zw;\r
\r
    float rz = length(z);\r
    float rw = length(w);\r
\r
    if (rz < 1.0e2)\r
        return vec4(0.0, 0.0, 1.0, 1.0);        // 0\r
    if (rw > 1.0e32)\r
        return vec4(1.0, 0.0, 1.0, 1.0);        // -1\r
\r
    float d = 2.0*(rz/rw)*log(rz);\r
\r
    float b = 0.1;\r
\r
    float s = log(d/b);\r
\r
    if (d > b)\r
        return vec4(0.0, 0.0, 0.0, 1.0);\r
\r
    if (d > 0.1*b) {\r
        float t = smoothstep(0.1*b, b, d);\r
        return vec4(mix(vec3(0.1, 0.1, 0.1), vec3(0.0, 0.0, 0.0), t), 1.0);\r
    }\r
\r
    if (d > 0.01*b) {\r
        float t = smoothstep(0.01*b, 0.1*b, d);\r
        return vec4(mix(vec3(0.2, 0.2, 0.2), vec3(0.1, 0.1, 0.1), t), 1.0);\r
    }\r
\r
    if (d > 0.001*b) {\r
        float t = smoothstep(0.001*b, 0.01*b, d);\r
        return vec4(mix(vec3(0.4, 0.4, 0.4), vec3(0.2, 0.2, 0.2), t), 1.0);\r
    }\r
\r
    float t = smoothstep(0.0, 0.001*b, d);\r
    return vec4(mix(vec3(1.0, 1.0, 1.0), vec3(0.4, 0.4, 0.4), t), 1.0);\r
}\r
\r
void main() {\r
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);\r
    float iter = accOld.a;\r
    vec4 color = getColor(vUv);\r
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);\r
    gl_FragColor = vec4(accNewColor, iter+1.0);\r
}`,O=class{constructor(e){this.fbosJulia=[],this.fbosAccumulator=[],this.currentFboIndexJulia=0,this.currentFboIndexAccumulator=0,this.workProgress=null,this.container=e,this.setupJuliaScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosJulia.forEach(e=>e.dispose()),this.fbosAccumulator.forEach(e=>e.dispose())},this.resize()}resize(){let{clientWidth:e,clientHeight:t}=this.container,n=e/t,[r,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.camera instanceof o&&(this.camera.top=i,this.camera.bottom=-i,this.camera.left=-r,this.camera.right=r,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderJulia.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexJulia=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosJulia.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(e=4){let{clientWidth:t,clientHeight:n}=this.container;return new f(t,n,{minFilter:r,magFilter:r,wrapS:d,wrapT:d,format:[a,c,l][e],type:g})}setupJuliaScene(){this.sceneJulia=new p,this.shaderJulia=new h({uniforms:{box:{value:null},c:{value:null},subpixelOffset:{value:null},juliaMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:y,fragmentShader:E});let e=new i(new s(2,2),this.shaderJulia);this.sceneJulia.add(e)}setupAccumulatorScene(){this.sceneAccumulator=new p,this.shaderAccumulator=new h({uniforms:{juliaMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:y,fragmentShader:D});let e=new i(new s(2,2),this.shaderAccumulator);this.sceneAccumulator.add(e)}setupCamera(){this.camera=new o(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){let{clientWidth:e,clientHeight:t}=this.container;return new u(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;let{clientWidth:e,clientHeight:t}=this.container,n=e/t,[r,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.shaderJulia.uniforms.box.value=[-r,-i,r,i]}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentJuliaFboTexture(){return this.fbosJulia[this.currentFboIndexJulia].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){let n=Math.floor(t/2)*(t+1),r=(e*1579+n)%(t*t),i=r%t/t,a=Math.floor(r/t)/t;return[i+.5/t,a+.5/t]}iterateJulia(e,t,n){let[r,i]=[this.currentFboIndexJulia,(this.currentFboIndexJulia+1)%2];this.shaderJulia.uniforms.juliaMap.value=this.fbosJulia[r].texture,this.shaderJulia.uniforms.subpixelOffset.value=n,this.shaderJulia.uniforms.restart.value=t?1:0,this.shaderJulia.uniforms.c.value=this.workProgress?.c,e.setRenderTarget(this.fbosJulia[i]),e.render(this.sceneJulia,this.camera),e.setRenderTarget(null),this.currentFboIndexJulia=i}accumulateSample(e,t){let[n,r]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.juliaMap.value=this.getCurrentJuliaFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[n].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosAccumulator[r]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=r}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;let t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateJulia(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}};function k(e){return Math.round(e*0xe8d4a51000)/0xe8d4a51000}function A(e){e.context.strokeStyle=e.color,e.context.lineWidth=1,e.context.fillStyle=e.color,e.context.font=`12px Arial`,e.context.textAlign=e.orientation===`horizontal`?`center`:`right`,e.context.textBaseline=e.orientation===`horizontal`?`bottom`:`middle`,e.context.shadowColor=`transparent`,e.context.shadowBlur=3,e.context.shadowOffsetX=1,e.context.shadowOffsetY=1;let t=t=>e.orientation===`horizontal`?(t-e.tMin)/(e.tMax-e.tMin)*e.width:(e.tMax-t)/(e.tMax-e.tMin)*e.height,n=e.tMax-e.tMin,r=e.orientation===`horizontal`?n/e.width:n/e.height,i=10**(Math.floor(Math.log10(r))+3),a=i,o=5;r/i<.005&&(a=i/2,o=5),r/i<.002&&(a=i/5,o=2);let s=Math.floor(e.tMin/a),c=Math.ceil(e.tMax/a),l=e.orientation===`horizontal`?e.height-20:e.width-20;e.orientation===`horizontal`?e.context.fillRect(0,l-1,e.width,2):e.context.fillRect(l-1,0,2,e.height);for(let n=s;n<=c;n++){let r=k(n*a),i=t(r);e.context.shadowColor=`transparent`,e.orientation===`horizontal`?e.context.fillRect(i-2,l-10,4,20):e.context.fillRect(l-10,i-2,20,4),e.context.shadowColor=`rgba(0, 0, 0, 1.0)`,e.orientation===`horizontal`?e.context.fillText(`${r}`,i,l-10):e.context.fillText(`${r}`,l-15,i);for(let r=1;r<o;r++){let i=t(k((n+r/o)*a));e.context.shadowColor=`transparent`,e.orientation===`horizontal`?e.context.fillRect(i-1,l-10,2,10):e.context.fillRect(l-10,i-1,10,2)}}}var j=5e-5,M=class{constructor(e){this.animationRequestID=null,this.lastTime=null,this.isStopped=!1,this.showJulia=!0,this.mandelbrotMode=`basic`,this.shader=null,this.z0=[-.74993,.02667],this.zoomCenter=[-.5,0],this.zoomScale=1,this.container=e,this.cleanUpTasks=[],this.renderer=new m({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.overlayCanvas=document.createElement(`canvas`),this.overlayCanvas.style.position=`absolute`,this.overlayCanvas.style.top=`0`,this.overlayCanvas.style.left=`0`,this.overlayCanvas.style.width=`100%`,this.overlayCanvas.style.height=`100%`,this.overlayCanvas.style.pointerEvents=`none`,e.appendChild(this.overlayCanvas),this.renderer.getContext().getExtension(`EXT_float_blend`),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.mandelbrotScene=new T(e),this.resetMandelbrotStage(),this.juliaScene=new O(e),this.resetJuliaStage(),this.setupResizeRenderer(),this.resizeRenderer(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1));let{clientWidth:e,clientHeight:t}=this.container;this.overlayCanvas.width=e,this.overlayCanvas.height=t,this.renderer.setSize(e,t),console.log(`Resize! (${e}, ${t})`);let n=e/t,[r,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.camera instanceof o&&(this.camera.top=i,this.camera.bottom=-i,this.camera.left=-r,this.camera.right=r,this.camera.updateProjectionMatrix()),this.shader.uniforms.resolution.value=this.getResolution(),this.mandelbrotScene?.resize(),this.resetMandelbrotStage(),this.juliaScene?.resize(),this.resetJuliaStage()}setupResizeRenderer(){let e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){let e=new p;this.shader=new h({uniforms:{accumulatorMap1:{value:null},accumulatorMap2:{value:null},resolution:{value:null},showJulia:{value:null},showMandelbrot:{value:null},time:{value:0}},vertexShader:y,fragmentShader:b});let t=new i(new s(2,2),this.shader);return e.add(t),e}setupCamera(){let e=new o(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}getResolution(){let{clientWidth:e,clientHeight:t}=this.container;return new u(e,t)}saveAsImage(e){let t=this.renderer.domElement.toDataURL(`image/png`),n=document.createElement(`a`);n.href=t,n.download=e+`.png`,document.body.appendChild(n),n.click(),document.body.removeChild(n)}resetMandelbrotStage(){this.mandelbrotStage=0,this.progressMandelbrotStage()}resetJuliaStage(){this.juliaStage=0,this.progressJuliaStage()}progressMandelbrotStage(){if(this.mandelbrotStage>=3)return;let e={zoomCenter:this.zoomCenter,zoomScale:this.zoomScale,iterations:[1,16,64][this.mandelbrotStage],samplesPerAxis:[1,1,7][this.mandelbrotStage]};this.mandelbrotScene.assignWork(e),this.mandelbrotStage++}progressJuliaStage(){if(this.juliaStage>=3)return;let e={c:this.z0,zoomScale:this.zoomScale,iterations:[1,16,64][this.juliaStage],samplesPerAxis:[1,1,7][this.juliaStage]};this.juliaScene.assignWork(e),this.juliaStage++}pointerInput(e,t,n,r){let i=this.getResolution(),a=i.x/i.y,[o,s]=[a>1.5?a:1.5,a>1.5?1:1.5/a];this.zoomCenter=[this.zoomCenter[0]-this.zoomScale*2*o*e/i.x,this.zoomCenter[1]+this.zoomScale*2*s*t/i.y],this.zoomScale=Math.max(this.zoomScale*n,j),this.resetMandelbrotStage()}pointerMove(e,t){let n=this.getResolution(),r=n.x/n.y,[i,a]=[r>1.5?r:1.5,r>1.5?1:1.5/r],o=[i*(e/n.x-.5),a*(t/n.y-.5)];this.z0=[this.zoomCenter[0]+2*this.zoomScale*o[0],this.zoomCenter[1]-2*this.zoomScale*o[1]],this.resetJuliaStage()}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){this.lastTime=(this.lastTime??0)+(e?0:.01),this.mandelbrotMode!==`off`&&this.mandelbrotScene.step(this.renderer)&&this.progressMandelbrotStage(),this.showJulia&&this.juliaScene.step(this.renderer)&&this.progressJuliaStage(),this.shader.uniforms.accumulatorMap1.value=this.mandelbrotScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.accumulatorMap2.value=this.juliaScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.showJulia.value=this.showJulia?1:0,this.shader.uniforms.showMandelbrot.value=this.mandelbrotMode===`off`?0:1,this.renderer.render(this.scene,this.camera);let t=this.overlayCanvas.getContext(`2d`);if(t){let e=this.getResolution();t.clearRect(0,0,e.x,e.y),this.mandelbrotMode!==`off`&&(A({context:t,width:e.x,height:e.y,tMin:this.mandelbrotScene.box[0],tMax:this.mandelbrotScene.box[2],orientation:`horizontal`,color:this.showJulia?`rgba(100, 100, 100, 1.0)`:`white`}),A({context:t,width:e.x,height:e.y,tMin:this.mandelbrotScene.box[1],tMax:this.mandelbrotScene.box[3],orientation:`vertical`,color:this.showJulia?`rgba(100, 100, 100, 1.0)`:`white`})),this.showJulia&&(t.strokeStyle=`white`,t.fillStyle=`white`,t.font=`12px Arial`,t.textAlign=`right`,t.textBaseline=`top`,t.fillText(`Julia z0 = (${k(this.z0[0])}, ${k(this.z0[1])})`,e.x-50,10))}}},N=n(),P=({mandelbrotMode:e,setMandelbrotMode:t,showJulia:n,setShowJulia:r})=>{let i=(0,v.useRef)(null),a=(0,v.useRef)(null),o=()=>{a.current&&(a.current.mandelbrotMode!==e&&e!==`off`&&(a.current.mandelbrotScene.switchMode(),a.current.resetMandelbrotStage()),a.current.mandelbrotMode=e)};return(0,v.useEffect)(()=>{a.current&&(o(),a.current.showJulia=n)},[n,e]),(0,v.useEffect)(()=>{console.log(`useEffect: `,i.current);let e=new M(i.current);a.current=e;let n=new _(i.current,{mouse:{drag:t=>{(t.buttons&2||t.buttons&4)&&e.pointerInput(t.dx,t.dy,1,0),t.buttons&1&&e.pointerMove(t.x,t.y)},down:t=>t.button===0&&e.pointerMove(t.x,t.y)},touch:{start:t=>e.pointerMove(t.x,t.y),dragSingle:t=>e.pointerMove(t.x,t.y),dragPair:t=>e.pointerInput(t.dx,t.dy,t.scale,t.angle)},wheel:{zoom:t=>e.pointerInput(0,0,1+.001*t.delta,0),pan:t=>e.pointerInput(t.dx,t.dy,1,0)},safariGesture:{change:t=>e.pointerInput(0,0,t.scale,t.angle)},keyboard:{keydown:n=>{n.key.toUpperCase()===`J`&&r(e=>!e),n.key.toUpperCase()===`M`&&t(e=>e===`off`?`basic`:e===`basic`?`DEM/M`:`off`),n.key===`-`&&e.pointerInput(0,0,1.2,0),n.key===`+`&&e.pointerInput(0,0,1/1.2,0)}}});return()=>{e.cleanUp(),n.cleanup()}},[]),(0,N.jsx)(`div`,{ref:i,style:{width:`100%`,height:`100%`}})};export{P as default};