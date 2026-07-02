import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{c as r,o as i,s as a,t as o}from"./Box-CFEfsCq7.js";import{c as s,f as c,i as l,l as u,r as d,s as f,t as p}from"./createSimplePaletteValueFilter-C7rgTAc2.js";import{n as m,t as h}from"./Button-BlCc25sF.js";import{i as g,r as _,t as v,u as y}from"./useFormControl-CAWgCu0_.js";import{a as b,i as x,r as S,t as C}from"./index-BLKmYqNP.js";import{$ as w,At as T,Dr as E,Dt as D,G as O,Ir as k,Kt as A,Lr as j,Qt as ee,Rr as M,Wr as N,d as te,et as P,f as ne,ft as re,h as F,ir as ie,it as I,jt as ae,l as oe,lr as se,n as L,qt as ce,r as le,rr as ue,t as R,z as de}from"./three.module-CJlFrUo8.js";import{n as fe,t as pe}from"./ODESolver-B4yqZhAt.js";import{t as me}from"./inputListener-CBMq61_r.js";import{t as he}from"./planeView-BfuEjnyN.js";import{n as ge,t as _e}from"./font-C3yGxfbs.js";function ve(e){return a(`PrivateSwitchBase`,e)}i(`PrivateSwitchBase`,[`root`,`checked`,`disabled`,`input`,`edgeStart`,`edgeEnd`]);var z=e(t()),B=n(),ye=e=>{let{classes:t,checked:n,disabled:r,edge:i}=e;return c({root:[`root`,n&&`checked`,r&&`disabled`,i&&`edge${f(i)}`],input:[`input`]},ve,t)},be=s(m,{name:`MuiSwitchBase`})({padding:9,borderRadius:`50%`,variants:[{props:{edge:`start`,size:`small`},style:{marginLeft:-3}},{props:({edge:e,ownerState:t})=>e===`start`&&t.size!==`small`,style:{marginLeft:-12}},{props:{edge:`end`,size:`small`},style:{marginRight:-3}},{props:({edge:e,ownerState:t})=>e===`end`&&t.size!==`small`,style:{marginRight:-12}}]}),xe=s(`input`,{name:`MuiSwitchBase`,shouldForwardProp:u})({cursor:`inherit`,position:`absolute`,opacity:0,width:`100%`,height:`100%`,top:0,left:0,margin:0,padding:0,zIndex:1}),Se=z.forwardRef(function(e,t){let{autoFocus:n,checked:r,checkedIcon:i,defaultChecked:a,disabled:o,disableFocusRipple:s=!1,edge:c=!1,icon:l,id:u,inputProps:d,inputRef:f,name:p,onBlur:m,onChange:h,onFocus:_,readOnly:b,required:x=!1,tabIndex:S,type:C,value:w,slots:T={},slotProps:E={},...D}=e,[O,k]=y({controlled:r,default:!!a,name:`SwitchBase`,state:`checked`}),A=v(),j=e=>{_&&_(e),A&&A.onFocus&&A.onFocus(e)},ee=e=>{m&&m(e),A&&A.onBlur&&A.onBlur(e)},M=e=>{if(e.nativeEvent.defaultPrevented||b)return;let t=e.target.checked;k(t),h&&h(e,t)},N=o;A&&N===void 0&&(N=A.disabled);let te=C===`checkbox`||C===`radio`,P={...e,checked:O,disabled:N,disableFocusRipple:s,edge:c},ne=ye(P),re={slots:T,slotProps:{input:d,...E}},[F,ie]=g(`root`,{ref:t,elementType:be,className:ne.root,shouldForwardComponentProp:!0,externalForwardedProps:{...re,component:`span`,...D},getSlotProps:e=>({...e,onFocus:t=>{e.onFocus?.(t),j(t)},onBlur:t=>{e.onBlur?.(t),ee(t)}}),ownerState:P,additionalProps:{centerRipple:!0,focusRipple:!s,role:void 0,tabIndex:null}}),[I,ae]=g(`input`,{ref:f,elementType:xe,className:ne.input,externalForwardedProps:re,getSlotProps:e=>({...e,onChange:t=>{e.onChange?.(t),M(t)}}),ownerState:P,additionalProps:{autoFocus:n,checked:r,defaultChecked:a,disabled:N,id:te?u:void 0,name:p,readOnly:b,required:x,tabIndex:S,type:C,...C===`checkbox`&&w===void 0?{}:{value:w}}});return(0,B.jsxs)(F,{...ie,children:[(0,B.jsx)(I,{...ae}),O?i:l]})});function Ce(e){return a(`MuiFormControlLabel`,e)}var V=i(`MuiFormControlLabel`,[`root`,`labelPlacementStart`,`labelPlacementTop`,`labelPlacementBottom`,`disabled`,`label`,`error`,`required`,`asterisk`]),we=e=>{let{classes:t,disabled:n,labelPlacement:r,error:i,required:a}=e;return c({root:[`root`,n&&`disabled`,`labelPlacement${f(r)}`,i&&`error`,a&&`required`],label:[`label`,n&&`disabled`],asterisk:[`asterisk`,i&&`error`]},Ce,t)},Te=s(`label`,{name:`MuiFormControlLabel`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[{[`& .${V.label}`]:t.label},t.root,t[`labelPlacement${f(n.labelPlacement)}`]]}})(l(({theme:e})=>({display:`inline-flex`,alignItems:`center`,cursor:`pointer`,verticalAlign:`middle`,WebkitTapHighlightColor:`transparent`,marginLeft:-11,marginRight:16,[`&.${V.disabled}`]:{cursor:`default`},[`& .${V.label}`]:{[`&.${V.disabled}`]:{color:(e.vars||e).palette.text.disabled}},variants:[{props:{labelPlacement:`start`},style:{flexDirection:`row-reverse`,marginRight:-11}},{props:{labelPlacement:`top`},style:{flexDirection:`column-reverse`}},{props:{labelPlacement:`bottom`},style:{flexDirection:`column`}},{props:({labelPlacement:e})=>e===`start`||e===`top`||e===`bottom`,style:{marginLeft:16}}]}))),Ee=s(`span`,{name:`MuiFormControlLabel`,slot:`Asterisk`})(l(({theme:e})=>({[`&.${V.error}`]:{color:(e.vars||e).palette.error.main}}))),De=z.forwardRef(function(e,t){let n=d({props:e,name:`MuiFormControlLabel`}),{checked:i,className:a,componentsProps:o={},control:s,disabled:c,disableTypography:l,inputRef:u,label:f,labelPlacement:p=`end`,name:m,onChange:h,required:y,slots:x={},slotProps:S={},value:C,...w}=n,T=v(),E=c??s.props.disabled??T?.disabled,D=y??s.props.required,O={disabled:E,required:D};[`checked`,`name`,`onChange`,`value`,`inputRef`].forEach(e=>{s.props[e]===void 0&&n[e]!==void 0&&(O[e]=n[e])});let k=_({props:n,muiFormControl:T,states:[`error`]}),A={...n,disabled:E,labelPlacement:p,required:D,error:k.error},j=we(A),[ee,M]=g(`typography`,{elementType:b,externalForwardedProps:{slots:x,slotProps:{...o,...S}},ownerState:A}),N=f;return N!=null&&N.type!==b&&!l&&(N=(0,B.jsx)(ee,{component:`span`,...M,className:r(j.label,M?.className),children:N})),(0,B.jsxs)(Te,{className:r(j.root,a),ownerState:A,ref:t,...w,children:[z.cloneElement(s,O),D?(0,B.jsxs)(`div`,{children:[N,(0,B.jsxs)(Ee,{ownerState:A,"aria-hidden":!0,className:j.asterisk,children:[` `,`*`]})]}):N]})});function Oe(e){return a(`MuiFormGroup`,e)}i(`MuiFormGroup`,[`root`,`row`,`error`]);var ke=e=>{let{classes:t,row:n,error:r}=e;return c({root:[`root`,n&&`row`,r&&`error`]},Oe,t)},Ae=s(`div`,{name:`MuiFormGroup`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,n.row&&t.row]}})({display:`flex`,flexDirection:`column`,flexWrap:`wrap`,variants:[{props:{row:!0},style:{flexDirection:`row`}}]}),je=z.forwardRef(function(e,t){let n=d({props:e,name:`MuiFormGroup`}),{className:i,row:a=!1,...o}=n,s=_({props:n,muiFormControl:v(),states:[`error`]}),c={...n,row:a,error:s.error};return(0,B.jsx)(Ae,{className:r(ke(c).root,i),ownerState:c,ref:t,...o})});function Me(e){return a(`MuiSwitch`,e)}var H=i(`MuiSwitch`,[`root`,`edgeStart`,`edgeEnd`,`switchBase`,`colorPrimary`,`colorSecondary`,`sizeSmall`,`sizeMedium`,`checked`,`disabled`,`input`,`thumb`,`track`]),Ne=e=>{let{classes:t,edge:n,size:r,color:i,checked:a,disabled:o}=e,s=c({root:[`root`,n&&`edge${f(n)}`,`size${f(r)}`],switchBase:[`switchBase`,`color${f(i)}`,a&&`checked`,o&&`disabled`],thumb:[`thumb`],track:[`track`],input:[`input`]},Me,t);return{...t,...s}},Pe=s(`span`,{name:`MuiSwitch`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,n.edge&&t[`edge${f(n.edge)}`],t[`size${f(n.size)}`]]}})({display:`inline-flex`,width:58,height:38,overflow:`hidden`,padding:12,boxSizing:`border-box`,position:`relative`,flexShrink:0,zIndex:0,verticalAlign:`middle`,"@media print":{colorAdjust:`exact`},variants:[{props:{edge:`start`},style:{marginLeft:-8}},{props:{edge:`end`},style:{marginRight:-8}},{props:{size:`small`},style:{width:40,height:24,padding:7,[`& .${H.thumb}`]:{width:16,height:16},[`& .${H.switchBase}`]:{padding:4,[`&.${H.checked}`]:{transform:`translateX(16px)`}}}}]}),Fe=s(Se,{name:`MuiSwitch`,slot:`SwitchBase`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.switchBase,{[`& .${H.input}`]:t.input},n.color!==`default`&&t[`color${f(n.color)}`]]}})(l(({theme:e})=>({position:`absolute`,top:0,left:0,zIndex:1,color:e.vars?e.vars.palette.Switch.defaultColor:`${e.palette.mode===`light`?e.palette.common.white:e.palette.grey[300]}`,transition:e.transitions.create([`left`,`transform`],{duration:e.transitions.duration.shortest}),[`&.${H.checked}`]:{transform:`translateX(20px)`},[`&.${H.disabled}`]:{color:e.vars?e.vars.palette.Switch.defaultDisabledColor:`${e.palette.mode===`light`?e.palette.grey[100]:e.palette.grey[600]}`},[`&.${H.checked} + .${H.track}`]:{opacity:.5},[`&.${H.disabled} + .${H.track}`]:{opacity:e.vars?e.vars.opacity.switchTrackDisabled:`${e.palette.mode===`light`?.12:.2}`},[`& .${H.input}`]:{left:`-100%`,width:`300%`}})),l(({theme:e})=>({"&:hover":{backgroundColor:e.alpha((e.vars||e).palette.action.active,(e.vars||e).palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:`transparent`}},variants:[...Object.entries(e.palette).filter(p([`light`])).map(([t])=>({props:{color:t},style:{[`&.${H.checked}`]:{color:(e.vars||e).palette[t].main,"&:hover":{backgroundColor:e.alpha((e.vars||e).palette[t].main,(e.vars||e).palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:`transparent`}},[`&.${H.disabled}`]:{color:e.vars?e.vars.palette.Switch[`${t}DisabledColor`]:`${e.palette.mode===`light`?e.lighten(e.palette[t].main,.62):e.darken(e.palette[t].main,.55)}`}},[`&.${H.checked} + .${H.track}`]:{backgroundColor:(e.vars||e).palette[t].main}}}))]}))),Ie=s(`span`,{name:`MuiSwitch`,slot:`Track`})(l(({theme:e})=>({height:`100%`,width:`100%`,borderRadius:14/2,zIndex:-1,transition:e.transitions.create([`opacity`,`background-color`],{duration:e.transitions.duration.shortest}),backgroundColor:e.vars?e.vars.palette.common.onBackground:`${e.palette.mode===`light`?e.palette.common.black:e.palette.common.white}`,opacity:e.vars?e.vars.opacity.switchTrack:`${e.palette.mode===`light`?.38:.3}`}))),Le=s(`span`,{name:`MuiSwitch`,slot:`Thumb`})(l(({theme:e})=>({boxShadow:(e.vars||e).shadows[1],backgroundColor:`currentColor`,width:20,height:20,borderRadius:`50%`}))),Re=z.forwardRef(function(e,t){let n=d({props:e,name:`MuiSwitch`}),{className:i,color:a=`primary`,edge:o=!1,size:s=`medium`,sx:c,slots:l={},slotProps:u={},...f}=n,p={...n,color:a,edge:o,size:s},m=Ne(p),h={slots:l,slotProps:u},[_,v]=g(`root`,{className:r(m.root,i),elementType:Pe,externalForwardedProps:h,ownerState:p,additionalProps:{sx:c}}),[y,b]=g(`thumb`,{className:m.thumb,elementType:Le,externalForwardedProps:h,ownerState:p}),x=(0,B.jsx)(y,{...b}),[S,C]=g(`track`,{className:m.track,elementType:Ie,externalForwardedProps:h,ownerState:p});return(0,B.jsxs)(_,{...v,children:[(0,B.jsx)(Fe,{type:`checkbox`,icon:x,checkedIcon:x,ref:t,ownerState:p,...f,classes:{...m,root:m.switchBase},slots:{...l.switchBase&&{root:l.switchBase},...l.input&&{input:l.input}},slotProps:{...u.switchBase&&{root:typeof u.switchBase==`function`?u.switchBase(p):u.switchBase},input:{role:`switch`},...u.input&&{input:typeof u.input==`function`?u.input(p):u.input}}}),(0,B.jsx)(S,{...C})]})}),ze=new oe,Be=new j,U=class extends w{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new de([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new de([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new P(t,6,1);return this.setAttribute(`instanceStart`,new I(n,3,0)),this.setAttribute(`instanceEnd`,new I(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new P(t,6,1);return this.setAttribute(`instanceColorStart`,new I(n,3,0)),this.setAttribute(`instanceColorEnd`,new I(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new N(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new oe);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),ze.setFromBufferAttribute(t),this.boundingBox.union(ze))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new se),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)Be.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(Be)),Be.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(Be));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}};L.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new k},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},R.line={uniforms:E.merge([L.common,L.fog,L.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		float trimSegmentAlpha( const in vec4 start, const in vec4 end ) {

			// compute the interpolation factor needed to trim the segment so it terminates
			// between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column

			// we need different nearEstimate formula for reversed and default depth buffer
			// a is positive with a reversed depth buffer so it can be used for controlling the code flow
			float nearEstimate = ( a > 0.0 ) ? ( - b / ( a + 1.0 ) ) : ( - 0.5 * b / a );

			return ( nearEstimate - start.z ) / ( end.z - start.z );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef USE_DASH

				float lineDistanceStart = dashScale * instanceDistanceStart;
				float lineDistanceEnd = dashScale * instanceDistanceEnd;

			#endif

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( start, end );
					end.xyz = mix( start.xyz, end.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceEnd = mix( lineDistanceStart, lineDistanceEnd, alpha );

					#endif

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( end, start );
					start.xyz = mix( end.xyz, start.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceStart = mix( lineDistanceEnd, lineDistanceStart, alpha );

					#endif

				}

			}

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? lineDistanceStart : lineDistanceEnd;
				vUv = uv;

			#endif

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};var W=class extends ie{constructor(e){super({type:`LineMaterial`,uniforms:E.clone(R.line.uniforms),vertexShader:R.line.vertexShader,fragmentShader:R.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return`WORLD_UNITS`in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return`USE_DASH`in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return`USE_ALPHA_TO_COVERAGE`in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE=``:delete this.defines.USE_ALPHA_TO_COVERAGE)}},Ve=new M,He=new j,Ue=new j,G=new M,K=new M,q=new M,We=new j,Ge=new T,J=new re,Ke=new j,qe=new oe,Je=new se,Y=new M,X,Z;function Ye(e,t,n){return Y.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),Y.multiplyScalar(1/Y.w),Y.x=Z/n.width,Y.y=Z/n.height,Y.applyMatrix4(e.projectionMatrixInverse),Y.multiplyScalar(1/Y.w),Math.abs(Math.max(Y.x,Y.y))}function Xe(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){J.start.fromBufferAttribute(i,r),J.end.fromBufferAttribute(a,r),J.applyMatrix4(n);let o=new j,s=new j;X.distanceSqToSegment(J.start,J.end,s,o),s.distanceTo(o)<Z*.5&&t.push({point:s,pointOnLine:o,distance:X.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,uv1:null})}}function Ze(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),u=-t.near;X.at(1,q),q.w=1,q.applyMatrix4(t.matrixWorldInverse),q.applyMatrix4(r),q.multiplyScalar(1/q.w),q.x*=i.x/2,q.y*=i.y/2,q.z=0,We.copy(q),Ge.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(G.fromBufferAttribute(s,t),K.fromBufferAttribute(c,t),G.w=1,K.w=1,G.applyMatrix4(Ge),K.applyMatrix4(Ge),G.z>u&&K.z>u)continue;if(G.z>u){let e=G.z-K.z,t=(G.z-u)/e;G.lerp(K,t)}else if(K.z>u){let e=K.z-G.z,t=(K.z-u)/e;K.lerp(G,t)}G.applyMatrix4(r),K.applyMatrix4(r),G.multiplyScalar(1/G.w),K.multiplyScalar(1/K.w),G.x*=i.x/2,G.y*=i.y/2,K.x*=i.x/2,K.y*=i.y/2,J.start.copy(G),J.start.z=0,J.end.copy(K),J.end.z=0;let o=J.closestPointToPointParameter(We,!0);J.at(o,Ke);let l=D.lerp(G.z,K.z,o),d=l>=-1&&l<=1,f=We.distanceTo(Ke)<Z*.5;if(d&&f){J.start.fromBufferAttribute(s,t),J.end.fromBufferAttribute(c,t),J.start.applyMatrix4(a),J.end.applyMatrix4(a);let r=new j,i=new j;X.distanceSqToSegment(J.start,J.end,i,r),n.push({point:i,pointOnLine:r,distance:X.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}var Q=class extends ae{constructor(e=new U,t=new W({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)He.fromBufferAttribute(t,e),Ue.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+He.distanceTo(Ue);let i=new P(r,2,1);return e.setAttribute(`instanceDistanceStart`,new I(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new I(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;if(r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;X=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;Z=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),Je.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?Z*.5:Ye(r,Math.max(r.near,Je.distanceToPoint(X.origin)),s.resolution),Je.radius+=c,X.intersectsSphere(Je)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),qe.copy(o.boundingBox).applyMatrix4(a);let l;l=n?Z*.5:Ye(r,Math.max(r.near,qe.distanceToPoint(X.origin)),s.resolution),qe.expandByScalar(l),X.intersectsBox(qe)!==!1&&(n?Xe(this,t):Ze(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(Ve),this.material.uniforms.resolution.value.set(Ve.z,Ve.w))}},Qe=class extends U{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setColors(n),this}setFromPoints(e){let t=e.length-1,n=new Float32Array(6*t);for(let r=0;r<t;r++)n[6*r]=e[r].x,n[6*r+1]=e[r].y,n[6*r+2]=e[r].z||0,n[6*r+3]=e[r+1].x,n[6*r+4]=e[r+1].y,n[6*r+5]=e[r+1].z||0;return super.setPositions(n),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},$e=class extends Q{constructor(e=new Qe,t=new W({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},et=`attribute vec4 color;\r
attribute float size;\r
varying vec4 vColor;\r
\r
void main() {\r
    vColor = color;\r
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\r
    gl_PointSize = size;\r
    gl_Position = projectionMatrix * mvPosition;\r
}`,tt=`varying vec4 vColor;\r
        \r
void main() {\r
    vec2 coord = gl_PointCoord - vec2(0.5);\r
    float alpha = 1.0 - smoothstep(0.45, 0.5, length(coord));\r
    if (alpha*vColor.a < 0.1) \r
        discard;\r
    gl_FragColor = vec4(vColor.rgb, alpha*vColor.a);\r
}`;function nt(e,t,n,r,i){let a=new O,o=e.points;if(e.drawPoints&&o.length>0){let n=new ne,s=new Float32Array(o.flatMap(e=>[e.x,e.y,i]));n.setAttribute(`position`,new te(s,3));let c=new F(e.color),l=new Float32Array(o.flatMap(()=>[c.r,c.g,c.b,e.opacity??1]));n.setAttribute(`color`,new te(l,4));let u=new Float32Array(o.length).fill(3*e.scale);n.setAttribute(`size`,new te(u,1));let d=new ee(n,t);d.frustumCulled=!1,d.userData.groupName=e.groupName,d.visible=e.isVisible??!0,a.add(d),r.push(()=>n.dispose())}if(e.drawLines&&o.length>=2){let t=new Qe,s=o.flatMap(e=>[e.x,e.y,i]);t.setPositions(s);let c=new W({color:new F(e.color).convertSRGBToLinear(),transparent:!0,opacity:e.opacity??1,linewidth:e.scale,resolution:new k(1,1),worldUnits:!1});n.push(c);let l=new $e(t,c);l.frustumCulled=!1,l.userData.groupName=e.groupName,l.visible=e.isVisible??!0,a.add(l),r.push(()=>t.dispose()),r.push(()=>c.dispose())}return a}function rt(e){let t=new O,n=[],r=[],i=new ie({uniforms:{},vertexShader:et,fragmentShader:tt,transparent:!0,depthTest:!0,depthWrite:!1});return e.forEach((a,o)=>{let s=nt(a,i,r,n,-.5*(e.length-o)/e.length);s.frustumCulled=!1,t.add(s)}),{group:t,lineMaterials:r,cleanupTasks:n}}var it=class e{static{this.Z_OFFSET_BOTTOM=-.6}static{this.Z_OFFSET_TEXTS=.5}static{this.Z_OFFSET_TOP=.6}constructor(e=.05){this.baseTickSize=e,this.axisMaterial=new W({color:new F(16744448),linewidth:1,resolution:new k(window.innerWidth,window.innerHeight)}),this.minorGridMaterial=new W({color:new F(3355443),linewidth:.5,resolution:new k(window.innerWidth,window.innerHeight),transparent:!0,opacity:.4}),this.majorGridMaterial=new W({color:new F(5592405),linewidth:.8,resolution:new k(window.innerWidth,window.innerHeight),transparent:!0,opacity:.6})}createAxisGroup(t){let n=new O,{tMin:r,tMax:i,orientation:a,color:o=`#ff8000`,width:s,height:c,displayGrid:l=!1,gridColor:u,majorGridColor:d,textGroup:f}=t;this.setResolution(s,c);let p=this.baseTickSize*(500/c);this.axisMaterial.color.set(new F(o)),this.axisMaterial.linewidth=1,u&&this.minorGridMaterial.color.set(new F(u)),d&&this.majorGridMaterial.color.set(new F(d));let m=e=>{if(a===`horizontal`)return[((e-r)/(i-r)*2-1)*(s/c),-1+p];{let t=1-(i-e)/(i-r)*2;return[-s/c+p,t]}},h=[],g=[],_=[];if(a===`horizontal`){let[t,n]=m(r),[a,o]=m(i);h.push(t,n,e.Z_OFFSET_TOP,a,n,e.Z_OFFSET_TOP)}else{let[t,n]=m(r),[a,o]=m(i);h.push(t,n,e.Z_OFFSET_TOP,t,o,e.Z_OFFSET_TOP)}let v=i-r,y=a===`horizontal`?v/s:v/c,b=10**(Math.floor(Math.log10(y))+3),x=b;y/b<.005&&(x=b/2),y/b<.002&&(x=b/5);let S=Math.floor(r/x),C=Math.ceil(i/x);for(let t=S;t<=C;t++){let n=Math.round(t*x*0xe8d4a51000)/0xe8d4a51000,[r,i]=m(n);a===`horizontal`?(h.push(r,i-p,e.Z_OFFSET_TOP,r,i+p,e.Z_OFFSET_TOP),f.addText(`${n}`,[r,i+p/4,e.Z_OFFSET_TOP],[1,1,1],[0,-1],1.5*p),l&&g.push(r,-1,e.Z_OFFSET_BOTTOM,r,1,e.Z_OFFSET_BOTTOM)):(h.push(r-p,i,e.Z_OFFSET_TOP,r+p,i,e.Z_OFFSET_TOP),f.addText(`${n}`,[r+p/4,i,e.Z_OFFSET_TOP],[1,1,1],[-1,0],1.5*p),l&&g.push(-s/c,i,e.Z_OFFSET_BOTTOM,s/c,i,e.Z_OFFSET_BOTTOM));for(let n=1;n<5;n++){let[r,i]=m(Math.round((t+n/5)*x*0xe8d4a51000)/0xe8d4a51000);a===`horizontal`?(h.push(r,i-p/2,e.Z_OFFSET_TOP,r,i+p/2,e.Z_OFFSET_TOP),l&&_.push(r,-1,e.Z_OFFSET_BOTTOM,r,1,e.Z_OFFSET_BOTTOM)):(h.push(r-p/2,i,e.Z_OFFSET_TOP,r+p/2,i,e.Z_OFFSET_TOP),l&&_.push(-s/c,i,e.Z_OFFSET_BOTTOM,s/c,i,e.Z_OFFSET_BOTTOM))}}let w=new U;w.setPositions(h);let T=new Q(w,this.axisMaterial);if(n.add(T),l){if(g.length>0){let e=new U;e.setPositions(g);let t=new Q(e,this.majorGridMaterial);n.add(t)}if(_.length>0){let e=new U;e.setPositions(_);let t=new Q(e,this.minorGridMaterial);n.add(t)}}return n}setResolution(e,t){this.axisMaterial.resolution.set(e,t),this.minorGridMaterial.resolution.set(e,t),this.majorGridMaterial.resolution.set(e,t)}dispose(){this.axisMaterial.dispose(),this.minorGridMaterial.dispose(),this.majorGridMaterial.dispose()}createGroup(t,n,r,i){let a=new O,[o,s]=r,c=this.baseTickSize*(700/s),[l,u]=n.localFromScreen(0,s),[d,f]=n.localFromScreen(o,0),p=this.createAxisGroup({width:o,height:s,tMin:l,tMax:d,orientation:`horizontal`,color:`rgba(100, 100, 100, 1.0)`,displayGrid:!0,textGroup:i}),m=this.createAxisGroup({width:o,height:s,tMin:u,tMax:f,orientation:`vertical`,color:`rgba(100, 100, 100, 1.0)`,displayGrid:!0,textGroup:i});a.add(p,m),t.texts&&t.texts.forEach(t=>{t.visibleScaleX!==void 0&&n.scaleX>t.visibleScaleX||i.addText(t.text,[...n.worldFromLocal(t.p.x,t.p.y),e.Z_OFFSET_TEXTS],t.color??[1,1,1],t.anchor??[0,0],t.size*c)}),t.xLabel&&i.addText(t.xLabel,[o/s,-1+2*c,e.Z_OFFSET_TOP],[1,1,1],[1,-1],1.5*c),t.yLabel&&i.addText(t.yLabel,[-o/s+2*c,1,e.Z_OFFSET_TOP],[1,1,1],[-1,1],1.5*c);let h=0,g=1.5*c;return t.data.forEach(t=>{if(t.label&&t.isVisible){let n=new F(t.color);i.addText(t.label,[o/s-1*c,1-h*g,e.Z_OFFSET_TOP],[n.r,n.g,n.b],[1,1],g),h++}}),a}},at=class{static{this.instances=new Map}static acquire(e,t){let n=this.instances.get(e);return n||(n={resource:t(),refCount:0},this.instances.set(e,n)),n.refCount++,n.resource}static release(e){let t=this.instances.get(e);t&&(t.refCount--,t.refCount<=0&&(t.resource.dispose(),this.instances.delete(e)))}},ot=class{constructor(e,t,n){this.animationFrameHandle=0,A.DEFAULT_UP.set(0,1,0),this.container=e,this.props=n,this.cleanupTasks=[],this.renderer=at.acquire(`webgl-renderer`,()=>new le({antialias:!0,alpha:!0})),this.graphDecorator=at.acquire(`axis-renderer`,()=>new it),this.canvas=document.createElement(`canvas`),this.canvas.style.display=`block`,this.canvasContext=this.canvas.getContext(`2d`,{willReadFrequently:!1}),e.appendChild(this.canvas),this.lastDpr=-1,this.lastWidth=-1,this.lastHeight=-1,this.camera=new ce(-1,1,1,-1,.1,1e3),this.camera.position.set(0,0,1),this.camera.lookAt(new j(0,0,0));let r=rt(n.data);this.dataGroup=r.group,this.lineMaterials=r.lineMaterials,this.cleanupTasks.push(...r.cleanupTasks),this.scene=new ue,this.scene.add(this.dataGroup),this.textGroup=new ge(t[0]),this.scene.add(this.textGroup.getObject()),this.loc=new he(()=>this.getResolution(),!1),n.location&&(this.loc.x=n.location.x,this.loc.y=n.location.y,this.loc.scaleX=n.location.scaleX,this.loc.scaleY=n.location.scaleY),this.setupResize(),this.setupController(),this.resize()}resize(){let[e,t]=this.getResolution(),n=Math.min(window.devicePixelRatio,2);if(e===0||t===0||this.lastWidth===e&&this.lastHeight===t&&this.lastDpr===n)return;this.lastDpr=n,this.lastWidth=e,this.lastHeight=t,this.canvas.width=e*n,this.canvas.height=t*n,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`;let r=e/t;this.camera.left=-r,this.camera.right=r,this.camera.updateProjectionMatrix(),this.lineMaterials.forEach(n=>{n.resolution.copy(new k(e,t)),n.needsUpdate=!0}),console.log(`Resize`,e,t),this.controller.update()}setupResize(){let e=new ResizeObserver(()=>this.resize());e.observe(this.container),this.cleanupTasks.push(()=>e.disconnect())}getResolution(){return[this.container.clientWidth,this.container.clientHeight]}setupController(){let e=this;this.controller={transform(t,n,r,i,a,o){e.loc.transform(t,n,r,i,a,o),e.requestRender()},setLocation(t,n,r){e.loc.setLocation(t,n,r,r),e.requestRender()},update(){e.requestRender()}}}getController(){return this.controller}dispose(){this.animationFrameHandle&&cancelAnimationFrame(this.animationFrameHandle),this.textGroup.dispose();for(let e of this.cleanupTasks)e();this.cleanupTasks=[],this.container.removeChild(this.canvas),this.canvas.width=1,this.canvas.height=1,at.release(`webgl-renderer`),at.release(`axis-renderer`)}render(){this.dataGroup.scale.set(1/this.loc.scaleX,1/this.loc.scaleY,1),this.dataGroup.position.set(-this.loc.x/this.loc.scaleX,-this.loc.y/this.loc.scaleY,0);let[e,t]=this.getResolution(),n=this.graphDecorator.createGroup(this.props,this.loc,[e,t],this.textGroup);this.scene.add(n),(this.renderer.domElement.width!==e||this.renderer.domElement.height!==t)&&this.renderer.setSize(e,t),this.renderer.getPixelRatio()!==this.lastDpr&&this.renderer.setPixelRatio(this.lastDpr),this.renderer.render(this.scene,this.camera),this.canvasContext.globalCompositeOperation=`copy`,this.canvasContext.drawImage(this.renderer.domElement,0,0),this.canvasContext.globalCompositeOperation=`source-over`,this.scene.remove(n),this.textGroup.reset()}requestRender(){this.animationFrameHandle||=requestAnimationFrame(()=>{this.render(),this.animationFrameHandle=0})}setIsVisible(e,t){this.scene.traverse(n=>{n.userData.groupName===e&&(n.visible=t)}),this.requestRender()}},st=(e,t,n,r)=>{let i=1/0,a=n[0],o=0;return n.forEach((n,s)=>{let[c,l]=r.worldFromLocal(n.x,n.y),u=Math.hypot(e-c,t-l);u<i&&(i=u,a=n,o=s)}),{dist:i,p:a,index:o}},ct=(e,t,n,r)=>{let i=1/0,a={x:0,y:0},o=0;for(let s=0;s<n.length-1;s++){let[c,l]=r.worldFromLocal(n[s].x,n[s].y),[u,d]=r.worldFromLocal(n[s+1].x,n[s+1].y),f=u-c,p=d-l,m=f*f+p*p;if(m===0)continue;let h=Math.max(0,Math.min(1,((e-c)*f+(t-l)*p)/m)),g=c+h*f,_=l+h*p,v=Math.hypot(e-g,t-_);if(v<i){let[e,t]=r.localFromWorld(g,_);i=v,a={x:e,y:t},o=s}}return{dist:i,p:a,index:o}},lt=({x:e,y:t,visible:n,graphProps:r,renderer:i})=>{let[a,s]=i.loc.localFromScreen(e,t),[c,l]=i.loc.worldFromScreen(e,t),[u,d]=i.getResolution(),f=1/0,p={p:{x:a,y:s},dist:f};r.data.forEach((e,t)=>{if(e.drawPoints&&e.isVisible){let n=st(c,l,e.points,i.loc);n.dist<f&&n.dist<.05&&(f=n.dist,p={...n,ds:e,isHit:!0,type:`Point`,text:e.label||`Dataset ${t}`})}}),r.data.forEach((e,t)=>{if(e.drawLines&&e.isVisible){let n=ct(c,l,e.points,i.loc);n.dist<.5*f&&n.dist<.02&&(f=n.dist,p={...n,ds:e,isHit:!0,type:`Linesegment`,text:e.label||`Dataset ${t}`})}}),r.texts?.forEach((e,t)=>{if(!e.visibleScaleX||e.visibleScaleX>i.loc.scaleX){let[n,r]=i.loc.worldFromLocal(e.p.x,e.p.y),a=Math.hypot(c-n,l-r);a<f&&a<.05&&(f=a,p={dist:a,p:e.p,isHit:!0,index:t,type:`Text`,text:e.text||`Text ${t}`})}});let m=p?.p||{x:a,y:s},[h,g]=i.loc.screenFromLocal(m.x,m.y);return n&&(console.log(`Inspection:`,p.p),p.ds&&p.ds.inspectInfo&&(p.type==`Linesegment`?(console.log(`Line point 1:`,p.ds.inspectInfo(p.index)),console.log(`Line point 2:`,p.ds.inspectInfo(p.index+1))):console.log(`Point:`,p.ds.inspectInfo(p.index)))),(0,B.jsxs)(B.Fragment,{children:[(0,B.jsxs)(o,{onContextMenu:e=>e.preventDefault(),sx:{minWidth:240,p:1,bgcolor:`background.paper`,borderRadius:5,position:`absolute`,left:e<u-300?e+32:void 0,right:e>=u-300?u-e+32:void 0,top:t<d-200?t:void 0,bottom:t>=d-200?d-t:void 0,display:n?`block`:`none`,userSelect:`text`,border:`3px solid orange`},children:[(0,B.jsxs)(b,{variant:`body2`,textAlign:`center`,children:[`P: (`,m.x.toFixed(6),`, `,m.y.toFixed(6),`)`]}),p.type&&(0,B.jsxs)(b,{variant:`body2`,textAlign:`center`,color:`text.secondary`,children:[`Index: `,p.type===`Linesegment`?`${p.index}-${p.index+1}`:p.index,(0,B.jsx)(`br`,{}),`Type: `,p.type,(0,B.jsx)(`br`,{}),`Source: `,p.text]})]}),(0,B.jsx)(o,{sx:{width:31,height:31,bgcolor:p?.isHit?`rgba(50, 250, 50, 0.5)`:`rgba(250, 50, 50, 0.3)`,position:`absolute`,left:h,top:g,display:n?`block`:`none`,borderRadius:`50%`,transform:`translate(-50%, -50%)`,pointerEvents:`none`}})]})};function ut(e,t){return{mouse:{drag:t=>{t.buttons&1&&e.transform(t.x,t.y,t.dx,t.dy,1,0)},down:e=>{e.button===0&&t(null),e.button===2&&t({x:e.x,y:e.y,isVisible:!0})}},wheel:{zoom:n=>{e.transform(n.x,n.y,0,0,1-.001*n.delta,0),t(null)},pan:t=>{e.transform(t.x,t.y,0,0,1,0)}},touch:{dragSingle:n=>{e.transform(n.x,n.y,n.dx,n.dy,1,0),t(null)},dragPair:t=>e.transform(t.x,t.y,t.dx,t.dy,t.scale,t.angle)},keyboard:{keydown:t=>{t.key===`-`&&e.transform(0,0,0,0,1/1.2,0),t.key===`+`&&e.transform(0,0,0,0,1.2,0)}},safariGesture:{change:t=>e.transform(0,0,0,0,t.scale,t.angle)}}}var dt=({groups:e,onToggle:t})=>(0,B.jsxs)(o,{sx:{p:2,bgcolor:`background.paper`,borderRadius:1,boxShadow:1,mb:2,position:`absolute`,right:10,bottom:`5%`},children:[(0,B.jsx)(b,{variant:`subtitle1`,gutterBottom:!0,children:`Toggle Plot Groups`}),(0,B.jsx)(je,{children:Array.from(e.keys()).map((n,r)=>(0,B.jsx)(De,{control:(0,B.jsx)(Re,{checked:e.get(n)[0].isVisible,onChange:r=>t(n,!e.get(n)[0].isVisible),color:`primary`}),label:n,sx:{"& .MuiFormControlLabel-label":{textTransform:`capitalize`,minWidth:`40px`}}},r))})]}),ft=e=>{let t=(0,z.useRef)(null),[n,r]=(0,z.useState)(null),[i,a]=(0,z.useState)(),[s,c]=(0,z.useState)(null),[l,u]=(0,z.useState)(!1),[d,f]=(0,z.useState)(new Map);(0,z.useEffect)(()=>{console.log(`useEffect: `,t.current);let e=new _e,n=new _e,i=0,a=()=>{i===2&&r([e,n])};return e.load(`times64`,()=>{i++,a()}),n.load(`consola64`,()=>{i++,a()}),()=>{e.dispose(),n.dispose()}},[]),(0,z.useEffect)(()=>{if(!t.current||!n)return;for(let t of e.data)t.groupName===void 0&&(t.groupName=`Undefined`),t.isVisible===void 0&&(t.isVisible=!0);let r=new Map;for(let t of e.data)r.has(t.groupName)||r.set(t.groupName,[]),r.get(t.groupName).push(t);f(r);let i=new ot(t.current,n,e);a(i);let o=i.getController();e.controllerRef&&(e.controllerRef.current=o);let s=new me(t.current,ut(o,c));return()=>{s.cleanup(),i.dispose(),e.controllerRef&&(e.controllerRef.current=null)}},[e,n]);let p=(t,n)=>{if(!(!d||!i)){i.setIsVisible(t,n);for(let r of e.data)r.groupName===t&&(r.isVisible=n);f(new Map(d))}};return(0,B.jsxs)(B.Fragment,{children:[!i&&`Loading...`,(0,B.jsxs)(o,{sx:{width:e.width??`100%`,height:e.height??`500px`,position:`relative`,display:`flex`,flexDirection:`column`,overflow:`hidden`},children:[i&&(0,B.jsx)(lt,{x:s?.x??0,y:s?.y??0,visible:s?.isVisible??!1,graphProps:e,renderer:i}),l&&(0,B.jsx)(dt,{groups:d,onToggle:(e,t)=>p(e,t)}),(0,B.jsx)(o,{ref:t,sx:{width:`100%`,height:`100%`}}),(0,B.jsxs)(o,{display:`flex`,children:[(0,B.jsx)(b,{variant:`subtitle1`,align:`center`,sx:{color:`text.primary`,whiteSpace:`pre-line`,padding:`2px`,margin:`0px`,width:`100%`},children:e.title??`Graph`}),d&&d.size>1&&(0,B.jsx)(h,{onClick:e=>u(e=>!e),children:`Filters`})]})]})]})};function $(e=1){let t=2*Math.PI*Math.random(),n=e*Math.sqrt(-2*Math.log(1-Math.random()));return{x:n*Math.cos(t),y:n*Math.sin(t)}}function pt(){let e=new fe((e,t)=>{let n=t[0];return[t[1],-100*n]},pe.RKDP),t=e.adaptiveSolve([1,0],0,10,1e-4,1e-5,!0),n=[],r=[],i=[],a=[],o=1e4;for(let e=0;e<t.ts.length;e++)r.push({x:t.ts[e],y:t.ys[e][0]});for(let r=0;r<o;r++){let s=0+10*(r/(o-1)),c=e.interpolateRKDP(t,s);n.push({x:s,y:Math.cos(10*s)}),i.push({x:s,y:c[0]}),a.push({x:s,y:Math.log10(Number.MIN_VALUE+Math.abs(Math.cos(10*s)-c[0]))})}return{dsExact:{points:n,drawPoints:!1,drawLines:!0,color:`orange`,scale:3,label:`Exact cos(\\omega t)`},dsRK:{points:r,drawPoints:!0,drawLines:!1,color:`red`,scale:3,label:`RK steps`},dsInterp:{points:i,drawPoints:!0,drawLines:!0,color:`lightgreen`,scale:1,label:`RK dense output`},dsLogError:{points:a,drawPoints:!0,drawLines:!0,color:`yellow`,scale:1,label:`log10-error`}}}var mt=()=>{let e=(0,z.useRef)(null),t=[],n=[],r=[];for(let e=0;e<1e4;e++){let e=$(1).x;t.push({x:e,y:Math.sin(5*e)+$(.2).x}),n.push({x:e,y:e*e+$(.1).x}),r.push({x:e,y:Math.sin(20*e)+$(.05).x})}t.sort((e,t)=>t.x-e.x),n.sort((e,t)=>t.x-e.x),r.sort((e,t)=>t.x-e.x);let i={points:t,drawPoints:!0,drawLines:!1,color:`red`,scale:1,label:`Graph red`},a={points:n,drawPoints:!0,drawLines:!0,color:`orange`,scale:2,label:`Graph orange`},s=Array.from({length:1e3}).map((e,t)=>({p:$(10),size:1,color:[1,1,1],text:`Text_${t}`,visibleScale:Math.exp($(1).x)}));s.push({p:{x:2,y:1},size:1,color:[1,1,1],text:`(2, 1)`,anchor:[0,0]}),s.push({p:{x:-1,y:-1},size:2,color:[1,1,1],text:`(-1, -1)`,anchor:[0,0]});let{dsExact:c,dsRK:l,dsInterp:u,dsLogError:d}=pt();return(0,B.jsxs)(x,{maxWidth:`xl`,children:[(0,B.jsx)(o,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,B.jsx)(b,{variant:`h2`,children:`Graph (three.js)`})}),(0,B.jsx)(h,{onClick:()=>e.current?.setLocation(1,1,.1),children:`Go to (1, 1, 0.1)`}),(0,B.jsx)(h,{onClick:()=>e.current?.setLocation(-5,-2,3),children:`Go to (-5, -2, 3)`}),(0,B.jsx)(h,{onClick:()=>e.current?.setLocation(5,1,2),children:`Go to (5, 1, 2)`}),(0,B.jsx)(ft,{data:[i,a],texts:s,xLabel:`x-label!`,yLabel:`y-label!`,controllerRef:e,title:`First Graph component`}),(0,B.jsx)(ft,{data:[c,l,u,d],location:{x:5,y:-5,scaleX:10,scaleY:10},xLabel:`t`,yLabel:`y`,title:`ODE test`}),(0,B.jsx)(S,{component:C,to:`/`,variant:`body1`,color:`primary`,children:`Back`})]})};export{mt as default};