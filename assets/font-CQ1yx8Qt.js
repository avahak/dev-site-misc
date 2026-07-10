import{H as e,O as t,Pt as n,Sr as r,cr as i,fn as a,p as o,tt as s}from"./three.module-Dtgo5Ffh.js";var c=`precision highp float;\r
\r
uniform int numChars;\r
uniform int useFisheye;\r
uniform float focalLength;\r
uniform sampler2D dataTexture;\r
\r
out vec2 atlasCoords;\r
out vec3 color;\r
\r
#define TEXTURE_MAX_WIDTH 1024\r
\r
vec3 fisheyeStereographic(vec3 p0) {\r
    float r0 = length(p0);\r
    float r0xy = length(p0.xy);\r
    float phi = 0.5 * atan(r0xy, -p0.z);\r
    vec3 p = r0 * vec3(2.0*focalLength * sin(phi)*p0.xy/r0xy, -cos(phi));\r
    return p;\r
    // Now r on image plane is c*|p.xy|/(-p.z) = c*2f*tan(phi) = c*2f*tan(theta/2), \r
    // i.e. r = c*2f tan(theta/2), which is the formula for fisheye lens \r
    // with stereographic projection.\r
}\r
\r
void main() {\r
    // Read data\r
    int iIndex = 4 * gl_InstanceID;\r
    ivec2 texelIndex0 = ivec2(iIndex % TEXTURE_MAX_WIDTH, iIndex / TEXTURE_MAX_WIDTH);\r
    ivec2 texelIndex1 = ivec2((iIndex+1) % TEXTURE_MAX_WIDTH, (iIndex+1) / TEXTURE_MAX_WIDTH);\r
    ivec2 texelIndex2 = ivec2((iIndex+2) % TEXTURE_MAX_WIDTH, (iIndex+2) / TEXTURE_MAX_WIDTH);\r
    ivec2 texelIndex3 = ivec2((iIndex+3) % TEXTURE_MAX_WIDTH, (iIndex+3) / TEXTURE_MAX_WIDTH);\r
    vec4 tf0 = texelFetch(dataTexture, texelIndex0, 0);\r
    vec4 tf1 = texelFetch(dataTexture, texelIndex1, 0);\r
    vec4 tf2 = texelFetch(dataTexture, texelIndex2, 0);\r
    vec4 tf3 = texelFetch(dataTexture, texelIndex3, 0);\r
\r
    // Unpack values\r
    vec4 atlas4 = tf0;\r
    vec3 posCenter = tf1.xyz;\r
    vec3 e1 = vec3(tf1.w, tf2.xy);\r
    vec3 e2 = vec3(tf2.zw, tf3.x);\r
    int faceCamera = int(floor(0.25+0.5*tf3.y));\r
    color = vec3(tf3.y - 2.0*float(faceCamera), tf3.zw);\r
\r
    vec2 vUv = position.xy;\r
    atlasCoords = atlas4.xy + vUv*(atlas4.zw - atlas4.xy);\r
\r
    vec4 vPos;\r
    if (faceCamera == 0) {\r
        vPos = vec4(posCenter + (vUv.x-0.5)*e1 + (vUv.y-0.5)*e2, 1.0);\r
    } else {\r
        // Text is made to face the camera\r
        mat4 mat = inverse(projectionMatrix * modelViewMatrix); // could be precomputed\r
        vec3 w1 = normalize(mat[0].xyz);\r
        vec3 w2 = normalize(mat[1].xyz);\r
        if (useFisheye == 0) {\r
            vPos = vec4(posCenter + (e1.x+e1.y*vUv.x)*w1 + (e2.x+e2.y*vUv.y)*w2, 1.0);\r
        } else {\r
            // BUG text size is computed wrong here\r
            posCenter = fisheyeStereographic((modelViewMatrix * vec4(posCenter, 1.0)).xyz);\r
            vPos = vec4((e1.x+e1.y*vUv.x)*w1 + (e2.x+e2.y*vUv.y)*w2, 0.0);\r
            gl_Position = projectionMatrix * (vec4(posCenter, 1.0) + focalLength*modelViewMatrix * vPos);\r
            return;\r
        }\r
    }\r
    if (useFisheye == 0) {\r
        gl_Position = projectionMatrix * modelViewMatrix * vPos;\r
    } else {\r
        vec3 q = (modelViewMatrix * vPos).xyz;\r
        vec3 qFisheye = fisheyeStereographic(q);\r
        gl_Position = projectionMatrix * vec4(qFisheye, 1.0);\r
    }\r
}`,l=`precision highp float;\r
\r
uniform int numChars;\r
uniform sampler2D atlasTexture;\r
uniform vec2 unitRange;\r
uniform float alphaLimit;\r
\r
in vec2 atlasCoords;\r
in vec3 color;\r
\r
float median(float r, float g, float b) {\r
    return max(min(r, g), min(max(r, g), b));\r
}\r
\r
void main() {\r
    vec3 msd = texture(atlasTexture, atlasCoords).rgb;\r
    float sd = median(msd.r, msd.g, msd.b) - 0.5;\r
    vec2 screenTexSize = vec2(1.0) / fwidth(atlasCoords);\r
    float screenPxRange = max(dot(unitRange, screenTexSize), 1.0);\r
    float screenPxDistance = screenPxRange * sd;\r
    float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);\r
\r
    // Opacity does not work correctly but no easy solution\r
    if (alpha >= alphaLimit) {\r
        gl_FragColor = vec4(color, alpha);\r
    } else {\r
        discard;\r
    }\r
}`,u=class r{static{this.TEXTURE_MAX_WIDTH=1024}static{this.FLOATS_PER_CHAR=16}static{this.SHARPNESS=.5}constructor(u,d){this.font=u,this.shader=new i({uniforms:{dataTexture:{value:null},atlasTexture:{value:u.atlas},unitRange:{value:[r.SHARPNESS/this.font.layoutData.atlas.width,r.SHARPNESS/this.font.layoutData.atlas.height]},numChars:{value:null},useFisheye:{value:0},focalLength:{value:.5},alphaLimit:{value:d??.2}},vertexShader:c,fragmentShader:l,transparent:!0}),this.ibGeometry=new s;let f=new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),p=new Uint16Array([0,1,2,0,2,3]);this.ibGeometry.setAttribute(`position`,new o(f,3)),this.ibGeometry.setIndex(new o(p,1)),this.data=new Float32Array(Math.floor(r.TEXTURE_MAX_WIDTH/r.FLOATS_PER_CHAR)),this.dataTexture=new t(this.data,this.data.length/4,1,a,e),this.shader.uniforms.dataTexture.value=this.dataTexture,this.dataTexture.needsUpdate=!0,this.mesh=new n(this.ibGeometry,this.shader),this.mesh.frustumCulled=!1,this.reset()}computeTextBounds(e){let t=0,n=0,r=0,i=0,a=0,o=0,s=-1;for(let c=0;c<e.length;c++){let l=e.charCodeAt(c);if(l===10){a=0,o-=this.font.layoutData.metrics.lineHeight,s=-1;continue}let u=this.font.glyphLookup?.[l];if(!u&&(l=37,u=this.font.glyphLookup?.[l],!u)){s=-1;continue}if(u.planeBounds){a+=this.font.kerningLookup?.[s]?.[l]??0;let e=a+u.planeBounds.left,c=a+u.planeBounds.right,d=o+u.planeBounds.bottom,f=o+u.planeBounds.top;t=Math.min(t,e),r=Math.max(r,c),n=Math.min(n,d),i=Math.max(i,f),s=l}else s=-1;a+=u.advance??0}return[t,n,r,i]}addText(e,t,n,i,a=0){let o=typeof t!=`function`,s=this.computeTextBounds(e),c=-.5*((1-i[0])*s[0]+(1+i[0])*s[2]),l=-.5*((1-i[1])*s[1]+(1+i[1])*s[3]),u=c,d=l,f=-1;for(let i=0;i<e.length;i++){let s=e.charCodeAt(i);if(s===10){u=c,d-=this.font.layoutData.metrics.lineHeight,f=-1;continue}let l=this.font.glyphLookup?.[s];if(!l&&(s=37,l=this.font.glyphLookup?.[s],!l)){f=-1;continue}if(l.planeBounds){u+=this.font.kerningLookup?.[f]?.[s]??0;let e,i,c,p=u+l.planeBounds.left,m=u+l.planeBounds.right,h=d+l.planeBounds.bottom,g=d+l.planeBounds.top;if(o)e=t,i=[a*p,a*(m-p),0],c=[a*h,a*(g-h),0];else{let n=t(p,.5*(h+g)),r=t(m,.5*(h+g)),a=t(.5*(p+m),h),o=t(.5*(p+m),g);e=[(n[0]+r[0]+a[0]+o[0])/4,(n[1]+r[1]+a[1]+o[1])/4,(n[2]+r[2]+a[2]+o[2])/4],i=[r[0]-n[0],r[1]-n[1],r[2]-n[2]],c=[o[0]-a[0],o[1]-a[1],o[2]-a[2]]}r.FLOATS_PER_CHAR*this.numChars>=this.data.length&&this.extendArray();let _=r.FLOATS_PER_CHAR*this.numChars;this.data[_+0]=l.atlasBounds.left/this.font.layoutData.atlas.width,this.data[_+1]=l.atlasBounds.bottom/this.font.layoutData.atlas.height,this.data[_+2]=l.atlasBounds.right/this.font.layoutData.atlas.width,this.data[_+3]=l.atlasBounds.top/this.font.layoutData.atlas.height,this.data[_+4]=e[0],this.data[_+5]=e[1],this.data[_+6]=e[2],this.data[_+7]=i[0],this.data[_+8]=i[1],this.data[_+9]=i[2],this.data[_+10]=c[0],this.data[_+11]=c[1],this.data[_+12]=c[2],this.data[_+13]=n[0]+(o?2:0),this.data[_+14]=n[1],this.data[_+15]=n[2],this.numChars++,f=s}else f=-1;u+=l.advance??0}this.ibGeometry.instanceCount=this.numChars,this.shader.uniforms.numChars.value=this.numChars,this.dataTexture.needsUpdate=!0}extendArray(){let n=this.data.length,i=new Float32Array(2*n);i.set(this.data,0),this.data=i,this.dataTexture.dispose();let o=2*n/4;this.dataTexture=new t(this.data,Math.min(o,r.TEXTURE_MAX_WIDTH),Math.ceil(o/r.TEXTURE_MAX_WIDTH),a,e),this.shader.uniforms.dataTexture.value=this.dataTexture,this.dataTexture.needsUpdate=!0}reset(){this.numChars=0,this.ibGeometry.instanceCount=0,this.shader.uniforms.numChars.value=0}getObject(){return this.mesh}dispose(){this.shader.dispose(),this.ibGeometry.dispose(),this.dataTexture.dispose()}},d=class{constructor(){this.name=null,this.atlas=null,this.layoutData={},this.glyphLookup={},this.kerningLookup={}}async load(e,t){this.name=e;let n=!1,i=!1,a=()=>{n&&i&&t&&t()};this.atlas=new r().load(`/dev-site-misc/fonts/${this.name}.png`,e=>{n=!0,e.anisotropy=4,e.needsUpdate=!0,a()});try{let e=await fetch(`/dev-site-misc/fonts/${this.name}.json`);if(!e.ok)throw Error(`Failed to fetch JSON file`);this.layoutData=await e.json(),this.createLookups(),i=!0,a()}catch(e){throw console.error(`Error loading JSON:`,e),e}}createLookups(){this.glyphLookup={},this.layoutData.glyphs.forEach(e=>{this.glyphLookup[e.unicode]=e}),this.kerningLookup={},this.layoutData.kerning.forEach(e=>{this.kerningLookup[e.unicode1]??={},this.kerningLookup[e.unicode1][e.unicode2]=e.advance})}dispose(){this.atlas?.dispose()}};export{u as n,d as t};