import{a as e,i as t,n,r,t as i}from"./jsx-runtime-Bg_NI1en.js";import{c as a,o,s}from"./createTheme-CvG1KrPv.js";import{c,f as l,i as u,r as d,s as f,t as p}from"./createSimplePaletteValueFilter-DClZcuuT.js";import{n as m}from"./useId-B_MBo0In.js";import{a as h,i as g,n as _,o as v,t as y}from"./Fade-BjromnGO.js";import{c as b,n as x,t as S,u as C}from"./CircularProgress-CbT8a8jb.js";import{t as w}from"./Paper-C1NPKL9m.js";import{a as T,c as E,i as D,o as O,r as k,t as ee}from"./index-7Sg9j-SA.js";import{t as A}from"./katex-bBa4GRqP.js";function j(e){return s(`MuiIconButton`,e)}var te=o(`MuiIconButton`,[`root`,`disabled`,`colorInherit`,`colorPrimary`,`colorSecondary`,`colorError`,`colorInfo`,`colorSuccess`,`colorWarning`,`edgeStart`,`edgeEnd`,`sizeSmall`,`sizeMedium`,`sizeLarge`,`loading`,`loadingIndicator`,`loadingWrapper`]),M=e(n()),N=i(),ne=e=>{let{classes:t,disabled:n,color:r,edge:i,size:a,loading:o}=e;return l({root:[`root`,o&&`loading`,n&&`disabled`,r!==`default`&&`color${f(r)}`,i&&`edge${f(i)}`,`size${f(a)}`],loadingIndicator:[`loadingIndicator`],loadingWrapper:[`loadingWrapper`]},j,t)},re=c(x,{name:`MuiIconButton`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,n.loading&&t.loading,n.color!==`default`&&t[`color${f(n.color)}`],n.edge&&t[`edge${f(n.edge)}`],t[`size${f(n.size)}`]]}})(u(({theme:e})=>({textAlign:`center`,flex:`0 0 auto`,fontSize:e.typography.pxToRem(24),padding:8,borderRadius:`50%`,color:(e.vars||e).palette.action.active,transition:e.transitions.create(`background-color`,{duration:e.transitions.duration.shortest}),variants:[{props:e=>!e.disableRipple,style:{"--IconButton-hoverBg":e.alpha((e.vars||e).palette.action.active,(e.vars||e).palette.action.hoverOpacity),"&:hover":{backgroundColor:`var(--IconButton-hoverBg)`,"@media (hover: none)":{backgroundColor:`transparent`}}}},{props:{edge:`start`},style:{marginLeft:-12}},{props:{edge:`start`,size:`small`},style:{marginLeft:-3}},{props:{edge:`end`},style:{marginRight:-12}},{props:{edge:`end`,size:`small`},style:{marginRight:-3}}]})),u(({theme:e})=>({variants:[{props:{color:`inherit`},style:{color:`inherit`}},...Object.entries(e.palette).filter(p()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}})),...Object.entries(e.palette).filter(p()).map(([t])=>({props:{color:t},style:{"--IconButton-hoverBg":e.alpha((e.vars||e).palette[t].main,(e.vars||e).palette.action.hoverOpacity)}})),{props:{size:`small`},style:{padding:5,fontSize:e.typography.pxToRem(18)}},{props:{size:`large`},style:{padding:12,fontSize:e.typography.pxToRem(28)}}],[`&.${te.disabled}`]:{backgroundColor:`transparent`,color:(e.vars||e).palette.action.disabled},[`&.${te.loading}`]:{color:`transparent`}}))),ie=c(`span`,{name:`MuiIconButton`,slot:`LoadingIndicator`})(({theme:e})=>({display:`none`,position:`absolute`,visibility:`visible`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`,color:(e.vars||e).palette.action.disabled,variants:[{props:{loading:!0},style:{display:`flex`}}]})),ae=M.forwardRef(function(e,t){let n=d({props:e,name:`MuiIconButton`}),{edge:r=!1,children:i,className:o,color:s=`default`,disabled:c=!1,disableFocusRipple:l=!1,size:u=`medium`,id:f,loading:p=null,loadingIndicator:m,...h}=n,g=C(f),_=m??(0,N.jsx)(S,{"aria-labelledby":g,color:`inherit`,size:16}),v={...n,edge:r,color:s,disabled:c,disableFocusRipple:l,loading:p,loadingIndicator:_,size:u},y=ne(v);return(0,N.jsxs)(re,{id:p?g:f,className:a(y.root,o),centerRipple:!0,focusRipple:!l,disabled:c||p,ref:t,...h,ownerState:v,children:[typeof p==`boolean`&&(0,N.jsx)(`span`,{className:y.loadingWrapper,style:{display:`contents`},children:(0,N.jsx)(ie,{className:y.loadingIndicator,ownerState:v,children:p&&_})}),i]})}),oe=`bottom`,se=`right`,ce=`left`,le=`auto`,ue=[`top`,oe,se,ce],de=`start`,fe=`clippingParents`,pe=`viewport`,me=`popper`,he=`reference`,ge=ue.reduce(function(e,t){return e.concat([t+`-`+de,t+`-end`])},[]),_e=[].concat(ue,[le]).reduce(function(e,t){return e.concat([t,t+`-`+de,t+`-end`])},[]),ve=[`beforeRead`,`read`,`afterRead`,`beforeMain`,`main`,`afterMain`,`beforeWrite`,`write`,`afterWrite`];function ye(e){return e?(e.nodeName||``).toLowerCase():null}function P(e){if(e==null)return window;if(e.toString()!==`[object Window]`){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function be(e){return e instanceof P(e).Element||e instanceof Element}function xe(e){return e instanceof P(e).HTMLElement||e instanceof HTMLElement}function Se(e){return typeof ShadowRoot>`u`?!1:e instanceof P(e).ShadowRoot||e instanceof ShadowRoot}function Ce(e){var t=e.state;Object.keys(t.elements).forEach(function(e){var n=t.styles[e]||{},r=t.attributes[e]||{},i=t.elements[e];!xe(i)||!ye(i)||(Object.assign(i.style,n),Object.keys(r).forEach(function(e){var t=r[e];t===!1?i.removeAttribute(e):i.setAttribute(e,t===!0?``:t)}))})}function we(e){var t=e.state,n={popper:{position:t.options.strategy,left:`0`,top:`0`,margin:`0`},arrow:{position:`absolute`},reference:{}};return Object.assign(t.elements.popper.style,n.popper),t.styles=n,t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow),function(){Object.keys(t.elements).forEach(function(e){var r=t.elements[e],i=t.attributes[e]||{},a=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:n[e]).reduce(function(e,t){return e[t]=``,e},{});!xe(r)||!ye(r)||(Object.assign(r.style,a),Object.keys(i).forEach(function(e){r.removeAttribute(e)}))})}}var Te={name:`applyStyles`,enabled:!0,phase:`write`,fn:Ce,effect:we,requires:[`computeStyles`]};function Ee(e){return e.split(`-`)[0]}var De=Math.max,Oe=Math.min,ke=Math.round;function Ae(){var e=navigator.userAgentData;return e!=null&&e.brands&&Array.isArray(e.brands)?e.brands.map(function(e){return e.brand+`/`+e.version}).join(` `):navigator.userAgent}function je(){return!/^((?!chrome|android).)*safari/i.test(Ae())}function Me(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!1);var r=e.getBoundingClientRect(),i=1,a=1;t&&xe(e)&&(i=e.offsetWidth>0&&ke(r.width)/e.offsetWidth||1,a=e.offsetHeight>0&&ke(r.height)/e.offsetHeight||1);var o=(be(e)?P(e):window).visualViewport,s=!je()&&n,c=(r.left+(s&&o?o.offsetLeft:0))/i,l=(r.top+(s&&o?o.offsetTop:0))/a,u=r.width/i,d=r.height/a;return{width:u,height:d,top:l,right:c+u,bottom:l+d,left:c,x:c,y:l}}function Ne(e){var t=Me(e),n=e.offsetWidth,r=e.offsetHeight;return Math.abs(t.width-n)<=1&&(n=t.width),Math.abs(t.height-r)<=1&&(r=t.height),{x:e.offsetLeft,y:e.offsetTop,width:n,height:r}}function Pe(e,t){var n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&Se(n)){var r=t;do{if(r&&e.isSameNode(r))return!0;r=r.parentNode||r.host}while(r)}return!1}function Fe(e){return P(e).getComputedStyle(e)}function Ie(e){return[`table`,`td`,`th`].indexOf(ye(e))>=0}function Le(e){return((be(e)?e.ownerDocument:e.document)||window.document).documentElement}function Re(e){return ye(e)===`html`?e:e.assignedSlot||e.parentNode||(Se(e)?e.host:null)||Le(e)}function ze(e){return!xe(e)||Fe(e).position===`fixed`?null:e.offsetParent}function Be(e){var t=/firefox/i.test(Ae());if(/Trident/i.test(Ae())&&xe(e)&&Fe(e).position===`fixed`)return null;var n=Re(e);for(Se(n)&&(n=n.host);xe(n)&&[`html`,`body`].indexOf(ye(n))<0;){var r=Fe(n);if(r.transform!==`none`||r.perspective!==`none`||r.contain===`paint`||[`transform`,`perspective`].indexOf(r.willChange)!==-1||t&&r.willChange===`filter`||t&&r.filter&&r.filter!==`none`)return n;n=n.parentNode}return null}function Ve(e){for(var t=P(e),n=ze(e);n&&Ie(n)&&Fe(n).position===`static`;)n=ze(n);return n&&(ye(n)===`html`||ye(n)===`body`&&Fe(n).position===`static`)?t:n||Be(e)||t}function He(e){return[`top`,`bottom`].indexOf(e)>=0?`x`:`y`}function Ue(e,t,n){return De(e,Oe(t,n))}function We(e,t,n){var r=Ue(e,t,n);return r>n?n:r}function Ge(){return{top:0,right:0,bottom:0,left:0}}function Ke(e){return Object.assign({},Ge(),e)}function qe(e,t){return t.reduce(function(t,n){return t[n]=e,t},{})}var Je=function(e,t){return e=typeof e==`function`?e(Object.assign({},t.rects,{placement:t.placement})):e,Ke(typeof e==`number`?qe(e,ue):e)};function Ye(e){var t,n=e.state,r=e.name,i=e.options,a=n.elements.arrow,o=n.modifiersData.popperOffsets,s=Ee(n.placement),c=He(s),l=[`left`,`right`].indexOf(s)>=0?`height`:`width`;if(!(!a||!o)){var u=Je(i.padding,n),d=Ne(a),f=c===`y`?`top`:ce,p=c===`y`?oe:se,m=n.rects.reference[l]+n.rects.reference[c]-o[c]-n.rects.popper[l],h=o[c]-n.rects.reference[c],g=Ve(a),_=g?c===`y`?g.clientHeight||0:g.clientWidth||0:0,v=m/2-h/2,y=u[f],b=_-d[l]-u[p],x=_/2-d[l]/2+v,S=Ue(y,x,b),C=c;n.modifiersData[r]=(t={},t[C]=S,t.centerOffset=S-x,t)}}function Xe(e){var t=e.state,n=e.options.element,r=n===void 0?`[data-popper-arrow]`:n;r!=null&&(typeof r==`string`&&(r=t.elements.popper.querySelector(r),!r)||Pe(t.elements.popper,r)&&(t.elements.arrow=r))}var Ze={name:`arrow`,enabled:!0,phase:`main`,fn:Ye,effect:Xe,requires:[`popperOffsets`],requiresIfExists:[`preventOverflow`]};function Qe(e){return e.split(`-`)[1]}var $e={top:`auto`,right:`auto`,bottom:`auto`,left:`auto`};function et(e,t){var n=e.x,r=e.y,i=t.devicePixelRatio||1;return{x:ke(n*i)/i||0,y:ke(r*i)/i||0}}function tt(e){var t,n=e.popper,r=e.popperRect,i=e.placement,a=e.variation,o=e.offsets,s=e.position,c=e.gpuAcceleration,l=e.adaptive,u=e.roundOffsets,d=e.isFixed,f=o.x,p=f===void 0?0:f,m=o.y,h=m===void 0?0:m,g=typeof u==`function`?u({x:p,y:h}):{x:p,y:h};p=g.x,h=g.y;var _=o.hasOwnProperty(`x`),v=o.hasOwnProperty(`y`),y=ce,b=`top`,x=window;if(l){var S=Ve(n),C=`clientHeight`,w=`clientWidth`;if(S===P(n)&&(S=Le(n),Fe(S).position!==`static`&&s===`absolute`&&(C=`scrollHeight`,w=`scrollWidth`)),S=S,i===`top`||(i===`left`||i===`right`)&&a===`end`){b=oe;var T=d&&S===x&&x.visualViewport?x.visualViewport.height:S[C];h-=T-r.height,h*=c?1:-1}if(i===`left`||(i===`top`||i===`bottom`)&&a===`end`){y=se;var E=d&&S===x&&x.visualViewport?x.visualViewport.width:S[w];p-=E-r.width,p*=c?1:-1}}var D=Object.assign({position:s},l&&$e),O=u===!0?et({x:p,y:h},P(n)):{x:p,y:h};if(p=O.x,h=O.y,c){var k;return Object.assign({},D,(k={},k[b]=v?`0`:``,k[y]=_?`0`:``,k.transform=(x.devicePixelRatio||1)<=1?`translate(`+p+`px, `+h+`px)`:`translate3d(`+p+`px, `+h+`px, 0)`,k))}return Object.assign({},D,(t={},t[b]=v?h+`px`:``,t[y]=_?p+`px`:``,t.transform=``,t))}function nt(e){var t=e.state,n=e.options,r=n.gpuAcceleration,i=r===void 0?!0:r,a=n.adaptive,o=a===void 0?!0:a,s=n.roundOffsets,c=s===void 0?!0:s,l={placement:Ee(t.placement),variation:Qe(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:i,isFixed:t.options.strategy===`fixed`};t.modifiersData.popperOffsets!=null&&(t.styles.popper=Object.assign({},t.styles.popper,tt(Object.assign({},l,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:o,roundOffsets:c})))),t.modifiersData.arrow!=null&&(t.styles.arrow=Object.assign({},t.styles.arrow,tt(Object.assign({},l,{offsets:t.modifiersData.arrow,position:`absolute`,adaptive:!1,roundOffsets:c})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})}var rt={name:`computeStyles`,enabled:!0,phase:`beforeWrite`,fn:nt,data:{}},it={passive:!0};function at(e){var t=e.state,n=e.instance,r=e.options,i=r.scroll,a=i===void 0?!0:i,o=r.resize,s=o===void 0?!0:o,c=P(t.elements.popper),l=[].concat(t.scrollParents.reference,t.scrollParents.popper);return a&&l.forEach(function(e){e.addEventListener(`scroll`,n.update,it)}),s&&c.addEventListener(`resize`,n.update,it),function(){a&&l.forEach(function(e){e.removeEventListener(`scroll`,n.update,it)}),s&&c.removeEventListener(`resize`,n.update,it)}}var ot={name:`eventListeners`,enabled:!0,phase:`write`,fn:function(){},effect:at,data:{}},st={left:`right`,right:`left`,bottom:`top`,top:`bottom`};function ct(e){return e.replace(/left|right|bottom|top/g,function(e){return st[e]})}var lt={start:`end`,end:`start`};function ut(e){return e.replace(/start|end/g,function(e){return lt[e]})}function dt(e){var t=P(e);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function ft(e){return Me(Le(e)).left+dt(e).scrollLeft}function pt(e,t){var n=P(e),r=Le(e),i=n.visualViewport,a=r.clientWidth,o=r.clientHeight,s=0,c=0;if(i){a=i.width,o=i.height;var l=je();(l||!l&&t===`fixed`)&&(s=i.offsetLeft,c=i.offsetTop)}return{width:a,height:o,x:s+ft(e),y:c}}function mt(e){var t=Le(e),n=dt(e),r=e.ownerDocument?.body,i=De(t.scrollWidth,t.clientWidth,r?r.scrollWidth:0,r?r.clientWidth:0),a=De(t.scrollHeight,t.clientHeight,r?r.scrollHeight:0,r?r.clientHeight:0),o=-n.scrollLeft+ft(e),s=-n.scrollTop;return Fe(r||t).direction===`rtl`&&(o+=De(t.clientWidth,r?r.clientWidth:0)-i),{width:i,height:a,x:o,y:s}}function ht(e){var t=Fe(e),n=t.overflow,r=t.overflowX,i=t.overflowY;return/auto|scroll|overlay|hidden/.test(n+i+r)}function gt(e){return[`html`,`body`,`#document`].indexOf(ye(e))>=0?e.ownerDocument.body:xe(e)&&ht(e)?e:gt(Re(e))}function _t(e,t){t===void 0&&(t=[]);var n=gt(e),r=n===e.ownerDocument?.body,i=P(n),a=r?[i].concat(i.visualViewport||[],ht(n)?n:[]):n,o=t.concat(a);return r?o:o.concat(_t(Re(a)))}function vt(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function yt(e,t){var n=Me(e,!1,t===`fixed`);return n.top+=e.clientTop,n.left+=e.clientLeft,n.bottom=n.top+e.clientHeight,n.right=n.left+e.clientWidth,n.width=e.clientWidth,n.height=e.clientHeight,n.x=n.left,n.y=n.top,n}function bt(e,t,n){return t===`viewport`?vt(pt(e,n)):be(t)?yt(t,n):vt(mt(Le(e)))}function xt(e){var t=_t(Re(e)),n=[`absolute`,`fixed`].indexOf(Fe(e).position)>=0&&xe(e)?Ve(e):e;return be(n)?t.filter(function(e){return be(e)&&Pe(e,n)&&ye(e)!==`body`}):[]}function St(e,t,n,r){var i=t===`clippingParents`?xt(e):[].concat(t),a=[].concat(i,[n]),o=a[0],s=a.reduce(function(t,n){var i=bt(e,n,r);return t.top=De(i.top,t.top),t.right=Oe(i.right,t.right),t.bottom=Oe(i.bottom,t.bottom),t.left=De(i.left,t.left),t},bt(e,o,r));return s.width=s.right-s.left,s.height=s.bottom-s.top,s.x=s.left,s.y=s.top,s}function Ct(e){var t=e.reference,n=e.element,r=e.placement,i=r?Ee(r):null,a=r?Qe(r):null,o=t.x+t.width/2-n.width/2,s=t.y+t.height/2-n.height/2,c;switch(i){case`top`:c={x:o,y:t.y-n.height};break;case oe:c={x:o,y:t.y+t.height};break;case se:c={x:t.x+t.width,y:s};break;case ce:c={x:t.x-n.width,y:s};break;default:c={x:t.x,y:t.y}}var l=i?He(i):null;if(l!=null){var u=l===`y`?`height`:`width`;switch(a){case de:c[l]=c[l]-(t[u]/2-n[u]/2);break;case`end`:c[l]=c[l]+(t[u]/2-n[u]/2);break;default:}}return c}function wt(e,t){t===void 0&&(t={});var n=t,r=n.placement,i=r===void 0?e.placement:r,a=n.strategy,o=a===void 0?e.strategy:a,s=n.boundary,c=s===void 0?fe:s,l=n.rootBoundary,u=l===void 0?pe:l,d=n.elementContext,f=d===void 0?me:d,p=n.altBoundary,m=p===void 0?!1:p,h=n.padding,g=h===void 0?0:h,_=Ke(typeof g==`number`?qe(g,ue):g),v=f===`popper`?he:me,y=e.rects.popper,b=e.elements[m?v:f],x=St(be(b)?b:b.contextElement||Le(e.elements.popper),c,u,o),S=Me(e.elements.reference),C=Ct({reference:S,element:y,strategy:`absolute`,placement:i}),w=vt(Object.assign({},y,C)),T=f===`popper`?w:S,E={top:x.top-T.top+_.top,bottom:T.bottom-x.bottom+_.bottom,left:x.left-T.left+_.left,right:T.right-x.right+_.right},D=e.modifiersData.offset;if(f===`popper`&&D){var O=D[i];Object.keys(E).forEach(function(e){var t=[`right`,`bottom`].indexOf(e)>=0?1:-1,n=[`top`,`bottom`].indexOf(e)>=0?`y`:`x`;E[e]+=O[n]*t})}return E}function Tt(e,t){t===void 0&&(t={});var n=t,r=n.placement,i=n.boundary,a=n.rootBoundary,o=n.padding,s=n.flipVariations,c=n.allowedAutoPlacements,l=c===void 0?_e:c,u=Qe(r),d=u?s?ge:ge.filter(function(e){return Qe(e)===u}):ue,f=d.filter(function(e){return l.indexOf(e)>=0});f.length===0&&(f=d);var p=f.reduce(function(t,n){return t[n]=wt(e,{placement:n,boundary:i,rootBoundary:a,padding:o})[Ee(n)],t},{});return Object.keys(p).sort(function(e,t){return p[e]-p[t]})}function Et(e){if(Ee(e)===`auto`)return[];var t=ct(e);return[ut(e),t,ut(t)]}function Dt(e){var t=e.state,n=e.options,r=e.name;if(!t.modifiersData[r]._skip){for(var i=n.mainAxis,a=i===void 0?!0:i,o=n.altAxis,s=o===void 0?!0:o,c=n.fallbackPlacements,l=n.padding,u=n.boundary,d=n.rootBoundary,f=n.altBoundary,p=n.flipVariations,m=p===void 0?!0:p,h=n.allowedAutoPlacements,g=t.options.placement,_=Ee(g)===g,v=c||(_||!m?[ct(g)]:Et(g)),y=[g].concat(v).reduce(function(e,n){return e.concat(Ee(n)===`auto`?Tt(t,{placement:n,boundary:u,rootBoundary:d,padding:l,flipVariations:m,allowedAutoPlacements:h}):n)},[]),b=t.rects.reference,x=t.rects.popper,S=new Map,C=!0,w=y[0],T=0;T<y.length;T++){var E=y[T],D=Ee(E),O=Qe(E)===de,k=[`top`,oe].indexOf(D)>=0,ee=k?`width`:`height`,A=wt(t,{placement:E,boundary:u,rootBoundary:d,altBoundary:f,padding:l}),j=k?O?se:ce:O?oe:`top`;b[ee]>x[ee]&&(j=ct(j));var te=ct(j),M=[];if(a&&M.push(A[D]<=0),s&&M.push(A[j]<=0,A[te]<=0),M.every(function(e){return e})){w=E,C=!1;break}S.set(E,M)}if(C)for(var N=m?3:1,ne=function(e){var t=y.find(function(t){var n=S.get(t);if(n)return n.slice(0,e).every(function(e){return e})});if(t)return w=t,`break`},re=N;re>0&&ne(re)!==`break`;re--);t.placement!==w&&(t.modifiersData[r]._skip=!0,t.placement=w,t.reset=!0)}}var Ot={name:`flip`,enabled:!0,phase:`main`,fn:Dt,requiresIfExists:[`offset`],data:{_skip:!1}};function kt(e,t,n){return n===void 0&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function At(e){return[`top`,se,oe,ce].some(function(t){return e[t]>=0})}function jt(e){var t=e.state,n=e.name,r=t.rects.reference,i=t.rects.popper,a=t.modifiersData.preventOverflow,o=wt(t,{elementContext:`reference`}),s=wt(t,{altBoundary:!0}),c=kt(o,r),l=kt(s,i,a),u=At(c),d=At(l);t.modifiersData[n]={referenceClippingOffsets:c,popperEscapeOffsets:l,isReferenceHidden:u,hasPopperEscaped:d},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":u,"data-popper-escaped":d})}var Mt={name:`hide`,enabled:!0,phase:`main`,requiresIfExists:[`preventOverflow`],fn:jt};function Nt(e,t,n){var r=Ee(e),i=[`left`,`top`].indexOf(r)>=0?-1:1,a=typeof n==`function`?n(Object.assign({},t,{placement:e})):n,o=a[0],s=a[1];return o||=0,s=(s||0)*i,[`left`,`right`].indexOf(r)>=0?{x:s,y:o}:{x:o,y:s}}function Pt(e){var t=e.state,n=e.options,r=e.name,i=n.offset,a=i===void 0?[0,0]:i,o=_e.reduce(function(e,n){return e[n]=Nt(n,t.rects,a),e},{}),s=o[t.placement],c=s.x,l=s.y;t.modifiersData.popperOffsets!=null&&(t.modifiersData.popperOffsets.x+=c,t.modifiersData.popperOffsets.y+=l),t.modifiersData[r]=o}var Ft={name:`offset`,enabled:!0,phase:`main`,requires:[`popperOffsets`],fn:Pt};function It(e){var t=e.state,n=e.name;t.modifiersData[n]=Ct({reference:t.rects.reference,element:t.rects.popper,strategy:`absolute`,placement:t.placement})}var Lt={name:`popperOffsets`,enabled:!0,phase:`read`,fn:It,data:{}};function Rt(e){return e===`x`?`y`:`x`}function zt(e){var t=e.state,n=e.options,r=e.name,i=n.mainAxis,a=i===void 0?!0:i,o=n.altAxis,s=o===void 0?!1:o,c=n.boundary,l=n.rootBoundary,u=n.altBoundary,d=n.padding,f=n.tether,p=f===void 0?!0:f,m=n.tetherOffset,h=m===void 0?0:m,g=wt(t,{boundary:c,rootBoundary:l,padding:d,altBoundary:u}),_=Ee(t.placement),v=Qe(t.placement),y=!v,b=He(_),x=Rt(b),S=t.modifiersData.popperOffsets,C=t.rects.reference,w=t.rects.popper,T=typeof h==`function`?h(Object.assign({},t.rects,{placement:t.placement})):h,E=typeof T==`number`?{mainAxis:T,altAxis:T}:Object.assign({mainAxis:0,altAxis:0},T),D=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,O={x:0,y:0};if(S){if(a){var k=b===`y`?`top`:ce,ee=b===`y`?oe:se,A=b===`y`?`height`:`width`,j=S[b],te=j+g[k],M=j-g[ee],N=p?-w[A]/2:0,ne=v===`start`?C[A]:w[A],re=v===`start`?-w[A]:-C[A],ie=t.elements.arrow,ae=p&&ie?Ne(ie):{width:0,height:0},le=t.modifiersData[`arrow#persistent`]?t.modifiersData[`arrow#persistent`].padding:Ge(),ue=le[k],de=le[ee],fe=Ue(0,C[A],ae[A]),pe=y?C[A]/2-N-fe-ue-E.mainAxis:ne-fe-ue-E.mainAxis,me=y?-C[A]/2+N+fe+de+E.mainAxis:re+fe+de+E.mainAxis,he=t.elements.arrow&&Ve(t.elements.arrow),ge=he?b===`y`?he.clientTop||0:he.clientLeft||0:0,_e=D?.[b]??0,ve=j+pe-_e-ge,ye=j+me-_e,P=Ue(p?Oe(te,ve):te,j,p?De(M,ye):M);S[b]=P,O[b]=P-j}if(s){var be=b===`x`?`top`:ce,xe=b===`x`?oe:se,Se=S[x],Ce=x===`y`?`height`:`width`,we=Se+g[be],Te=Se-g[xe],ke=[`top`,ce].indexOf(_)!==-1,Ae=D?.[x]??0,je=ke?we:Se-C[Ce]-w[Ce]-Ae+E.altAxis,Me=ke?Se+C[Ce]+w[Ce]-Ae-E.altAxis:Te,Pe=p&&ke?We(je,Se,Me):Ue(p?je:we,Se,p?Me:Te);S[x]=Pe,O[x]=Pe-Se}t.modifiersData[r]=O}}var Bt={name:`preventOverflow`,enabled:!0,phase:`main`,fn:zt,requiresIfExists:[`offset`]};function Vt(e){return{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}}function Ht(e){return e===P(e)||!xe(e)?dt(e):Vt(e)}function Ut(e){var t=e.getBoundingClientRect(),n=ke(t.width)/e.offsetWidth||1,r=ke(t.height)/e.offsetHeight||1;return n!==1||r!==1}function Wt(e,t,n){n===void 0&&(n=!1);var r=xe(t),i=xe(t)&&Ut(t),a=Le(t),o=Me(e,i,n),s={scrollLeft:0,scrollTop:0},c={x:0,y:0};return(r||!r&&!n)&&((ye(t)!==`body`||ht(a))&&(s=Ht(t)),xe(t)?(c=Me(t,!0),c.x+=t.clientLeft,c.y+=t.clientTop):a&&(c.x=ft(a))),{x:o.left+s.scrollLeft-c.x,y:o.top+s.scrollTop-c.y,width:o.width,height:o.height}}function Gt(e){var t=new Map,n=new Set,r=[];e.forEach(function(e){t.set(e.name,e)});function i(e){n.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach(function(e){if(!n.has(e)){var r=t.get(e);r&&i(r)}}),r.push(e)}return e.forEach(function(e){n.has(e.name)||i(e)}),r}function Kt(e){var t=Gt(e);return ve.reduce(function(e,n){return e.concat(t.filter(function(e){return e.phase===n}))},[])}function qt(e){var t;return function(){return t||=new Promise(function(n){Promise.resolve().then(function(){t=void 0,n(e())})}),t}}function Jt(e){var t=e.reduce(function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign({},n,t,{options:Object.assign({},n.options,t.options),data:Object.assign({},n.data,t.data)}):t,e},{});return Object.keys(t).map(function(e){return t[e]})}var Yt={placement:`bottom`,modifiers:[],strategy:`absolute`};function Xt(){return![...arguments].some(function(e){return!(e&&typeof e.getBoundingClientRect==`function`)})}function Zt(e){e===void 0&&(e={});var t=e,n=t.defaultModifiers,r=n===void 0?[]:n,i=t.defaultOptions,a=i===void 0?Yt:i;return function(e,t,n){n===void 0&&(n=a);var i={placement:`bottom`,orderedModifiers:[],options:Object.assign({},Yt,a),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},o=[],s=!1,c={state:i,setOptions:function(n){var o=typeof n==`function`?n(i.options):n;u(),i.options=Object.assign({},a,i.options,o),i.scrollParents={reference:be(e)?_t(e):e.contextElement?_t(e.contextElement):[],popper:_t(t)};var s=Kt(Jt([].concat(r,i.options.modifiers)));return i.orderedModifiers=s.filter(function(e){return e.enabled}),l(),c.update()},forceUpdate:function(){if(!s){var e=i.elements,t=e.reference,n=e.popper;if(Xt(t,n)){i.rects={reference:Wt(t,Ve(n),i.options.strategy===`fixed`),popper:Ne(n)},i.reset=!1,i.placement=i.options.placement,i.orderedModifiers.forEach(function(e){return i.modifiersData[e.name]=Object.assign({},e.data)});for(var r=0;r<i.orderedModifiers.length;r++){if(i.reset===!0){i.reset=!1,r=-1;continue}var a=i.orderedModifiers[r],o=a.fn,l=a.options,u=l===void 0?{}:l,d=a.name;typeof o==`function`&&(i=o({state:i,options:u,name:d,instance:c})||i)}}}},update:qt(function(){return new Promise(function(e){c.forceUpdate(),e(i)})}),destroy:function(){u(),s=!0}};if(!Xt(e,t))return c;c.setOptions(n).then(function(e){!s&&n.onFirstUpdate&&n.onFirstUpdate(e)});function l(){i.orderedModifiers.forEach(function(e){var t=e.name,n=e.options,r=n===void 0?{}:n,a=e.effect;if(typeof a==`function`){var s=a({state:i,name:t,instance:c,options:r});o.push(s||function(){})}})}function u(){o.forEach(function(e){return e()}),o=[]}return c}}var Qt=Zt({defaultModifiers:[ot,Lt,rt,Te,Ft,Ot,Bt,Ze,Mt]});function $t(e){return s(`MuiPopper`,e)}o(`MuiPopper`,[`root`]);function en(e,t){if(t===`ltr`)return e;switch(e){case`bottom-end`:return`bottom-start`;case`bottom-start`:return`bottom-end`;case`top-end`:return`top-start`;case`top-start`:return`top-end`;default:return e}}function tn(e){return typeof e==`function`?e():e}function nn(e){return e.nodeType!==void 0}var rn=e=>{let{classes:t}=e;return l({root:[`root`]},$t,t)},an={},on=M.forwardRef(function(e,t){let{anchorEl:n,children:r,direction:i,disablePortal:a,modifiers:o,open:s,placement:c,popperOptions:l,popperRef:u,slotProps:d={},slots:f={},TransitionProps:p,ownerState:h,..._}=e,v=M.useRef(null),y=b(v,t),x=M.useRef(null),S=b(x,u),C=M.useRef(S);m(()=>{C.current=S},[S]),M.useImperativeHandle(u,()=>x.current,[]);let w=en(c,i),[T,E]=M.useState(w),[D,O]=M.useState(tn(n));M.useEffect(()=>{x.current&&x.current.forceUpdate()}),M.useEffect(()=>{n&&O(tn(n))},[n]),m(()=>{if(!D||!s)return;let e=e=>{E(e.placement)},t=[{name:`preventOverflow`,options:{altBoundary:a}},{name:`flip`,options:{altBoundary:a}},{name:`onUpdate`,enabled:!0,phase:`afterWrite`,fn:({state:t})=>{e(t)}}];o!=null&&(t=t.concat(o)),l&&l.modifiers!=null&&(t=t.concat(l.modifiers));let n=Qt(D,v.current,{placement:w,...l,modifiers:t});return C.current(n),()=>{n.destroy(),C.current(null)}},[D,a,o,s,l,w]);let k={placement:T};p!==null&&(k.TransitionProps=p);let ee=rn(e),A=f.root??`div`;return(0,N.jsx)(A,{...g({elementType:A,externalSlotProps:d.root,externalForwardedProps:_,additionalProps:{role:`tooltip`,ref:y},ownerState:e,className:ee.root}),children:typeof r==`function`?r(k):r})}),sn=c(M.forwardRef(function(e,t){let{anchorEl:n,children:r,container:i,direction:a=`ltr`,disablePortal:o=!1,keepMounted:s=!1,modifiers:c,open:l,placement:u=`bottom`,popperOptions:d=an,popperRef:f,style:p,transition:m=!1,slotProps:g={},slots:v={},...y}=e,[b,x]=M.useState(!0),S=()=>{x(!1)},C=()=>{x(!0)};if(!s&&!l&&(!m||b))return null;let w;if(i)w=i;else if(n){let e=tn(n);w=e&&nn(e)?h(e).body:h(null).body}let T=!l&&s&&(!m||b)?`none`:void 0,E=m?{in:l,onEnter:S,onExited:C}:void 0;return(0,N.jsx)(_,{disablePortal:o,container:w,children:(0,N.jsx)(on,{anchorEl:n,direction:a,disablePortal:o,modifiers:c,ref:t,open:m?!b:l,placement:u,popperOptions:d,popperRef:f,slotProps:g,slots:v,...y,style:{position:`fixed`,top:0,left:0,display:T,...p},TransitionProps:E,children:r})})}),{name:`MuiPopper`,slot:`Root`})({}),cn=M.forwardRef(function(e,t){let n=E(),{anchorEl:r,component:i,components:a,componentsProps:o,container:s,disablePortal:c,keepMounted:l,modifiers:u,open:f,placement:p,popperOptions:m,popperRef:h,transition:g,slots:_,slotProps:v,...y}=d({props:e,name:`MuiPopper`}),b=_?.root??a?.Root,x={anchorEl:r,container:s,disablePortal:c,keepMounted:l,modifiers:u,open:f,placement:p,popperOptions:m,popperRef:h,transition:g,...y};return(0,N.jsx)(sn,{as:i,direction:n?`rtl`:`ltr`,slots:{root:b},slotProps:v??o,...x,ref:t})});function ln(e){let t=[],n=String(e||``),r=n.indexOf(`,`),i=0,a=!1;for(;!a;){r===-1&&(r=n.length,a=!0);let e=n.slice(i,r).trim();(e||!a)&&t.push(e),i=r+1,r=n.indexOf(`,`,i)}return t}function un(e,t){let n=t||{};return(e[e.length-1]===``?[...e,``]:e).join((n.padRight?` `:``)+`,`+(n.padLeft===!1?``:` `)).trim()}var dn=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,fn=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,pn={};function mn(e,t){return((t||pn).jsx?fn:dn).test(e)}var hn=/[ \t\n\f\r]/g;function gn(e){return typeof e==`object`?e.type===`text`?_n(e.value):!1:_n(e)}function _n(e){return e.replace(hn,``)===``}var vn=class{constructor(e,t,n){this.normal=t,this.property=e,n&&(this.space=n)}};vn.prototype.normal={},vn.prototype.property={},vn.prototype.space=void 0;function yn(e,t){let n={},r={};for(let t of e)Object.assign(n,t.property),Object.assign(r,t.normal);return new vn(n,r,t)}function bn(e){return e.toLowerCase()}var xn=class{constructor(e,t){this.attribute=t,this.property=e}};xn.prototype.attribute=``,xn.prototype.booleanish=!1,xn.prototype.boolean=!1,xn.prototype.commaOrSpaceSeparated=!1,xn.prototype.commaSeparated=!1,xn.prototype.defined=!1,xn.prototype.mustUseProperty=!1,xn.prototype.number=!1,xn.prototype.overloadedBoolean=!1,xn.prototype.property=``,xn.prototype.spaceSeparated=!1,xn.prototype.space=void 0;var Sn=t({boolean:()=>F,booleanish:()=>I,commaOrSpaceSeparated:()=>En,commaSeparated:()=>Tn,number:()=>L,overloadedBoolean:()=>wn,spaceSeparated:()=>R}),Cn=0,F=Dn(),I=Dn(),wn=Dn(),L=Dn(),R=Dn(),Tn=Dn(),En=Dn();function Dn(){return 2**++Cn}var On=Object.keys(Sn),kn=class extends xn{constructor(e,t,n,r){let i=-1;if(super(e,t),An(this,`space`,r),typeof n==`number`)for(;++i<On.length;){let e=On[i];An(this,On[i],(n&Sn[e])===Sn[e])}}};kn.prototype.defined=!0;function An(e,t,n){n&&(e[t]=n)}function jn(e){let t={},n={};for(let[r,i]of Object.entries(e.properties)){let a=new kn(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(a.mustUseProperty=!0),t[r]=a,n[bn(r)]=r,n[bn(a.attribute)]=r}return new vn(t,n,e.space)}var Mn=jn({properties:{ariaActiveDescendant:null,ariaAtomic:I,ariaAutoComplete:null,ariaBusy:I,ariaChecked:I,ariaColCount:L,ariaColIndex:L,ariaColSpan:L,ariaControls:R,ariaCurrent:null,ariaDescribedBy:R,ariaDetails:null,ariaDisabled:I,ariaDropEffect:R,ariaErrorMessage:null,ariaExpanded:I,ariaFlowTo:R,ariaGrabbed:I,ariaHasPopup:null,ariaHidden:I,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:R,ariaLevel:L,ariaLive:null,ariaModal:I,ariaMultiLine:I,ariaMultiSelectable:I,ariaOrientation:null,ariaOwns:R,ariaPlaceholder:null,ariaPosInSet:L,ariaPressed:I,ariaReadOnly:I,ariaRelevant:null,ariaRequired:I,ariaRoleDescription:R,ariaRowCount:L,ariaRowIndex:L,ariaRowSpan:L,ariaSelected:I,ariaSetSize:L,ariaSort:null,ariaValueMax:L,ariaValueMin:L,ariaValueNow:L,ariaValueText:null,role:null},transform(e,t){return t===`role`?t:`aria-`+t.slice(4).toLowerCase()}});function Nn(e,t){return t in e?e[t]:t}function Pn(e,t){return Nn(e,t.toLowerCase())}var Fn=jn({attributes:{acceptcharset:`accept-charset`,classname:`class`,htmlfor:`for`,httpequiv:`http-equiv`},mustUseProperty:[`checked`,`multiple`,`muted`,`selected`],properties:{abbr:null,accept:Tn,acceptCharset:R,accessKey:R,action:null,allow:null,allowFullScreen:F,allowPaymentRequest:F,allowUserMedia:F,alpha:F,alt:null,as:null,async:F,autoCapitalize:null,autoComplete:R,autoFocus:F,autoPlay:F,blocking:R,capture:null,charSet:null,checked:F,cite:null,className:R,closedBy:null,colorSpace:null,cols:L,colSpan:L,command:null,commandFor:null,content:null,contentEditable:I,controls:F,controlsList:R,coords:L|Tn,crossOrigin:null,data:null,dateTime:null,decoding:null,default:F,defer:F,dir:null,dirName:null,disabled:F,download:wn,draggable:I,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:F,formTarget:null,headers:R,height:L,hidden:wn,high:L,href:null,hrefLang:null,htmlFor:R,httpEquiv:R,id:null,imageSizes:null,imageSrcSet:null,inert:F,inputMode:null,integrity:null,is:null,isMap:F,itemId:null,itemProp:R,itemRef:R,itemScope:F,itemType:R,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:F,low:L,manifest:null,max:null,maxLength:L,media:null,method:null,min:null,minLength:L,multiple:F,muted:F,name:null,nonce:null,noModule:F,noValidate:F,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:F,optimum:L,pattern:null,ping:R,placeholder:null,playsInline:F,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:F,referrerPolicy:null,rel:R,required:F,reversed:F,rows:L,rowSpan:L,sandbox:R,scope:null,scoped:F,seamless:F,selected:F,shadowRootClonable:F,shadowRootCustomElementRegistry:F,shadowRootDelegatesFocus:F,shadowRootMode:null,shadowRootSerializable:F,shape:null,size:L,sizes:null,slot:null,span:L,spellCheck:I,src:null,srcDoc:null,srcLang:null,srcSet:null,start:L,step:null,style:null,tabIndex:L,target:null,title:null,translate:null,type:null,typeMustMatch:F,useMap:null,value:I,width:L,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:R,axis:null,background:null,bgColor:null,border:L,borderColor:null,bottomMargin:L,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:F,declare:F,event:null,face:null,frame:null,frameBorder:null,hSpace:L,leftMargin:L,link:null,longDesc:null,lowSrc:null,marginHeight:L,marginWidth:L,noResize:F,noHref:F,noShade:F,noWrap:F,object:null,profile:null,prompt:null,rev:null,rightMargin:L,rules:null,scheme:null,scrolling:I,standby:null,summary:null,text:null,topMargin:L,valueType:null,version:null,vAlign:null,vLink:null,vSpace:L,allowTransparency:null,autoCorrect:null,autoSave:null,credentialless:F,disablePictureInPicture:F,disableRemotePlayback:F,exportParts:Tn,part:R,prefix:null,property:null,results:L,security:null,unselectable:null},space:`html`,transform:Pn}),In=jn({attributes:{accentHeight:`accent-height`,alignmentBaseline:`alignment-baseline`,arabicForm:`arabic-form`,baselineShift:`baseline-shift`,capHeight:`cap-height`,className:`class`,clipPath:`clip-path`,clipRule:`clip-rule`,colorInterpolation:`color-interpolation`,colorInterpolationFilters:`color-interpolation-filters`,colorProfile:`color-profile`,colorRendering:`color-rendering`,crossOrigin:`crossorigin`,dataType:`datatype`,dominantBaseline:`dominant-baseline`,enableBackground:`enable-background`,fillOpacity:`fill-opacity`,fillRule:`fill-rule`,floodColor:`flood-color`,floodOpacity:`flood-opacity`,fontFamily:`font-family`,fontSize:`font-size`,fontSizeAdjust:`font-size-adjust`,fontStretch:`font-stretch`,fontStyle:`font-style`,fontVariant:`font-variant`,fontWeight:`font-weight`,glyphName:`glyph-name`,glyphOrientationHorizontal:`glyph-orientation-horizontal`,glyphOrientationVertical:`glyph-orientation-vertical`,hrefLang:`hreflang`,horizAdvX:`horiz-adv-x`,horizOriginX:`horiz-origin-x`,horizOriginY:`horiz-origin-y`,imageRendering:`image-rendering`,letterSpacing:`letter-spacing`,lightingColor:`lighting-color`,markerEnd:`marker-end`,markerMid:`marker-mid`,markerStart:`marker-start`,maskType:`mask-type`,navDown:`nav-down`,navDownLeft:`nav-down-left`,navDownRight:`nav-down-right`,navLeft:`nav-left`,navNext:`nav-next`,navPrev:`nav-prev`,navRight:`nav-right`,navUp:`nav-up`,navUpLeft:`nav-up-left`,navUpRight:`nav-up-right`,onAbort:`onabort`,onActivate:`onactivate`,onAfterPrint:`onafterprint`,onBeforePrint:`onbeforeprint`,onBegin:`onbegin`,onCancel:`oncancel`,onCanPlay:`oncanplay`,onCanPlayThrough:`oncanplaythrough`,onChange:`onchange`,onClick:`onclick`,onClose:`onclose`,onCopy:`oncopy`,onCueChange:`oncuechange`,onCut:`oncut`,onDblClick:`ondblclick`,onDrag:`ondrag`,onDragEnd:`ondragend`,onDragEnter:`ondragenter`,onDragExit:`ondragexit`,onDragLeave:`ondragleave`,onDragOver:`ondragover`,onDragStart:`ondragstart`,onDrop:`ondrop`,onDurationChange:`ondurationchange`,onEmptied:`onemptied`,onEnd:`onend`,onEnded:`onended`,onError:`onerror`,onFocus:`onfocus`,onFocusIn:`onfocusin`,onFocusOut:`onfocusout`,onHashChange:`onhashchange`,onInput:`oninput`,onInvalid:`oninvalid`,onKeyDown:`onkeydown`,onKeyPress:`onkeypress`,onKeyUp:`onkeyup`,onLoad:`onload`,onLoadedData:`onloadeddata`,onLoadedMetadata:`onloadedmetadata`,onLoadStart:`onloadstart`,onMessage:`onmessage`,onMouseDown:`onmousedown`,onMouseEnter:`onmouseenter`,onMouseLeave:`onmouseleave`,onMouseMove:`onmousemove`,onMouseOut:`onmouseout`,onMouseOver:`onmouseover`,onMouseUp:`onmouseup`,onMouseWheel:`onmousewheel`,onOffline:`onoffline`,onOnline:`ononline`,onPageHide:`onpagehide`,onPageShow:`onpageshow`,onPaste:`onpaste`,onPause:`onpause`,onPlay:`onplay`,onPlaying:`onplaying`,onPopState:`onpopstate`,onProgress:`onprogress`,onRateChange:`onratechange`,onRepeat:`onrepeat`,onReset:`onreset`,onResize:`onresize`,onScroll:`onscroll`,onSeeked:`onseeked`,onSeeking:`onseeking`,onSelect:`onselect`,onShow:`onshow`,onStalled:`onstalled`,onStorage:`onstorage`,onSubmit:`onsubmit`,onSuspend:`onsuspend`,onTimeUpdate:`ontimeupdate`,onToggle:`ontoggle`,onUnload:`onunload`,onVolumeChange:`onvolumechange`,onWaiting:`onwaiting`,onZoom:`onzoom`,overlinePosition:`overline-position`,overlineThickness:`overline-thickness`,paintOrder:`paint-order`,panose1:`panose-1`,pointerEvents:`pointer-events`,referrerPolicy:`referrerpolicy`,renderingIntent:`rendering-intent`,shapeRendering:`shape-rendering`,stopColor:`stop-color`,stopOpacity:`stop-opacity`,strikethroughPosition:`strikethrough-position`,strikethroughThickness:`strikethrough-thickness`,strokeDashArray:`stroke-dasharray`,strokeDashOffset:`stroke-dashoffset`,strokeLineCap:`stroke-linecap`,strokeLineJoin:`stroke-linejoin`,strokeMiterLimit:`stroke-miterlimit`,strokeOpacity:`stroke-opacity`,strokeWidth:`stroke-width`,tabIndex:`tabindex`,textAnchor:`text-anchor`,textDecoration:`text-decoration`,textRendering:`text-rendering`,transformOrigin:`transform-origin`,typeOf:`typeof`,underlinePosition:`underline-position`,underlineThickness:`underline-thickness`,unicodeBidi:`unicode-bidi`,unicodeRange:`unicode-range`,unitsPerEm:`units-per-em`,vAlphabetic:`v-alphabetic`,vHanging:`v-hanging`,vIdeographic:`v-ideographic`,vMathematical:`v-mathematical`,vectorEffect:`vector-effect`,vertAdvY:`vert-adv-y`,vertOriginX:`vert-origin-x`,vertOriginY:`vert-origin-y`,wordSpacing:`word-spacing`,writingMode:`writing-mode`,xHeight:`x-height`,playbackOrder:`playbackorder`,timelineBegin:`timelinebegin`},properties:{about:En,accentHeight:L,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:L,amplitude:L,arabicForm:null,ascent:L,attributeName:null,attributeType:null,azimuth:L,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:L,by:null,calcMode:null,capHeight:L,className:R,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:L,diffuseConstant:L,direction:null,display:null,dur:null,divisor:L,dominantBaseline:null,download:F,dx:null,dy:null,edgeMode:null,editable:null,elevation:L,enableBackground:null,end:null,event:null,exponent:L,externalResourcesRequired:null,fill:null,fillOpacity:L,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:Tn,g2:Tn,glyphName:Tn,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:L,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:L,horizOriginX:L,horizOriginY:L,id:null,ideographic:L,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:L,k:L,k1:L,k2:L,k3:L,k4:L,kernelMatrix:En,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:L,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskType:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:L,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:L,overlineThickness:L,paintOrder:null,panose1:null,path:null,pathLength:L,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:R,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:L,pointsAtY:L,pointsAtZ:L,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:En,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:En,rev:En,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:En,requiredFeatures:En,requiredFonts:En,requiredFormats:En,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:L,specularExponent:L,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:L,strikethroughThickness:L,string:null,stroke:null,strokeDashArray:En,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:L,strokeOpacity:L,strokeWidth:null,style:null,surfaceScale:L,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:En,tabIndex:L,tableValues:null,target:null,targetX:L,targetY:L,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:En,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:L,underlineThickness:L,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:L,values:null,vAlphabetic:L,vMathematical:L,vectorEffect:null,vHanging:L,vIdeographic:L,version:null,vertAdvY:L,vertOriginX:L,vertOriginY:L,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:L,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:`svg`,transform:Nn}),Ln=jn({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:`xlink`,transform(e,t){return`xlink:`+t.slice(5).toLowerCase()}}),Rn=jn({attributes:{xmlnsxlink:`xmlns:xlink`},properties:{xmlnsXLink:null,xmlns:null},space:`xmlns`,transform:Pn}),zn=jn({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:`xml`,transform(e,t){return`xml:`+t.slice(3).toLowerCase()}}),Bn={classId:`classID`,dataType:`datatype`,itemId:`itemID`,strokeDashArray:`strokeDasharray`,strokeDashOffset:`strokeDashoffset`,strokeLineCap:`strokeLinecap`,strokeLineJoin:`strokeLinejoin`,strokeMiterLimit:`strokeMiterlimit`,typeOf:`typeof`,xLinkActuate:`xlinkActuate`,xLinkArcRole:`xlinkArcrole`,xLinkHref:`xlinkHref`,xLinkRole:`xlinkRole`,xLinkShow:`xlinkShow`,xLinkTitle:`xlinkTitle`,xLinkType:`xlinkType`,xmlnsXLink:`xmlnsXlink`},Vn=/[A-Z]/g,Hn=/-[a-z]/g,Un=/^data[-\w.:]+$/i;function Wn(e,t){let n=bn(t),r=t,i=xn;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)===`data`&&Un.test(t)){if(t.charAt(4)===`-`){let e=t.slice(5).replace(Hn,Kn);r=`data`+e.charAt(0).toUpperCase()+e.slice(1)}else{let e=t.slice(4);if(!Hn.test(e)){let n=e.replace(Vn,Gn);n.charAt(0)!==`-`&&(n=`-`+n),t=`data`+n}}i=kn}return new i(r,t)}function Gn(e){return`-`+e.toLowerCase()}function Kn(e){return e.charAt(1).toUpperCase()}var qn=yn([Mn,Fn,Ln,Rn,zn],`html`),Jn=yn([Mn,In,Ln,Rn,zn],`svg`);function Yn(e){let t=String(e||``).trim();return t?t.split(/[ \t\n\r\f]+/g):[]}function Xn(e){return e.join(` `).trim()}var Zn=r(((e,t)=>{var n=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,r=/\n/g,i=/^\s*/,a=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,o=/^:\s*/,s=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,c=/^[;\s]*/,l=/^\s+|\s+$/g,u=`
`,d=`/`,f=`*`,p=``,m=`comment`,h=`declaration`;function g(e,t){if(typeof e!=`string`)throw TypeError(`First argument must be a string`);if(!e)return[];t||={};var l=1,g=1;function v(e){var t=e.match(r);t&&(l+=t.length);var n=e.lastIndexOf(u);g=~n?e.length-n:g+e.length}function y(){var e={line:l,column:g};return function(t){return t.position=new b(e),C(),t}}function b(e){this.start=e,this.end={line:l,column:g},this.source=t.source}b.prototype.content=e;function x(n){var r=Error(t.source+`:`+l+`:`+g+`: `+n);if(r.reason=n,r.filename=t.source,r.line=l,r.column=g,r.source=e,!t.silent)throw r}function S(t){var n=t.exec(e);if(n){var r=n[0];return v(r),e=e.slice(r.length),n}}function C(){S(i)}function w(e){var t;for(e||=[];t=T();)t!==!1&&e.push(t);return e}function T(){var t=y();if(!(d!=e.charAt(0)||f!=e.charAt(1))){for(var n=2;p!=e.charAt(n)&&(f!=e.charAt(n)||d!=e.charAt(n+1));)++n;if(n+=2,p===e.charAt(n-1))return x(`End of comment missing`);var r=e.slice(2,n-2);return g+=2,v(r),e=e.slice(n),g+=2,t({type:m,comment:r})}}function E(){var e=y(),t=S(a);if(t){if(T(),!S(o))return x(`property missing ':'`);var r=S(s),i=e({type:h,property:_(t[0].replace(n,p)),value:r?_(r[0].replace(n,p)):p});return S(c),i}}function D(){var e=[];w(e);for(var t;t=E();)t!==!1&&(e.push(t),w(e));return e}return C(),D()}function _(e){return e?e.replace(l,p):p}t.exports=g})),Qn=r((e=>{var t=e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,`__esModule`,{value:!0}),e.default=r;var n=t(Zn());function r(e,t){let r=null;if(!e||typeof e!=`string`)return r;let i=(0,n.default)(e),a=typeof t==`function`;return i.forEach(e=>{if(e.type!==`declaration`)return;let{property:n,value:i}=e;a?t(n,i,e):i&&(r||={},r[n]=i)}),r}})),$n=r((e=>{Object.defineProperty(e,`__esModule`,{value:!0}),e.camelCase=void 0;var t=/^--[a-zA-Z0-9_-]+$/,n=/-([a-z])/g,r=/^[^-]+$/,i=/^-(webkit|moz|ms|o|khtml)-/,a=/^-(ms)-/,o=function(e){return!e||r.test(e)||t.test(e)},s=function(e,t){return t.toUpperCase()},c=function(e,t){return`${t}-`};e.camelCase=function(e,t){return t===void 0&&(t={}),o(e)?e:(e=e.toLowerCase(),e=t.reactCompat?e.replace(a,c):e.replace(i,c),e.replace(n,s))}})),er=r(((e,t)=>{var n=(e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}})(Qn()),r=$n();function i(e,t){var i={};return!e||typeof e!=`string`||(0,n.default)(e,function(e,n){e&&n&&(i[(0,r.camelCase)(e,t)]=n)}),i}i.default=i,t.exports=i})),tr=rr(`end`),nr=rr(`start`);function rr(e){return t;function t(t){let n=t&&t.position&&t.position[e]||{};if(typeof n.line==`number`&&n.line>0&&typeof n.column==`number`&&n.column>0)return{line:n.line,column:n.column,offset:typeof n.offset==`number`&&n.offset>-1?n.offset:void 0}}}function ir(e){let t=nr(e),n=tr(e);if(t&&n)return{start:t,end:n}}function ar(e){return!e||typeof e!=`object`?``:`position`in e||`type`in e?sr(e.position):`start`in e||`end`in e?sr(e):`line`in e||`column`in e?or(e):``}function or(e){return cr(e&&e.line)+`:`+cr(e&&e.column)}function sr(e){return or(e&&e.start)+`-`+or(e&&e.end)}function cr(e){return e&&typeof e==`number`?e:1}var lr=class extends Error{constructor(e,t,n){super(),typeof t==`string`&&(n=t,t=void 0);let r=``,i={},a=!1;if(t&&(i=`line`in t&&`column`in t||`start`in t&&`end`in t?{place:t}:`type`in t?{ancestors:[t],place:t.position}:{...t}),typeof e==`string`?r=e:!i.cause&&e&&(a=!0,r=e.message,i.cause=e),!i.ruleId&&!i.source&&typeof n==`string`){let e=n.indexOf(`:`);e===-1?i.ruleId=n:(i.source=n.slice(0,e),i.ruleId=n.slice(e+1))}if(!i.place&&i.ancestors&&i.ancestors){let e=i.ancestors[i.ancestors.length-1];e&&(i.place=e.position)}let o=i.place&&`start`in i.place?i.place.start:i.place;this.ancestors=i.ancestors||void 0,this.cause=i.cause||void 0,this.column=o?o.column:void 0,this.fatal=void 0,this.file=``,this.message=r,this.line=o?o.line:void 0,this.name=ar(i.place)||`1:1`,this.place=i.place||void 0,this.reason=this.message,this.ruleId=i.ruleId||void 0,this.source=i.source||void 0,this.stack=a&&i.cause&&typeof i.cause.stack==`string`?i.cause.stack:``,this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}};lr.prototype.file=``,lr.prototype.name=``,lr.prototype.reason=``,lr.prototype.message=``,lr.prototype.stack=``,lr.prototype.column=void 0,lr.prototype.line=void 0,lr.prototype.ancestors=void 0,lr.prototype.cause=void 0,lr.prototype.fatal=void 0,lr.prototype.place=void 0,lr.prototype.ruleId=void 0,lr.prototype.source=void 0;var ur=e(er(),1),dr={}.hasOwnProperty,fr=new Map,pr=/[A-Z]/g,mr=new Set([`table`,`tbody`,`thead`,`tfoot`,`tr`]),hr=new Set([`td`,`th`]),gr=`https://github.com/syntax-tree/hast-util-to-jsx-runtime`;function _r(e,t){if(!t||t.Fragment===void 0)throw TypeError("Expected `Fragment` in options");let n=t.filePath||void 0,r;if(t.development){if(typeof t.jsxDEV!=`function`)throw TypeError("Expected `jsxDEV` in options when `development: true`");r=Or(n,t.jsxDEV)}else{if(typeof t.jsx!=`function`)throw TypeError("Expected `jsx` in production options");if(typeof t.jsxs!=`function`)throw TypeError("Expected `jsxs` in production options");r=Dr(n,t.jsx,t.jsxs)}let i={Fragment:t.Fragment,ancestors:[],components:t.components||{},create:r,elementAttributeNameCase:t.elementAttributeNameCase||`react`,evaluater:t.createEvaluater?t.createEvaluater():void 0,filePath:n,ignoreInvalidStyle:t.ignoreInvalidStyle||!1,passKeys:t.passKeys!==!1,passNode:t.passNode||!1,schema:t.space===`svg`?Jn:qn,stylePropertyNameCase:t.stylePropertyNameCase||`dom`,tableCellAlignToStyle:t.tableCellAlignToStyle!==!1},a=vr(i,e,void 0);return a&&typeof a!=`string`?a:i.create(e,i.Fragment,{children:a||void 0},void 0)}function vr(e,t,n){if(t.type===`element`)return yr(e,t,n);if(t.type===`mdxFlowExpression`||t.type===`mdxTextExpression`)return br(e,t);if(t.type===`mdxJsxFlowElement`||t.type===`mdxJsxTextElement`)return Sr(e,t,n);if(t.type===`mdxjsEsm`)return xr(e,t);if(t.type===`root`)return Cr(e,t,n);if(t.type===`text`)return wr(e,t)}function yr(e,t,n){let r=e.schema,i=r;t.tagName.toLowerCase()===`svg`&&r.space===`html`&&(i=Jn,e.schema=i),e.ancestors.push(t);let a=Pr(e,t.tagName,!1),o=kr(e,t),s=jr(e,t);return mr.has(t.tagName)&&(s=s.filter(function(e){return typeof e==`string`?!gn(e):!0})),Tr(e,o,a,t),Er(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function br(e,t){if(t.data&&t.data.estree&&e.evaluater){let n=t.data.estree.body[0];return n.type,e.evaluater.evaluateExpression(n.expression)}Fr(e,t.position)}function xr(e,t){if(t.data&&t.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(t.data.estree);Fr(e,t.position)}function Sr(e,t,n){let r=e.schema,i=r;t.name===`svg`&&r.space===`html`&&(i=Jn,e.schema=i),e.ancestors.push(t);let a=t.name===null?e.Fragment:Pr(e,t.name,!0),o=Ar(e,t),s=jr(e,t);return Tr(e,o,a,t),Er(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function Cr(e,t,n){let r={};return Er(r,jr(e,t)),e.create(t,e.Fragment,r,n)}function wr(e,t){return t.value}function Tr(e,t,n,r){typeof n!=`string`&&n!==e.Fragment&&e.passNode&&(t.node=r)}function Er(e,t){if(t.length>0){let n=t.length>1?t:t[0];n&&(e.children=n)}}function Dr(e,t,n){return r;function r(e,r,i,a){let o=Array.isArray(i.children)?n:t;return a?o(r,i,a):o(r,i)}}function Or(e,t){return n;function n(n,r,i,a){let o=Array.isArray(i.children),s=nr(n);return t(r,i,a,o,{columnNumber:s?s.column-1:void 0,fileName:e,lineNumber:s?s.line:void 0},void 0)}}function kr(e,t){let n={},r,i;for(i in t.properties)if(i!==`children`&&dr.call(t.properties,i)){let a=Mr(e,i,t.properties[i]);if(a){let[i,o]=a;e.tableCellAlignToStyle&&i===`align`&&typeof o==`string`&&hr.has(t.tagName)?r=o:n[i]=o}}if(r){let t=n.style||={};t[e.stylePropertyNameCase===`css`?`text-align`:`textAlign`]=r}return n}function Ar(e,t){let n={};for(let r of t.attributes)if(r.type===`mdxJsxExpressionAttribute`)if(r.data&&r.data.estree&&e.evaluater){let t=r.data.estree.body[0];t.type;let i=t.expression;i.type;let a=i.properties[0];a.type,Object.assign(n,e.evaluater.evaluateExpression(a.argument))}else Fr(e,t.position);else{let i=r.name,a;if(r.value&&typeof r.value==`object`)if(r.value.data&&r.value.data.estree&&e.evaluater){let t=r.value.data.estree.body[0];t.type,a=e.evaluater.evaluateExpression(t.expression)}else Fr(e,t.position);else a=r.value===null?!0:r.value;n[i]=a}return n}function jr(e,t){let n=[],r=-1,i=e.passKeys?new Map:fr;for(;++r<t.children.length;){let a=t.children[r],o;if(e.passKeys){let e=a.type===`element`?a.tagName:a.type===`mdxJsxFlowElement`||a.type===`mdxJsxTextElement`?a.name:void 0;if(e){let t=i.get(e)||0;o=e+`-`+t,i.set(e,t+1)}}let s=vr(e,a,o);s!==void 0&&n.push(s)}return n}function Mr(e,t,n){let r=Wn(e.schema,t);if(!(n==null||typeof n==`number`&&Number.isNaN(n))){if(Array.isArray(n)&&(n=r.commaSeparated?un(n):Xn(n)),r.property===`style`){let t=typeof n==`object`?n:Nr(e,String(n));return e.stylePropertyNameCase===`css`&&(t=Ir(t)),[`style`,t]}return[e.elementAttributeNameCase===`react`&&r.space?Bn[r.property]||r.property:r.attribute,n]}}function Nr(e,t){try{return(0,ur.default)(t,{reactCompat:!0})}catch(t){if(e.ignoreInvalidStyle)return{};let n=t,r=new lr("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:n,ruleId:`style`,source:`hast-util-to-jsx-runtime`});throw r.file=e.filePath||void 0,r.url=gr+`#cannot-parse-style-attribute`,r}}function Pr(e,t,n){let r;if(!n)r={type:`Literal`,value:t};else if(t.includes(`.`)){let e=t.split(`.`),n=-1,i;for(;++n<e.length;){let t=mn(e[n])?{type:`Identifier`,name:e[n]}:{type:`Literal`,value:e[n]};i=i?{type:`MemberExpression`,object:i,property:t,computed:!!(n&&t.type===`Literal`),optional:!1}:t}r=i}else r=mn(t)&&!/^[a-z]/.test(t)?{type:`Identifier`,name:t}:{type:`Literal`,value:t};if(r.type===`Literal`){let t=r.value;return dr.call(e.components,t)?e.components[t]:t}if(e.evaluater)return e.evaluater.evaluateExpression(r);Fr(e)}function Fr(e,t){let n=new lr("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:t,ruleId:`mdx-estree`,source:`hast-util-to-jsx-runtime`});throw n.file=e.filePath||void 0,n.url=gr+`#cannot-handle-mdx-estrees-without-createevaluater`,n}function Ir(e){let t={},n;for(n in e)dr.call(e,n)&&(t[Lr(n)]=e[n]);return t}function Lr(e){let t=e.replace(pr,Rr);return t.slice(0,3)===`ms-`&&(t=`-`+t),t}function Rr(e){return`-`+e.toLowerCase()}var zr={action:[`form`],cite:[`blockquote`,`del`,`ins`,`q`],data:[`object`],formAction:[`button`,`input`],href:[`a`,`area`,`base`,`link`],icon:[`menuitem`],itemId:null,manifest:[`html`],ping:[`a`,`area`],poster:[`video`],src:[`audio`,`embed`,`iframe`,`img`,`input`,`script`,`source`,`track`,`video`]},Br={};function Vr(e,t){let n=t||Br;return Hr(e,typeof n.includeImageAlt==`boolean`?n.includeImageAlt:!0,typeof n.includeHtml==`boolean`?n.includeHtml:!0)}function Hr(e,t,n){if(Wr(e)){if(`value`in e)return e.type===`html`&&!n?``:e.value;if(t&&`alt`in e&&e.alt)return e.alt;if(`children`in e)return Ur(e.children,t,n)}return Array.isArray(e)?Ur(e,t,n):``}function Ur(e,t,n){let r=[],i=-1;for(;++i<e.length;)r[i]=Hr(e[i],t,n);return r.join(``)}function Wr(e){return!!(e&&typeof e==`object`)}var Gr=document.createElement(`i`);function Kr(e){let t=`&`+e+`;`;Gr.innerHTML=t;let n=Gr.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`||n===t?!1:n}function qr(e,t,n,r){let i=e.length,a=0,o;if(t=t<0?-t>i?0:i+t:t>i?i:t,n=n>0?n:0,r.length<1e4)o=Array.from(r),o.unshift(t,n),e.splice(...o);else for(n&&e.splice(t,n);a<r.length;)o=r.slice(a,a+1e4),o.unshift(t,0),e.splice(...o),a+=1e4,t+=1e4}function Jr(e,t){return e.length>0?(qr(e,e.length,0,t),e):t}var Yr={}.hasOwnProperty;function Xr(e){let t={},n=-1;for(;++n<e.length;)Zr(t,e[n]);return t}function Zr(e,t){let n;for(n in t){let r=(Yr.call(e,n)?e[n]:void 0)||(e[n]={}),i=t[n],a;if(i)for(a in i){Yr.call(r,a)||(r[a]=[]);let e=i[a];Qr(r[a],Array.isArray(e)?e:e?[e]:[])}}}function Qr(e,t){let n=-1,r=[];for(;++n<t.length;)(t[n].add===`after`?e:r).push(t[n]);qr(e,0,0,r)}function $r(e,t){let n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)==65535||(n&65535)==65534||n>1114111?`�`:String.fromCodePoint(n)}function ei(e){return e.replace(/[\t\n\r ]+/g,` `).replace(/^ | $/g,``).toLowerCase().toUpperCase()}var ti=di(/[A-Za-z]/),ni=di(/[\dA-Za-z]/),ri=di(/[#-'*+\--9=?A-Z^-~]/);function ii(e){return e!==null&&(e<32||e===127)}var ai=di(/\d/),oi=di(/[\dA-Fa-f]/),si=di(/[!-/:-@[-`{-~]/);function z(e){return e!==null&&e<-2}function ci(e){return e!==null&&(e<0||e===32)}function B(e){return e===-2||e===-1||e===32}var li=di(/\p{P}|\p{S}/u),ui=di(/\s/);function di(e){return t;function t(t){return t!==null&&t>-1&&e.test(String.fromCharCode(t))}}function fi(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let a=e.charCodeAt(n),o=``;if(a===37&&ni(e.charCodeAt(n+1))&&ni(e.charCodeAt(n+2)))i=2;else if(a<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a))||(o=String.fromCharCode(a));else if(a>55295&&a<57344){let t=e.charCodeAt(n+1);a<56320&&t>56319&&t<57344?(o=String.fromCharCode(a,t),i=1):o=`�`}else o=String.fromCharCode(a);o&&=(t.push(e.slice(r,n),encodeURIComponent(o)),r=n+i+1,``),i&&=(n+=i,0)}return t.join(``)+e.slice(r)}function V(e,t,n,r){let i=r?r-1:1/0,a=0;return o;function o(r){return B(r)?(e.enter(n),s(r)):t(r)}function s(r){return B(r)&&a++<i?(e.consume(r),s):(e.exit(n),t(r))}}var pi={tokenize:mi};function mi(e){let t=e.attempt(this.parser.constructs.contentInitial,r,i),n;return t;function r(n){if(n===null){e.consume(n);return}return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),V(e,t,`linePrefix`)}function i(t){return e.enter(`paragraph`),a(t)}function a(t){let r=e.enter(`chunkText`,{contentType:`text`,previous:n});return n&&(n.next=r),n=r,o(t)}function o(t){if(t===null){e.exit(`chunkText`),e.exit(`paragraph`),e.consume(t);return}return z(t)?(e.consume(t),e.exit(`chunkText`),a):(e.consume(t),o)}}var hi={tokenize:_i},gi={tokenize:vi};function _i(e){let t=this,n=[],r=0,i,a,o;return s;function s(i){if(r<n.length){let a=n[r];return t.containerState=a[1],e.attempt(a[0].continuation,c,l)(i)}return l(i)}function c(e){if(r++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,i&&v();let n=t.events.length,a=n,o;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){o=t.events[a][1].end;break}_(r);let s=n;for(;s<t.events.length;)t.events[s][1].end={...o},s++;return qr(t.events,a+1,0,t.events.slice(n)),t.events.length=s,l(e)}return s(e)}function l(a){if(r===n.length){if(!i)return f(a);if(i.currentConstruct&&i.currentConstruct.concrete)return m(a);t.interrupt=!!(i.currentConstruct&&!i._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(gi,u,d)(a)}function u(e){return i&&v(),_(r),f(e)}function d(e){return t.parser.lazy[t.now().line]=r!==n.length,o=t.now().offset,m(e)}function f(n){return t.containerState={},e.attempt(gi,p,m)(n)}function p(e){return r++,n.push([t.currentConstruct,t.containerState]),f(e)}function m(n){if(n===null){i&&v(),_(0),e.consume(n);return}return i||=t.parser.flow(t.now()),e.enter(`chunkFlow`,{_tokenizer:i,contentType:`flow`,previous:a}),h(n)}function h(n){if(n===null){g(e.exit(`chunkFlow`),!0),_(0),e.consume(n);return}return z(n)?(e.consume(n),g(e.exit(`chunkFlow`)),r=0,t.interrupt=void 0,s):(e.consume(n),h)}function g(e,n){let s=t.sliceStream(e);if(n&&s.push(null),e.previous=a,a&&(a.next=e),a=e,i.defineSkip(e.start),i.write(s),t.parser.lazy[e.start.line]){let e=i.events.length;for(;e--;)if(i.events[e][1].start.offset<o&&(!i.events[e][1].end||i.events[e][1].end.offset>o))return;let n=t.events.length,a=n,s,c;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){if(s){c=t.events[a][1].end;break}s=!0}for(_(r),e=n;e<t.events.length;)t.events[e][1].end={...c},e++;qr(t.events,a+1,0,t.events.slice(n)),t.events.length=e}}function _(r){let i=n.length;for(;i-- >r;){let r=n[i];t.containerState=r[1],r[0].exit.call(t,e)}n.length=r}function v(){i.write([null]),a=void 0,i=void 0,t.containerState._closeFlow=void 0}}function vi(e,t,n){return V(e,e.attempt(this.parser.constructs.document,t,n),`linePrefix`,this.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)}function yi(e){if(e===null||ci(e)||ui(e))return 1;if(li(e))return 2}function bi(e,t,n){let r=[],i=-1;for(;++i<e.length;){let a=e[i].resolveAll;a&&!r.includes(a)&&(t=a(t,n),r.push(a))}return t}var xi={name:`attention`,resolveAll:Si,tokenize:Ci};function Si(e,t){let n=-1,r,i,a,o,s,c,l,u;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`attentionSequence`&&e[n][1]._close){for(r=n;r--;)if(e[r][0]===`exit`&&e[r][1].type===`attentionSequence`&&e[r][1]._open&&t.sliceSerialize(e[r][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[r][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[r][1].end.offset-e[r][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;c=e[r][1].end.offset-e[r][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1;let d={...e[r][1].end},f={...e[n][1].start};wi(d,-c),wi(f,c),o={type:c>1?`strongSequence`:`emphasisSequence`,start:d,end:{...e[r][1].end}},s={type:c>1?`strongSequence`:`emphasisSequence`,start:{...e[n][1].start},end:f},a={type:c>1?`strongText`:`emphasisText`,start:{...e[r][1].end},end:{...e[n][1].start}},i={type:c>1?`strong`:`emphasis`,start:{...o.start},end:{...s.end}},e[r][1].end={...o.start},e[n][1].start={...s.end},l=[],e[r][1].end.offset-e[r][1].start.offset&&(l=Jr(l,[[`enter`,e[r][1],t],[`exit`,e[r][1],t]])),l=Jr(l,[[`enter`,i,t],[`enter`,o,t],[`exit`,o,t],[`enter`,a,t]]),l=Jr(l,bi(t.parser.constructs.insideSpan.null,e.slice(r+1,n),t)),l=Jr(l,[[`exit`,a,t],[`enter`,s,t],[`exit`,s,t],[`exit`,i,t]]),e[n][1].end.offset-e[n][1].start.offset?(u=2,l=Jr(l,[[`enter`,e[n][1],t],[`exit`,e[n][1],t]])):u=0,qr(e,r-1,n-r+3,l),n=r+l.length-u-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`attentionSequence`&&(e[n][1].type=`data`);return e}function Ci(e,t){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=yi(r),a;return o;function o(t){return a=t,e.enter(`attentionSequence`),s(t)}function s(o){if(o===a)return e.consume(o),s;let c=e.exit(`attentionSequence`),l=yi(o),u=!l||l===2&&i||n.includes(o),d=!i||i===2&&l||n.includes(r);return c._open=!!(a===42?u:u&&(i||!d)),c._close=!!(a===42?d:d&&(l||!u)),t(o)}}function wi(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}var Ti={name:`autolink`,tokenize:Ei};function Ei(e,t,n){let r=0;return i;function i(t){return e.enter(`autolink`),e.enter(`autolinkMarker`),e.consume(t),e.exit(`autolinkMarker`),e.enter(`autolinkProtocol`),a}function a(t){return ti(t)?(e.consume(t),o):t===64?n(t):l(t)}function o(e){return e===43||e===45||e===46||ni(e)?(r=1,s(e)):l(e)}function s(t){return t===58?(e.consume(t),r=0,c):(t===43||t===45||t===46||ni(t))&&r++<32?(e.consume(t),s):(r=0,l(t))}function c(r){return r===62?(e.exit(`autolinkProtocol`),e.enter(`autolinkMarker`),e.consume(r),e.exit(`autolinkMarker`),e.exit(`autolink`),t):r===null||r===32||r===60||ii(r)?n(r):(e.consume(r),c)}function l(t){return t===64?(e.consume(t),u):ri(t)?(e.consume(t),l):n(t)}function u(e){return ni(e)?d(e):n(e)}function d(n){return n===46?(e.consume(n),r=0,u):n===62?(e.exit(`autolinkProtocol`).type=`autolinkEmail`,e.enter(`autolinkMarker`),e.consume(n),e.exit(`autolinkMarker`),e.exit(`autolink`),t):f(n)}function f(t){if((t===45||ni(t))&&r++<63){let n=t===45?f:d;return e.consume(t),n}return n(t)}}var Di={partial:!0,tokenize:Oi};function Oi(e,t,n){return r;function r(t){return B(t)?V(e,i,`linePrefix`)(t):i(t)}function i(e){return e===null||z(e)?t(e):n(e)}}var ki={continuation:{tokenize:ji},exit:Mi,name:`blockQuote`,tokenize:Ai};function Ai(e,t,n){let r=this;return i;function i(t){if(t===62){let n=r.containerState;return n.open||=(e.enter(`blockQuote`,{_container:!0}),!0),e.enter(`blockQuotePrefix`),e.enter(`blockQuoteMarker`),e.consume(t),e.exit(`blockQuoteMarker`),a}return n(t)}function a(n){return B(n)?(e.enter(`blockQuotePrefixWhitespace`),e.consume(n),e.exit(`blockQuotePrefixWhitespace`),e.exit(`blockQuotePrefix`),t):(e.exit(`blockQuotePrefix`),t(n))}}function ji(e,t,n){let r=this;return i;function i(t){return B(t)?V(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):a(t)}function a(r){return e.attempt(ki,t,n)(r)}}function Mi(e){e.exit(`blockQuote`)}var Ni={name:`characterEscape`,tokenize:Pi};function Pi(e,t,n){return r;function r(t){return e.enter(`characterEscape`),e.enter(`escapeMarker`),e.consume(t),e.exit(`escapeMarker`),i}function i(r){return si(r)?(e.enter(`characterEscapeValue`),e.consume(r),e.exit(`characterEscapeValue`),e.exit(`characterEscape`),t):n(r)}}var Fi={name:`characterReference`,tokenize:Ii};function Ii(e,t,n){let r=this,i=0,a,o;return s;function s(t){return e.enter(`characterReference`),e.enter(`characterReferenceMarker`),e.consume(t),e.exit(`characterReferenceMarker`),c}function c(t){return t===35?(e.enter(`characterReferenceMarkerNumeric`),e.consume(t),e.exit(`characterReferenceMarkerNumeric`),l):(e.enter(`characterReferenceValue`),a=31,o=ni,u(t))}function l(t){return t===88||t===120?(e.enter(`characterReferenceMarkerHexadecimal`),e.consume(t),e.exit(`characterReferenceMarkerHexadecimal`),e.enter(`characterReferenceValue`),a=6,o=oi,u):(e.enter(`characterReferenceValue`),a=7,o=ai,u(t))}function u(s){if(s===59&&i){let i=e.exit(`characterReferenceValue`);return o===ni&&!Kr(r.sliceSerialize(i))?n(s):(e.enter(`characterReferenceMarker`),e.consume(s),e.exit(`characterReferenceMarker`),e.exit(`characterReference`),t)}return o(s)&&i++<a?(e.consume(s),u):n(s)}}var Li={partial:!0,tokenize:Bi},Ri={concrete:!0,name:`codeFenced`,tokenize:zi};function zi(e,t,n){let r=this,i={partial:!0,tokenize:x},a=0,o=0,s;return c;function c(e){return l(e)}function l(t){let n=r.events[r.events.length-1];return a=n&&n[1].type===`linePrefix`?n[2].sliceSerialize(n[1],!0).length:0,s=t,e.enter(`codeFenced`),e.enter(`codeFencedFence`),e.enter(`codeFencedFenceSequence`),u(t)}function u(t){return t===s?(o++,e.consume(t),u):o<3?n(t):(e.exit(`codeFencedFenceSequence`),B(t)?V(e,d,`whitespace`)(t):d(t))}function d(n){return n===null||z(n)?(e.exit(`codeFencedFence`),r.interrupt?t(n):e.check(Li,h,b)(n)):(e.enter(`codeFencedFenceInfo`),e.enter(`chunkString`,{contentType:`string`}),f(n))}function f(t){return t===null||z(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),d(t)):B(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),V(e,p,`whitespace`)(t)):t===96&&t===s?n(t):(e.consume(t),f)}function p(t){return t===null||z(t)?d(t):(e.enter(`codeFencedFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),m(t))}function m(t){return t===null||z(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceMeta`),d(t)):t===96&&t===s?n(t):(e.consume(t),m)}function h(t){return e.attempt(i,b,g)(t)}function g(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),_}function _(t){return a>0&&B(t)?V(e,v,`linePrefix`,a+1)(t):v(t)}function v(t){return t===null||z(t)?e.check(Li,h,b)(t):(e.enter(`codeFlowValue`),y(t))}function y(t){return t===null||z(t)?(e.exit(`codeFlowValue`),v(t)):(e.consume(t),y)}function b(n){return e.exit(`codeFenced`),t(n)}function x(e,t,n){let i=0;return a;function a(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c}function c(t){return e.enter(`codeFencedFence`),B(t)?V(e,l,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):l(t)}function l(t){return t===s?(e.enter(`codeFencedFenceSequence`),u(t)):n(t)}function u(t){return t===s?(i++,e.consume(t),u):i>=o?(e.exit(`codeFencedFenceSequence`),B(t)?V(e,d,`whitespace`)(t):d(t)):n(t)}function d(r){return r===null||z(r)?(e.exit(`codeFencedFence`),t(r)):n(r)}}}function Bi(e,t,n){let r=this;return i;function i(t){return t===null?n(t):(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}var Vi={name:`codeIndented`,tokenize:Ui},Hi={partial:!0,tokenize:Wi};function Ui(e,t,n){let r=this;return i;function i(t){return e.enter(`codeIndented`),V(e,a,`linePrefix`,5)(t)}function a(e){let t=r.events[r.events.length-1];return t&&t[1].type===`linePrefix`&&t[2].sliceSerialize(t[1],!0).length>=4?o(e):n(e)}function o(t){return t===null?c(t):z(t)?e.attempt(Hi,o,c)(t):(e.enter(`codeFlowValue`),s(t))}function s(t){return t===null||z(t)?(e.exit(`codeFlowValue`),o(t)):(e.consume(t),s)}function c(n){return e.exit(`codeIndented`),t(n)}}function Wi(e,t,n){let r=this;return i;function i(t){return r.parser.lazy[r.now().line]?n(t):z(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),i):V(e,a,`linePrefix`,5)(t)}function a(e){let a=r.events[r.events.length-1];return a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(e):z(e)?i(e):n(e)}}var Gi={name:`codeText`,previous:qi,resolve:Ki,tokenize:Ji};function Ki(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`codeTextData`){e[n][1].type=`codeTextPadding`,e[t][1].type=`codeTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`codeTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function qi(e){return e!==96||this.events[this.events.length-1][1].type===`characterEscape`}function Ji(e,t,n){let r=0,i,a;return o;function o(t){return e.enter(`codeText`),e.enter(`codeTextSequence`),s(t)}function s(t){return t===96?(e.consume(t),r++,s):(e.exit(`codeTextSequence`),c(t))}function c(t){return t===null?n(t):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),c):t===96?(a=e.enter(`codeTextSequence`),i=0,u(t)):z(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c):(e.enter(`codeTextData`),l(t))}function l(t){return t===null||t===32||t===96||z(t)?(e.exit(`codeTextData`),c(t)):(e.consume(t),l)}function u(n){return n===96?(e.consume(n),i++,u):i===r?(e.exit(`codeTextSequence`),e.exit(`codeText`),t(n)):(a.type=`codeTextData`,l(n))}}var Yi=class{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,t){let n=t??1/0;return n<this.left.length?this.left.slice(e,n):e>this.left.length?this.right.slice(this.right.length-n+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-n+this.left.length).reverse())}splice(e,t,n){let r=t||0;this.setCursor(Math.trunc(e));let i=this.right.splice(this.right.length-r,1/0);return n&&Xi(this.left,n),i.reverse()}pop(){return this.setCursor(1/0),this.left.pop()}push(e){this.setCursor(1/0),this.left.push(e)}pushMany(e){this.setCursor(1/0),Xi(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),Xi(this.right,e.reverse())}setCursor(e){if(!(e===this.left.length||e>this.left.length&&this.right.length===0||e<0&&this.left.length===0))if(e<this.left.length){let t=this.left.splice(e,1/0);Xi(this.right,t.reverse())}else{let t=this.right.splice(this.left.length+this.right.length-e,1/0);Xi(this.left,t.reverse())}}};function Xi(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function Zi(e){let t={},n=-1,r,i,a,o,s,c,l,u=new Yi(e);for(;++n<u.length;){for(;n in t;)n=t[n];if(r=u.get(n),n&&r[1].type===`chunkFlow`&&u.get(n-1)[1].type===`listItemPrefix`&&(c=r[1]._tokenizer.events,a=0,a<c.length&&c[a][1].type===`lineEndingBlank`&&(a+=2),a<c.length&&c[a][1].type===`content`))for(;++a<c.length&&c[a][1].type!==`content`;)c[a][1].type===`chunkText`&&(c[a][1]._isInFirstContentOfListItem=!0,a++);if(r[0]===`enter`)r[1].contentType&&(Object.assign(t,Qi(u,n)),n=t[n],l=!0);else if(r[1]._container){for(a=n,i=void 0;a--;)if(o=u.get(a),o[1].type===`lineEnding`||o[1].type===`lineEndingBlank`)o[0]===`enter`&&(i&&(u.get(i)[1].type=`lineEndingBlank`),o[1].type=`lineEnding`,i=a);else if(!(o[1].type===`linePrefix`||o[1].type===`listItemIndent`))break;i&&(r[1].end={...u.get(i)[1].start},s=u.slice(i,n),s.unshift(r),u.splice(i,n-i+1,s))}}return qr(e,0,1/0,u.slice(0)),!l}function Qi(e,t){let n=e.get(t)[1],r=e.get(t)[2],i=t-1,a=[],o=n._tokenizer;o||(o=r.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(o._contentTypeTextTrailing=!0));let s=o.events,c=[],l={},u,d,f=-1,p=n,m=0,h=0,g=[h];for(;p;){for(;e.get(++i)[1]!==p;);a.push(i),p._tokenizer||(u=r.sliceStream(p),p.next||u.push(null),d&&o.defineSkip(p.start),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=!0),o.write(u),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=void 0)),d=p,p=p.next}for(p=n;++f<s.length;)s[f][0]===`exit`&&s[f-1][0]===`enter`&&s[f][1].type===s[f-1][1].type&&s[f][1].start.line!==s[f][1].end.line&&(h=f+1,g.push(h),p._tokenizer=void 0,p.previous=void 0,p=p.next);for(o.events=[],p?(p._tokenizer=void 0,p.previous=void 0):g.pop(),f=g.length;f--;){let t=s.slice(g[f],g[f+1]),n=a.pop();c.push([n,n+t.length-1]),e.splice(n,2,t)}for(c.reverse(),f=-1;++f<c.length;)l[m+c[f][0]]=m+c[f][1],m+=c[f][1]-c[f][0]-1;return l}var $i={resolve:ta,tokenize:na},ea={partial:!0,tokenize:ra};function ta(e){return Zi(e),e}function na(e,t){let n;return r;function r(t){return e.enter(`content`),n=e.enter(`chunkContent`,{contentType:`content`}),i(t)}function i(t){return t===null?a(t):z(t)?e.check(ea,o,a)(t):(e.consume(t),i)}function a(n){return e.exit(`chunkContent`),e.exit(`content`),t(n)}function o(t){return e.consume(t),e.exit(`chunkContent`),n.next=e.enter(`chunkContent`,{contentType:`content`,previous:n}),n=n.next,i}}function ra(e,t,n){let r=this;return i;function i(t){return e.exit(`chunkContent`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),V(e,a,`linePrefix`)}function a(i){if(i===null||z(i))return n(i);let a=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes(`codeIndented`)&&a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(i):e.interrupt(r.parser.constructs.flow,n,t)(i)}}function ia(e,t,n,r,i,a,o,s,c){let l=c||1/0,u=0;return d;function d(t){return t===60?(e.enter(r),e.enter(i),e.enter(a),e.consume(t),e.exit(a),f):t===null||t===32||t===41||ii(t)?n(t):(e.enter(r),e.enter(o),e.enter(s),e.enter(`chunkString`,{contentType:`string`}),h(t))}function f(n){return n===62?(e.enter(a),e.consume(n),e.exit(a),e.exit(i),e.exit(r),t):(e.enter(s),e.enter(`chunkString`,{contentType:`string`}),p(n))}function p(t){return t===62?(e.exit(`chunkString`),e.exit(s),f(t)):t===null||t===60||z(t)?n(t):(e.consume(t),t===92?m:p)}function m(t){return t===60||t===62||t===92?(e.consume(t),p):p(t)}function h(i){return!u&&(i===null||i===41||ci(i))?(e.exit(`chunkString`),e.exit(s),e.exit(o),e.exit(r),t(i)):u<l&&i===40?(e.consume(i),u++,h):i===41?(e.consume(i),u--,h):i===null||i===32||i===40||ii(i)?n(i):(e.consume(i),i===92?g:h)}function g(t){return t===40||t===41||t===92?(e.consume(t),h):h(t)}}function aa(e,t,n,r,i,a){let o=this,s=0,c;return l;function l(t){return e.enter(r),e.enter(i),e.consume(t),e.exit(i),e.enter(a),u}function u(l){return s>999||l===null||l===91||l===93&&!c||l===94&&!s&&`_hiddenFootnoteSupport`in o.parser.constructs?n(l):l===93?(e.exit(a),e.enter(i),e.consume(l),e.exit(i),e.exit(r),t):z(l)?(e.enter(`lineEnding`),e.consume(l),e.exit(`lineEnding`),u):(e.enter(`chunkString`,{contentType:`string`}),d(l))}function d(t){return t===null||t===91||t===93||z(t)||s++>999?(e.exit(`chunkString`),u(t)):(e.consume(t),c||=!B(t),t===92?f:d)}function f(t){return t===91||t===92||t===93?(e.consume(t),s++,d):d(t)}}function oa(e,t,n,r,i,a){let o;return s;function s(t){return t===34||t===39||t===40?(e.enter(r),e.enter(i),e.consume(t),e.exit(i),o=t===40?41:t,c):n(t)}function c(n){return n===o?(e.enter(i),e.consume(n),e.exit(i),e.exit(r),t):(e.enter(a),l(n))}function l(t){return t===o?(e.exit(a),c(o)):t===null?n(t):z(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),V(e,l,`linePrefix`)):(e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===o||t===null||z(t)?(e.exit(`chunkString`),l(t)):(e.consume(t),t===92?d:u)}function d(t){return t===o||t===92?(e.consume(t),u):u(t)}}function sa(e,t){let n;return r;function r(i){return z(i)?(e.enter(`lineEnding`),e.consume(i),e.exit(`lineEnding`),n=!0,r):B(i)?V(e,r,n?`linePrefix`:`lineSuffix`)(i):t(i)}}var ca={name:`definition`,tokenize:ua},la={partial:!0,tokenize:da};function ua(e,t,n){let r=this,i;return a;function a(t){return e.enter(`definition`),o(t)}function o(t){return aa.call(r,e,s,n,`definitionLabel`,`definitionLabelMarker`,`definitionLabelString`)(t)}function s(t){return i=ei(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),c):n(t)}function c(t){return ci(t)?sa(e,l)(t):l(t)}function l(t){return ia(e,u,n,`definitionDestination`,`definitionDestinationLiteral`,`definitionDestinationLiteralMarker`,`definitionDestinationRaw`,`definitionDestinationString`)(t)}function u(t){return e.attempt(la,d,d)(t)}function d(t){return B(t)?V(e,f,`whitespace`)(t):f(t)}function f(a){return a===null||z(a)?(e.exit(`definition`),r.parser.defined.push(i),t(a)):n(a)}}function da(e,t,n){return r;function r(t){return ci(t)?sa(e,i)(t):n(t)}function i(t){return oa(e,a,n,`definitionTitle`,`definitionTitleMarker`,`definitionTitleString`)(t)}function a(t){return B(t)?V(e,o,`whitespace`)(t):o(t)}function o(e){return e===null||z(e)?t(e):n(e)}}var fa={name:`hardBreakEscape`,tokenize:pa};function pa(e,t,n){return r;function r(t){return e.enter(`hardBreakEscape`),e.consume(t),i}function i(r){return z(r)?(e.exit(`hardBreakEscape`),t(r)):n(r)}}var ma={name:`headingAtx`,resolve:ha,tokenize:ga};function ha(e,t){let n=e.length-2,r=3,i,a;return e[r][1].type===`whitespace`&&(r+=2),n-2>r&&e[n][1].type===`whitespace`&&(n-=2),e[n][1].type===`atxHeadingSequence`&&(r===n-1||n-4>r&&e[n-2][1].type===`whitespace`)&&(n-=r+1===n?2:4),n>r&&(i={type:`atxHeadingText`,start:e[r][1].start,end:e[n][1].end},a={type:`chunkText`,start:e[r][1].start,end:e[n][1].end,contentType:`text`},qr(e,r,n-r+1,[[`enter`,i,t],[`enter`,a,t],[`exit`,a,t],[`exit`,i,t]])),e}function ga(e,t,n){let r=0;return i;function i(t){return e.enter(`atxHeading`),a(t)}function a(t){return e.enter(`atxHeadingSequence`),o(t)}function o(t){return t===35&&r++<6?(e.consume(t),o):t===null||ci(t)?(e.exit(`atxHeadingSequence`),s(t)):n(t)}function s(n){return n===35?(e.enter(`atxHeadingSequence`),c(n)):n===null||z(n)?(e.exit(`atxHeading`),t(n)):B(n)?V(e,s,`whitespace`)(n):(e.enter(`atxHeadingText`),l(n))}function c(t){return t===35?(e.consume(t),c):(e.exit(`atxHeadingSequence`),s(t))}function l(t){return t===null||t===35||ci(t)?(e.exit(`atxHeadingText`),s(t)):(e.consume(t),l)}}var _a=`address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul`.split(`.`),va=[`pre`,`script`,`style`,`textarea`],ya={concrete:!0,name:`htmlFlow`,resolveTo:Sa,tokenize:Ca},ba={partial:!0,tokenize:Ta},xa={partial:!0,tokenize:wa};function Sa(e){let t=e.length;for(;t--&&!(e[t][0]===`enter`&&e[t][1].type===`htmlFlow`););return t>1&&e[t-2][1].type===`linePrefix`&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function Ca(e,t,n){let r=this,i,a,o,s,c;return l;function l(e){return u(e)}function u(t){return e.enter(`htmlFlow`),e.enter(`htmlFlowData`),e.consume(t),d}function d(s){return s===33?(e.consume(s),f):s===47?(e.consume(s),a=!0,h):s===63?(e.consume(s),i=3,r.interrupt?t:ne):ti(s)?(e.consume(s),o=String.fromCharCode(s),g):n(s)}function f(a){return a===45?(e.consume(a),i=2,p):a===91?(e.consume(a),i=5,s=0,m):ti(a)?(e.consume(a),i=4,r.interrupt?t:ne):n(a)}function p(i){return i===45?(e.consume(i),r.interrupt?t:ne):n(i)}function m(i){return i===`CDATA[`.charCodeAt(s++)?(e.consume(i),s===6?r.interrupt?t:O:m):n(i)}function h(t){return ti(t)?(e.consume(t),o=String.fromCharCode(t),g):n(t)}function g(s){if(s===null||s===47||s===62||ci(s)){let c=s===47,l=o.toLowerCase();return!c&&!a&&va.includes(l)?(i=1,r.interrupt?t(s):O(s)):_a.includes(o.toLowerCase())?(i=6,c?(e.consume(s),_):r.interrupt?t(s):O(s)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(s):a?v(s):y(s))}return s===45||ni(s)?(e.consume(s),o+=String.fromCharCode(s),g):n(s)}function _(i){return i===62?(e.consume(i),r.interrupt?t:O):n(i)}function v(t){return B(t)?(e.consume(t),v):E(t)}function y(t){return t===47?(e.consume(t),E):t===58||t===95||ti(t)?(e.consume(t),b):B(t)?(e.consume(t),y):E(t)}function b(t){return t===45||t===46||t===58||t===95||ni(t)?(e.consume(t),b):x(t)}function x(t){return t===61?(e.consume(t),S):B(t)?(e.consume(t),x):y(t)}function S(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),c=t,C):B(t)?(e.consume(t),S):w(t)}function C(t){return t===c?(e.consume(t),c=null,T):t===null||z(t)?n(t):(e.consume(t),C)}function w(t){return t===null||t===34||t===39||t===47||t===60||t===61||t===62||t===96||ci(t)?x(t):(e.consume(t),w)}function T(e){return e===47||e===62||B(e)?y(e):n(e)}function E(t){return t===62?(e.consume(t),D):n(t)}function D(t){return t===null||z(t)?O(t):B(t)?(e.consume(t),D):n(t)}function O(t){return t===45&&i===2?(e.consume(t),j):t===60&&i===1?(e.consume(t),te):t===62&&i===4?(e.consume(t),re):t===63&&i===3?(e.consume(t),ne):t===93&&i===5?(e.consume(t),N):z(t)&&(i===6||i===7)?(e.exit(`htmlFlowData`),e.check(ba,ie,k)(t)):t===null||z(t)?(e.exit(`htmlFlowData`),k(t)):(e.consume(t),O)}function k(t){return e.check(xa,ee,ie)(t)}function ee(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),A}function A(t){return t===null||z(t)?k(t):(e.enter(`htmlFlowData`),O(t))}function j(t){return t===45?(e.consume(t),ne):O(t)}function te(t){return t===47?(e.consume(t),o=``,M):O(t)}function M(t){if(t===62){let n=o.toLowerCase();return va.includes(n)?(e.consume(t),re):O(t)}return ti(t)&&o.length<8?(e.consume(t),o+=String.fromCharCode(t),M):O(t)}function N(t){return t===93?(e.consume(t),ne):O(t)}function ne(t){return t===62?(e.consume(t),re):t===45&&i===2?(e.consume(t),ne):O(t)}function re(t){return t===null||z(t)?(e.exit(`htmlFlowData`),ie(t)):(e.consume(t),re)}function ie(n){return e.exit(`htmlFlow`),t(n)}}function wa(e,t,n){let r=this;return i;function i(t){return z(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a):n(t)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}function Ta(e,t,n){return r;function r(r){return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),e.attempt(Di,t,n)}}var Ea={name:`htmlText`,tokenize:Da};function Da(e,t,n){let r=this,i,a,o;return s;function s(t){return e.enter(`htmlText`),e.enter(`htmlTextData`),e.consume(t),c}function c(t){return t===33?(e.consume(t),l):t===47?(e.consume(t),x):t===63?(e.consume(t),y):ti(t)?(e.consume(t),w):n(t)}function l(t){return t===45?(e.consume(t),u):t===91?(e.consume(t),a=0,m):ti(t)?(e.consume(t),v):n(t)}function u(t){return t===45?(e.consume(t),p):n(t)}function d(t){return t===null?n(t):t===45?(e.consume(t),f):z(t)?(o=d,te(t)):(e.consume(t),d)}function f(t){return t===45?(e.consume(t),p):d(t)}function p(e){return e===62?j(e):e===45?f(e):d(e)}function m(t){return t===`CDATA[`.charCodeAt(a++)?(e.consume(t),a===6?h:m):n(t)}function h(t){return t===null?n(t):t===93?(e.consume(t),g):z(t)?(o=h,te(t)):(e.consume(t),h)}function g(t){return t===93?(e.consume(t),_):h(t)}function _(t){return t===62?j(t):t===93?(e.consume(t),_):h(t)}function v(t){return t===null||t===62?j(t):z(t)?(o=v,te(t)):(e.consume(t),v)}function y(t){return t===null?n(t):t===63?(e.consume(t),b):z(t)?(o=y,te(t)):(e.consume(t),y)}function b(e){return e===62?j(e):y(e)}function x(t){return ti(t)?(e.consume(t),S):n(t)}function S(t){return t===45||ni(t)?(e.consume(t),S):C(t)}function C(t){return z(t)?(o=C,te(t)):B(t)?(e.consume(t),C):j(t)}function w(t){return t===45||ni(t)?(e.consume(t),w):t===47||t===62||ci(t)?T(t):n(t)}function T(t){return t===47?(e.consume(t),j):t===58||t===95||ti(t)?(e.consume(t),E):z(t)?(o=T,te(t)):B(t)?(e.consume(t),T):j(t)}function E(t){return t===45||t===46||t===58||t===95||ni(t)?(e.consume(t),E):D(t)}function D(t){return t===61?(e.consume(t),O):z(t)?(o=D,te(t)):B(t)?(e.consume(t),D):T(t)}function O(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),i=t,k):z(t)?(o=O,te(t)):B(t)?(e.consume(t),O):(e.consume(t),ee)}function k(t){return t===i?(e.consume(t),i=void 0,A):t===null?n(t):z(t)?(o=k,te(t)):(e.consume(t),k)}function ee(t){return t===null||t===34||t===39||t===60||t===61||t===96?n(t):t===47||t===62||ci(t)?T(t):(e.consume(t),ee)}function A(e){return e===47||e===62||ci(e)?T(e):n(e)}function j(r){return r===62?(e.consume(r),e.exit(`htmlTextData`),e.exit(`htmlText`),t):n(r)}function te(t){return e.exit(`htmlTextData`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),M}function M(t){return B(t)?V(e,N,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):N(t)}function N(t){return e.enter(`htmlTextData`),o(t)}}var Oa={name:`labelEnd`,resolveAll:Ma,resolveTo:Na,tokenize:Pa},ka={tokenize:Fa},Aa={tokenize:Ia},ja={tokenize:La};function Ma(e){let t=-1,n=[];for(;++t<e.length;){let r=e[t][1];if(n.push(e[t]),r.type===`labelImage`||r.type===`labelLink`||r.type===`labelEnd`){let e=r.type===`labelImage`?4:2;r.type=`data`,t+=e}}return e.length!==n.length&&qr(e,0,e.length,n),e}function Na(e,t){let n=e.length,r=0,i,a,o,s;for(;n--;)if(i=e[n][1],a){if(i.type===`link`||i.type===`labelLink`&&i._inactive)break;e[n][0]===`enter`&&i.type===`labelLink`&&(i._inactive=!0)}else if(o){if(e[n][0]===`enter`&&(i.type===`labelImage`||i.type===`labelLink`)&&!i._balanced&&(a=n,i.type!==`labelLink`)){r=2;break}}else i.type===`labelEnd`&&(o=n);let c={type:e[a][1].type===`labelLink`?`link`:`image`,start:{...e[a][1].start},end:{...e[e.length-1][1].end}},l={type:`label`,start:{...e[a][1].start},end:{...e[o][1].end}},u={type:`labelText`,start:{...e[a+r+2][1].end},end:{...e[o-2][1].start}};return s=[[`enter`,c,t],[`enter`,l,t]],s=Jr(s,e.slice(a+1,a+r+3)),s=Jr(s,[[`enter`,u,t]]),s=Jr(s,bi(t.parser.constructs.insideSpan.null,e.slice(a+r+4,o-3),t)),s=Jr(s,[[`exit`,u,t],e[o-2],e[o-1],[`exit`,l,t]]),s=Jr(s,e.slice(o+1)),s=Jr(s,[[`exit`,c,t]]),qr(e,a,e.length,s),e}function Pa(e,t,n){let r=this,i=r.events.length,a,o;for(;i--;)if((r.events[i][1].type===`labelImage`||r.events[i][1].type===`labelLink`)&&!r.events[i][1]._balanced){a=r.events[i][1];break}return s;function s(t){return a?a._inactive?d(t):(o=r.parser.defined.includes(ei(r.sliceSerialize({start:a.end,end:r.now()}))),e.enter(`labelEnd`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelEnd`),c):n(t)}function c(t){return t===40?e.attempt(ka,u,o?u:d)(t):t===91?e.attempt(Aa,u,o?l:d)(t):o?u(t):d(t)}function l(t){return e.attempt(ja,u,d)(t)}function u(e){return t(e)}function d(e){return a._balanced=!0,n(e)}}function Fa(e,t,n){return r;function r(t){return e.enter(`resource`),e.enter(`resourceMarker`),e.consume(t),e.exit(`resourceMarker`),i}function i(t){return ci(t)?sa(e,a)(t):a(t)}function a(t){return t===41?u(t):ia(e,o,s,`resourceDestination`,`resourceDestinationLiteral`,`resourceDestinationLiteralMarker`,`resourceDestinationRaw`,`resourceDestinationString`,32)(t)}function o(t){return ci(t)?sa(e,c)(t):u(t)}function s(e){return n(e)}function c(t){return t===34||t===39||t===40?oa(e,l,n,`resourceTitle`,`resourceTitleMarker`,`resourceTitleString`)(t):u(t)}function l(t){return ci(t)?sa(e,u)(t):u(t)}function u(r){return r===41?(e.enter(`resourceMarker`),e.consume(r),e.exit(`resourceMarker`),e.exit(`resource`),t):n(r)}}function Ia(e,t,n){let r=this;return i;function i(t){return aa.call(r,e,a,o,`reference`,`referenceMarker`,`referenceString`)(t)}function a(e){return r.parser.defined.includes(ei(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(e):n(e)}function o(e){return n(e)}}function La(e,t,n){return r;function r(t){return e.enter(`reference`),e.enter(`referenceMarker`),e.consume(t),e.exit(`referenceMarker`),i}function i(r){return r===93?(e.enter(`referenceMarker`),e.consume(r),e.exit(`referenceMarker`),e.exit(`reference`),t):n(r)}}var Ra={name:`labelStartImage`,resolveAll:Oa.resolveAll,tokenize:za};function za(e,t,n){let r=this;return i;function i(t){return e.enter(`labelImage`),e.enter(`labelImageMarker`),e.consume(t),e.exit(`labelImageMarker`),a}function a(t){return t===91?(e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelImage`),o):n(t)}function o(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var Ba={name:`labelStartLink`,resolveAll:Oa.resolveAll,tokenize:Va};function Va(e,t,n){let r=this;return i;function i(t){return e.enter(`labelLink`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelLink`),a}function a(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var Ha={name:`lineEnding`,tokenize:Ua};function Ua(e,t){return n;function n(n){return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),V(e,t,`linePrefix`)}}var Wa={name:`thematicBreak`,tokenize:Ga};function Ga(e,t,n){let r=0,i;return a;function a(t){return e.enter(`thematicBreak`),o(t)}function o(e){return i=e,s(e)}function s(a){return a===i?(e.enter(`thematicBreakSequence`),c(a)):r>=3&&(a===null||z(a))?(e.exit(`thematicBreak`),t(a)):n(a)}function c(t){return t===i?(e.consume(t),r++,c):(e.exit(`thematicBreakSequence`),B(t)?V(e,s,`whitespace`)(t):s(t))}}var Ka={continuation:{tokenize:Xa},exit:Qa,name:`list`,tokenize:Ya},qa={partial:!0,tokenize:$a},Ja={partial:!0,tokenize:Za};function Ya(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){let i=r.containerState.type||(t===42||t===43||t===45?`listUnordered`:`listOrdered`);if(i===`listUnordered`?!r.containerState.marker||t===r.containerState.marker:ai(t)){if(r.containerState.type||(r.containerState.type=i,e.enter(i,{_container:!0})),i===`listUnordered`)return e.enter(`listItemPrefix`),t===42||t===45?e.check(Wa,n,l)(t):l(t);if(!r.interrupt||t===49)return e.enter(`listItemPrefix`),e.enter(`listItemValue`),c(t)}return n(t)}function c(t){return ai(t)&&++o<10?(e.consume(t),c):(!r.interrupt||o<2)&&(r.containerState.marker?t===r.containerState.marker:t===41||t===46)?(e.exit(`listItemValue`),l(t)):n(t)}function l(t){return e.enter(`listItemMarker`),e.consume(t),e.exit(`listItemMarker`),r.containerState.marker=r.containerState.marker||t,e.check(Di,r.interrupt?n:u,e.attempt(qa,f,d))}function u(e){return r.containerState.initialBlankLine=!0,a++,f(e)}function d(t){return B(t)?(e.enter(`listItemPrefixWhitespace`),e.consume(t),e.exit(`listItemPrefixWhitespace`),f):n(t)}function f(n){return r.containerState.size=a+r.sliceSerialize(e.exit(`listItemPrefix`),!0).length,t(n)}}function Xa(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(Di,i,a);function i(n){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,V(e,t,`listItemIndent`,r.containerState.size+1)(n)}function a(n){return r.containerState.furtherBlankLines||!B(n)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,o(n)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(Ja,t,o)(n))}function o(i){return r.containerState._closeFlow=!0,r.interrupt=void 0,V(e,e.attempt(Ka,t,n),`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(i)}}function Za(e,t,n){let r=this;return V(e,i,`listItemIndent`,r.containerState.size+1);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`listItemIndent`&&i[2].sliceSerialize(i[1],!0).length===r.containerState.size?t(e):n(e)}}function Qa(e){e.exit(this.containerState.type)}function $a(e,t,n){let r=this;return V(e,i,`listItemPrefixWhitespace`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:5);function i(e){let i=r.events[r.events.length-1];return!B(e)&&i&&i[1].type===`listItemPrefixWhitespace`?t(e):n(e)}}var eo={name:`setextUnderline`,resolveTo:to,tokenize:no};function to(e,t){let n=e.length,r,i,a;for(;n--;)if(e[n][0]===`enter`){if(e[n][1].type===`content`){r=n;break}e[n][1].type===`paragraph`&&(i=n)}else e[n][1].type===`content`&&e.splice(n,1),!a&&e[n][1].type===`definition`&&(a=n);let o={type:`setextHeading`,start:{...e[r][1].start},end:{...e[e.length-1][1].end}};return e[i][1].type=`setextHeadingText`,a?(e.splice(i,0,[`enter`,o,t]),e.splice(a+1,0,[`exit`,e[r][1],t]),e[r][1].end={...e[a][1].end}):e[r][1]=o,e.push([`exit`,o,t]),e}function no(e,t,n){let r=this,i;return a;function a(t){let a=r.events.length,s;for(;a--;)if(r.events[a][1].type!==`lineEnding`&&r.events[a][1].type!==`linePrefix`&&r.events[a][1].type!==`content`){s=r.events[a][1].type===`paragraph`;break}return!r.parser.lazy[r.now().line]&&(r.interrupt||s)?(e.enter(`setextHeadingLine`),i=t,o(t)):n(t)}function o(t){return e.enter(`setextHeadingLineSequence`),s(t)}function s(t){return t===i?(e.consume(t),s):(e.exit(`setextHeadingLineSequence`),B(t)?V(e,c,`lineSuffix`)(t):c(t))}function c(r){return r===null||z(r)?(e.exit(`setextHeadingLine`),t(r)):n(r)}}var ro={tokenize:io};function io(e){let t=this,n=e.attempt(Di,r,e.attempt(this.parser.constructs.flowInitial,i,V(e,e.attempt(this.parser.constructs.flow,i,e.attempt($i,i)),`linePrefix`)));return n;function r(r){if(r===null){e.consume(r);return}return e.enter(`lineEndingBlank`),e.consume(r),e.exit(`lineEndingBlank`),t.currentConstruct=void 0,n}function i(r){if(r===null){e.consume(r);return}return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),t.currentConstruct=void 0,n}}var ao={resolveAll:lo()},oo=co(`string`),so=co(`text`);function co(e){return{resolveAll:lo(e===`text`?uo:void 0),tokenize:t};function t(t){let n=this,r=this.parser.constructs[e],i=t.attempt(r,a,o);return a;function a(e){return c(e)?i(e):o(e)}function o(e){if(e===null){t.consume(e);return}return t.enter(`data`),t.consume(e),s}function s(e){return c(e)?(t.exit(`data`),i(e)):(t.consume(e),s)}function c(e){if(e===null)return!0;let t=r[e],i=-1;if(t)for(;++i<t.length;){let e=t[i];if(!e.previous||e.previous.call(n,n.previous))return!0}return!1}}}function lo(e){return t;function t(t,n){let r=-1,i;for(;++r<=t.length;)i===void 0?t[r]&&t[r][1].type===`data`&&(i=r,r++):(!t[r]||t[r][1].type!==`data`)&&(r!==i+2&&(t[i][1].end=t[r-1][1].end,t.splice(i+2,r-i-2),r=i+2),i=void 0);return e?e(t,n):t}}function uo(e,t){let n=0;for(;++n<=e.length;)if((n===e.length||e[n][1].type===`lineEnding`)&&e[n-1][1].type===`data`){let r=e[n-1][1],i=t.sliceStream(r),a=i.length,o=-1,s=0,c;for(;a--;){let e=i[a];if(typeof e==`string`){for(o=e.length;e.charCodeAt(o-1)===32;)s++,o--;if(o)break;o=-1}else if(e===-2)c=!0,s++;else if(e!==-1){a++;break}}if(t._contentTypeTextTrailing&&n===e.length&&(s=0),s){let i={type:n===e.length||c||s<2?`lineSuffix`:`hardBreakTrailing`,start:{_bufferIndex:a?o:r.start._bufferIndex+o,_index:r.start._index+a,line:r.end.line,column:r.end.column-s,offset:r.end.offset-s},end:{...r.end}};r.end={...i.start},r.start.offset===r.end.offset?Object.assign(r,i):(e.splice(n,0,[`enter`,i,t],[`exit`,i,t]),n+=2)}n++}return e}var fo=t({attentionMarkers:()=>bo,contentInitial:()=>mo,disable:()=>xo,document:()=>po,flow:()=>go,flowInitial:()=>ho,insideSpan:()=>yo,string:()=>_o,text:()=>vo}),po={42:Ka,43:Ka,45:Ka,48:Ka,49:Ka,50:Ka,51:Ka,52:Ka,53:Ka,54:Ka,55:Ka,56:Ka,57:Ka,62:ki},mo={91:ca},ho={[-2]:Vi,[-1]:Vi,32:Vi},go={35:ma,42:Wa,45:[eo,Wa],60:ya,61:eo,95:Wa,96:Ri,126:Ri},_o={38:Fi,92:Ni},vo={[-5]:Ha,[-4]:Ha,[-3]:Ha,33:Ra,38:Fi,42:xi,60:[Ti,Ea],91:Ba,92:[fa,Ni],93:Oa,95:xi,96:Gi},yo={null:[xi,ao]},bo={null:[42,95]},xo={null:[]};function So(e,t,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},a=[],o=[],s=[],c={attempt:C(x),check:C(S),consume:v,enter:y,exit:b,interrupt:C(S,{interrupt:!0})},l={code:null,containerState:{},defineSkip:h,events:[],now:m,parser:e,previous:null,sliceSerialize:f,sliceStream:p,write:d},u=t.tokenize.call(l,c);return t.resolveAll&&a.push(t),l;function d(e){return o=Jr(o,e),g(),o[o.length-1]===null?(w(t,0),l.events=bi(a,l.events,l),l.events):[]}function f(e,t){return wo(p(e),t)}function p(e){return Co(o,e)}function m(){let{_bufferIndex:e,_index:t,line:n,column:i,offset:a}=r;return{_bufferIndex:e,_index:t,line:n,column:i,offset:a}}function h(e){i[e.line]=e.column,E()}function g(){let e;for(;r._index<o.length;){let t=o[r._index];if(typeof t==`string`)for(e=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===e&&r._bufferIndex<t.length;)_(t.charCodeAt(r._bufferIndex));else _(t)}}function _(e){u=u(e)}function v(e){z(e)?(r.line++,r.column=1,r.offset+=e===-3?2:1,E()):e!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===o[r._index].length&&(r._bufferIndex=-1,r._index++)),l.previous=e}function y(e,t){let n=t||{};return n.type=e,n.start=m(),l.events.push([`enter`,n,l]),s.push(n),n}function b(e){let t=s.pop();return t.end=m(),l.events.push([`exit`,t,l]),t}function x(e,t){w(e,t.from)}function S(e,t){t.restore()}function C(e,t){return n;function n(n,r,i){let a,o,s,u;return Array.isArray(n)?f(n):`tokenize`in n?f([n]):d(n);function d(e){return t;function t(t){let n=t!==null&&e[t],r=t!==null&&e.null;return f([...Array.isArray(n)?n:n?[n]:[],...Array.isArray(r)?r:r?[r]:[]])(t)}}function f(e){return a=e,o=0,e.length===0?i:p(e[o])}function p(e){return n;function n(n){return u=T(),s=e,e.partial||(l.currentConstruct=e),e.name&&l.parser.constructs.disable.null.includes(e.name)?h(n):e.tokenize.call(t?Object.assign(Object.create(l),t):l,c,m,h)(n)}}function m(t){return e(s,u),r}function h(e){return u.restore(),++o<a.length?p(a[o]):i}}}function w(e,t){e.resolveAll&&!a.includes(e)&&a.push(e),e.resolve&&qr(l.events,t,l.events.length-t,e.resolve(l.events.slice(t),l)),e.resolveTo&&(l.events=e.resolveTo(l.events,l))}function T(){let e=m(),t=l.previous,n=l.currentConstruct,i=l.events.length,a=Array.from(s);return{from:i,restore:o};function o(){r=e,l.previous=t,l.currentConstruct=n,l.events.length=i,s=a,E()}}function E(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function Co(e,t){let n=t.start._index,r=t.start._bufferIndex,i=t.end._index,a=t.end._bufferIndex,o;if(n===i)o=[e[n].slice(r,a)];else{if(o=e.slice(n,i),r>-1){let e=o[0];typeof e==`string`?o[0]=e.slice(r):o.shift()}a>0&&o.push(e[i].slice(0,a))}return o}function wo(e,t){let n=-1,r=[],i;for(;++n<e.length;){let a=e[n],o;if(typeof a==`string`)o=a;else switch(a){case-5:o=`\r`;break;case-4:o=`
`;break;case-3:o=`\r
`;break;case-2:o=t?` `:`	`;break;case-1:if(!t&&i)continue;o=` `;break;default:o=String.fromCharCode(a)}i=a===-2,r.push(o)}return r.join(``)}function To(e){let t={constructs:Xr([fo,...(e||{}).extensions||[]]),content:n(pi),defined:[],document:n(hi),flow:n(ro),lazy:{},string:n(oo),text:n(so)};return t;function n(e){return n;function n(n){return So(t,e,n)}}}function Eo(e){for(;!Zi(e););return e}var Do=/[\0\t\n\r]/g;function Oo(){let e=1,t=``,n=!0,r;return i;function i(i,a,o){let s=[],c,l,u,d,f;for(i=t+(typeof i==`string`?i.toString():new TextDecoder(a||void 0).decode(i)),u=0,t=``,n&&=(i.charCodeAt(0)===65279&&u++,void 0);u<i.length;){if(Do.lastIndex=u,c=Do.exec(i),d=c&&c.index!==void 0?c.index:i.length,f=i.charCodeAt(d),!c){t=i.slice(u);break}if(f===10&&u===d&&r)s.push(-3),r=void 0;else switch(r&&=(s.push(-5),void 0),u<d&&(s.push(i.slice(u,d)),e+=d-u),f){case 0:s.push(65533),e++;break;case 9:for(l=Math.ceil(e/4)*4,s.push(-2);e++<l;)s.push(-1);break;case 10:s.push(-4),e=1;break;default:r=!0,e=1}u=d+1}return o&&(r&&s.push(-5),t&&s.push(t),s.push(null)),s}}var ko=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function Ao(e){return e.replace(ko,jo)}function jo(e,t,n){if(t)return t;if(n.charCodeAt(0)===35){let e=n.charCodeAt(1),t=e===120||e===88;return $r(n.slice(t?2:1),t?16:10)}return Kr(n)||e}var Mo={}.hasOwnProperty;function No(e,t,n){return t&&typeof t==`object`&&(n=t,t=void 0),Po(n)(Eo(To(n).document().write(Oo()(e,t,!0))))}function Po(e){let t={transforms:[],canContainEols:[`emphasis`,`fragment`,`heading`,`paragraph`,`strong`],enter:{autolink:a(be),autolinkProtocol:T,autolinkEmail:T,atxHeading:a(_e),blockQuote:a(fe),characterEscape:T,characterReference:T,codeFenced:a(pe),codeFencedFenceInfo:o,codeFencedFenceMeta:o,codeIndented:a(pe,o),codeText:a(me,o),codeTextData:T,data:T,codeFlowValue:T,definition:a(he),definitionDestinationString:o,definitionLabelString:o,definitionTitleString:o,emphasis:a(ge),hardBreakEscape:a(ve),hardBreakTrailing:a(ve),htmlFlow:a(ye,o),htmlFlowData:T,htmlText:a(ye,o),htmlTextData:T,image:a(P),label:o,link:a(be),listItem:a(Se),listItemValue:f,listOrdered:a(xe,d),listUnordered:a(xe),paragraph:a(Ce),reference:ae,referenceString:o,resourceDestinationString:o,resourceTitleString:o,setextHeading:a(_e),strong:a(we),thematicBreak:a(Ee)},exit:{atxHeading:c(),atxHeadingSequence:x,autolink:c(),autolinkEmail:de,autolinkProtocol:ue,blockQuote:c(),characterEscapeValue:E,characterReferenceMarkerHexadecimal:se,characterReferenceMarkerNumeric:se,characterReferenceValue:ce,characterReference:le,codeFenced:c(g),codeFencedFence:h,codeFencedFenceInfo:p,codeFencedFenceMeta:m,codeFlowValue:E,codeIndented:c(_),codeText:c(A),codeTextData:E,data:E,definition:c(),definitionDestinationString:b,definitionLabelString:v,definitionTitleString:y,emphasis:c(),hardBreakEscape:c(O),hardBreakTrailing:c(O),htmlFlow:c(k),htmlFlowData:E,htmlText:c(ee),htmlTextData:E,image:c(te),label:N,labelText:M,lineEnding:D,link:c(j),listItem:c(),listOrdered:c(),listUnordered:c(),paragraph:c(),referenceString:oe,resourceDestinationString:ne,resourceTitleString:re,resource:ie,setextHeading:c(w),setextHeadingLineSequence:C,setextHeadingText:S,strong:c(),thematicBreak:c()}};Io(t,(e||{}).mdastExtensions||[]);let n={};return r;function r(e){let r={type:`root`,children:[]},a={stack:[r],tokenStack:[],config:t,enter:s,exit:l,buffer:o,resume:u,data:n},c=[],d=-1;for(;++d<e.length;)(e[d][1].type===`listOrdered`||e[d][1].type===`listUnordered`)&&(e[d][0]===`enter`?c.push(d):d=i(e,c.pop(),d));for(d=-1;++d<e.length;){let n=t[e[d][0]];Mo.call(n,e[d][1].type)&&n[e[d][1].type].call(Object.assign({sliceSerialize:e[d][2].sliceSerialize},a),e[d][1])}if(a.tokenStack.length>0){let e=a.tokenStack[a.tokenStack.length-1];(e[1]||Ro).call(a,void 0,e[0])}for(r.position={start:Fo(e.length>0?e[0][1].start:{line:1,column:1,offset:0}),end:Fo(e.length>0?e[e.length-2][1].end:{line:1,column:1,offset:0})},d=-1;++d<t.transforms.length;)r=t.transforms[d](r)||r;return r}function i(e,t,n){let r=t-1,i=-1,a=!1,o,s,c,l;for(;++r<=n;){let t=e[r];switch(t[1].type){case`listUnordered`:case`listOrdered`:case`blockQuote`:t[0]===`enter`?i++:i--,l=void 0;break;case`lineEndingBlank`:t[0]===`enter`&&(o&&!l&&!i&&!c&&(c=r),l=void 0);break;case`linePrefix`:case`listItemValue`:case`listItemMarker`:case`listItemPrefix`:case`listItemPrefixWhitespace`:break;default:l=void 0}if(!i&&t[0]===`enter`&&t[1].type===`listItemPrefix`||i===-1&&t[0]===`exit`&&(t[1].type===`listUnordered`||t[1].type===`listOrdered`)){if(o){let i=r;for(s=void 0;i--;){let t=e[i];if(t[1].type===`lineEnding`||t[1].type===`lineEndingBlank`){if(t[0]===`exit`)continue;s&&(e[s][1].type=`lineEndingBlank`,a=!0),t[1].type=`lineEnding`,s=i}else if(!(t[1].type===`linePrefix`||t[1].type===`blockQuotePrefix`||t[1].type===`blockQuotePrefixWhitespace`||t[1].type===`blockQuoteMarker`||t[1].type===`listItemIndent`))break}c&&(!s||c<s)&&(o._spread=!0),o.end=Object.assign({},s?e[s][1].start:t[1].end),e.splice(s||r,0,[`exit`,o,t[2]]),r++,n++}if(t[1].type===`listItemPrefix`){let i={type:`listItem`,_spread:!1,start:Object.assign({},t[1].start),end:void 0};o=i,e.splice(r,0,[`enter`,i,t[2]]),r++,n++,c=void 0,l=!0}}}return e[t][1]._spread=a,n}function a(e,t){return n;function n(n){s.call(this,e(n),n),t&&t.call(this,n)}}function o(){this.stack.push({type:`fragment`,children:[]})}function s(e,t,n){this.stack[this.stack.length-1].children.push(e),this.stack.push(e),this.tokenStack.push([t,n||void 0]),e.position={start:Fo(t.start),end:void 0}}function c(e){return t;function t(t){e&&e.call(this,t),l.call(this,t)}}function l(e,t){let n=this.stack.pop(),r=this.tokenStack.pop();if(r)r[0].type!==e.type&&(t?t.call(this,e,r[0]):(r[1]||Ro).call(this,e,r[0]));else throw Error("Cannot close `"+e.type+"` ("+ar({start:e.start,end:e.end})+`): it’s not open`);n.position.end=Fo(e.end)}function u(){return Vr(this.stack.pop())}function d(){this.data.expectingFirstListItemValue=!0}function f(e){if(this.data.expectingFirstListItemValue){let t=this.stack[this.stack.length-2];t.start=Number.parseInt(this.sliceSerialize(e),10),this.data.expectingFirstListItemValue=void 0}}function p(){let e=this.resume(),t=this.stack[this.stack.length-1];t.lang=e}function m(){let e=this.resume(),t=this.stack[this.stack.length-1];t.meta=e}function h(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function g(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,``),this.data.flowCodeInside=void 0}function _(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/(\r?\n|\r)$/g,``)}function v(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=ei(this.sliceSerialize(e)).toLowerCase()}function y(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function b(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function x(e){let t=this.stack[this.stack.length-1];t.depth||=this.sliceSerialize(e).length}function S(){this.data.setextHeadingSlurpLineEnding=!0}function C(e){let t=this.stack[this.stack.length-1];t.depth=this.sliceSerialize(e).codePointAt(0)===61?1:2}function w(){this.data.setextHeadingSlurpLineEnding=void 0}function T(e){let t=this.stack[this.stack.length-1].children,n=t[t.length-1];(!n||n.type!==`text`)&&(n=Te(),n.position={start:Fo(e.start),end:void 0},t.push(n)),this.stack.push(n)}function E(e){let t=this.stack.pop();t.value+=this.sliceSerialize(e),t.position.end=Fo(e.end)}function D(e){let n=this.stack[this.stack.length-1];if(this.data.atHardBreak){let t=n.children[n.children.length-1];t.position.end=Fo(e.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&t.canContainEols.includes(n.type)&&(T.call(this,e),E.call(this,e))}function O(){this.data.atHardBreak=!0}function k(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function ee(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function A(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function j(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function te(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function M(e){let t=this.sliceSerialize(e),n=this.stack[this.stack.length-2];n.label=Ao(t),n.identifier=ei(t).toLowerCase()}function N(){let e=this.stack[this.stack.length-1],t=this.resume(),n=this.stack[this.stack.length-1];this.data.inReference=!0,n.type===`link`?n.children=e.children:n.alt=t}function ne(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function re(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function ie(){this.data.inReference=void 0}function ae(){this.data.referenceType=`collapsed`}function oe(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=ei(this.sliceSerialize(e)).toLowerCase(),this.data.referenceType=`full`}function se(e){this.data.characterReferenceType=e.type}function ce(e){let t=this.sliceSerialize(e),n=this.data.characterReferenceType,r;n?(r=$r(t,n===`characterReferenceMarkerNumeric`?10:16),this.data.characterReferenceType=void 0):r=Kr(t);let i=this.stack[this.stack.length-1];i.value+=r}function le(e){let t=this.stack.pop();t.position.end=Fo(e.end)}function ue(e){E.call(this,e);let t=this.stack[this.stack.length-1];t.url=this.sliceSerialize(e)}function de(e){E.call(this,e);let t=this.stack[this.stack.length-1];t.url=`mailto:`+this.sliceSerialize(e)}function fe(){return{type:`blockquote`,children:[]}}function pe(){return{type:`code`,lang:null,meta:null,value:``}}function me(){return{type:`inlineCode`,value:``}}function he(){return{type:`definition`,identifier:``,label:null,title:null,url:``}}function ge(){return{type:`emphasis`,children:[]}}function _e(){return{type:`heading`,depth:0,children:[]}}function ve(){return{type:`break`}}function ye(){return{type:`html`,value:``}}function P(){return{type:`image`,title:null,url:``,alt:null}}function be(){return{type:`link`,title:null,url:``,children:[]}}function xe(e){return{type:`list`,ordered:e.type===`listOrdered`,start:null,spread:e._spread,children:[]}}function Se(e){return{type:`listItem`,spread:e._spread,checked:null,children:[]}}function Ce(){return{type:`paragraph`,children:[]}}function we(){return{type:`strong`,children:[]}}function Te(){return{type:`text`,value:``}}function Ee(){return{type:`thematicBreak`}}}function Fo(e){return{line:e.line,column:e.column,offset:e.offset}}function Io(e,t){let n=-1;for(;++n<t.length;){let r=t[n];Array.isArray(r)?Io(e,r):Lo(e,r)}}function Lo(e,t){let n;for(n in t)if(Mo.call(t,n))switch(n){case`canContainEols`:{let r=t[n];r&&e[n].push(...r);break}case`transforms`:{let r=t[n];r&&e[n].push(...r);break}case`enter`:case`exit`:{let r=t[n];r&&Object.assign(e[n],r);break}}}function Ro(e,t){throw Error(e?"Cannot close `"+e.type+"` ("+ar({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+ar({start:t.start,end:t.end})+`) is open`:"Cannot close document, a token (`"+t.type+"`, "+ar({start:t.start,end:t.end})+`) is still open`)}function zo(e){let t=this;t.parser=n;function n(n){return No(n,{...t.data(`settings`),...e,extensions:t.data(`micromarkExtensions`)||[],mdastExtensions:t.data(`fromMarkdownExtensions`)||[]})}}function Bo(e,t){let n={type:`element`,tagName:`blockquote`,properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)}function Vo(e,t){let n={type:`element`,tagName:`br`,properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:`text`,value:`
`}]}function Ho(e,t){let n=t.value?t.value+`
`:``,r={},i=t.lang?t.lang.split(/\s+/):[];i.length>0&&(r.className=[`language-`+i[0]]);let a={type:`element`,tagName:`code`,properties:r,children:[{type:`text`,value:n}]};return t.meta&&(a.data={meta:t.meta}),e.patch(t,a),a=e.applyData(t,a),a={type:`element`,tagName:`pre`,properties:{},children:[a]},e.patch(t,a),a}function Uo(e,t){let n={type:`element`,tagName:`del`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Wo(e,t){let n={type:`element`,tagName:`em`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Go(e,t){let n=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,r=String(t.identifier).toUpperCase(),i=fi(r.toLowerCase()),a=e.footnoteOrder.indexOf(r),o,s=e.footnoteCounts.get(r);s===void 0?(s=0,e.footnoteOrder.push(r),o=e.footnoteOrder.length):o=a+1,s+=1,e.footnoteCounts.set(r,s);let c={type:`element`,tagName:`a`,properties:{href:`#`+n+`fn-`+i,id:n+`fnref-`+i+(s>1?`-`+s:``),dataFootnoteRef:!0,ariaDescribedBy:[`footnote-label`]},children:[{type:`text`,value:String(o)}]};e.patch(t,c);let l={type:`element`,tagName:`sup`,properties:{},children:[c]};return e.patch(t,l),e.applyData(t,l)}function Ko(e,t){let n={type:`element`,tagName:`h`+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function qo(e,t){if(e.options.allowDangerousHtml){let n={type:`raw`,value:t.value};return e.patch(t,n),e.applyData(t,n)}}function Jo(e,t){let n=t.referenceType,r=`]`;if(n===`collapsed`?r+=`[]`:n===`full`&&(r+=`[`+(t.label||t.identifier)+`]`),t.type===`imageReference`)return[{type:`text`,value:`![`+t.alt+r}];let i=e.all(t),a=i[0];a&&a.type===`text`?a.value=`[`+a.value:i.unshift({type:`text`,value:`[`});let o=i[i.length-1];return o&&o.type===`text`?o.value+=r:i.push({type:`text`,value:r}),i}function Yo(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Jo(e,t);let i={src:fi(r.url||``),alt:t.alt};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`img`,properties:i,children:[]};return e.patch(t,a),e.applyData(t,a)}function Xo(e,t){let n={src:fi(t.url)};t.alt!==null&&t.alt!==void 0&&(n.alt=t.alt),t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`img`,properties:n,children:[]};return e.patch(t,r),e.applyData(t,r)}function Zo(e,t){let n={type:`text`,value:t.value.replace(/\r?\n|\r/g,` `)};e.patch(t,n);let r={type:`element`,tagName:`code`,properties:{},children:[n]};return e.patch(t,r),e.applyData(t,r)}function Qo(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Jo(e,t);let i={href:fi(r.url||``)};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`a`,properties:i,children:e.all(t)};return e.patch(t,a),e.applyData(t,a)}function $o(e,t){let n={href:fi(t.url)};t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`a`,properties:n,children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function es(e,t,n){let r=e.all(t),i=n?ts(n):ns(t),a={},o=[];if(typeof t.checked==`boolean`){let e=r[0],n;e&&e.type===`element`&&e.tagName===`p`?n=e:(n={type:`element`,tagName:`p`,properties:{},children:[]},r.unshift(n)),n.children.length>0&&n.children.unshift({type:`text`,value:` `}),n.children.unshift({type:`element`,tagName:`input`,properties:{type:`checkbox`,checked:t.checked,disabled:!0},children:[]}),a.className=[`task-list-item`]}let s=-1;for(;++s<r.length;){let e=r[s];(i||s!==0||e.type!==`element`||e.tagName!==`p`)&&o.push({type:`text`,value:`
`}),e.type===`element`&&e.tagName===`p`&&!i?o.push(...e.children):o.push(e)}let c=r[r.length-1];c&&(i||c.type!==`element`||c.tagName!==`p`)&&o.push({type:`text`,value:`
`});let l={type:`element`,tagName:`li`,properties:a,children:o};return e.patch(t,l),e.applyData(t,l)}function ts(e){let t=!1;if(e.type===`list`){t=e.spread||!1;let n=e.children,r=-1;for(;!t&&++r<n.length;)t=ns(n[r])}return t}function ns(e){return e.spread??e.children.length>1}function rs(e,t){let n={},r=e.all(t),i=-1;for(typeof t.start==`number`&&t.start!==1&&(n.start=t.start);++i<r.length;){let e=r[i];if(e.type===`element`&&e.tagName===`li`&&e.properties&&Array.isArray(e.properties.className)&&e.properties.className.includes(`task-list-item`)){n.className=[`contains-task-list`];break}}let a={type:`element`,tagName:t.ordered?`ol`:`ul`,properties:n,children:e.wrap(r,!0)};return e.patch(t,a),e.applyData(t,a)}function is(e,t){let n={type:`element`,tagName:`p`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function as(e,t){let n={type:`root`,children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)}function os(e,t){let n={type:`element`,tagName:`strong`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function ss(e,t){let n=e.all(t),r=n.shift(),i=[];if(r){let n={type:`element`,tagName:`thead`,properties:{},children:e.wrap([r],!0)};e.patch(t.children[0],n),i.push(n)}if(n.length>0){let r={type:`element`,tagName:`tbody`,properties:{},children:e.wrap(n,!0)},a=nr(t.children[1]),o=tr(t.children[t.children.length-1]);a&&o&&(r.position={start:a,end:o}),i.push(r)}let a={type:`element`,tagName:`table`,properties:{},children:e.wrap(i,!0)};return e.patch(t,a),e.applyData(t,a)}function cs(e,t,n){let r=n?n.children:void 0,i=(r?r.indexOf(t):1)===0?`th`:`td`,a=n&&n.type===`table`?n.align:void 0,o=a?a.length:t.children.length,s=-1,c=[];for(;++s<o;){let n=t.children[s],r={},o=a?a[s]:void 0;o&&(r.align=o);let l={type:`element`,tagName:i,properties:r,children:[]};n&&(l.children=e.all(n),e.patch(n,l),l=e.applyData(n,l)),c.push(l)}let l={type:`element`,tagName:`tr`,properties:{},children:e.wrap(c,!0)};return e.patch(t,l),e.applyData(t,l)}function ls(e,t){let n={type:`element`,tagName:`td`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}var us=9,ds=32;function fs(e){let t=String(e),n=/\r?\n|\r/g,r=n.exec(t),i=0,a=[];for(;r;)a.push(ps(t.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=n.exec(t);return a.push(ps(t.slice(i),i>0,!1)),a.join(``)}function ps(e,t,n){let r=0,i=e.length;if(t){let t=e.codePointAt(r);for(;t===us||t===ds;)r++,t=e.codePointAt(r)}if(n){let t=e.codePointAt(i-1);for(;t===us||t===ds;)i--,t=e.codePointAt(i-1)}return i>r?e.slice(r,i):``}function ms(e,t){let n={type:`text`,value:fs(String(t.value))};return e.patch(t,n),e.applyData(t,n)}function hs(e,t){let n={type:`element`,tagName:`hr`,properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)}var gs={blockquote:Bo,break:Vo,code:Ho,delete:Uo,emphasis:Wo,footnoteReference:Go,heading:Ko,html:qo,imageReference:Yo,image:Xo,inlineCode:Zo,linkReference:Qo,link:$o,listItem:es,list:rs,paragraph:is,root:as,strong:os,table:ss,tableCell:ls,tableRow:cs,text:ms,thematicBreak:hs,toml:_s,yaml:_s,definition:_s,footnoteDefinition:_s};function _s(){}var vs=typeof self==`object`?self:globalThis,ys=(e,t)=>{switch(e){case`Function`:case`SharedWorker`:case`Worker`:case`eval`:case`setInterval`:case`setTimeout`:throw TypeError(`unable to deserialize `+e)}return new vs[e](t)},bs=(e,t)=>{let n=(t,n)=>(e.set(n,t),t),r=i=>{if(e.has(i))return e.get(i);let[a,o]=t[i];switch(a){case 0:case-1:return n(o,i);case 1:{let e=n([],i);for(let t of o)e.push(r(t));return e}case 2:{let e=n({},i);for(let[t,n]of o)e[r(t)]=r(n);return e}case 3:return n(new Date(o),i);case 4:{let{source:e,flags:t}=o;return n(new RegExp(e,t),i)}case 5:{let e=n(new Map,i);for(let[t,n]of o)e.set(r(t),r(n));return e}case 6:{let e=n(new Set,i);for(let t of o)e.add(r(t));return e}case 7:{let{name:e,message:t}=o;return n(typeof vs[e]==`function`?ys(e,t):Error(t),i)}case 8:return n(BigInt(o),i);case`BigInt`:return n(Object(BigInt(o)),i);case`ArrayBuffer`:return n(new Uint8Array(o).buffer,o);case`DataView`:{let{buffer:e}=new Uint8Array(o);return n(new DataView(e),o)}}return n(ys(a,o),i)};return r},xs=e=>bs(new Map,e)(0),Ss=``,{toString:Cs}={},{keys:ws}=Object,Ts=e=>{let t=typeof e;if(t!==`object`||!e)return[0,t];let n=Cs.call(e).slice(8,-1);switch(n){case`Array`:return[1,Ss];case`Object`:return[2,Ss];case`Date`:return[3,Ss];case`RegExp`:return[4,Ss];case`Map`:return[5,Ss];case`Set`:return[6,Ss];case`DataView`:return[1,n]}return n.includes(`Array`)?[1,n]:e instanceof Error?[7,e.name||`Error`]:[2,n]},Es=([e,t])=>e===0&&(t===`function`||t===`symbol`),Ds=(e,t,n,r)=>{let i=(e,t)=>{let i=r.push(e)-1;return n.set(t,i),i},a=r=>{if(n.has(r))return n.get(r);let[o,s]=Ts(r);switch(o){case 0:{let t=r;switch(s){case`bigint`:o=8,t=r.toString();break;case`function`:case`symbol`:if(e)throw TypeError(`unable to serialize `+s);t=null;break;case`undefined`:return i([-1],r)}return i([o,t],r)}case 1:{if(s){let e=r;return s===`DataView`?e=new Uint8Array(r.buffer):s===`ArrayBuffer`&&(e=new Uint8Array(r)),i([s,[...e]],r)}let e=[],t=i([o,e],r);for(let t of r)e.push(a(t));return t}case 2:{if(s)switch(s){case`BigInt`:return i([s,r.toString()],r);case`Boolean`:case`Number`:case`String`:return i([s,r.valueOf()],r)}if(t&&`toJSON`in r)return a(r.toJSON());let n=[],c=i([o,n],r);for(let t of ws(r))(e||!Es(Ts(r[t])))&&n.push([a(t),a(r[t])]);return c}case 3:return i([o,isNaN(r.getTime())?Ss:r.toISOString()],r);case 4:{let{source:e,flags:t}=r;return i([o,{source:e,flags:t}],r)}case 5:{let t=[],n=i([o,t],r);for(let[n,i]of r)(e||!(Es(Ts(n))||Es(Ts(i))))&&t.push([a(n),a(i)]);return n}case 6:{let t=[],n=i([o,t],r);for(let n of r)(e||!Es(Ts(n)))&&t.push(a(n));return n}}let{message:c}=r;return i([o,{name:s,message:c}],r)};return a},Os=(e,{json:t,lossy:n}={})=>{let r=[];return Ds(!(t||n),!!t,new Map,r)(e),r},ks=typeof structuredClone==`function`?(e,t)=>t&&(`json`in t||`lossy`in t)?xs(Os(e,t)):structuredClone(e):(e,t)=>xs(Os(e,t));function As(e,t){let n=[{type:`text`,value:`↩`}];return t>1&&n.push({type:`element`,tagName:`sup`,properties:{},children:[{type:`text`,value:String(t)}]}),n}function js(e,t){return`Back to reference `+(e+1)+(t>1?`-`+t:``)}function Ms(e){let t=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,n=e.options.footnoteBackContent||As,r=e.options.footnoteBackLabel||js,i=e.options.footnoteLabel||`Footnotes`,a=e.options.footnoteLabelTagName||`h2`,o=e.options.footnoteLabelProperties||{className:[`sr-only`]},s=[],c=-1;for(;++c<e.footnoteOrder.length;){let i=e.footnoteById.get(e.footnoteOrder[c]);if(!i)continue;let a=e.all(i),o=String(i.identifier).toUpperCase(),l=fi(o.toLowerCase()),u=0,d=[],f=e.footnoteCounts.get(o);for(;f!==void 0&&++u<=f;){d.length>0&&d.push({type:`text`,value:` `});let e=typeof n==`string`?n:n(c,u);typeof e==`string`&&(e={type:`text`,value:e}),d.push({type:`element`,tagName:`a`,properties:{href:`#`+t+`fnref-`+l+(u>1?`-`+u:``),dataFootnoteBackref:``,ariaLabel:typeof r==`string`?r:r(c,u),className:[`data-footnote-backref`]},children:Array.isArray(e)?e:[e]})}let p=a[a.length-1];if(p&&p.type===`element`&&p.tagName===`p`){let e=p.children[p.children.length-1];e&&e.type===`text`?e.value+=` `:p.children.push({type:`text`,value:` `}),p.children.push(...d)}else a.push(...d);let m={type:`element`,tagName:`li`,properties:{id:t+`fn-`+l},children:e.wrap(a,!0)};e.patch(i,m),s.push(m)}if(s.length!==0)return{type:`element`,tagName:`section`,properties:{dataFootnotes:!0,className:[`footnotes`]},children:[{type:`element`,tagName:a,properties:{...ks(o),id:`footnote-label`},children:[{type:`text`,value:i}]},{type:`text`,value:`
`},{type:`element`,tagName:`ol`,properties:{},children:e.wrap(s,!0)},{type:`text`,value:`
`}]}}var Ns=(function(e){if(e==null)return Rs;if(typeof e==`function`)return Ls(e);if(typeof e==`object`)return Array.isArray(e)?Ps(e):Fs(e);if(typeof e==`string`)return Is(e);throw Error(`Expected function, string, or object as test`)});function Ps(e){let t=[],n=-1;for(;++n<e.length;)t[n]=Ns(e[n]);return Ls(r);function r(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1}}function Fs(e){let t=e;return Ls(n);function n(n){let r=n,i;for(i in e)if(r[i]!==t[i])return!1;return!0}}function Is(e){return Ls(t);function t(t){return t&&t.type===e}}function Ls(e){return t;function t(t,n,r){return!!(zs(t)&&e.call(this,t,typeof n==`number`?n:void 0,r||void 0))}}function Rs(){return!0}function zs(e){return typeof e==`object`&&!!e&&`type`in e}function Bs(e){return e}var Vs=[],Hs=`skip`;function Us(e,t,n,r){let i;typeof t==`function`&&typeof n!=`function`?(r=n,n=t):i=t;let a=Ns(i),o=r?-1:1;s(e,void 0,[])();function s(e,i,c){let l=e&&typeof e==`object`?e:{};if(typeof l.type==`string`){let t=typeof l.tagName==`string`?l.tagName:typeof l.name==`string`?l.name:void 0;Object.defineProperty(u,`name`,{value:`node (`+Bs(e.type+(t?`<`+t+`>`:``))+`)`})}return u;function u(){let l=Vs,u,d,f;if((!t||a(e,i,c[c.length-1]||void 0))&&(l=Ws(n(e,c)),l[0]===!1))return l;if(`children`in e&&e.children){let t=e;if(t.children&&l[0]!==`skip`)for(d=(r?t.children.length:-1)+o,f=c.concat(t);d>-1&&d<t.children.length;){let e=t.children[d];if(u=s(e,d,f)(),u[0]===!1)return u;d=typeof u[1]==`number`?u[1]:d+o}}return l}}}function Ws(e){return Array.isArray(e)?e:typeof e==`number`?[!0,e]:e==null?Vs:[e]}function Gs(e,t,n,r){let i,a,o;typeof t==`function`&&typeof n!=`function`?(a=void 0,o=t,i=n):(a=t,o=n,i=r),Us(e,a,s,i);function s(e,t){let n=t[t.length-1],r=n?n.children.indexOf(e):void 0;return o(e,r,n)}}var Ks={}.hasOwnProperty,qs={};function Js(e,t){let n=t||qs,r=new Map,i=new Map,a={all:s,applyData:Xs,definitionById:r,footnoteById:i,footnoteCounts:new Map,footnoteOrder:[],handlers:{...gs,...n.handlers},one:o,options:n,patch:Ys,wrap:Qs};return Gs(e,function(e){if(e.type===`definition`||e.type===`footnoteDefinition`){let t=e.type===`definition`?r:i,n=String(e.identifier).toUpperCase();t.has(n)||t.set(n,e)}}),a;function o(e,t){let n=e.type,r=a.handlers[n];if(Ks.call(a.handlers,n)&&r)return r(a,e,t);if(a.options.passThrough&&a.options.passThrough.includes(n)){if(`children`in e){let{children:t,...n}=e,r=ks(n);return r.children=a.all(e),r}return ks(e)}return(a.options.unknownHandler||Zs)(a,e,t)}function s(e){let t=[];if(`children`in e){let n=e.children,r=-1;for(;++r<n.length;){let i=a.one(n[r],e);if(i){if(r&&n[r-1].type===`break`&&(!Array.isArray(i)&&i.type===`text`&&(i.value=$s(i.value)),!Array.isArray(i)&&i.type===`element`)){let e=i.children[0];e&&e.type===`text`&&(e.value=$s(e.value))}Array.isArray(i)?t.push(...i):t.push(i)}}}return t}}function Ys(e,t){e.position&&(t.position=ir(e))}function Xs(e,t){let n=t;if(e&&e.data){let t=e.data.hName,r=e.data.hChildren,i=e.data.hProperties;typeof t==`string`&&(n.type===`element`?n.tagName=t:n={type:`element`,tagName:t,properties:{},children:`children`in n?n.children:[n]}),n.type===`element`&&i&&Object.assign(n.properties,ks(i)),`children`in n&&n.children&&r!=null&&(n.children=r)}return n}function Zs(e,t){let n=t.data||{},r=`value`in t&&!(Ks.call(n,`hProperties`)||Ks.call(n,`hChildren`))?{type:`text`,value:t.value}:{type:`element`,tagName:`div`,properties:{},children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function Qs(e,t){let n=[],r=-1;for(t&&n.push({type:`text`,value:`
`});++r<e.length;)r&&n.push({type:`text`,value:`
`}),n.push(e[r]);return t&&e.length>0&&n.push({type:`text`,value:`
`}),n}function $s(e){let t=0,n=e.charCodeAt(t);for(;n===9||n===32;)t++,n=e.charCodeAt(t);return e.slice(t)}function ec(e,t){let n=Js(e,t),r=n.one(e,void 0),i=Ms(n),a=Array.isArray(r)?{type:`root`,children:r}:r||{type:`root`,children:[]};return i&&(`children`in a,a.children.push({type:`text`,value:`
`},i)),a}function tc(e,t){return e&&`run`in e?async function(n,r){let i=ec(n,{file:r,...t});await e.run(i,r)}:function(n,r){return ec(n,{file:r,...e||t})}}function nc(e){if(e)throw e}var rc=r(((e,t)=>{var n=Object.prototype.hasOwnProperty,r=Object.prototype.toString,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=function(e){return typeof Array.isArray==`function`?Array.isArray(e):r.call(e)===`[object Array]`},s=function(e){if(!e||r.call(e)!==`[object Object]`)return!1;var t=n.call(e,`constructor`),i=e.constructor&&e.constructor.prototype&&n.call(e.constructor.prototype,`isPrototypeOf`);if(e.constructor&&!t&&!i)return!1;for(var a in e);return a===void 0||n.call(e,a)},c=function(e,t){i&&t.name===`__proto__`?i(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},l=function(e,t){if(t===`__proto__`){if(!n.call(e,t))return;if(a)return a(e,t).value}return e[t]};t.exports=function e(){var t,n,r,i,a,u,d=arguments[0],f=1,p=arguments.length,m=!1;for(typeof d==`boolean`&&(m=d,d=arguments[1]||{},f=2),(d==null||typeof d!=`object`&&typeof d!=`function`)&&(d={});f<p;++f)if(t=arguments[f],t!=null)for(n in t)r=l(d,n),i=l(t,n),d!==i&&(m&&i&&(s(i)||(a=o(i)))?(a?(a=!1,u=r&&o(r)?r:[]):u=r&&s(r)?r:{},c(d,{name:n,newValue:e(m,u,i)})):i!==void 0&&c(d,{name:n,newValue:i}));return d}}));function ic(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function ac(){let e=[],t={run:n,use:r};return t;function n(...t){let n=-1,r=t.pop();if(typeof r!=`function`)throw TypeError(`Expected function as last argument, not `+r);i(null,...t);function i(a,...o){let s=e[++n],c=-1;if(a){r(a);return}for(;++c<t.length;)(o[c]===null||o[c]===void 0)&&(o[c]=t[c]);t=o,s?oc(s,i)(...o):r(null,...o)}}function r(n){if(typeof n!=`function`)throw TypeError("Expected `middelware` to be a function, not "+n);return e.push(n),t}}function oc(e,t){let n;return r;function r(...t){let r=e.length>t.length,o;r&&t.push(i);try{o=e.apply(this,t)}catch(e){let t=e;if(r&&n)throw t;return i(t)}r||(o&&o.then&&typeof o.then==`function`?o.then(a,i):o instanceof Error?i(o):a(o))}function i(e,...r){n||(n=!0,t(e,...r))}function a(e){i(null,e)}}var sc={basename:cc,dirname:lc,extname:uc,join:dc,sep:`/`};function cc(e,t){if(t!==void 0&&typeof t!=`string`)throw TypeError(`"ext" argument must be a string`);mc(e);let n=0,r=-1,i=e.length,a;if(t===void 0||t.length===0||t.length>e.length){for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else r<0&&(a=!0,r=i+1);return r<0?``:e.slice(n,r)}if(t===e)return``;let o=-1,s=t.length-1;for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else o<0&&(a=!0,o=i+1),s>-1&&(e.codePointAt(i)===t.codePointAt(s--)?s<0&&(r=i):(s=-1,r=o));return n===r?r=o:r<0&&(r=e.length),e.slice(n,r)}function lc(e){if(mc(e),e.length===0)return`.`;let t=-1,n=e.length,r;for(;--n;)if(e.codePointAt(n)===47){if(r){t=n;break}}else r||=!0;return t<0?e.codePointAt(0)===47?`/`:`.`:t===1&&e.codePointAt(0)===47?`//`:e.slice(0,t)}function uc(e){mc(e);let t=e.length,n=-1,r=0,i=-1,a=0,o;for(;t--;){let s=e.codePointAt(t);if(s===47){if(o){r=t+1;break}continue}n<0&&(o=!0,n=t+1),s===46?i<0?i=t:a!==1&&(a=1):i>-1&&(a=-1)}return i<0||n<0||a===0||a===1&&i===n-1&&i===r+1?``:e.slice(i,n)}function dc(...e){let t=-1,n;for(;++t<e.length;)mc(e[t]),e[t]&&(n=n===void 0?e[t]:n+`/`+e[t]);return n===void 0?`.`:fc(n)}function fc(e){mc(e);let t=e.codePointAt(0)===47,n=pc(e,!t);return n.length===0&&!t&&(n=`.`),n.length>0&&e.codePointAt(e.length-1)===47&&(n+=`/`),t?`/`+n:n}function pc(e,t){let n=``,r=0,i=-1,a=0,o=-1,s,c;for(;++o<=e.length;){if(o<e.length)s=e.codePointAt(o);else if(s===47)break;else s=47;if(s===47){if(!(i===o-1||a===1))if(i!==o-1&&a===2){if(n.length<2||r!==2||n.codePointAt(n.length-1)!==46||n.codePointAt(n.length-2)!==46){if(n.length>2){if(c=n.lastIndexOf(`/`),c!==n.length-1){c<0?(n=``,r=0):(n=n.slice(0,c),r=n.length-1-n.lastIndexOf(`/`)),i=o,a=0;continue}}else if(n.length>0){n=``,r=0,i=o,a=0;continue}}t&&(n=n.length>0?n+`/..`:`..`,r=2)}else n.length>0?n+=`/`+e.slice(i+1,o):n=e.slice(i+1,o),r=o-i-1;i=o,a=0}else s===46&&a>-1?a++:a=-1}return n}function mc(e){if(typeof e!=`string`)throw TypeError(`Path must be a string. Received `+JSON.stringify(e))}var hc={cwd:gc};function gc(){return`/`}function _c(e){return!!(typeof e==`object`&&e&&`href`in e&&e.href&&`protocol`in e&&e.protocol&&e.auth===void 0)}function vc(e){if(typeof e==`string`)e=new URL(e);else if(!_c(e)){let t=TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw t.code=`ERR_INVALID_ARG_TYPE`,t}if(e.protocol!==`file:`){let e=TypeError(`The URL must be of scheme file`);throw e.code=`ERR_INVALID_URL_SCHEME`,e}return yc(e)}function yc(e){if(e.hostname!==``){let e=TypeError(`File URL host must be "localhost" or empty on darwin`);throw e.code=`ERR_INVALID_FILE_URL_HOST`,e}let t=e.pathname,n=-1;for(;++n<t.length;)if(t.codePointAt(n)===37&&t.codePointAt(n+1)===50){let e=t.codePointAt(n+2);if(e===70||e===102){let e=TypeError(`File URL path must not include encoded / characters`);throw e.code=`ERR_INVALID_FILE_URL_PATH`,e}}return decodeURIComponent(t)}var bc=[`history`,`path`,`basename`,`stem`,`extname`,`dirname`],xc=class{constructor(e){let t;t=e?_c(e)?{path:e}:typeof e==`string`||Tc(e)?{value:e}:e:{},this.cwd=`cwd`in t?``:hc.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let n=-1;for(;++n<bc.length;){let e=bc[n];e in t&&t[e]!==void 0&&t[e]!==null&&(this[e]=e===`history`?[...t[e]]:t[e])}let r;for(r in t)bc.includes(r)||(this[r]=t[r])}get basename(){return typeof this.path==`string`?sc.basename(this.path):void 0}set basename(e){Cc(e,`basename`),Sc(e,`basename`),this.path=sc.join(this.dirname||``,e)}get dirname(){return typeof this.path==`string`?sc.dirname(this.path):void 0}set dirname(e){wc(this.basename,`dirname`),this.path=sc.join(e||``,this.basename)}get extname(){return typeof this.path==`string`?sc.extname(this.path):void 0}set extname(e){if(Sc(e,`extname`),wc(this.dirname,`extname`),e){if(e.codePointAt(0)!==46)throw Error("`extname` must start with `.`");if(e.includes(`.`,1))throw Error("`extname` cannot contain multiple dots")}this.path=sc.join(this.dirname,this.stem+(e||``))}get path(){return this.history[this.history.length-1]}set path(e){_c(e)&&(e=vc(e)),Cc(e,`path`),this.path!==e&&this.history.push(e)}get stem(){return typeof this.path==`string`?sc.basename(this.path,this.extname):void 0}set stem(e){Cc(e,`stem`),Sc(e,`stem`),this.path=sc.join(this.dirname||``,e+(this.extname||``))}fail(e,t,n){let r=this.message(e,t,n);throw r.fatal=!0,r}info(e,t,n){let r=this.message(e,t,n);return r.fatal=void 0,r}message(e,t,n){let r=new lr(e,t,n);return this.path&&(r.name=this.path+`:`+r.name,r.file=this.path),r.fatal=!1,this.messages.push(r),r}toString(e){return this.value===void 0?``:typeof this.value==`string`?this.value:new TextDecoder(e||void 0).decode(this.value)}};function Sc(e,t){if(e&&e.includes(sc.sep))throw Error("`"+t+"` cannot be a path: did not expect `"+sc.sep+"`")}function Cc(e,t){if(!e)throw Error("`"+t+"` cannot be empty")}function wc(e,t){if(!e)throw Error("Setting `"+t+"` requires `path` to be set too")}function Tc(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var Ec=(function(e){let t=this.constructor.prototype,n=t[e],r=function(){return n.apply(r,arguments)};return Object.setPrototypeOf(r,t),r}),Dc=e(rc(),1),Oc={}.hasOwnProperty,kc=new class e extends Ec{constructor(){super(`copy`),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=ac()}copy(){let t=new e,n=-1;for(;++n<this.attachers.length;){let e=this.attachers[n];t.use(...e)}return t.data((0,Dc.default)(!0,{},this.namespace)),t}data(e,t){return typeof e==`string`?arguments.length===2?(Mc(`data`,this.frozen),this.namespace[e]=t,this):Oc.call(this.namespace,e)&&this.namespace[e]||void 0:e?(Mc(`data`,this.frozen),this.namespace=e,this):this.namespace}freeze(){if(this.frozen)return this;let e=this;for(;++this.freezeIndex<this.attachers.length;){let[t,...n]=this.attachers[this.freezeIndex];if(n[0]===!1)continue;n[0]===!0&&(n[0]=void 0);let r=t.call(e,...n);typeof r==`function`&&this.transformers.use(r)}return this.frozen=!0,this.freezeIndex=1/0,this}parse(e){this.freeze();let t=Fc(e),n=this.parser||this.Parser;return Ac(`parse`,n),n(String(t),t)}process(e,t){let n=this;return this.freeze(),Ac(`process`,this.parser||this.Parser),jc(`process`,this.compiler||this.Compiler),t?r(void 0,t):new Promise(r);function r(r,i){let a=Fc(e),o=n.parse(a);n.run(o,a,function(e,t,r){if(e||!t||!r)return s(e);let i=t,a=n.stringify(i,r);Lc(a)?r.value=a:r.result=a,s(e,r)});function s(e,n){e||!n?i(e):r?r(n):t(void 0,n)}}}processSync(e){let t=!1,n;return this.freeze(),Ac(`processSync`,this.parser||this.Parser),jc(`processSync`,this.compiler||this.Compiler),this.process(e,r),Pc(`processSync`,`process`,t),n;function r(e,r){t=!0,nc(e),n=r}}run(e,t,n){Nc(e),this.freeze();let r=this.transformers;return!n&&typeof t==`function`&&(n=t,t=void 0),n?i(void 0,n):new Promise(i);function i(i,a){let o=Fc(t);r.run(e,o,s);function s(t,r,o){let s=r||e;t?a(t):i?i(s):n(void 0,s,o)}}}runSync(e,t){let n=!1,r;return this.run(e,t,i),Pc(`runSync`,`run`,n),r;function i(e,t){nc(e),r=t,n=!0}}stringify(e,t){this.freeze();let n=Fc(t),r=this.compiler||this.Compiler;return jc(`stringify`,r),Nc(e),r(e,n)}use(e,...t){let n=this.attachers,r=this.namespace;if(Mc(`use`,this.frozen),e!=null)if(typeof e==`function`)s(e,t);else if(typeof e==`object`)Array.isArray(e)?o(e):a(e);else throw TypeError("Expected usable value, not `"+e+"`");return this;function i(e){if(typeof e==`function`)s(e,[]);else if(typeof e==`object`)if(Array.isArray(e)){let[t,...n]=e;s(t,n)}else a(e);else throw TypeError("Expected usable value, not `"+e+"`")}function a(e){if(!(`plugins`in e)&&!(`settings`in e))throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");o(e.plugins),e.settings&&(r.settings=(0,Dc.default)(!0,r.settings,e.settings))}function o(e){let t=-1;if(e!=null)if(Array.isArray(e))for(;++t<e.length;){let n=e[t];i(n)}else throw TypeError("Expected a list of plugins, not `"+e+"`")}function s(e,t){let r=-1,i=-1;for(;++r<n.length;)if(n[r][0]===e){i=r;break}if(i===-1)n.push([e,...t]);else if(t.length>0){let[r,...a]=t,o=n[i][1];ic(o)&&ic(r)&&(r=(0,Dc.default)(!0,o,r)),n[i]=[e,r,...a]}}}}().freeze();function Ac(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `parser`")}function jc(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `compiler`")}function Mc(e,t){if(t)throw Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function Nc(e){if(!ic(e)||typeof e.type!=`string`)throw TypeError("Expected node, got `"+e+"`")}function Pc(e,t,n){if(!n)throw Error("`"+e+"` finished async. Use `"+t+"` instead")}function Fc(e){return Ic(e)?e:new xc(e)}function Ic(e){return!!(e&&typeof e==`object`&&`message`in e&&`messages`in e)}function Lc(e){return typeof e==`string`||Rc(e)}function Rc(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var zc=[],Bc={allowDangerousHtml:!0},Vc=/^(https?|ircs?|mailto|xmpp)$/i,Hc=[{from:`astPlugins`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowDangerousHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowNode`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowElement`},{from:`allowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowedElements`},{from:`className`,id:`remove-classname`},{from:`disallowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`disallowedElements`},{from:`escapeHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`includeElementIndex`,id:`#remove-includeelementindex`},{from:`includeNodeIndex`,id:`change-includenodeindex-to-includeelementindex`},{from:`linkTarget`,id:`remove-linktarget`},{from:`plugins`,id:`change-plugins-to-remarkplugins`,to:`remarkPlugins`},{from:`rawSourcePos`,id:`#remove-rawsourcepos`},{from:`renderers`,id:`change-renderers-to-components`,to:`components`},{from:`source`,id:`change-source-to-children`,to:`children`},{from:`sourcePos`,id:`#remove-sourcepos`},{from:`transformImageUri`,id:`#add-urltransform`,to:`urlTransform`},{from:`transformLinkUri`,id:`#add-urltransform`,to:`urlTransform`}];function Uc(e){let t=Wc(e),n=Gc(e);return Kc(t.runSync(t.parse(n),n),e)}function Wc(e){let t=e.rehypePlugins||zc,n=e.remarkPlugins||zc,r=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...Bc}:Bc;return kc().use(zo).use(n).use(tc,r).use(t)}function Gc(e){let t=e.children||``,n=new xc;return typeof t==`string`?n.value=t:``+t,n}function Kc(e,t){let n=t.allowedElements,r=t.allowElement,i=t.components,a=t.disallowedElements,o=t.skipHtml,s=t.unwrapDisallowed,c=t.urlTransform||qc;for(let e of Hc)Object.hasOwn(t,e.from)&&``+e.from+(e.to?"use `"+e.to+"` instead":`remove it`)+e.id;return Gs(e,l),_r(e,{Fragment:N.Fragment,components:i,ignoreInvalidStyle:!0,jsx:N.jsx,jsxs:N.jsxs,passKeys:!0,passNode:!0});function l(e,t,i){if(e.type===`raw`&&i&&typeof t==`number`)return o?i.children.splice(t,1):i.children[t]={type:`text`,value:e.value},t;if(e.type===`element`){let t;for(t in zr)if(Object.hasOwn(zr,t)&&Object.hasOwn(e.properties,t)){let n=e.properties[t],r=zr[t];(r===null||r.includes(e.tagName))&&(e.properties[t]=c(String(n||``),t,e))}}if(e.type===`element`){let o=n?!n.includes(e.tagName):a?a.includes(e.tagName):!1;if(!o&&r&&typeof t==`number`&&(o=!r(e,t,i)),o&&i&&typeof t==`number`)return s&&e.children?i.children.splice(t,1,...e.children):i.children.splice(t,1),t}}}function qc(e){let t=e.indexOf(`:`),n=e.indexOf(`?`),r=e.indexOf(`#`),i=e.indexOf(`/`);return t===-1||i!==-1&&t>i||n!==-1&&t>n||r!==-1&&t>r||Vc.test(e.slice(0,t))?e:``}function Jc(e,t){let n=String(e),r=n.indexOf(t),i=r,a=0,o=0;if(typeof t!=`string`)throw TypeError(`Expected substring`);for(;r!==-1;)r===i?++a>o&&(o=a):a=1,i=r+t.length,r=n.indexOf(t,i);return o}function Yc(){return{enter:{mathFlow:e,mathFlowFenceMeta:t,mathText:a},exit:{mathFlow:i,mathFlowFence:r,mathFlowFenceMeta:n,mathFlowValue:s,mathText:o,mathTextData:s}};function e(e){this.enter({type:`math`,meta:null,value:``,data:{hName:`pre`,hChildren:[{type:`element`,tagName:`code`,properties:{className:[`language-math`,`math-display`]},children:[]}]}},e)}function t(){this.buffer()}function n(){let e=this.resume(),t=this.stack[this.stack.length-1];t.type,t.meta=e}function r(){this.data.mathFlowInside||(this.buffer(),this.data.mathFlowInside=!0)}function i(e){let t=this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,``),n=this.stack[this.stack.length-1];n.type,this.exit(e),n.value=t;let r=n.data.hChildren[0];r.type,r.tagName,r.children.push({type:`text`,value:t}),this.data.mathFlowInside=void 0}function a(e){this.enter({type:`inlineMath`,value:``,data:{hName:`code`,hProperties:{className:[`language-math`,`math-inline`]},hChildren:[]}},e),this.buffer()}function o(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.type,this.exit(e),n.value=t,n.data.hChildren.push({type:`text`,value:t})}function s(e){this.config.enter.data.call(this,e),this.config.exit.data.call(this,e)}}function Xc(e){let t=(e||{}).singleDollarTextMath;return t??=!0,r.peek=i,{unsafe:[{character:`\r`,inConstruct:`mathFlowMeta`},{character:`
`,inConstruct:`mathFlowMeta`},{character:`$`,after:t?void 0:`\\$`,inConstruct:`phrasing`},{character:`$`,inConstruct:`mathFlowMeta`},{atBreak:!0,character:`$`,after:`\\$`}],handlers:{math:n,inlineMath:r}};function n(e,t,n,r){let i=e.value||``,a=n.createTracker(r),o=`$`.repeat(Math.max(Jc(i,`$`)+1,2)),s=n.enter(`mathFlow`),c=a.move(o);if(e.meta){let t=n.enter(`mathFlowMeta`);c+=a.move(n.safe(e.meta,{after:`
`,before:c,encode:[`$`],...a.current()})),t()}return c+=a.move(`
`),i&&(c+=a.move(i+`
`)),c+=a.move(o),s(),c}function r(e,n,r){let i=e.value||``,a=1;for(t||a++;RegExp(`(^|[^$])`+`\\$`.repeat(a)+`([^$]|$)`).test(i);)a++;let o=`$`.repeat(a);/[^ \r\n]/.test(i)&&(/^[ \r\n]/.test(i)&&/[ \r\n]$/.test(i)||/^\$|\$$/.test(i))&&(i=` `+i+` `);let s=-1;for(;++s<r.unsafe.length;){let e=r.unsafe[s];if(!e.atBreak)continue;let t=r.compilePattern(e),n;for(;n=t.exec(i);){let e=n.index;i.codePointAt(e)===10&&i.codePointAt(e-1)===13&&e--,i=i.slice(0,e)+` `+i.slice(n.index+1)}}return o+i+o}function i(){return`$`}}var Zc={tokenize:$c,concrete:!0,name:`mathFlow`},Qc={tokenize:el,partial:!0};function $c(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){return e.enter(`mathFlow`),e.enter(`mathFlowFence`),e.enter(`mathFlowFenceSequence`),c(t)}function c(t){return t===36?(e.consume(t),o++,c):o<2?n(t):(e.exit(`mathFlowFenceSequence`),V(e,l,`whitespace`)(t))}function l(t){return t===null||z(t)?d(t):(e.enter(`mathFlowFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===null||z(t)?(e.exit(`chunkString`),e.exit(`mathFlowFenceMeta`),d(t)):t===36?n(t):(e.consume(t),u)}function d(n){return e.exit(`mathFlowFence`),r.interrupt?t(n):e.attempt(Qc,f,g)(n)}function f(t){return e.attempt({tokenize:_,partial:!0},g,p)(t)}function p(t){return(a?V(e,m,`linePrefix`,a+1):m)(t)}function m(t){return t===null?g(t):z(t)?e.attempt(Qc,f,g)(t):(e.enter(`mathFlowValue`),h(t))}function h(t){return t===null||z(t)?(e.exit(`mathFlowValue`),m(t)):(e.consume(t),h)}function g(n){return e.exit(`mathFlow`),t(n)}function _(e,t,n){let i=0;return V(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4);function a(t){return e.enter(`mathFlowFence`),e.enter(`mathFlowFenceSequence`),s(t)}function s(t){return t===36?(i++,e.consume(t),s):i<o?n(t):(e.exit(`mathFlowFenceSequence`),V(e,c,`whitespace`)(t))}function c(r){return r===null||z(r)?(e.exit(`mathFlowFence`),t(r)):n(r)}}}function el(e,t,n){let r=this;return i;function i(n){return n===null?t(n):(e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}function tl(e){let t=(e||{}).singleDollarTextMath;return t??=!0,{tokenize:n,resolve:nl,previous:rl,name:`mathText`};function n(e,n,r){let i=0,a,o;return s;function s(t){return e.enter(`mathText`),e.enter(`mathTextSequence`),c(t)}function c(n){return n===36?(e.consume(n),i++,c):i<2&&!t?r(n):(e.exit(`mathTextSequence`),l(n))}function l(t){return t===null?r(t):t===36?(o=e.enter(`mathTextSequence`),a=0,d(t)):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),l):z(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),l):(e.enter(`mathTextData`),u(t))}function u(t){return t===null||t===32||t===36||z(t)?(e.exit(`mathTextData`),l(t)):(e.consume(t),u)}function d(t){return t===36?(e.consume(t),a++,d):a===i?(e.exit(`mathTextSequence`),e.exit(`mathText`),n(t)):(o.type=`mathTextData`,u(t))}}}function nl(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`mathTextData`){e[t][1].type=`mathTextPadding`,e[n][1].type=`mathTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`mathTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function rl(e){return e!==36||this.events[this.events.length-1][1].type===`characterEscape`}function il(e){return{flow:{36:Zc},text:{36:tl(e)}}}var al={};function ol(e){let t=this,n=e||al,r=t.data(),i=r.micromarkExtensions||=[],a=r.fromMarkdownExtensions||=[],o=r.toMarkdownExtensions||=[];i.push(il(n)),a.push(Yc()),o.push(Xc(n))}var sl=/[#.]/g;function cl(e,t){let n=e||``,r={},i=0,a,o;for(;i<n.length;){sl.lastIndex=i;let e=sl.exec(n),t=n.slice(i,e?e.index:n.length);t&&(a?a===`#`?r.id=t:Array.isArray(r.className)?r.className.push(t):r.className=[t]:o=t,i+=t.length),e&&(a=e[0],i++)}return{type:`element`,tagName:o||t||`div`,properties:r,children:[]}}function ll(e,t,n){let r=n?hl(n):void 0;function i(n,i,...a){let o;if(n==null){o={type:`root`,children:[]};let e=i;a.unshift(e)}else{o=cl(n,t);let s=o.tagName.toLowerCase(),c=r?r.get(s):void 0;if(o.tagName=c||s,ul(i))a.unshift(i);else for(let[t,n]of Object.entries(i))dl(e,o.properties,t,n)}for(let e of a)fl(o.children,e);return o.type===`element`&&o.tagName===`template`&&(o.content={type:`root`,children:o.children},o.children=[]),o}return i}function ul(e){if(typeof e!=`object`||!e||Array.isArray(e))return!0;if(typeof e.type!=`string`)return!1;let t=e,n=Object.keys(e);for(let e of n){let n=t[e];if(n&&typeof n==`object`){if(!Array.isArray(n))return!0;let e=n;for(let t of e)if(typeof t!=`number`&&typeof t!=`string`)return!0}}return!!(`children`in e&&Array.isArray(e.children))}function dl(e,t,n,r){let i=Wn(e,n),a;if(r!=null){if(typeof r==`number`){if(Number.isNaN(r))return;a=r}else a=typeof r==`boolean`?r:typeof r==`string`?i.spaceSeparated?Yn(r):i.commaSeparated?ln(r):i.commaOrSpaceSeparated?Yn(ln(r).join(` `)):pl(i,i.property,r):Array.isArray(r)?[...r]:i.property===`style`?ml(r):String(r);if(Array.isArray(a)){let e=[];for(let t of a)e.push(pl(i,i.property,t));a=e}i.property===`className`&&Array.isArray(t.className)&&(a=t.className.concat(a)),t[i.property]=a}}function fl(e,t){if(t!=null)if(typeof t==`number`||typeof t==`string`)e.push({type:`text`,value:String(t)});else if(Array.isArray(t))for(let n of t)fl(e,n);else if(typeof t==`object`&&`type`in t)t.type===`root`?fl(e,t.children):e.push(t);else throw Error("Expected node, nodes, or string, got `"+t+"`")}function pl(e,t,n){if(typeof n==`string`){if(e.number&&n&&!Number.isNaN(Number(n)))return Number(n);if((e.boolean||e.overloadedBoolean)&&(n===``||bn(n)===bn(t)))return!0}return n}function ml(e){let t=[];for(let[n,r]of Object.entries(e))t.push([n,r].join(`: `));return t.join(`; `)}function hl(e){let t=new Map;for(let n of e)t.set(n.toLowerCase(),n);return t}var gl=`altGlyph.altGlyphDef.altGlyphItem.animateColor.animateMotion.animateTransform.clipPath.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feDropShadow.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.foreignObject.glyphRef.linearGradient.radialGradient.solidColor.textArea.textPath`.split(`.`),_l=ll(qn,`div`),vl=ll(Jn,`g`,gl),yl={html:`http://www.w3.org/1999/xhtml`,mathml:`http://www.w3.org/1998/Math/MathML`,svg:`http://www.w3.org/2000/svg`,xlink:`http://www.w3.org/1999/xlink`,xml:`http://www.w3.org/XML/1998/namespace`,xmlns:`http://www.w3.org/2000/xmlns/`};function bl(e,t){return xl(e,t||{})||{type:`root`,children:[]}}function xl(e,t){let n=Sl(e,t);return n&&t.afterTransform&&t.afterTransform(e,n),n}function Sl(e,t){switch(e.nodeType){case 1:return Dl(e,t);case 3:return Tl(e);case 8:return El(e);case 9:return Cl(e,t);case 10:return wl();case 11:return Cl(e,t);default:return}}function Cl(e,t){return{type:`root`,children:Ol(e,t)}}function wl(){return{type:`doctype`}}function Tl(e){return{type:`text`,value:e.nodeValue||``}}function El(e){return{type:`comment`,value:e.nodeValue||``}}function Dl(e,t){let n=e.namespaceURI,r=n===yl.svg?vl:_l,i=n===yl.html?e.tagName.toLowerCase():e.tagName,a=n===yl.html&&i===`template`?e.content:e,o=e.getAttributeNames(),s={},c=-1;for(;++c<o.length;)s[o[c]]=e.getAttribute(o[c])||``;return r(i,s,Ol(a,t))}function Ol(e,t){let n=e.childNodes,r=[],i=-1;for(;++i<n.length;){let e=xl(n[i],t);e!==void 0&&r.push(e)}return r}var kl=new DOMParser;function Al(e,t){return bl(t?.fragment?jl(e):kl.parseFromString(e,`text/html`))}function jl(e){let t=document.createElement(`template`);return t.innerHTML=e,t.content}var Ml=(function(e,t,n){let r=Ns(n);if(!e||!e.type||!e.children)throw Error(`Expected parent node`);if(typeof t==`number`){if(t<0||t===1/0)throw Error(`Expected positive finite number as index`)}else if(t=e.children.indexOf(t),t<0)throw Error(`Expected child node or index`);for(;++t<e.children.length;)if(r(e.children[t],t,e))return e.children[t]}),Nl=(function(e){if(e==null)return Ll;if(typeof e==`string`)return Fl(e);if(typeof e==`object`)return Pl(e);if(typeof e==`function`)return Il(e);throw Error("Expected function, string, or array as `test`")});function Pl(e){let t=[],n=-1;for(;++n<e.length;)t[n]=Nl(e[n]);return Il(r);function r(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1}}function Fl(e){return Il(t);function t(t){return t.tagName===e}}function Il(e){return t;function t(t,n,r){return!!(Rl(t)&&e.call(this,t,typeof n==`number`?n:void 0,r||void 0))}}function Ll(e){return!!(e&&typeof e==`object`&&`type`in e&&e.type===`element`&&`tagName`in e&&typeof e.tagName==`string`)}function Rl(e){return typeof e==`object`&&!!e&&`type`in e&&`tagName`in e}var zl=/\n/g,Bl=/[\t ]+/g,Vl=Nl(`br`),Hl=Nl(tu),Ul=Nl(`p`),Wl=Nl(`tr`),Gl=Nl([`datalist`,`head`,`noembed`,`noframes`,`noscript`,`rp`,`script`,`style`,`template`,`title`,eu,nu]),Kl=Nl(`address.article.aside.blockquote.body.caption.center.dd.dialog.dir.dl.dt.div.figure.figcaption.footer.form,.h1.h2.h3.h4.h5.h6.header.hgroup.hr.html.legend.li.listing.main.menu.nav.ol.p.plaintext.pre.section.ul.xmp`.split(`.`));function ql(e,t){let n=t||{},r=`children`in e?e.children:[],i=Kl(e),a=$l(e,{whitespace:n.whitespace||`normal`,breakBefore:!1,breakAfter:!1}),o=[];(e.type===`text`||e.type===`comment`)&&o.push(...Xl(e,{whitespace:a,breakBefore:!0,breakAfter:!0}));let s=-1;for(;++s<r.length;)o.push(...Jl(r[s],e,{whitespace:a,breakBefore:s?void 0:i,breakAfter:s<r.length-1?Vl(r[s+1]):i}));let c=[],l;for(s=-1;++s<o.length;){let e=o[s];typeof e==`number`?l!==void 0&&e>l&&(l=e):e&&(l!==void 0&&l>-1&&c.push(`
`.repeat(l)||` `),l=-1,c.push(e))}return c.join(``)}function Jl(e,t,n){return e.type===`element`?Yl(e,t,n):e.type===`text`?n.whitespace===`normal`?Xl(e,n):Zl(e):[]}function Yl(e,t,n){let r=$l(e,n),i=e.children||[],a=-1,o=[];if(Gl(e))return o;let s,c;for(Vl(e)||Wl(e)&&Ml(t,e,Wl)?c=`
`:Ul(e)?(s=2,c=2):Kl(e)&&(s=1,c=1);++a<i.length;)o=o.concat(Jl(i[a],e,{whitespace:r,breakBefore:a?void 0:s,breakAfter:a<i.length-1?Vl(i[a+1]):c}));return Hl(e)&&Ml(t,e,Hl)&&o.push(`	`),s&&o.unshift(s),c&&o.push(c),o}function Xl(e,t){let n=String(e.value),r=[],i=[],a=0;for(;a<=n.length;){zl.lastIndex=a;let e=zl.exec(n),i=e&&`index`in e?e.index:n.length;r.push(Ql(n.slice(a,i).replace(/[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g,``),a===0?t.breakBefore:!0,i===n.length?t.breakAfter:!0)),a=i+1}let o=-1,s;for(;++o<r.length;)r[o].charCodeAt(r[o].length-1)===8203||o<r.length-1&&r[o+1].charCodeAt(0)===8203?(i.push(r[o]),s=void 0):r[o]?(typeof s==`number`&&i.push(s),i.push(r[o]),s=0):(o===0||o===r.length-1)&&i.push(0);return i}function Zl(e){return[String(e.value)]}function Ql(e,t,n){let r=[],i=0,a;for(;i<e.length;){Bl.lastIndex=i;let n=Bl.exec(e);a=n?n.index:e.length,!i&&!a&&n&&!t&&r.push(``),i!==a&&r.push(e.slice(i,a)),i=n?a+n[0].length:a}return i!==a&&!n&&r.push(``),r.join(` `)}function $l(e,t){if(e.type===`element`){let n=e.properties||{};switch(e.tagName){case`listing`:case`plaintext`:case`xmp`:return`pre`;case`nobr`:return`nowrap`;case`pre`:return n.wrap?`pre-wrap`:`pre`;case`td`:case`th`:return n.noWrap?`nowrap`:t.whitespace;case`textarea`:return`pre-wrap`;default:}}return t.whitespace}function eu(e){return!!(e.properties||{}).hidden}function tu(e){return e.tagName===`td`||e.tagName===`th`}function nu(e){return e.tagName===`dialog`&&!(e.properties||{}).open}var ru={},iu=[];function au(e){let t=e||ru;return function(e,n){Us(e,`element`,function(e,r){let i=Array.isArray(e.properties.className)?e.properties.className:iu,a=i.includes(`language-math`),o=i.includes(`math-display`),s=i.includes(`math-inline`),c=o;if(!a&&!o&&!s)return;let l=r[r.length-1],u=e;if(e.tagName===`code`&&a&&l&&l.type===`element`&&l.tagName===`pre`&&(u=l,l=r[r.length-2],c=!0),!l)return;let d=ql(u,{whitespace:`pre`}),f;try{f=A.renderToString(d,{...t,displayMode:c,throwOnError:!0})}catch(i){let a=i,o=a.name.toLowerCase();n.message(`Could not render math with KaTeX`,{ancestors:[...r,e],cause:a,place:e.position,ruleId:o,source:`rehype-katex`});try{f=A.renderToString(d,{...t,displayMode:c,strict:`ignore`,throwOnError:!1})}catch{f=[{type:`element`,tagName:`span`,properties:{className:[`katex-error`],style:`color:`+(t.errorColor||`#cc0000`),title:String(i)},children:[{type:`text`,value:d}]}]}}typeof f==`string`&&(f=Al(f,{fragment:!0}).children);let p=l.children.indexOf(u);return l.children.splice(p,1,...f),Hs})}}function ou(e){let t=String(e),n=[];return{toOffset:i,toPoint:r};function r(e){if(typeof e==`number`&&e>-1&&e<=t.length){let r=0;for(;;){let i=n[r];if(i===void 0){let e=su(t,n[r-1]);i=e===-1?t.length+1:e+1,n[r]=i}if(i>e)return{line:r+1,column:e-(r>0?n[r-1]:0)+1,offset:e};r++}}}function i(e){if(e&&typeof e.line==`number`&&typeof e.column==`number`&&!Number.isNaN(e.line)&&!Number.isNaN(e.column)){for(;n.length<e.line;){let e=n[n.length-1],r=su(t,e),i=r===-1?t.length+1:r+1;if(e===i)break;n.push(i)}let r=(e.line>1?n[e.line-2]:0)+e.column-1;if(r<n[e.line-1])return r}}}function su(e,t){let n=e.indexOf(`\r`,t),r=e.indexOf(`
`,t);return r===-1?n:n===-1||n+1===r?r:n<r?n:r}var cu={}.hasOwnProperty,lu=Object.prototype;function uu(e,t){let n=t||{};return du({file:n.file||void 0,location:!1,schema:n.space===`svg`?Jn:qn,verbose:n.verbose||!1},e)}function du(e,t){let n;switch(t.nodeName){case`#comment`:{let r=t;return n={type:`comment`,value:r.data},mu(e,r,n),n}case`#document`:case`#document-fragment`:{let r=t,i=`mode`in r?r.mode===`quirks`||r.mode===`limited-quirks`:!1;if(n={type:`root`,children:fu(e,t.childNodes),data:{quirksMode:i}},e.file&&e.location){let t=String(e.file),r=ou(t),i=r.toPoint(0),a=r.toPoint(t.length);n.position={start:i,end:a}}return n}case`#documentType`:{let r=t;return n={type:`doctype`},mu(e,r,n),n}case`#text`:{let r=t;return n={type:`text`,value:r.value},mu(e,r,n),n}default:return n=pu(e,t),n}}function fu(e,t){let n=-1,r=[];for(;++n<t.length;){let i=du(e,t[n]);r.push(i)}return r}function pu(e,t){let n=e.schema;e.schema=t.namespaceURI===yl.svg?Jn:qn;let r=-1,i={};for(;++r<t.attrs.length;){let e=t.attrs[r],n=(e.prefix?e.prefix+`:`:``)+e.name;cu.call(lu,n)||(i[n]=e.value)}let a=(e.schema.space===`svg`?vl:_l)(t.tagName,i,fu(e,t.childNodes));if(mu(e,t,a),a.tagName===`template`){let n=t,r=n.sourceCodeLocation,i=r&&r.startTag&&gu(r.startTag),o=r&&r.endTag&&gu(r.endTag),s=du(e,n.content);i&&o&&e.file&&(s.position={start:i.end,end:o.start}),a.content=s}return e.schema=n,a}function mu(e,t,n){if(`sourceCodeLocation`in t&&t.sourceCodeLocation&&e.file){let r=hu(e,n,t.sourceCodeLocation);r&&(e.location=!0,n.position=r)}}function hu(e,t,n){let r=gu(n);if(t.type===`element`){let i=t.children[t.children.length-1];if(r&&!n.endTag&&i&&i.position&&i.position.end&&(r.end=Object.assign({},i.position.end)),e.verbose){let r={},i;if(n.attrs)for(i in n.attrs)cu.call(n.attrs,i)&&(r[Wn(e.schema,i).property]=gu(n.attrs[i]));n.startTag;let a=gu(n.startTag),o=n.endTag?gu(n.endTag):void 0,s={opening:a};o&&(s.closing=o),s.properties=r,t.data={position:s}}}return r}function gu(e){let t=_u({line:e.startLine,column:e.startCol,offset:e.startOffset}),n=_u({line:e.endLine,column:e.endCol,offset:e.endOffset});return t||n?{start:t,end:n}:void 0}function _u(e){return e.line&&e.column?e:void 0}var vu={}.hasOwnProperty;function yu(e,t){let n=t||{};function r(t,...n){let i=r.invalid,a=r.handlers;if(t&&vu.call(t,e)){let n=String(t[e]);i=vu.call(a,n)?a[n]:r.unknown}if(i)return i.call(this,t,...n)}return r.handlers=n.handlers||{},r.invalid=n.invalid,r.unknown=n.unknown,r}var bu={},xu={}.hasOwnProperty,Su=yu(`type`,{handlers:{root:wu,element:ku,text:Du,comment:Ou,doctype:Eu}});function Cu(e,t){let n=(t||bu).space;return Su(e,n===`svg`?Jn:qn)}function wu(e,t){let n={nodeName:`#document`,mode:(e.data||{}).quirksMode?`quirks`:`no-quirks`,childNodes:[]};return n.childNodes=ju(e.children,n,t),Mu(e,n),n}function Tu(e,t){let n={nodeName:`#document-fragment`,childNodes:[]};return n.childNodes=ju(e.children,n,t),Mu(e,n),n}function Eu(e){let t={nodeName:`#documentType`,name:`html`,publicId:``,systemId:``,parentNode:null};return Mu(e,t),t}function Du(e){let t={nodeName:`#text`,value:e.value,parentNode:null};return Mu(e,t),t}function Ou(e){let t={nodeName:`#comment`,data:e.value,parentNode:null};return Mu(e,t),t}function ku(e,t){let n=t,r=n;e.type===`element`&&e.tagName.toLowerCase()===`svg`&&n.space===`html`&&(r=Jn);let i=[],a;if(e.properties){for(a in e.properties)if(a!==`children`&&xu.call(e.properties,a)){let t=Au(r,a,e.properties[a]);t&&i.push(t)}}let o=r.space,s={nodeName:e.tagName,tagName:e.tagName,attrs:i,namespaceURI:yl[o],childNodes:[],parentNode:null};return s.childNodes=ju(e.children,s,r),Mu(e,s),e.tagName===`template`&&e.content&&(s.content=Tu(e.content,r)),s}function Au(e,t,n){let r=Wn(e,t);if(n===!1||n==null||typeof n==`number`&&Number.isNaN(n)||!n&&r.boolean)return;Array.isArray(n)&&(n=r.commaSeparated?un(n):Xn(n));let i={name:r.attribute,value:n===!0?``:String(n)};if(r.space&&r.space!==`html`&&r.space!==`svg`){let e=i.name.indexOf(`:`);e<0?i.prefix=``:(i.name=i.name.slice(e+1),i.prefix=r.attribute.slice(0,e)),i.namespace=yl[r.space]}return i}function ju(e,t,n){let r=-1,i=[];if(e)for(;++r<e.length;){let a=Su(e[r],n);a.parentNode=t,i.push(a)}return i}function Mu(e,t){let n=e.position;n&&n.start&&n.end&&(n.start.offset,n.end.offset,t.sourceCodeLocation={startLine:n.start.line,startCol:n.start.column,startOffset:n.start.offset,endLine:n.end.line,endCol:n.end.column,endOffset:n.end.offset})}var Nu=[`area`,`base`,`basefont`,`bgsound`,`br`,`col`,`command`,`embed`,`frame`,`hr`,`image`,`img`,`input`,`keygen`,`link`,`meta`,`param`,`source`,`track`,`wbr`],Pu=new Set([65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111]),H;(function(e){e[e.EOF=-1]=`EOF`,e[e.NULL=0]=`NULL`,e[e.TABULATION=9]=`TABULATION`,e[e.CARRIAGE_RETURN=13]=`CARRIAGE_RETURN`,e[e.LINE_FEED=10]=`LINE_FEED`,e[e.FORM_FEED=12]=`FORM_FEED`,e[e.SPACE=32]=`SPACE`,e[e.EXCLAMATION_MARK=33]=`EXCLAMATION_MARK`,e[e.QUOTATION_MARK=34]=`QUOTATION_MARK`,e[e.AMPERSAND=38]=`AMPERSAND`,e[e.APOSTROPHE=39]=`APOSTROPHE`,e[e.HYPHEN_MINUS=45]=`HYPHEN_MINUS`,e[e.SOLIDUS=47]=`SOLIDUS`,e[e.DIGIT_0=48]=`DIGIT_0`,e[e.DIGIT_9=57]=`DIGIT_9`,e[e.SEMICOLON=59]=`SEMICOLON`,e[e.LESS_THAN_SIGN=60]=`LESS_THAN_SIGN`,e[e.EQUALS_SIGN=61]=`EQUALS_SIGN`,e[e.GREATER_THAN_SIGN=62]=`GREATER_THAN_SIGN`,e[e.QUESTION_MARK=63]=`QUESTION_MARK`,e[e.LATIN_CAPITAL_A=65]=`LATIN_CAPITAL_A`,e[e.LATIN_CAPITAL_Z=90]=`LATIN_CAPITAL_Z`,e[e.RIGHT_SQUARE_BRACKET=93]=`RIGHT_SQUARE_BRACKET`,e[e.GRAVE_ACCENT=96]=`GRAVE_ACCENT`,e[e.LATIN_SMALL_A=97]=`LATIN_SMALL_A`,e[e.LATIN_SMALL_Z=122]=`LATIN_SMALL_Z`})(H||={});var Fu={DASH_DASH:`--`,CDATA_START:`[CDATA[`,DOCTYPE:`doctype`,SCRIPT:`script`,PUBLIC:`public`,SYSTEM:`system`};function Iu(e){return e>=55296&&e<=57343}function Lu(e){return e>=56320&&e<=57343}function Ru(e,t){return(e-55296)*1024+9216+t}function zu(e){return e!==32&&e!==10&&e!==13&&e!==9&&e!==12&&e>=1&&e<=31||e>=127&&e<=159}function Bu(e){return e>=64976&&e<=65007||Pu.has(e)}var U;(function(e){e.controlCharacterInInputStream=`control-character-in-input-stream`,e.noncharacterInInputStream=`noncharacter-in-input-stream`,e.surrogateInInputStream=`surrogate-in-input-stream`,e.nonVoidHtmlElementStartTagWithTrailingSolidus=`non-void-html-element-start-tag-with-trailing-solidus`,e.endTagWithAttributes=`end-tag-with-attributes`,e.endTagWithTrailingSolidus=`end-tag-with-trailing-solidus`,e.unexpectedSolidusInTag=`unexpected-solidus-in-tag`,e.unexpectedNullCharacter=`unexpected-null-character`,e.unexpectedQuestionMarkInsteadOfTagName=`unexpected-question-mark-instead-of-tag-name`,e.invalidFirstCharacterOfTagName=`invalid-first-character-of-tag-name`,e.unexpectedEqualsSignBeforeAttributeName=`unexpected-equals-sign-before-attribute-name`,e.missingEndTagName=`missing-end-tag-name`,e.unexpectedCharacterInAttributeName=`unexpected-character-in-attribute-name`,e.unknownNamedCharacterReference=`unknown-named-character-reference`,e.missingSemicolonAfterCharacterReference=`missing-semicolon-after-character-reference`,e.unexpectedCharacterAfterDoctypeSystemIdentifier=`unexpected-character-after-doctype-system-identifier`,e.unexpectedCharacterInUnquotedAttributeValue=`unexpected-character-in-unquoted-attribute-value`,e.eofBeforeTagName=`eof-before-tag-name`,e.eofInTag=`eof-in-tag`,e.missingAttributeValue=`missing-attribute-value`,e.missingWhitespaceBetweenAttributes=`missing-whitespace-between-attributes`,e.missingWhitespaceAfterDoctypePublicKeyword=`missing-whitespace-after-doctype-public-keyword`,e.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers=`missing-whitespace-between-doctype-public-and-system-identifiers`,e.missingWhitespaceAfterDoctypeSystemKeyword=`missing-whitespace-after-doctype-system-keyword`,e.missingQuoteBeforeDoctypePublicIdentifier=`missing-quote-before-doctype-public-identifier`,e.missingQuoteBeforeDoctypeSystemIdentifier=`missing-quote-before-doctype-system-identifier`,e.missingDoctypePublicIdentifier=`missing-doctype-public-identifier`,e.missingDoctypeSystemIdentifier=`missing-doctype-system-identifier`,e.abruptDoctypePublicIdentifier=`abrupt-doctype-public-identifier`,e.abruptDoctypeSystemIdentifier=`abrupt-doctype-system-identifier`,e.cdataInHtmlContent=`cdata-in-html-content`,e.incorrectlyOpenedComment=`incorrectly-opened-comment`,e.eofInScriptHtmlCommentLikeText=`eof-in-script-html-comment-like-text`,e.eofInDoctype=`eof-in-doctype`,e.nestedComment=`nested-comment`,e.abruptClosingOfEmptyComment=`abrupt-closing-of-empty-comment`,e.eofInComment=`eof-in-comment`,e.incorrectlyClosedComment=`incorrectly-closed-comment`,e.eofInCdata=`eof-in-cdata`,e.absenceOfDigitsInNumericCharacterReference=`absence-of-digits-in-numeric-character-reference`,e.nullCharacterReference=`null-character-reference`,e.surrogateCharacterReference=`surrogate-character-reference`,e.characterReferenceOutsideUnicodeRange=`character-reference-outside-unicode-range`,e.controlCharacterReference=`control-character-reference`,e.noncharacterCharacterReference=`noncharacter-character-reference`,e.missingWhitespaceBeforeDoctypeName=`missing-whitespace-before-doctype-name`,e.missingDoctypeName=`missing-doctype-name`,e.invalidCharacterSequenceAfterDoctypeName=`invalid-character-sequence-after-doctype-name`,e.duplicateAttribute=`duplicate-attribute`,e.nonConformingDoctype=`non-conforming-doctype`,e.missingDoctype=`missing-doctype`,e.misplacedDoctype=`misplaced-doctype`,e.endTagWithoutMatchingOpenElement=`end-tag-without-matching-open-element`,e.closingOfElementWithOpenChildElements=`closing-of-element-with-open-child-elements`,e.disallowedContentInNoscriptInHead=`disallowed-content-in-noscript-in-head`,e.openElementsLeftAfterEof=`open-elements-left-after-eof`,e.abandonedHeadElementChild=`abandoned-head-element-child`,e.misplacedStartTagForHeadElement=`misplaced-start-tag-for-head-element`,e.nestedNoscriptInHead=`nested-noscript-in-head`,e.eofInElementThatCanContainOnlyText=`eof-in-element-that-can-contain-only-text`})(U||={});var Vu=65536,Hu=class{constructor(e){this.handler=e,this.html=``,this.pos=-1,this.lastGapPos=-2,this.gapStack=[],this.skipNextNewLine=!1,this.lastChunkWritten=!1,this.endOfChunkHit=!1,this.bufferWaterline=Vu,this.isEol=!1,this.lineStartPos=0,this.droppedBufferSize=0,this.line=1,this.lastErrOffset=-1}get col(){return this.pos-this.lineStartPos+Number(this.lastGapPos!==this.pos)}get offset(){return this.droppedBufferSize+this.pos}getError(e,t){let{line:n,col:r,offset:i}=this,a=r+t,o=i+t;return{code:e,startLine:n,endLine:n,startCol:a,endCol:a,startOffset:o,endOffset:o}}_err(e){this.handler.onParseError&&this.lastErrOffset!==this.offset&&(this.lastErrOffset=this.offset,this.handler.onParseError(this.getError(e,0)))}_addGap(){this.gapStack.push(this.lastGapPos),this.lastGapPos=this.pos}_processSurrogate(e){if(this.pos!==this.html.length-1){let t=this.html.charCodeAt(this.pos+1);if(Lu(t))return this.pos++,this._addGap(),Ru(e,t)}else if(!this.lastChunkWritten)return this.endOfChunkHit=!0,H.EOF;return this._err(U.surrogateInInputStream),e}willDropParsedChunk(){return this.pos>this.bufferWaterline}dropParsedChunk(){this.willDropParsedChunk()&&(this.html=this.html.substring(this.pos),this.lineStartPos-=this.pos,this.droppedBufferSize+=this.pos,this.pos=0,this.lastGapPos=-2,this.gapStack.length=0)}write(e,t){this.html.length>0?this.html+=e:this.html=e,this.endOfChunkHit=!1,this.lastChunkWritten=t}insertHtmlAtCurrentPos(e){this.html=this.html.substring(0,this.pos+1)+e+this.html.substring(this.pos+1),this.endOfChunkHit=!1}startsWith(e,t){if(this.pos+e.length>this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,!1;if(t)return this.html.startsWith(e,this.pos);for(let t=0;t<e.length;t++)if((this.html.charCodeAt(this.pos+t)|32)!==e.charCodeAt(t))return!1;return!0}peek(e){let t=this.pos+e;if(t>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,H.EOF;let n=this.html.charCodeAt(t);return n===H.CARRIAGE_RETURN?H.LINE_FEED:n}advance(){if(this.pos++,this.isEol&&(this.isEol=!1,this.line++,this.lineStartPos=this.pos),this.pos>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,H.EOF;let e=this.html.charCodeAt(this.pos);return e===H.CARRIAGE_RETURN?(this.isEol=!0,this.skipNextNewLine=!0,H.LINE_FEED):e===H.LINE_FEED&&(this.isEol=!0,this.skipNextNewLine)?(this.line--,this.skipNextNewLine=!1,this._addGap(),this.advance()):(this.skipNextNewLine=!1,Iu(e)&&(e=this._processSurrogate(e)),this.handler.onParseError===null||e>31&&e<127||e===H.LINE_FEED||e===H.CARRIAGE_RETURN||e>159&&e<64976||this._checkForProblematicCharacters(e),e)}_checkForProblematicCharacters(e){zu(e)?this._err(U.controlCharacterInInputStream):Bu(e)&&this._err(U.noncharacterInInputStream)}retreat(e){for(this.pos-=e;this.pos<this.lastGapPos;)this.lastGapPos=this.gapStack.pop(),this.pos--;this.isEol=!1}},W;(function(e){e[e.CHARACTER=0]=`CHARACTER`,e[e.NULL_CHARACTER=1]=`NULL_CHARACTER`,e[e.WHITESPACE_CHARACTER=2]=`WHITESPACE_CHARACTER`,e[e.START_TAG=3]=`START_TAG`,e[e.END_TAG=4]=`END_TAG`,e[e.COMMENT=5]=`COMMENT`,e[e.DOCTYPE=6]=`DOCTYPE`,e[e.EOF=7]=`EOF`,e[e.HIBERNATION=8]=`HIBERNATION`})(W||={});function Uu(e,t){for(let n=e.attrs.length-1;n>=0;n--)if(e.attrs[n].name===t)return e.attrs[n].value;return null}var Wu=new Uint16Array(`ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌`.split(``).map(e=>e.charCodeAt(0))),Gu=new Map([[0,65533],[128,8364],[130,8218],[131,402],[132,8222],[133,8230],[134,8224],[135,8225],[136,710],[137,8240],[138,352],[139,8249],[140,338],[142,381],[145,8216],[146,8217],[147,8220],[148,8221],[149,8226],[150,8211],[151,8212],[152,732],[153,8482],[154,353],[155,8250],[156,339],[158,382],[159,376]]);String.fromCodePoint;function Ku(e){return e>=55296&&e<=57343||e>1114111?65533:Gu.get(e)??e}var G;(function(e){e[e.NUM=35]=`NUM`,e[e.SEMI=59]=`SEMI`,e[e.EQUALS=61]=`EQUALS`,e[e.ZERO=48]=`ZERO`,e[e.NINE=57]=`NINE`,e[e.LOWER_A=97]=`LOWER_A`,e[e.LOWER_F=102]=`LOWER_F`,e[e.LOWER_X=120]=`LOWER_X`,e[e.LOWER_Z=122]=`LOWER_Z`,e[e.UPPER_A=65]=`UPPER_A`,e[e.UPPER_F=70]=`UPPER_F`,e[e.UPPER_Z=90]=`UPPER_Z`})(G||={});var qu=32,Ju;(function(e){e[e.VALUE_LENGTH=49152]=`VALUE_LENGTH`,e[e.BRANCH_LENGTH=16256]=`BRANCH_LENGTH`,e[e.JUMP_TABLE=127]=`JUMP_TABLE`})(Ju||={});function Yu(e){return e>=G.ZERO&&e<=G.NINE}function Xu(e){return e>=G.UPPER_A&&e<=G.UPPER_F||e>=G.LOWER_A&&e<=G.LOWER_F}function Zu(e){return e>=G.UPPER_A&&e<=G.UPPER_Z||e>=G.LOWER_A&&e<=G.LOWER_Z||Yu(e)}function Qu(e){return e===G.EQUALS||Zu(e)}var K;(function(e){e[e.EntityStart=0]=`EntityStart`,e[e.NumericStart=1]=`NumericStart`,e[e.NumericDecimal=2]=`NumericDecimal`,e[e.NumericHex=3]=`NumericHex`,e[e.NamedEntity=4]=`NamedEntity`})(K||={});var $u;(function(e){e[e.Legacy=0]=`Legacy`,e[e.Strict=1]=`Strict`,e[e.Attribute=2]=`Attribute`})($u||={});var ed=class{constructor(e,t,n){this.decodeTree=e,this.emitCodePoint=t,this.errors=n,this.state=K.EntityStart,this.consumed=1,this.result=0,this.treeIndex=0,this.excess=1,this.decodeMode=$u.Strict}startEntity(e){this.decodeMode=e,this.state=K.EntityStart,this.result=0,this.treeIndex=0,this.excess=1,this.consumed=1}write(e,t){switch(this.state){case K.EntityStart:return e.charCodeAt(t)===G.NUM?(this.state=K.NumericStart,this.consumed+=1,this.stateNumericStart(e,t+1)):(this.state=K.NamedEntity,this.stateNamedEntity(e,t));case K.NumericStart:return this.stateNumericStart(e,t);case K.NumericDecimal:return this.stateNumericDecimal(e,t);case K.NumericHex:return this.stateNumericHex(e,t);case K.NamedEntity:return this.stateNamedEntity(e,t)}}stateNumericStart(e,t){return t>=e.length?-1:(e.charCodeAt(t)|qu)===G.LOWER_X?(this.state=K.NumericHex,this.consumed+=1,this.stateNumericHex(e,t+1)):(this.state=K.NumericDecimal,this.stateNumericDecimal(e,t))}addToNumericResult(e,t,n,r){if(t!==n){let i=n-t;this.result=this.result*r**+i+Number.parseInt(e.substr(t,i),r),this.consumed+=i}}stateNumericHex(e,t){let n=t;for(;t<e.length;){let r=e.charCodeAt(t);if(Yu(r)||Xu(r))t+=1;else return this.addToNumericResult(e,n,t,16),this.emitNumericEntity(r,3)}return this.addToNumericResult(e,n,t,16),-1}stateNumericDecimal(e,t){let n=t;for(;t<e.length;){let r=e.charCodeAt(t);if(Yu(r))t+=1;else return this.addToNumericResult(e,n,t,10),this.emitNumericEntity(r,2)}return this.addToNumericResult(e,n,t,10),-1}emitNumericEntity(e,t){var n;if(this.consumed<=t)return(n=this.errors)==null||n.absenceOfDigitsInNumericCharacterReference(this.consumed),0;if(e===G.SEMI)this.consumed+=1;else if(this.decodeMode===$u.Strict)return 0;return this.emitCodePoint(Ku(this.result),this.consumed),this.errors&&(e!==G.SEMI&&this.errors.missingSemicolonAfterCharacterReference(),this.errors.validateNumericCharacterReference(this.result)),this.consumed}stateNamedEntity(e,t){let{decodeTree:n}=this,r=n[this.treeIndex],i=(r&Ju.VALUE_LENGTH)>>14;for(;t<e.length;t++,this.excess++){let a=e.charCodeAt(t);if(this.treeIndex=td(n,r,this.treeIndex+Math.max(1,i),a),this.treeIndex<0)return this.result===0||this.decodeMode===$u.Attribute&&(i===0||Qu(a))?0:this.emitNotTerminatedNamedEntity();if(r=n[this.treeIndex],i=(r&Ju.VALUE_LENGTH)>>14,i!==0){if(a===G.SEMI)return this.emitNamedEntityData(this.treeIndex,i,this.consumed+this.excess);this.decodeMode!==$u.Strict&&(this.result=this.treeIndex,this.consumed+=this.excess,this.excess=0)}}return-1}emitNotTerminatedNamedEntity(){var e;let{result:t,decodeTree:n}=this,r=(n[t]&Ju.VALUE_LENGTH)>>14;return this.emitNamedEntityData(t,r,this.consumed),(e=this.errors)==null||e.missingSemicolonAfterCharacterReference(),this.consumed}emitNamedEntityData(e,t,n){let{decodeTree:r}=this;return this.emitCodePoint(t===1?r[e]&~Ju.VALUE_LENGTH:r[e+1],n),t===3&&this.emitCodePoint(r[e+2],n),n}end(){var e;switch(this.state){case K.NamedEntity:return this.result!==0&&(this.decodeMode!==$u.Attribute||this.result===this.treeIndex)?this.emitNotTerminatedNamedEntity():0;case K.NumericDecimal:return this.emitNumericEntity(0,2);case K.NumericHex:return this.emitNumericEntity(0,3);case K.NumericStart:return(e=this.errors)==null||e.absenceOfDigitsInNumericCharacterReference(this.consumed),0;case K.EntityStart:return 0}}};function td(e,t,n,r){let i=(t&Ju.BRANCH_LENGTH)>>7,a=t&Ju.JUMP_TABLE;if(i===0)return a!==0&&r===a?n:-1;if(a){let t=r-a;return t<0||t>=i?-1:e[n+t]-1}let o=n,s=o+i-1;for(;o<=s;){let t=o+s>>>1,n=e[t];if(n<r)o=t+1;else if(n>r)s=t-1;else return e[t+i]}return-1}var q;(function(e){e.HTML=`http://www.w3.org/1999/xhtml`,e.MATHML=`http://www.w3.org/1998/Math/MathML`,e.SVG=`http://www.w3.org/2000/svg`,e.XLINK=`http://www.w3.org/1999/xlink`,e.XML=`http://www.w3.org/XML/1998/namespace`,e.XMLNS=`http://www.w3.org/2000/xmlns/`})(q||={});var nd;(function(e){e.TYPE=`type`,e.ACTION=`action`,e.ENCODING=`encoding`,e.PROMPT=`prompt`,e.NAME=`name`,e.COLOR=`color`,e.FACE=`face`,e.SIZE=`size`})(nd||={});var rd;(function(e){e.NO_QUIRKS=`no-quirks`,e.QUIRKS=`quirks`,e.LIMITED_QUIRKS=`limited-quirks`})(rd||={});var J;(function(e){e.A=`a`,e.ADDRESS=`address`,e.ANNOTATION_XML=`annotation-xml`,e.APPLET=`applet`,e.AREA=`area`,e.ARTICLE=`article`,e.ASIDE=`aside`,e.B=`b`,e.BASE=`base`,e.BASEFONT=`basefont`,e.BGSOUND=`bgsound`,e.BIG=`big`,e.BLOCKQUOTE=`blockquote`,e.BODY=`body`,e.BR=`br`,e.BUTTON=`button`,e.CAPTION=`caption`,e.CENTER=`center`,e.CODE=`code`,e.COL=`col`,e.COLGROUP=`colgroup`,e.DD=`dd`,e.DESC=`desc`,e.DETAILS=`details`,e.DIALOG=`dialog`,e.DIR=`dir`,e.DIV=`div`,e.DL=`dl`,e.DT=`dt`,e.EM=`em`,e.EMBED=`embed`,e.FIELDSET=`fieldset`,e.FIGCAPTION=`figcaption`,e.FIGURE=`figure`,e.FONT=`font`,e.FOOTER=`footer`,e.FOREIGN_OBJECT=`foreignObject`,e.FORM=`form`,e.FRAME=`frame`,e.FRAMESET=`frameset`,e.H1=`h1`,e.H2=`h2`,e.H3=`h3`,e.H4=`h4`,e.H5=`h5`,e.H6=`h6`,e.HEAD=`head`,e.HEADER=`header`,e.HGROUP=`hgroup`,e.HR=`hr`,e.HTML=`html`,e.I=`i`,e.IMG=`img`,e.IMAGE=`image`,e.INPUT=`input`,e.IFRAME=`iframe`,e.KEYGEN=`keygen`,e.LABEL=`label`,e.LI=`li`,e.LINK=`link`,e.LISTING=`listing`,e.MAIN=`main`,e.MALIGNMARK=`malignmark`,e.MARQUEE=`marquee`,e.MATH=`math`,e.MENU=`menu`,e.META=`meta`,e.MGLYPH=`mglyph`,e.MI=`mi`,e.MO=`mo`,e.MN=`mn`,e.MS=`ms`,e.MTEXT=`mtext`,e.NAV=`nav`,e.NOBR=`nobr`,e.NOFRAMES=`noframes`,e.NOEMBED=`noembed`,e.NOSCRIPT=`noscript`,e.OBJECT=`object`,e.OL=`ol`,e.OPTGROUP=`optgroup`,e.OPTION=`option`,e.P=`p`,e.PARAM=`param`,e.PLAINTEXT=`plaintext`,e.PRE=`pre`,e.RB=`rb`,e.RP=`rp`,e.RT=`rt`,e.RTC=`rtc`,e.RUBY=`ruby`,e.S=`s`,e.SCRIPT=`script`,e.SEARCH=`search`,e.SECTION=`section`,e.SELECT=`select`,e.SOURCE=`source`,e.SMALL=`small`,e.SPAN=`span`,e.STRIKE=`strike`,e.STRONG=`strong`,e.STYLE=`style`,e.SUB=`sub`,e.SUMMARY=`summary`,e.SUP=`sup`,e.TABLE=`table`,e.TBODY=`tbody`,e.TEMPLATE=`template`,e.TEXTAREA=`textarea`,e.TFOOT=`tfoot`,e.TD=`td`,e.TH=`th`,e.THEAD=`thead`,e.TITLE=`title`,e.TR=`tr`,e.TRACK=`track`,e.TT=`tt`,e.U=`u`,e.UL=`ul`,e.SVG=`svg`,e.VAR=`var`,e.WBR=`wbr`,e.XMP=`xmp`})(J||={});var Y;(function(e){e[e.UNKNOWN=0]=`UNKNOWN`,e[e.A=1]=`A`,e[e.ADDRESS=2]=`ADDRESS`,e[e.ANNOTATION_XML=3]=`ANNOTATION_XML`,e[e.APPLET=4]=`APPLET`,e[e.AREA=5]=`AREA`,e[e.ARTICLE=6]=`ARTICLE`,e[e.ASIDE=7]=`ASIDE`,e[e.B=8]=`B`,e[e.BASE=9]=`BASE`,e[e.BASEFONT=10]=`BASEFONT`,e[e.BGSOUND=11]=`BGSOUND`,e[e.BIG=12]=`BIG`,e[e.BLOCKQUOTE=13]=`BLOCKQUOTE`,e[e.BODY=14]=`BODY`,e[e.BR=15]=`BR`,e[e.BUTTON=16]=`BUTTON`,e[e.CAPTION=17]=`CAPTION`,e[e.CENTER=18]=`CENTER`,e[e.CODE=19]=`CODE`,e[e.COL=20]=`COL`,e[e.COLGROUP=21]=`COLGROUP`,e[e.DD=22]=`DD`,e[e.DESC=23]=`DESC`,e[e.DETAILS=24]=`DETAILS`,e[e.DIALOG=25]=`DIALOG`,e[e.DIR=26]=`DIR`,e[e.DIV=27]=`DIV`,e[e.DL=28]=`DL`,e[e.DT=29]=`DT`,e[e.EM=30]=`EM`,e[e.EMBED=31]=`EMBED`,e[e.FIELDSET=32]=`FIELDSET`,e[e.FIGCAPTION=33]=`FIGCAPTION`,e[e.FIGURE=34]=`FIGURE`,e[e.FONT=35]=`FONT`,e[e.FOOTER=36]=`FOOTER`,e[e.FOREIGN_OBJECT=37]=`FOREIGN_OBJECT`,e[e.FORM=38]=`FORM`,e[e.FRAME=39]=`FRAME`,e[e.FRAMESET=40]=`FRAMESET`,e[e.H1=41]=`H1`,e[e.H2=42]=`H2`,e[e.H3=43]=`H3`,e[e.H4=44]=`H4`,e[e.H5=45]=`H5`,e[e.H6=46]=`H6`,e[e.HEAD=47]=`HEAD`,e[e.HEADER=48]=`HEADER`,e[e.HGROUP=49]=`HGROUP`,e[e.HR=50]=`HR`,e[e.HTML=51]=`HTML`,e[e.I=52]=`I`,e[e.IMG=53]=`IMG`,e[e.IMAGE=54]=`IMAGE`,e[e.INPUT=55]=`INPUT`,e[e.IFRAME=56]=`IFRAME`,e[e.KEYGEN=57]=`KEYGEN`,e[e.LABEL=58]=`LABEL`,e[e.LI=59]=`LI`,e[e.LINK=60]=`LINK`,e[e.LISTING=61]=`LISTING`,e[e.MAIN=62]=`MAIN`,e[e.MALIGNMARK=63]=`MALIGNMARK`,e[e.MARQUEE=64]=`MARQUEE`,e[e.MATH=65]=`MATH`,e[e.MENU=66]=`MENU`,e[e.META=67]=`META`,e[e.MGLYPH=68]=`MGLYPH`,e[e.MI=69]=`MI`,e[e.MO=70]=`MO`,e[e.MN=71]=`MN`,e[e.MS=72]=`MS`,e[e.MTEXT=73]=`MTEXT`,e[e.NAV=74]=`NAV`,e[e.NOBR=75]=`NOBR`,e[e.NOFRAMES=76]=`NOFRAMES`,e[e.NOEMBED=77]=`NOEMBED`,e[e.NOSCRIPT=78]=`NOSCRIPT`,e[e.OBJECT=79]=`OBJECT`,e[e.OL=80]=`OL`,e[e.OPTGROUP=81]=`OPTGROUP`,e[e.OPTION=82]=`OPTION`,e[e.P=83]=`P`,e[e.PARAM=84]=`PARAM`,e[e.PLAINTEXT=85]=`PLAINTEXT`,e[e.PRE=86]=`PRE`,e[e.RB=87]=`RB`,e[e.RP=88]=`RP`,e[e.RT=89]=`RT`,e[e.RTC=90]=`RTC`,e[e.RUBY=91]=`RUBY`,e[e.S=92]=`S`,e[e.SCRIPT=93]=`SCRIPT`,e[e.SEARCH=94]=`SEARCH`,e[e.SECTION=95]=`SECTION`,e[e.SELECT=96]=`SELECT`,e[e.SOURCE=97]=`SOURCE`,e[e.SMALL=98]=`SMALL`,e[e.SPAN=99]=`SPAN`,e[e.STRIKE=100]=`STRIKE`,e[e.STRONG=101]=`STRONG`,e[e.STYLE=102]=`STYLE`,e[e.SUB=103]=`SUB`,e[e.SUMMARY=104]=`SUMMARY`,e[e.SUP=105]=`SUP`,e[e.TABLE=106]=`TABLE`,e[e.TBODY=107]=`TBODY`,e[e.TEMPLATE=108]=`TEMPLATE`,e[e.TEXTAREA=109]=`TEXTAREA`,e[e.TFOOT=110]=`TFOOT`,e[e.TD=111]=`TD`,e[e.TH=112]=`TH`,e[e.THEAD=113]=`THEAD`,e[e.TITLE=114]=`TITLE`,e[e.TR=115]=`TR`,e[e.TRACK=116]=`TRACK`,e[e.TT=117]=`TT`,e[e.U=118]=`U`,e[e.UL=119]=`UL`,e[e.SVG=120]=`SVG`,e[e.VAR=121]=`VAR`,e[e.WBR=122]=`WBR`,e[e.XMP=123]=`XMP`})(Y||={});var id=new Map([[J.A,Y.A],[J.ADDRESS,Y.ADDRESS],[J.ANNOTATION_XML,Y.ANNOTATION_XML],[J.APPLET,Y.APPLET],[J.AREA,Y.AREA],[J.ARTICLE,Y.ARTICLE],[J.ASIDE,Y.ASIDE],[J.B,Y.B],[J.BASE,Y.BASE],[J.BASEFONT,Y.BASEFONT],[J.BGSOUND,Y.BGSOUND],[J.BIG,Y.BIG],[J.BLOCKQUOTE,Y.BLOCKQUOTE],[J.BODY,Y.BODY],[J.BR,Y.BR],[J.BUTTON,Y.BUTTON],[J.CAPTION,Y.CAPTION],[J.CENTER,Y.CENTER],[J.CODE,Y.CODE],[J.COL,Y.COL],[J.COLGROUP,Y.COLGROUP],[J.DD,Y.DD],[J.DESC,Y.DESC],[J.DETAILS,Y.DETAILS],[J.DIALOG,Y.DIALOG],[J.DIR,Y.DIR],[J.DIV,Y.DIV],[J.DL,Y.DL],[J.DT,Y.DT],[J.EM,Y.EM],[J.EMBED,Y.EMBED],[J.FIELDSET,Y.FIELDSET],[J.FIGCAPTION,Y.FIGCAPTION],[J.FIGURE,Y.FIGURE],[J.FONT,Y.FONT],[J.FOOTER,Y.FOOTER],[J.FOREIGN_OBJECT,Y.FOREIGN_OBJECT],[J.FORM,Y.FORM],[J.FRAME,Y.FRAME],[J.FRAMESET,Y.FRAMESET],[J.H1,Y.H1],[J.H2,Y.H2],[J.H3,Y.H3],[J.H4,Y.H4],[J.H5,Y.H5],[J.H6,Y.H6],[J.HEAD,Y.HEAD],[J.HEADER,Y.HEADER],[J.HGROUP,Y.HGROUP],[J.HR,Y.HR],[J.HTML,Y.HTML],[J.I,Y.I],[J.IMG,Y.IMG],[J.IMAGE,Y.IMAGE],[J.INPUT,Y.INPUT],[J.IFRAME,Y.IFRAME],[J.KEYGEN,Y.KEYGEN],[J.LABEL,Y.LABEL],[J.LI,Y.LI],[J.LINK,Y.LINK],[J.LISTING,Y.LISTING],[J.MAIN,Y.MAIN],[J.MALIGNMARK,Y.MALIGNMARK],[J.MARQUEE,Y.MARQUEE],[J.MATH,Y.MATH],[J.MENU,Y.MENU],[J.META,Y.META],[J.MGLYPH,Y.MGLYPH],[J.MI,Y.MI],[J.MO,Y.MO],[J.MN,Y.MN],[J.MS,Y.MS],[J.MTEXT,Y.MTEXT],[J.NAV,Y.NAV],[J.NOBR,Y.NOBR],[J.NOFRAMES,Y.NOFRAMES],[J.NOEMBED,Y.NOEMBED],[J.NOSCRIPT,Y.NOSCRIPT],[J.OBJECT,Y.OBJECT],[J.OL,Y.OL],[J.OPTGROUP,Y.OPTGROUP],[J.OPTION,Y.OPTION],[J.P,Y.P],[J.PARAM,Y.PARAM],[J.PLAINTEXT,Y.PLAINTEXT],[J.PRE,Y.PRE],[J.RB,Y.RB],[J.RP,Y.RP],[J.RT,Y.RT],[J.RTC,Y.RTC],[J.RUBY,Y.RUBY],[J.S,Y.S],[J.SCRIPT,Y.SCRIPT],[J.SEARCH,Y.SEARCH],[J.SECTION,Y.SECTION],[J.SELECT,Y.SELECT],[J.SOURCE,Y.SOURCE],[J.SMALL,Y.SMALL],[J.SPAN,Y.SPAN],[J.STRIKE,Y.STRIKE],[J.STRONG,Y.STRONG],[J.STYLE,Y.STYLE],[J.SUB,Y.SUB],[J.SUMMARY,Y.SUMMARY],[J.SUP,Y.SUP],[J.TABLE,Y.TABLE],[J.TBODY,Y.TBODY],[J.TEMPLATE,Y.TEMPLATE],[J.TEXTAREA,Y.TEXTAREA],[J.TFOOT,Y.TFOOT],[J.TD,Y.TD],[J.TH,Y.TH],[J.THEAD,Y.THEAD],[J.TITLE,Y.TITLE],[J.TR,Y.TR],[J.TRACK,Y.TRACK],[J.TT,Y.TT],[J.U,Y.U],[J.UL,Y.UL],[J.SVG,Y.SVG],[J.VAR,Y.VAR],[J.WBR,Y.WBR],[J.XMP,Y.XMP]]);function ad(e){return id.get(e)??Y.UNKNOWN}var X=Y,od={[q.HTML]:new Set([X.ADDRESS,X.APPLET,X.AREA,X.ARTICLE,X.ASIDE,X.BASE,X.BASEFONT,X.BGSOUND,X.BLOCKQUOTE,X.BODY,X.BR,X.BUTTON,X.CAPTION,X.CENTER,X.COL,X.COLGROUP,X.DD,X.DETAILS,X.DIR,X.DIV,X.DL,X.DT,X.EMBED,X.FIELDSET,X.FIGCAPTION,X.FIGURE,X.FOOTER,X.FORM,X.FRAME,X.FRAMESET,X.H1,X.H2,X.H3,X.H4,X.H5,X.H6,X.HEAD,X.HEADER,X.HGROUP,X.HR,X.HTML,X.IFRAME,X.IMG,X.INPUT,X.LI,X.LINK,X.LISTING,X.MAIN,X.MARQUEE,X.MENU,X.META,X.NAV,X.NOEMBED,X.NOFRAMES,X.NOSCRIPT,X.OBJECT,X.OL,X.P,X.PARAM,X.PLAINTEXT,X.PRE,X.SCRIPT,X.SECTION,X.SELECT,X.SOURCE,X.STYLE,X.SUMMARY,X.TABLE,X.TBODY,X.TD,X.TEMPLATE,X.TEXTAREA,X.TFOOT,X.TH,X.THEAD,X.TITLE,X.TR,X.TRACK,X.UL,X.WBR,X.XMP]),[q.MATHML]:new Set([X.MI,X.MO,X.MN,X.MS,X.MTEXT,X.ANNOTATION_XML]),[q.SVG]:new Set([X.TITLE,X.FOREIGN_OBJECT,X.DESC]),[q.XLINK]:new Set,[q.XML]:new Set,[q.XMLNS]:new Set},sd=new Set([X.H1,X.H2,X.H3,X.H4,X.H5,X.H6]);new Set([J.STYLE,J.SCRIPT,J.XMP,J.IFRAME,J.NOEMBED,J.NOFRAMES,J.PLAINTEXT]);var Z;(function(e){e[e.DATA=0]=`DATA`,e[e.RCDATA=1]=`RCDATA`,e[e.RAWTEXT=2]=`RAWTEXT`,e[e.SCRIPT_DATA=3]=`SCRIPT_DATA`,e[e.PLAINTEXT=4]=`PLAINTEXT`,e[e.TAG_OPEN=5]=`TAG_OPEN`,e[e.END_TAG_OPEN=6]=`END_TAG_OPEN`,e[e.TAG_NAME=7]=`TAG_NAME`,e[e.RCDATA_LESS_THAN_SIGN=8]=`RCDATA_LESS_THAN_SIGN`,e[e.RCDATA_END_TAG_OPEN=9]=`RCDATA_END_TAG_OPEN`,e[e.RCDATA_END_TAG_NAME=10]=`RCDATA_END_TAG_NAME`,e[e.RAWTEXT_LESS_THAN_SIGN=11]=`RAWTEXT_LESS_THAN_SIGN`,e[e.RAWTEXT_END_TAG_OPEN=12]=`RAWTEXT_END_TAG_OPEN`,e[e.RAWTEXT_END_TAG_NAME=13]=`RAWTEXT_END_TAG_NAME`,e[e.SCRIPT_DATA_LESS_THAN_SIGN=14]=`SCRIPT_DATA_LESS_THAN_SIGN`,e[e.SCRIPT_DATA_END_TAG_OPEN=15]=`SCRIPT_DATA_END_TAG_OPEN`,e[e.SCRIPT_DATA_END_TAG_NAME=16]=`SCRIPT_DATA_END_TAG_NAME`,e[e.SCRIPT_DATA_ESCAPE_START=17]=`SCRIPT_DATA_ESCAPE_START`,e[e.SCRIPT_DATA_ESCAPE_START_DASH=18]=`SCRIPT_DATA_ESCAPE_START_DASH`,e[e.SCRIPT_DATA_ESCAPED=19]=`SCRIPT_DATA_ESCAPED`,e[e.SCRIPT_DATA_ESCAPED_DASH=20]=`SCRIPT_DATA_ESCAPED_DASH`,e[e.SCRIPT_DATA_ESCAPED_DASH_DASH=21]=`SCRIPT_DATA_ESCAPED_DASH_DASH`,e[e.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN=22]=`SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN`,e[e.SCRIPT_DATA_ESCAPED_END_TAG_OPEN=23]=`SCRIPT_DATA_ESCAPED_END_TAG_OPEN`,e[e.SCRIPT_DATA_ESCAPED_END_TAG_NAME=24]=`SCRIPT_DATA_ESCAPED_END_TAG_NAME`,e[e.SCRIPT_DATA_DOUBLE_ESCAPE_START=25]=`SCRIPT_DATA_DOUBLE_ESCAPE_START`,e[e.SCRIPT_DATA_DOUBLE_ESCAPED=26]=`SCRIPT_DATA_DOUBLE_ESCAPED`,e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH=27]=`SCRIPT_DATA_DOUBLE_ESCAPED_DASH`,e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH=28]=`SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH`,e[e.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN=29]=`SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN`,e[e.SCRIPT_DATA_DOUBLE_ESCAPE_END=30]=`SCRIPT_DATA_DOUBLE_ESCAPE_END`,e[e.BEFORE_ATTRIBUTE_NAME=31]=`BEFORE_ATTRIBUTE_NAME`,e[e.ATTRIBUTE_NAME=32]=`ATTRIBUTE_NAME`,e[e.AFTER_ATTRIBUTE_NAME=33]=`AFTER_ATTRIBUTE_NAME`,e[e.BEFORE_ATTRIBUTE_VALUE=34]=`BEFORE_ATTRIBUTE_VALUE`,e[e.ATTRIBUTE_VALUE_DOUBLE_QUOTED=35]=`ATTRIBUTE_VALUE_DOUBLE_QUOTED`,e[e.ATTRIBUTE_VALUE_SINGLE_QUOTED=36]=`ATTRIBUTE_VALUE_SINGLE_QUOTED`,e[e.ATTRIBUTE_VALUE_UNQUOTED=37]=`ATTRIBUTE_VALUE_UNQUOTED`,e[e.AFTER_ATTRIBUTE_VALUE_QUOTED=38]=`AFTER_ATTRIBUTE_VALUE_QUOTED`,e[e.SELF_CLOSING_START_TAG=39]=`SELF_CLOSING_START_TAG`,e[e.BOGUS_COMMENT=40]=`BOGUS_COMMENT`,e[e.MARKUP_DECLARATION_OPEN=41]=`MARKUP_DECLARATION_OPEN`,e[e.COMMENT_START=42]=`COMMENT_START`,e[e.COMMENT_START_DASH=43]=`COMMENT_START_DASH`,e[e.COMMENT=44]=`COMMENT`,e[e.COMMENT_LESS_THAN_SIGN=45]=`COMMENT_LESS_THAN_SIGN`,e[e.COMMENT_LESS_THAN_SIGN_BANG=46]=`COMMENT_LESS_THAN_SIGN_BANG`,e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH=47]=`COMMENT_LESS_THAN_SIGN_BANG_DASH`,e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH=48]=`COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH`,e[e.COMMENT_END_DASH=49]=`COMMENT_END_DASH`,e[e.COMMENT_END=50]=`COMMENT_END`,e[e.COMMENT_END_BANG=51]=`COMMENT_END_BANG`,e[e.DOCTYPE=52]=`DOCTYPE`,e[e.BEFORE_DOCTYPE_NAME=53]=`BEFORE_DOCTYPE_NAME`,e[e.DOCTYPE_NAME=54]=`DOCTYPE_NAME`,e[e.AFTER_DOCTYPE_NAME=55]=`AFTER_DOCTYPE_NAME`,e[e.AFTER_DOCTYPE_PUBLIC_KEYWORD=56]=`AFTER_DOCTYPE_PUBLIC_KEYWORD`,e[e.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER=57]=`BEFORE_DOCTYPE_PUBLIC_IDENTIFIER`,e[e.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED=58]=`DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED`,e[e.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED=59]=`DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED`,e[e.AFTER_DOCTYPE_PUBLIC_IDENTIFIER=60]=`AFTER_DOCTYPE_PUBLIC_IDENTIFIER`,e[e.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS=61]=`BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS`,e[e.AFTER_DOCTYPE_SYSTEM_KEYWORD=62]=`AFTER_DOCTYPE_SYSTEM_KEYWORD`,e[e.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER=63]=`BEFORE_DOCTYPE_SYSTEM_IDENTIFIER`,e[e.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED=64]=`DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED`,e[e.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED=65]=`DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED`,e[e.AFTER_DOCTYPE_SYSTEM_IDENTIFIER=66]=`AFTER_DOCTYPE_SYSTEM_IDENTIFIER`,e[e.BOGUS_DOCTYPE=67]=`BOGUS_DOCTYPE`,e[e.CDATA_SECTION=68]=`CDATA_SECTION`,e[e.CDATA_SECTION_BRACKET=69]=`CDATA_SECTION_BRACKET`,e[e.CDATA_SECTION_END=70]=`CDATA_SECTION_END`,e[e.CHARACTER_REFERENCE=71]=`CHARACTER_REFERENCE`,e[e.AMBIGUOUS_AMPERSAND=72]=`AMBIGUOUS_AMPERSAND`})(Z||={});var Q={DATA:Z.DATA,RCDATA:Z.RCDATA,RAWTEXT:Z.RAWTEXT,SCRIPT_DATA:Z.SCRIPT_DATA,PLAINTEXT:Z.PLAINTEXT,CDATA_SECTION:Z.CDATA_SECTION};function cd(e){return e>=H.DIGIT_0&&e<=H.DIGIT_9}function ld(e){return e>=H.LATIN_CAPITAL_A&&e<=H.LATIN_CAPITAL_Z}function ud(e){return e>=H.LATIN_SMALL_A&&e<=H.LATIN_SMALL_Z}function dd(e){return ud(e)||ld(e)}function fd(e){return dd(e)||cd(e)}function pd(e){return e+32}function md(e){return e===H.SPACE||e===H.LINE_FEED||e===H.TABULATION||e===H.FORM_FEED}function hd(e){return md(e)||e===H.SOLIDUS||e===H.GREATER_THAN_SIGN}function gd(e){return e===H.NULL?U.nullCharacterReference:e>1114111?U.characterReferenceOutsideUnicodeRange:Iu(e)?U.surrogateCharacterReference:Bu(e)?U.noncharacterCharacterReference:zu(e)||e===H.CARRIAGE_RETURN?U.controlCharacterReference:null}var _d=class{constructor(e,t){this.options=e,this.handler=t,this.paused=!1,this.inLoop=!1,this.inForeignNode=!1,this.lastStartTagName=``,this.active=!1,this.state=Z.DATA,this.returnState=Z.DATA,this.entityStartPos=0,this.consumedAfterSnapshot=-1,this.currentCharacterToken=null,this.currentToken=null,this.currentAttr={name:``,value:``},this.preprocessor=new Hu(t),this.currentLocation=this.getCurrentLocation(-1),this.entityDecoder=new ed(Wu,(e,t)=>{this.preprocessor.pos=this.entityStartPos+t-1,this._flushCodePointConsumedAsCharacterReference(e)},t.onParseError?{missingSemicolonAfterCharacterReference:()=>{this._err(U.missingSemicolonAfterCharacterReference,1)},absenceOfDigitsInNumericCharacterReference:e=>{this._err(U.absenceOfDigitsInNumericCharacterReference,this.entityStartPos-this.preprocessor.pos+e)},validateNumericCharacterReference:e=>{let t=gd(e);t&&this._err(t,1)}}:void 0)}_err(e,t=0){var n,r;(r=(n=this.handler).onParseError)==null||r.call(n,this.preprocessor.getError(e,t))}getCurrentLocation(e){return this.options.sourceCodeLocationInfo?{startLine:this.preprocessor.line,startCol:this.preprocessor.col-e,startOffset:this.preprocessor.offset-e,endLine:-1,endCol:-1,endOffset:-1}:null}_runParsingLoop(){if(!this.inLoop){for(this.inLoop=!0;this.active&&!this.paused;){this.consumedAfterSnapshot=0;let e=this._consume();this._ensureHibernation()||this._callState(e)}this.inLoop=!1}}pause(){this.paused=!0}resume(e){if(!this.paused)throw Error(`Parser was already resumed`);this.paused=!1,!this.inLoop&&(this._runParsingLoop(),this.paused||e?.())}write(e,t,n){this.active=!0,this.preprocessor.write(e,t),this._runParsingLoop(),this.paused||n?.()}insertHtmlAtCurrentPos(e){this.active=!0,this.preprocessor.insertHtmlAtCurrentPos(e),this._runParsingLoop()}_ensureHibernation(){return this.preprocessor.endOfChunkHit?(this.preprocessor.retreat(this.consumedAfterSnapshot),this.consumedAfterSnapshot=0,this.active=!1,!0):!1}_consume(){return this.consumedAfterSnapshot++,this.preprocessor.advance()}_advanceBy(e){this.consumedAfterSnapshot+=e;for(let t=0;t<e;t++)this.preprocessor.advance()}_consumeSequenceIfMatch(e,t){return this.preprocessor.startsWith(e,t)?(this._advanceBy(e.length-1),!0):!1}_createStartTagToken(){this.currentToken={type:W.START_TAG,tagName:``,tagID:Y.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(1)}}_createEndTagToken(){this.currentToken={type:W.END_TAG,tagName:``,tagID:Y.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(2)}}_createCommentToken(e){this.currentToken={type:W.COMMENT,data:``,location:this.getCurrentLocation(e)}}_createDoctypeToken(e){this.currentToken={type:W.DOCTYPE,name:e,forceQuirks:!1,publicId:null,systemId:null,location:this.currentLocation}}_createCharacterToken(e,t){this.currentCharacterToken={type:e,chars:t,location:this.currentLocation}}_createAttr(e){this.currentAttr={name:e,value:``},this.currentLocation=this.getCurrentLocation(0)}_leaveAttrName(){var e;let t=this.currentToken;if(Uu(t,this.currentAttr.name)===null){if(t.attrs.push(this.currentAttr),t.location&&this.currentLocation){let n=(e=t.location).attrs??(e.attrs=Object.create(null));n[this.currentAttr.name]=this.currentLocation,this._leaveAttrValue()}}else this._err(U.duplicateAttribute)}_leaveAttrValue(){this.currentLocation&&(this.currentLocation.endLine=this.preprocessor.line,this.currentLocation.endCol=this.preprocessor.col,this.currentLocation.endOffset=this.preprocessor.offset)}prepareToken(e){this._emitCurrentCharacterToken(e.location),this.currentToken=null,e.location&&(e.location.endLine=this.preprocessor.line,e.location.endCol=this.preprocessor.col+1,e.location.endOffset=this.preprocessor.offset+1),this.currentLocation=this.getCurrentLocation(-1)}emitCurrentTagToken(){let e=this.currentToken;this.prepareToken(e),e.tagID=ad(e.tagName),e.type===W.START_TAG?(this.lastStartTagName=e.tagName,this.handler.onStartTag(e)):(e.attrs.length>0&&this._err(U.endTagWithAttributes),e.selfClosing&&this._err(U.endTagWithTrailingSolidus),this.handler.onEndTag(e)),this.preprocessor.dropParsedChunk()}emitCurrentComment(e){this.prepareToken(e),this.handler.onComment(e),this.preprocessor.dropParsedChunk()}emitCurrentDoctype(e){this.prepareToken(e),this.handler.onDoctype(e),this.preprocessor.dropParsedChunk()}_emitCurrentCharacterToken(e){if(this.currentCharacterToken){switch(e&&this.currentCharacterToken.location&&(this.currentCharacterToken.location.endLine=e.startLine,this.currentCharacterToken.location.endCol=e.startCol,this.currentCharacterToken.location.endOffset=e.startOffset),this.currentCharacterToken.type){case W.CHARACTER:this.handler.onCharacter(this.currentCharacterToken);break;case W.NULL_CHARACTER:this.handler.onNullCharacter(this.currentCharacterToken);break;case W.WHITESPACE_CHARACTER:this.handler.onWhitespaceCharacter(this.currentCharacterToken);break}this.currentCharacterToken=null}}_emitEOFToken(){let e=this.getCurrentLocation(0);e&&(e.endLine=e.startLine,e.endCol=e.startCol,e.endOffset=e.startOffset),this._emitCurrentCharacterToken(e),this.handler.onEof({type:W.EOF,location:e}),this.active=!1}_appendCharToCurrentCharacterToken(e,t){if(this.currentCharacterToken)if(this.currentCharacterToken.type===e){this.currentCharacterToken.chars+=t;return}else this.currentLocation=this.getCurrentLocation(0),this._emitCurrentCharacterToken(this.currentLocation),this.preprocessor.dropParsedChunk();this._createCharacterToken(e,t)}_emitCodePoint(e){let t=md(e)?W.WHITESPACE_CHARACTER:e===H.NULL?W.NULL_CHARACTER:W.CHARACTER;this._appendCharToCurrentCharacterToken(t,String.fromCodePoint(e))}_emitChars(e){this._appendCharToCurrentCharacterToken(W.CHARACTER,e)}_startCharacterReference(){this.returnState=this.state,this.state=Z.CHARACTER_REFERENCE,this.entityStartPos=this.preprocessor.pos,this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute()?$u.Attribute:$u.Legacy)}_isCharacterReferenceInAttribute(){return this.returnState===Z.ATTRIBUTE_VALUE_DOUBLE_QUOTED||this.returnState===Z.ATTRIBUTE_VALUE_SINGLE_QUOTED||this.returnState===Z.ATTRIBUTE_VALUE_UNQUOTED}_flushCodePointConsumedAsCharacterReference(e){this._isCharacterReferenceInAttribute()?this.currentAttr.value+=String.fromCodePoint(e):this._emitCodePoint(e)}_callState(e){switch(this.state){case Z.DATA:this._stateData(e);break;case Z.RCDATA:this._stateRcdata(e);break;case Z.RAWTEXT:this._stateRawtext(e);break;case Z.SCRIPT_DATA:this._stateScriptData(e);break;case Z.PLAINTEXT:this._statePlaintext(e);break;case Z.TAG_OPEN:this._stateTagOpen(e);break;case Z.END_TAG_OPEN:this._stateEndTagOpen(e);break;case Z.TAG_NAME:this._stateTagName(e);break;case Z.RCDATA_LESS_THAN_SIGN:this._stateRcdataLessThanSign(e);break;case Z.RCDATA_END_TAG_OPEN:this._stateRcdataEndTagOpen(e);break;case Z.RCDATA_END_TAG_NAME:this._stateRcdataEndTagName(e);break;case Z.RAWTEXT_LESS_THAN_SIGN:this._stateRawtextLessThanSign(e);break;case Z.RAWTEXT_END_TAG_OPEN:this._stateRawtextEndTagOpen(e);break;case Z.RAWTEXT_END_TAG_NAME:this._stateRawtextEndTagName(e);break;case Z.SCRIPT_DATA_LESS_THAN_SIGN:this._stateScriptDataLessThanSign(e);break;case Z.SCRIPT_DATA_END_TAG_OPEN:this._stateScriptDataEndTagOpen(e);break;case Z.SCRIPT_DATA_END_TAG_NAME:this._stateScriptDataEndTagName(e);break;case Z.SCRIPT_DATA_ESCAPE_START:this._stateScriptDataEscapeStart(e);break;case Z.SCRIPT_DATA_ESCAPE_START_DASH:this._stateScriptDataEscapeStartDash(e);break;case Z.SCRIPT_DATA_ESCAPED:this._stateScriptDataEscaped(e);break;case Z.SCRIPT_DATA_ESCAPED_DASH:this._stateScriptDataEscapedDash(e);break;case Z.SCRIPT_DATA_ESCAPED_DASH_DASH:this._stateScriptDataEscapedDashDash(e);break;case Z.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataEscapedLessThanSign(e);break;case Z.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:this._stateScriptDataEscapedEndTagOpen(e);break;case Z.SCRIPT_DATA_ESCAPED_END_TAG_NAME:this._stateScriptDataEscapedEndTagName(e);break;case Z.SCRIPT_DATA_DOUBLE_ESCAPE_START:this._stateScriptDataDoubleEscapeStart(e);break;case Z.SCRIPT_DATA_DOUBLE_ESCAPED:this._stateScriptDataDoubleEscaped(e);break;case Z.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:this._stateScriptDataDoubleEscapedDash(e);break;case Z.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:this._stateScriptDataDoubleEscapedDashDash(e);break;case Z.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataDoubleEscapedLessThanSign(e);break;case Z.SCRIPT_DATA_DOUBLE_ESCAPE_END:this._stateScriptDataDoubleEscapeEnd(e);break;case Z.BEFORE_ATTRIBUTE_NAME:this._stateBeforeAttributeName(e);break;case Z.ATTRIBUTE_NAME:this._stateAttributeName(e);break;case Z.AFTER_ATTRIBUTE_NAME:this._stateAfterAttributeName(e);break;case Z.BEFORE_ATTRIBUTE_VALUE:this._stateBeforeAttributeValue(e);break;case Z.ATTRIBUTE_VALUE_DOUBLE_QUOTED:this._stateAttributeValueDoubleQuoted(e);break;case Z.ATTRIBUTE_VALUE_SINGLE_QUOTED:this._stateAttributeValueSingleQuoted(e);break;case Z.ATTRIBUTE_VALUE_UNQUOTED:this._stateAttributeValueUnquoted(e);break;case Z.AFTER_ATTRIBUTE_VALUE_QUOTED:this._stateAfterAttributeValueQuoted(e);break;case Z.SELF_CLOSING_START_TAG:this._stateSelfClosingStartTag(e);break;case Z.BOGUS_COMMENT:this._stateBogusComment(e);break;case Z.MARKUP_DECLARATION_OPEN:this._stateMarkupDeclarationOpen(e);break;case Z.COMMENT_START:this._stateCommentStart(e);break;case Z.COMMENT_START_DASH:this._stateCommentStartDash(e);break;case Z.COMMENT:this._stateComment(e);break;case Z.COMMENT_LESS_THAN_SIGN:this._stateCommentLessThanSign(e);break;case Z.COMMENT_LESS_THAN_SIGN_BANG:this._stateCommentLessThanSignBang(e);break;case Z.COMMENT_LESS_THAN_SIGN_BANG_DASH:this._stateCommentLessThanSignBangDash(e);break;case Z.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:this._stateCommentLessThanSignBangDashDash(e);break;case Z.COMMENT_END_DASH:this._stateCommentEndDash(e);break;case Z.COMMENT_END:this._stateCommentEnd(e);break;case Z.COMMENT_END_BANG:this._stateCommentEndBang(e);break;case Z.DOCTYPE:this._stateDoctype(e);break;case Z.BEFORE_DOCTYPE_NAME:this._stateBeforeDoctypeName(e);break;case Z.DOCTYPE_NAME:this._stateDoctypeName(e);break;case Z.AFTER_DOCTYPE_NAME:this._stateAfterDoctypeName(e);break;case Z.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._stateAfterDoctypePublicKeyword(e);break;case Z.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:this._stateBeforeDoctypePublicIdentifier(e);break;case Z.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypePublicIdentifierDoubleQuoted(e);break;case Z.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypePublicIdentifierSingleQuoted(e);break;case Z.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:this._stateAfterDoctypePublicIdentifier(e);break;case Z.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:this._stateBetweenDoctypePublicAndSystemIdentifiers(e);break;case Z.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._stateAfterDoctypeSystemKeyword(e);break;case Z.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:this._stateBeforeDoctypeSystemIdentifier(e);break;case Z.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypeSystemIdentifierDoubleQuoted(e);break;case Z.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypeSystemIdentifierSingleQuoted(e);break;case Z.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:this._stateAfterDoctypeSystemIdentifier(e);break;case Z.BOGUS_DOCTYPE:this._stateBogusDoctype(e);break;case Z.CDATA_SECTION:this._stateCdataSection(e);break;case Z.CDATA_SECTION_BRACKET:this._stateCdataSectionBracket(e);break;case Z.CDATA_SECTION_END:this._stateCdataSectionEnd(e);break;case Z.CHARACTER_REFERENCE:this._stateCharacterReference();break;case Z.AMBIGUOUS_AMPERSAND:this._stateAmbiguousAmpersand(e);break;default:throw Error(`Unknown state`)}}_stateData(e){switch(e){case H.LESS_THAN_SIGN:this.state=Z.TAG_OPEN;break;case H.AMPERSAND:this._startCharacterReference();break;case H.NULL:this._err(U.unexpectedNullCharacter),this._emitCodePoint(e);break;case H.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateRcdata(e){switch(e){case H.AMPERSAND:this._startCharacterReference();break;case H.LESS_THAN_SIGN:this.state=Z.RCDATA_LESS_THAN_SIGN;break;case H.NULL:this._err(U.unexpectedNullCharacter),this._emitChars(`�`);break;case H.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateRawtext(e){switch(e){case H.LESS_THAN_SIGN:this.state=Z.RAWTEXT_LESS_THAN_SIGN;break;case H.NULL:this._err(U.unexpectedNullCharacter),this._emitChars(`�`);break;case H.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateScriptData(e){switch(e){case H.LESS_THAN_SIGN:this.state=Z.SCRIPT_DATA_LESS_THAN_SIGN;break;case H.NULL:this._err(U.unexpectedNullCharacter),this._emitChars(`�`);break;case H.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_statePlaintext(e){switch(e){case H.NULL:this._err(U.unexpectedNullCharacter),this._emitChars(`�`);break;case H.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateTagOpen(e){if(dd(e))this._createStartTagToken(),this.state=Z.TAG_NAME,this._stateTagName(e);else switch(e){case H.EXCLAMATION_MARK:this.state=Z.MARKUP_DECLARATION_OPEN;break;case H.SOLIDUS:this.state=Z.END_TAG_OPEN;break;case H.QUESTION_MARK:this._err(U.unexpectedQuestionMarkInsteadOfTagName),this._createCommentToken(1),this.state=Z.BOGUS_COMMENT,this._stateBogusComment(e);break;case H.EOF:this._err(U.eofBeforeTagName),this._emitChars(`<`),this._emitEOFToken();break;default:this._err(U.invalidFirstCharacterOfTagName),this._emitChars(`<`),this.state=Z.DATA,this._stateData(e)}}_stateEndTagOpen(e){if(dd(e))this._createEndTagToken(),this.state=Z.TAG_NAME,this._stateTagName(e);else switch(e){case H.GREATER_THAN_SIGN:this._err(U.missingEndTagName),this.state=Z.DATA;break;case H.EOF:this._err(U.eofBeforeTagName),this._emitChars(`</`),this._emitEOFToken();break;default:this._err(U.invalidFirstCharacterOfTagName),this._createCommentToken(2),this.state=Z.BOGUS_COMMENT,this._stateBogusComment(e)}}_stateTagName(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:this.state=Z.BEFORE_ATTRIBUTE_NAME;break;case H.SOLIDUS:this.state=Z.SELF_CLOSING_START_TAG;break;case H.GREATER_THAN_SIGN:this.state=Z.DATA,this.emitCurrentTagToken();break;case H.NULL:this._err(U.unexpectedNullCharacter),t.tagName+=`�`;break;case H.EOF:this._err(U.eofInTag),this._emitEOFToken();break;default:t.tagName+=String.fromCodePoint(ld(e)?pd(e):e)}}_stateRcdataLessThanSign(e){e===H.SOLIDUS?this.state=Z.RCDATA_END_TAG_OPEN:(this._emitChars(`<`),this.state=Z.RCDATA,this._stateRcdata(e))}_stateRcdataEndTagOpen(e){dd(e)?(this.state=Z.RCDATA_END_TAG_NAME,this._stateRcdataEndTagName(e)):(this._emitChars(`</`),this.state=Z.RCDATA,this._stateRcdata(e))}handleSpecialEndTag(e){if(!this.preprocessor.startsWith(this.lastStartTagName,!1))return!this._ensureHibernation();this._createEndTagToken();let t=this.currentToken;switch(t.tagName=this.lastStartTagName,this.preprocessor.peek(this.lastStartTagName.length)){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:return this._advanceBy(this.lastStartTagName.length),this.state=Z.BEFORE_ATTRIBUTE_NAME,!1;case H.SOLIDUS:return this._advanceBy(this.lastStartTagName.length),this.state=Z.SELF_CLOSING_START_TAG,!1;case H.GREATER_THAN_SIGN:return this._advanceBy(this.lastStartTagName.length),this.emitCurrentTagToken(),this.state=Z.DATA,!1;default:return!this._ensureHibernation()}}_stateRcdataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars(`</`),this.state=Z.RCDATA,this._stateRcdata(e))}_stateRawtextLessThanSign(e){e===H.SOLIDUS?this.state=Z.RAWTEXT_END_TAG_OPEN:(this._emitChars(`<`),this.state=Z.RAWTEXT,this._stateRawtext(e))}_stateRawtextEndTagOpen(e){dd(e)?(this.state=Z.RAWTEXT_END_TAG_NAME,this._stateRawtextEndTagName(e)):(this._emitChars(`</`),this.state=Z.RAWTEXT,this._stateRawtext(e))}_stateRawtextEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars(`</`),this.state=Z.RAWTEXT,this._stateRawtext(e))}_stateScriptDataLessThanSign(e){switch(e){case H.SOLIDUS:this.state=Z.SCRIPT_DATA_END_TAG_OPEN;break;case H.EXCLAMATION_MARK:this.state=Z.SCRIPT_DATA_ESCAPE_START,this._emitChars(`<!`);break;default:this._emitChars(`<`),this.state=Z.SCRIPT_DATA,this._stateScriptData(e)}}_stateScriptDataEndTagOpen(e){dd(e)?(this.state=Z.SCRIPT_DATA_END_TAG_NAME,this._stateScriptDataEndTagName(e)):(this._emitChars(`</`),this.state=Z.SCRIPT_DATA,this._stateScriptData(e))}_stateScriptDataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars(`</`),this.state=Z.SCRIPT_DATA,this._stateScriptData(e))}_stateScriptDataEscapeStart(e){e===H.HYPHEN_MINUS?(this.state=Z.SCRIPT_DATA_ESCAPE_START_DASH,this._emitChars(`-`)):(this.state=Z.SCRIPT_DATA,this._stateScriptData(e))}_stateScriptDataEscapeStartDash(e){e===H.HYPHEN_MINUS?(this.state=Z.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars(`-`)):(this.state=Z.SCRIPT_DATA,this._stateScriptData(e))}_stateScriptDataEscaped(e){switch(e){case H.HYPHEN_MINUS:this.state=Z.SCRIPT_DATA_ESCAPED_DASH,this._emitChars(`-`);break;case H.LESS_THAN_SIGN:this.state=Z.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case H.NULL:this._err(U.unexpectedNullCharacter),this._emitChars(`�`);break;case H.EOF:this._err(U.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateScriptDataEscapedDash(e){switch(e){case H.HYPHEN_MINUS:this.state=Z.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars(`-`);break;case H.LESS_THAN_SIGN:this.state=Z.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case H.NULL:this._err(U.unexpectedNullCharacter),this.state=Z.SCRIPT_DATA_ESCAPED,this._emitChars(`�`);break;case H.EOF:this._err(U.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=Z.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e)}}_stateScriptDataEscapedDashDash(e){switch(e){case H.HYPHEN_MINUS:this._emitChars(`-`);break;case H.LESS_THAN_SIGN:this.state=Z.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case H.GREATER_THAN_SIGN:this.state=Z.SCRIPT_DATA,this._emitChars(`>`);break;case H.NULL:this._err(U.unexpectedNullCharacter),this.state=Z.SCRIPT_DATA_ESCAPED,this._emitChars(`�`);break;case H.EOF:this._err(U.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=Z.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e)}}_stateScriptDataEscapedLessThanSign(e){e===H.SOLIDUS?this.state=Z.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:dd(e)?(this._emitChars(`<`),this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPE_START,this._stateScriptDataDoubleEscapeStart(e)):(this._emitChars(`<`),this.state=Z.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e))}_stateScriptDataEscapedEndTagOpen(e){dd(e)?(this.state=Z.SCRIPT_DATA_ESCAPED_END_TAG_NAME,this._stateScriptDataEscapedEndTagName(e)):(this._emitChars(`</`),this.state=Z.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e))}_stateScriptDataEscapedEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars(`</`),this.state=Z.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e))}_stateScriptDataDoubleEscapeStart(e){if(this.preprocessor.startsWith(Fu.SCRIPT,!1)&&hd(this.preprocessor.peek(Fu.SCRIPT.length))){this._emitCodePoint(e);for(let e=0;e<Fu.SCRIPT.length;e++)this._emitCodePoint(this._consume());this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED}else this._ensureHibernation()||(this.state=Z.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e))}_stateScriptDataDoubleEscaped(e){switch(e){case H.HYPHEN_MINUS:this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED_DASH,this._emitChars(`-`);break;case H.LESS_THAN_SIGN:this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars(`<`);break;case H.NULL:this._err(U.unexpectedNullCharacter),this._emitChars(`�`);break;case H.EOF:this._err(U.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateScriptDataDoubleEscapedDash(e){switch(e){case H.HYPHEN_MINUS:this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH,this._emitChars(`-`);break;case H.LESS_THAN_SIGN:this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars(`<`);break;case H.NULL:this._err(U.unexpectedNullCharacter),this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(`�`);break;case H.EOF:this._err(U.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e)}}_stateScriptDataDoubleEscapedDashDash(e){switch(e){case H.HYPHEN_MINUS:this._emitChars(`-`);break;case H.LESS_THAN_SIGN:this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars(`<`);break;case H.GREATER_THAN_SIGN:this.state=Z.SCRIPT_DATA,this._emitChars(`>`);break;case H.NULL:this._err(U.unexpectedNullCharacter),this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(`�`);break;case H.EOF:this._err(U.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e)}}_stateScriptDataDoubleEscapedLessThanSign(e){e===H.SOLIDUS?(this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPE_END,this._emitChars(`/`)):(this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e))}_stateScriptDataDoubleEscapeEnd(e){if(this.preprocessor.startsWith(Fu.SCRIPT,!1)&&hd(this.preprocessor.peek(Fu.SCRIPT.length))){this._emitCodePoint(e);for(let e=0;e<Fu.SCRIPT.length;e++)this._emitCodePoint(this._consume());this.state=Z.SCRIPT_DATA_ESCAPED}else this._ensureHibernation()||(this.state=Z.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e))}_stateBeforeAttributeName(e){switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:break;case H.SOLIDUS:case H.GREATER_THAN_SIGN:case H.EOF:this.state=Z.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case H.EQUALS_SIGN:this._err(U.unexpectedEqualsSignBeforeAttributeName),this._createAttr(`=`),this.state=Z.ATTRIBUTE_NAME;break;default:this._createAttr(``),this.state=Z.ATTRIBUTE_NAME,this._stateAttributeName(e)}}_stateAttributeName(e){switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:case H.SOLIDUS:case H.GREATER_THAN_SIGN:case H.EOF:this._leaveAttrName(),this.state=Z.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case H.EQUALS_SIGN:this._leaveAttrName(),this.state=Z.BEFORE_ATTRIBUTE_VALUE;break;case H.QUOTATION_MARK:case H.APOSTROPHE:case H.LESS_THAN_SIGN:this._err(U.unexpectedCharacterInAttributeName),this.currentAttr.name+=String.fromCodePoint(e);break;case H.NULL:this._err(U.unexpectedNullCharacter),this.currentAttr.name+=`�`;break;default:this.currentAttr.name+=String.fromCodePoint(ld(e)?pd(e):e)}}_stateAfterAttributeName(e){switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:break;case H.SOLIDUS:this.state=Z.SELF_CLOSING_START_TAG;break;case H.EQUALS_SIGN:this.state=Z.BEFORE_ATTRIBUTE_VALUE;break;case H.GREATER_THAN_SIGN:this.state=Z.DATA,this.emitCurrentTagToken();break;case H.EOF:this._err(U.eofInTag),this._emitEOFToken();break;default:this._createAttr(``),this.state=Z.ATTRIBUTE_NAME,this._stateAttributeName(e)}}_stateBeforeAttributeValue(e){switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:break;case H.QUOTATION_MARK:this.state=Z.ATTRIBUTE_VALUE_DOUBLE_QUOTED;break;case H.APOSTROPHE:this.state=Z.ATTRIBUTE_VALUE_SINGLE_QUOTED;break;case H.GREATER_THAN_SIGN:this._err(U.missingAttributeValue),this.state=Z.DATA,this.emitCurrentTagToken();break;default:this.state=Z.ATTRIBUTE_VALUE_UNQUOTED,this._stateAttributeValueUnquoted(e)}}_stateAttributeValueDoubleQuoted(e){switch(e){case H.QUOTATION_MARK:this.state=Z.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case H.AMPERSAND:this._startCharacterReference();break;case H.NULL:this._err(U.unexpectedNullCharacter),this.currentAttr.value+=`�`;break;case H.EOF:this._err(U.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e)}}_stateAttributeValueSingleQuoted(e){switch(e){case H.APOSTROPHE:this.state=Z.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case H.AMPERSAND:this._startCharacterReference();break;case H.NULL:this._err(U.unexpectedNullCharacter),this.currentAttr.value+=`�`;break;case H.EOF:this._err(U.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e)}}_stateAttributeValueUnquoted(e){switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:this._leaveAttrValue(),this.state=Z.BEFORE_ATTRIBUTE_NAME;break;case H.AMPERSAND:this._startCharacterReference();break;case H.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=Z.DATA,this.emitCurrentTagToken();break;case H.NULL:this._err(U.unexpectedNullCharacter),this.currentAttr.value+=`�`;break;case H.QUOTATION_MARK:case H.APOSTROPHE:case H.LESS_THAN_SIGN:case H.EQUALS_SIGN:case H.GRAVE_ACCENT:this._err(U.unexpectedCharacterInUnquotedAttributeValue),this.currentAttr.value+=String.fromCodePoint(e);break;case H.EOF:this._err(U.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e)}}_stateAfterAttributeValueQuoted(e){switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:this._leaveAttrValue(),this.state=Z.BEFORE_ATTRIBUTE_NAME;break;case H.SOLIDUS:this._leaveAttrValue(),this.state=Z.SELF_CLOSING_START_TAG;break;case H.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=Z.DATA,this.emitCurrentTagToken();break;case H.EOF:this._err(U.eofInTag),this._emitEOFToken();break;default:this._err(U.missingWhitespaceBetweenAttributes),this.state=Z.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e)}}_stateSelfClosingStartTag(e){switch(e){case H.GREATER_THAN_SIGN:{let e=this.currentToken;e.selfClosing=!0,this.state=Z.DATA,this.emitCurrentTagToken();break}case H.EOF:this._err(U.eofInTag),this._emitEOFToken();break;default:this._err(U.unexpectedSolidusInTag),this.state=Z.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e)}}_stateBogusComment(e){let t=this.currentToken;switch(e){case H.GREATER_THAN_SIGN:this.state=Z.DATA,this.emitCurrentComment(t);break;case H.EOF:this.emitCurrentComment(t),this._emitEOFToken();break;case H.NULL:this._err(U.unexpectedNullCharacter),t.data+=`�`;break;default:t.data+=String.fromCodePoint(e)}}_stateMarkupDeclarationOpen(e){this._consumeSequenceIfMatch(Fu.DASH_DASH,!0)?(this._createCommentToken(Fu.DASH_DASH.length+1),this.state=Z.COMMENT_START):this._consumeSequenceIfMatch(Fu.DOCTYPE,!1)?(this.currentLocation=this.getCurrentLocation(Fu.DOCTYPE.length+1),this.state=Z.DOCTYPE):this._consumeSequenceIfMatch(Fu.CDATA_START,!0)?this.inForeignNode?this.state=Z.CDATA_SECTION:(this._err(U.cdataInHtmlContent),this._createCommentToken(Fu.CDATA_START.length+1),this.currentToken.data=`[CDATA[`,this.state=Z.BOGUS_COMMENT):this._ensureHibernation()||(this._err(U.incorrectlyOpenedComment),this._createCommentToken(2),this.state=Z.BOGUS_COMMENT,this._stateBogusComment(e))}_stateCommentStart(e){switch(e){case H.HYPHEN_MINUS:this.state=Z.COMMENT_START_DASH;break;case H.GREATER_THAN_SIGN:{this._err(U.abruptClosingOfEmptyComment),this.state=Z.DATA;let e=this.currentToken;this.emitCurrentComment(e);break}default:this.state=Z.COMMENT,this._stateComment(e)}}_stateCommentStartDash(e){let t=this.currentToken;switch(e){case H.HYPHEN_MINUS:this.state=Z.COMMENT_END;break;case H.GREATER_THAN_SIGN:this._err(U.abruptClosingOfEmptyComment),this.state=Z.DATA,this.emitCurrentComment(t);break;case H.EOF:this._err(U.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=`-`,this.state=Z.COMMENT,this._stateComment(e)}}_stateComment(e){let t=this.currentToken;switch(e){case H.HYPHEN_MINUS:this.state=Z.COMMENT_END_DASH;break;case H.LESS_THAN_SIGN:t.data+=`<`,this.state=Z.COMMENT_LESS_THAN_SIGN;break;case H.NULL:this._err(U.unexpectedNullCharacter),t.data+=`�`;break;case H.EOF:this._err(U.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=String.fromCodePoint(e)}}_stateCommentLessThanSign(e){let t=this.currentToken;switch(e){case H.EXCLAMATION_MARK:t.data+=`!`,this.state=Z.COMMENT_LESS_THAN_SIGN_BANG;break;case H.LESS_THAN_SIGN:t.data+=`<`;break;default:this.state=Z.COMMENT,this._stateComment(e)}}_stateCommentLessThanSignBang(e){e===H.HYPHEN_MINUS?this.state=Z.COMMENT_LESS_THAN_SIGN_BANG_DASH:(this.state=Z.COMMENT,this._stateComment(e))}_stateCommentLessThanSignBangDash(e){e===H.HYPHEN_MINUS?this.state=Z.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:(this.state=Z.COMMENT_END_DASH,this._stateCommentEndDash(e))}_stateCommentLessThanSignBangDashDash(e){e!==H.GREATER_THAN_SIGN&&e!==H.EOF&&this._err(U.nestedComment),this.state=Z.COMMENT_END,this._stateCommentEnd(e)}_stateCommentEndDash(e){let t=this.currentToken;switch(e){case H.HYPHEN_MINUS:this.state=Z.COMMENT_END;break;case H.EOF:this._err(U.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=`-`,this.state=Z.COMMENT,this._stateComment(e)}}_stateCommentEnd(e){let t=this.currentToken;switch(e){case H.GREATER_THAN_SIGN:this.state=Z.DATA,this.emitCurrentComment(t);break;case H.EXCLAMATION_MARK:this.state=Z.COMMENT_END_BANG;break;case H.HYPHEN_MINUS:t.data+=`-`;break;case H.EOF:this._err(U.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=`--`,this.state=Z.COMMENT,this._stateComment(e)}}_stateCommentEndBang(e){let t=this.currentToken;switch(e){case H.HYPHEN_MINUS:t.data+=`--!`,this.state=Z.COMMENT_END_DASH;break;case H.GREATER_THAN_SIGN:this._err(U.incorrectlyClosedComment),this.state=Z.DATA,this.emitCurrentComment(t);break;case H.EOF:this._err(U.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=`--!`,this.state=Z.COMMENT,this._stateComment(e)}}_stateDoctype(e){switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:this.state=Z.BEFORE_DOCTYPE_NAME;break;case H.GREATER_THAN_SIGN:this.state=Z.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e);break;case H.EOF:{this._err(U.eofInDoctype),this._createDoctypeToken(null);let e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._err(U.missingWhitespaceBeforeDoctypeName),this.state=Z.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e)}}_stateBeforeDoctypeName(e){if(ld(e))this._createDoctypeToken(String.fromCharCode(pd(e))),this.state=Z.DOCTYPE_NAME;else switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:break;case H.NULL:this._err(U.unexpectedNullCharacter),this._createDoctypeToken(`�`),this.state=Z.DOCTYPE_NAME;break;case H.GREATER_THAN_SIGN:{this._err(U.missingDoctypeName),this._createDoctypeToken(null);let e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this.state=Z.DATA;break}case H.EOF:{this._err(U.eofInDoctype),this._createDoctypeToken(null);let e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._createDoctypeToken(String.fromCodePoint(e)),this.state=Z.DOCTYPE_NAME}}_stateDoctypeName(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:this.state=Z.AFTER_DOCTYPE_NAME;break;case H.GREATER_THAN_SIGN:this.state=Z.DATA,this.emitCurrentDoctype(t);break;case H.NULL:this._err(U.unexpectedNullCharacter),t.name+=`�`;break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.name+=String.fromCodePoint(ld(e)?pd(e):e)}}_stateAfterDoctypeName(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:break;case H.GREATER_THAN_SIGN:this.state=Z.DATA,this.emitCurrentDoctype(t);break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._consumeSequenceIfMatch(Fu.PUBLIC,!1)?this.state=Z.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._consumeSequenceIfMatch(Fu.SYSTEM,!1)?this.state=Z.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._ensureHibernation()||(this._err(U.invalidCharacterSequenceAfterDoctypeName),t.forceQuirks=!0,this.state=Z.BOGUS_DOCTYPE,this._stateBogusDoctype(e))}}_stateAfterDoctypePublicKeyword(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:this.state=Z.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;break;case H.QUOTATION_MARK:this._err(U.missingWhitespaceAfterDoctypePublicKeyword),t.publicId=``,this.state=Z.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case H.APOSTROPHE:this._err(U.missingWhitespaceAfterDoctypePublicKeyword),t.publicId=``,this.state=Z.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case H.GREATER_THAN_SIGN:this._err(U.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=Z.DATA,this.emitCurrentDoctype(t);break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(U.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=Z.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateBeforeDoctypePublicIdentifier(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:break;case H.QUOTATION_MARK:t.publicId=``,this.state=Z.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case H.APOSTROPHE:t.publicId=``,this.state=Z.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case H.GREATER_THAN_SIGN:this._err(U.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=Z.DATA,this.emitCurrentDoctype(t);break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(U.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=Z.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateDoctypePublicIdentifierDoubleQuoted(e){let t=this.currentToken;switch(e){case H.QUOTATION_MARK:this.state=Z.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case H.NULL:this._err(U.unexpectedNullCharacter),t.publicId+=`�`;break;case H.GREATER_THAN_SIGN:this._err(U.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=Z.DATA;break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e)}}_stateDoctypePublicIdentifierSingleQuoted(e){let t=this.currentToken;switch(e){case H.APOSTROPHE:this.state=Z.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case H.NULL:this._err(U.unexpectedNullCharacter),t.publicId+=`�`;break;case H.GREATER_THAN_SIGN:this._err(U.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=Z.DATA;break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e)}}_stateAfterDoctypePublicIdentifier(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:this.state=Z.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;break;case H.GREATER_THAN_SIGN:this.state=Z.DATA,this.emitCurrentDoctype(t);break;case H.QUOTATION_MARK:this._err(U.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId=``,this.state=Z.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case H.APOSTROPHE:this._err(U.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId=``,this.state=Z.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(U.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Z.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateBetweenDoctypePublicAndSystemIdentifiers(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:break;case H.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=Z.DATA;break;case H.QUOTATION_MARK:t.systemId=``,this.state=Z.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case H.APOSTROPHE:t.systemId=``,this.state=Z.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(U.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Z.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateAfterDoctypeSystemKeyword(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:this.state=Z.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;break;case H.QUOTATION_MARK:this._err(U.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId=``,this.state=Z.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case H.APOSTROPHE:this._err(U.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId=``,this.state=Z.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case H.GREATER_THAN_SIGN:this._err(U.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Z.DATA,this.emitCurrentDoctype(t);break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(U.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Z.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateBeforeDoctypeSystemIdentifier(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:break;case H.QUOTATION_MARK:t.systemId=``,this.state=Z.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case H.APOSTROPHE:t.systemId=``,this.state=Z.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case H.GREATER_THAN_SIGN:this._err(U.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Z.DATA,this.emitCurrentDoctype(t);break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(U.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Z.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateDoctypeSystemIdentifierDoubleQuoted(e){let t=this.currentToken;switch(e){case H.QUOTATION_MARK:this.state=Z.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case H.NULL:this._err(U.unexpectedNullCharacter),t.systemId+=`�`;break;case H.GREATER_THAN_SIGN:this._err(U.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=Z.DATA;break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e)}}_stateDoctypeSystemIdentifierSingleQuoted(e){let t=this.currentToken;switch(e){case H.APOSTROPHE:this.state=Z.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case H.NULL:this._err(U.unexpectedNullCharacter),t.systemId+=`�`;break;case H.GREATER_THAN_SIGN:this._err(U.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=Z.DATA;break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e)}}_stateAfterDoctypeSystemIdentifier(e){let t=this.currentToken;switch(e){case H.SPACE:case H.LINE_FEED:case H.TABULATION:case H.FORM_FEED:break;case H.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=Z.DATA;break;case H.EOF:this._err(U.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(U.unexpectedCharacterAfterDoctypeSystemIdentifier),this.state=Z.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateBogusDoctype(e){let t=this.currentToken;switch(e){case H.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=Z.DATA;break;case H.NULL:this._err(U.unexpectedNullCharacter);break;case H.EOF:this.emitCurrentDoctype(t),this._emitEOFToken();break;default:}}_stateCdataSection(e){switch(e){case H.RIGHT_SQUARE_BRACKET:this.state=Z.CDATA_SECTION_BRACKET;break;case H.EOF:this._err(U.eofInCdata),this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateCdataSectionBracket(e){e===H.RIGHT_SQUARE_BRACKET?this.state=Z.CDATA_SECTION_END:(this._emitChars(`]`),this.state=Z.CDATA_SECTION,this._stateCdataSection(e))}_stateCdataSectionEnd(e){switch(e){case H.GREATER_THAN_SIGN:this.state=Z.DATA;break;case H.RIGHT_SQUARE_BRACKET:this._emitChars(`]`);break;default:this._emitChars(`]]`),this.state=Z.CDATA_SECTION,this._stateCdataSection(e)}}_stateCharacterReference(){let e=this.entityDecoder.write(this.preprocessor.html,this.preprocessor.pos);if(e<0)if(this.preprocessor.lastChunkWritten)e=this.entityDecoder.end();else{this.active=!1,this.preprocessor.pos=this.preprocessor.html.length-1,this.consumedAfterSnapshot=0,this.preprocessor.endOfChunkHit=!0;return}e===0?(this.preprocessor.pos=this.entityStartPos,this._flushCodePointConsumedAsCharacterReference(H.AMPERSAND),this.state=!this._isCharacterReferenceInAttribute()&&fd(this.preprocessor.peek(1))?Z.AMBIGUOUS_AMPERSAND:this.returnState):this.state=this.returnState}_stateAmbiguousAmpersand(e){fd(e)?this._flushCodePointConsumedAsCharacterReference(e):(e===H.SEMICOLON&&this._err(U.unknownNamedCharacterReference),this.state=this.returnState,this._callState(e))}},vd=new Set([Y.DD,Y.DT,Y.LI,Y.OPTGROUP,Y.OPTION,Y.P,Y.RB,Y.RP,Y.RT,Y.RTC]),yd=new Set([...vd,Y.CAPTION,Y.COLGROUP,Y.TBODY,Y.TD,Y.TFOOT,Y.TH,Y.THEAD,Y.TR]),bd=new Set([Y.APPLET,Y.CAPTION,Y.HTML,Y.MARQUEE,Y.OBJECT,Y.TABLE,Y.TD,Y.TEMPLATE,Y.TH]),xd=new Set([...bd,Y.OL,Y.UL]),Sd=new Set([...bd,Y.BUTTON]),Cd=new Set([Y.ANNOTATION_XML,Y.MI,Y.MN,Y.MO,Y.MS,Y.MTEXT]),wd=new Set([Y.DESC,Y.FOREIGN_OBJECT,Y.TITLE]),Td=new Set([Y.TR,Y.TEMPLATE,Y.HTML]),Ed=new Set([Y.TBODY,Y.TFOOT,Y.THEAD,Y.TEMPLATE,Y.HTML]),Dd=new Set([Y.TABLE,Y.TEMPLATE,Y.HTML]),Od=new Set([Y.TD,Y.TH]),kd=class{get currentTmplContentOrNode(){return this._isInTemplate()?this.treeAdapter.getTemplateContent(this.current):this.current}constructor(e,t,n){this.treeAdapter=t,this.handler=n,this.items=[],this.tagIDs=[],this.stackTop=-1,this.tmplCount=0,this.currentTagId=Y.UNKNOWN,this.current=e}_indexOf(e){return this.items.lastIndexOf(e,this.stackTop)}_isInTemplate(){return this.currentTagId===Y.TEMPLATE&&this.treeAdapter.getNamespaceURI(this.current)===q.HTML}_updateCurrentElement(){this.current=this.items[this.stackTop],this.currentTagId=this.tagIDs[this.stackTop]}push(e,t){this.stackTop++,this.items[this.stackTop]=e,this.current=e,this.tagIDs[this.stackTop]=t,this.currentTagId=t,this._isInTemplate()&&this.tmplCount++,this.handler.onItemPush(e,t,!0)}pop(){let e=this.current;this.tmplCount>0&&this._isInTemplate()&&this.tmplCount--,this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!0)}replace(e,t){let n=this._indexOf(e);this.items[n]=t,n===this.stackTop&&(this.current=t)}insertAfter(e,t,n){let r=this._indexOf(e)+1;this.items.splice(r,0,t),this.tagIDs.splice(r,0,n),this.stackTop++,r===this.stackTop&&this._updateCurrentElement(),this.current&&this.currentTagId!==void 0&&this.handler.onItemPush(this.current,this.currentTagId,r===this.stackTop)}popUntilTagNamePopped(e){let t=this.stackTop+1;do t=this.tagIDs.lastIndexOf(e,t-1);while(t>0&&this.treeAdapter.getNamespaceURI(this.items[t])!==q.HTML);this.shortenToLength(Math.max(t,0))}shortenToLength(e){for(;this.stackTop>=e;){let t=this.current;this.tmplCount>0&&this._isInTemplate()&&--this.tmplCount,this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(t,this.stackTop<e)}}popUntilElementPopped(e){let t=this._indexOf(e);this.shortenToLength(Math.max(t,0))}popUntilPopped(e,t){let n=this._indexOfTagNames(e,t);this.shortenToLength(Math.max(n,0))}popUntilNumberedHeaderPopped(){this.popUntilPopped(sd,q.HTML)}popUntilTableCellPopped(){this.popUntilPopped(Od,q.HTML)}popAllUpToHtmlElement(){this.tmplCount=0,this.shortenToLength(1)}_indexOfTagNames(e,t){for(let n=this.stackTop;n>=0;n--)if(e.has(this.tagIDs[n])&&this.treeAdapter.getNamespaceURI(this.items[n])===t)return n;return-1}clearBackTo(e,t){let n=this._indexOfTagNames(e,t);this.shortenToLength(n+1)}clearBackToTableContext(){this.clearBackTo(Dd,q.HTML)}clearBackToTableBodyContext(){this.clearBackTo(Ed,q.HTML)}clearBackToTableRowContext(){this.clearBackTo(Td,q.HTML)}remove(e){let t=this._indexOf(e);t>=0&&(t===this.stackTop?this.pop():(this.items.splice(t,1),this.tagIDs.splice(t,1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!1)))}tryPeekProperlyNestedBodyElement(){return this.stackTop>=1&&this.tagIDs[1]===Y.BODY?this.items[1]:null}contains(e){return this._indexOf(e)>-1}getCommonAncestor(e){let t=this._indexOf(e)-1;return t>=0?this.items[t]:null}isRootHtmlElementCurrent(){return this.stackTop===0&&this.tagIDs[0]===Y.HTML}hasInDynamicScope(e,t){for(let n=this.stackTop;n>=0;n--){let r=this.tagIDs[n];switch(this.treeAdapter.getNamespaceURI(this.items[n])){case q.HTML:if(r===e)return!0;if(t.has(r))return!1;break;case q.SVG:if(wd.has(r))return!1;break;case q.MATHML:if(Cd.has(r))return!1;break}}return!0}hasInScope(e){return this.hasInDynamicScope(e,bd)}hasInListItemScope(e){return this.hasInDynamicScope(e,xd)}hasInButtonScope(e){return this.hasInDynamicScope(e,Sd)}hasNumberedHeaderInScope(){for(let e=this.stackTop;e>=0;e--){let t=this.tagIDs[e];switch(this.treeAdapter.getNamespaceURI(this.items[e])){case q.HTML:if(sd.has(t))return!0;if(bd.has(t))return!1;break;case q.SVG:if(wd.has(t))return!1;break;case q.MATHML:if(Cd.has(t))return!1;break}}return!0}hasInTableScope(e){for(let t=this.stackTop;t>=0;t--)if(this.treeAdapter.getNamespaceURI(this.items[t])===q.HTML)switch(this.tagIDs[t]){case e:return!0;case Y.TABLE:case Y.HTML:return!1}return!0}hasTableBodyContextInTableScope(){for(let e=this.stackTop;e>=0;e--)if(this.treeAdapter.getNamespaceURI(this.items[e])===q.HTML)switch(this.tagIDs[e]){case Y.TBODY:case Y.THEAD:case Y.TFOOT:return!0;case Y.TABLE:case Y.HTML:return!1}return!0}hasInSelectScope(e){for(let t=this.stackTop;t>=0;t--)if(this.treeAdapter.getNamespaceURI(this.items[t])===q.HTML)switch(this.tagIDs[t]){case e:return!0;case Y.OPTION:case Y.OPTGROUP:break;default:return!1}return!0}generateImpliedEndTags(){for(;this.currentTagId!==void 0&&vd.has(this.currentTagId);)this.pop()}generateImpliedEndTagsThoroughly(){for(;this.currentTagId!==void 0&&yd.has(this.currentTagId);)this.pop()}generateImpliedEndTagsWithExclusion(e){for(;this.currentTagId!==void 0&&this.currentTagId!==e&&yd.has(this.currentTagId);)this.pop()}},Ad=3,jd;(function(e){e[e.Marker=0]=`Marker`,e[e.Element=1]=`Element`})(jd||={});var Md={type:jd.Marker},Nd=class{constructor(e){this.treeAdapter=e,this.entries=[],this.bookmark=null}_getNoahArkConditionCandidates(e,t){let n=[],r=t.length,i=this.treeAdapter.getTagName(e),a=this.treeAdapter.getNamespaceURI(e);for(let e=0;e<this.entries.length;e++){let t=this.entries[e];if(t.type===jd.Marker)break;let{element:o}=t;if(this.treeAdapter.getTagName(o)===i&&this.treeAdapter.getNamespaceURI(o)===a){let t=this.treeAdapter.getAttrList(o);t.length===r&&n.push({idx:e,attrs:t})}}return n}_ensureNoahArkCondition(e){if(this.entries.length<Ad)return;let t=this.treeAdapter.getAttrList(e),n=this._getNoahArkConditionCandidates(e,t);if(n.length<Ad)return;let r=new Map(t.map(e=>[e.name,e.value])),i=0;for(let e=0;e<n.length;e++){let t=n[e];t.attrs.every(e=>r.get(e.name)===e.value)&&(i+=1,i>=Ad&&this.entries.splice(t.idx,1))}}insertMarker(){this.entries.unshift(Md)}pushElement(e,t){this._ensureNoahArkCondition(e),this.entries.unshift({type:jd.Element,element:e,token:t})}insertElementAfterBookmark(e,t){let n=this.entries.indexOf(this.bookmark);this.entries.splice(n,0,{type:jd.Element,element:e,token:t})}removeEntry(e){let t=this.entries.indexOf(e);t!==-1&&this.entries.splice(t,1)}clearToLastMarker(){let e=this.entries.indexOf(Md);e===-1?this.entries.length=0:this.entries.splice(0,e+1)}getElementEntryInScopeWithTagName(e){let t=this.entries.find(t=>t.type===jd.Marker||this.treeAdapter.getTagName(t.element)===e);return t&&t.type===jd.Element?t:null}getElementEntry(e){return this.entries.find(t=>t.type===jd.Element&&t.element===e)}},Pd={createDocument(){return{nodeName:`#document`,mode:rd.NO_QUIRKS,childNodes:[]}},createDocumentFragment(){return{nodeName:`#document-fragment`,childNodes:[]}},createElement(e,t,n){return{nodeName:e,tagName:e,attrs:n,namespaceURI:t,childNodes:[],parentNode:null}},createCommentNode(e){return{nodeName:`#comment`,data:e,parentNode:null}},createTextNode(e){return{nodeName:`#text`,value:e,parentNode:null}},appendChild(e,t){e.childNodes.push(t),t.parentNode=e},insertBefore(e,t,n){let r=e.childNodes.indexOf(n);e.childNodes.splice(r,0,t),t.parentNode=e},setTemplateContent(e,t){e.content=t},getTemplateContent(e){return e.content},setDocumentType(e,t,n,r){let i=e.childNodes.find(e=>e.nodeName===`#documentType`);if(i)i.name=t,i.publicId=n,i.systemId=r;else{let i={nodeName:`#documentType`,name:t,publicId:n,systemId:r,parentNode:null};Pd.appendChild(e,i)}},setDocumentMode(e,t){e.mode=t},getDocumentMode(e){return e.mode},detachNode(e){if(e.parentNode){let t=e.parentNode.childNodes.indexOf(e);e.parentNode.childNodes.splice(t,1),e.parentNode=null}},insertText(e,t){if(e.childNodes.length>0){let n=e.childNodes[e.childNodes.length-1];if(Pd.isTextNode(n)){n.value+=t;return}}Pd.appendChild(e,Pd.createTextNode(t))},insertTextBefore(e,t,n){let r=e.childNodes[e.childNodes.indexOf(n)-1];r&&Pd.isTextNode(r)?r.value+=t:Pd.insertBefore(e,Pd.createTextNode(t),n)},adoptAttributes(e,t){let n=new Set(e.attrs.map(e=>e.name));for(let r=0;r<t.length;r++)n.has(t[r].name)||e.attrs.push(t[r])},getFirstChild(e){return e.childNodes[0]},getChildNodes(e){return e.childNodes},getParentNode(e){return e.parentNode},getAttrList(e){return e.attrs},getTagName(e){return e.tagName},getNamespaceURI(e){return e.namespaceURI},getTextNodeContent(e){return e.value},getCommentNodeContent(e){return e.data},getDocumentTypeNodeName(e){return e.name},getDocumentTypeNodePublicId(e){return e.publicId},getDocumentTypeNodeSystemId(e){return e.systemId},isTextNode(e){return e.nodeName===`#text`},isCommentNode(e){return e.nodeName===`#comment`},isDocumentTypeNode(e){return e.nodeName===`#documentType`},isElementNode(e){return Object.prototype.hasOwnProperty.call(e,`tagName`)},setNodeSourceCodeLocation(e,t){e.sourceCodeLocation=t},getNodeSourceCodeLocation(e){return e.sourceCodeLocation},updateNodeSourceCodeLocation(e,t){e.sourceCodeLocation={...e.sourceCodeLocation,...t}}},Fd=`html`,Id=`about:legacy-compat`,Ld=`http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd`,Rd=`+//silmaril//dtd html pro v0r11 19970101//,-//as//dtd html 3.0 aswedit + extensions//,-//advasoft ltd//dtd html 3.0 aswedit + extensions//,-//ietf//dtd html 2.0 level 1//,-//ietf//dtd html 2.0 level 2//,-//ietf//dtd html 2.0 strict level 1//,-//ietf//dtd html 2.0 strict level 2//,-//ietf//dtd html 2.0 strict//,-//ietf//dtd html 2.0//,-//ietf//dtd html 2.1e//,-//ietf//dtd html 3.0//,-//ietf//dtd html 3.2 final//,-//ietf//dtd html 3.2//,-//ietf//dtd html 3//,-//ietf//dtd html level 0//,-//ietf//dtd html level 1//,-//ietf//dtd html level 2//,-//ietf//dtd html level 3//,-//ietf//dtd html strict level 0//,-//ietf//dtd html strict level 1//,-//ietf//dtd html strict level 2//,-//ietf//dtd html strict level 3//,-//ietf//dtd html strict//,-//ietf//dtd html//,-//metrius//dtd metrius presentational//,-//microsoft//dtd internet explorer 2.0 html strict//,-//microsoft//dtd internet explorer 2.0 html//,-//microsoft//dtd internet explorer 2.0 tables//,-//microsoft//dtd internet explorer 3.0 html strict//,-//microsoft//dtd internet explorer 3.0 html//,-//microsoft//dtd internet explorer 3.0 tables//,-//netscape comm. corp.//dtd html//,-//netscape comm. corp.//dtd strict html//,-//o'reilly and associates//dtd html 2.0//,-//o'reilly and associates//dtd html extended 1.0//,-//o'reilly and associates//dtd html extended relaxed 1.0//,-//sq//dtd html 2.0 hotmetal + extensions//,-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//,-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//,-//spyglass//dtd html 2.0 extended//,-//sun microsystems corp.//dtd hotjava html//,-//sun microsystems corp.//dtd hotjava strict html//,-//w3c//dtd html 3 1995-03-24//,-//w3c//dtd html 3.2 draft//,-//w3c//dtd html 3.2 final//,-//w3c//dtd html 3.2//,-//w3c//dtd html 3.2s draft//,-//w3c//dtd html 4.0 frameset//,-//w3c//dtd html 4.0 transitional//,-//w3c//dtd html experimental 19960712//,-//w3c//dtd html experimental 970421//,-//w3c//dtd w3 html//,-//w3o//dtd w3 html 3.0//,-//webtechs//dtd mozilla html 2.0//,-//webtechs//dtd mozilla html//`.split(`,`),zd=[...Rd,`-//w3c//dtd html 4.01 frameset//`,`-//w3c//dtd html 4.01 transitional//`],Bd=new Set([`-//w3o//dtd w3 html strict 3.0//en//`,`-/w3c/dtd html 4.0 transitional/en`,`html`]),Vd=[`-//w3c//dtd xhtml 1.0 frameset//`,`-//w3c//dtd xhtml 1.0 transitional//`],Hd=[...Vd,`-//w3c//dtd html 4.01 frameset//`,`-//w3c//dtd html 4.01 transitional//`];function Ud(e,t){return t.some(t=>e.startsWith(t))}function Wd(e){return e.name===Fd&&e.publicId===null&&(e.systemId===null||e.systemId===Id)}function Gd(e){if(e.name!==Fd)return rd.QUIRKS;let{systemId:t}=e;if(t&&t.toLowerCase()===Ld)return rd.QUIRKS;let{publicId:n}=e;if(n!==null){if(n=n.toLowerCase(),Bd.has(n))return rd.QUIRKS;let e=t===null?zd:Rd;if(Ud(n,e))return rd.QUIRKS;if(e=t===null?Vd:Hd,Ud(n,e))return rd.LIMITED_QUIRKS}return rd.NO_QUIRKS}var Kd={TEXT_HTML:`text/html`,APPLICATION_XML:`application/xhtml+xml`},qd=`definitionurl`,Jd=`definitionURL`,Yd=new Map(`attributeName.attributeType.baseFrequency.baseProfile.calcMode.clipPathUnits.diffuseConstant.edgeMode.filterUnits.glyphRef.gradientTransform.gradientUnits.kernelMatrix.kernelUnitLength.keyPoints.keySplines.keyTimes.lengthAdjust.limitingConeAngle.markerHeight.markerUnits.markerWidth.maskContentUnits.maskUnits.numOctaves.pathLength.patternContentUnits.patternTransform.patternUnits.pointsAtX.pointsAtY.pointsAtZ.preserveAlpha.preserveAspectRatio.primitiveUnits.refX.refY.repeatCount.repeatDur.requiredExtensions.requiredFeatures.specularConstant.specularExponent.spreadMethod.startOffset.stdDeviation.stitchTiles.surfaceScale.systemLanguage.tableValues.targetX.targetY.textLength.viewBox.viewTarget.xChannelSelector.yChannelSelector.zoomAndPan`.split(`.`).map(e=>[e.toLowerCase(),e])),Xd=new Map([[`xlink:actuate`,{prefix:`xlink`,name:`actuate`,namespace:q.XLINK}],[`xlink:arcrole`,{prefix:`xlink`,name:`arcrole`,namespace:q.XLINK}],[`xlink:href`,{prefix:`xlink`,name:`href`,namespace:q.XLINK}],[`xlink:role`,{prefix:`xlink`,name:`role`,namespace:q.XLINK}],[`xlink:show`,{prefix:`xlink`,name:`show`,namespace:q.XLINK}],[`xlink:title`,{prefix:`xlink`,name:`title`,namespace:q.XLINK}],[`xlink:type`,{prefix:`xlink`,name:`type`,namespace:q.XLINK}],[`xml:lang`,{prefix:`xml`,name:`lang`,namespace:q.XML}],[`xml:space`,{prefix:`xml`,name:`space`,namespace:q.XML}],[`xmlns`,{prefix:``,name:`xmlns`,namespace:q.XMLNS}],[`xmlns:xlink`,{prefix:`xmlns`,name:`xlink`,namespace:q.XMLNS}]]),Zd=new Map(`altGlyph.altGlyphDef.altGlyphItem.animateColor.animateMotion.animateTransform.clipPath.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.foreignObject.glyphRef.linearGradient.radialGradient.textPath`.split(`.`).map(e=>[e.toLowerCase(),e])),Qd=new Set([Y.B,Y.BIG,Y.BLOCKQUOTE,Y.BODY,Y.BR,Y.CENTER,Y.CODE,Y.DD,Y.DIV,Y.DL,Y.DT,Y.EM,Y.EMBED,Y.H1,Y.H2,Y.H3,Y.H4,Y.H5,Y.H6,Y.HEAD,Y.HR,Y.I,Y.IMG,Y.LI,Y.LISTING,Y.MENU,Y.META,Y.NOBR,Y.OL,Y.P,Y.PRE,Y.RUBY,Y.S,Y.SMALL,Y.SPAN,Y.STRONG,Y.STRIKE,Y.SUB,Y.SUP,Y.TABLE,Y.TT,Y.U,Y.UL,Y.VAR]);function $d(e){let t=e.tagID;return t===Y.FONT&&e.attrs.some(({name:e})=>e===nd.COLOR||e===nd.SIZE||e===nd.FACE)||Qd.has(t)}function ef(e){for(let t=0;t<e.attrs.length;t++)if(e.attrs[t].name===qd){e.attrs[t].name=Jd;break}}function tf(e){for(let t=0;t<e.attrs.length;t++){let n=Yd.get(e.attrs[t].name);n!=null&&(e.attrs[t].name=n)}}function nf(e){for(let t=0;t<e.attrs.length;t++){let n=Xd.get(e.attrs[t].name);n&&(e.attrs[t].prefix=n.prefix,e.attrs[t].name=n.name,e.attrs[t].namespace=n.namespace)}}function rf(e){let t=Zd.get(e.tagName);t!=null&&(e.tagName=t,e.tagID=ad(e.tagName))}function af(e,t){return t===q.MATHML&&(e===Y.MI||e===Y.MO||e===Y.MN||e===Y.MS||e===Y.MTEXT)}function of(e,t,n){if(t===q.MATHML&&e===Y.ANNOTATION_XML){for(let e=0;e<n.length;e++)if(n[e].name===nd.ENCODING){let t=n[e].value.toLowerCase();return t===Kd.TEXT_HTML||t===Kd.APPLICATION_XML}}return t===q.SVG&&(e===Y.FOREIGN_OBJECT||e===Y.DESC||e===Y.TITLE)}function sf(e,t,n,r){return(!r||r===q.HTML)&&of(e,t,n)||(!r||r===q.MATHML)&&af(e,t)}var cf=`hidden`,lf=8,uf=3,$;(function(e){e[e.INITIAL=0]=`INITIAL`,e[e.BEFORE_HTML=1]=`BEFORE_HTML`,e[e.BEFORE_HEAD=2]=`BEFORE_HEAD`,e[e.IN_HEAD=3]=`IN_HEAD`,e[e.IN_HEAD_NO_SCRIPT=4]=`IN_HEAD_NO_SCRIPT`,e[e.AFTER_HEAD=5]=`AFTER_HEAD`,e[e.IN_BODY=6]=`IN_BODY`,e[e.TEXT=7]=`TEXT`,e[e.IN_TABLE=8]=`IN_TABLE`,e[e.IN_TABLE_TEXT=9]=`IN_TABLE_TEXT`,e[e.IN_CAPTION=10]=`IN_CAPTION`,e[e.IN_COLUMN_GROUP=11]=`IN_COLUMN_GROUP`,e[e.IN_TABLE_BODY=12]=`IN_TABLE_BODY`,e[e.IN_ROW=13]=`IN_ROW`,e[e.IN_CELL=14]=`IN_CELL`,e[e.IN_SELECT=15]=`IN_SELECT`,e[e.IN_SELECT_IN_TABLE=16]=`IN_SELECT_IN_TABLE`,e[e.IN_TEMPLATE=17]=`IN_TEMPLATE`,e[e.AFTER_BODY=18]=`AFTER_BODY`,e[e.IN_FRAMESET=19]=`IN_FRAMESET`,e[e.AFTER_FRAMESET=20]=`AFTER_FRAMESET`,e[e.AFTER_AFTER_BODY=21]=`AFTER_AFTER_BODY`,e[e.AFTER_AFTER_FRAMESET=22]=`AFTER_AFTER_FRAMESET`})($||={});var df={startLine:-1,startCol:-1,startOffset:-1,endLine:-1,endCol:-1,endOffset:-1},ff=new Set([Y.TABLE,Y.TBODY,Y.TFOOT,Y.THEAD,Y.TR]),pf={scriptingEnabled:!0,sourceCodeLocationInfo:!1,treeAdapter:Pd,onParseError:null},mf=class{constructor(e,t,n=null,r=null){this.fragmentContext=n,this.scriptHandler=r,this.currentToken=null,this.stopped=!1,this.insertionMode=$.INITIAL,this.originalInsertionMode=$.INITIAL,this.headElement=null,this.formElement=null,this.currentNotInHTML=!1,this.tmplInsertionModeStack=[],this.pendingCharacterTokens=[],this.hasNonWhitespacePendingCharacterToken=!1,this.framesetOk=!0,this.skipNextNewLine=!1,this.fosterParentingEnabled=!1,this.options={...pf,...e},this.treeAdapter=this.options.treeAdapter,this.onParseError=this.options.onParseError,this.onParseError&&(this.options.sourceCodeLocationInfo=!0),this.document=t??this.treeAdapter.createDocument(),this.tokenizer=new _d(this.options,this),this.activeFormattingElements=new Nd(this.treeAdapter),this.fragmentContextID=n?ad(this.treeAdapter.getTagName(n)):Y.UNKNOWN,this._setContextModes(n??this.document,this.fragmentContextID),this.openElements=new kd(this.document,this.treeAdapter,this)}static parse(e,t){let n=new this(t);return n.tokenizer.write(e,!0),n.document}static getFragmentParser(e,t){let n={...pf,...t};e??=n.treeAdapter.createElement(J.TEMPLATE,q.HTML,[]);let r=n.treeAdapter.createElement(`documentmock`,q.HTML,[]),i=new this(n,r,e);return i.fragmentContextID===Y.TEMPLATE&&i.tmplInsertionModeStack.unshift($.IN_TEMPLATE),i._initTokenizerForFragmentParsing(),i._insertFakeRootElement(),i._resetInsertionMode(),i._findFormInFragmentContext(),i}getFragment(){let e=this.treeAdapter.getFirstChild(this.document),t=this.treeAdapter.createDocumentFragment();return this._adoptNodes(e,t),t}_err(e,t,n){if(!this.onParseError)return;let r=e.location??df,i={code:t,startLine:r.startLine,startCol:r.startCol,startOffset:r.startOffset,endLine:n?r.startLine:r.endLine,endCol:n?r.startCol:r.endCol,endOffset:n?r.startOffset:r.endOffset};this.onParseError(i)}onItemPush(e,t,n){var r,i;(i=(r=this.treeAdapter).onItemPush)==null||i.call(r,e),n&&this.openElements.stackTop>0&&this._setContextModes(e,t)}onItemPop(e,t){var n,r;if(this.options.sourceCodeLocationInfo&&this._setEndLocation(e,this.currentToken),(r=(n=this.treeAdapter).onItemPop)==null||r.call(n,e,this.openElements.current),t){let e,t;this.openElements.stackTop===0&&this.fragmentContext?(e=this.fragmentContext,t=this.fragmentContextID):{current:e,currentTagId:t}=this.openElements,this._setContextModes(e,t)}}_setContextModes(e,t){let n=e===this.document||e&&this.treeAdapter.getNamespaceURI(e)===q.HTML;this.currentNotInHTML=!n,this.tokenizer.inForeignNode=!n&&e!==void 0&&t!==void 0&&!this._isIntegrationPoint(t,e)}_switchToTextParsing(e,t){this._insertElement(e,q.HTML),this.tokenizer.state=t,this.originalInsertionMode=this.insertionMode,this.insertionMode=$.TEXT}switchToPlaintextParsing(){this.insertionMode=$.TEXT,this.originalInsertionMode=$.IN_BODY,this.tokenizer.state=Q.PLAINTEXT}_getAdjustedCurrentElement(){return this.openElements.stackTop===0&&this.fragmentContext?this.fragmentContext:this.openElements.current}_findFormInFragmentContext(){let e=this.fragmentContext;for(;e;){if(this.treeAdapter.getTagName(e)===J.FORM){this.formElement=e;break}e=this.treeAdapter.getParentNode(e)}}_initTokenizerForFragmentParsing(){if(!(!this.fragmentContext||this.treeAdapter.getNamespaceURI(this.fragmentContext)!==q.HTML))switch(this.fragmentContextID){case Y.TITLE:case Y.TEXTAREA:this.tokenizer.state=Q.RCDATA;break;case Y.STYLE:case Y.XMP:case Y.IFRAME:case Y.NOEMBED:case Y.NOFRAMES:case Y.NOSCRIPT:this.tokenizer.state=Q.RAWTEXT;break;case Y.SCRIPT:this.tokenizer.state=Q.SCRIPT_DATA;break;case Y.PLAINTEXT:this.tokenizer.state=Q.PLAINTEXT;break;default:}}_setDocumentType(e){let t=e.name||``,n=e.publicId||``,r=e.systemId||``;if(this.treeAdapter.setDocumentType(this.document,t,n,r),e.location){let t=this.treeAdapter.getChildNodes(this.document).find(e=>this.treeAdapter.isDocumentTypeNode(e));t&&this.treeAdapter.setNodeSourceCodeLocation(t,e.location)}}_attachElementToTree(e,t){if(this.options.sourceCodeLocationInfo){let n=t&&{...t,startTag:t};this.treeAdapter.setNodeSourceCodeLocation(e,n)}if(this._shouldFosterParentOnInsertion())this._fosterParentElement(e);else{let t=this.openElements.currentTmplContentOrNode;this.treeAdapter.appendChild(t??this.document,e)}}_appendElement(e,t){let n=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(n,e.location)}_insertElement(e,t){let n=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(n,e.location),this.openElements.push(n,e.tagID)}_insertFakeElement(e,t){let n=this.treeAdapter.createElement(e,q.HTML,[]);this._attachElementToTree(n,null),this.openElements.push(n,t)}_insertTemplate(e){let t=this.treeAdapter.createElement(e.tagName,q.HTML,e.attrs),n=this.treeAdapter.createDocumentFragment();this.treeAdapter.setTemplateContent(t,n),this._attachElementToTree(t,e.location),this.openElements.push(t,e.tagID),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(n,null)}_insertFakeRootElement(){let e=this.treeAdapter.createElement(J.HTML,q.HTML,[]);this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(e,null),this.treeAdapter.appendChild(this.openElements.current,e),this.openElements.push(e,Y.HTML)}_appendCommentNode(e,t){let n=this.treeAdapter.createCommentNode(e.data);this.treeAdapter.appendChild(t,n),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(n,e.location)}_insertCharacters(e){let t,n;if(this._shouldFosterParentOnInsertion()?({parent:t,beforeElement:n}=this._findFosterParentingLocation(),n?this.treeAdapter.insertTextBefore(t,e.chars,n):this.treeAdapter.insertText(t,e.chars)):(t=this.openElements.currentTmplContentOrNode,this.treeAdapter.insertText(t,e.chars)),!e.location)return;let r=this.treeAdapter.getChildNodes(t),i=r[(n?r.lastIndexOf(n):r.length)-1];if(this.treeAdapter.getNodeSourceCodeLocation(i)){let{endLine:t,endCol:n,endOffset:r}=e.location;this.treeAdapter.updateNodeSourceCodeLocation(i,{endLine:t,endCol:n,endOffset:r})}else this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(i,e.location)}_adoptNodes(e,t){for(let n=this.treeAdapter.getFirstChild(e);n;n=this.treeAdapter.getFirstChild(e))this.treeAdapter.detachNode(n),this.treeAdapter.appendChild(t,n)}_setEndLocation(e,t){if(this.treeAdapter.getNodeSourceCodeLocation(e)&&t.location){let n=t.location,r=this.treeAdapter.getTagName(e),i=t.type===W.END_TAG&&r===t.tagName?{endTag:{...n},endLine:n.endLine,endCol:n.endCol,endOffset:n.endOffset}:{endLine:n.startLine,endCol:n.startCol,endOffset:n.startOffset};this.treeAdapter.updateNodeSourceCodeLocation(e,i)}}shouldProcessStartTagTokenInForeignContent(e){if(!this.currentNotInHTML)return!1;let t,n;return this.openElements.stackTop===0&&this.fragmentContext?(t=this.fragmentContext,n=this.fragmentContextID):{current:t,currentTagId:n}=this.openElements,e.tagID===Y.SVG&&this.treeAdapter.getTagName(t)===J.ANNOTATION_XML&&this.treeAdapter.getNamespaceURI(t)===q.MATHML?!1:this.tokenizer.inForeignNode||(e.tagID===Y.MGLYPH||e.tagID===Y.MALIGNMARK)&&n!==void 0&&!this._isIntegrationPoint(n,t,q.HTML)}_processToken(e){switch(e.type){case W.CHARACTER:this.onCharacter(e);break;case W.NULL_CHARACTER:this.onNullCharacter(e);break;case W.COMMENT:this.onComment(e);break;case W.DOCTYPE:this.onDoctype(e);break;case W.START_TAG:this._processStartTag(e);break;case W.END_TAG:this.onEndTag(e);break;case W.EOF:this.onEof(e);break;case W.WHITESPACE_CHARACTER:this.onWhitespaceCharacter(e);break}}_isIntegrationPoint(e,t,n){return sf(e,this.treeAdapter.getNamespaceURI(t),this.treeAdapter.getAttrList(t),n)}_reconstructActiveFormattingElements(){let e=this.activeFormattingElements.entries.length;if(e){let t=this.activeFormattingElements.entries.findIndex(e=>e.type===jd.Marker||this.openElements.contains(e.element)),n=t===-1?e-1:t-1;for(let e=n;e>=0;e--){let t=this.activeFormattingElements.entries[e];this._insertElement(t.token,this.treeAdapter.getNamespaceURI(t.element)),t.element=this.openElements.current}}}_closeTableCell(){this.openElements.generateImpliedEndTags(),this.openElements.popUntilTableCellPopped(),this.activeFormattingElements.clearToLastMarker(),this.insertionMode=$.IN_ROW}_closePElement(){this.openElements.generateImpliedEndTagsWithExclusion(Y.P),this.openElements.popUntilTagNamePopped(Y.P)}_resetInsertionMode(){for(let e=this.openElements.stackTop;e>=0;e--)switch(e===0&&this.fragmentContext?this.fragmentContextID:this.openElements.tagIDs[e]){case Y.TR:this.insertionMode=$.IN_ROW;return;case Y.TBODY:case Y.THEAD:case Y.TFOOT:this.insertionMode=$.IN_TABLE_BODY;return;case Y.CAPTION:this.insertionMode=$.IN_CAPTION;return;case Y.COLGROUP:this.insertionMode=$.IN_COLUMN_GROUP;return;case Y.TABLE:this.insertionMode=$.IN_TABLE;return;case Y.BODY:this.insertionMode=$.IN_BODY;return;case Y.FRAMESET:this.insertionMode=$.IN_FRAMESET;return;case Y.SELECT:this._resetInsertionModeForSelect(e);return;case Y.TEMPLATE:this.insertionMode=this.tmplInsertionModeStack[0];return;case Y.HTML:this.insertionMode=this.headElement?$.AFTER_HEAD:$.BEFORE_HEAD;return;case Y.TD:case Y.TH:if(e>0){this.insertionMode=$.IN_CELL;return}break;case Y.HEAD:if(e>0){this.insertionMode=$.IN_HEAD;return}break}this.insertionMode=$.IN_BODY}_resetInsertionModeForSelect(e){if(e>0)for(let t=e-1;t>0;t--){let e=this.openElements.tagIDs[t];if(e===Y.TEMPLATE)break;if(e===Y.TABLE){this.insertionMode=$.IN_SELECT_IN_TABLE;return}}this.insertionMode=$.IN_SELECT}_isElementCausesFosterParenting(e){return ff.has(e)}_shouldFosterParentOnInsertion(){return this.fosterParentingEnabled&&this.openElements.currentTagId!==void 0&&this._isElementCausesFosterParenting(this.openElements.currentTagId)}_findFosterParentingLocation(){for(let e=this.openElements.stackTop;e>=0;e--){let t=this.openElements.items[e];switch(this.openElements.tagIDs[e]){case Y.TEMPLATE:if(this.treeAdapter.getNamespaceURI(t)===q.HTML)return{parent:this.treeAdapter.getTemplateContent(t),beforeElement:null};break;case Y.TABLE:{let n=this.treeAdapter.getParentNode(t);return n?{parent:n,beforeElement:t}:{parent:this.openElements.items[e-1],beforeElement:null}}default:}}return{parent:this.openElements.items[0],beforeElement:null}}_fosterParentElement(e){let t=this._findFosterParentingLocation();t.beforeElement?this.treeAdapter.insertBefore(t.parent,e,t.beforeElement):this.treeAdapter.appendChild(t.parent,e)}_isSpecialElement(e,t){return od[this.treeAdapter.getNamespaceURI(e)].has(t)}onCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode){Mm(this,e);return}switch(this.insertionMode){case $.INITIAL:Df(this,e);break;case $.BEFORE_HTML:Af(this,e);break;case $.BEFORE_HEAD:Nf(this,e);break;case $.IN_HEAD:Lf(this,e);break;case $.IN_HEAD_NO_SCRIPT:Bf(this,e);break;case $.AFTER_HEAD:Uf(this,e);break;case $.IN_BODY:case $.IN_CAPTION:case $.IN_CELL:case $.IN_TEMPLATE:Kf(this,e);break;case $.TEXT:case $.IN_SELECT:case $.IN_SELECT_IN_TABLE:this._insertCharacters(e);break;case $.IN_TABLE:case $.IN_TABLE_BODY:case $.IN_ROW:Vp(this,e);break;case $.IN_TABLE_TEXT:em(this,e);break;case $.IN_COLUMN_GROUP:sm(this,e);break;case $.AFTER_BODY:Cm(this,e);break;case $.AFTER_AFTER_BODY:km(this,e);break;default:}}onNullCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode){jm(this,e);return}switch(this.insertionMode){case $.INITIAL:Df(this,e);break;case $.BEFORE_HTML:Af(this,e);break;case $.BEFORE_HEAD:Nf(this,e);break;case $.IN_HEAD:Lf(this,e);break;case $.IN_HEAD_NO_SCRIPT:Bf(this,e);break;case $.AFTER_HEAD:Uf(this,e);break;case $.TEXT:this._insertCharacters(e);break;case $.IN_TABLE:case $.IN_TABLE_BODY:case $.IN_ROW:Vp(this,e);break;case $.IN_COLUMN_GROUP:sm(this,e);break;case $.AFTER_BODY:Cm(this,e);break;case $.AFTER_AFTER_BODY:km(this,e);break;default:}}onComment(e){if(this.skipNextNewLine=!1,this.currentNotInHTML){Sf(this,e);return}switch(this.insertionMode){case $.INITIAL:case $.BEFORE_HTML:case $.BEFORE_HEAD:case $.IN_HEAD:case $.IN_HEAD_NO_SCRIPT:case $.AFTER_HEAD:case $.IN_BODY:case $.IN_TABLE:case $.IN_CAPTION:case $.IN_COLUMN_GROUP:case $.IN_TABLE_BODY:case $.IN_ROW:case $.IN_CELL:case $.IN_SELECT:case $.IN_SELECT_IN_TABLE:case $.IN_TEMPLATE:case $.IN_FRAMESET:case $.AFTER_FRAMESET:Sf(this,e);break;case $.IN_TABLE_TEXT:tm(this,e);break;case $.AFTER_BODY:Cf(this,e);break;case $.AFTER_AFTER_BODY:case $.AFTER_AFTER_FRAMESET:wf(this,e);break;default:}}onDoctype(e){switch(this.skipNextNewLine=!1,this.insertionMode){case $.INITIAL:Ef(this,e);break;case $.BEFORE_HEAD:case $.IN_HEAD:case $.IN_HEAD_NO_SCRIPT:case $.AFTER_HEAD:this._err(e,U.misplacedDoctype);break;case $.IN_TABLE_TEXT:tm(this,e);break;default:}}onStartTag(e){this.skipNextNewLine=!1,this.currentToken=e,this._processStartTag(e),e.selfClosing&&!e.ackSelfClosing&&this._err(e,U.nonVoidHtmlElementStartTagWithTrailingSolidus)}_processStartTag(e){this.shouldProcessStartTagTokenInForeignContent(e)?Pm(this,e):this._startTagOutsideForeignContent(e)}_startTagOutsideForeignContent(e){switch(this.insertionMode){case $.INITIAL:Df(this,e);break;case $.BEFORE_HTML:Of(this,e);break;case $.BEFORE_HEAD:jf(this,e);break;case $.IN_HEAD:Pf(this,e);break;case $.IN_HEAD_NO_SCRIPT:Rf(this,e);break;case $.AFTER_HEAD:Vf(this,e);break;case $.IN_BODY:Tp(this,e);break;case $.IN_TABLE:Xp(this,e);break;case $.IN_TABLE_TEXT:tm(this,e);break;case $.IN_CAPTION:rm(this,e);break;case $.IN_COLUMN_GROUP:am(this,e);break;case $.IN_TABLE_BODY:cm(this,e);break;case $.IN_ROW:um(this,e);break;case $.IN_CELL:fm(this,e);break;case $.IN_SELECT:mm(this,e);break;case $.IN_SELECT_IN_TABLE:gm(this,e);break;case $.IN_TEMPLATE:vm(this,e);break;case $.AFTER_BODY:xm(this,e);break;case $.IN_FRAMESET:wm(this,e);break;case $.AFTER_FRAMESET:Em(this,e);break;case $.AFTER_AFTER_BODY:Om(this,e);break;case $.AFTER_AFTER_FRAMESET:Am(this,e);break;default:}}onEndTag(e){this.skipNextNewLine=!1,this.currentToken=e,this.currentNotInHTML?Fm(this,e):this._endTagOutsideForeignContent(e)}_endTagOutsideForeignContent(e){switch(this.insertionMode){case $.INITIAL:Df(this,e);break;case $.BEFORE_HTML:kf(this,e);break;case $.BEFORE_HEAD:Mf(this,e);break;case $.IN_HEAD:Ff(this,e);break;case $.IN_HEAD_NO_SCRIPT:zf(this,e);break;case $.AFTER_HEAD:Hf(this,e);break;case $.IN_BODY:Lp(this,e);break;case $.TEXT:zp(this,e);break;case $.IN_TABLE:Zp(this,e);break;case $.IN_TABLE_TEXT:tm(this,e);break;case $.IN_CAPTION:im(this,e);break;case $.IN_COLUMN_GROUP:om(this,e);break;case $.IN_TABLE_BODY:lm(this,e);break;case $.IN_ROW:dm(this,e);break;case $.IN_CELL:pm(this,e);break;case $.IN_SELECT:hm(this,e);break;case $.IN_SELECT_IN_TABLE:_m(this,e);break;case $.IN_TEMPLATE:ym(this,e);break;case $.AFTER_BODY:Sm(this,e);break;case $.IN_FRAMESET:Tm(this,e);break;case $.AFTER_FRAMESET:Dm(this,e);break;case $.AFTER_AFTER_BODY:km(this,e);break;default:}}onEof(e){switch(this.insertionMode){case $.INITIAL:Df(this,e);break;case $.BEFORE_HTML:Af(this,e);break;case $.BEFORE_HEAD:Nf(this,e);break;case $.IN_HEAD:Lf(this,e);break;case $.IN_HEAD_NO_SCRIPT:Bf(this,e);break;case $.AFTER_HEAD:Uf(this,e);break;case $.IN_BODY:case $.IN_TABLE:case $.IN_CAPTION:case $.IN_COLUMN_GROUP:case $.IN_TABLE_BODY:case $.IN_ROW:case $.IN_CELL:case $.IN_SELECT:case $.IN_SELECT_IN_TABLE:Rp(this,e);break;case $.TEXT:Bp(this,e);break;case $.IN_TABLE_TEXT:tm(this,e);break;case $.IN_TEMPLATE:bm(this,e);break;case $.AFTER_BODY:case $.IN_FRAMESET:case $.AFTER_FRAMESET:case $.AFTER_AFTER_BODY:case $.AFTER_AFTER_FRAMESET:Tf(this,e);break;default:}}onWhitespaceCharacter(e){if(this.skipNextNewLine&&(this.skipNextNewLine=!1,e.chars.charCodeAt(0)===H.LINE_FEED)){if(e.chars.length===1)return;e.chars=e.chars.substr(1)}if(this.tokenizer.inForeignNode){this._insertCharacters(e);return}switch(this.insertionMode){case $.IN_HEAD:case $.IN_HEAD_NO_SCRIPT:case $.AFTER_HEAD:case $.TEXT:case $.IN_COLUMN_GROUP:case $.IN_SELECT:case $.IN_SELECT_IN_TABLE:case $.IN_FRAMESET:case $.AFTER_FRAMESET:this._insertCharacters(e);break;case $.IN_BODY:case $.IN_CAPTION:case $.IN_CELL:case $.IN_TEMPLATE:case $.AFTER_BODY:case $.AFTER_AFTER_BODY:case $.AFTER_AFTER_FRAMESET:Gf(this,e);break;case $.IN_TABLE:case $.IN_TABLE_BODY:case $.IN_ROW:Vp(this,e);break;case $.IN_TABLE_TEXT:$p(this,e);break;default:}}};function hf(e,t){let n=e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);return n?e.openElements.contains(n.element)?e.openElements.hasInScope(t.tagID)||(n=null):(e.activeFormattingElements.removeEntry(n),n=null):Ip(e,t),n}function gf(e,t){let n=null,r=e.openElements.stackTop;for(;r>=0;r--){let i=e.openElements.items[r];if(i===t.element)break;e._isSpecialElement(i,e.openElements.tagIDs[r])&&(n=i)}return n||(e.openElements.shortenToLength(Math.max(r,0)),e.activeFormattingElements.removeEntry(t)),n}function _f(e,t,n){let r=t,i=e.openElements.getCommonAncestor(t);for(let a=0,o=i;o!==n;a++,o=i){i=e.openElements.getCommonAncestor(o);let n=e.activeFormattingElements.getElementEntry(o),s=n&&a>=uf;!n||s?(s&&e.activeFormattingElements.removeEntry(n),e.openElements.remove(o)):(o=vf(e,n),r===t&&(e.activeFormattingElements.bookmark=n),e.treeAdapter.detachNode(r),e.treeAdapter.appendChild(o,r),r=o)}return r}function vf(e,t){let n=e.treeAdapter.getNamespaceURI(t.element),r=e.treeAdapter.createElement(t.token.tagName,n,t.token.attrs);return e.openElements.replace(t.element,r),t.element=r,r}function yf(e,t,n){let r=ad(e.treeAdapter.getTagName(t));if(e._isElementCausesFosterParenting(r))e._fosterParentElement(n);else{let i=e.treeAdapter.getNamespaceURI(t);r===Y.TEMPLATE&&i===q.HTML&&(t=e.treeAdapter.getTemplateContent(t)),e.treeAdapter.appendChild(t,n)}}function bf(e,t,n){let r=e.treeAdapter.getNamespaceURI(n.element),{token:i}=n,a=e.treeAdapter.createElement(i.tagName,r,i.attrs);e._adoptNodes(t,a),e.treeAdapter.appendChild(t,a),e.activeFormattingElements.insertElementAfterBookmark(a,i),e.activeFormattingElements.removeEntry(n),e.openElements.remove(n.element),e.openElements.insertAfter(t,a,i.tagID)}function xf(e,t){for(let n=0;n<lf;n++){let n=hf(e,t);if(!n)break;let r=gf(e,n);if(!r)break;e.activeFormattingElements.bookmark=n;let i=_f(e,r,n.element),a=e.openElements.getCommonAncestor(n.element);e.treeAdapter.detachNode(i),a&&yf(e,a,i),bf(e,r,n)}}function Sf(e,t){e._appendCommentNode(t,e.openElements.currentTmplContentOrNode)}function Cf(e,t){e._appendCommentNode(t,e.openElements.items[0])}function wf(e,t){e._appendCommentNode(t,e.document)}function Tf(e,t){if(e.stopped=!0,t.location){let n=e.fragmentContext?0:2;for(let r=e.openElements.stackTop;r>=n;r--)e._setEndLocation(e.openElements.items[r],t);if(!e.fragmentContext&&e.openElements.stackTop>=0){let n=e.openElements.items[0],r=e.treeAdapter.getNodeSourceCodeLocation(n);if(r&&!r.endTag&&(e._setEndLocation(n,t),e.openElements.stackTop>=1)){let n=e.openElements.items[1],r=e.treeAdapter.getNodeSourceCodeLocation(n);r&&!r.endTag&&e._setEndLocation(n,t)}}}}function Ef(e,t){e._setDocumentType(t);let n=t.forceQuirks?rd.QUIRKS:Gd(t);Wd(t)||e._err(t,U.nonConformingDoctype),e.treeAdapter.setDocumentMode(e.document,n),e.insertionMode=$.BEFORE_HTML}function Df(e,t){e._err(t,U.missingDoctype,!0),e.treeAdapter.setDocumentMode(e.document,rd.QUIRKS),e.insertionMode=$.BEFORE_HTML,e._processToken(t)}function Of(e,t){t.tagID===Y.HTML?(e._insertElement(t,q.HTML),e.insertionMode=$.BEFORE_HEAD):Af(e,t)}function kf(e,t){let n=t.tagID;(n===Y.HTML||n===Y.HEAD||n===Y.BODY||n===Y.BR)&&Af(e,t)}function Af(e,t){e._insertFakeRootElement(),e.insertionMode=$.BEFORE_HEAD,e._processToken(t)}function jf(e,t){switch(t.tagID){case Y.HTML:Tp(e,t);break;case Y.HEAD:e._insertElement(t,q.HTML),e.headElement=e.openElements.current,e.insertionMode=$.IN_HEAD;break;default:Nf(e,t)}}function Mf(e,t){let n=t.tagID;n===Y.HEAD||n===Y.BODY||n===Y.HTML||n===Y.BR?Nf(e,t):e._err(t,U.endTagWithoutMatchingOpenElement)}function Nf(e,t){e._insertFakeElement(J.HEAD,Y.HEAD),e.headElement=e.openElements.current,e.insertionMode=$.IN_HEAD,e._processToken(t)}function Pf(e,t){switch(t.tagID){case Y.HTML:Tp(e,t);break;case Y.BASE:case Y.BASEFONT:case Y.BGSOUND:case Y.LINK:case Y.META:e._appendElement(t,q.HTML),t.ackSelfClosing=!0;break;case Y.TITLE:e._switchToTextParsing(t,Q.RCDATA);break;case Y.NOSCRIPT:e.options.scriptingEnabled?e._switchToTextParsing(t,Q.RAWTEXT):(e._insertElement(t,q.HTML),e.insertionMode=$.IN_HEAD_NO_SCRIPT);break;case Y.NOFRAMES:case Y.STYLE:e._switchToTextParsing(t,Q.RAWTEXT);break;case Y.SCRIPT:e._switchToTextParsing(t,Q.SCRIPT_DATA);break;case Y.TEMPLATE:e._insertTemplate(t),e.activeFormattingElements.insertMarker(),e.framesetOk=!1,e.insertionMode=$.IN_TEMPLATE,e.tmplInsertionModeStack.unshift($.IN_TEMPLATE);break;case Y.HEAD:e._err(t,U.misplacedStartTagForHeadElement);break;default:Lf(e,t)}}function Ff(e,t){switch(t.tagID){case Y.HEAD:e.openElements.pop(),e.insertionMode=$.AFTER_HEAD;break;case Y.BODY:case Y.BR:case Y.HTML:Lf(e,t);break;case Y.TEMPLATE:If(e,t);break;default:e._err(t,U.endTagWithoutMatchingOpenElement)}}function If(e,t){e.openElements.tmplCount>0?(e.openElements.generateImpliedEndTagsThoroughly(),e.openElements.currentTagId!==Y.TEMPLATE&&e._err(t,U.closingOfElementWithOpenChildElements),e.openElements.popUntilTagNamePopped(Y.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode()):e._err(t,U.endTagWithoutMatchingOpenElement)}function Lf(e,t){e.openElements.pop(),e.insertionMode=$.AFTER_HEAD,e._processToken(t)}function Rf(e,t){switch(t.tagID){case Y.HTML:Tp(e,t);break;case Y.BASEFONT:case Y.BGSOUND:case Y.HEAD:case Y.LINK:case Y.META:case Y.NOFRAMES:case Y.STYLE:Pf(e,t);break;case Y.NOSCRIPT:e._err(t,U.nestedNoscriptInHead);break;default:Bf(e,t)}}function zf(e,t){switch(t.tagID){case Y.NOSCRIPT:e.openElements.pop(),e.insertionMode=$.IN_HEAD;break;case Y.BR:Bf(e,t);break;default:e._err(t,U.endTagWithoutMatchingOpenElement)}}function Bf(e,t){let n=t.type===W.EOF?U.openElementsLeftAfterEof:U.disallowedContentInNoscriptInHead;e._err(t,n),e.openElements.pop(),e.insertionMode=$.IN_HEAD,e._processToken(t)}function Vf(e,t){switch(t.tagID){case Y.HTML:Tp(e,t);break;case Y.BODY:e._insertElement(t,q.HTML),e.framesetOk=!1,e.insertionMode=$.IN_BODY;break;case Y.FRAMESET:e._insertElement(t,q.HTML),e.insertionMode=$.IN_FRAMESET;break;case Y.BASE:case Y.BASEFONT:case Y.BGSOUND:case Y.LINK:case Y.META:case Y.NOFRAMES:case Y.SCRIPT:case Y.STYLE:case Y.TEMPLATE:case Y.TITLE:e._err(t,U.abandonedHeadElementChild),e.openElements.push(e.headElement,Y.HEAD),Pf(e,t),e.openElements.remove(e.headElement);break;case Y.HEAD:e._err(t,U.misplacedStartTagForHeadElement);break;default:Uf(e,t)}}function Hf(e,t){switch(t.tagID){case Y.BODY:case Y.HTML:case Y.BR:Uf(e,t);break;case Y.TEMPLATE:If(e,t);break;default:e._err(t,U.endTagWithoutMatchingOpenElement)}}function Uf(e,t){e._insertFakeElement(J.BODY,Y.BODY),e.insertionMode=$.IN_BODY,Wf(e,t)}function Wf(e,t){switch(t.type){case W.CHARACTER:Kf(e,t);break;case W.WHITESPACE_CHARACTER:Gf(e,t);break;case W.COMMENT:Sf(e,t);break;case W.START_TAG:Tp(e,t);break;case W.END_TAG:Lp(e,t);break;case W.EOF:Rp(e,t);break;default:}}function Gf(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t)}function Kf(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t),e.framesetOk=!1}function qf(e,t){e.openElements.tmplCount===0&&e.treeAdapter.adoptAttributes(e.openElements.items[0],t.attrs)}function Jf(e,t){let n=e.openElements.tryPeekProperlyNestedBodyElement();n&&e.openElements.tmplCount===0&&(e.framesetOk=!1,e.treeAdapter.adoptAttributes(n,t.attrs))}function Yf(e,t){let n=e.openElements.tryPeekProperlyNestedBodyElement();e.framesetOk&&n&&(e.treeAdapter.detachNode(n),e.openElements.popAllUpToHtmlElement(),e._insertElement(t,q.HTML),e.insertionMode=$.IN_FRAMESET)}function Xf(e,t){e.openElements.hasInButtonScope(Y.P)&&e._closePElement(),e._insertElement(t,q.HTML)}function Zf(e,t){e.openElements.hasInButtonScope(Y.P)&&e._closePElement(),e.openElements.currentTagId!==void 0&&sd.has(e.openElements.currentTagId)&&e.openElements.pop(),e._insertElement(t,q.HTML)}function Qf(e,t){e.openElements.hasInButtonScope(Y.P)&&e._closePElement(),e._insertElement(t,q.HTML),e.skipNextNewLine=!0,e.framesetOk=!1}function $f(e,t){let n=e.openElements.tmplCount>0;(!e.formElement||n)&&(e.openElements.hasInButtonScope(Y.P)&&e._closePElement(),e._insertElement(t,q.HTML),n||(e.formElement=e.openElements.current))}function ep(e,t){e.framesetOk=!1;let n=t.tagID;for(let t=e.openElements.stackTop;t>=0;t--){let r=e.openElements.tagIDs[t];if(n===Y.LI&&r===Y.LI||(n===Y.DD||n===Y.DT)&&(r===Y.DD||r===Y.DT)){e.openElements.generateImpliedEndTagsWithExclusion(r),e.openElements.popUntilTagNamePopped(r);break}if(r!==Y.ADDRESS&&r!==Y.DIV&&r!==Y.P&&e._isSpecialElement(e.openElements.items[t],r))break}e.openElements.hasInButtonScope(Y.P)&&e._closePElement(),e._insertElement(t,q.HTML)}function tp(e,t){e.openElements.hasInButtonScope(Y.P)&&e._closePElement(),e._insertElement(t,q.HTML),e.tokenizer.state=Q.PLAINTEXT}function np(e,t){e.openElements.hasInScope(Y.BUTTON)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(Y.BUTTON)),e._reconstructActiveFormattingElements(),e._insertElement(t,q.HTML),e.framesetOk=!1}function rp(e,t){let n=e.activeFormattingElements.getElementEntryInScopeWithTagName(J.A);n&&(xf(e,t),e.openElements.remove(n.element),e.activeFormattingElements.removeEntry(n)),e._reconstructActiveFormattingElements(),e._insertElement(t,q.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function ip(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,q.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function ap(e,t){e._reconstructActiveFormattingElements(),e.openElements.hasInScope(Y.NOBR)&&(xf(e,t),e._reconstructActiveFormattingElements()),e._insertElement(t,q.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function op(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,q.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1}function sp(e,t){e.treeAdapter.getDocumentMode(e.document)!==rd.QUIRKS&&e.openElements.hasInButtonScope(Y.P)&&e._closePElement(),e._insertElement(t,q.HTML),e.framesetOk=!1,e.insertionMode=$.IN_TABLE}function cp(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,q.HTML),e.framesetOk=!1,t.ackSelfClosing=!0}function lp(e){let t=Uu(e,nd.TYPE);return t!=null&&t.toLowerCase()===cf}function up(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,q.HTML),lp(t)||(e.framesetOk=!1),t.ackSelfClosing=!0}function dp(e,t){e._appendElement(t,q.HTML),t.ackSelfClosing=!0}function fp(e,t){e.openElements.hasInButtonScope(Y.P)&&e._closePElement(),e._appendElement(t,q.HTML),e.framesetOk=!1,t.ackSelfClosing=!0}function pp(e,t){t.tagName=J.IMG,t.tagID=Y.IMG,cp(e,t)}function mp(e,t){e._insertElement(t,q.HTML),e.skipNextNewLine=!0,e.tokenizer.state=Q.RCDATA,e.originalInsertionMode=e.insertionMode,e.framesetOk=!1,e.insertionMode=$.TEXT}function hp(e,t){e.openElements.hasInButtonScope(Y.P)&&e._closePElement(),e._reconstructActiveFormattingElements(),e.framesetOk=!1,e._switchToTextParsing(t,Q.RAWTEXT)}function gp(e,t){e.framesetOk=!1,e._switchToTextParsing(t,Q.RAWTEXT)}function _p(e,t){e._switchToTextParsing(t,Q.RAWTEXT)}function vp(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,q.HTML),e.framesetOk=!1,e.insertionMode=e.insertionMode===$.IN_TABLE||e.insertionMode===$.IN_CAPTION||e.insertionMode===$.IN_TABLE_BODY||e.insertionMode===$.IN_ROW||e.insertionMode===$.IN_CELL?$.IN_SELECT_IN_TABLE:$.IN_SELECT}function yp(e,t){e.openElements.currentTagId===Y.OPTION&&e.openElements.pop(),e._reconstructActiveFormattingElements(),e._insertElement(t,q.HTML)}function bp(e,t){e.openElements.hasInScope(Y.RUBY)&&e.openElements.generateImpliedEndTags(),e._insertElement(t,q.HTML)}function xp(e,t){e.openElements.hasInScope(Y.RUBY)&&e.openElements.generateImpliedEndTagsWithExclusion(Y.RTC),e._insertElement(t,q.HTML)}function Sp(e,t){e._reconstructActiveFormattingElements(),ef(t),nf(t),t.selfClosing?e._appendElement(t,q.MATHML):e._insertElement(t,q.MATHML),t.ackSelfClosing=!0}function Cp(e,t){e._reconstructActiveFormattingElements(),tf(t),nf(t),t.selfClosing?e._appendElement(t,q.SVG):e._insertElement(t,q.SVG),t.ackSelfClosing=!0}function wp(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,q.HTML)}function Tp(e,t){switch(t.tagID){case Y.I:case Y.S:case Y.B:case Y.U:case Y.EM:case Y.TT:case Y.BIG:case Y.CODE:case Y.FONT:case Y.SMALL:case Y.STRIKE:case Y.STRONG:ip(e,t);break;case Y.A:rp(e,t);break;case Y.H1:case Y.H2:case Y.H3:case Y.H4:case Y.H5:case Y.H6:Zf(e,t);break;case Y.P:case Y.DL:case Y.OL:case Y.UL:case Y.DIV:case Y.DIR:case Y.NAV:case Y.MAIN:case Y.MENU:case Y.ASIDE:case Y.CENTER:case Y.FIGURE:case Y.FOOTER:case Y.HEADER:case Y.HGROUP:case Y.DIALOG:case Y.DETAILS:case Y.ADDRESS:case Y.ARTICLE:case Y.SEARCH:case Y.SECTION:case Y.SUMMARY:case Y.FIELDSET:case Y.BLOCKQUOTE:case Y.FIGCAPTION:Xf(e,t);break;case Y.LI:case Y.DD:case Y.DT:ep(e,t);break;case Y.BR:case Y.IMG:case Y.WBR:case Y.AREA:case Y.EMBED:case Y.KEYGEN:cp(e,t);break;case Y.HR:fp(e,t);break;case Y.RB:case Y.RTC:bp(e,t);break;case Y.RT:case Y.RP:xp(e,t);break;case Y.PRE:case Y.LISTING:Qf(e,t);break;case Y.XMP:hp(e,t);break;case Y.SVG:Cp(e,t);break;case Y.HTML:qf(e,t);break;case Y.BASE:case Y.LINK:case Y.META:case Y.STYLE:case Y.TITLE:case Y.SCRIPT:case Y.BGSOUND:case Y.BASEFONT:case Y.TEMPLATE:Pf(e,t);break;case Y.BODY:Jf(e,t);break;case Y.FORM:$f(e,t);break;case Y.NOBR:ap(e,t);break;case Y.MATH:Sp(e,t);break;case Y.TABLE:sp(e,t);break;case Y.INPUT:up(e,t);break;case Y.PARAM:case Y.TRACK:case Y.SOURCE:dp(e,t);break;case Y.IMAGE:pp(e,t);break;case Y.BUTTON:np(e,t);break;case Y.APPLET:case Y.OBJECT:case Y.MARQUEE:op(e,t);break;case Y.IFRAME:gp(e,t);break;case Y.SELECT:vp(e,t);break;case Y.OPTION:case Y.OPTGROUP:yp(e,t);break;case Y.NOEMBED:case Y.NOFRAMES:_p(e,t);break;case Y.FRAMESET:Yf(e,t);break;case Y.TEXTAREA:mp(e,t);break;case Y.NOSCRIPT:e.options.scriptingEnabled?_p(e,t):wp(e,t);break;case Y.PLAINTEXT:tp(e,t);break;case Y.COL:case Y.TH:case Y.TD:case Y.TR:case Y.HEAD:case Y.FRAME:case Y.TBODY:case Y.TFOOT:case Y.THEAD:case Y.CAPTION:case Y.COLGROUP:break;default:wp(e,t)}}function Ep(e,t){if(e.openElements.hasInScope(Y.BODY)&&(e.insertionMode=$.AFTER_BODY,e.options.sourceCodeLocationInfo)){let n=e.openElements.tryPeekProperlyNestedBodyElement();n&&e._setEndLocation(n,t)}}function Dp(e,t){e.openElements.hasInScope(Y.BODY)&&(e.insertionMode=$.AFTER_BODY,Sm(e,t))}function Op(e,t){let n=t.tagID;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n))}function kp(e){let t=e.openElements.tmplCount>0,{formElement:n}=e;t||(e.formElement=null),(n||t)&&e.openElements.hasInScope(Y.FORM)&&(e.openElements.generateImpliedEndTags(),t?e.openElements.popUntilTagNamePopped(Y.FORM):n&&e.openElements.remove(n))}function Ap(e){e.openElements.hasInButtonScope(Y.P)||e._insertFakeElement(J.P,Y.P),e._closePElement()}function jp(e){e.openElements.hasInListItemScope(Y.LI)&&(e.openElements.generateImpliedEndTagsWithExclusion(Y.LI),e.openElements.popUntilTagNamePopped(Y.LI))}function Mp(e,t){let n=t.tagID;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTagsWithExclusion(n),e.openElements.popUntilTagNamePopped(n))}function Np(e){e.openElements.hasNumberedHeaderInScope()&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilNumberedHeaderPopped())}function Pp(e,t){let n=t.tagID;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker())}function Fp(e){e._reconstructActiveFormattingElements(),e._insertFakeElement(J.BR,Y.BR),e.openElements.pop(),e.framesetOk=!1}function Ip(e,t){let n=t.tagName,r=t.tagID;for(let t=e.openElements.stackTop;t>0;t--){let i=e.openElements.items[t],a=e.openElements.tagIDs[t];if(r===a&&(r!==Y.UNKNOWN||e.treeAdapter.getTagName(i)===n)){e.openElements.generateImpliedEndTagsWithExclusion(r),e.openElements.stackTop>=t&&e.openElements.shortenToLength(t);break}if(e._isSpecialElement(i,a))break}}function Lp(e,t){switch(t.tagID){case Y.A:case Y.B:case Y.I:case Y.S:case Y.U:case Y.EM:case Y.TT:case Y.BIG:case Y.CODE:case Y.FONT:case Y.NOBR:case Y.SMALL:case Y.STRIKE:case Y.STRONG:xf(e,t);break;case Y.P:Ap(e);break;case Y.DL:case Y.UL:case Y.OL:case Y.DIR:case Y.DIV:case Y.NAV:case Y.PRE:case Y.MAIN:case Y.MENU:case Y.ASIDE:case Y.BUTTON:case Y.CENTER:case Y.FIGURE:case Y.FOOTER:case Y.HEADER:case Y.HGROUP:case Y.DIALOG:case Y.ADDRESS:case Y.ARTICLE:case Y.DETAILS:case Y.SEARCH:case Y.SECTION:case Y.SUMMARY:case Y.LISTING:case Y.FIELDSET:case Y.BLOCKQUOTE:case Y.FIGCAPTION:Op(e,t);break;case Y.LI:jp(e);break;case Y.DD:case Y.DT:Mp(e,t);break;case Y.H1:case Y.H2:case Y.H3:case Y.H4:case Y.H5:case Y.H6:Np(e);break;case Y.BR:Fp(e);break;case Y.BODY:Ep(e,t);break;case Y.HTML:Dp(e,t);break;case Y.FORM:kp(e);break;case Y.APPLET:case Y.OBJECT:case Y.MARQUEE:Pp(e,t);break;case Y.TEMPLATE:If(e,t);break;default:Ip(e,t)}}function Rp(e,t){e.tmplInsertionModeStack.length>0?bm(e,t):Tf(e,t)}function zp(e,t){var n;t.tagID===Y.SCRIPT&&((n=e.scriptHandler)==null||n.call(e,e.openElements.current)),e.openElements.pop(),e.insertionMode=e.originalInsertionMode}function Bp(e,t){e._err(t,U.eofInElementThatCanContainOnlyText),e.openElements.pop(),e.insertionMode=e.originalInsertionMode,e.onEof(t)}function Vp(e,t){if(e.openElements.currentTagId!==void 0&&ff.has(e.openElements.currentTagId))switch(e.pendingCharacterTokens.length=0,e.hasNonWhitespacePendingCharacterToken=!1,e.originalInsertionMode=e.insertionMode,e.insertionMode=$.IN_TABLE_TEXT,t.type){case W.CHARACTER:em(e,t);break;case W.WHITESPACE_CHARACTER:$p(e,t);break}else Qp(e,t)}function Hp(e,t){e.openElements.clearBackToTableContext(),e.activeFormattingElements.insertMarker(),e._insertElement(t,q.HTML),e.insertionMode=$.IN_CAPTION}function Up(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,q.HTML),e.insertionMode=$.IN_COLUMN_GROUP}function Wp(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(J.COLGROUP,Y.COLGROUP),e.insertionMode=$.IN_COLUMN_GROUP,am(e,t)}function Gp(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,q.HTML),e.insertionMode=$.IN_TABLE_BODY}function Kp(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(J.TBODY,Y.TBODY),e.insertionMode=$.IN_TABLE_BODY,cm(e,t)}function qp(e,t){e.openElements.hasInTableScope(Y.TABLE)&&(e.openElements.popUntilTagNamePopped(Y.TABLE),e._resetInsertionMode(),e._processStartTag(t))}function Jp(e,t){lp(t)?e._appendElement(t,q.HTML):Qp(e,t),t.ackSelfClosing=!0}function Yp(e,t){!e.formElement&&e.openElements.tmplCount===0&&(e._insertElement(t,q.HTML),e.formElement=e.openElements.current,e.openElements.pop())}function Xp(e,t){switch(t.tagID){case Y.TD:case Y.TH:case Y.TR:Kp(e,t);break;case Y.STYLE:case Y.SCRIPT:case Y.TEMPLATE:Pf(e,t);break;case Y.COL:Wp(e,t);break;case Y.FORM:Yp(e,t);break;case Y.TABLE:qp(e,t);break;case Y.TBODY:case Y.TFOOT:case Y.THEAD:Gp(e,t);break;case Y.INPUT:Jp(e,t);break;case Y.CAPTION:Hp(e,t);break;case Y.COLGROUP:Up(e,t);break;default:Qp(e,t)}}function Zp(e,t){switch(t.tagID){case Y.TABLE:e.openElements.hasInTableScope(Y.TABLE)&&(e.openElements.popUntilTagNamePopped(Y.TABLE),e._resetInsertionMode());break;case Y.TEMPLATE:If(e,t);break;case Y.BODY:case Y.CAPTION:case Y.COL:case Y.COLGROUP:case Y.HTML:case Y.TBODY:case Y.TD:case Y.TFOOT:case Y.TH:case Y.THEAD:case Y.TR:break;default:Qp(e,t)}}function Qp(e,t){let n=e.fosterParentingEnabled;e.fosterParentingEnabled=!0,Wf(e,t),e.fosterParentingEnabled=n}function $p(e,t){e.pendingCharacterTokens.push(t)}function em(e,t){e.pendingCharacterTokens.push(t),e.hasNonWhitespacePendingCharacterToken=!0}function tm(e,t){let n=0;if(e.hasNonWhitespacePendingCharacterToken)for(;n<e.pendingCharacterTokens.length;n++)Qp(e,e.pendingCharacterTokens[n]);else for(;n<e.pendingCharacterTokens.length;n++)e._insertCharacters(e.pendingCharacterTokens[n]);e.insertionMode=e.originalInsertionMode,e._processToken(t)}var nm=new Set([Y.CAPTION,Y.COL,Y.COLGROUP,Y.TBODY,Y.TD,Y.TFOOT,Y.TH,Y.THEAD,Y.TR]);function rm(e,t){let n=t.tagID;nm.has(n)?e.openElements.hasInTableScope(Y.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(Y.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=$.IN_TABLE,Xp(e,t)):Tp(e,t)}function im(e,t){let n=t.tagID;switch(n){case Y.CAPTION:case Y.TABLE:e.openElements.hasInTableScope(Y.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(Y.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=$.IN_TABLE,n===Y.TABLE&&Zp(e,t));break;case Y.BODY:case Y.COL:case Y.COLGROUP:case Y.HTML:case Y.TBODY:case Y.TD:case Y.TFOOT:case Y.TH:case Y.THEAD:case Y.TR:break;default:Lp(e,t)}}function am(e,t){switch(t.tagID){case Y.HTML:Tp(e,t);break;case Y.COL:e._appendElement(t,q.HTML),t.ackSelfClosing=!0;break;case Y.TEMPLATE:Pf(e,t);break;default:sm(e,t)}}function om(e,t){switch(t.tagID){case Y.COLGROUP:e.openElements.currentTagId===Y.COLGROUP&&(e.openElements.pop(),e.insertionMode=$.IN_TABLE);break;case Y.TEMPLATE:If(e,t);break;case Y.COL:break;default:sm(e,t)}}function sm(e,t){e.openElements.currentTagId===Y.COLGROUP&&(e.openElements.pop(),e.insertionMode=$.IN_TABLE,e._processToken(t))}function cm(e,t){switch(t.tagID){case Y.TR:e.openElements.clearBackToTableBodyContext(),e._insertElement(t,q.HTML),e.insertionMode=$.IN_ROW;break;case Y.TH:case Y.TD:e.openElements.clearBackToTableBodyContext(),e._insertFakeElement(J.TR,Y.TR),e.insertionMode=$.IN_ROW,um(e,t);break;case Y.CAPTION:case Y.COL:case Y.COLGROUP:case Y.TBODY:case Y.TFOOT:case Y.THEAD:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=$.IN_TABLE,Xp(e,t));break;default:Xp(e,t)}}function lm(e,t){let n=t.tagID;switch(t.tagID){case Y.TBODY:case Y.TFOOT:case Y.THEAD:e.openElements.hasInTableScope(n)&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=$.IN_TABLE);break;case Y.TABLE:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=$.IN_TABLE,Zp(e,t));break;case Y.BODY:case Y.CAPTION:case Y.COL:case Y.COLGROUP:case Y.HTML:case Y.TD:case Y.TH:case Y.TR:break;default:Zp(e,t)}}function um(e,t){switch(t.tagID){case Y.TH:case Y.TD:e.openElements.clearBackToTableRowContext(),e._insertElement(t,q.HTML),e.insertionMode=$.IN_CELL,e.activeFormattingElements.insertMarker();break;case Y.CAPTION:case Y.COL:case Y.COLGROUP:case Y.TBODY:case Y.TFOOT:case Y.THEAD:case Y.TR:e.openElements.hasInTableScope(Y.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=$.IN_TABLE_BODY,cm(e,t));break;default:Xp(e,t)}}function dm(e,t){switch(t.tagID){case Y.TR:e.openElements.hasInTableScope(Y.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=$.IN_TABLE_BODY);break;case Y.TABLE:e.openElements.hasInTableScope(Y.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=$.IN_TABLE_BODY,lm(e,t));break;case Y.TBODY:case Y.TFOOT:case Y.THEAD:(e.openElements.hasInTableScope(t.tagID)||e.openElements.hasInTableScope(Y.TR))&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=$.IN_TABLE_BODY,lm(e,t));break;case Y.BODY:case Y.CAPTION:case Y.COL:case Y.COLGROUP:case Y.HTML:case Y.TD:case Y.TH:break;default:Zp(e,t)}}function fm(e,t){let n=t.tagID;nm.has(n)?(e.openElements.hasInTableScope(Y.TD)||e.openElements.hasInTableScope(Y.TH))&&(e._closeTableCell(),um(e,t)):Tp(e,t)}function pm(e,t){let n=t.tagID;switch(n){case Y.TD:case Y.TH:e.openElements.hasInTableScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=$.IN_ROW);break;case Y.TABLE:case Y.TBODY:case Y.TFOOT:case Y.THEAD:case Y.TR:e.openElements.hasInTableScope(n)&&(e._closeTableCell(),dm(e,t));break;case Y.BODY:case Y.CAPTION:case Y.COL:case Y.COLGROUP:case Y.HTML:break;default:Lp(e,t)}}function mm(e,t){switch(t.tagID){case Y.HTML:Tp(e,t);break;case Y.OPTION:e.openElements.currentTagId===Y.OPTION&&e.openElements.pop(),e._insertElement(t,q.HTML);break;case Y.OPTGROUP:e.openElements.currentTagId===Y.OPTION&&e.openElements.pop(),e.openElements.currentTagId===Y.OPTGROUP&&e.openElements.pop(),e._insertElement(t,q.HTML);break;case Y.HR:e.openElements.currentTagId===Y.OPTION&&e.openElements.pop(),e.openElements.currentTagId===Y.OPTGROUP&&e.openElements.pop(),e._appendElement(t,q.HTML),t.ackSelfClosing=!0;break;case Y.INPUT:case Y.KEYGEN:case Y.TEXTAREA:case Y.SELECT:e.openElements.hasInSelectScope(Y.SELECT)&&(e.openElements.popUntilTagNamePopped(Y.SELECT),e._resetInsertionMode(),t.tagID!==Y.SELECT&&e._processStartTag(t));break;case Y.SCRIPT:case Y.TEMPLATE:Pf(e,t);break;default:}}function hm(e,t){switch(t.tagID){case Y.OPTGROUP:e.openElements.stackTop>0&&e.openElements.currentTagId===Y.OPTION&&e.openElements.tagIDs[e.openElements.stackTop-1]===Y.OPTGROUP&&e.openElements.pop(),e.openElements.currentTagId===Y.OPTGROUP&&e.openElements.pop();break;case Y.OPTION:e.openElements.currentTagId===Y.OPTION&&e.openElements.pop();break;case Y.SELECT:e.openElements.hasInSelectScope(Y.SELECT)&&(e.openElements.popUntilTagNamePopped(Y.SELECT),e._resetInsertionMode());break;case Y.TEMPLATE:If(e,t);break;default:}}function gm(e,t){let n=t.tagID;n===Y.CAPTION||n===Y.TABLE||n===Y.TBODY||n===Y.TFOOT||n===Y.THEAD||n===Y.TR||n===Y.TD||n===Y.TH?(e.openElements.popUntilTagNamePopped(Y.SELECT),e._resetInsertionMode(),e._processStartTag(t)):mm(e,t)}function _m(e,t){let n=t.tagID;n===Y.CAPTION||n===Y.TABLE||n===Y.TBODY||n===Y.TFOOT||n===Y.THEAD||n===Y.TR||n===Y.TD||n===Y.TH?e.openElements.hasInTableScope(n)&&(e.openElements.popUntilTagNamePopped(Y.SELECT),e._resetInsertionMode(),e.onEndTag(t)):hm(e,t)}function vm(e,t){switch(t.tagID){case Y.BASE:case Y.BASEFONT:case Y.BGSOUND:case Y.LINK:case Y.META:case Y.NOFRAMES:case Y.SCRIPT:case Y.STYLE:case Y.TEMPLATE:case Y.TITLE:Pf(e,t);break;case Y.CAPTION:case Y.COLGROUP:case Y.TBODY:case Y.TFOOT:case Y.THEAD:e.tmplInsertionModeStack[0]=$.IN_TABLE,e.insertionMode=$.IN_TABLE,Xp(e,t);break;case Y.COL:e.tmplInsertionModeStack[0]=$.IN_COLUMN_GROUP,e.insertionMode=$.IN_COLUMN_GROUP,am(e,t);break;case Y.TR:e.tmplInsertionModeStack[0]=$.IN_TABLE_BODY,e.insertionMode=$.IN_TABLE_BODY,cm(e,t);break;case Y.TD:case Y.TH:e.tmplInsertionModeStack[0]=$.IN_ROW,e.insertionMode=$.IN_ROW,um(e,t);break;default:e.tmplInsertionModeStack[0]=$.IN_BODY,e.insertionMode=$.IN_BODY,Tp(e,t)}}function ym(e,t){t.tagID===Y.TEMPLATE&&If(e,t)}function bm(e,t){e.openElements.tmplCount>0?(e.openElements.popUntilTagNamePopped(Y.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode(),e.onEof(t)):Tf(e,t)}function xm(e,t){t.tagID===Y.HTML?Tp(e,t):Cm(e,t)}function Sm(e,t){if(t.tagID===Y.HTML){if(e.fragmentContext||(e.insertionMode=$.AFTER_AFTER_BODY),e.options.sourceCodeLocationInfo&&e.openElements.tagIDs[0]===Y.HTML){e._setEndLocation(e.openElements.items[0],t);let n=e.openElements.items[1];n&&!e.treeAdapter.getNodeSourceCodeLocation(n)?.endTag&&e._setEndLocation(n,t)}}else Cm(e,t)}function Cm(e,t){e.insertionMode=$.IN_BODY,Wf(e,t)}function wm(e,t){switch(t.tagID){case Y.HTML:Tp(e,t);break;case Y.FRAMESET:e._insertElement(t,q.HTML);break;case Y.FRAME:e._appendElement(t,q.HTML),t.ackSelfClosing=!0;break;case Y.NOFRAMES:Pf(e,t);break;default:}}function Tm(e,t){t.tagID===Y.FRAMESET&&!e.openElements.isRootHtmlElementCurrent()&&(e.openElements.pop(),!e.fragmentContext&&e.openElements.currentTagId!==Y.FRAMESET&&(e.insertionMode=$.AFTER_FRAMESET))}function Em(e,t){switch(t.tagID){case Y.HTML:Tp(e,t);break;case Y.NOFRAMES:Pf(e,t);break;default:}}function Dm(e,t){t.tagID===Y.HTML&&(e.insertionMode=$.AFTER_AFTER_FRAMESET)}function Om(e,t){t.tagID===Y.HTML?Tp(e,t):km(e,t)}function km(e,t){e.insertionMode=$.IN_BODY,Wf(e,t)}function Am(e,t){switch(t.tagID){case Y.HTML:Tp(e,t);break;case Y.NOFRAMES:Pf(e,t);break;default:}}function jm(e,t){t.chars=`�`,e._insertCharacters(t)}function Mm(e,t){e._insertCharacters(t),e.framesetOk=!1}function Nm(e){for(;e.treeAdapter.getNamespaceURI(e.openElements.current)!==q.HTML&&e.openElements.currentTagId!==void 0&&!e._isIntegrationPoint(e.openElements.currentTagId,e.openElements.current);)e.openElements.pop()}function Pm(e,t){if($d(t))Nm(e),e._startTagOutsideForeignContent(t);else{let n=e._getAdjustedCurrentElement(),r=e.treeAdapter.getNamespaceURI(n);r===q.MATHML?ef(t):r===q.SVG&&(rf(t),tf(t)),nf(t),t.selfClosing?e._appendElement(t,r):e._insertElement(t,r),t.ackSelfClosing=!0}}function Fm(e,t){if(t.tagID===Y.P||t.tagID===Y.BR){Nm(e),e._endTagOutsideForeignContent(t);return}for(let n=e.openElements.stackTop;n>0;n--){let r=e.openElements.items[n];if(e.treeAdapter.getNamespaceURI(r)===q.HTML){e._endTagOutsideForeignContent(t);break}let i=e.treeAdapter.getTagName(r);if(i.toLowerCase()===t.tagName){t.tagName=i,e.openElements.shortenToLength(n);break}}}new Set([J.AREA,J.BASE,J.BASEFONT,J.BGSOUND,J.BR,J.COL,J.EMBED,J.FRAME,J.HR,J.IMG,J.INPUT,J.KEYGEN,J.LINK,J.META,J.PARAM,J.SOURCE,J.TRACK,J.WBR]);var Im=/<(\/?)(iframe|noembed|noframes|plaintext|script|style|textarea|title|xmp)(?=[\t\n\f\r />])/gi,Lm=new Set([`mdxFlowExpression`,`mdxJsxFlowElement`,`mdxJsxTextElement`,`mdxTextExpression`,`mdxjsEsm`]),Rm={sourceCodeLocationInfo:!0,scriptingEnabled:!1};function zm(e,t){let n=$m(e),r=yu(`type`,{handlers:{root:Vm,element:Hm,text:Um,comment:Km,doctype:Wm,raw:qm},unknown:Jm}),i={parser:n?new mf(Rm):mf.getFragmentParser(void 0,Rm),handle(e){r(e,i)},stitches:!1,options:t||{}};r(e,i),Ym(i,nr());let a=uu(n?i.parser.document:i.parser.getFragment(),{file:i.options.file});return i.stitches&&Gs(a,`comment`,function(e,t,n){let r=e;if(r.value.stitch&&n&&t!==void 0){let e=n.children;return e[t]=r.value.stitch,t}}),a.type===`root`&&a.children.length===1&&a.children[0].type===e.type?a.children[0]:a}function Bm(e,t){let n=-1;if(e)for(;++n<e.length;)t.handle(e[n])}function Vm(e,t){Bm(e.children,t)}function Hm(e,t){Zm(e,t),Bm(e.children,t),Qm(e,t)}function Um(e,t){t.parser.tokenizer.state>4&&(t.parser.tokenizer.state=0);let n={type:W.CHARACTER,chars:e.value,location:eh(e)};Ym(t,nr(e)),t.parser.currentToken=n,t.parser._processToken(t.parser.currentToken)}function Wm(e,t){let n={type:W.DOCTYPE,name:`html`,forceQuirks:!1,publicId:``,systemId:``,location:eh(e)};Ym(t,nr(e)),t.parser.currentToken=n,t.parser._processToken(t.parser.currentToken)}function Gm(e,t){t.stitches=!0;let n=th(e);`children`in e&&`children`in n&&(n.children=zm({type:`root`,children:e.children},t.options).children),Km({type:`comment`,value:{stitch:n}},t)}function Km(e,t){let n=e.value,r={type:W.COMMENT,data:n,location:eh(e)};Ym(t,nr(e)),t.parser.currentToken=r,t.parser._processToken(t.parser.currentToken)}function qm(e,t){if(t.parser.tokenizer.preprocessor.html=``,t.parser.tokenizer.preprocessor.pos=-1,t.parser.tokenizer.preprocessor.lastGapPos=-2,t.parser.tokenizer.preprocessor.gapStack=[],t.parser.tokenizer.preprocessor.skipNextNewLine=!1,t.parser.tokenizer.preprocessor.lastChunkWritten=!1,t.parser.tokenizer.preprocessor.endOfChunkHit=!1,t.parser.tokenizer.preprocessor.isEol=!1,Xm(t,nr(e)),t.parser.tokenizer.write(t.options.tagfilter?e.value.replace(Im,`&lt;$1$2`):e.value,!1),t.parser.tokenizer._runParsingLoop(),t.parser.tokenizer.state===72||t.parser.tokenizer.state===78){t.parser.tokenizer.preprocessor.lastChunkWritten=!0;let e=t.parser.tokenizer._consume();t.parser.tokenizer._callState(e)}}function Jm(e,t){let n=e;if(t.options.passThrough&&t.options.passThrough.includes(n.type))Gm(n,t);else{let e=``;throw Lm.has(n.type)&&(e=". It looks like you are using MDX nodes with `hast-util-raw` (or `rehype-raw`). If you use this because you are using remark or rehype plugins that inject `'html'` nodes, then please raise an issue with that plugin, as its a bad and slow idea. If you use this because you are using markdown syntax, then you have to configure this utility (or plugin) to pass through these nodes (see `passThrough` in docs), but you can also migrate to use the MDX syntax"),Error("Cannot compile `"+n.type+"` node"+e)}}function Ym(e,t){Xm(e,t);let n=e.parser.tokenizer.currentCharacterToken;n&&n.location&&(n.location.endLine=e.parser.tokenizer.preprocessor.line,n.location.endCol=e.parser.tokenizer.preprocessor.col+1,n.location.endOffset=e.parser.tokenizer.preprocessor.offset+1,e.parser.currentToken=n,e.parser._processToken(e.parser.currentToken)),e.parser.tokenizer.paused=!1,e.parser.tokenizer.inLoop=!1,e.parser.tokenizer.active=!1,e.parser.tokenizer.returnState=Q.DATA,e.parser.tokenizer.charRefCode=-1,e.parser.tokenizer.consumedAfterSnapshot=-1,e.parser.tokenizer.currentLocation=null,e.parser.tokenizer.currentCharacterToken=null,e.parser.tokenizer.currentToken=null,e.parser.tokenizer.currentAttr={name:``,value:``}}function Xm(e,t){if(t&&t.offset!==void 0){let n={startLine:t.line,startCol:t.column,startOffset:t.offset,endLine:-1,endCol:-1,endOffset:-1};e.parser.tokenizer.preprocessor.lineStartPos=-t.column+1,e.parser.tokenizer.preprocessor.droppedBufferSize=t.offset,e.parser.tokenizer.preprocessor.line=t.line,e.parser.tokenizer.currentLocation=n}}function Zm(e,t){let n=e.tagName.toLowerCase();if(t.parser.tokenizer.state===Q.PLAINTEXT)return;Ym(t,nr(e));let r=t.parser.openElements.current,i=`namespaceURI`in r?r.namespaceURI:yl.html;i===yl.html&&n===`svg`&&(i=yl.svg);let a=Cu({...e,children:[]},{space:i===yl.svg?`svg`:`html`}),o={type:W.START_TAG,tagName:n,tagID:ad(n),selfClosing:!1,ackSelfClosing:!1,attrs:`attrs`in a?a.attrs:[],location:eh(e)};t.parser.currentToken=o,t.parser._processToken(t.parser.currentToken),t.parser.tokenizer.lastStartTagName=n}function Qm(e,t){let n=e.tagName.toLowerCase();if(!t.parser.tokenizer.inForeignNode&&Nu.includes(n)||t.parser.tokenizer.state===Q.PLAINTEXT)return;Ym(t,tr(e));let r={type:W.END_TAG,tagName:n,tagID:ad(n),selfClosing:!1,ackSelfClosing:!1,attrs:[],location:eh(e)};t.parser.currentToken=r,t.parser._processToken(t.parser.currentToken),n===t.parser.tokenizer.lastStartTagName&&(t.parser.tokenizer.state===Q.RCDATA||t.parser.tokenizer.state===Q.RAWTEXT||t.parser.tokenizer.state===Q.SCRIPT_DATA)&&(t.parser.tokenizer.state=Q.DATA)}function $m(e){let t=e.type===`root`?e.children[0]:e;return!!(t&&(t.type===`doctype`||t.type===`element`&&t.tagName.toLowerCase()===`html`))}function eh(e){let t=nr(e)||{line:void 0,column:void 0,offset:void 0},n=tr(e)||{line:void 0,column:void 0,offset:void 0};return{startLine:t.line,startCol:t.column,startOffset:t.offset,endLine:n.line,endCol:n.column,endOffset:n.offset}}function th(e){return`children`in e?ks({...e,children:[]}):ks(e)}function nh(e){return function(t,n){return zm(t,{...e,file:n})}}var rh=v((0,N.jsx)(`path`,{d:`M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z`}),`ChevronRight`),ih=c(`div`)({position:`relative`}),ah=c(ae,{shouldForwardProp:e=>e!==`isOpen`})(({theme:e,isOpen:t})=>({float:`left`,padding:2,marginTop:2,marginRight:e.spacing(1),color:e.palette.text.secondary,border:`3px solid ${e.palette.primary.main}`,borderRadius:e.shape.borderRadius,opacity:.15,transition:e.transitions.create([`transform`,`border-color`,`color`,`opacity`],{duration:e.transitions.duration.standard}),transform:t?`rotate(90deg)`:`rotate(0deg)`,".is-active &":{opacity:.85},"&:hover, &:focus":{opacity:1,color:e.palette.text.primary,borderColor:e.palette.primary.main,backgroundColor:`transparent`}})),oh=c(`span`)(({theme:e})=>({color:`inherit`,cursor:`pointer`,borderBottom:`1px dotted transparent`,transition:e.transitions.create([`color`,`border-color`,`background-color`],{duration:e.transitions.duration.standard}),".is-active &":{color:e.palette.info.light,borderBottomColor:e.palette.info.light,fontWeight:500},"&:hover":{color:e.palette.info.light,borderBottomColor:e.palette.info.light,backgroundColor:e.palette.action.selected}})),sh=c(`div`)(({theme:e})=>({fontWeight:700,margin:e.spacing(0),padding:e.spacing(0),color:e.palette.text.primary})),ch=c(`div`)(({theme:e})=>({padding:e.spacing(1),margin:e.spacing(0,0),borderLeft:`4px solid ${e.palette.primary.main}`,backgroundColor:e.palette.action.hover,borderRadius:e.shape.borderRadius})),lh=c(`div`)(({theme:e})=>({"& > p:first-of-type":{marginTop:0},"& > p:last-of-type":{marginBottom:0}})),uh=c(w)(({theme:e})=>({padding:e.spacing(2),maxWidth:500,border:`1px solid ${e.palette.divider}`,boxShadow:e.shadows[8]})),dh=c(T)(({theme:e})=>({margin:e.spacing(0,0),"&::after":{content:`""`,display:`table`,clear:`both`}})),fh=c(T)(({theme:e})=>({borderRadius:e.shape.borderRadius,padding:e.spacing(0,1),transition:e.transitions.create([`box-shadow`,`background-color`],{duration:e.transitions.duration.shorter}),"&:hover":{}})),ph=c(T)({}),mh=(0,M.createContext)({mode:`summary`,toggleMode:()=>{}}),hh=({children:e})=>{let[t,n]=(0,M.useState)(`summary`),r=()=>{n(e=>e===`summary`?`detail`:`summary`)},i=t===`detail`;return(0,N.jsx)(mh.Provider,{value:{mode:t,toggleMode:r},children:(0,N.jsxs)(dh,{children:[(0,N.jsx)(ah,{size:`small`,onClick:r,isOpen:i,"aria-label":i?`Collapse details`:`Expand details`,children:(0,N.jsx)(rh,{fontSize:`small`})}),(0,N.jsx)(T,{children:e})]})})},gh=({children:e})=>{let{mode:t,toggleMode:n}=(0,M.useContext)(mh);return t===`summary`?(0,N.jsx)(fh,{children:e}):null},_h=({children:e})=>{let{mode:t}=(0,M.useContext)(mh);return t===`detail`?(0,N.jsx)(ph,{children:e}):null},vh=(0,M.createContext)(null),yh=({children:e})=>{let[t,n]=(0,M.useState)(new Map),r=(0,M.useCallback)(e=>{n(t=>{let n=t.get(e.id);if(n&&n.title===e.title)return t;let r=new Map(t);return r.set(e.id,e),r})},[]),i=(0,M.useCallback)(e=>t.get(e),[t]);return(0,N.jsx)(vh.Provider,{value:{register:r,getItem:i},children:e})},bh=()=>{let e=(0,M.useContext)(vh);if(!e)throw Error(`useReferenceRegistry must be used within ReferenceProvider`);return e},xh=({children:e})=>(0,N.jsx)(Uc,{remarkPlugins:[ol],rehypePlugins:[au],components:{p:({children:e})=>(0,N.jsx)(N.Fragment,{children:e})},children:e}),Sh=({to:e,children:t})=>{let{getItem:n}=bh(),[r,i]=(0,M.useState)(null),a=(0,M.useCallback)(e=>{i(e.currentTarget)},[]),o=(0,M.useCallback)(()=>{i(null)},[]),s=n(e),c=!!r;return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(oh,{onMouseEnter:a,onMouseLeave:o,onClick:()=>{let t=document.getElementById(e);t&&t.scrollIntoView({behavior:`smooth`})},children:t||(s?.title?(0,N.jsx)(xh,{children:s.title}):e)}),(0,N.jsx)(cn,{open:c,anchorEl:r,placement:`top-start`,transition:!0,style:{pointerEvents:`none`,zIndex:1300},modifiers:[{name:`offset`,options:{offset:[0,8]}},{name:`preventOverflow`,options:{boundary:`window`}}],children:({TransitionProps:t})=>(0,N.jsx)(y,{...t,timeout:300,children:(0,N.jsx)(uh,{elevation:4,children:s?(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`strong`,{children:(0,N.jsx)(xh,{children:s.title})}),(0,N.jsx)(lh,{children:s.content})]}):(0,N.jsxs)(`span`,{children:[`Reference "`,e,`" not found`]})})})})]})},Ch=({src:e,alt:t,node:n,...r})=>(0,N.jsx)(T,{component:`img`,src:e,alt:t,sx:{display:`block`,maxWidth:`100%`,height:`auto`,borderRadius:1,mx:`auto`,my:0},...r}),wh=({children:e})=>(0,N.jsx)(T,{component:`figure`,sx:{display:`flex`,flexDirection:`column`,alignItems:`center`,my:3,mx:0,"& p":{m:0,p:0}},children:e}),Th=({children:e})=>(0,N.jsx)(O,{variant:`caption`,component:`figcaption`,color:`text.secondary`,sx:{mt:1,textAlign:`center`,"& p":{m:0,display:`inline`}},children:e}),Eh=({id:e,title:t,type:n,children:r})=>{let{register:i}=bh(),a=t?`${n} (${t})`:n;return(0,M.useEffect)(()=>{i({id:e,title:a,content:r})},[e,a,i]),(0,N.jsxs)(ch,{id:e,children:[(0,N.jsx)(sh,{children:(0,N.jsx)(xh,{children:a})}),(0,N.jsx)(lh,{children:r})]})},Dh=({children:e})=>{let[t,n]=(0,M.useState)(!0);return(0,M.useEffect)(()=>{let e,t=()=>{n(!0),clearTimeout(e),e=setTimeout(()=>{n(!1)},2e3)};return window.addEventListener(`mousemove`,t),window.addEventListener(`scroll`,t,!0),window.addEventListener(`keydown`,t),e=setTimeout(()=>n(!1),2e3),()=>{window.removeEventListener(`mousemove`,t),window.removeEventListener(`scroll`,t,!0),window.removeEventListener(`keydown`,t),clearTimeout(e)}},[]),(0,N.jsx)(ih,{className:t?`is-active`:`is-idle`,children:e})},Oh=`# Lorem Ipsum Dolor Sit Amet\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. In this section, we analyze lorem ipsum dolor sit amet under consectetur adipiscing elit.\r
\r
<def id="def:admissible" title="Lorem Ipsum Dolor">\r
\r
A rooted tree $T = (V, E)$ is said to be **lorem ipsum** if every internal node $v \\in V$ at depth $k$ satisfies:\r
$$ \\operatorname{weight}(v) \\ge 2^{-k} \\cdot \\operatorname{weight}(\\operatorname{root}(T)) $$\r
\r
</def>\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. We now establish the main substitution property for an <ref to="def:admissible">lorem ipsum</ref>.\r
\r
<lemma id="lem:node-replacement" title="Node Replacement $X=y^2$">\r
\r
Let $T$ be an <ref to="def:admissible">lorem ipsum</ref> with a level-$k$ node $I$, and let $I'$ be another lorem ipsum level-$k$ node satisfying:\r
$$ a(I') \\ge a(I) $$\r
\r
Then the tree $T'$ obtained by replacing the subtree rooted at $I$ with the subtree rooted at $I'$ is lorem ipsum.\r
\r
</lemma>\r
<proof>\r
<sketch>\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Compare the weight distribution before and after replacement at level $k$. Since $a(I') \\ge a(I)$, the monotonicity of the node weight bound is preserved across all levels $j \\ge k$.\r
\r
$$\r
x^2+y^2=1\r
$$\r
\r
And so on.\r
\r
</sketch>\r
<detail>\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Let $\\epsilon > 0$ be arbitrary. We proceed by induction on the height $h$ of the subtree rooted at $I$.\r
\r
For the base case $h = 0$, the node $I$ is a leaf. Substituting $I'$ increases or preserves the total weight at level $k$:\r
$$ \\operatorname{weight}_{T'}(I') = a(I') \\ge a(I) = \\operatorname{weight}_T(I) $$\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. By structural induction over all descendant nodes $v \\in \\operatorname{Subtree}(I')$, the bound holds for all depths $j \\ge k$. Thus, $T'$ remains lorem ipsum.\r
\r
</detail>\r
</proof>\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. As established in <ref to="lem:node-replacement">Lemma ($x^2+y^2=z^2$ Node Replacement)</ref>, subtree substitution preserves structural lorem ipsum under non-decreasing weight conditions.`,kh=`## Loose spherical hierarchy for broad-phase collision detection\r
\r
Let $(X,d)$ be a metric space. For two balls $B_1=B(p_1,r_1)$ and $B_2=B(p_2,r_2)$ define\r
\r
$$\r
\\text{$B_1$ overlaps $B_2$ if $d(p_1,p_2) < r_1+r_2$,}\r
$$\r
\r
and\r
\r
$$\r
\\text{$B_1$ encloses $B_2$ if $d(p_1,p_2)+r_2\\le r_1$.}\r
$$ \r
\r
If $B_1$ and $B_2$ do not overlap, then $B_1\\cap B_2=\\emptyset$. Likewise, if $B_1$ encloses $B_2$, then $B_2\\subset B_1$. These predicates are defined by simple distance computations and agree with the usual notions of intersection and containment in $\\R^n$ and many other metric spaces. Note that overlap is symmetric, enclosure is transitive, and if two balls don't overlap, neither does any pair of balls enclosed respectively by them.\r
\r
Objects and regions in the algorithm are balls, specified by their centers and radii. Throughout the algorithm, overlap and enclosure are understood in the sense defined above.\r
\r
Let $S>1$ be a constant scaling factor.\r
\r
The structure is a tree that stores a set of objects represented by balls $O = B(c,r)$. Each object has a fixed radius $r>0$, time-varying center $c\\in X$, and an associated fixed margin $\\rho\\ge 0$. The structure indexes them using a hierarchy of spherical regions.\r
\r
Every non-root node is a region $R=B(q,S^k)$, where $q\\in X$ is the center and $k\\in\\Z$ is the level of the region. The root is not geometric; it acts only as the top-level organizer. Regions of level $k_{\\rm max}$ are the only children of the root, and there are no regions above level $k_{\\rm max}$. Regions never move.\r
\r
For an object $O=B(c,r)$, its admissible level is the unique integer $k$ such that\r
\r
$$\r
S^{k-1}\\le r+\\rho<S^k.\r
$$\r
\r
If $r+\\rho\\ge S^{k_{\\rm max}}$, the object with its margin cannot be enclosed by any region and the object is stored directly under the root.\r
\r
Whenever a new region is created, its center is initialized to the center of the ball (object or region) that it is created to contain.\r
\r
A region is *populated* if it stores at least one object. Every region maintains a neighbor list. Whenever a region becomes populated, initialize its neighbor list by finding every overlapping populated region using an overlap query (defined below) and updating all neighbor lists symmetrically. Whenever a region becomes unpopulated, remove it from the neighbor lists of all its neighbors and clear its own neighbor list.\r
\r
### Invariants\r
\r
The tree satisfies the following invariants and its operations preserve them.\r
\r
* **Object storage:** Every object is stored in exactly one region whose level is equal to its admissible level, or directly under the root. Every object maintains a reference to its parent node.\r
\r
* **Enclosure:** Every parent region encloses each of its child regions and stored objects. \r
\r
* **Topology:** The parent of a level-$k$ region is either a level-$(k+1)$ region, or the root if $k=k_{\\rm max}$.\r
\r
* **Pruning:** Every region contains at least one stored object or at least one child region.\r
\r
* **Neighbors:** The neighbor list of every populated region contains exactly the populated regions that overlap it, excluding itself. The neighbor list of every unpopulated region is empty.\r
\r
Note that the enclosure invariant implies that every region encloses every descendant region and every object stored in its subtree.\r
\r
### Overlap and enclosure queries\r
\r
We define two similar queries, overlap and enclosure, which differ only in the geometric predicate used to test a region against the query ball. The method below is described for the overlap query and the changes required for the enclosure query are indicated in parentheses.\r
\r
An overlap query (enclosure query) takes three inputs: a query ball $B$, a minimum level $k_{\\rm min}$, and a boolean flag \`group_by_level\`.\r
\r
The output is every region in the tree that overlaps (encloses) $B$ and whose level is at least $k_{\\rm min}$. If \`group_by_level = true\`, the result is returned as a map from level to a list of matching regions.\r
\r
The query traverses the tree top-down, starting from the root's children. For each visited region, test for overlap (enclosure) with $B$. If the region overlaps (encloses) $B$ and its level is at least $k_{\\rm min}$, include it in the output. Recurse only into children that overlap (enclose) $B$. If a region's level is less than $k_{\\rm min}$, it is not reported and its subtree is not traversed.\r
\r
*Note: Overlap and enclosure queries return regions, not objects.*\r
\r
### Insertion\r
\r
To insert an object $O = B(c,r)$:\r
\r
1. If $r+\\rho \\ge S^{k_{\\rm max}}$, store $O$ directly under the root and terminate.\r
2. Otherwise, compute its admissible level $k$.\r
3. Perform an enclosure query with query ball $O$, minimum level $k$, and \`group_by_level = true\`.\r
4. **Existing region:** Search the returned regions at level $k$ for any that enclose $O$. If one or more exist, select the region whose center is closest to $c$ and store $O$ there. If that region was previously unpopulated, populate it. Terminate.\r
5. **Create new region:** If no suitable level-$k$ region exists, create a new region $R_k = B(c,S^k)$. Store $O$ in $R_k$, populate $R_k$, and connect it upward.\r
6. **Connect upward:** Initially let $j := k$. Search the query results at level $j+1$ for a region that encloses $R_j$.\r
   * If one exists, select the one whose center is closest to $c$, assign it as the parent of $R_j$, and terminate.\r
   * If none exist and $j+1 \\le k_{\\rm max}$, create a new region $R_{j+1} = B(c,S^{j+1})$, make $R_j$ its child, set $j := j+1$, and connect $R_j$ upward.\r
   * If $j = k_{\\rm max}$ is reached without finding a parent, add $R_{k_{\\rm max}}$ to the children of the root.\r
\r
This procedure always reuses an existing valid region when possible and otherwise creates the shortest necessary chain of new ancestors.\r
\r
### Deletion\r
\r
To delete an object $O$:\r
\r
1. Remove $O$ from its parent node.\r
2. If the node is a region and this removal transitions it to unpopulated, unpopulate it.\r
3. If the node is now empty (no stored objects and no child regions), remove it from its parent.\r
4. Apply the emptiness test iteratively to the parent, removing empty ancestors until a non-empty region or the root is reached.\r
\r
### Updating after object movement\r
\r
Suppose that object $O$ has moved to a new center while keeping the same radius. Let $H$ be its current parent node.\r
\r
1. If $H$ is the root, or if $O$ is still enclosed in $H$, no structural changes are required. Terminate.\r
2. Otherwise, remove $O$ from $H$. If $H$ transitions to unpopulated, unpopulate it.\r
3. Insert $O$ back into the tree using the insertion procedure.\r
4. Clean up the old path: if $H$ is now empty, remove it from its parent. Apply this iteratively upward, deleting empty ancestors until a non-empty region or the root is reached.\r
\r
*Note: Reinsertion strictly precedes pruning so that any valid ancestors of $H$ remain available for reuse during the insertion phase.*\r
\r
## Collision detection\r
\r
The tree accelerates broad-phase collision detection by exploiting the neighbor lists of populated regions. Objects stored under the root are compared separately.\r
\r
1. Test every pair of objects stored directly under the root.\r
2. For each root object, test it against every object stored directly in any populated region that overlaps it.\r
3. For every populated region:\r
   * Test every pair of objects stored in that region.\r
   * For every neighboring populated region, test every object stored directly in one region against every object stored directly in the other.\r
\r
Since neighbor lists are symmetric, each pair of neighboring regions must be processed only once.\r
\r
Each candidate pair is then subjected to an exact overlap test between the two objects. The procedure reports every overlapping pair exactly once.\r
\r
## Notes\r
\r
The object radius and margin are assumed to remain fixed, so the admissible level of an object does not need to be recomputed. The update operation is a localized relocation: preserve the current parent node when possible, otherwise move the object to an existing region or create only the minimum new structure needed to restore the invariants.\r
\r
Neighbor lists depend only on populated regions. They are unaffected by changes to the tree topology and are updated only when a region transitions between populated and unpopulated.\r
\r
## Lazy variant\r
\r
The lazy variant of the algorithm separates regions into internal regions and leaves. An internal region is like the regions described previously: it can have child regions and it can store enclosed objects whose admissible level matches the level of the region. A leaf region has no child regions, but in addition to enclosed admissible-level objects, it can also store deferred objects that are enclosed objects whose admissible level is strictly lower than the region level. \r
\r
We do not use neighbor lists or track populated regions. Collision detection is done with a recursive dual-tree traversal that prunes ball pairs whenever they do not overlap.\r
\r
Insertion tracks enclosing regions from level $\\text{maxLevel}$ down to $\\text{lvl}(O)$. At level $k$, it searches for a child region enclosing a ball centered at $x_O$ with test radius $r_{\\text{test}}$, where $r_{\\text{test}} = S^{k-1}$ for $k > \\text{lvl}(O)$ (ensuring space for a potential sub-region) and $r_{\\text{test}} = r_O$ at the native level $k = \\text{lvl}(O)$. If a matching region is found, $O$ is stored there if it is a leaf or at native level and for a non-native internal region traversal continues through it as the updated parent anchor. If no matching region exists, insertion terminates by creating a new leaf centered at $x_O$ under the level-$(k+1)$ parent anchor.\r
\r
We define\r
\r
$$\r
n(R) = \\#\\{O:\\text{$O$ is object stored in the subtree of $R$}\\},\r
$$\r
\r
$$\r
w(R) = n(R)\\sum_{\\stackrel{\\tiny \\text{$Q$ overlaps $R$}}{\\tiny \\text{lvl}(R)=\\text{lvl}(Q)}}n(Q)\r
$$\r
\r
and we split a leaf region $R$ if $w(R)>T_{\\text{split}}$ and collapse an internal region if $w(R)<T_{\\text{collapse}}$. Collapsing an internal node converts it to a leaf, removing all structure in its subtree and converting all objects from the subtree into deferred objects within the leaf. Splitting a leaf converts it into an internal node and all the deferred objects in the leaf are re-inserted into the tree. These operations are not inverses to each other since re-insertion during split may not be possible under the original leaf and the objects can land elsewhere in the tree. Evaluating $w(R)$, splitting, and collapsing are only done once per frame during the collision detection recursion. Using $w(R)$ (or a measure like it) with thresholds serves as a heuristic for tree rebalancing.\r
\r
There are also other small differences to the original algorithm that we do not go into. The lazy variant produces much smaller tree structures and avoids long chains of regions just to store one small isolated object. It might be more efficient if the objects move significantly between frames.\r
\r
## Bounding occupancy\r
\r
**Theorem (Region separation)**  \r
Assume there exists a constant $C>0$ such that every object satisfies $\\rho\\ge Cr$. Let\r
\r
$$\r
\\alpha=\\min\\!\\left\\{1-\\frac1S,\\frac{C}{1+C}\\right\\}.\r
$$\r
\r
Then the centers of all level-$k$ regions are $\\alpha S^k$-separated.\r
\r
**Proof**  \r
Let $B=B(b,S^k)$ and $B'=B(b',S^k)$ be two distinct level-$k$ regions. Assume $B$ was created after $B'$.\r
\r
When $B$ was created, it was initialized with a single child object or child region $D$, whose center became the center of $B$. Thus $b$ is the center of $D$. Since $B'$ already existed and was not selected as the parent of $D$, the region $B'$ did not enclose $D$.\r
\r
If $D$ is a level-$(k-1)$ region, then $D=B(b,S^{k-1})$, so\r
\r
$$\r
d(b,b')+S^{k-1}>S^k,\r
$$\r
\r
which implies\r
\r
$$\r
d(b,b')>\\left(1-\\frac1S\\right)S^k\\ge\\alpha S^k.\r
$$\r
\r
If instead $D$ is an object of radius $r$, then\r
\r
$$\r
d(b,b')+r>S^k.\r
$$\r
\r
Since the object is admissible at level $k$, $r+\\rho<S^k$. Together with the assumption $\\rho\\ge Cr$, this gives\r
\r
$$\r
(1+C)r\\le r+\\rho<S^k,\r
$$\r
\r
and therefore $r<S^k/(1+C)$.\r
\r
Substituting into the previous inequality yields\r
\r
$$\r
d(b,b')>S^k-r>S^k-\\frac{S^k}{1+C}=\\frac{C}{1+C}S^k\\ge\\alpha S^k.\r
$$\r
\r
Thus in either case, $d(b,b')>\\alpha S^k$. $\\square$\r
\r
**Corollary (Bounded number of children)**  \r
Assume $(X,d)$ is a doubling metric space with doubling dimension $d$. Assume further that there exists a constant $C>0$ such that every object satisfies $\\rho\\ge Cr$. Then every level-$(k+1)$ region has at most\r
\r
$$\r
N=O\\!\\left(\\left(\\frac{S-1}{\\alpha}\\right)^d\\right)\r
$$\r
\r
level-$k$ children, where\r
\r
$$\r
\\alpha=\\min\\!\\left\\{1-\\frac1S,\\frac{C}{1+C}\\right\\}.\r
$$\r
\r
In particular, the number of children of a region is bounded by a constant depending only on $S$, $C$, and the doubling dimension of $(X,d)$.\r
\r
**Proof**  \r
By the previous lemma, the centers of the level-$k$ children are $\\alpha S^k$-separated. Since every child region is enclosed by its parent, all child centers lie within distance $S^{k+1}-S^k=(S-1)S^k$ of the parent center. A standard packing bound for doubling metric spaces therefore implies that the number of such centers is at most\r
\r
$$\r
O\\!\\left(\\left(\\frac{(S-1)S^k}{\\alpha S^k}\\right)^d\\right) = O\\!\\left(\\left(\\frac{S-1}{\\alpha}\\right)^d\\right).\r
$$\r
\r
This bound is independent of $k$. $\\square$`,Ah=`## Mathematical model for updates with one object\r
\r
We want to analyze the rebuild process of the algorithm when there is only one object. We simplify the object to a point and generalize the region radii from $S^k$ to an arbitrary strictly increasing sequence. This gives an independent mathematical model based on the update procedure.\r
\r
Let $(X,d)$ be a metric space and let\r
\r
$$\r
0<r_0<r_1<r_2<\\cdots\r
$$\r
\r
be a strictly increasing sequence of radii. Define corresponding differences by\r
\r
$$\r
\\Delta_0=r_0,\r
\\qquad\r
\\Delta_k=r_k-r_{k-1},\r
\\quad k\\ge 1.\r
$$\r
\r
For technical reasons (rebuild cascade termination), we also require that $(\\Delta_k)$ is not bounded.\r
\r
A point moves along an arc-length parametrized path\r
\r
$$\r
\\gamma:[0,\\infty)\\to X.\r
$$\r
\r
For each level $k\\ge0$, let $c_k=c_k(t)$ denote the center of the level-$k$ ball at time $t$. Initially, all centers coincide with the initial position of the point:\r
\r
$$\r
c_0(0)=c_1(0)=c_2(0)=\\cdots=\\gamma(0).\r
$$\r
\r
At level $k$, the associated ball is\r
\r
$$\r
B(c_k,r_k).\r
$$\r
\r
For $k\\ge1$, the level-$k$ ball encloses the level-$(k-1)$ ball if and only if\r
\r
$$\r
d(c_k,c_{k-1})+r_{k-1}\\le r_k,\r
$$\r
\r
or equivalently,\r
\r
$$\r
d(c_k,c_{k-1})\\le\\Delta_k.\r
$$\r
\r
Level $0$ rebuilds whenever the moving point reaches distance $r_0$ from its current center, i.e. when the point is no longer contained in the level $0$ ball. At such a rebuild, $c_0$ is reset to the current position of the point. For each $k\\ge1$, level $k$ rebuilds when a level-$(k-1)$ rebuild causes the level-$k$ ball to cease enclosing the level-$(k-1)$ ball. At such a rebuild, $c_k$ is reset to the new value of $c_{k-1}$.\r
\r
Rebuilds are processed from lower levels to higher levels. When a level-$(k−1)$ rebuild changes $c_{k−1}$, the new enclosure condition between levels $k−1$ and $k$ is immediately tested. If it fails, level $k$ rebuilds and $c_k$ is reset to the new $c_{k−1}$; this may in turn trigger a rebuild at level $k+1$, and so on. Because $\\gamma$ is arc-length parametrized, $d(c_k, c_{k-1}) \\le t$ at time $t$. Since $(\\Delta_k)$ is unbounded, $\\Delta_k\\ge t$ for some $k=k_0$, guaranteeing that the enclosure condition holds at level $k_0$ and the cascade terminates after finitely many levels.\r
\r
For every level $k\\ge 0$, we regard the initial configuration at time $t=0$ as the first level-$k$ rebuild. For each level $k$, let\r
\r
$$\r
t_{k,0}=0<t_{k,1}<t_{k,2}<\\cdots\r
$$\r
\r
denote the successive level-$k$ rebuild times whenever these times exist.\r
\r
**Lemma (Rebuild displacement bound)**  \r
Let \r
\r
$$\r
a=c_k(t_{k,i}),\r
\\qquad\r
b=c_k(t_{k,i+1})\r
$$\r
\r
be two consecutive rebuild positions at level $k\\ge 1$. Then\r
\r
$$\r
\\Delta_k<d(a,b)\\le r_k.\r
$$\r
\r
**Proof**  \r
For the lower bound, immediately after the rebuild at $a$, the level-$(k-1)$ center coincides with $a$. The level-$k$ ball continues to enclose the level-$(k-1)$ ball precisely while\r
\r
$$\r
d(a,c_{k-1})\\le\\Delta_k.\r
$$\r
\r
The rebuild at $b$ occurs at the first level-$(k-1)$ rebuild for which this condition fails. Since equality still satisfies the enclosure condition, we have\r
\r
$$\r
d(a,b)>\\Delta_k.\r
$$\r
\r
For the upper bound, let $T=t_{k,i+1}$ be the time of the rebuild at $b$. Before time $T$, the level-$k$ ball still has center $a$, and the point remains enclosed by this ball. Hence\r
\r
$$\r
d(\\gamma(t),a)<r_k\r
$$\r
\r
for $t<T$. At time $T$, the new level-$k$ center is the current position of the point, so $b=\\gamma(T)$.\r
\r
Since $\\gamma$ is continuous,\r
\r
$$\r
d(a,b)\r
=\r
\r
\\lim_{t\\to T^-}d(a,\\gamma(t))\r
\\le r_k.\r
$$\r
$\\square$\r
\r
## Dynamics of minimizing geodesics\r
\r
In this section we assume that $\\gamma$ is a unit-speed minimizing geodesic. The following lemma shows that, at every level, all intervals between successive rebuilds have the same length, and gives an explicit recurrence for these lengths.\r
\r
**Lemma (Dynamics of minimizing geodesics)**  \r
Suppose that $\\gamma$ is a unit-speed minimizing geodesic. For every $k$, every interval between successive level-$k$ rebuilds has the same length $L_k$. It is uniquely determined by\r
\r
$$\r
L_0=r_0, \\quad\r
C_k=\r
\\left\\lfloor\r
\\frac{\\Delta_k}{L_{k-1}}\r
\\right\\rfloor+1, \\quad \r
L_k=C_kL_{k-1}.\r
$$\r
\r
**Proof**  \r
Let $L_k$ denote the interval between the first and second level-$k$ rebuilds. We use induction to prove that every level-$k$ interval has length $L_k$.\r
\r
For level $0$, the point moves at unit speed and a rebuild occurs whenever it has traveled distance $r_0$ from the current center. Hence $L_0=r_0$, and every level-$0$ rebuild interval has length $L_0$.\r
\r
Now suppose $k\\ge1$, and assume every level-$(k-1)$ rebuild interval has length $L_{k-1}$.\r
\r
Immediately after the first level-$k$ rebuild, the centers of all levels up to $k$ coincide:\r
$$\r
c_0=c_1=\\cdots=c_k.\r
$$\r
\r
By the induction hypothesis, consecutive level-$(k-1)$ rebuilds occur $L_{k-1}$ units of time apart. Since $\\gamma$ is unit-speed, the point travels exactly $L_{k-1}$ units of arc length between consecutive level-$(k-1)$ rebuilds. Because $\\gamma$ is also minimizing, this arc length equals the metric distance between the corresponding positions. Thus each successive level-$(k-1)$ rebuild moves $c_{k-1}$ a distance exactly $L_{k-1}$ along $\\gamma$.\r
\r
Consequently, after $m$ level-$(k-1)$ rebuilds following the level-$k$ rebuild, the level-$(k-1)$ center has moved a distance\r
$$\r
d(c_{k-1},c_k)=mL_{k-1}\r
$$\r
from the fixed level-$k$ center.\r
\r
The level-$k$ region continues to enclose the level-$(k-1)$ region precisely while\r
$$\r
mL_{k-1}\\le \\Delta_k.\r
$$\r
\r
Therefore the largest number of level-$(k-1)$ rebuilds that can occur while the level-$k$ region remains enclosing is\r
$$\r
\\left\\lfloor\\frac{\\Delta_k}{L_{k-1}}\\right\\rfloor.\r
$$\r
\r
The next level-$k$ rebuild therefore occurs after\r
$$\r
C_k=\r
\\left\\lfloor\\frac{\\Delta_k}{L_{k-1}}\\right\\rfloor+1\r
$$\r
level-$(k-1)$ rebuilds, giving\r
$$\r
L_k=C_kL_{k-1}.\r
$$\r
\r
Finally, after every level-$k$ rebuild,\r
\r
$$\r
c_0=c_1=\\cdots=c_k.\r
$$\r
\r
Thus the configuration of the centers is identical to the initial configuration, except translated along the minimizing geodesic. Since the dynamics depend only on the relative positions of the centers, the subsequent evolution is identical after every level-$k$ rebuild. Therefore every interval between successive level-$k$ rebuilds has length $L_k$. $\\square$\r
\r
**Lemma**  \r
Suppose that $r_k=S^k$ for every $k$. Then \r
\r
$$\r
C_k\\in\\bigl\\{\\left\\lfloor{S}\\right\\rfloor,\\left\\lceil{S}\\right\\rceil\\bigr\\}.\r
$$\r
\r
for every $k\\ge 1$. In particular, if further $S=n>1$ is an integer, then $C_k=n$ and $L_k=n^k$ for every $k\\ge 1$.\r
\r
**Proof**  \r
Denote $x = (S^k - S^{k-1})/L_{k-1}$. The rebuild displacement bounds $S^{k-1} - S^{k-2} < L_{k-1} \\le S^{k-1}$ yield \r
\r
$$\r
S - 1 \\le x < S.\r
$$\r
\r
Taking the floor of the lower bound gives $\\lfloor S \\rfloor - 1 \\le \\lfloor x \\rfloor$. For the upper bound, $x < S \\le \\lceil S \\rceil$ implies the strict inequality $\\lfloor x \\rfloor < \\lceil S \\rceil$, which reduces to $\\lfloor x \\rfloor \\le \\lceil S \\rceil - 1$ as both sides are integers. Combining these yields\r
\r
\r
$$\r
\\lfloor S \\rfloor - 1 \r
\\le \r
\\lfloor x \\rfloor \r
\\le \r
\\lceil S \\rceil - 1.\r
$$\r
\r
\r
Since $C_k = \\lfloor x \\rfloor + 1$, it follows that $\\lfloor S \\rfloor \\le C_k \\le \\lceil S \\rceil$.\r
\r
The claim concerning integers $S$ immediately follows.\r
$\\square$\r
\r
The table below lists some values of $(C_k)$ and $(L_k/S^k)$ for different values of $S$. \r
\r
$$\r
\\begin{array}{c||c|cccccccccccc}\r
S & k & 0 & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 & 11 & 12 \\\\\r
\\hline\r
3/2 & C_k &  & 1 & 1 & 2 & 1 & 2 & 1 & 2 & 2 & 1 & 2 & 1 & 2 \\\\\r
& L_k/S^k & 1 & 0.67 & 0.44 & 0.59 & 0.40 & 0.53 & 0.35 & 0.47 & 0.62 & 0.42 & 0.55 & 0.37 & 0.49 \\\\\r
\\hline\r
2 & C_k &  & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 \\\\\r
& L_k/S^k & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\\\\r
\\hline\r
5/2 & C_k &  & 2 & 2 & 3 & 2 & 3 & 3 & 2 & 3 & 2 & 3 & 2 & 3 \\\\\r
& L_k/S^k & 1 & 0.8 & 0.64 & 0.77 & 0.61 & 0.74 & 0.88 & 0.71 & 0.85 & 0.68 & 0.82 & 0.65 & 0.78 \\\\\r
\\end{array}\r
\\\\[4pt]\r
\\text{Sequences for $S=3/2,2,5/2$. Terms that do not have two decimal digits are exact.}\r
$$\r
\r
### Total rebuild rate\r
\r
The rebuild frequency of level $k$ is $1/L_k$, since one rebuild occurs every $L_k$ units of travel.\r
\r
The total rebuild frequency of the hierarchy is therefore\r
\r
$$\r
R=\\sum_{k=0}^{\\infty}\\frac{1}{L_k}.\r
$$\r
\r
Here $R$ represents the total asymptotic frequency of rebuild events across all levels, and serves as a simple mathematical proxy for the amount of tree-maintenance work in the algorithm caused by the object's motion. Each rebuild at each level counts as a separate event. Thus, if one level-0 rebuild triggers a cascade through several higher levels, every rebuild in the cascade contributes separately to R.\r
\r
### Bounding total rebuild rate\r
\r
The displacement bound gives, for two consecutive rebuild positions at level $k$,\r
\r
$$\r
\\Delta_k<d(a,b)\\le r_k.\r
$$\r
\r
In the minimizing geodesic case, the path is unit-speed, so the distance between consecutive level-$k$ rebuild positions is exactly the time between them. Thus\r
\r
$$\r
\\Delta_k<L_k\\le r_k.\r
$$\r
\r
This leads us to define lower and upper total rebuild rates\r
\r
$$\r
R_{\\mathrm{ideal}}\r
=\r
\\sum_{k=0}^{\\infty}\\frac{1}{r_k},\r
\\qquad\r
R_{\\mathrm{upper}}\r
=\r
\\sum_{k=0}^{\\infty}\\frac{1}{\\Delta_k}\r
$$\r
\r
and the corresponding bounds are\r
\r
$$\r
R_{\\mathrm{ideal}}\\le R < R_{\\mathrm{upper}}\r
$$\r
\r
assuming $R_{\\text{upper}}<\\infty$. Note that then $R=R_{\\text{ideal}}$ if and only if $L_k=r_k$ for every $k$.\r
\r
## Rebuild rates for $r_k=S^k$\r
\r
Suppose that $r_k=S^k$ for some $S>1$. Then the ideal and upper total rebuild rates involve geometric series and evaluate to\r
\r
$$\r
\\frac{S}{S-1}\r
=\r
R_{\\mathrm{ideal}}\r
\\le R<\r
R_{\\mathrm{upper}}\r
=\r
\\frac{S^2-S+1}{(S-1)^2}.\r
$$\r
\r
We know that if $S=n$ is an integer, then $L_k=n^k$ for every $k$, so that $R=R_{\\text{ideal}}$ and the lower bound is realized. Below we show that the upper bound is also realized as limits $S\\to n^-$ for integer $n>1$.\r
\r
**Lemma**  \r
Let $n>1$ be an integer. For every fixed $k\\ge1$, there exists $\\delta_k>0$ such that\r
\r
$$\r
L_k=(n-1)n^{k-1}\r
$$\r
\r
for all $S\\in(n-\\delta_k,n)$.\r
\r
**Proof**  \r
We proceed by induction on $k$. For $k=1$,\r
\r
$$\r
L_1=\\lfloor S\\rfloor=n-1\r
$$\r
\r
throughout $S\\in(n-1,n)$.\r
\r
Suppose the claim holds at level $k-1$. Then, sufficiently close to $n$,\r
\r
$$\r
C_k\r
=\r
\r
\\left\\lfloor\r
\\frac{S^k-S^{k-1}}{(n-1)n^{k-2}}\r
\\right\\rfloor+1.\r
$$\r
\r
The expression inside the floor is strictly increasing in $S$ and equals $n$ at $S=n$. It is therefore less than $n$ for $S<n$ and greater than $n-1$ for $S$ sufficiently close to $n$. Hence $C_k=n$ sufficiently close to $n$, and\r
\r
$$\r
L_k=nL_{k-1}=(n-1)n^{k-1}.\r
$$\r
\r
This completes the induction. $\\square$\r
\r
**Proposition**  \r
For every integer $n>1$,\r
\r
$$\r
\\lim_{S\\to n^-}R(S)\r
=\r
R_{\\text{upper}}(n).\r
$$\r
\r
**Proof**  \r
By the lemma, for every fixed $k$,\r
\r
$$\r
\\lim_{S\\to n^-}\\frac{1}{L_k(S)}\r
=\r
\r
\\frac{1}{(n-1)n^{k-1}}.\r
$$\r
\r
Furthermore, for $S$ sufficiently close to $n$,\r
\r
$$\r
\\frac{1}{L_k(S)}\r
<\r
\\frac{1}{S^{k-1}(S-1)},\r
$$\r
\r
and the right-hand side is uniformly bounded near $n$ by a summable geometric sequence. Thus the limit may be taken termwise in the rebuild-rate series, giving\r
\r
$$\r
\\lim_{S\\to n^-}R(S)\r
=\r
1+\\sum_{k=1}^{\\infty}\\frac{1}{(n-1)n^{k-1}}\r
=\r
\\frac{n^2-n+1}{(n-1)^2}\r
=\r
R_{\\text{upper}}(n).\r
$$\r
$\\square$\r
\r
In the graph below we plot $R$ as function of $S$, normalized so that $y=0$ corresponds to $R_\\text{ideal}$ and $y=1$ corresponds to $R_\\text{upper}$. Specifically, the plot shows\r
\r
$$\r
\\frac{R(S)-R_\\text{ideal}(S)}{R_\\text{upper}(S)-R_\\text{ideal}(S)}.\r
$$\r
\r
It demonstrates the jumps from $R\\approx R_{\\text{upper}}$ just before an integer to $R=R_{\\text{ideal}}$ at the integer value. \r
\r
<figure>\r
\r
![Rebuild rate as function of $S$](./eta.png)\r
\r
</figure>\r
\r
## Non-geodesic paths\r
\r
Suppose that $\\gamma$ is an arc-length parametrized path, but not necessarily a minimizing geodesic. We can no longer write explicit formulas for the rebuild times or obtain a periodic rebuild schedule. However, the rebuild displacement bound remains valid: if $a$ and $b$ are two consecutive rebuild positions at level $k$, then\r
\r
$$\r
\\Delta_k<d(a,b)\\le r_k.\r
$$\r
\r
Since the distance between two points is at most the length of the path segment connecting them, consecutive level-$k$ rebuilds must be separated by more than $\\Delta_k$ units of travel.\r
\r
For each level $k$, let\r
\r
$$\r
m_k(t)=\\#\\{i:0 < t_{k,i}\\le t\\}\r
$$\r
\r
denote the number of level-$k$ rebuilds up to time $t>0$, excluding the initial rebuild. Define the total number of rebuild events across all levels up time $T$ as\r
\r
$$\r
M(t) = \\sum_{k=0}^\\infty m_k(t).\r
$$\r
\r
Then we define upper asymptotic rebuild rate by\r
\r
$$\r
R^+\r
=\r
R^+(\\gamma)\r
=\r
\\limsup_{t\\to\\infty}\\frac{M(t)}{t}.\r
$$\r
\r
**Proposition**  \r
The upper asymptotic rebuild rate satisfies\r
\r
$$\r
R^+\r
\\le\r
R_{\\text{upper}}.\r
$$\r
\r
In particular, if $S>1$ and $(r_k)=(S^k)$, then\r
\r
$$\r
R^+\r
\\le\r
\\frac{S^2-S+1}{(S-1)^2}.\r
$$\r
\r
**Proof**  \r
There are $m_k(t)$ non-initial level-$k$ rebuilds by time $t>0$. Each is separated from its preceding level-$k$ rebuild by more than $\\Delta_k$ units of travel. Thus\r
\r
$$\r
t > m_k(t)\\Delta_k\r
$$\r
\r
for every $k\\ge 0$ and every $t>0$. From this obtain\r
\r
$$\r
R^+\r
=\r
\\limsup_{t\\to\\infty}\\lim_{j\\to\\infty}\\sum_{k=0}^j\\frac{m_k(t)}{t}\r
\\le\r
\\limsup_{t\\to\\infty}\\lim_{j\\to\\infty}\\sum_{k=0}^j\\frac{1}{\\Delta_k}\r
=\r
\\sum_{k=0}^\\infty\\frac{1}{\\Delta_k}\r
=\r
R_{\\text{upper}}.\r
$$\r
\r
$\\square$\r
\r
If $S=n>1$ is an integer, and $r_k=S^k$, then it can be shown that a minimizing geodesic maximizes the upper asymptotic rebuild rate.\r
\r
A minimizing geodesic is a natural candidate for maximizing the upper asymptotic rebuild rate because it does this if $S$ is integer, and regardless of $S$ it follows a greedy strategy: after each rebuild, it moves directly toward the nearest point at which the next rebuild can occur. This makes each individual rebuild occur as early as possible, but, as the construction below shows, this local strategy need not maximize the upper asymptotic rebuild rate. \r
\r
### Example: minimizing geodesics do not always maximize upper asymptotic rebuild rate\r
\r
We construct a path in $\\R^2$ that mostly follows a geodesic but with an initial (and periodically repeated) perturbation that changes the phase of the rebuild schedule so that, through level $4$, the path $\\gamma$ has exactly the same rebuild-rate contribution as the geodesic,\r
\r
$$\r
1+\\frac13+\\frac{11}{135}+\\frac{3}{135}+\\frac{1}{135}\r
=\r
1+\\frac13+\\frac1{12}+\\frac1{48}+\\frac1{144}.\r
$$\r
\r
However, the level-$4$ rebuild of $\\gamma$ is reached after a net advance of only\r
\r
$$\r
\\Delta_2+123\\approx 132.83,\r
$$\r
\r
whereas the corresponding geodesic advance is $144$. Thus $\\gamma$ reaches the same level $0$ to $4$ rebuild rate using a smaller advance. This difference propagates to the higher levels and eventually gives $\\gamma$ a strictly larger upper asymptotic rebuild rate.\r
\r
##### Construction\r
\r
Fix $S=147/40=3.675$ and let $(r_k)=(S^k)$. We construct a path $\\gamma:[0,\\infty)\\to\\R^2$ satisfying\r
\r
$$\r
R^+(\\gamma)>R(S).\r
$$\r
\r
Let $\\theta\\in(0,\\pi/2)$ be the unique angle satisfying\r
\r
$$\r
6\\cos\\theta=\\Delta_2-6\\approx 3.83.\r
$$\r
\r
Denote\r
\r
$$\r
A=\\Delta_2+123\\approx 132.83.\r
$$\r
\r
Let $\\gamma_4 : [0, 135] \\to \\mathbb{R}^2$ be the unit-speed, piecewise linear path connecting these vertices in sequence:\r
\r
$$\r
\\begin{aligned}\r
(0,0) \r
&\\to (3\\cos\\theta, 3\\sin\\theta) \\\\\r
&\\to (6\\cos\\theta, 0) = (\\Delta_2 - 6, 0) \\\\\r
&\\to (A, 0).\r
\\end{aligned}\r
$$\r
\r
Define $\\gamma:[0,\\infty)\\to\\R^2$ by \r
\r
$$\r
\\gamma(t)\r
=\r
\\gamma_4\\bigl(t - 135\\lfloor t/135 \\rfloor\\bigr) \r
+ \\lfloor t/135 \\rfloor \\bigl(\\gamma_4(135) - \\gamma_4(0)\\bigr).\r
$$\r
\r
That is, $\\gamma$ repeats $\\gamma_4$ indefinitely, translating each copy by \r
\r
$$\r
\\gamma_4(135)-\\gamma_4(0)\r
=\r
(A,0)\r
$$\r
\r
so that the resulting path is continuous. Since each copy is unit-speed and the translations do not affect speed, $\\gamma$ is also unit speed. \r
\r
##### Rebuilds up to level $4$\r
\r
Let's begin by examining the rebuild events of $\\gamma$ on the interval $(0,135]$. We exclude $0$ so that initial builds are not counted but include the endpoint $135$ so that any rebuild exactly at $135$ is included.\r
\r
Level-$0$ rebuilds happen exactly at each $t\\in\\{1,2,3,\\ldots,135\\}$.\r
\r
Level-$1$ rebuilds happen exactly at each $t\\in\\{3,6,9,\\ldots,135\\}$.\r
\r
For level-$2$ the rebuild threshold is $\\Delta_2\\approx 9.83$. At the fourth level-$1$ rebuild at $t=12$ we have $\\gamma(12)=(\\Delta_2,0)$ so that we are exactly on the threshold and this does not cause a level-$2$ rebuild. Therefore the fifth level-$1$ rebuild at $\\gamma(15)=(\\Delta_2+3,0)$ causes the first level-$2$ rebuild. See image below but note that it includes initial builds at $t=0$.\r
\r
![Counter-example image](./counter_example.png)\r
\r
After $t=15$ the path follows a straight line and the subsequent level-$2$ rebuilds happen with intervals of $L_2=12$. This means that the level-$2$ rebuilds happen exactly at $t=15+12m$, $m\\in\\{0,1,\\ldots,10\\}$.\r
\r
For level-$3$ the rebuild threshold is $\\Delta_3\\approx 36.13$. At the third level-$2$ rebuild at $t=39$ we have $\\gamma(39)=(\\Delta_2+27,0)\\approx(36.83,0)$. This is just over the threshold so that the first level-$3$ rebuild happens at $t=39$.\r
\r
After $t=39$ the path follows a straight line and the subsequent level-$3$ rebuilds happen with intervals $L_3=48$. This means that the level-$3$ rebuilds happen exactly at $t\\in\\{39,87,135\\}$.\r
\r
For level-$4$ the rebuild threshold is $\\Delta_4\\approx 132.77$. At the third level-$3$ rebuild at $t=135$ we have $\\gamma(135)=(A,0)\\approx(132.83,0)$. This is just over the threshold so that the first level-$4$ rebuild happens at $t=135$.\r
\r
These are all the rebuild events that happen for $\\gamma$ on the interval $(0,135]$. There are a total of $195$ rebuild events on the interval as the following table shows.\r
\r
$$\r
\\begin{array}{c|c}\r
\\text{Level} & \\text{Count} \\\\\r
\\hline\r
0 & 135 \\\\\r
1 & 45 \\\\\r
2 & 11 \\\\\r
3 & 3 \\\\\r
4 & 1 \\\\\r
\\end{array}\r
$$\r
\r
#####  Higher-level rebuilds\r
\r
Let's look at higher level rebuilds for $\\gamma$. This is simple since the path just advances by $(A,0)$ between each level-$4$ rebuild.\r
\r
For level-$5$ we have $\\Delta_5\\approx 487.93$. The number of level-$4$ rebuild intervals between two subsequent level-$5$ rebuilds is\r
\r
$$\r
\\Bigl\\lfloor\\frac{\\Delta_5}{A}\\Bigr\\rfloor+1=4\r
$$\r
\r
and the advance in the $e_1$ direction between level-$5$ rebuilds is $4A$. \r
\r
Similarly, for level-$6$ we have $\\Delta_6\\approx 1793.12$. The number of level-$5$ rebuild intervals between two subsequent level-$6$ rebuilds is \r
\r
$$\r
\\Bigl\\lfloor\\frac{\\Delta_6}{4A}\\Bigr\\rfloor+1=4\r
$$\r
\r
and the advance in the $e_1$ direction between level-$6$ rebuilds is $16A$.\r
\r
Finally, for level-$7$ we have $\\Delta_7\\approx 6589.73$. The number of level-$6$ rebuild intervals between two subsequent level-$7$ rebuilds is \r
\r
$$\r
\\Bigl\\lfloor\\frac{\\Delta_7}{16A}\\Bigr\\rfloor+1=4.\r
$$\r
\r
Thus there are $4\\cdot 4\\cdot 4=64$ level-$4$ rebuilds between two subsequent level-$7$ rebuilds. The table below counts all the rebuilds on the interval $(0,64\\cdot 135]$.\r
\r
$$\r
\\begin{array}{c|c}\r
\\text{Level} & \\text{Count} \\\\\r
\\hline\r
0 & 64\\cdot 135 \\\\\r
1 & 64\\cdot 45 \\\\\r
2 & 64\\cdot 11 \\\\\r
3 & 64\\cdot 3 \\\\\r
4 & 64 \\\\\r
5 & 16 \\\\\r
6 & 4 \\\\\r
7 & 1 \\\\\r
\\hline\r
\\text{Sum} & 12501\r
\\end{array}\r
$$\r
\r
Since the path is translated by the same vector after each interval of length $135$, and a level-$7$ rebuild occurs every $64$ such intervals, the entire rebuild pattern through level $7$ repeats, up to translation, on every subsequent interval of length $64\\cdot 135$. Therefore \r
\r
$$\r
R^+(\\gamma)\\ge\\frac{12501}{64\\cdot 135}=\\frac{100008}{69120}.\r
$$\r
\r
##### Comparison with the geodesic\r
\r
What about the geodesic rebuild rate? The geodesic construction gives the following values for $C_k$ and $L_k$ for $k\\le 6$.\r
\r
$$\r
\\begin{array}{c||c|c|c|c|c|c|c}\r
k & 0 & 1 & 2 & 3 & 4 & 5 & 6 \\\\\r
\\hline\r
C_k & & 3 & 4 & 4 & 3 & 4 & 4  \\\\\r
L_k & 1 & 3 & 12 & 48 & 144 & 576 & 2304 \\\\\r
\\end{array}\r
$$\r
\r
For the remaining terms we can use $C_k\\ge\\lfloor S\\rfloor=3$ to get $L_k\\ge 3^{k-6}L_6$ for every $k\\ge 6$, and thus\r
\r
$$\r
\\begin{aligned}\r
R(S)\r
&=\r
\\sum_{k=0}^\\infty \\frac{1}{L_k}\r
=\\frac{833}{576}+\\sum_{k=6}^\\infty \\frac{1}{L_k} \\\\\r
&\\le\r
\\frac{833}{576} + \\sum_{k=6}^\\infty \\frac{1}{3^{k-6}L_6}\r
=\r
\\frac{833}{576} + \\frac{1}{L_6}\\sum_{k=0}^\\infty \\frac{1}{3^k} \\\\\r
&=\r
\\frac{833}{576} + \\frac{3}{2L_6} \r
=\r
\\frac{6667}{4608}=\\frac{100005}{69120}.\r
\\end{aligned}\r
$$\r
\r
Combining the bounds we get\r
\r
$$\r
R^+(\\gamma)\\ge \\frac{100008}{69120} > \\frac{100005}{69120}\\ge R(S).\r
$$\r
\r
The preceding estimates only use enough terms to prove the strict inequality. The actual gap is larger and the full rates are approximately\r
\r
$$\r
R^+(\\gamma)\\approx 1.446927,\\qquad R(S)\\approx 1.446808.\r
$$`,jh=`## The structure of the $L_k$ hierarchy\r
\r
For an integer $n>1$, consider $S\\in(n,n+1)$. From the previous results,\r
\r
$$\r
C_k(S)\\in\\{n,n+1\\},\r
$$\r
\r
and\r
\r
$$\r
L_k(S)=\\prod_{i=1}^kC_i(S).\r
$$\r
\r
We first record the piecewise-constant structure of the functions $C_k$ and $L_k$.\r
\r
For a function $f:(n,n+1)\\to\\mathbb R$, we call $S_0\\in(n,n+1)$ a **jump point** if the one-sided limits\r
\r
$$\r
f(S_0^-)=\\lim_{S\\uparrow S_0}f(S),\r
\\qquad\r
f(S_0^+)=\\lim_{S\\downarrow S_0}f(S)\r
$$\r
\r
exist and are different.\r
\r
Since\r
\r
$$\r
C_1(S)=\\lfloor S\\rfloor=n,\r
$$\r
\r
both $C_1$ and $L_1$ are constant on $(n,n+1)$.\r
\r
Now suppose that $L_{k-1}$ is piecewise constant. Denote\r
\r
$$\r
q_k(S)\r
=\r
\\frac{(S-1)S^{k-1}}{L_{k-1}(S)}\r
$$\r
\r
so that\r
\r
$$\r
C_k(S)=\\lfloor q_k(S)\\rfloor+1.\r
$$\r
\r
On every interval on which $L_{k-1}$ is constant, the function $q_k$ is strictly increasing. Since\r
\r
$$\r
C_k(S)\\in\\{n,n+1\\},\r
$$\r
\r
the only possible change of $C_k$ on such an interval is an upward jump from $n$ to $n+1$. This occurs precisely when\r
\r
$$\r
q_k(S)=n.\r
$$\r
\r
Thus $C_k$ is piecewise constant, and consequently\r
\r
$$\r
L_k=L_{k-1}C_k\r
$$\r
\r
is also piecewise constant.\r
\r
By induction, $C_k$ and $L_k$ are piecewise constant for every $k$.\r
\r
We now determine the possible locations of the jumps.\r
\r
Since\r
\r
$$\r
C_1(S)=n,\r
$$\r
\r
the factor $n$ occurs at least once in every $L_k$. Thus every possible value of $L_{k-1}$ has the form\r
\r
$$\r
L_{k-1}=n^u(n+1)^v,\r
\\qquad\r
u+v=k-1,\r
\\qquad\r
u\\ge1.\r
$$\r
\r
At a jump of $C_k$, we have\r
\r
$$\r
q_k(S)=n,\r
$$\r
\r
and hence\r
\r
$$\r
(S-1)S^{k-1}\r
=\r
nL_{k-1}(S).\r
$$\r
\r
Substituting\r
\r
$$\r
L_{k-1}=n^u(n+1)^v\r
$$\r
\r
gives\r
\r
$$\r
(S-1)S^{k-1}\r
=\r
n^{u+1}(n+1)^v.\r
$$\r
\r
Writing $a=u+1$, we obtain the candidate equations\r
\r
$$\r
(S-1)S^{k-1}\r
=\r
n^a(n+1)^{k-a},\r
\\qquad\r
a=2,\\ldots,k.\r
$$\r
\r
This motivates the definition\r
\r
$$\r
J_k\r
=\r
\\left\\{\r
S\\in(n,n+1):\r
(S-1)S^{k-1}\r
=\r
n^a(n+1)^{k-a}\r
\\text{ for some }a=2,\\ldots,k\r
\\right\\}.\r
$$\r
\r
Since\r
\r
$$\r
S\\mapsto(S-1)S^{k-1}\r
$$\r
\r
is strictly increasing for $S>1$, each of these equations has at most one solution.\r
\r
### Cancellation between consecutive levels\r
\r
The key relation is\r
\r
$$\r
q_{k+1}\r
=\r
\\frac{Sq_k}{C_k}.\r
$$\r
\r
Suppose that $C_k$ jumps upward at $S_0$. Then\r
\r
$$\r
q_k(S_0)=n.\r
$$\r
\r
Immediately before the jump,\r
\r
$$\r
C_k(S_0^-)=n,\r
$$\r
\r
and hence\r
\r
$$\r
q_{k+1}(S_0^-)\r
=\r
\\frac{S_0n}{n}\r
=\r
S_0\r
>\r
n.\r
$$\r
\r
Immediately after the jump,\r
\r
$$\r
C_k(S_0^+)=n+1,\r
$$\r
\r
so\r
\r
$$\r
q_{k+1}(S_0^+)\r
=\r
\\frac{S_0n}{n+1}\r
<\r
n,\r
$$\r
\r
because $S_0<n+1$.\r
\r
Thus $C_{k+1}$ jumps downward at the same point:\r
\r
$$\r
C_{k+1}(S_0^-)=n+1,\r
\\qquad\r
C_{k+1}(S_0^+)=n.\r
$$\r
\r
Consequently,\r
\r
$$\r
L_k(S_0^-)\r
=\r
nL_{k-1}(S_0),\r
$$\r
\r
while\r
\r
$$\r
L_k(S_0^+)\r
=\r
(n+1)L_{k-1}(S_0).\r
$$\r
\r
But at the next level,\r
\r
$$\r
L_{k+1}(S_0^-)\r
=\r
(n+1)nL_{k-1}(S_0)\r
=\r
L_{k+1}(S_0^+).\r
$$\r
\r
Thus an upward jump of $L_k$ is cancelled at the next level.\r
\r
### The jump points of $L_k$\r
\r
**Lemma**  \r
For every $k\\ge1$, the function $L_k$ on $(n,n+1)$ is piecewise constant with exactly $k-1$ jump points given by\r
\r
$$ \r
J_k = \\left\\{ S\\in(n,n+1): (S-1)S^{k-1} = n^a(n+1)^{k-a} \\text{ for some }a=2,\\ldots,k \\right\\}. \r
$$\r
\r
Moreover, as $S$ increases through $(n,n+1)$, the successive constant values of $L_k$ are\r
\r
$$ \r
n^k, \\quad n^{k-1}(n+1), \\quad \\ldots, \\quad n(n+1)^{k-1}. \r
$$\r
\r
**Proof**  \r
We proceed by induction on $k\\ge1$.\r
\r
For $k=1$, $L_1(S)=n$ throughout $(n,n+1)$. The set $J_1$ is empty, $L_1$ has no jump points, and it takes the single constant value $n^1$, so the statement holds.\r
\r
Now suppose the claim holds for level $k-1\\ge1$. By the induction hypothesis, $L_{k-1}$ has exactly $k-2$ jump points $s_1 < s_2 < \\cdots < s_{k-2}$ in $(n,n+1)$. Setting $s_0=n$ and $s_{k-1}=n+1$, these points divide $(n,n+1)$ into $k-1$ open subintervals $I_r = (s_r, s_{r+1})$ for $r=0,\\ldots,k-2$, on which $L_{k-1}$ takes the constant value\r
\r
$$\r
L_{k-1}(S) = n^{k-1-r}(n+1)^r.\r
$$\r
\r
On each subinterval $I_r$, the function \r
\r
$$\r
q_k(S) = \\frac{(S-1)S^{k-1}}{L_{k-1}(S)}\r
$$\r
\r
is continuous and strictly increasing.\r
\r
To determine the behavior of $q_k$ on each subinterval, we check its limits at the endpoints. At the left endpoint $s_0=n$, we have $q_k(n^+)=n-1<n$. At the right endpoint $s_{k-1}=n+1$, we have $q_k((n+1)^-)=n+1>n$. At each internal boundary $s_r$ ($r=1,\\ldots,k-2$), $C_{k-1}$ undergoes an upward jump, so by \r
\r
$$\r
q_k(S)=\\frac{Sq_{k-1}(S)}{C_{k-1}(S)}\r
$$\r
\r
and the inter-level cancellation result, $q_k(s_r^-) = s_rn/n > n$ and $q_k(s_r^+) = s_r n/(n+1) < n$.\r
\r
Since $q_k$ is continuous and strictly increasing on $I_r$, starting strictly below $n$ and ending strictly above $n$, the Intermediate Value Theorem implies that $q_k(S)=n$ has a unique solution $x_{r+1} \\in I_r$. Consequently, $C_k(S) = \\lfloor q_k(S)\\rfloor + 1$ jumps upward from $n$ to $n+1$ at $x_{r+1}$, and remains constant elsewhere on $I_r$.\r
\r
It remains to check whether $L_k = L_{k-1}C_k$ has any jump points at the internal boundaries $s_r$. Since $s_r$ is a jump point of $C_{k-1}$, the cancellation property establishes that the upward jump in $L_{k-1}$ is exactly offset by the downward jump of $C_k$ across $s_r$, yielding $L_k(s_r^-) = L_k(s_r^+)$. Thus $L_k$ is continuous across each $s_r$.\r
\r
Therefore, the jump points of $L_k$ on $(n,n+1)$ are precisely the $k-1$ points $x_1 < x_2 < \\cdots < x_{k-1}$. The equation $q_k(x_{r+1})=n$ unwinds to\r
\r
$$\r
(x_{r+1}-1)x_{r+1}^{k-1} = n^{k-r}(n+1)^r.\r
$$\r
\r
Writing $a=k-r$, as $r$ ranges from $0$ to $k-2$, $a$ ranges from $k$ down to $2$, which shows that the jump points are precisely the elements of $J_k$.\r
\r
Finally, as $S$ increases across $(n,n+1)$, $C_k$ equals $n$ on $(s_r, x_{r+1})$ and $n+1$ on $(x_{r+1}, s_{r+1})$. Multiplying by the constant value of $L_{k-1}$ on $I_r$ shows that $L_k$ takes the value $n^{k-r}(n+1)^r$ on $(x_r, x_{r+1})$, yielding the sequence of values $n^k, n^{k-1}(n+1), \\ldots, n(n+1)^{k-1}$. $\\blacksquare$\r
\r
### Jump points at different levels are distinct\r
\r
We now show that jump sets of different levels are disjoint.\r
\r
**Lemma.**  \r
Let $n>1$ be an integer. Suppose that $S\\in(n,n+1)$ satisfies\r
\r
$$\r
(S-1)S^{k-1}\r
=\r
n^a(n+1)^{k-a}\r
$$\r
\r
and\r
\r
$$\r
(S-1)S^{j-1}\r
=\r
n^b(n+1)^{j-b},\r
$$\r
\r
where\r
\r
$$\r
k>j\\ge2,\r
\\qquad\r
2\\le a\\le k,\r
\\qquad\r
2\\le b\\le j.\r
$$\r
\r
Then this is impossible.\r
\r
**Proof.**  \r
Dividing the two equations gives\r
\r
$$\r
S^{k-j}\r
=\r
n^{a-b}(n+1)^{(k-a)-(j-b)}.\r
$$\r
\r
Set\r
\r
$$\r
m=k-j,\r
\\qquad\r
p=a-b.\r
$$\r
\r
Then\r
\r
$$\r
S^m=n^p(n+1)^{m-p}.\r
$$\r
\r
Since\r
\r
$$\r
n<S<n+1,\r
$$\r
\r
we have\r
\r
$$\r
n^m<S^m<(n+1)^m.\r
$$\r
\r
This forces\r
\r
$$\r
0<p<m.\r
$$\r
\r
Indeed, if $p\\le0$, then\r
\r
$$\r
n^p(n+1)^{m-p}\\ge(n+1)^m,\r
$$\r
\r
while if $p\\ge m$, then\r
\r
$$\r
n^p(n+1)^{m-p}\\le n^m.\r
$$\r
\r
Now let\r
\r
$$\r
g=\\gcd(p,m),\r
\\qquad\r
p=gp',\r
\\qquad\r
m=gm',\r
$$\r
\r
so that\r
\r
$$\r
\\gcd(p',m')=1.\r
$$\r
\r
Taking the $g$-th root of the equation above gives\r
\r
$$\r
S^{m'}\r
=\r
n^{p'}(n+1)^{m'-p'}.\r
$$\r
\r
Set\r
\r
$$\r
A=n^{p'}(n+1)^{m'-p'}.\r
$$\r
\r
Thus\r
\r
$$\r
S^{m'}=A.\r
$$\r
\r
We now use the standard irreducibility criterion for binomials: if a positive rational number $A$ is not a $q$-th power in $\\mathbb Q$ for any prime $q\\mid m'$, then\r
\r
$$\r
X^{m'}-A\r
$$\r
\r
is irreducible over $\\mathbb Q$.\r
\r
We claim that this criterion applies to\r
\r
$$\r
A=n^{p'}(n+1)^{m'-p'}.\r
$$\r
\r
Let $q$ be any prime dividing $m'$. Since\r
\r
$$\r
\\gcd(p',m')=1,\r
$$\r
\r
neither $p'$ nor $m'-p'$ is divisible by $q$.\r
\r
Also, $n$ and $n+1$ are coprime, and they cannot both be $q$-th powers in $\\mathbb Q$, since they are consecutive integers. Hence at least one of $n$ and $n+1$ has a prime factor whose exponent in its prime factorization is not divisible by $q$.\r
\r
If this prime factor comes from $n$, its exponent in $A$ is multiplied by $p'$, which is not divisible by $q$. If it comes from $n+1$, its exponent is multiplied by $m'-p'$, which is also not divisible by $q$.\r
\r
Thus $A$ is not a $q$-th power in $\\mathbb Q$. Since this holds for every prime $q\\mid m'$, the binomial\r
\r
$$\r
X^{m'}-A\r
$$\r
\r
is irreducible over $\\mathbb Q$.\r
\r
Since $S$ is a root of this polynomial, its minimal polynomial over $\\mathbb Q$ has degree $m'$. Consequently,\r
\r
$$\r
1,S,\\ldots,S^{m'-1}\r
$$\r
\r
are linearly independent over $\\mathbb Q$.\r
\r
We now return to the first jump equation,\r
\r
$$\r
S^k-S^{k-1}\r
=\r
n^a(n+1)^{k-a}.\r
$$\r
\r
Its right-hand side is rational.\r
\r
Since\r
\r
$$\r
S^{m'}=A\\in\\mathbb Q,\r
$$\r
\r
we can write\r
\r
$$\r
k=qm'+r,\r
\\qquad\r
k-1=q'm'+r',\r
$$\r
\r
with\r
\r
$$\r
0\\le r,r'<m'.\r
$$\r
\r
Thus\r
\r
$$\r
S^k=A^qS^r,\r
\\qquad\r
S^{k-1}=A^{q'}S^{r'}.\r
$$\r
\r
The exponents $k$ and $k-1$ are consecutive, so\r
\r
$$\r
r\\ne r'.\r
$$\r
\r
Therefore the first jump equation becomes a nontrivial rational linear relation among\r
\r
$$\r
1,S,\\ldots,S^{m'-1}.\r
$$\r
\r
This contradicts their linear independence.\r
\r
Hence no such $S$ can exist.\r
$\\square$\r
\r
As an immediate consequence,\r
\r
$$\r
J_k\\cap J_j=\\varnothing\r
\\qquad\\text{whenever }k\\ne j.\r
$$\r
\r
\r
### Density of the jump points\r
\r
We now show that the union of the jump sets is dense.\r
\r
Let\r
\r
$$\r
J=\\bigcup_{k\\ge2}J_k.\r
$$\r
\r
Fix $\\theta\\in(0,1)$. Choose integers $a_k$ such that\r
\r
$$\r
2\\le a_k\\le k,\r
\\qquad\r
\\frac{a_k}{k}\\longrightarrow\\theta.\r
$$\r
\r
By the jump-point lemma, for each $k$ there is a unique point $S_k\\in J_k$ corresponding to the chosen $a_k$.\r
\r
Taking $k$-th roots gives\r
\r
$$\r
S_k\r
\\left(1-\\frac1{S_k}\\right)^{1/k}\r
=\r
n^{a_k/k}(n+1)^{1-a_k/k}.\r
$$\r
\r
The second factor on the left tends to $1$, while the right-hand side tends to\r
\r
$$\r
n^\\theta(n+1)^{1-\\theta}.\r
$$\r
\r
Hence\r
\r
$$\r
S_k\\longrightarrow\r
n^\\theta(n+1)^{1-\\theta}.\r
$$\r
\r
The function\r
\r
$$\r
\\theta\\longmapsto n^\\theta(n+1)^{1-\\theta}\r
$$\r
\r
is continuous and strictly increasing, with range $(n,n+1)$. Therefore every point of $(n,n+1)$ is a limit of points in $J$, and hence $J$ is dense in $(n,n+1)$.\r
\r
Since each $J_k$ is finite, $J$ is countable.\r
\r
### Uniform convergence of the rebuild-rate series\r
\r
We now use the structure of the $L_k$ to understand the dependence of the rebuild rate on $S$.\r
\r
Recall that\r
\r
$$\r
R(S)\r
=\r
\\sum_{k=0}^{\\infty}\\frac1{L_k(S)}.\r
$$\r
\r
Since $C_k(S)\\ge n$, we have $L_k(S)\\ge n^k$. Consequently,\r
\r
$$\r
0<\\frac1{L_k(S)}\\le\\frac1{n^k},\r
$$\r
\r
for every $S\\in(n,n+1)$.\r
\r
Thus the tail satisfies\r
\r
$$\r
\\sup_{S\\in(n,n+1)}\r
\\sum_{k>K}\\frac1{L_k(S)}\r
\\le\r
\\sum_{k>K}\\frac1{n^k}\r
=\r
\\frac{n^{-K-1}}{1-1/n}.\r
$$\r
\r
In particular, the series defining $R$ converges uniformly on $(n,n+1)$.\r
\r
This uniform tail estimate allows us to transfer the finite-level jump structure to the infinite sum.\r
\r
### Continuity away from the jump set\r
\r
Suppose that\r
\r
$$\r
S_0\\in(n,n+1)\\setminus J.\r
$$\r
\r
Fix $K$. Since\r
\r
$$\r
S_0\\notin J_1\\cup\\cdots\\cup J_K,\r
$$\r
\r
there is a neighborhood of $S_0$ containing none of these finitely many jump points. On this neighborhood,\r
\r
$$\r
L_1,\\ldots,L_K\r
$$\r
\r
are all constant. Therefore the partial sum\r
\r
$$\r
R_K(S)\r
=\r
\\sum_{k=0}^K\\frac1{L_k(S)}\r
$$\r
\r
is constant on that neighborhood.\r
\r
The remaining tail is uniformly bounded by\r
\r
$$\r
\\frac{n^{-K-1}}{1-1/n}.\r
$$\r
\r
Since this bound tends to zero as $K\\to\\infty$, the full function $R$ is continuous at $S_0$.\r
\r
Thus $R$ is continuous at every point outside $J$.\r
\r
### The jumps of $R$\r
\r
Now suppose that\r
\r
$$\r
S_0\\in J_k.\r
$$\r
\r
Since the sets $J_k$ are pairwise disjoint, no other level has a jump at $S_0$. Thus only the $k$-th summand contributes to the jump of $R$.\r
\r
At $S_0$, we have\r
\r
$$\r
L_k(S_0^-)\r
=\r
nL_{k-1}(S_0),\r
$$\r
\r
and\r
\r
$$\r
L_k(S_0^+)\r
=\r
(n+1)L_{k-1}(S_0).\r
$$\r
\r
Therefore\r
\r
$$\r
R(S_0^+)-R(S_0^-)\r
=\r
\\frac1{(n+1)L_{k-1}(S_0)}\r
-\r
\\frac1{nL_{k-1}(S_0)}\r
=\r
-\\frac1{n(n+1)L_{k-1}(S_0)}.\r
$$\r
\r
Thus $R$ has a downward jump at every point of $J$. It remains only to determine the value of $R$ at the jump itself.\r
\r
Since $q_k(S_0)=n$, we have\r
\r
$$\r
C_k(S_0)\r
=\r
\\lfloor q_k(S_0)\\rfloor+1\r
=\r
n+1.\r
$$\r
\r
Thus the value at the jump belongs to the upper branch: $L_k(S_0)=L_k(S_0^+)$. Therefore $R(S_0)=R(S_0^+)$.\r
\r
We have therefore proved the following.\r
\r
**Theorem**  \r
Fix an integer $n>1$ and consider the total rebuild rate\r
\r
$$\r
R(S)\r
=\r
\\sum_{k=0}^{\\infty}\\frac1{L_k(S)}\r
$$\r
\r
on the interval $(n,n+1)$. Let\r
\r
$$\r
J=\r
\\bigcup_{k\\ge2}J_k,\r
$$\r
\r
where\r
\r
$$\r
J_k\r
=\r
\\left\\{\r
S\\in(n,n+1):\r
(S-1)S^{k-1}\r
=\r
n^a(n+1)^{k-a}\r
\\text{ for some }a=2,\\ldots,k\r
\\right\\}.\r
$$\r
\r
Then:\r
\r
1. $J$ is countable and dense in $(n,n+1)$.\r
\r
2. $R$ is continuous at every point of\r
\r
   $$\r
   (n,n+1)\\setminus J.\r
   $$\r
\r
3. Every point $S_0\\in J_k$ is a discontinuity of $R$, with $R(S_0^+)=R(S_0)$ and \r
\r
   $$\r
   R(S_0^-)-R(S_0)\r
   =\r
   \\frac1{n(n+1)L_{k-1}(S_0)}.\r
   $$\r
\r
In particular, the discontinuity set of $R$ in $(n,n+1)$ is exactly $J$.\r
\r
**Proof**  \r
The three claims follow respectively from the density result, the continuity argument, and the jump calculation above.\r
$\\square$\r
`,Mh=`## Hierarchical tree problem\r
\r
Fix $S>1$ and denote\r
\r
$$\r
\\Delta_k=(S-1)S^{k-1}.\r
$$\r
\r
We always denote $n=\\lfloor S\\rfloor$. \r
\r
A **hierarchical tree of height $K\\ge 1$** is a rooted tree in which every node is assigned a level $k\\in\\{0,\\ldots,K\\}$, the root has level $K$, every level-$k$ node with $k\\ge1$ has at least one child, and all its children have level $k-1$. The level-0 nodes are the leaves. \r
\r
Every hierarchical tree has a uniquely determined **advance** function $a$, defined recursively from the leaves upward. For every level-0 node $I$, $a(I)=1$. For every level-$k$ node $I$, $k\\ge1$, with children $I_1,\\ldots,I_m$, define\r
\r
$$\r
a(I)\r
=\r
\\min\\left\\{\r
\\sum_{j=1}^m a(I_j),\\,S^k\r
\\right\\}.\r
$$\r
\r
A hierarchical tree $T$ is called **admissible** if\r
\r
$$\r
a(I)>\\Delta_k\r
$$\r
\r
for every level-$k$ node $I$ with $k\\ge1$. \r
\r
A node $I$ in a hierarchical tree is called admissible if the subtree rooted at $I$ is admissible.\r
\r
For a node $I$ denote\r
\r
$$\r
\\begin{aligned}\r
N(I)&=\\#\\{\\text{nodes in the subtree rooted at } I\\}, \\\\\r
C(I)&=\\#\\{\\text{children of node } I\\}, \\\\\r
L(I)&=\\#\\{\\text{leaves in the subtree rooted at } I\\}. \\\\\r
\\end{aligned}\r
$$\r
\r
Its **rate** is defined as\r
\r
$$\r
R(I)=\\frac{N(I)}{L(I)}.\r
$$\r
\r
Each of these is defined for a tree by applying it to the root node.\r
\r
If $T$ and $T'$ are admissible trees, we say that $T'$ **dominates** $T$ if $R(T')\\ge R(T)$. Strict domination is defined by the corresponding strict inequality.\r
\r
Equivalently, setting $\\Delta N = N(T') - N(T)$ and $\\Delta L = L(T') - L(T)$, $T'$ dominates $T$ if and only if\r
\r
$$\r
\\Delta N - R(T)\\Delta L \\ge 0.\r
$$\r
\r
We say that a tree $T^*$ is **globally dominating** if it is admissible and it dominates every other admissible tree of the same height.\r
\r
### Geodesic trees\r
\r
Define two sequences $(L_k)_{k\\ge0}$ and $(C_k)_{k>0}$ in the following way. Start with $L_0=1$. Once $L_{k-1}$ is defined, define $L_k=C_kL_{k-1}$, where $C_k$ is the smallest integer such that\r
\r
$$\r
C_kL_{k-1} > \\Delta_k.\r
$$\r
\r
Now define the **geodesic tree** $G_K(S)$ as the unique hierarchical tree of height $K$ with $C(I)=C_k$ for every level-$k$ node $I$ with $1\\le k\\le K$.\r
\r
**Lemma (geodesic trees are admissible)**  \r
Every level-$k$ node in $G_K(S)$ satisfies $a(I) = L_k$. Consequently, $G_K(S)$ is admissible.\r
\r
**Proof sketch**  \r
Prove by induction on $k$ that $a(I)=L_k\\le S^k$. \r
$\\blacksquare$\r
\r
The connection between rebuild intervals of an arc length parametrized path and admissible trees is the following.\r
\r
**Proposition**  \r
Let $S > 1$ and $(r_k) = (S^k)$. For any arc-length parametrized path $\\gamma: [0, \\infty) \\to X$ in a metric space $(X, d)$, the upper asymptotic rebuild rate satisfies\r
\r
$$\r
R^+(\\gamma) \\le \\sup_{K \\ge 1, \\, T \\in \\mathcal{T}_K} R(T),\r
$$\r
\r
where $\\mathcal{T}_K$ denotes the set of all admissible hierarchical trees of height $K$.\r
\r
**Proof**  \r
#### Rebuild intervals form hierarchical trees\r
\r
For each level $k \\ge 0$, a level-$k$ rebuild interval is a time interval $I = (t_1, t_2]$ bounded by two consecutive level-$k$ rebuild times $t_1 < t_2$. For $k \\ge 1$, the interval $(t_1, t_2]$ is partitioned by the intermediate level-$(k-1)$ rebuilds occurring at times $t_1 = \\tau_0 < \\tau_1 < \\cdots < \\tau_m = t_2$. The resulting level-$(k-1)$ intervals $J_p = (\\tau_{p-1}, \\tau_p]$ for $p = 1, \\dots, m$ are defined as the children of $I$.\r
\r
Recursively terminating this parent-child relation at level-$0$ intervals associates with any individual level-$k$ rebuild interval $I$ a finite hierarchical tree $T(I)$ rooted at $I$, of height $k$, whose leaves are level-$0$ intervals.\r
\r
#### Admissibility\r
\r
For any rebuild interval $J = (t_1, t_2]$ at level $k \\ge 0$, define its realized advance as the metric distance between its endpoints,\r
\r
$$\r
a'(J) = d(\\gamma(t_1), \\gamma(t_2)).\r
$$\r
\r
We prove by induction on $k$ that $a'(J) \\le a(J)$ and that $J$ satisfies the admissibility condition $a(J) > \\Delta_k$.\r
\r
For the base case $k = 0$, a level-$0$ rebuild triggers when $d(\\gamma(t_1), \\gamma(t_2)) = r_0 = 1$, so $a'(J) = 1 = a(J)$.\r
\r
For the inductive step $k \\ge 1$, suppose $J = (t_1, t_2]$ has child intervals $J_p = (\\tau_{p-1}, \\tau_p]$ for $p = 1, \\dots, m$ at level $k-1$, where $\\tau_0 = t_1$ and $\\tau_m = t_2$. By the triangle inequality in $(X, d)$,\r
\r
$$\r
a'(J) = d(\\gamma(t_1), \\gamma(t_2)) \\le \\sum_{p=1}^m d(\\gamma(\\tau_{p-1}), \\gamma(\\tau_p)) = \\sum_{p=1}^m a'(J_p).\r
$$\r
\r
Furthermore, before time $t_2$, the moving point remains within the level-$k$ ball centered at $\\gamma(t_1)$, so $d(\\gamma(t_1), \\gamma(t)) < r_k = S^k$ for $t\\in(t_1,t_2)$. Taking the limit $t \\to t_2^-$ gives $a'(J) = d(\\gamma(t_1), \\gamma(t_2)) \\le S^k$. Combining these bounds with the inductive hypothesis $a'(J_p) \\le a(J_p)$ yields\r
\r
$$\r
a'(J) \\le \\min\\left\\{\\sum_{p=1}^m a'(J_p), \\, S^k\\right\\} \\le \\min\\left\\{\\sum_{p=1}^m a(J_p), \\, S^k\\right\\} = a(J).\r
$$\r
\r
Finally, the level-$k$ rebuild triggers at $t_2$ precisely because the level-$k$ ball centered at $\\gamma(t_1)$ fails to enclose the updated level-$(k-1)$ ball at $\\gamma(t_2)$, which requires $d(\\gamma(t_1), \\gamma(t_2)) > \\Delta_k$. Consequently, $a(J) \\ge a'(J) > \\Delta_k$, establishing that for any level-$k$ rebuild interval $I$, the associated finite tree $T(I)$ is admissible.\r
\r
#### Counting the rebuild events\r
\r
Fix $t > 0$ and let $\\mathcal{I}(t)$ be the set of all rebuild intervals $I = (t_1, t_2]$ at any level $k \\ge 0$ fully contained in $(0, t]$, meaning $0 \\le t_1 < t_2 \\le t$. An interval in $\\mathcal{I}(t)$ is maximal if its parent interval is not contained in $(0, t]$, or if it has no parent. Let $I_1, \\dots, I_m$ be all maximal intervals in $\\mathcal{I}(t)$, and let $T_1, \\dots, T_m$ be the finite subtrees rooted at these intervals.\r
\r
Every interval $J \\in \\mathcal{I}(t)$ belongs to a unique maximal tree $T_i$, obtained by following its chain of parents upward within $\\mathcal{I}(t)$ until reaching a maximal interval. Thus, the node sets of $T_1, \\dots, T_m$ form a partition of $\\mathcal{I}(t)$. Moreover, because all initial centers coincide at $t = 0$, every non-initial level-$k$ rebuild time $t_{k, i} \\in (0, t]$ has its preceding rebuild time $t_{k, i-1} \\ge 0$. Hence, every non-initial rebuild event in $(0, t]$ is the right endpoint of a unique interval in $\\mathcal{I}(t)$, and each node in a subtree $T_i$ corresponds to exactly one such event. Summing across the partition yields the exact event count\r
\r
$$\r
M(t) = \\sum_{k=0}^\\infty m_k(t) = \\sum_{i=1}^m N(T_i).\r
$$\r
\r
#### Leaf count bound and asymptotic limit\r
\r
The leaves of $T_1, \\dots, T_m$ are level-$0$ intervals in $\\mathcal{I}(t)$. Because $\\gamma$ is arc-length parametrized, each leaf interval $J$ has length $|J|\\ge 1$. Since all leaf intervals across all maximal trees are mutually disjoint sub-intervals of $(0, t]$, their total length satisfies\r
\r
$$\r
t \\ge \\sum_{i=1}^m \\sum_{J \\in \\text{Leaves}(T_i)}|J| \\ge \\sum_{i=1}^m L(T_i).\r
$$\r
\r
Combining the event count and the time bound for any $t$ after the first level-$0$ rebuild gives\r
\r
$$\r
\\frac{M(t)}{t} \\le \\frac{\\sum_{i=1}^m N(T_i)}{\\sum_{i=1}^m L(T_i)} \\le \\max_{1 \\le i \\le m} \\frac{N(T_i)}{L(T_i)} \\le \\sup_{K \\ge 1, \\, T \\in \\mathcal{T}_K} R(T),\r
$$\r
\r
Taking the upper limit as $t \\to \\infty$ completes the proof. $\\blacksquare$\r
\r
This motivates us to study upper bounds for the rate of admissible trees. One immediate question is: Are geodesic trees $G_K(S)$ always globally dominating?\r
\r
We will later show that geodesic trees are globally dominating for all integer $S$, and also for all $K\\le 3$.\r
\r
However, the answer turns out to be generally no, as shown by an example given later. \r
\r
### Basic properties\r
\r
**Lemma (node replacement)**\r
Let $T$ be an admissible tree with a level-$k$ node $I$, and let $I'$ be another admissible level-$k$ node with $a(I') \\ge a(I)$. Then the tree $T'$ obtained by replacing the subtree rooted at $I$ with the subtree rooted at $I'$ is admissible.\r
\r
**Proof sketch**  \r
The recursive definition $a(J) = \\min\\left\\{\\sum a(J_j), S^m\\right\\}$ is composed of addition and the minimum operator, both of which are non-decreasing in every argument. Increasing the advance of a child node from $a(I)$ to $a(I')$ can therefore only increase or preserve the advance values of its ancestors, ensuring $a'(J) \\ge a(J) > \\Delta_m$ for all nodes $J$ outside the replaced subtree. $\\blacksquare$\r
\r
Reminder that we always write $n=\\lfloor S\\rfloor$.\r
\r
**Lemma**  \r
For every node $I$ at level $k$ in a hierarchical tree:\r
\r
i) $a(I)\\le L(I)$ for every $k\\ge 0$.  \r
ii) If $I$ is admissible, then $C(I) \\ge n$ for $k \\ge 1$.  \r
iii) If $I$ is admissible, then $a(I)\\ge n^k$ for every $k\\ge 0$.  \r
\r
**Proof sketch**  \r
Each claim can be proved by induction on $k$. $\\blacksquare$\r
\r
**Proof**  \r
We prove each claim by induction on $k$.\r
\r
**i)** For $k=0$, $a(I) = 1$. For $k \\ge 1$, assume the claim holds for each level $k-1$ node. Then\r
\r
$$\r
a(I)=\r
\\min\\left\\{ \\sum_{j=1}^p a(I_j),\\, S^k \\right\\}\r
\\le\r
\\sum_{j=1}^p L(I_j)\r
=L(I).\r
$$\r
\r
**ii)** Let $I$ be an admissible level-$k$ node ($k \\ge 1$) with $p = C(I)$ children $I_1, \\dots, I_p$. Since $I$ is admissible, each child $I_j$ is an admissible level-$(k-1)$ node. Admissibility of $I$ requires $a(I) > \\Delta_k = (S-1)S^{k-1}$. Since $a(I) \\le \\sum_{j=1}^p a(I_j) \\le p S^{k-1}$, we must have:\r
\r
$$\r
p S^{k-1} > (S-1)S^{k-1}.\r
$$\r
\r
Hence $p>S-1$. The strict inequality on the integer $p$ forces $p \\ge n$.\r
\r
**iii)** We proceed by induction on $k$. The base case for $k=0$ is true since $a(I)=1$ for leaves. \r
Assume that $a(I_j) \\ge n^{k-1}$ for each child $j$. Then\r
\r
$$\r
a(I) = \\min\\left\\{ \\sum_{j=1}^p a(I_j),\\, S^k \\right\\}.\r
$$\r
\r
\r
The first term satisfies $\\sum_{j=1}^p a(I_j) \\ge C(I)\\, n^{k-1} \\ge n^k$.\r
The second term satisfies $S^k\\ge n^k$ since $S\\ge n$.\r
Since both terms are at least $n^k$, we obtain $a(I) \\ge n^k$. $\\blacksquare$\r
\r
\r
When $S = n \\in \\mathbb{Z}_{\\ge 2}$, the geodesic sequence yields $C_k = n$ for all $k \\ge 1$, so $G_K(n)$ is the regular $n$-ary tree of height $K$.\r
\r
**Lemma**  \r
For every $k\\ge 1$, \r
\r
$$\r
C_k\\in\\{n,n+1\\}.\r
$$\r
\r
**Proof**  \r
We already know that $C_k \\ge n$ since any admissible level-$k$ node has at least $n$ children. \r
\r
For the upper bound when $k=1$, we have $(n+1)L_0 = n+1 > S-1 = \\Delta_1$. Since $C_1$ is the smallest integer with $C_1 L_0 > \\Delta_1$, we get $C_1 = n$.\r
\r
For $k \\ge 2$, the node $G_{k-1}$ is admissible, so $L_{k-1} > \\Delta_{k-1}$. Combining this with $n+1 > S$ yields\r
\r
$$\r
(n+1)L_{k-1} > S\\Delta_{k-1} = S(S-1)S^{k-2} = \\Delta_k.\r
$$\r
\r
By minimality of $C_k$, we conclude $C_k \\le n+1$. $\\blacksquare$\r
\r
\r
**Proposition (conjecture is true for integer $S$)**  \r
If $S = n \\in \\Z_{\\ge 2}$, then $G_K(n)$ is globally dominating.\r
\r
\r
**Proof**  \r
Let $T$ be an admissible tree of height $K$. We will prove by induction on level $k \\in \\{0, \\dots, K\\}$ that every admissible level-$k$ node $I$ in $T$ satisfies\r
\r
$$\r
R(I) \\le R\\bigl(G_k(n)\\bigr).\r
$$\r
\r
If $k=0$, then $I$ is a leaf, so $R(I) = 1 = R(G_0(n))$.\r
\r
Assume the claims hold for all admissible level-$(k-1)$ nodes. Let $I$ be an admissible level-$k$ node with children $I_1, \\dots, I_p$. By the previous lemma, admissibility implies $p = C(I) \\ge n$. Furthermore, each $I_j$ is an admissible level-$(k-1)$ node, so by the induction hypothesis:\r
\r
\r
$$\r
\\quad R(I_j) \\le R\\bigl(G_{k-1}(n)\\bigr) \\quad \\text{for all } j \\in \\{1, \\dots, p\\}.\r
$$\r
\r
We get\r
\r
$$\r
\\begin{aligned}\r
N(I) &= 1 + \\sum_{j=1}^p N(I_j) = 1 + \\sum_{j=1}^p R(I_j) L(I_j) \\\\\r
&\\le 1 + R\\bigl(G_{k-1}(n)\\bigr) \\sum_{j=1}^p L(I_j) = 1 + R\\bigl(G_{k-1}(n)\\bigr) L(I).\r
\\end{aligned}\r
$$\r
\r
Dividing both sides by $L(I) > 0$ yields\r
\r
$$\r
R(I) = \\frac{N(I)}{L(I)} \\le \\frac{1}{L(I)} + R\\bigl(G_{k-1}(n)\\bigr).\r
$$\r
\r
By the basic properties lemma, an admissible level-$k$ node satisfies $L(I) \\ge a(I) \\ge n^k$, which yields\r
\r
$$\r
R(I) \\le n^{-k} + R\\bigl(G_{k-1}(n)\\bigr).\r
$$\r
\r
For the regular $n$-ary tree $G_k(n)$, each internal node has $n$ identical children. It follows that $L(G_k(n))=n^k$ and each child of the root is $G_{k-1}(n)$. Expanding at the root node we get\r
\r
$$\r
R(G_k(n)) = \r
\\frac{N(G_k(n))}{L(G_k(n))}\r
=\r
\\frac{1 + n N(G_{k-1}(n))}{nL(G_{k-1}(n))} = n^{-k} + R(G_{k-1}(n)).\r
$$\r
\r
Combining this with our previous inequality we get $R(I) \\le R(G_k(n))$.\r
\r
By induction, the root of $T$ satisfies $R(T) \\le R(G_K(n))$. $\\blacksquare$\r
\r
For this reason we assume for the rest of the discussion that $S$ is not an integer, i.e. $n<S<n+1$.\r
\r
\r
### Existence of globally dominating trees\r
\r
**Lemma (admissibility threshold)**  \r
If a hierarchical tree node $I$ has at least $n+1$ admissible children, then $I$ is admissible.\r
\r
**Proof**  \r
Denote the children by $I_1,\\ldots,I_m$, $m\\ge n+1$. Since $n+1 > S$, we have \r
\r
$$\r
\\sum_{j=1}^m a(I_j) > (n+1)\\Delta_{k-1} = (n+1)(S-1)S^{k-2} > \\Delta_k.\r
$$\r
\r
Thus $I$ is admissible. $\\blacksquare$\r
\r
**Lemma (node splitting)**  \r
Let $T$ be an admissible tree of height $K$. If an internal node $I$ at level $k < K$ has $C(I) \\ge 2n + 2$ children, there exists an admissible tree $T'$ of height $K$ that strictly dominates $T$, obtained by replacing $I$ under its parent $P$ with two level-$k$ nodes $I_1$ and $I_2$.\r
\r
**Proof**  \r
Partition the children of $I$ under two new level-$k$ nodes $I_1$ and $I_2$, each receiving at least $n+1$ children. By the admissibility threshold lemma, $I_1$ and $I_2$ are admissible.\r
\r
Let $A_1$ and $A_2$ be the sums of advances of the children assigned to $I_1$ and $I_2$, respectively. Before replacement, $I$ supplied advance $a(I) = \\min\\{S^k, A_1+A_2\\}$. After replacement, the pair supplies\r
\r
$$\r
a(I_1) + a(I_2) = \\min\\{S^k, A_1\\} + \\min\\{S^k, A_2\\} \\ge \\min\\{S^k, A_1+A_2\\} = a(I).\r
$$\r
\r
Replacing $I$ with $I_1$ and $I_2$ under $P$ creates a modified parent node $P'$ whose advance satisfies $a(P') \\ge a(P)$. Applying node replacement to $P$ guarantees that the resulting tree $T'$ is admissible. Finally, $L(T') = L(T)$ and $N(T') = N(T) + 1$, so $R(T') > R(T)$. $\\blacksquare$\r
\r
**Lemma (uniformly bounded branching)**  \r
For every admissible tree $T$ of height $K$, there exists an admissible tree $T'$ of height $K$ that dominates $T$ and satisfies $C(I) \\le 2n + 1$ for all internal nodes $I$.\r
\r
**Proof**  \r
Apply the node splitting lemma bottom-up for levels $k=1$ to $K-1$. Each split strictly increases $N$ while keeping $L$ constant, producing a dominating admissible tree $T_1$ with $C(I) \\le 2n+1$ for all non-root internal nodes.\r
\r
Next we handle the root. If $C(T_1) \\ge n + 2$, the rate $R(T_1)$ satisfies\r
\r
$$\r
R(T_1) = \\frac{1}{L(T_1)} + \\sum_{J\\prec T_1} \\frac{L(J)}{L(T_1)} R(J).\r
$$\r
\r
Because $R(T_1)$ strictly exceeds the weighted average of its children's rates, there exists a child $J$ with $R(J) < R(T_1)$. Removing $J$ produces a tree $T_2$ whose root retains at least $n+1$ children (hence remaining admissible) and has rate\r
\r
$$\r
R(T_2) = \\frac{N(T_1)-N(J)}{L(T_1)-L(J)} > R(T_1).\r
$$\r
\r
Repeating this removal process until the root has at most $n+1$ children yields a tree $T'$ with $C(I) \\le 2n+1$ at all levels that dominates $T$. $\\blacksquare$\r
\r
**Theorem (globally dominating trees exist)**  \r
For every $K \\ge 1$, there exists a globally dominating admissible tree of height $K$.\r
\r
**Proof**  \r
By previous lemma, every admissible tree is dominated by one in which every node has at most $2n+1$ children. Since height and branching are uniformly bounded, the set of such tree topologies is finite. Thus, the set of achievable rates $R(T)$ among these bounded trees is non-empty and finite, so it contains a maximum $R(T^*)$. Now $T^*$ dominates every admissible tree of height $K$. $\\blacksquare$\r
\r
#### Geodesic lift\r
\r
Let $I$ be an admissible node of level $k$. We define the **geodesic lift** of $I$ to be the tree obtained by starting with $I$ and repeatedly copying the current tree the smallest number of times needed to form an admissible node at the next level.\r
\r
More precisely, set $I^{(0)}=I$. Given $I^{(j-1)}$, let\r
\r
$$\r
m_j = \\left\\lfloor \\frac{\\Delta_{k+j}}{a(I^{(j-1)})} \\right\\rfloor + 1.\r
$$\r
\r
Thus $m_j$ is the smallest positive integer such that $m_j a(I^{(j-1)}) > \\Delta_{k+j}$. Making $m_j$ copies of $I^{(j-1)}$ the children of a new node $I^{(j)}$ yields total advance $m_j a(I^{(j-1)}) \\le \\Delta_{k+j} + a(I^{(j-1)}) \\le S^{k+j}$. Hence the advance cap at level $k+j$ is inactive, so $a(I^{(j)}) = m_j a(I^{(j-1)})$.\r
\r
We may continue up to level $K$, producing the geodesic lift $I^{\\langle K\\rangle}$ of $I$ to height $K$. The node and leaf counts satisfy $N(I^{(j)}) = 1 + m_j N(I^{(j-1)})$ and $L(I^{(j)}) = m_j L(I^{(j-1)})$, which yields\r
\r
$$\r
R(I^{(j)}) = R(I^{(j-1)}) + \\frac{1}{m_j L(I^{(j-1)})}.\r
$$\r
\r
Unrolling this recurrence gives\r
\r
$$\r
R(I^{\\langle K\\rangle}) = R(I) + \\frac{1}{L(I)} \\sum_{j=1}^{K-k} \\frac{1}{m_1 \\cdots m_j}.\r
$$\r
\r
In particular, the geodesic lift strictly increases rate: $R(I^{\\langle K\\rangle}) > R(I)$.\r
\r
The geodesic tree $G_K(S)$ is the geodesic lift of a leaf. More generally, the geodesic lift of any of its nodes is the tree itself.\r
\r
**Lemma**  \r
Suppose $T$ is a globally dominating tree of height $K$, and let $I$ be one of its non-root nodes. Then $R(I) < R(T)$. In particular, the tree $T'$ obtained by removing $I$ from $T$ cannot be admissible.\r
\r
**Proof**  \r
The geodesic lift $I^{\\langle K\\rangle}$ is an admissible tree of height $K$. Since $T$ is globally dominating, $R(I^{\\langle K\\rangle}) \\le R(T)$, which gives $R(I) < R(I^{\\langle K\\rangle}) \\le R(T)$.\r
\r
If $T'$ is formed by removing the subtree rooted at $I$ from $T$, its rate satisfies\r
\r
$$\r
R(T') = \\frac{N(T) - N(I)}{L(T) - L(I)} > \\frac{N(T) - R(T)L(I)}{L(T) - L(I)} = R(T).\r
$$\r
\r
If $T'$ were admissible, $R(T') > R(T)$ would contradict the global dominance of $T$. $\\blacksquare$\r
\r
### Investigating low level nodes\r
\r
**Proposition (upper bound for $R$)**  \r
Suppose that every level-$k$ admissible node $I$ satisfies\r
\r
$$\r
R(I)\\le r_k.\r
$$\r
\r
Then every admissible tree $T$ of height $K>k$ satisfies\r
\r
$$\r
R(T)\r
\\le \r
r_k+\r
\\sum_{j=k+1}^K \\frac1{u_j},\r
$$\r
\r
where\r
\r
$$\r
u_j = \\max\\bigl\\{\\lfloor\\Delta_j\\rfloor+1, n^j\\bigr\\}.\r
$$\r
\r
In particular, \r
\r
$$\r
\\begin{aligned}\r
R(T)\r
&\\le r_k + \r
\\frac{S(S^{-k}-S^{-K})}{(S-1)^2}\\qquad\\text{and} \\\\\r
R(T)\r
&\\le r_k + \r
\\frac{n^{-k}-n^{-K}}{n-1},\\qquad (n>1).\r
\\end{aligned}\r
$$\r
\r
**Proof**  \r
Let $M_j$ denote the number of level-$j$ nodes in $T$, and let $M_{>k} = \\sum_{j=k+1}^K M_j$ be the number of nodes strictly above level $k$. Since the level-$k$ subtrees partition all nodes at or below level $k$, we can split the total node count as $N(T) = M_{>k} + \\sum_{\\operatorname{level}(I)=k} N(I)$. Dividing by $L(T)$ yields\r
\r
$$\r
R(T) = \\frac{M_{>k}}{L(T)} + \\sum_{\\operatorname{level}(I)=k} \\frac{L(I)}{L(T)} R(I).\r
$$\r
\r
Applying the bound $R(I) \\le r_k$ to each level-$k$ subtree gives $R(T) \\le r_k + \\frac{M_{>k}}{L(T)}$.\r
\r
For every level-$j$ node $I$ with $j > k$, admissibility requires $a(I)>\\Delta_j$. Since $L(I) \\ge a(I)$ and $L(I)$ is an integer, we have $L(I) \\ge \\lfloor \\Delta_j \\rfloor + 1$. Disjointness of the level-$j$ subtrees then implies\r
\r
$$\r
M_j \\le \\frac{L(T)}{\\lfloor\\Delta_j \\rfloor + 1}.\r
$$\r
\r
Alternatively, since every internal node has at least $n$ children, $M_{j-1} \\ge n M_j$. With $M_0 = L(T)$, this gives $M_j \\le n^{-j} L(T)$.\r
\r
Together the bounds give $M_j \\le L(T)/u_j$, so $M_{>k}/L(T)\\le \\sum_{j=k+1}^K 1/u_j$.\r
\r
Finally, using the bounds $u_j > \\Delta_j$ and $u_j\\ge n^{j}$, summing over $j = k+1, \\ldots, K$ as finite geometric series yields the explicit bounds. $\\blacksquare$\r
\r
The previous proposition is interesting since it can benefit from information from small $k$. Once a bound is known for level $k$, then we get a new bound for every tree higher than $k$. One immediate consequence of the proposition is that \r
\r
$$\r
R(T)<\\frac{n}{n-1}\r
$$\r
\r
whenever $n>1$ as we can see by applying it with $r_0=1$.\r
\r
#### Level-$1$\r
\r
We say that a level-$k$ node $I$ is saturated if $a(I)=S^k$. \r
\r
**Theorem (level-$1$ solve)**  \r
Let $I$ be a level-$1$ node in a globally dominating tree. Then\r
\r
$$\r
C(I)=n.\r
$$\r
\r
**Proof**  \r
If the tree has height $K=1$, the root $I$ satisfies $R(I) = \\bigl(1+C(I)\\bigr)/C(I) = 1 + 1/C(I)$. Admissibility requires $a(I) = \\min\\{C(I), S\\} > S-1$, which holds for any integer $C(I) \\ge n$. Maximizing $1 + 1/C(I)$ over $C(I) \\ge n$ forces $C(I) = n$.\r
\r
For the remainder of the proof, assume $K \\ge 2$, so $I$ is a non-root node. We already know $C(I) \\ge n$.\r
\r
Since leaves have advance $1$, a level-$1$ node with $C(I) \\ge n+1$ children has advance $a(I) = \\min\\{C(I), S\\} = S$. If $C(I) > n+1$, removing one leaf leaves $C(I)-1 \\ge n+1$ children, keeping $a(I) = S$ unchanged. This preserves admissibility throughout the tree, which contradicts the lemma that removing a non-root node from a globally dominating tree yields an inadmissible tree. Thus $C(I) \\le n+1$.\r
\r
Suppose $C(I) = n+1$. Replace $I$ under its parent $P$ with two level-$1$ nodes $I_1$ and $I_2$, each having $n$ children. Their advances are $a(I_1) = a(I_2) = \\min\\{n, S\\} = n$. Since $n = \\lfloor S \\rfloor \\ge 1$, we have $2n > S$, so the combined advance supplied to $P$ increases from $S$ to $2n$. By monotonicity of the advance function, $T'$ remains admissible.\r
\r
The replacement changes the total node and leaf counts by\r
\r
$$\r
\\Delta N = 2(n+1) - (n+2) = n, \\qquad \\Delta L = 2n - (n+1) = n-1.\r
$$\r
\r
We evaluate the domination condition $\\Delta N - R(T)\\Delta L = n - R(T)(n-1)$:\r
* If $n=1$, $\\Delta L = 0$ and $\\Delta N = 1 > 0$.\r
* If $n > 1$, applying the rate upper bound proposition with $r_0=1$ yields $R(T) < \\frac{n}{n-1}$, so $R(T)(n-1) < n$.\r
\r
In both cases, $\\Delta N - R(T)\\Delta L > 0$, meaning $T'$ strictly dominates $T$. This contradicts the global dominance of $T$, proving $C(I) = n$. $\\blacksquare$\r
\r
#### Level-$2$\r
\r
Next we examine level-$2$ nodes. We already have name for the geodesic tree $G_2=[C_2\\times G_1]$. Let us denote\r
\r
$$\r
\\begin{aligned}\r
F_2&=[(C_2+1)\\times G_1]. \\\\\r
\\end{aligned}\r
$$ \r
\r
**Lemma**  \r
Suppose that $T$ is globally dominating tree of height $K$.  \r
i) If $K=1$, then $T=G_1$.  \r
ii) If $K=2$, then $T=G_2$. \r
\r
**Proof**  \r
**i)** The case $K=1$ follows from the level-$1$ solve. \r
\r
**ii)** Level-$1$ solve imples that every globally dominating tree of height $2$ has the form $[m\\times G_1]$ for some $m\\ge C_2$. Also,\r
\r
$$\r
R\\bigl([m\\times G_1]\\bigr)=\\frac{1+m+mn}{mn}=\\frac{1}{mn}+\\frac1n+1\r
$$\r
\r
is strictly decreasing as a function of $m$. Therefore $G_2=[C_2\\times G_1]$ is the unique maximizer of the rate among all admissible trees of height $2$.\r
$\\blacksquare$\r
\r
**Lemma (level-$2$ dichotomy)**  \r
Suppose $I$ is a level-$2$ node in a globally dominating tree $T$.\r
\r
i) Either $I=G_2$ or $I=F_2$. In other words, $C(I) \\in \\{C_2, C_2+1\\}$.  \r
ii) If $C_2=n$, then $C(I)=n$ and $I=G_2$.\r
\r
**Proof**  \r
If the tree height is $2$, then $C(I)=C_2$ by the previous lemma. Assume from now on that the tree height is at least $3$, and denote the parent of $I$ by $P$.\r
\r
**i)** Define the level-$2$ node $H=[(n+1)\\times G_1]$. It is admissible, with leaf and node counts given by\r
\r
$$\r
L(H)=(n+1)n \\quad \\text{and} \\quad N(H)=n^2+2n+2.\r
$$\r
\r
Suppose that $C(I)\\ge C_2+2$. We modify $T$ by removing two level-$1$ children from $I$ and adding one level-$2$ node $H$ as a child to $P$.\r
\r
Node $I$ retains at least $C_2$ children, so it remains admissible. Consider the advance at $P$. The removal reduces the sum of its children's advances by at most $2S$, while adding $H$ increases this sum by\r
\r
$$\r
a(H) = \\min\\{(n+1)n,\\, S^2\\} > 2S.\r
$$\r
\r
This implies that $a(P)$ does not decrease. Applying node replacement guarantees that the modified tree $T'$ is admissible.\r
\r
The replacement yields count changes of\r
\r
$$\r
\\Delta L = L(H) - 2n = n^2 - n\r
$$\r
\r
and\r
\r
$$\r
\\Delta N = N(H) - 2(1+n) = n^2.\r
$$\r
\r
Evaluating the domination condition gives\r
\r
$$\r
\\Delta N - R(T)\\Delta L = n^2 - R(T)n(n-1).\r
$$\r
\r
If $n=1$, this is strictly positive. If $n>1$, the upper bound proposition gives $R(T) < n/(n-1)$, which again implies $\\Delta N - R(T)\\Delta L > 0$. The modified tree strictly dominates $T$, contradicting global dominance.\r
\r
**ii)** Suppose $C_2=n$. By part i), $C(I) \\le n+1$, so assume $C(I)=n+1$. We remove one level-$1$ child from $I$ and add one $G_2=[n\\times G_1]$ to $P$.\r
\r
Node $I$ retains $n$ children and remains admissible. The sum of children's advances under $P$ decreases by at most $S$ from the removed child, while adding $G_2$ increases this sum by $a(G_2) = n^2 \\ge S$. This implies that $a(P)$ does not decrease, preserving tree admissibility.\r
\r
The count changes are identical to part i):\r
\r
$$\r
\\Delta L = n^2 - n \\quad \\text{and} \\quad \\Delta N = n^2.\r
$$\r
\r
The same argument yields $\\Delta N - R(T)\\Delta L > 0$, contradicting the global dominance of $T$. $\\blacksquare$\r
\r
Note that the counter-example mentioned below uses the node $F_2$.\r
\r
#### Level-$3$\r
\r
Let us now consider level-$3$ nodes in a globally dominating tree.\r
\r
**Lemma**  \r
In a globally dominating tree, any level-$3$ node $I$ with children $I_1,\\ldots,I_m$ satisfies\r
\r
$$\r
\\#\\{j : I_j = F_2\\} \\le 1.\r
$$\r
\r
In other words, every level-$2$ child of a level-$3$ node is of type $G_2$, except possibly at most one of type $F_2$.\r
\r
**Proof**  \r
By the level-$2$ dichotomy, $I_j = F_2$ can only occur if $C_2 = n+1$. We may therefore assume $C_2 = n+1$.\r
\r
Suppose, for contradiction, that $I$ has at least two $F_2$ children. We modify $I$ by replacing two $F_2$ children with three $G_2$ children, i.e., $2\\times F_2 \\leadsto 3\\times G_2$.\r
\r
The sum of advances of the children of $I$ changes by\r
\r
$$\r
3a(G_2) - 2a(F_2) = 3(n+1)n - 2\\min\\{(n+2)n, S^2\\} \\ge 3(n+1)n - 2(n+2)n = n^2 - n \\ge 0.\r
$$\r
\r
This implies that $a(I)$ does not decrease. Applying node replacement guarantees that the resulting tree $T'$ is admissible.\r
\r
Next, we evaluate the changes in leaf and node counts:\r
\r
$$\r
\\Delta L = 3L(G_2) - 2L(F_2) = 3(n+1)n - 2(n+2)n = n^2 - n,\r
$$\r
\r
$$\r
\\Delta N = 3N(G_2) - 2N(F_2) = 3(n^2+2n+2) - 2(n^2+3n+3) = n^2.\r
$$\r
\r
Evaluating the domination condition yields\r
\r
$$\r
\\Delta N - R(T)\\Delta L = n^2 - R(T)n(n-1).\r
$$\r
\r
If $n=1$, this expression equals $1 > 0$. If $n>1$, the rate upper bound proposition (with $r_0=1$) gives $R(T) < n/(n-1)$, which implies $R(T)n(n-1) < n^2$ and thus $\\Delta N - R(T)\\Delta L > 0$. The modified tree $T'$ strictly dominates $T$, contradicting global dominance. $\\blacksquare$\r
\r
**Proposition**  \r
If $T$ is a globally dominating tree of height $3$, then $T=G_3$.\r
\r
**Proof**  \r
Suppose $T$ is globally dominating. Let $m=C(T)$. By the level-$3$ child lemma, $T$ has at most one $F_2$ child, so\r
\r
$$\r
T=[m\\times G_2] \\quad \\text{or} \\quad T=[(m-1)\\times G_2,\\, F_2].\r
$$\r
\r
In the first case, $T=[m\\times G_2]$, the rate evaluates to\r
\r
$$\r
R(T) = \\frac{1+m+mC_2+mC_2n}{mC_2n} = \\frac{1}{mC_2n} + \\frac{1}{C_2n} + \\frac{1}{n} + 1.\r
$$\r
\r
This expression is strictly decreasing in $m$, so $R(T)$ is maximized at the smallest admissible choice of $m$, which is $m=C_3$ by definition of the geodesic tree $G_3$.\r
\r
Now consider the second case, $T=[(m-1)\\times G_2,\\, F_2]$. This tree can be globally dominating only if $C_2 = n+1$, so we assume $C_2 = n+1$.\r
\r
The total leaf and node counts are given by\r
\r
$$\r
L(T) = (m-1)L(G_2) + L(F_2) = (m-1)(n+1)n + (n+2)n = m(n+1)n + n,\r
$$\r
\r
and\r
\r
$$\r
\\begin{aligned}\r
N(T) &= 1 + (m-1)N(G_2) + N(F_2) \\\\\r
&= 1 + (m-1)(n^2+2n+2) + (n^2+3n+3) \\\\\r
&= m(n^2+2n+2) + n + 2.\r
\\end{aligned}\r
$$\r
\r
Expanding $R(T)$ yields\r
\r
$$\r
\\begin{aligned}\r
R(T) &= \\frac{m(n^2+2n+2)+n+2}{m(n+1)n+n} \\\\\r
&= 1 + \\frac{1}{n} \\cdot \\frac{m(n+2)+2}{m(n+1)+1} \\\\\r
&= 1 + \\frac{1}{n} + \\frac{1}{n(n+1)} + \\frac{1}{(n+1)\\bigl(m(n+1)+1\\bigr)}.\r
\\end{aligned}\r
$$\r
\r
Since $C_2 = n+1$, the geodesic tree rate at height $3$ is\r
\r
$$\r
R(G_3) = \\frac{1}{C_3(n+1)n} + \\frac{1}{(n+1)n} + \\frac{1}{n} + 1.\r
$$\r
\r
Comparing the two rates gives\r
\r
$$\r
n(n+1)\\bigl(R(T)-R(G_3)\\bigr) = \\frac{n}{m(n+1)+1} - \\frac{1}{C_3} \\le \\frac{n}{m(n+1)+1} - \\frac{1}{n+1} = \\frac{(n+1)(n-m)-1}{(n+1)\\bigl(m(n+1)+1\\bigr)}.\r
$$\r
\r
If $m \\ge n$ or $n=1$, the numerator $(n+1)(n-m)-1$ is negative, forcing $R(T) < R(G_3)$. Since $T$ is globally dominating, we must have $m \\le n-1$ and $n \\ge 2$.\r
\r
To show that $m \\le n-1$ and $n \\ge 2$ lead to a contradiction, we bound the advance $a(T)$. Using $a(G_2)=(n+1)n$ and $a(F_2) \\le (n+2)n$, we obtain\r
\r
$$\r
a(T) \\le (m-1)(n+1)n + (n+2)n = \\bigl(m(n+1)+1\\bigr)n.\r
$$\r
\r
Because $m \\le n-1$, the factor $m(n+1)+1 \\le (n-1)(n+1)+1 = n^2$, which gives $a(T) \\le n^3$.\r
\r
Finally, $C_2 = n+1$ implies that $n$ copies of $G_1$ fail to satisfy level-$2$ admissibility, meaning $n^2 \\le \\Delta_2 = (S-1)S$. Multiplying by $S > n$ yields\r
\r
$$\r
n^3 < n^2 S \\le (S-1)S^2 = \\Delta_3.\r
$$\r
\r
Thus $a(T) \\le n^3 < \\Delta_3$, which contradicts the admissibility of $T$. $\\blacksquare$\r
\r
We utilize the established results to derive an upper bound for the rates.\r
\r
**Proposition**  \r
Let $T$ be an admissible tree of height $K\\ge 4$. Then\r
\r
$$\r
R(T)\\le R\\bigl(G_3(S)\\bigr) + \\sum_{j=4}^K \\frac{1}{u_j},\r
$$\r
\r
where\r
\r
$$\r
u_j = \\max\\left\\{ n\\left\\lfloor \\frac{\\Delta_j}{n}+1 \\right\\rfloor, \\; \\ell_3^\\text{min} \\, n^{j-3} \\right\\},\r
$$\r
\r
and $\\ell_3^\\text{min}$ is a lower bound for leaf count of a level-3 node in a globally dominating tree, given by \r
\r
$$\r
\\begin{aligned}\r
\\ell_3^\\text{min}&=\\min\\left\\{ L(G_3), \\, \\bigl(m_3^\\text{min}(n+1)+1\\bigr)n \\right\\}, \\\\\r
m_3^\\text{min}&=\\biggl\\lfloor\\frac{\\Delta_3-a(F_2)}{L(G_2)}\\biggr\\rfloor+2. \\\\\r
\\end{aligned}\r
$$\r
\r
**Proof**  \r
Without loss of generality we can assume that $T$ is globally dominating.\r
\r
Partitioning the node count of $T$ at level 3 yields\r
\r
$$\r
R(T) = \\frac{M_{>3}}{L(T)} + \\sum_{\\text{level}(I)=3} \\frac{L(I)}{L(T)} R(I),\r
$$\r
\r
where $M_{>3} = \\sum_{j=4}^K M_j$ is the total count of nodes strictly above level 3, and $M_j$ denotes the number of level-$j$ nodes in $T$.\r
\r
Since $G_3$ is the unique rate maximizer among all admissible height-3 trees, every level-3 subtree $I$ in $T$ satisfies $R(I) \\le R(G_3)$. The second term is a convex combination of level-3 rates, bounded above by $R(G_3)$.\r
\r
To bound $M_{>3} / L(T)$, we establish two independent lower bounds on the leaf count $L(I)$ of any level-$j$ node $I$ in $T$ for $j \\ge 4$.\r
\r
First, by the level-1 solve theorem, every level-1 node in a globally dominating tree has $n$ children, forcing $L(I)$ to be an integer multiple of $n$. Admissibility requires $L(I) \\ge a(I) > \\Delta_j$. The smallest integer multiple of $n$ strictly exceeding $\\Delta_j$ is $n \\lfloor \\frac{\\Delta_j}{n}+1 \\rfloor$, giving the lower bound $L(I) \\ge n \\lfloor \\frac{\\Delta_j}{n}+1 \\rfloor$.\r
\r
Now suppose that $J$ is a level-$3$ node in $T$. By the level-3 child lemma it consists of level-2 children of type $G_2$, with at most one child of type $F_2$. If all children are of type $G_2$, admissibility forces at least $C_3$ children, so $L(J) \\ge L(G_3)$. If one child is of type $F_2$, then $J=[(m-1)\\times G_2,F_2]$ for some $m\\ge n$, and admissibility requires\r
\r
$$\r
(m-1)L(G_2) + a(F_2) > \\Delta_3.\r
$$\r
\r
The minimum $m$ satisfying this is $m_3^\\text{min}$. Now\r
\r
$$\r
L(J)\\ge (m_3^\\text{min}-1)L(G_2) + L(F_2) = \\bigl(m_3^\\text{min}(n+1)+1\\bigr)n.\r
$$\r
\r
Taking the minimum across both cases gives $L(J) \\ge \\ell_3^\\text{min}$ for every level-3 node in $T$. Since every internal node has at least $n$ children, a level-$j$ node $I$ with $j \\ge 4$ contains at least $n^{j-3}$ disjoint level-3 subtrees, yielding $L(I) \\ge \\ell_3^\\text{min} \\, n^{j-3}$.\r
\r
Combining both lower bounds gives $L(I) \\ge u_j$, which implies $M_j \\le L(T)/u_j$ for each $j \\in \\{4, \\dots, K\\}$. Summing over $j$ yields\r
\r
$$\r
\\frac{M_{>3}}{L(T)} = \\sum_{j=4}^K \\frac{M_j}{L(T)} \\le \\sum_{j=4}^K\\frac{1}{u_j}.\r
$$\r
\r
Substituting these inequalities into the decomposition of $R(T)$ yields $R(T) \\le R(G_3) + \\sum_{j=4}^K 1/u_j$. \r
$\\blacksquare$\r
\r
#### Example: geodesic trees are not always globally dominating\r
\r
Let $S = 147/40 = 3.675$ (so that $n=3$) and $K = 5$. The admissibility thresholds $\\Delta_k = (S-1)S^{k-1}$ are:\r
\r
$$\r
\\Delta_1 = 2.675, \\quad \\Delta_2\\approx 9.831, \\quad \\Delta_3 \\approx 36.128, \\quad \\Delta_4 \\approx 132.769, \\quad \\Delta_5 \\approx 487.925.\r
$$\r
\r
The geodesic branching sequence is \r
\r
$$\r
(C_1, C_2, C_3, C_4, C_5) = (3, 4, 4, 3, 4),\r
$$\r
\r
yielding geodesic leaf count $L(G_5) = 576$, node count $N(G_5) = 833$, and rate\r
\r
$$\r
R\\bigl(G_5(S)\\bigr) = \\frac{833}{576} \\approx 1.446181.\r
$$\r
\r
Now define the non-geodesic tree $T$ recursively by\r
\r
$$\r
F_2 = [5 \\times G_1], \\quad F_3 = [2 \\times G_2,\\, F_2], \\quad F_4 = [2 \\times G_3,\\, F_3], \\quad T = [4 \\times F_4].\r
$$\r
\r
The advance, leaf count, and node count for each component evaluate as follows:\r
\r
$$\r
\\begin{array}{|c|c|c|c|c|c|}\r
\\hline\r
\\text{Node $I$} & \\text{Level $k$} & \\text{Advance $a(I)$} & \\text{Threshold $\\Delta_k$} & L(I) & N(I) \\\\\r
\\hline\r
F_2 & 2 & S^2 \\approx 13.506 & 9.831 & 15 & 21 \\\\\r
\\hline\r
F_3 & 3 & 2(12) + a(F_2) \\approx 37.506 & 36.128 & 39 & 56 \\\\\r
\\hline\r
F_4 & 4 & 2(48) + a(F_3) \\approx 133.506 & 132.769 & 135 & 195 \\\\\r
\\hline\r
T & 5 & 4 a(F_4) \\approx 534.023 & 487.925 & 540 & 781 \\\\\r
\\hline\r
\\end{array}\r
$$\r
\r
Since $a(I) > \\Delta_k$ at every level, $T$ is admissible. Its rate is\r
\r
$$\r
R(T) = \\frac{781}{540} \\approx 1.446296.\r
$$\r
\r
Comparing the rates reveals $R(T) > R\\bigl(G_5(S)\\bigr)$, showing that geodesic trees are not always globally dominating.\r
\r
What does the upper bound result tell us? In this case $m_3^\\text{min}=3$ and $\\ell_3^\\text{min}=39$ so that $u_4=135$ and $u_5=489$. Therefore for this $S$, every admissible tree $T'$ of height $5$ satisfies\r
\r
$$\r
R(T')\\le R(G_3)+\\frac{1}{u_4}+\\frac{1}{u_5}=\\frac{1+C_3+C_3C_2+C_3C_2n}{C_3C_2n}+\\frac{1}{135}+\\frac{1}{489}=\\frac{509443}{352080}\\approx 1.446952.\r
$$\r
\r
### Bounding upper asymptotic rebuild rate\r
\r
Applying this to the upper asymptotic rebuild rates of paths gives the following.\r
\r
**Corollary**  \r
Let $\\gamma:[0,\\infty)\\to X$ be an arc-length parametrized path in a metric space $(X,d)$. Let $S>1$ and $(r_k)=(S^k)$. Then the upper asymptotic rebuild rate satisfies \r
\r
$$\r
R^+(\\gamma)\\le R\\bigl(G_3(S)\\bigr) + \\sum_{j=4}^\\infty \\frac{1}{u_j},\r
$$\r
\r
where $u_j$ are as in the previous proposition.\r
$\\blacksquare$\r
\r
Below is a plot including\r
- this improved bound (blue), \r
- the simple upper bound $n/(n-1)$ (orange, $n>1$), \r
- the geodesic rebuild rate function $R$ (black), \r
- the counter-example for paths with $S=3.675$ (red dot). \r
\r
The plot is normalized so that $y=0$ corresponds for $R_\\text{ideal}=S/(S-1)$ and $y=1$ corresponds to the bound $R_\\text{upper}=(S^2-S+1)/(S-1)^2$. Specifically normalization is\r
\r
$$\r
f_\\text{normalized}(S)=\\frac{f(S)-R_\\text{ideal}(S)}{R_\\text{upper}(S)-R_\\text{ideal}(S)}.\r
$$\r
\r
<figure>\r
\r
![Bound](./bound.png)\r
\r
</figure>`,Nh={def:e=>(0,N.jsx)(Eh,{type:`Definition`,...e}),lemma:e=>(0,N.jsx)(Eh,{type:`Lemma`,...e}),theorem:e=>(0,N.jsx)(Eh,{type:`Theorem`,...e}),proposition:e=>(0,N.jsx)(Eh,{type:`Proposition`,...e}),corollary:e=>(0,N.jsx)(Eh,{type:`Corollary`,...e}),conjecture:e=>(0,N.jsx)(Eh,{type:`Conjecture`,...e}),ref:Sh,proof:hh,sketch:gh,detail:_h,img:Ch,figure:wh,figcaption:Th},Ph=({rawMarkdown:e})=>(0,N.jsx)(yh,{children:(0,N.jsx)(Dh,{children:(0,N.jsx)(Uc,{remarkPlugins:[ol],rehypePlugins:[nh,au],components:Nh,children:e})})}),Fh=()=>{let e=Oh.split(`./`).join(`/dev-site-misc/`),t=kh.split(`./`).join(`/dev-site-misc/`),n=Ah.split(`./`).join(`/dev-site-misc/`),r=jh.split(`./`).join(`/dev-site-misc/`),i=Mh.split(`./`).join(`/dev-site-misc/`),a=e+`
`+t+`
`+n+`
`+r+`
`+i;return(0,N.jsxs)(D,{maxWidth:`xl`,children:[(0,N.jsx)(k,{component:ee,to:`/`,variant:`body1`,color:`primary`,children:`Back`}),(0,N.jsx)(T,{children:(0,N.jsx)(Ph,{rawMarkdown:a})})]})};export{Ph as MathDocumentView,Fh as default};