import{$ as e,B as t,E as n,ar as r,d as i,jt as a,ln as o,yr as s}from"./three.module-BrMVvVOI.js";var c=`precision highp float;\r
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
}`,u=class s{static{this.TEXTURE_MAX_WIDTH=1024}static{this.FLOATS_PER_CHAR=16}static{this.SHARPNESS=.5}constructor(u,d){this.font=u,this.shader=new r({uniforms:{dataTexture:{value:null},atlasTexture:{value:u.atlas},unitRange:{value:[s.SHARPNESS/this.font.layoutData.atlas.width,s.SHARPNESS/this.font.layoutData.atlas.height]},numChars:{value:null},useFisheye:{value:0},focalLength:{value:.5},alphaLimit:{value:d??.2}},vertexShader:c,fragmentShader:l,transparent:!0}),this.ibGeometry=new e;let f=new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),p=new Uint16Array([0,1,2,0,2,3]);this.ibGeometry.setAttribute(`position`,new i(f,3)),this.ibGeometry.setIndex(new i(p,1)),this.data=new Float32Array(Math.floor(s.TEXTURE_MAX_WIDTH/s.FLOATS_PER_CHAR)),this.dataTexture=new n(this.data,this.data.length/4,1,o,t),this.shader.uniforms.dataTexture.value=this.dataTexture,this.dataTexture.needsUpdate=!0,this.mesh=new a(this.ibGeometry,this.shader),this.mesh.frustumCulled=!1,this.reset()}computeTextBounds(e){let t=0,n=0,r=0,i=0,a=0,o=0,s=-1;for(let c=0;c<e.length;c++){let l=e.charCodeAt(c);if(l===10){a=0,o-=this.font.layoutData.metrics.lineHeight,s=-1;continue}let u=this.font.glyphLookup?.[l];if(!u&&(l=37,u=this.font.glyphLookup?.[l],!u)){s=-1;continue}if(u.planeBounds){a+=this.font.kerningLookup?.[s]?.[l]??0;let e=a+u.planeBounds.left,c=a+u.planeBounds.right,d=o+u.planeBounds.bottom,f=o+u.planeBounds.top;t=Math.min(t,e),r=Math.max(r,c),n=Math.min(n,d),i=Math.max(i,f),s=l}else s=-1;a+=u.advance??0}return[t,n,r,i]}addText(e,t,n,r,i=0){let a=typeof t!=`function`,o=this.computeTextBounds(e),c=-.5*((1-r[0])*o[0]+(1+r[0])*o[2]),l=-.5*((1-r[1])*o[1]+(1+r[1])*o[3]),u=c,d=l,f=-1;for(let r=0;r<e.length;r++){let o=e.charCodeAt(r);if(o===10){u=c,d-=this.font.layoutData.metrics.lineHeight,f=-1;continue}let l=this.font.glyphLookup?.[o];if(!l&&(o=37,l=this.font.glyphLookup?.[o],!l)){f=-1;continue}if(l.planeBounds){u+=this.font.kerningLookup?.[f]?.[o]??0;let e,r,c,p=u+l.planeBounds.left,m=u+l.planeBounds.right,h=d+l.planeBounds.bottom,g=d+l.planeBounds.top;if(a)e=t,r=[i*p,i*(m-p),0],c=[i*h,i*(g-h),0];else{let n=t(p,.5*(h+g)),i=t(m,.5*(h+g)),a=t(.5*(p+m),h),o=t(.5*(p+m),g);e=[(n[0]+i[0]+a[0]+o[0])/4,(n[1]+i[1]+a[1]+o[1])/4,(n[2]+i[2]+a[2]+o[2])/4],r=[i[0]-n[0],i[1]-n[1],i[2]-n[2]],c=[o[0]-a[0],o[1]-a[1],o[2]-a[2]]}s.FLOATS_PER_CHAR*this.numChars>=this.data.length&&this.extendArray();let _=s.FLOATS_PER_CHAR*this.numChars;this.data[_+0]=l.atlasBounds.left/this.font.layoutData.atlas.width,this.data[_+1]=l.atlasBounds.bottom/this.font.layoutData.atlas.height,this.data[_+2]=l.atlasBounds.right/this.font.layoutData.atlas.width,this.data[_+3]=l.atlasBounds.top/this.font.layoutData.atlas.height,this.data[_+4]=e[0],this.data[_+5]=e[1],this.data[_+6]=e[2],this.data[_+7]=r[0],this.data[_+8]=r[1],this.data[_+9]=r[2],this.data[_+10]=c[0],this.data[_+11]=c[1],this.data[_+12]=c[2],this.data[_+13]=n[0]+(a?2:0),this.data[_+14]=n[1],this.data[_+15]=n[2],this.numChars++,f=o}else f=-1;u+=l.advance??0}this.ibGeometry.instanceCount=this.numChars,this.shader.uniforms.numChars.value=this.numChars,this.dataTexture.needsUpdate=!0}extendArray(){let e=this.data.length,r=new Float32Array(2*e);r.set(this.data,0),this.data=r,this.dataTexture.dispose();let i=2*e/4;this.dataTexture=new n(this.data,Math.min(i,s.TEXTURE_MAX_WIDTH),Math.ceil(i/s.TEXTURE_MAX_WIDTH),o,t),this.shader.uniforms.dataTexture.value=this.dataTexture,this.dataTexture.needsUpdate=!0}reset(){this.numChars=0,this.ibGeometry.instanceCount=0,this.shader.uniforms.numChars.value=0}getObject(){return this.mesh}dispose(){this.shader.dispose(),this.ibGeometry.dispose(),this.dataTexture.dispose()}},d=class{constructor(){this.name=null,this.atlas=null,this.layoutData={},this.glyphLookup={},this.kerningLookup={}}async load(e,t){this.name=e;let n=!1,r=!1,i=()=>{n&&r&&t&&t()};this.atlas=new s().load(`/dev-site-misc/fonts/${this.name}.png`,e=>{n=!0,e.anisotropy=4,e.needsUpdate=!0,i()});try{let e=await fetch(`/dev-site-misc/fonts/${this.name}.json`);if(!e.ok)throw Error(`Failed to fetch JSON file`);this.layoutData=await e.json(),this.createLookups(),r=!0,i()}catch(e){throw console.error(`Error loading JSON:`,e),e}}createLookups(){this.glyphLookup={},this.layoutData.glyphs.forEach(e=>{this.glyphLookup[e.unicode]=e}),this.kerningLookup={},this.layoutData.kerning.forEach(e=>{this.kerningLookup[e.unicode1]??={},this.kerningLookup[e.unicode1][e.unicode2]=e.advance})}dispose(){this.atlas?.dispose()}};export{u as n,d as t};