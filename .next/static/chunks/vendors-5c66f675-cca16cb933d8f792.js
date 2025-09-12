"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6053],{21014:(e,t,r)=>{r.d(t,{Dc:()=>x,Dx:()=>$,GQ:()=>b,Xb:()=>of,Zf:()=>oh,iX:()=>h,t3:()=>oc,xI:()=>c});var n,i=r(38243),o=!i.S$&&!!i.IJ,l=()=>void 0,a=e=>null!=e,s=e=>"function"!=typeof e||e.length?e:e(),d=e=>Array.isArray(e)?e:e?[e]:[],u=o?e=>(0,i.QQ)()?(0,i.Ki)(e):e:i.Ki,c=function(e){let[t,r]=(0,i.n5)(),n=e?.throw?(e,t)=>{throw r(e instanceof Error?e:Error(t)),e}:(e,t)=>{r(e instanceof Error?e:Error(t))},o=e?.api?Array.isArray(e.api)?e.api:[e.api]:[globalThis.localStorage].filter(Boolean),l=e?.prefix?`${e.prefix}.`:"",a=new Map,s=new Proxy({},{get(t,r){let s=a.get(r);s||(s=(0,i.n5)(void 0,{equals:!1}),a.set(r,s)),s[0]();let d=o.reduce((e,t)=>{if(null!==e||!t)return e;try{return t.getItem(`${l}${r}`)}catch(e){return n(e,`Error reading ${l}${r} from ${t.name}`),null}},null);return null!==d&&e?.deserializer?e.deserializer(d,r,e.options):d}});return e?.sync!==!1&&(0,i.Rc)(()=>{let e=e=>{let t=!1;o.forEach(r=>{try{r!==e.storageArea&&e.key&&e.newValue!==r.getItem(e.key)&&(e.newValue?r.setItem(e.key,e.newValue):r.removeItem(e.key),t=!0)}catch(t){n(t,`Error synching api ${r.name} from storage event (${e.key}=${e.newValue})`)}}),t&&e.key&&a.get(e.key)?.[1]()};"addEventListener"in globalThis?(globalThis.addEventListener("storage",e),(0,i.Ki)(()=>globalThis.removeEventListener("storage",e))):(o.forEach(t=>t.addEventListener?.("storage",e)),(0,i.Ki)(()=>o.forEach(t=>t.removeEventListener?.("storage",e))))}),[s,(t,r,i)=>{let s=e?.serializer?e.serializer(r,t,i??e.options):r,d=`${l}${t}`;o.forEach(e=>{try{e.getItem(d)!==s&&e.setItem(d,s)}catch(r){n(r,`Error setting ${l}${t} to ${s} in ${e.name}`)}});let u=a.get(t);u&&u[1]()},{clear:()=>o.forEach(e=>{try{e.clear()}catch(t){n(t,`Error clearing ${e.name}`)}}),error:t,remove:e=>o.forEach(t=>{try{t.removeItem(`${l}${e}`)}catch(r){n(r,`Error removing ${l}${e} from ${t.name}`)}}),toJSON:()=>{let t={},r=(r,n)=>{if(!t.hasOwnProperty(r)){let i=n&&e?.deserializer?e.deserializer(n,r,e.options):n;i&&(t[r]=i)}};return o.forEach(e=>{if("function"==typeof e.getAll){let t;try{t=e.getAll()}catch(t){n(t,`Error getting all values from in ${e.name}`)}for(let e of t)r(e,t[e])}else{let i=0,o;try{for(;o=e.key(i++);)t.hasOwnProperty(o)||r(o,e.getItem(o))}catch(t){n(t,`Error getting all values from ${e.name}`)}}}),t}}]},g=e=>{if(!e)return"";let t="";for(let r in e){if(!e.hasOwnProperty(r))continue;let n=e[r];t+=n instanceof Date?`; ${r}=${n.toUTCString()}`:"boolean"==typeof n?`; ${r}`:`; ${r}=${n}`}return t},f=(e=>("function"==typeof e.clear||(e.clear=()=>{let t;for(;t=e.key(0);)e.removeItem(t)}),e))({_cookies:[globalThis.document,"cookie"],getItem:e=>f._cookies[0][f._cookies[1]].match("(^|;)\\s*"+e+"\\s*=\\s*([^;]+)")?.pop()??null,setItem:(e,t,r)=>{let n=f.getItem(e);f._cookies[0][f._cookies[1]]=`${e}=${t}${g(r)}`;let i=Object.assign(new Event("storage"),{key:e,oldValue:n,newValue:t,url:globalThis.document.URL,storageArea:f});window.dispatchEvent(i)},removeItem:e=>{f._cookies[0][f._cookies[1]]=`${e}=deleted${g({expires:new Date(0)})}`},key:e=>{let t=null,r=0;return f._cookies[0][f._cookies[1]].replace(/(?:^|;)\s*(.+?)\s*=\s*[^;]+/g,(n,i)=>(!t&&i&&r++===e&&(t=i),"")),t},get length(){let e=0;return f._cookies[0][f._cookies[1]].replace(/(?:^|;)\s*.+?\s*=\s*[^;]+/g,t=>(e+=+!!t,"")),e}}),p="bottom",h="system",v=Object.keys(i.O$)[0],y=Object.keys(i.bs)[0],b=(0,i.q6)({client:void 0,onlineManager:void 0,queryFlavor:"",version:"",shadowDOMTarget:void 0});function m(){return(0,i.NT)(b)}var w=(0,i.q6)(void 0),x=e=>{let[t,r]=(0,i.n5)(null),n=()=>{let e=t();null!=e&&(e.close(),r(null))},o=(n,o)=>{if(null!=t())return;let l=window.open("","TSQD-Devtools-Panel",`width=${n},height=${o},popup`);if(!l)throw Error("Failed to open popup. Please allow popups for this site to view the devtools in picture-in-picture mode.");l.document.head.innerHTML="",l.document.body.innerHTML="",(0,i.MQ)(l.document),l.document.title="TanStack Query Devtools",l.document.body.style.margin="0",l.addEventListener("pagehide",()=>{e.setLocalStore("pip_open","false"),r(null)}),[...(m().shadowDOMTarget||document).styleSheets].forEach(e=>{try{let t=[...e.cssRules].map(e=>e.cssText).join(""),r=document.createElement("style"),n=e.ownerNode,i="";n&&"id"in n&&(i=n.id),i&&r.setAttribute("id",i),r.textContent=t,l.document.head.appendChild(r)}catch(r){let t=document.createElement("link");if(null==e.href)return;t.rel="stylesheet",t.type=e.type,t.media=e.media.toString(),t.href=e.href,l.document.head.appendChild(t)}}),(0,i.z_)(["focusin","focusout","pointermove","keydown","pointerdown","pointerup","click","mousedown","input"],l.document),e.setLocalStore("pip_open","true"),r(l)};(0,i.EH)(()=>{"true"!==(e.localStore.pip_open??"false")||e.disabled||o(Number(window.innerWidth),Number(e.localStore.height||500))}),(0,i.EH)(()=>{let e=(m().shadowDOMTarget||document).querySelector("#_goober"),r=t();if(e&&r){let t=new MutationObserver(()=>{let t=(m().shadowDOMTarget||r.document).querySelector("#_goober");t&&(t.textContent=e.textContent)});t.observe(e,{childList:!0,subtree:!0,characterDataOldValue:!0}),(0,i.Ki)(()=>{t.disconnect()})}});let l=(0,i.To)(()=>({pipWindow:t(),requestPipWindow:o,closePipWindow:n,disabled:e.disabled??!1}));return(0,i.a0)(w.Provider,{value:l,get children(){return e.children}})},k=()=>(0,i.To)(()=>{let e=(0,i.NT)(w);if(!e)throw Error("usePiPWindow must be used within a PiPProvider");return e()}),$=(0,i.q6)(()=>"dark");function S(){return(0,i.NT)($)}var C={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",Ấ:"A",Ắ:"A",Ẳ:"A",Ẵ:"A",Ặ:"A",Æ:"AE",Ầ:"A",Ằ:"A",Ȃ:"A",Ç:"C",Ḉ:"C",È:"E",É:"E",Ê:"E",Ë:"E",Ế:"E",Ḗ:"E",Ề:"E",Ḕ:"E",Ḝ:"E",Ȇ:"E",Ì:"I",Í:"I",Î:"I",Ï:"I",Ḯ:"I",Ȋ:"I",Ð:"D",Ñ:"N",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",Ố:"O",Ṍ:"O",Ṓ:"O",Ȏ:"O",Ù:"U",Ú:"U",Û:"U",Ü:"U",Ý:"Y",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",ấ:"a",ắ:"a",ẳ:"a",ẵ:"a",ặ:"a",æ:"ae",ầ:"a",ằ:"a",ȃ:"a",ç:"c",ḉ:"c",è:"e",é:"e",ê:"e",ë:"e",ế:"e",ḗ:"e",ề:"e",ḕ:"e",ḝ:"e",ȇ:"e",ì:"i",í:"i",î:"i",ï:"i",ḯ:"i",ȋ:"i",ð:"d",ñ:"n",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",ố:"o",ṍ:"o",ṓ:"o",ȏ:"o",ù:"u",ú:"u",û:"u",ü:"u",ý:"y",ÿ:"y",Ā:"A",ā:"a",Ă:"A",ă:"a",Ą:"A",ą:"a",Ć:"C",ć:"c",Ĉ:"C",ĉ:"c",Ċ:"C",ċ:"c",Č:"C",č:"c",C̆:"C",c̆:"c",Ď:"D",ď:"d",Đ:"D",đ:"d",Ē:"E",ē:"e",Ĕ:"E",ĕ:"e",Ė:"E",ė:"e",Ę:"E",ę:"e",Ě:"E",ě:"e",Ĝ:"G",Ǵ:"G",ĝ:"g",ǵ:"g",Ğ:"G",ğ:"g",Ġ:"G",ġ:"g",Ģ:"G",ģ:"g",Ĥ:"H",ĥ:"h",Ħ:"H",ħ:"h",Ḫ:"H",ḫ:"h",Ĩ:"I",ĩ:"i",Ī:"I",ī:"i",Ĭ:"I",ĭ:"i",Į:"I",į:"i",İ:"I",ı:"i",Ĳ:"IJ",ĳ:"ij",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",Ḱ:"K",ḱ:"k",K̆:"K",k̆:"k",Ĺ:"L",ĺ:"l",Ļ:"L",ļ:"l",Ľ:"L",ľ:"l",Ŀ:"L",ŀ:"l",Ł:"l",ł:"l",Ḿ:"M",ḿ:"m",M̆:"M",m̆:"m",Ń:"N",ń:"n",Ņ:"N",ņ:"n",Ň:"N",ň:"n",ŉ:"n",N̆:"N",n̆:"n",Ō:"O",ō:"o",Ŏ:"O",ŏ:"o",Ő:"O",ő:"o",Œ:"OE",œ:"oe",P̆:"P",p̆:"p",Ŕ:"R",ŕ:"r",Ŗ:"R",ŗ:"r",Ř:"R",ř:"r",R̆:"R",r̆:"r",Ȓ:"R",ȓ:"r",Ś:"S",ś:"s",Ŝ:"S",ŝ:"s",Ş:"S",Ș:"S",ș:"s",ş:"s",Š:"S",š:"s",Ţ:"T",ţ:"t",ț:"t",Ț:"T",Ť:"T",ť:"t",Ŧ:"T",ŧ:"t",T̆:"T",t̆:"t",Ũ:"U",ũ:"u",Ū:"U",ū:"u",Ŭ:"U",ŭ:"u",Ů:"U",ů:"u",Ű:"U",ű:"u",Ų:"U",ų:"u",Ȗ:"U",ȗ:"u",V̆:"V",v̆:"v",Ŵ:"W",ŵ:"w",Ẃ:"W",ẃ:"w",X̆:"X",x̆:"x",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Y̆:"Y",y̆:"y",Ź:"Z",ź:"z",Ż:"Z",ż:"z",Ž:"Z",ž:"z",ſ:"s",ƒ:"f",Ơ:"O",ơ:"o",Ư:"U",ư:"u",Ǎ:"A",ǎ:"a",Ǐ:"I",ǐ:"i",Ǒ:"O",ǒ:"o",Ǔ:"U",ǔ:"u",Ǖ:"U",ǖ:"u",Ǘ:"U",ǘ:"u",Ǚ:"U",ǚ:"u",Ǜ:"U",ǜ:"u",Ứ:"U",ứ:"u",Ṹ:"U",ṹ:"u",Ǻ:"A",ǻ:"a",Ǽ:"AE",ǽ:"ae",Ǿ:"O",ǿ:"o",Þ:"TH",þ:"th",Ṕ:"P",ṕ:"p",Ṥ:"S",ṥ:"s",X́:"X",x́:"x",Ѓ:"Г",ѓ:"г",Ќ:"К",ќ:"к",A̋:"A",a̋:"a",E̋:"E",e̋:"e",I̋:"I",i̋:"i",Ǹ:"N",ǹ:"n",Ồ:"O",ồ:"o",Ṑ:"O",ṑ:"o",Ừ:"U",ừ:"u",Ẁ:"W",ẁ:"w",Ỳ:"Y",ỳ:"y",Ȁ:"A",ȁ:"a",Ȅ:"E",ȅ:"e",Ȉ:"I",ȉ:"i",Ȍ:"O",ȍ:"o",Ȑ:"R",ȑ:"r",Ȕ:"U",ȕ:"u",B̌:"B",b̌:"b",Č̣:"C",č̣:"c",Ê̌:"E",ê̌:"e",F̌:"F",f̌:"f",Ǧ:"G",ǧ:"g",Ȟ:"H",ȟ:"h",J̌:"J",ǰ:"j",Ǩ:"K",ǩ:"k",M̌:"M",m̌:"m",P̌:"P",p̌:"p",Q̌:"Q",q̌:"q",Ř̩:"R",ř̩:"r",Ṧ:"S",ṧ:"s",V̌:"V",v̌:"v",W̌:"W",w̌:"w",X̌:"X",x̌:"x",Y̌:"Y",y̌:"y",A̧:"A",a̧:"a",B̧:"B",b̧:"b",Ḑ:"D",ḑ:"d",Ȩ:"E",ȩ:"e",Ɛ̧:"E",ɛ̧:"e",Ḩ:"H",ḩ:"h",I̧:"I",i̧:"i",Ɨ̧:"I",ɨ̧:"i",M̧:"M",m̧:"m",O̧:"O",o̧:"o",Q̧:"Q",q̧:"q",U̧:"U",u̧:"u",X̧:"X",x̧:"x",Z̧:"Z",z̧:"z"},q=RegExp(Object.keys(C).join("|"),"g"),E={CASE_SENSITIVE_EQUAL:7,EQUAL:6,STARTS_WITH:5,WORD_STARTS_WITH:4,CONTAINS:3,ACRONYM:2,MATCHES:1,NO_MATCH:0};function T(e,t,r){var n;if((r=r||{}).threshold=null!=(n=r.threshold)?n:E.MATCHES,!r.accessors){let n=M(e,t,r);return{rankedValue:e,rank:n,accessorIndex:-1,accessorThreshold:r.threshold,passed:n>=r.threshold}}let i=function(e,t){let r=[];for(let i=0,o=t.length;i<o;i++){var n;let o=t[i],l="function"==typeof(n=o)?F:{...F,...n},a=function(e,t){let r=t;"object"==typeof t&&(r=t.accessor);let n=r(e);return null==n?[]:Array.isArray(n)?n:[String(n)]}(e,o);for(let e=0,t=a.length;e<t;e++)r.push({itemValue:a[e],attributes:l})}return r}(e,r.accessors),o={rankedValue:e,rank:E.NO_MATCH,accessorIndex:-1,accessorThreshold:r.threshold,passed:!1};for(let e=0;e<i.length;e++){let n=i[e],l=M(n.itemValue,t,r),{minRanking:a,maxRanking:s,threshold:d=r.threshold}=n.attributes;l<a&&l>=E.MATCHES?l=a:l>s&&(l=s),(l=Math.min(l,s))>=d&&l>o.rank&&(o.rank=l,o.passed=!0,o.accessorIndex=e,o.accessorThreshold=d,o.rankedValue=n.itemValue)}return o}function M(e,t,r){let n;return(e=L(e,r),(t=L(t,r)).length>e.length)?E.NO_MATCH:e===t?E.CASE_SENSITIVE_EQUAL:(e=e.toLowerCase())===(t=t.toLowerCase())?E.EQUAL:e.startsWith(t)?E.STARTS_WITH:e.includes(` ${t}`)?E.WORD_STARTS_WITH:e.includes(t)?E.CONTAINS:1===t.length?E.NO_MATCH:(n="",e.split(" ").forEach(e=>{e.split("-").forEach(e=>{n+=e.substr(0,1)})}),n).includes(t)?E.ACRONYM:function(e,t){let r=0,n=0;function i(e,t,n){for(let i=n,o=t.length;i<o;i++)if(t[i]===e)return r+=1,i+1;return -1}let o=i(t[0],e,0);if(o<0)return E.NO_MATCH;n=o;for(let r=1,o=t.length;r<o;r++)if(!((n=i(t[r],e,n))>-1))return E.NO_MATCH;var l=n-o;let a=r/t.length;return E.MATCHES+1/l*a}(e,t)}function L(e,t){let{keepDiacritics:r}=t;return e=`${e}`,r||(e=e.replace(q,e=>C[e])),e}var F={maxRanking:1/0,minRanking:-1/0},D={data:""},z=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,A=/\/\*[^]*?\*\/|  +/g,O=/\n+/g,I=(e,t)=>{let r="",n="",i="";for(let o in e){let l=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+l+";":n+="f"==o[1]?I(l,o):o+"{"+I(l,"k"==o[1]?"":t)+"}":"object"==typeof l?n+=I(l,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=l&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=I.p?I.p(o,l):o+":"+l+";")}return r+(t&&i?t+"{"+i+"}":i)+n},K={},P=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+P(e[r]);return t}return e};function B(e){let t,r,n,i=this||{},o=e.call?e(i.p):e;return((e,t,r,n,i)=>{var o,l,a,s;let d=P(e),u=K[d]||(K[d]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(d));if(!K[u]){let t=d!==e?e:(e=>{let t,r,n=[{}];for(;t=z.exec(e.replace(A,""));)t[4]?n.shift():t[3]?(r=t[3].replace(O," ").trim(),n.unshift(n[0][r]=n[0][r]||{})):n[0][t[1]]=t[2].replace(O," ").trim();return n[0]})(e);K[u]=I(i?{["@keyframes "+u]:t}:t,r?"":"."+u)}let c=r&&K.g?K.g:null;return r&&(K.g=K[u]),o=K[u],l=t,a=n,(s=c)?l.data=l.data.replace(s,o):-1===l.data.indexOf(o)&&(l.data=a?o+l.data:l.data+o),u})(o.unshift?o.raw?(t=[].slice.call(arguments,1),r=i.p,o.reduce((e,n,i)=>{let o=t[i];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":I(e,""):!1===e?"":e}return e+n+(null==o?"":o)},"")):o.reduce((e,t)=>Object.assign(e,t&&t.call?t(i.p):t),{}):o,(n=i.target,"object"==typeof window?((n?n.querySelector("#_goober"):window._goober)||Object.assign((n||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:n||D),i.g,i.o,i.k)}function H(){for(var e,t,r=0,n="",i=arguments.length;r<i;r++)(e=arguments[r])&&(t=function e(t){var r,n,i="";if("string"==typeof t||"number"==typeof t)i+=t;else if("object"==typeof t)if(Array.isArray(t)){var o=t.length;for(r=0;r<o;r++)t[r]&&(n=e(t[r]))&&(i&&(i+=" "),i+=n)}else for(n in t)t[n]&&(i&&(i+=" "),i+=n);return i}(e))&&(n&&(n+=" "),n+=t);return n}function R(...e){return(...t)=>{for(let r of e)r&&r(...t)}}B.bind({g:1}),B.bind({k:1});var G=i.S$?e=>null!=e&&"object"==typeof e&&"t"in e:e=>e instanceof Element;function U(e){requestAnimationFrame(()=>requestAnimationFrame(e))}var Y=e=>{let t=function(e){return(0,i.To)(()=>{let t=e.name||"s";return{enterActive:(e.enterActiveClass||t+"-enter-active").split(" "),enter:(e.enterClass||t+"-enter").split(" "),enterTo:(e.enterToClass||t+"-enter-to").split(" "),exitActive:(e.exitActiveClass||t+"-exit-active").split(" "),exit:(e.exitClass||t+"-exit").split(" "),exitTo:(e.exitToClass||t+"-exit-to").split(" "),move:(e.moveClass||t+"-move").split(" ")}})}(e);return function(e,t){let r=(0,i.vz)(e);if(i.S$){let e=r.slice();return()=>e}let{onChange:n}=t,o=new Set(t.appear?void 0:r),l=new WeakSet,[a,s]=(0,i.n5)([],{equals:!1}),[d]=(0,i.pn)(),u=e=>{for(let t of(s(t=>(t.push.apply(t,e),t)),e))l.delete(t)},c=(e,t,r)=>e.splice(r,0,t);return(0,i.To)(t=>{let r=a(),s=e();if(s[i.WX],(0,i.vz)(d))return d(),t;if(r.length){let e=t.filter(e=>!r.includes(e));return r.length=0,n({list:e,added:[],removed:[],unchanged:e,finishRemoved:u}),e}return(0,i.vz)(()=>{let e=new Set(s),r=s.slice(),i=[],a=[],d=[];for(let e of s)(o.has(e)?d:i).push(e);let g=!i.length;for(let n=0;n<t.length;n++){let i=t[n];e.has(i)||(l.has(i)||(a.push(i),l.add(i)),c(r,i,n)),g&&i!==r[n]&&(g=!1)}return!a.length&&g?t:(n({list:r,added:i,removed:a,unchanged:d,finishRemoved:u}),o=e,r)})},t.appear?[]:r.slice())}(function(e,t=G,r=G){let n=(0,i.To)(e),o=(0,i.To)(()=>(function e(t,r){if(r(t))return t;if("function"==typeof t&&!t.length)return e(t(),r);if(Array.isArray(t)){let n=[];for(let i of t){let t=e(i,r);t&&(Array.isArray(t)?n.push.apply(n,t):n.push(t))}return n.length?n:null}return null})(n(),i.S$?r:t));return o.toArray=()=>{let e=o();return Array.isArray(e)?e:e?[e]:[]},o}(()=>e.children).toArray,{appear:e.appear,onChange({added:r,removed:n,finishRemoved:i,list:o}){let l=t();for(let t of r)!function(e,t,r,n){let{onBeforeEnter:i,onEnter:o,onAfterEnter:l}=t;function a(t){t&&t.target!==r||(r.removeEventListener("transitionend",a),r.removeEventListener("animationend",a),r.classList.remove(...e.enterActive),r.classList.remove(...e.enterTo),l?.(r))}i?.(r),r.classList.add(...e.enter),r.classList.add(...e.enterActive),queueMicrotask(()=>{r.parentNode&&o?.(r,()=>a())}),U(()=>{r.classList.remove(...e.enter),r.classList.add(...e.enterTo),(!o||o.length<2)&&(r.addEventListener("transitionend",a),r.addEventListener("animationend",a))})}(l,e,t);let a=[];for(let e of o)e.isConnected&&(e instanceof HTMLElement||e instanceof SVGElement)&&a.push({el:e,rect:e.getBoundingClientRect()});for(let t of(queueMicrotask(()=>{let e=[];for(let{el:t,rect:r}of a)if(t.isConnected){let n=t.getBoundingClientRect(),i=r.left-n.left,o=r.top-n.top;(i||o)&&(t.style.transform=`translate(${i}px, ${o}px)`,t.style.transitionDuration="0s",e.push(t))}for(let t of(document.body.offsetHeight,e)){let e=function(r){(r.target===t||/transform$/.test(r.propertyName))&&(t.removeEventListener("transitionend",e),t.classList.remove(...l.move))};t.classList.add(...l.move),t.style.transform=t.style.transitionDuration="",t.addEventListener("transitionend",e)}}),n))!function(e,t,r,n){let{onBeforeExit:i,onExit:o,onAfterExit:l}=t;if(!r.parentNode)return n?.();function a(t){t&&t.target!==r||(n?.(),r.removeEventListener("transitionend",a),r.removeEventListener("animationend",a),r.classList.remove(...e.exitActive),r.classList.remove(...e.exitTo),l?.(r))}i?.(r),r.classList.add(...e.exit),r.classList.add(...e.exitActive),o?.(r,()=>a()),U(()=>{r.classList.remove(...e.exit),r.classList.add(...e.exitTo),(!o||o.length<2)&&(r.addEventListener("transitionend",a),r.addEventListener("animationend",a))})}(l,e,t,()=>i([t]))}})},N=Symbol("fallback");function V(e){for(let t of e)t.dispose()}function j(e){let{by:t}=e;return(0,i.To)(function(e,t,r,n={}){if(i.S$){let t=e(),i=[];if(t&&t.length)for(let e=0,n=t.length;e<n;e++)i.push(r(()=>t[e],()=>e));else n.fallback&&(i=[n.fallback()]);return()=>i}let o=new Map;return(0,i.Ki)(()=>V(o.values())),()=>{let r=e()||[];return r[i.WX],(0,i.vz)(()=>{if(!r.length)return(V(o.values()),o.clear(),n.fallback)?[(0,i.Hr)(e=>(o.set(N,{dispose:e}),n.fallback()))]:[];let e=Array(r.length),a=o.get(N);if(!o.size||a){a?.dispose(),o.delete(N);for(let n=0;n<r.length;n++){let i=r[n],o=t(i,n);l(e,i,n,o)}return e}let s=new Set(o.keys());for(let n=0;n<r.length;n++){let i=r[n],a=t(i,n);s.delete(a);let d=o.get(a);d?(e[n]=d.mapped,d.setIndex?.(n),d.setItem(()=>i)):l(e,i,n,a)}for(let e of s)o.get(e)?.dispose(),o.delete(e);return e})};function l(e,t,n,l){(0,i.Hr)(a=>{let[s,d]=(0,i.n5)(t),u={setItem:d,dispose:a};if(r.length>1){let[e,t]=(0,i.n5)(n);u.setIndex=t,u.mapped=r(s,e)}else u.mapped=r(s);o.set(l,u),e[n]=u.mapped})}}(()=>e.each,"function"==typeof t?t:e=>e[t],e.children,"fallback"in e?{fallback:()=>e.fallback}:void 0))}function _(e,t,r){if(i.S$)return;let n=new WeakMap,{observe:o,unobserve:u}=function(e,t){if(i.S$)return{observe:l,unobserve:l};let r=new ResizeObserver(e);return(0,i.Ki)(r.disconnect.bind(r)),{observe:e=>r.observe(e,t),unobserve:r.unobserve.bind(r)}}(e=>{for(let r of e){let{contentRect:e,target:i}=r,o=Math.round(e.width),l=Math.round(e.height),a=n.get(i);a&&a.width===o&&a.height===l||(t(e,i,r),n.set(i,{width:o,height:l}))}},r);(0,i.EH)(t=>{let r=d(s(e)).filter(a);return!function(e,t,r,n){let i,o,l=e.length,a=t.length,s=0;if(!a){for(;s<l;s++)r(e[s]);return}if(!l){for(;s<a;s++)n(t[s]);return}for(;s<a&&t[s]===e[s];s++);for(i of(t=t.slice(s),e=e.slice(s),t))e.includes(i)||n(i);for(o of e)t.includes(o)||r(o)}(r,t,o,u),r},[])}var Q=/((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;function W(e){let t,r={};for(;t=Q.exec(e);)r[t[1]]=t[2];return r}function Z(e,t){if("string"==typeof e){if("string"==typeof t)return`${e};${t}`;e=W(e)}else"string"==typeof t&&(t=W(t));return{...e,...t}}function X(e,t){let r=[...e],n=r.indexOf(t);return -1!==n&&r.splice(n,1),r}function J(e){return"[object String]"===Object.prototype.toString.call(e)}function ee(e){return t=>`${e()}-${t}`}function et(e,t){return!!e&&(e===t||e.contains(t))}function er(e,t=!1){let{activeElement:r}=en(e);if(!r?.nodeName)return null;if(ei(r)&&r.contentDocument)return er(r.contentDocument.body,t);if(t){let e=r.getAttribute("aria-activedescendant");if(e){let t=en(r).getElementById(e);if(t)return t}}return r}function en(e){return e?e.ownerDocument||e:document}function ei(e){return"IFRAME"===e.tagName}var eo=(e=>(e.Escape="Escape",e.Enter="Enter",e.Tab="Tab",e.Space=" ",e.ArrowDown="ArrowDown",e.ArrowLeft="ArrowLeft",e.ArrowRight="ArrowRight",e.ArrowUp="ArrowUp",e.End="End",e.Home="Home",e.PageDown="PageDown",e.PageUp="PageUp",e))(eo||{});function el(e){return"undefined"!=typeof window&&null!=window.navigator&&e.test(window.navigator.userAgentData?.platform||window.navigator.platform)}function ea(){return el(/^Mac/i)}function es(e,t){return t&&("function"==typeof t?t(e):t[0](t[1],e)),e?.defaultPrevented}function ed(e){return t=>{for(let r of e)es(t,r)}}function eu(e){if(e)if(function(){if(null==ec){ec=!1;try{document.createElement("div").focus({get preventScroll(){return ec=!0,!0}})}catch(e){}}return ec}())e.focus({preventScroll:!0});else{let t=function(e){let t=e.parentNode,r=[],n=document.scrollingElement||document.documentElement;for(;t instanceof HTMLElement&&t!==n;)(t.offsetHeight<t.scrollHeight||t.offsetWidth<t.scrollWidth)&&r.push({element:t,scrollTop:t.scrollTop,scrollLeft:t.scrollLeft}),t=t.parentNode;return n instanceof HTMLElement&&r.push({element:n,scrollTop:n.scrollTop,scrollLeft:n.scrollLeft}),r}(e);e.focus(),function(e){for(let{element:t,scrollTop:r,scrollLeft:n}of e)t.scrollTop=r,t.scrollLeft=n}(t)}}var ec=null,eg=["input:not([type='hidden']):not([disabled])","select:not([disabled])","textarea:not([disabled])","button:not([disabled])","a[href]","area[href]","[tabindex]","iframe","object","embed","audio[controls]","video[controls]","[contenteditable]:not([contenteditable='false'])"],ef=[...eg,'[tabindex]:not([tabindex="-1"]):not([disabled])'],ep=eg.join(":not([hidden]),")+",[tabindex]:not([disabled]):not([hidden])",eh=ef.join(':not([hidden]):not([tabindex="-1"]),');function ev(e){return ey(e)&&!(0>parseInt(e.getAttribute("tabindex")||"0",10))}function ey(e){return e.matches(ep)&&eb(e)}function eb(e,t){var r,n;return"#comment"!==e.nodeName&&function(e){if(!(e instanceof HTMLElement)&&!(e instanceof SVGElement))return!1;let{display:t,visibility:r}=e.style,n="none"!==t&&"hidden"!==r&&"collapse"!==r;if(n){if(!e.ownerDocument.defaultView)return n;let{getComputedStyle:t}=e.ownerDocument.defaultView,{display:r,visibility:i}=t(e);n="none"!==r&&"hidden"!==i&&"collapse"!==i}return n}(e)&&(r=e,n=t,!r.hasAttribute("hidden")&&("DETAILS"!==r.nodeName||!n||"SUMMARY"===n.nodeName||r.hasAttribute("open")))&&(!e.parentElement||eb(e.parentElement,e))}function em(e){for(;e&&!function(e){let t=window.getComputedStyle(e);return/(auto|scroll)/.test(t.overflow+t.overflowX+t.overflowY)}(e);)e=e.parentElement;return e||document.scrollingElement||document.documentElement}function ew(){}function ex(e,t){return(0,i.v6)(e,t)}var ek=new Map,e$=new Set;function eS(){if("undefined"==typeof window)return;let e=t=>{if(!t.target)return;let r=ek.get(t.target);if(r&&(r.delete(t.propertyName),0===r.size&&(t.target.removeEventListener("transitioncancel",e),ek.delete(t.target)),0===ek.size)){for(let e of e$)e();e$.clear()}};document.body.addEventListener("transitionrun",t=>{if(!t.target)return;let r=ek.get(t.target);r||(r=new Set,ek.set(t.target,r),t.target.addEventListener("transitioncancel",e)),r.add(t.propertyName)}),document.body.addEventListener("transitionend",e)}function eC(e,t){let r=eq(e,t,"left"),n=eq(e,t,"top"),i=t.offsetWidth,o=t.offsetHeight,l=e.scrollLeft,a=e.scrollTop,s=l+e.offsetWidth,d=a+e.offsetHeight;r<=l?l=r:r+i>s&&(l+=r+i-s),n<=a?a=n:n+o>d&&(a+=n+o-d),e.scrollLeft=l,e.scrollTop=a}function eq(e,t,r){let n="left"===r?"offsetLeft":"offsetTop",i=0;for(;t.offsetParent&&(i+=t[n],t.offsetParent!==e);){if(t.offsetParent.contains(e)){i-=e[n];break}t=t.offsetParent}return i}"undefined"!=typeof document&&("loading"!==document.readyState?eS():document.addEventListener("DOMContentLoaded",eS));var eE={border:"0",clip:"rect(0 0 0 0)","clip-path":"inset(50%)",height:"1px",margin:"0 -1px -1px 0",overflow:"hidden",padding:"0",position:"absolute",width:"1px","white-space":"nowrap"};function eT(e){return t=>(e(t),()=>e(void 0))}function eM(e,t){let[r,n]=(0,i.n5)(eL(t?.()));return(0,i.EH)(()=>{n(e()?.tagName.toLowerCase()||eL(t?.()))}),r}function eL(e){return J(e)?e:void 0}function eF(e){let[t,r]=(0,i.rg)(e,["as"]);if(!t.as)throw Error("[kobalte]: Polymorphic is missing the required `as` prop.");return(0,i.a0)(i.Qi,(0,i.v6)(r,{get component(){return t.as}}))}var eD=["id","name","validationState","required","disabled","readOnly"],ez=(0,i.q6)();function eA(){let e=(0,i.NT)(ez);if(void 0===e)throw Error("[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component");return e}function eO(e){let t=eA(),r=ex({id:t.generateId("description")},e);return(0,i.EH)(()=>(0,i.Ki)(t.registerDescription(r.id))),(0,i.a0)(eF,(0,i.v6)({as:"div"},()=>t.dataset(),r))}function eI(e){let t=eA(),r=ex({id:t.generateId("error-message")},e),[n,o]=(0,i.rg)(r,["forceMount"]),l=()=>"invalid"===t.validationState();return(0,i.EH)(()=>{l()&&(0,i.Ki)(t.registerErrorMessage(o.id))}),(0,i.a0)(i.wv,{get when(){return n.forceMount||l()},get children(){return(0,i.a0)(eF,(0,i.v6)({as:"div"},()=>t.dataset(),o))}})}function eK(e){let t,r=eA(),n=ex({id:r.generateId("label")},e),[o,l]=(0,i.rg)(n,["ref"]),a=eM(()=>t,()=>"label");return(0,i.EH)(()=>(0,i.Ki)(r.registerLabel(l.id))),(0,i.a0)(eF,(0,i.v6)({as:"label",ref(e){let r=R(e=>t=e,o.ref);"function"==typeof r&&r(e)},get for(){return(0,i.ph)(()=>"label"===a())()?r.fieldId():void 0}},()=>r.dataset(),l))}function eP(e){let[t,r]=(0,i.n5)(e.defaultValue?.()),n=(0,i.To)(()=>e.value?.()!==void 0),o=(0,i.To)(()=>n()?e.value?.():t());return[o,t=>{(0,i.vz)(()=>{let i=function(e,...t){return"function"==typeof e?e(...t):e}(t,o());return Object.is(i,o())||(n()||r(i),e.onChange?.(i)),i})}]}function eB(e){let[t,r]=eP(e);return[()=>t()??!1,r]}var eH=Object.defineProperty,eR=(e,t)=>{for(var r in t)eH(e,r,{get:t[r],enumerable:!0})},eG=(0,i.q6)();function eU(e,t){return!!(t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_PRECEDING)}function eY(e,t){let r=function(e){let t=e.map((e,t)=>[t,e]),r=!1;return(t.sort(([e,t],[n,i])=>{let o=t.ref(),l=i.ref();return o!==l&&o&&l?eU(o,l)?(e>n&&(r=!0),-1):(e<n&&(r=!0),1):0}),r)?t.map(([e,t])=>t):e}(e);e!==r&&t(r)}var eN=new Set(["Avst","Arab","Armi","Syrc","Samr","Mand","Thaa","Mend","Nkoo","Adlm","Rohg","Hebr"]),eV=new Set(["ae","ar","arc","bcc","bqi","ckb","dv","fa","glk","he","ku","mzn","nqo","pnb","ps","sd","ug","ur","yi"]);function ej(){let e="undefined"!=typeof navigator&&(navigator.language||navigator.userLanguage)||"en-US";return{locale:e,direction:!function(e){if(Intl.Locale){let t=new Intl.Locale(e).maximize().script??"";return eN.has(t)}let t=e.split("-")[0];return eV.has(t)}(e)?"ltr":"rtl"}}var e_=ej(),eQ=new Set;function eW(){for(let e of(e_=ej(),eQ))e(e_)}var eZ=(0,i.q6)();function eX(){let e=function(){let e={locale:"en-US",direction:"ltr"},[t,r]=(0,i.n5)(e_),n=(0,i.To)(()=>i.S$?e:t());return(0,i.Rc)(()=>{0===eQ.size&&window.addEventListener("languagechange",eW),eQ.add(r),(0,i.Ki)(()=>{eQ.delete(r),0===eQ.size&&window.removeEventListener("languagechange",eW)})}),{locale:()=>n().locale,direction:()=>n().direction}}();return(0,i.NT)(eZ)||e}var eJ=new Map,e0=class e extends Set{anchorKey;currentKey;constructor(t,r,n){super(t),t instanceof e?(this.anchorKey=r||t.anchorKey,this.currentKey=n||t.currentKey):(this.anchorKey=r,this.currentKey=n)}};function e1(e){return ea()||el(/^iPhone/i)||el(/^iPad/i)||ea()&&navigator.maxTouchPoints>1?e.altKey:e.ctrlKey}function e2(e){return ea()?e.metaKey:e.ctrlKey}function e5(e,t){let r=()=>s(e.selectionManager),n=()=>s(e.key),o=()=>s(e.shouldUseVirtualFocus),l=e=>{"none"!==r().selectionMode()&&("single"===r().selectionMode()?r().isSelected(n())&&!r().disallowEmptySelection()?r().toggleSelection(n()):r().replaceSelection(n()):e?.shiftKey?r().extendSelection(n()):"toggle"===r().selectionBehavior()||e2(e)||"pointerType"in e&&"touch"===e.pointerType?r().toggleSelection(n()):r().replaceSelection(n()))},a=()=>s(e.disabled)||r().isDisabled(n()),d=()=>!a()&&r().canSelectItem(n()),u=null,c=(0,i.To)(()=>{if(!(o()||a()))return n()===r().focusedKey()?0:-1}),g=(0,i.To)(()=>s(e.virtualized)?void 0:n());return(0,i.EH)((0,i.on)([t,n,o,()=>r().focusedKey(),()=>r().isFocused()],([t,r,n,i,o])=>{t&&r===i&&o&&!n&&document.activeElement!==t&&(e.focus?e.focus():eu(t))})),{isSelected:()=>r().isSelected(n()),isDisabled:a,allowsSelection:d,tabIndex:c,dataKey:g,onPointerDown:t=>{d()&&(u=t.pointerType,"mouse"!==t.pointerType||0!==t.button||s(e.shouldSelectOnPressUp)||l(t))},onPointerUp:t=>{d()&&"mouse"===t.pointerType&&0===t.button&&s(e.shouldSelectOnPressUp)&&s(e.allowsDifferentPressOrigin)&&l(t)},onClick:t=>{d()&&(s(e.shouldSelectOnPressUp)&&!s(e.allowsDifferentPressOrigin)||"mouse"!==u)&&l(t)},onKeyDown:e=>{d()&&["Enter"," "].includes(e.key)&&(e1(e)?r().toggleSelection(n()):l(e))},onMouseDown:e=>{a()&&e.preventDefault()},onFocus:e=>{let i=t();!(o()||a())&&i&&e.target===i&&r().setFocusedKey(n())}}}var e3=class{collection;state;constructor(e,t){this.collection=e,this.state=t}selectionMode(){return this.state.selectionMode()}disallowEmptySelection(){return this.state.disallowEmptySelection()}selectionBehavior(){return this.state.selectionBehavior()}setSelectionBehavior(e){this.state.setSelectionBehavior(e)}isFocused(){return this.state.isFocused()}setFocused(e){this.state.setFocused(e)}focusedKey(){return this.state.focusedKey()}setFocusedKey(e){(null==e||this.collection().getItem(e))&&this.state.setFocusedKey(e)}selectedKeys(){return this.state.selectedKeys()}isSelected(e){if("none"===this.state.selectionMode())return!1;let t=this.getKey(e);return null!=t&&this.state.selectedKeys().has(t)}isEmpty(){return 0===this.state.selectedKeys().size}isSelectAll(){if(this.isEmpty())return!1;let e=this.state.selectedKeys();return this.getAllSelectableKeys().every(t=>e.has(t))}firstSelectedKey(){let e;for(let t of this.state.selectedKeys()){let r=this.collection().getItem(t),n=r?.index!=null&&e?.index!=null&&r.index<e.index;(!e||n)&&(e=r)}return e?.key}lastSelectedKey(){let e;for(let t of this.state.selectedKeys()){let r=this.collection().getItem(t),n=r?.index!=null&&e?.index!=null&&r.index>e.index;(!e||n)&&(e=r)}return e?.key}extendSelection(e){if("none"===this.selectionMode())return;if("single"===this.selectionMode())return void this.replaceSelection(e);let t=this.getKey(e);if(null==t)return;let r=this.state.selectedKeys(),n=r.anchorKey||t,i=new e0(r,n,t);for(let e of this.getKeyRange(n,r.currentKey||t))i.delete(e);for(let e of this.getKeyRange(t,n))this.canSelectItem(e)&&i.add(e);this.state.setSelectedKeys(i)}getKeyRange(e,t){let r=this.collection().getItem(e),n=this.collection().getItem(t);return r&&n?null!=r.index&&null!=n.index&&r.index<=n.index?this.getKeyRangeInternal(e,t):this.getKeyRangeInternal(t,e):[]}getKeyRangeInternal(e,t){let r=[],n=e;for(;null!=n;){let e=this.collection().getItem(n);if(e&&"item"===e.type&&r.push(n),n===t)return r;n=this.collection().getKeyAfter(n)}return[]}getKey(e){let t=this.collection().getItem(e);return t?t&&"item"===t.type?t.key:null:e}toggleSelection(e){if("none"===this.selectionMode())return;if("single"===this.selectionMode()&&!this.isSelected(e))return void this.replaceSelection(e);let t=this.getKey(e);if(null==t)return;let r=new e0(this.state.selectedKeys());r.has(t)?r.delete(t):this.canSelectItem(t)&&(r.add(t),r.anchorKey=t,r.currentKey=t),this.disallowEmptySelection()&&0===r.size||this.state.setSelectedKeys(r)}replaceSelection(e){if("none"===this.selectionMode())return;let t=this.getKey(e);if(null==t)return;let r=this.canSelectItem(t)?new e0([t],t,t):new e0;this.state.setSelectedKeys(r)}setSelectedKeys(e){if("none"===this.selectionMode())return;let t=new e0;for(let r of e){let e=this.getKey(r);if(null!=e&&(t.add(e),"single"===this.selectionMode()))break}this.state.setSelectedKeys(t)}selectAll(){"multiple"===this.selectionMode()&&this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()))}clearSelection(){let e=this.state.selectedKeys();!this.disallowEmptySelection()&&e.size>0&&this.state.setSelectedKeys(new e0)}toggleSelectAll(){this.isSelectAll()?this.clearSelection():this.selectAll()}select(e,t){"none"!==this.selectionMode()&&("single"===this.selectionMode()?this.isSelected(e)&&!this.disallowEmptySelection()?this.toggleSelection(e):this.replaceSelection(e):"toggle"===this.selectionBehavior()||t&&"touch"===t.pointerType?this.toggleSelection(e):this.replaceSelection(e))}isSelectionEqual(e){if(e===this.state.selectedKeys())return!0;let t=this.selectedKeys();if(e.size!==t.size)return!1;for(let r of e)if(!t.has(r))return!1;for(let r of t)if(!e.has(r))return!1;return!0}canSelectItem(e){if("none"===this.state.selectionMode())return!1;let t=this.collection().getItem(e);return null!=t&&!t.disabled}isDisabled(e){let t=this.collection().getItem(e);return!t||t.disabled}getAllSelectableKeys(){let e=[];return(t=>{for(;null!=t;){if(this.canSelectItem(t)){let r=this.collection().getItem(t);if(!r)continue;"item"===r.type&&e.push(t)}t=this.collection().getKeyAfter(t)}})(this.collection().getFirstKey()),e}},e4=class{keyMap=new Map;iterable;firstKey;lastKey;constructor(e){let t;for(let t of(this.iterable=e,e))this.keyMap.set(t.key,t);if(0===this.keyMap.size)return;let r=0;for(let[e,n]of this.keyMap)t?(t.nextKey=e,n.prevKey=t.key):(this.firstKey=e,n.prevKey=void 0),"item"===n.type&&(n.index=r++),(t=n).nextKey=void 0;this.lastKey=t.key}*[Symbol.iterator](){yield*this.iterable}getSize(){return this.keyMap.size}getKeys(){return this.keyMap.keys()}getKeyBefore(e){return this.keyMap.get(e)?.prevKey}getKeyAfter(e){return this.keyMap.get(e)?.nextKey}getFirstKey(){return this.firstKey}getLastKey(){return this.lastKey}getItem(e){return this.keyMap.get(e)}at(e){let t=[...this.getKeys()];return this.getItem(t[e])}},e6=e=>"function"==typeof e?e():e,e7=e=>{let t=(0,i.To)(()=>{let t=e6(e.element);if(t)return getComputedStyle(t)}),r=()=>t()?.animationName??"none",[n,o]=(0,i.n5)(e6(e.show)?"present":"hidden"),l="none";return(0,i.EH)(n=>{let a=e6(e.show);return(0,i.vz)(()=>{if(n===a)return a;let e=l,i=r();a?o("present"):"none"===i||t()?.display==="none"?o("hidden"):!0===n&&e!==i?o("hiding"):o("hidden")}),a}),(0,i.EH)(()=>{let t=e6(e.element);if(!t)return;let a=e=>{e.target===t&&(l=r())},s=e=>{let i=r().includes(e.animationName);e.target===t&&i&&"hiding"===n()&&o("hidden")};t.addEventListener("animationstart",a),t.addEventListener("animationcancel",s),t.addEventListener("animationend",s),(0,i.Ki)(()=>{t.removeEventListener("animationstart",a),t.removeEventListener("animationcancel",s),t.removeEventListener("animationend",s)})}),{present:()=>"present"===n()||"hiding"===n(),state:n}},e9="data-kb-top-layer",e8=!1,te=[];function tt(e){return te.findIndex(t=>t.node===e)}function tr(){return te.filter(e=>e.isPointerBlocking)}function tn(){return tr().length>0}function ti(e){let t=tt([...tr()].slice(-1)[0]?.node);return tt(e)<t}var to={isTopMostLayer:function(e){return te[te.length-1].node===e},isBelowPointerBlockingLayer:ti,addLayer:function(e){te.push(e)},removeLayer:function(e){let t=tt(e);t<0||te.splice(t,1)},find:function(e){return te[tt(e)]},assignPointerEventToLayers:function(){for(let{node:e}of te)e.style.pointerEvents=ti(e)?"none":"auto"},disableBodyPointerEvents:function(e){if(tn()&&!e8){let t=en(e);n=document.body.style.pointerEvents,t.body.style.pointerEvents="none",e8=!0}},restoreBodyPointerEvents:function(e){if(tn())return;let t=en(e);t.body.style.pointerEvents=n,0===t.body.style.length&&t.body.removeAttribute("style"),e8=!1}};eR({},{Button:()=>ts,Root:()=>ta});var tl=["button","color","file","image","reset","submit"];function ta(e){let t,r=ex({type:"button"},e),[n,o]=(0,i.rg)(r,["ref","type","disabled"]),l=eM(()=>t,()=>"button"),a=(0,i.To)(()=>{let e=l();if(null==e)return!1;var t={tagName:e,type:n.type};let r=t.tagName.toLowerCase();return"button"===r||"input"===r&&!!t.type&&-1!==tl.indexOf(t.type)}),s=(0,i.To)(()=>"input"===l()),d=(0,i.To)(()=>"a"===l()&&t?.getAttribute("href")!=null);return(0,i.a0)(eF,(0,i.v6)({as:"button",ref(e){let r=R(e=>t=e,n.ref);"function"==typeof r&&r(e)},get type(){return a()||s()?n.type:void 0},get role(){return a()||d()?void 0:"button"},get tabIndex(){return a()||d()||n.disabled?void 0:0},get disabled(){return a()||s()?n.disabled:void 0},get"aria-disabled"(){return!(a()||s())&&!!n.disabled||void 0},get"data-disabled"(){return n.disabled?"":void 0}},o))}var ts=ta,td=["top","right","bottom","left"],tu=Math.min,tc=Math.max,tg=Math.round,tf=Math.floor,tp=e=>({x:e,y:e}),th={left:"right",right:"left",bottom:"top",top:"bottom"},tv={start:"end",end:"start"};function ty(e,t){return"function"==typeof e?e(t):e}function tb(e){return e.split("-")[0]}function tm(e){return e.split("-")[1]}function tw(e){return"x"===e?"y":"x"}function tx(e){return"y"===e?"height":"width"}function tk(e){return["top","bottom"].includes(tb(e))?"y":"x"}function t$(e){return e.replace(/start|end/g,e=>tv[e])}function tS(e){return e.replace(/left|right|bottom|top/g,e=>th[e])}function tC(e){return"number"!=typeof e?{top:0,right:0,bottom:0,left:0,...e}:{top:e,right:e,bottom:e,left:e}}function tq(e){let{x:t,y:r,width:n,height:i}=e;return{width:n,height:i,top:r,left:t,right:t+n,bottom:r+i,x:t,y:r}}function tE(e,t,r){let n,{reference:i,floating:o}=e,l=tk(t),a=tw(tk(t)),s=tx(a),d=tb(t),u="y"===l,c=i.x+i.width/2-o.width/2,g=i.y+i.height/2-o.height/2,f=i[s]/2-o[s]/2;switch(d){case"top":n={x:c,y:i.y-o.height};break;case"bottom":n={x:c,y:i.y+i.height};break;case"right":n={x:i.x+i.width,y:g};break;case"left":n={x:i.x-o.width,y:g};break;default:n={x:i.x,y:i.y}}switch(tm(t)){case"start":n[a]-=f*(r&&u?-1:1);break;case"end":n[a]+=f*(r&&u?-1:1)}return n}var tT=async(e,t,r)=>{let{placement:n="bottom",strategy:i="absolute",middleware:o=[],platform:l}=r,a=o.filter(Boolean),s=await (null==l.isRTL?void 0:l.isRTL(t)),d=await l.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:c}=tE(d,n,s),g=n,f={},p=0;for(let r=0;r<a.length;r++){let{name:o,fn:h}=a[r],{x:v,y:y,data:b,reset:m}=await h({x:u,y:c,initialPlacement:n,placement:g,strategy:i,middlewareData:f,rects:d,platform:l,elements:{reference:e,floating:t}});u=null!=v?v:u,c=null!=y?y:c,f={...f,[o]:{...f[o],...b}},m&&p<=50&&(p++,"object"==typeof m&&(m.placement&&(g=m.placement),m.rects&&(d=!0===m.rects?await l.getElementRects({reference:e,floating:t,strategy:i}):m.rects),{x:u,y:c}=tE(d,g,s)),r=-1)}return{x:u,y:c,placement:g,strategy:i,middlewareData:f}};async function tM(e,t){var r;void 0===t&&(t={});let{x:n,y:i,platform:o,rects:l,elements:a,strategy:s}=e,{boundary:d="clippingAncestors",rootBoundary:u="viewport",elementContext:c="floating",altBoundary:g=!1,padding:f=0}=ty(t,e),p=tC(f),h=a[g?"floating"===c?"reference":"floating":c],v=tq(await o.getClippingRect({element:null==(r=await (null==o.isElement?void 0:o.isElement(h)))||r?h:h.contextElement||await (null==o.getDocumentElement?void 0:o.getDocumentElement(a.floating)),boundary:d,rootBoundary:u,strategy:s})),y="floating"===c?{x:n,y:i,width:l.floating.width,height:l.floating.height}:l.reference,b=await (null==o.getOffsetParent?void 0:o.getOffsetParent(a.floating)),m=await (null==o.isElement?void 0:o.isElement(b))&&await (null==o.getScale?void 0:o.getScale(b))||{x:1,y:1},w=tq(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:y,offsetParent:b,strategy:s}):y);return{top:(v.top-w.top+p.top)/m.y,bottom:(w.bottom-v.bottom+p.bottom)/m.y,left:(v.left-w.left+p.left)/m.x,right:(w.right-v.right+p.right)/m.x}}function tL(e,t){return{top:e.top-t.height,right:e.right-t.width,bottom:e.bottom-t.height,left:e.left-t.width}}function tF(e){return td.some(t=>e[t]>=0)}async function tD(e,t){let{placement:r,platform:n,elements:i}=e,o=await (null==n.isRTL?void 0:n.isRTL(i.floating)),l=tb(r),a=tm(r),s="y"===tk(r),d=["left","top"].includes(l)?-1:1,u=o&&s?-1:1,c=ty(t,e),{mainAxis:g,crossAxis:f,alignmentAxis:p}="number"==typeof c?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...c};return a&&"number"==typeof p&&(f="end"===a?-1*p:p),s?{x:f*u,y:g*d}:{x:g*d,y:f*u}}function tz(e){return tI(e)?(e.nodeName||"").toLowerCase():"#document"}function tA(e){var t;return(null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function tO(e){var t;return null==(t=(tI(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function tI(e){return e instanceof Node||e instanceof tA(e).Node}function tK(e){return e instanceof Element||e instanceof tA(e).Element}function tP(e){return e instanceof HTMLElement||e instanceof tA(e).HTMLElement}function tB(e){return"undefined"!=typeof ShadowRoot&&(e instanceof ShadowRoot||e instanceof tA(e).ShadowRoot)}function tH(e){let{overflow:t,overflowX:r,overflowY:n,display:i}=tN(e);return/auto|scroll|overlay|hidden|clip/.test(t+n+r)&&!["inline","contents"].includes(i)}function tR(e){return[":popover-open",":modal"].some(t=>{try{return e.matches(t)}catch(e){return!1}})}function tG(e){let t=tU(),r=tK(e)?tN(e):e;return"none"!==r.transform||"none"!==r.perspective||!!r.containerType&&"normal"!==r.containerType||!t&&!!r.backdropFilter&&"none"!==r.backdropFilter||!t&&!!r.filter&&"none"!==r.filter||["transform","perspective","filter"].some(e=>(r.willChange||"").includes(e))||["paint","layout","strict","content"].some(e=>(r.contain||"").includes(e))}function tU(){return"undefined"!=typeof CSS&&!!CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")}function tY(e){return["html","body","#document"].includes(tz(e))}function tN(e){return tA(e).getComputedStyle(e)}function tV(e){return tK(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function tj(e){if("html"===tz(e))return e;let t=e.assignedSlot||e.parentNode||tB(e)&&e.host||tO(e);return tB(t)?t.host:t}function t_(e,t,r){var n;void 0===t&&(t=[]),void 0===r&&(r=!0);let i=function e(t){let r=tj(t);return tY(r)?t.ownerDocument?t.ownerDocument.body:t.body:tP(r)&&tH(r)?r:e(r)}(e),o=i===(null==(n=e.ownerDocument)?void 0:n.body),l=tA(i);return o?t.concat(l,l.visualViewport||[],tH(i)?i:[],l.frameElement&&r?t_(l.frameElement):[]):t.concat(i,t_(i,[],r))}function tQ(e){let t=tN(e),r=parseFloat(t.width)||0,n=parseFloat(t.height)||0,i=tP(e),o=i?e.offsetWidth:r,l=i?e.offsetHeight:n,a=tg(r)!==o||tg(n)!==l;return a&&(r=o,n=l),{width:r,height:n,$:a}}function tW(e){return tK(e)?e:e.contextElement}function tZ(e){let t=tW(e);if(!tP(t))return tp(1);let r=t.getBoundingClientRect(),{width:n,height:i,$:o}=tQ(t),l=(o?tg(r.width):r.width)/n,a=(o?tg(r.height):r.height)/i;return l&&Number.isFinite(l)||(l=1),a&&Number.isFinite(a)||(a=1),{x:l,y:a}}var tX=tp(0);function tJ(e){let t=tA(e);return tU()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:tX}function t0(e,t,r,n){var i;void 0===t&&(t=!1),void 0===r&&(r=!1);let o=e.getBoundingClientRect(),l=tW(e),a=tp(1);t&&(n?tK(n)&&(a=tZ(n)):a=tZ(e));let s=(void 0===(i=r)&&(i=!1),n&&(!i||n===tA(l))&&i)?tJ(l):tp(0),d=(o.left+s.x)/a.x,u=(o.top+s.y)/a.y,c=o.width/a.x,g=o.height/a.y;if(l){let e=tA(l),t=n&&tK(n)?tA(n):n,r=e,i=r.frameElement;for(;i&&n&&t!==r;){let e=tZ(i),t=i.getBoundingClientRect(),n=tN(i),o=t.left+(i.clientLeft+parseFloat(n.paddingLeft))*e.x,l=t.top+(i.clientTop+parseFloat(n.paddingTop))*e.y;d*=e.x,u*=e.y,c*=e.x,g*=e.y,d+=o,u+=l,i=(r=tA(i)).frameElement}}return tq({width:c,height:g,x:d,y:u})}function t1(e){return t0(tO(e)).left+tV(e).scrollLeft}function t2(e,t,r){let n;if("viewport"===t)n=function(e,t){let r=tA(e),n=tO(e),i=r.visualViewport,o=n.clientWidth,l=n.clientHeight,a=0,s=0;if(i){o=i.width,l=i.height;let e=tU();(!e||e&&"fixed"===t)&&(a=i.offsetLeft,s=i.offsetTop)}return{width:o,height:l,x:a,y:s}}(e,r);else if("document"===t)n=function(e){let t=tO(e),r=tV(e),n=e.ownerDocument.body,i=tc(t.scrollWidth,t.clientWidth,n.scrollWidth,n.clientWidth),o=tc(t.scrollHeight,t.clientHeight,n.scrollHeight,n.clientHeight),l=-r.scrollLeft+t1(e),a=-r.scrollTop;return"rtl"===tN(n).direction&&(l+=tc(t.clientWidth,n.clientWidth)-i),{width:i,height:o,x:l,y:a}}(tO(e));else if(tK(t))n=function(e,t){let r=t0(e,!0,"fixed"===t),n=r.top+e.clientTop,i=r.left+e.clientLeft,o=tP(e)?tZ(e):tp(1),l=e.clientWidth*o.x,a=e.clientHeight*o.y;return{width:l,height:a,x:i*o.x,y:n*o.y}}(t,r);else{let r=tJ(e);n={...t,x:t.x-r.x,y:t.y-r.y}}return tq(n)}function t5(e){return"static"===tN(e).position}function t3(e,t){return tP(e)&&"fixed"!==tN(e).position?t?t(e):e.offsetParent:null}function t4(e,t){let r=tA(e);if(tR(e))return r;if(!tP(e)){let t=tj(e);for(;t&&!tY(t);){if(tK(t)&&!t5(t))return t;t=tj(t)}return r}let n=t3(e,t);for(;n&&["table","td","th"].includes(tz(n))&&t5(n);)n=t3(n,t);return n&&tY(n)&&t5(n)&&!tG(n)?r:n||function(e){let t=tj(e);for(;tP(t)&&!tY(t);){if(tG(t))return t;if(tR(t))break;t=tj(t)}return null}(e)||r}var t6=async function(e){let t=this.getOffsetParent||t4,r=this.getDimensions,n=await r(e.floating);return{reference:function(e,t,r){let n=tP(t),i=tO(t),o="fixed"===r,l=t0(e,!0,o,t),a={scrollLeft:0,scrollTop:0},s=tp(0);if(n||!n&&!o)if(("body"!==tz(t)||tH(i))&&(a=tV(t)),n){let e=t0(t,!0,o,t);s.x=e.x+t.clientLeft,s.y=e.y+t.clientTop}else i&&(s.x=t1(i));return{x:l.left+a.scrollLeft-s.x,y:l.top+a.scrollTop-s.y,width:l.width,height:l.height}}(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:n.width,height:n.height}}},t7={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:r,offsetParent:n,strategy:i}=e,o="fixed"===i,l=tO(n),a=!!t&&tR(t.floating);if(n===l||a&&o)return r;let s={scrollLeft:0,scrollTop:0},d=tp(1),u=tp(0),c=tP(n);if((c||!c&&!o)&&(("body"!==tz(n)||tH(l))&&(s=tV(n)),tP(n))){let e=t0(n);d=tZ(n),u.x=e.x+n.clientLeft,u.y=e.y+n.clientTop}return{width:r.width*d.x,height:r.height*d.y,x:r.x*d.x-s.scrollLeft*d.x+u.x,y:r.y*d.y-s.scrollTop*d.y+u.y}},getDocumentElement:tO,getClippingRect:function(e){let{element:t,boundary:r,rootBoundary:n,strategy:i}=e,o=[..."clippingAncestors"===r?tR(t)?[]:function(e,t){let r=t.get(e);if(r)return r;let n=t_(e,[],!1).filter(e=>tK(e)&&"body"!==tz(e)),i=null,o="fixed"===tN(e).position,l=o?tj(e):e;for(;tK(l)&&!tY(l);){let t=tN(l),r=tG(l);r||"fixed"!==t.position||(i=null),(o?!r&&!i:!r&&"static"===t.position&&!!i&&["absolute","fixed"].includes(i.position)||tH(l)&&!r&&function e(t,r){let n=tj(t);return!(n===r||!tK(n)||tY(n))&&("fixed"===tN(n).position||e(n,r))}(e,l))?n=n.filter(e=>e!==l):i=t,l=tj(l)}return t.set(e,n),n}(t,this._c):[].concat(r),n],l=o[0],a=o.reduce((e,r)=>{let n=t2(t,r,i);return e.top=tc(n.top,e.top),e.right=tu(n.right,e.right),e.bottom=tu(n.bottom,e.bottom),e.left=tc(n.left,e.left),e},t2(t,l,i));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}},getOffsetParent:t4,getElementRects:t6,getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){let{width:t,height:r}=tQ(e);return{width:t,height:r}},getScale:tZ,isElement:tK,isRTL:function(e){return"rtl"===tN(e).direction}},t9=(0,i.q6)();function t8(){let e=(0,i.NT)(t9);if(void 0===e)throw Error("[kobalte]: `usePopperContext` must be used within a `Popper` component");return e}var re=(0,i.vs)('<svg display="block" viewBox="0 0 30 30" style="transform:scale(1.02)"><g><path fill="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z"></path><path stroke="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z">'),rt={top:180,right:-90,bottom:0,left:90};function rr(e){let t=t8(),r=ex({size:30},e),[n,o]=(0,i.rg)(r,["ref","style","size"]),l=()=>t.currentPlacement().split("-")[0],a=function(e){let[t,r]=(0,i.n5)();return(0,i.EH)(()=>{let t=e();t&&r((en(t).defaultView||window).getComputedStyle(t))}),t}(t.contentRef);return(0,i.a0)(eF,(0,i.v6)({as:"div",ref(e){let r=R(t.setArrowRef,n.ref);"function"==typeof r&&r(e)},"aria-hidden":"true",get style(){return Z({position:"absolute","font-size":`${n.size}px`,width:"1em",height:"1em","pointer-events":"none",fill:a()?.getPropertyValue("background-color")||"none",stroke:a()?.getPropertyValue(`border-${l()}-color`)||"none","stroke-width":2*Number.parseInt(a()?.getPropertyValue(`border-${l()}-width`)||"0px")*(30/n.size)},n.style)}},o,{get children(){let e=re(),t=e.firstChild;return(0,i.gb)(()=>(0,i.Bq)(t,"transform",`rotate(${rt[l()]} 15 15) translate(0 2)`)),e}}))}function rn(e){let{x:t=0,y:r=0,width:n=0,height:i=0}=e??{};if("function"==typeof DOMRect)return new DOMRect(t,r,n,i);let o={x:t,y:r,width:n,height:i,top:r,right:t+n,bottom:r+i,left:t};return{...o,toJSON:()=>o}}function ri(e){return/^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(e)}var ro={top:"bottom",right:"left",bottom:"top",left:"right"},rl=Object.assign(function(e){let t=ex({getAnchorRect:e=>e?.getBoundingClientRect(),placement:"bottom",gutter:0,shift:0,flip:!0,slide:!0,overlap:!1,sameWidth:!1,fitViewport:!1,hideWhenDetached:!1,detachedPadding:0,arrowPadding:4,overflowPadding:8},e),[r,n]=(0,i.n5)(),[o,l]=(0,i.n5)(),[a,s]=(0,i.n5)(t.placement),d=()=>{var e,r;return e=t.anchorRef?.(),r=t.getAnchorRect,{contextElement:e,getBoundingClientRect:()=>{let t=r(e);return t?rn(t):e?e.getBoundingClientRect():rn()}}},{direction:u}=eX();async function c(){var e,n,i,l,a;let c,g,f=d(),p=r(),h=o();if(!f||!p)return;let v=(h?.clientHeight||0)/2,y="number"==typeof t.gutter?t.gutter+v:t.gutter??v;p.style.setProperty("--kb-popper-content-overflow-padding",`${t.overflowPadding}px`),f.getBoundingClientRect();let b=[(void 0===(e=({placement:e})=>({mainAxis:y,crossAxis:e.split("-")[1]?void 0:t.shift,alignmentAxis:t.shift}))&&(e=0),{name:"offset",options:e,async fn(t){var r,n;let{x:i,y:o,placement:l,middlewareData:a}=t,s=await tD(t,e);return l===(null==(r=a.offset)?void 0:r.placement)&&null!=(n=a.arrow)&&n.alignmentOffset?{}:{x:i+s.x,y:o+s.y,data:{...s,placement:l}}}})];if(!1!==t.flip){let e="string"==typeof t.flip?t.flip.split(" "):void 0;if(void 0!==e&&!e.every(ri))throw Error("`flip` expects a spaced-delimited list of placements");b.push({name:"flip",options:n={padding:t.overflowPadding,fallbackPlacements:e},async fn(e){var t,r,i,o,l;let{placement:a,middlewareData:s,rects:d,initialPlacement:u,platform:c,elements:g}=e,{mainAxis:f=!0,crossAxis:p=!0,fallbackPlacements:h,fallbackStrategy:v="bestFit",fallbackAxisSideDirection:y="none",flipAlignment:b=!0,...m}=ty(n,e);if(null!=(t=s.arrow)&&t.alignmentOffset)return{};let w=tb(a),x=tk(u),k=tb(u)===u,$=await (null==c.isRTL?void 0:c.isRTL(g.floating)),S=h||(k||!b?[tS(u)]:function(e){let t=tS(e);return[t$(e),t,t$(t)]}(u)),C="none"!==y;!h&&C&&S.push(...function(e,t,r,n){let i=tm(e),o=function(e,t,r){let n=["left","right"],i=["right","left"];switch(e){case"top":case"bottom":if(r)return t?i:n;return t?n:i;case"left":case"right":return t?["top","bottom"]:["bottom","top"];default:return[]}}(tb(e),"start"===r,n);return i&&(o=o.map(e=>e+"-"+i),t&&(o=o.concat(o.map(t$)))),o}(u,b,y,$));let q=[u,...S],E=await tM(e,m),T=[],M=(null==(r=s.flip)?void 0:r.overflows)||[];if(f&&T.push(E[w]),p){let e=function(e,t,r){void 0===r&&(r=!1);let n=tm(e),i=tw(tk(e)),o=tx(i),l="x"===i?n===(r?"end":"start")?"right":"left":"start"===n?"bottom":"top";return t.reference[o]>t.floating[o]&&(l=tS(l)),[l,tS(l)]}(a,d,$);T.push(E[e[0]],E[e[1]])}if(M=[...M,{placement:a,overflows:T}],!T.every(e=>e<=0)){let e=((null==(i=s.flip)?void 0:i.index)||0)+1,t=q[e];if(t)return{data:{index:e,overflows:M},reset:{placement:t}};let r=null==(o=M.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:o.placement;if(!r)switch(v){case"bestFit":{let e=null==(l=M.filter(e=>{if(C){let t=tk(e.placement);return t===x||"y"===t}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:l[0];e&&(r=e);break}case"initialPlacement":r=u}if(a!==r)return{reset:{placement:r}}}return{}}})}(t.slide||t.overlap)&&b.push({name:"shift",options:i={mainAxis:t.slide,crossAxis:t.overlap,padding:t.overflowPadding},async fn(e){let{x:t,y:r,placement:n}=e,{mainAxis:o=!0,crossAxis:l=!1,limiter:a={fn:e=>{let{x:t,y:r}=e;return{x:t,y:r}}},...s}=ty(i,e),d={x:t,y:r},u=await tM(e,s),c=tk(tb(n)),g=tw(c),f=d[g],p=d[c];if(o){let e="y"===g?"top":"left",t="y"===g?"bottom":"right",r=f+u[e],n=f-u[t];f=tc(r,tu(f,n))}if(l){let e="y"===c?"top":"left",t="y"===c?"bottom":"right",r=p+u[e],n=p-u[t];p=tc(r,tu(p,n))}let h=a.fn({...e,[g]:f,[c]:p});return{...h,data:{x:h.x-t,y:h.y-r}}}}),b.push({name:"size",options:l={padding:t.overflowPadding,apply({availableWidth:e,availableHeight:r,rects:n}){let i=Math.round(n.reference.width);e=Math.floor(e),r=Math.floor(r),p.style.setProperty("--kb-popper-anchor-width",`${i}px`),p.style.setProperty("--kb-popper-content-available-width",`${e}px`),p.style.setProperty("--kb-popper-content-available-height",`${r}px`),t.sameWidth&&(p.style.width=`${i}px`),t.fitViewport&&(p.style.maxWidth=`${e}px`,p.style.maxHeight=`${r}px`)}},async fn(e){let t,r,{placement:n,rects:i,platform:o,elements:a}=e,{apply:s=()=>{},...d}=ty(l,e),u=await tM(e,d),c=tb(n),g=tm(n),f="y"===tk(n),{width:p,height:h}=i.floating;"top"===c||"bottom"===c?(t=c,r=g===(await (null==o.isRTL?void 0:o.isRTL(a.floating))?"start":"end")?"left":"right"):(r=c,t="end"===g?"top":"bottom");let v=h-u.top-u.bottom,y=p-u.left-u.right,b=tu(h-u[t],v),m=tu(p-u[r],y),w=!e.middlewareData.shift,x=b,k=m;if(f?k=g||w?tu(m,y):y:x=g||w?tu(b,v):v,w&&!g){let e=tc(u.left,0),t=tc(u.right,0),r=tc(u.top,0),n=tc(u.bottom,0);f?k=p-2*(0!==e||0!==t?e+t:tc(u.left,u.right)):x=h-2*(0!==r||0!==n?r+n:tc(u.top,u.bottom))}await s({...e,availableWidth:k,availableHeight:x});let $=await o.getDimensions(a.floating);return p!==$.width||h!==$.height?{reset:{rects:!0}}:{}}}),t.hideWhenDetached&&b.push({name:"hide",options:a={padding:t.detachedPadding},async fn(e){let{rects:t}=e,{strategy:r="referenceHidden",...n}=ty(a,e);switch(r){case"referenceHidden":{let r=tL(await tM(e,{...n,elementContext:"reference"}),t.reference);return{data:{referenceHiddenOffsets:r,referenceHidden:tF(r)}}}case"escaped":{let r=tL(await tM(e,{...n,altBoundary:!0}),t.floating);return{data:{escapedOffsets:r,escaped:tF(r)}}}default:return{}}}}),h&&b.push({name:"arrow",options:g={element:h,padding:t.arrowPadding},async fn(e){let{x:t,y:r,placement:n,rects:i,platform:o,elements:l,middlewareData:a}=e,{element:s,padding:d=0}=ty(g,e)||{};if(null==s)return{};let u=tC(d),c={x:t,y:r},f=tw(tk(n)),p=tx(f),h=await o.getDimensions(s),v="y"===f,y=v?"clientHeight":"clientWidth",b=i.reference[p]+i.reference[f]-c[f]-i.floating[p],m=c[f]-i.reference[f],w=await (null==o.getOffsetParent?void 0:o.getOffsetParent(s)),x=w?w[y]:0;x&&await (null==o.isElement?void 0:o.isElement(w))||(x=l.floating[y]||i.floating[p]);let k=x/2-h[p]/2-1,$=tu(u[v?"top":"left"],k),S=tu(u[v?"bottom":"right"],k),C=x-h[p]-S,q=x/2-h[p]/2+(b/2-m/2),E=tc($,tu(q,C)),T=!a.arrow&&null!=tm(n)&&q!==E&&i.reference[p]/2-(q<$?$:S)-h[p]/2<0,M=T?q<$?q-$:q-C:0;return{[f]:c[f]+M,data:{[f]:E,centerOffset:q-E-M,...T&&{alignmentOffset:M}},reset:T}}});let m=await ((e,t,r)=>{let n=new Map,i={platform:t7,...r},o={...i.platform,_c:n};return tT(e,t,{...i,platform:o})})(f,p,{placement:t.placement,strategy:"absolute",middleware:b,platform:{...t7,isRTL:()=>"rtl"===u()}});if(s(m.placement),t.onCurrentPlacementChange?.(m.placement),!p)return;p.style.setProperty("--kb-popper-content-transform-origin",function(e,t){let[r,n]=e.split("-"),i=ro[r];return n?"left"===r||"right"===r?`${i} ${"start"===n?"top":"bottom"}`:"start"===n?`${i} ${"rtl"===t?"right":"left"}`:`${i} ${"rtl"===t?"left":"right"}`:`${i} center`}(m.placement,u()));let w=Math.round(m.x),x=Math.round(m.y);if(t.hideWhenDetached&&(c=m.middlewareData.hide?.referenceHidden?"hidden":"visible"),Object.assign(p.style,{top:"0",left:"0",transform:`translate3d(${w}px, ${x}px, 0)`,visibility:c}),h&&m.middlewareData.arrow){let{x:e,y:t}=m.middlewareData.arrow,r=m.placement.split("-")[0];Object.assign(h.style,{left:null!=e?`${e}px`:"",top:null!=t?`${t}px`:"",[r]:"100%"})}}return(0,i.EH)(()=>{let e=d(),t=r();if(!e||!t)return;let n=function(e,t,r,n){let i;void 0===n&&(n={});let{ancestorScroll:o=!0,ancestorResize:l=!0,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:d=!1}=n,u=tW(e),c=o||l?[...u?t_(u):[],...t_(t)]:[];c.forEach(e=>{o&&e.addEventListener("scroll",r,{passive:!0}),l&&e.addEventListener("resize",r)});let g=u&&s?function(e,t){let r,n=null,i=tO(e);function o(){var e;clearTimeout(r),null==(e=n)||e.disconnect(),n=null}return!function l(a,s){void 0===a&&(a=!1),void 0===s&&(s=1),o();let{left:d,top:u,width:c,height:g}=e.getBoundingClientRect();if(a||t(),!c||!g)return;let f=tf(u),p=tf(i.clientWidth-(d+c)),h={rootMargin:-f+"px "+-p+"px "+-tf(i.clientHeight-(u+g))+"px "+-tf(d)+"px",threshold:tc(0,tu(1,s))||1},v=!0;function y(e){let t=e[0].intersectionRatio;if(t!==s){if(!v)return l();t?l(!1,t):r=setTimeout(()=>{l(!1,1e-7)},1e3)}v=!1}try{n=new IntersectionObserver(y,{...h,root:i.ownerDocument})}catch(e){n=new IntersectionObserver(y,h)}n.observe(e)}(!0),o}(u,r):null,f=-1,p=null;a&&(p=new ResizeObserver(e=>{let[n]=e;n&&n.target===u&&p&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;null==(e=p)||e.observe(t)})),r()}),u&&!d&&p.observe(u),p.observe(t));let h=d?t0(e):null;return d&&function t(){let n=t0(e);h&&(n.x!==h.x||n.y!==h.y||n.width!==h.width||n.height!==h.height)&&r(),h=n,i=requestAnimationFrame(t)}(),r(),()=>{var e;c.forEach(e=>{o&&e.removeEventListener("scroll",r),l&&e.removeEventListener("resize",r)}),null==g||g(),null==(e=p)||e.disconnect(),p=null,d&&cancelAnimationFrame(i)}}(e,t,c,{elementResize:"function"==typeof ResizeObserver});(0,i.Ki)(n)}),(0,i.EH)(()=>{let e=r(),n=t.contentRef?.();e&&n&&queueMicrotask(()=>{e.style.zIndex=getComputedStyle(n).zIndex})}),(0,i.a0)(t9.Provider,{value:{currentPlacement:a,contentRef:()=>t.contentRef?.(),setPositionerRef:n,setArrowRef:l},get children(){return t.children}})},{Arrow:rr,Context:t9,usePopperContext:t8,Positioner:function(e){let t=t8(),[r,n]=(0,i.rg)(e,["ref","style"]);return(0,i.a0)(eF,(0,i.v6)({as:"div",ref(e){let n=R(t.setPositionerRef,r.ref);"function"==typeof n&&n(e)},"data-popper-positioner":"",get style(){return Z({position:"absolute",top:0,left:0,"min-width":"max-content"},r.style)}},n))}}),ra="interactOutside.pointerDownOutside",rs="interactOutside.focusOutside",rd=(0,i.q6)();function ru(e){let t,r=(0,i.NT)(rd),[n,o]=(0,i.rg)(e,["ref","disableOutsidePointerEvents","excludedElements","onEscapeKeyDown","onPointerDownOutside","onFocusOutside","onInteractOutside","onDismiss","bypassTopMostLayerCheck"]),l=new Set([]);!function(e,t){let r,n=ew,o=()=>en(t()),l=t=>e.onPointerDownOutside?.(t),a=t=>e.onFocusOutside?.(t),d=t=>e.onInteractOutside?.(t),u=r=>{let n=r.target;return!(!(n instanceof HTMLElement)||n.closest(`[${e9}]`)||!et(o(),n)||et(t(),n))&&!e.shouldExcludeElement?.(n)},c=e=>{function r(){let r=t(),n=e.target;if(!r||!n||!u(e))return;let i=ed([l,d]);n.addEventListener(ra,i,{once:!0});let o=new CustomEvent(ra,{bubbles:!1,cancelable:!0,detail:{originalEvent:e,isContextMenu:2===e.button||(ea()?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey)&&0===e.button}});n.dispatchEvent(o)}"touch"===e.pointerType?(o().removeEventListener("click",r),n=r,o().addEventListener("click",r,{once:!0})):r()},g=e=>{let r=t(),n=e.target;if(!r||!n||!u(e))return;let i=ed([a,d]);n.addEventListener(rs,i,{once:!0});let o=new CustomEvent(rs,{bubbles:!1,cancelable:!0,detail:{originalEvent:e,isContextMenu:!1}});n.dispatchEvent(o)};(0,i.EH)(()=>{!i.S$&&(s(e.isDisabled)||(r=window.setTimeout(()=>{o().addEventListener("pointerdown",c,!0)},0),o().addEventListener("focusin",g,!0),(0,i.Ki)(()=>{window.clearTimeout(r),o().removeEventListener("click",n),o().removeEventListener("pointerdown",c,!0),o().removeEventListener("focusin",g,!0)})))})}({shouldExcludeElement:e=>!!t&&(n.excludedElements?.some(t=>et(t(),e))||[...l].some(t=>et(t,e))),onPointerDownOutside:e=>{!(!t||to.isBelowPointerBlockingLayer(t))&&(n.bypassTopMostLayerCheck||to.isTopMostLayer(t))&&(n.onPointerDownOutside?.(e),n.onInteractOutside?.(e),e.defaultPrevented||n.onDismiss?.())},onFocusOutside:e=>{n.onFocusOutside?.(e),n.onInteractOutside?.(e),e.defaultPrevented||n.onDismiss?.()}},()=>t);var a={ownerDocument:()=>en(t),onEscapeKeyDown:e=>{t&&to.isTopMostLayer(t)&&(n.onEscapeKeyDown?.(e),!e.defaultPrevented&&n.onDismiss&&(e.preventDefault(),n.onDismiss()))}};let d=e=>{e.key===eo.Escape&&a.onEscapeKeyDown?.(e)};return(0,i.EH)(()=>{if(i.S$||s(a.isDisabled))return;let e=a.ownerDocument?.()??en();e.addEventListener("keydown",d),(0,i.Ki)(()=>{e.removeEventListener("keydown",d)})}),(0,i.Rc)(()=>{if(!t)return;to.addLayer({node:t,isPointerBlocking:n.disableOutsidePointerEvents,dismiss:n.onDismiss});let e=r?.registerNestedLayer(t);to.assignPointerEventToLayers(),to.disableBodyPointerEvents(t),(0,i.Ki)(()=>{t&&(to.removeLayer(t),e?.(),to.assignPointerEventToLayers(),to.restoreBodyPointerEvents(t))})}),(0,i.EH)((0,i.on)([()=>t,()=>n.disableOutsidePointerEvents],([e,t])=>{if(!e)return;let r=to.find(e);r&&r.isPointerBlocking!==t&&(r.isPointerBlocking=t,to.assignPointerEventToLayers()),t&&to.disableBodyPointerEvents(e),(0,i.Ki)(()=>{to.restoreBodyPointerEvents(e)})},{defer:!0})),(0,i.a0)(rd.Provider,{value:{registerNestedLayer:e=>{l.add(e);let t=r?.registerNestedLayer(e);return()=>{l.delete(e),t?.()}}},get children(){return(0,i.a0)(eF,(0,i.v6)({as:"div",ref(e){let r=R(e=>t=e,n.ref);"function"==typeof r&&r(e)}},o))}})}function rc(e={}){let[t,r]=eB({value:()=>s(e.open),defaultValue:()=>!!s(e.defaultOpen),onChange:t=>e.onOpenChange?.(t)}),n=()=>{r(!0)},i=()=>{r(!1)};return{isOpen:t,setIsOpen:r,open:n,close:i,toggle:()=>{t()?i():n()}}}var rg={};eR(rg,{Description:()=>eO,ErrorMessage:()=>eI,Item:()=>ry,ItemControl:()=>rb,ItemDescription:()=>rm,ItemIndicator:()=>rw,ItemInput:()=>rx,ItemLabel:()=>rk,Label:()=>r$,RadioGroup:()=>rC,Root:()=>rS});var rf=(0,i.q6)();function rp(){let e=(0,i.NT)(rf);if(void 0===e)throw Error("[kobalte]: `useRadioGroupContext` must be used within a `RadioGroup` component");return e}var rh=(0,i.q6)();function rv(){let e=(0,i.NT)(rh);if(void 0===e)throw Error("[kobalte]: `useRadioGroupItemContext` must be used within a `RadioGroup.Item` component");return e}function ry(e){let t=eA(),r=rp(),n=ex({id:`${t.generateId("item")}-${(0,i.Ds)()}`},e),[o,l]=(0,i.rg)(n,["value","disabled","onPointerDown"]),[a,s]=(0,i.n5)(),[d,u]=(0,i.n5)(),[c,g]=(0,i.n5)(),[f,p]=(0,i.n5)(),[h,v]=(0,i.n5)(!1),y=(0,i.To)(()=>r.isSelectedValue(o.value)),b=(0,i.To)(()=>o.disabled||t.isDisabled()||!1),m=e=>{es(e,o.onPointerDown),h()&&e.preventDefault()},w=(0,i.To)(()=>({...t.dataset(),"data-disabled":b()?"":void 0,"data-checked":y()?"":void 0})),x={value:()=>o.value,dataset:w,isSelected:y,isDisabled:b,inputId:a,labelId:d,descriptionId:c,inputRef:f,select:()=>r.setSelectedValue(o.value),generateId:ee(()=>l.id),registerInput:eT(s),registerLabel:eT(u),registerDescription:eT(g),setIsFocused:v,setInputRef:p};return(0,i.a0)(rh.Provider,{value:x,get children(){return(0,i.a0)(eF,(0,i.v6)({as:"div",role:"group",onPointerDown:m},w,l))}})}function rb(e){let t=rv(),r=ex({id:t.generateId("control")},e),[n,o]=(0,i.rg)(r,["onClick","onKeyDown"]);return(0,i.a0)(eF,(0,i.v6)({as:"div",onClick:e=>{es(e,n.onClick),t.select(),t.inputRef()?.focus()},onKeyDown:e=>{es(e,n.onKeyDown),e.key===eo.Space&&(t.select(),t.inputRef()?.focus())}},()=>t.dataset(),o))}function rm(e){let t=rv(),r=ex({id:t.generateId("description")},e);return(0,i.EH)(()=>(0,i.Ki)(t.registerDescription(r.id))),(0,i.a0)(eF,(0,i.v6)({as:"div"},()=>t.dataset(),r))}function rw(e){let t=rv(),r=ex({id:t.generateId("indicator")},e),[n,o]=(0,i.rg)(r,["ref","forceMount"]),[l,a]=(0,i.n5)(),{present:s}=e7({show:()=>n.forceMount||t.isSelected(),element:()=>l()??null});return(0,i.a0)(i.wv,{get when(){return s()},get children(){return(0,i.a0)(eF,(0,i.v6)({as:"div",ref(e){let t=R(a,n.ref);"function"==typeof t&&t(e)}},()=>t.dataset(),o))}})}function rx(e){let t=eA(),r=rp(),n=rv(),o=ex({id:n.generateId("input")},e),[l,a]=(0,i.rg)(o,["ref","style","aria-labelledby","aria-describedby","onChange","onFocus","onBlur"]),[s,d]=(0,i.n5)(!1);return(0,i.EH)((0,i.on)([()=>n.isSelected(),()=>n.value()],e=>{if(!e[0]&&e[1]===n.value())return;d(!0);let t=n.inputRef();t?.dispatchEvent(new Event("input",{bubbles:!0,cancelable:!0})),t?.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0}))},{defer:!0})),(0,i.EH)(()=>(0,i.Ki)(n.registerInput(a.id))),(0,i.a0)(eF,(0,i.v6)({as:"input",ref(e){let t=R(n.setInputRef,l.ref);"function"==typeof t&&t(e)},type:"radio",get name(){return t.name()},get value(){return n.value()},get checked(){return n.isSelected()},get required(){return t.isRequired()},get disabled(){return n.isDisabled()},get readonly(){return t.isReadOnly()},get style(){return Z({...eE},l.style)},get"aria-labelledby"(){return[l["aria-labelledby"],n.labelId(),null!=l["aria-labelledby"]&&null!=a["aria-label"]?a.id:void 0].filter(Boolean).join(" ")||void 0},get"aria-describedby"(){return[l["aria-describedby"],n.descriptionId(),r.ariaDescribedBy()].filter(Boolean).join(" ")||void 0},onChange:e=>{es(e,l.onChange),e.stopPropagation(),s()||(r.setSelectedValue(n.value()),e.target.checked=n.isSelected()),d(!1)},onFocus:e=>{es(e,l.onFocus),n.setIsFocused(!0)},onBlur:e=>{es(e,l.onBlur),n.setIsFocused(!1)}},()=>n.dataset(),a))}function rk(e){let t=rv(),r=ex({id:t.generateId("label")},e);return(0,i.EH)(()=>(0,i.Ki)(t.registerLabel(r.id))),(0,i.a0)(eF,(0,i.v6)({as:"label",get for(){return t.inputId()}},()=>t.dataset(),r))}function r$(e){return(0,i.a0)(eK,(0,i.v6)({as:"span"},e))}function rS(e){var t;let r,n=ex({id:`radiogroup-${(0,i.Ds)()}`,orientation:"vertical"},e),[o,l,a]=(0,i.rg)(n,["ref","value","defaultValue","onChange","orientation","aria-labelledby","aria-describedby"],eD),[d,u]=eP({value:()=>o.value,defaultValue:()=>o.defaultValue,onChange:e=>o.onChange?.(e)}),{formControlContext:c}=function(e){let t=ex({id:`form-control-${(0,i.Ds)()}`},e),[r,n]=(0,i.n5)(),[o,l]=(0,i.n5)(),[a,d]=(0,i.n5)(),[u,c]=(0,i.n5)();return{formControlContext:{name:()=>s(t.name)??s(t.id),dataset:(0,i.To)(()=>({"data-valid":"valid"===s(t.validationState)?"":void 0,"data-invalid":"invalid"===s(t.validationState)?"":void 0,"data-required":s(t.required)?"":void 0,"data-disabled":s(t.disabled)?"":void 0,"data-readonly":s(t.readOnly)?"":void 0})),validationState:()=>s(t.validationState),isRequired:()=>s(t.required),isDisabled:()=>s(t.disabled),isReadOnly:()=>s(t.readOnly),labelId:r,fieldId:o,descriptionId:a,errorMessageId:u,getAriaLabelledBy:(e,t,n)=>{let i=null!=n||null!=r();return[n,r(),i&&null!=t?e:void 0].filter(Boolean).join(" ")||void 0},getAriaDescribedBy:e=>[a(),u(),e].filter(Boolean).join(" ")||void 0,generateId:ee(()=>s(t.id)),registerLabel:eT(n),registerField:eT(l),registerDescription:eT(d),registerErrorMessage:eT(c)}}}(l);t=()=>u(o.defaultValue??""),(0,i.EH)((0,i.on)(()=>r,e=>{var r;if(null==e)return;let n=(r=e).matches("textarea, input, select, button")?r.form:r.closest("form");null!=n&&(n.addEventListener("reset",t,{passive:!0}),(0,i.Ki)(()=>{n.removeEventListener("reset",t)}))}));let g=()=>c.getAriaDescribedBy(o["aria-describedby"]),f=e=>e===d(),p={ariaDescribedBy:g,isSelectedValue:f,setSelectedValue:e=>{if(!(c.isReadOnly()||c.isDisabled())&&(u(e),r))for(let e of r.querySelectorAll("[type='radio']"))e.checked=f(e.value)}};return(0,i.a0)(ez.Provider,{value:c,get children(){return(0,i.a0)(rf.Provider,{value:p,get children(){return(0,i.a0)(eF,(0,i.v6)({as:"div",ref(e){let t=R(e=>r=e,o.ref);"function"==typeof t&&t(e)},role:"radiogroup",get id(){return s(l.id)},get"aria-invalid"(){return"invalid"===c.validationState()||void 0},get"aria-required"(){return c.isRequired()||void 0},get"aria-disabled"(){return c.isDisabled()||void 0},get"aria-readonly"(){return c.isReadOnly()||void 0},get"aria-orientation"(){return o.orientation},get"aria-labelledby"(){return c.getAriaLabelledBy(s(l.id),a["aria-label"],o["aria-labelledby"])},get"aria-describedby"(){return g()}},()=>c.dataset(),a))}})}})}var rC=Object.assign(rS,{Description:eO,ErrorMessage:eI,Item:ry,ItemControl:rb,ItemDescription:rm,ItemIndicator:rw,ItemInput:rx,ItemLabel:rk,Label:r$}),rq=class{collection;ref;collator;constructor(e,t,r){this.collection=e,this.ref=t,this.collator=r}getKeyBelow(e){let t=this.collection().getKeyAfter(e);for(;null!=t;){let e=this.collection().getItem(t);if(e&&"item"===e.type&&!e.disabled)return t;t=this.collection().getKeyAfter(t)}}getKeyAbove(e){let t=this.collection().getKeyBefore(e);for(;null!=t;){let e=this.collection().getItem(t);if(e&&"item"===e.type&&!e.disabled)return t;t=this.collection().getKeyBefore(t)}}getFirstKey(){let e=this.collection().getFirstKey();for(;null!=e;){let t=this.collection().getItem(e);if(t&&"item"===t.type&&!t.disabled)return e;e=this.collection().getKeyAfter(e)}}getLastKey(){let e=this.collection().getLastKey();for(;null!=e;){let t=this.collection().getItem(e);if(t&&"item"===t.type&&!t.disabled)return e;e=this.collection().getKeyBefore(e)}}getItem(e){return this.ref?.()?.querySelector(`[data-key="${e}"]`)??null}getKeyPageAbove(e){let t=this.ref?.(),r=this.getItem(e);if(!t||!r)return;let n=Math.max(0,r.offsetTop+r.offsetHeight-t.offsetHeight),i=e;for(;i&&r&&r.offsetTop>n;)r=null!=(i=this.getKeyAbove(i))?this.getItem(i):null;return i}getKeyPageBelow(e){let t=this.ref?.(),r=this.getItem(e);if(!t||!r)return;let n=Math.min(t.scrollHeight,r.offsetTop-r.offsetHeight+t.offsetHeight),i=e;for(;i&&r&&r.offsetTop<n;)r=null!=(i=this.getKeyBelow(i))?this.getItem(i):null;return i}getKeyForSearch(e,t){let r=this.collator?.();if(!r)return;let n=null!=t?this.getKeyBelow(t):this.getFirstKey();for(;null!=n;){let t=this.collection().getItem(n);if(t){let i=t.textValue.slice(0,e.length);if(t.textValue&&0===r.compare(i,e))return n}n=this.getKeyBelow(n)}}},rE="focusScope.autoFocusOnMount",rT="focusScope.autoFocusOnUnmount",rM={bubbles:!1,cancelable:!0},rL={stack:[],active(){return this.stack[0]},add(e){e!==this.active()&&this.active()?.pause(),this.stack=X(this.stack,e),this.stack.unshift(e)},remove(e){this.stack=X(this.stack,e),this.active()?.resume()}},rF=new WeakMap,rD=[],rz=new Map,rA=e=>{(0,i.EH)(()=>{let t=e6(e.style)??{},r=e6(e.properties)??[],n={};for(let r in t)n[r]=e.element.style[r];let o=rz.get(e.key);for(let t of(o?o.activeCount++:rz.set(e.key,{activeCount:1,originalStyles:n,properties:r.map(e=>e.key)}),Object.assign(e.element.style,e.style),r))e.element.style.setProperty(t.key,t.value);(0,i.Ki)(()=>{let t=rz.get(e.key);if(t){if(1!==t.activeCount)return void t.activeCount--;for(let[r,n]of(rz.delete(e.key),Object.entries(t.originalStyles)))e.element.style[r]=n;for(let r of t.properties)e.element.style.removeProperty(r);0===e.element.style.length&&e.element.removeAttribute("style"),e.cleanup?.()}})})},rO=(e,t)=>{switch(t){case"x":return[e.clientWidth,e.scrollLeft,e.scrollWidth];case"y":return[e.clientHeight,e.scrollTop,e.scrollHeight]}},rI=(e,t)=>{let r=getComputedStyle(e),n="x"===t?r.overflowX:r.overflowY;return"auto"===n||"scroll"===n||"HTML"===e.tagName&&"visible"===n},[rK,rP]=(0,i.n5)([]),rB=e=>e.changedTouches[0]?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0],rH=(e,t,r,n)=>{let i=null!==n&&rR(n,e),[o,l]=((e,t,r)=>{let n="x"===t&&"rtl"===window.getComputedStyle(e).direction?-1:1,i=e,o=0,l=0,a=!1;do{let[e,s,d]=rO(i,t),u=d-e-n*s;(0!==s||0!==u)&&rI(i,t)&&(o+=u,l+=s),i===(r??document.documentElement)?a=!0:i=i._$host??i.parentElement}while(i&&!a);return[o,l]})(e,t,i?n:void 0);return!(r>0&&1>=Math.abs(o)||r<0&&1>Math.abs(l))},rR=(e,t)=>{if(e.contains(t))return!0;let r=t;for(;r;){if(r===e)return!0;r=r._$host??r.parentElement}return!1},rG=(0,i.q6)();function rU(){let e=(0,i.NT)(rG);if(void 0===e)throw Error("[kobalte]: `useMenuContext` must be used within a `Menu` component");return e}var rY=(0,i.q6)();function rN(){let e=(0,i.NT)(rY);if(void 0===e)throw Error("[kobalte]: `useMenuItemContext` must be used within a `Menu.Item` component");return e}var rV=(0,i.q6)();function rj(){let e=(0,i.NT)(rV);if(void 0===e)throw Error("[kobalte]: `useMenuRootContext` must be used within a `MenuRoot` component");return e}function r_(e){let t,r=rj(),n=rU(),o=ex({id:r.generateId(`item-${(0,i.Ds)()}`)},e),[l,a]=(0,i.rg)(o,["ref","textValue","disabled","closeOnSelect","checked","indeterminate","onSelect","onPointerMove","onPointerLeave","onPointerDown","onPointerUp","onClick","onKeyDown","onMouseDown","onFocus"]),[s,d]=(0,i.n5)(),[u,c]=(0,i.n5)(),[g,f]=(0,i.n5)(),p=()=>n.listState().selectionManager(),h=()=>a.id,v=()=>{l.onSelect?.(),l.closeOnSelect&&setTimeout(()=>{n.close(!0)})},y=function(){let e=(0,i.NT)(eG);if(void 0===e)throw Error("[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component");return e}(),b=ex({shouldRegisterItem:!0},{getItem:()=>({ref:()=>t,type:"item",key:h(),textValue:l.textValue??g()?.textContent??t?.textContent??"",disabled:l.disabled??!1})});(0,i.EH)(()=>{if(!b.shouldRegisterItem)return;let e=y.registerItem(b.getItem());(0,i.Ki)(e)});let m=e5({key:h,selectionManager:p,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>l.disabled},()=>t),w=e=>{es(e,l.onPointerMove),"mouse"===e.pointerType&&(l.disabled?n.onItemLeave(e):(n.onItemEnter(e),e.defaultPrevented||(eu(e.currentTarget),n.listState().selectionManager().setFocused(!0),n.listState().selectionManager().setFocusedKey(h()))))},x=e=>{es(e,l.onPointerLeave),"mouse"===e.pointerType&&n.onItemLeave(e)},k=e=>{es(e,l.onPointerUp),l.disabled||0!==e.button||v()},$=e=>{if((es(e,l.onKeyDown),!e.repeat)&&!l.disabled)switch(e.key){case"Enter":case" ":v()}},S=(0,i.To)(()=>l.indeterminate?"mixed":null!=l.checked?l.checked:void 0),C=(0,i.To)(()=>({"data-indeterminate":l.indeterminate?"":void 0,"data-checked":l.checked&&!l.indeterminate?"":void 0,"data-disabled":l.disabled?"":void 0,"data-highlighted":p().focusedKey()===h()?"":void 0})),q={isChecked:()=>l.checked,dataset:C,setLabelRef:f,generateId:ee(()=>a.id),registerLabel:eT(d),registerDescription:eT(c)};return(0,i.a0)(rY.Provider,{value:q,get children(){return(0,i.a0)(eF,(0,i.v6)({as:"div",ref(e){let r=R(e=>t=e,l.ref);"function"==typeof r&&r(e)},get tabIndex(){return m.tabIndex()},get"aria-checked"(){return S()},get"aria-disabled"(){return l.disabled},get"aria-labelledby"(){return s()},get"aria-describedby"(){return u()},get"data-key"(){return m.dataKey()},get onPointerDown(){return ed([l.onPointerDown,m.onPointerDown])},get onPointerUp(){return ed([k,m.onPointerUp])},get onClick(){return ed([l.onClick,m.onClick])},get onKeyDown(){return ed([$,m.onKeyDown])},get onMouseDown(){return ed([l.onMouseDown,m.onMouseDown])},get onFocus(){return ed([l.onFocus,m.onFocus])},onPointerMove:w,onPointerLeave:x},C,a))}})}function rQ(e){let t=ex({closeOnSelect:!1},e),[r,n]=(0,i.rg)(t,["checked","defaultChecked","onChange","onSelect"]),o=function(e={}){let[t,r]=eB({value:()=>s(e.isSelected),defaultValue:()=>!!s(e.defaultIsSelected),onChange:t=>e.onSelectedChange?.(t)});return{isSelected:t,setIsSelected:t=>{s(e.isReadOnly)||s(e.isDisabled)||r(t)},toggle:()=>{s(e.isReadOnly)||s(e.isDisabled)||r(!t())}}}({isSelected:()=>r.checked,defaultIsSelected:()=>r.defaultChecked,onSelectedChange:e=>r.onChange?.(e),isDisabled:()=>n.disabled});return(0,i.a0)(r_,(0,i.v6)({role:"menuitemcheckbox",get checked(){return o.isSelected()},onSelect:()=>{r.onSelect?.(),o.toggle()}},n))}var rW=(0,i.q6)();function rZ(){return(0,i.NT)(rW)}var rX={next:(e,t)=>"ltr"===e?"horizontal"===t?"ArrowRight":"ArrowDown":"horizontal"===t?"ArrowLeft":"ArrowUp",previous:(e,t)=>rX.next("ltr"===e?"rtl":"ltr",t)},rJ={first:e=>"horizontal"===e?"ArrowDown":"ArrowRight",last:e=>"horizontal"===e?"ArrowUp":"ArrowLeft"};function r0(e){let t=rj(),r=rU(),n=rZ(),{direction:o}=eX(),l=ex({id:t.generateId("trigger")},e),[a,s]=(0,i.rg)(l,["ref","id","disabled","onPointerDown","onClick","onKeyDown","onMouseOver","onFocus"]),d=()=>t.value();void 0!==n&&(d=()=>t.value()??a.id,void 0===n.lastValue()&&n.setLastValue(d));let u=eM(()=>r.triggerRef(),()=>"button"),c=(0,i.To)(()=>"a"===u()&&r.triggerRef()?.getAttribute("href")!=null);(0,i.EH)((0,i.on)(()=>n?.value(),e=>{c()&&e===d()&&r.triggerRef()?.focus()}));let g=()=>{void 0!==n?r.isOpen()?n.value()===d()&&n.closeMenu():(n.autoFocusMenu()||n.setAutoFocusMenu(!0),r.open(!1)):r.toggle(!0)};return(0,i.EH)(()=>(0,i.Ki)(r.registerTriggerId(a.id))),(0,i.a0)(ta,(0,i.v6)({ref(e){let t=R(r.setTriggerRef,a.ref);"function"==typeof t&&t(e)},get"data-kb-menu-value-trigger"(){return t.value()},get id(){return a.id},get disabled(){return a.disabled},"aria-haspopup":"true",get"aria-expanded"(){return r.isOpen()},get"aria-controls"(){return(0,i.ph)(()=>!!r.isOpen())()?r.contentId():void 0},get"data-highlighted"(){return void 0!==d()&&n?.value()===d()||void 0},get tabIndex(){return void 0!==n?n.value()===d()||n.lastValue()===d()?0:-1:void 0},onPointerDown:e=>{es(e,a.onPointerDown),e.currentTarget.dataset.pointerType=e.pointerType,a.disabled||"touch"===e.pointerType||0!==e.button||g()},onMouseOver:e=>{es(e,a.onMouseOver),r.triggerRef()?.dataset.pointerType!=="touch"&&(a.disabled||void 0===n||void 0===n.value()||n.setValue(d))},onClick:e=>{es(e,a.onClick),a.disabled||"touch"!==e.currentTarget.dataset.pointerType||g()},onKeyDown:e=>{if(es(e,a.onKeyDown),!a.disabled){if(c())switch(e.key){case"Enter":case" ":return}switch(e.key){case"Enter":case" ":case rJ.first(t.orientation()):e.stopPropagation(),e.preventDefault(),function(e,t){if(document.contains(e)){let t=document.scrollingElement||document.documentElement;if("hidden"===window.getComputedStyle(t).overflow){let r=em(e);for(;e&&r&&e!==t&&r!==t;)eC(r,e),r=em(e=r)}else{let{left:t,top:r}=e.getBoundingClientRect();e?.scrollIntoView?.({block:"nearest"});let{left:n,top:i}=e.getBoundingClientRect();(Math.abs(t-n)>1||Math.abs(r-i)>1)&&e.scrollIntoView?.({block:"nearest"})}}}(e.currentTarget),r.open("first"),n?.setAutoFocusMenu(!0),n?.setValue(d);break;case rJ.last(t.orientation()):e.stopPropagation(),e.preventDefault(),r.open("last");break;case rX.next(o(),t.orientation()):if(void 0===n)break;e.stopPropagation(),e.preventDefault(),n.nextMenu();break;case rX.previous(o(),t.orientation()):if(void 0===n)break;e.stopPropagation(),e.preventDefault(),n.previousMenu()}}},onFocus:e=>{es(e,a.onFocus),void 0!==n&&"touch"!==e.currentTarget.dataset.pointerType&&n.setValue(d)},role:void 0!==n?"menuitem":void 0},()=>r.dataset(),s))}var r1=(0,i.q6)();function r2(e){let t,r=rj(),n=rU(),o=rZ(),l=(0,i.NT)(r1),{direction:a}=eX(),c=ex({id:r.generateId(`content-${(0,i.Ds)()}`)},e),[g,f]=(0,i.rg)(c,["ref","id","style","onOpenAutoFocus","onCloseAutoFocus","onEscapeKeyDown","onFocusOutside","onPointerEnter","onPointerMove","onKeyDown","onMouseDown","onFocusIn","onFocusOut"]),p=0,h=()=>null==n.parentMenuContext()&&void 0===o&&r.isModal(),v=function(e,t,r){let n=function(e){let{locale:t}=eX(),r=(0,i.To)(()=>t()+(e?Object.entries(e).sort((e,t)=>e[0]<t[0]?-1:1).join():""));return(0,i.To)(()=>{let n,i=r();return eJ.has(i)&&(n=eJ.get(i)),n||(n=new Intl.Collator(t(),e),eJ.set(i,n)),n})}({usage:"search",sensitivity:"base"});return function(e,t,r){let n=(0,i.v6)({selectOnFocus:()=>"replace"===s(e.selectionManager).selectionBehavior()},e),o=()=>t(),{direction:l}=eX(),a={top:0,left:0};!function(e,t,r,n){if(i.S$)return;let o=()=>{d(s(e)).forEach(e=>{e&&d(s(t)).forEach(t=>{var n;return n=void 0,e.addEventListener(t,r,n),u(e.removeEventListener.bind(e,t,r,n))})})};"function"==typeof e?(0,i.EH)(o):(0,i.gb)(o)}(()=>s(n.isVirtualized)?void 0:o(),"scroll",()=>{let e=o();e&&(a={top:e.scrollTop,left:e.scrollLeft})});let{typeSelectHandlers:c}=function(e){let[t,r]=(0,i.n5)(""),[n,o]=(0,i.n5)(-1);return{typeSelectHandlers:{onKeyDown:i=>{var l,a;if(s(e.isDisabled))return;let d=s(e.keyboardDelegate),u=s(e.selectionManager);if(!d.getKeyForSearch)return;let c=1!==(l=i.key).length&&/^[A-Z]/i.test(l)?"":l;if(!c||i.ctrlKey||i.metaKey)return;" "===c&&t().trim().length>0&&(i.preventDefault(),i.stopPropagation());let g=r(e=>e+c),f=d.getKeyForSearch(g,u.focusedKey())??d.getKeyForSearch(g);null==f&&(a=g).split("").every(e=>e===a[0])&&(g=g[0],f=d.getKeyForSearch(g,u.focusedKey())??d.getKeyForSearch(g)),null!=f&&(u.setFocusedKey(f),e.onTypeSelect?.(f)),clearTimeout(n()),o(window.setTimeout(()=>r(""),500))}}}}({isDisabled:()=>s(n.disallowTypeAhead),keyboardDelegate:()=>s(n.keyboardDelegate),selectionManager:()=>s(n.selectionManager)}),g=()=>s(n.orientation)??"vertical",f=()=>{let e,r=s(n.autoFocus);if(!r)return;let i=s(n.selectionManager),o=s(n.keyboardDelegate);"first"===r&&(e=o.getFirstKey?.()),"last"===r&&(e=o.getLastKey?.());let l=i.selectedKeys();l.size&&(e=l.values().next().value),i.setFocused(!0),i.setFocusedKey(e);let a=t();a&&null==e&&!s(n.shouldUseVirtualFocus)&&eu(a)};return(0,i.Rc)(()=>{n.deferAutoFocus?setTimeout(f,0):f()}),(0,i.EH)((0,i.on)([o,()=>s(n.isVirtualized),()=>s(n.selectionManager).focusedKey()],e=>{let[t,r,i]=e;if(r)i&&n.scrollToKey?.(i);else if(i&&t){let e=t.querySelector(`[data-key="${i}"]`);e&&eC(t,e)}})),{tabIndex:(0,i.To)(()=>{if(!s(n.shouldUseVirtualFocus))return null==s(n.selectionManager).focusedKey()?0:-1}),onKeyDown:e=>{es(e,c.onKeyDown),e.altKey&&"Tab"===e.key&&e.preventDefault();let r=t();if(!r?.contains(e.target))return;let i=s(n.selectionManager),o=s(n.selectOnFocus),a=t=>{null!=t&&(i.setFocusedKey(t),e.shiftKey&&"multiple"===i.selectionMode()?i.extendSelection(t):o&&!e1(e)&&i.replaceSelection(t))},d=s(n.keyboardDelegate),u=s(n.shouldFocusWrap),f=i.focusedKey();switch(e.key){case"vertical"===g()?"ArrowDown":"ArrowRight":if(d.getKeyBelow){let t;e.preventDefault(),null==(t=null!=f?d.getKeyBelow(f):d.getFirstKey?.())&&u&&(t=d.getFirstKey?.(f)),a(t)}break;case"vertical"===g()?"ArrowUp":"ArrowLeft":if(d.getKeyAbove){let t;e.preventDefault(),null==(t=null!=f?d.getKeyAbove(f):d.getLastKey?.())&&u&&(t=d.getLastKey?.(f)),a(t)}break;case"vertical"===g()?"ArrowLeft":"ArrowUp":if(d.getKeyLeftOf){e.preventDefault();let t="rtl"===l();a(null!=f?d.getKeyLeftOf(f):t?d.getFirstKey?.():d.getLastKey?.())}break;case"vertical"===g()?"ArrowRight":"ArrowDown":if(d.getKeyRightOf){e.preventDefault();let t="rtl"===l();a(null!=f?d.getKeyRightOf(f):t?d.getLastKey?.():d.getFirstKey?.())}break;case"Home":if(d.getFirstKey){e.preventDefault();let t=d.getFirstKey(f,e2(e));null!=t&&(i.setFocusedKey(t),e2(e)&&e.shiftKey&&"multiple"===i.selectionMode()?i.extendSelection(t):o&&i.replaceSelection(t))}break;case"End":if(d.getLastKey){e.preventDefault();let t=d.getLastKey(f,e2(e));null!=t&&(i.setFocusedKey(t),e2(e)&&e.shiftKey&&"multiple"===i.selectionMode()?i.extendSelection(t):o&&i.replaceSelection(t))}break;case"PageDown":d.getKeyPageBelow&&null!=f&&(e.preventDefault(),a(d.getKeyPageBelow(f)));break;case"PageUp":d.getKeyPageAbove&&null!=f&&(e.preventDefault(),a(d.getKeyPageAbove(f)));break;case"a":e2(e)&&"multiple"===i.selectionMode()&&!0!==s(n.disallowSelectAll)&&(e.preventDefault(),i.selectAll());break;case"Escape":!e.defaultPrevented&&(e.preventDefault(),s(n.disallowEmptySelection)||i.clearSelection());break;case"Tab":if(!s(n.allowsTabNavigation))if(e.shiftKey)r.focus();else{let e,t,n=function(e,t,r){let n=t?.tabbable?eh:ep,i=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:e=>t?.from?.contains(e)?NodeFilter.FILTER_REJECT:e.matches(n)&&eb(e)&&(!t?.accept||t.accept(e))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP});return t?.from&&(i.currentNode=t.from),i}(r,{tabbable:!0});do(t=n.lastChild())&&(e=t);while(t);e&&!e.contains(document.activeElement)&&eu(e)}}},onMouseDown:e=>{o()===e.target&&e.preventDefault()},onFocusIn:e=>{let t=s(n.selectionManager),r=s(n.keyboardDelegate),i=s(n.selectOnFocus);if(t.isFocused()){e.currentTarget.contains(e.target)||t.setFocused(!1);return}if(e.currentTarget.contains(e.target)){if(t.setFocused(!0),null==t.focusedKey()){let n=e=>{null!=e&&(t.setFocusedKey(e),i&&t.replaceSelection(e))},o=e.relatedTarget;o&&e.currentTarget.compareDocumentPosition(o)&Node.DOCUMENT_POSITION_FOLLOWING?n(t.lastSelectedKey()??r.getLastKey?.()):n(t.firstSelectedKey()??r.getFirstKey?.())}else if(!s(n.isVirtualized)){let e=o();if(e){e.scrollTop=a.top,e.scrollLeft=a.left;let r=e.querySelector(`[data-key="${t.focusedKey()}"]`);r&&(eu(r),eC(e,r))}}}},onFocusOut:e=>{let t=s(n.selectionManager);e.currentTarget.contains(e.relatedTarget)||t.setFocused(!1)}}}({selectionManager:()=>s(e.selectionManager),keyboardDelegate:(0,i.To)(()=>{let r=s(e.keyboardDelegate);return r||new rq(e.collection,t,n)}),autoFocus:()=>s(e.autoFocus),deferAutoFocus:()=>s(e.deferAutoFocus),shouldFocusWrap:()=>s(e.shouldFocusWrap),disallowEmptySelection:()=>s(e.disallowEmptySelection),selectOnFocus:()=>s(e.selectOnFocus),disallowTypeAhead:()=>s(e.disallowTypeAhead),shouldUseVirtualFocus:()=>s(e.shouldUseVirtualFocus),allowsTabNavigation:()=>s(e.allowsTabNavigation),isVirtualized:()=>s(e.isVirtualized),scrollToKey:t=>s(e.scrollToKey)?.(t),orientation:()=>s(e.orientation)},t)}({selectionManager:n.listState().selectionManager,collection:n.listState().collection,autoFocus:n.autoFocus,deferAutoFocus:!0,shouldFocusWrap:!0,disallowTypeAhead:()=>!n.listState().selectionManager().isFocused(),orientation:()=>"horizontal"===r.orientation()?"vertical":"horizontal"},()=>t);!function(e,t){let[r,n]=(0,i.n5)(!1),o={pause(){n(!0)},resume(){n(!1)}},l=null,a=t=>e.onMountAutoFocus?.(t),d=t=>e.onUnmountAutoFocus?.(t),u=()=>en(t()),c=()=>{let e=u().createElement("span");return e.setAttribute("data-focus-trap",""),e.tabIndex=0,Object.assign(e.style,eE),e},g=()=>{let e=t();return e?(function e(t,r){let n=Array.from(t.querySelectorAll(ep)).filter(ev);return r&&ev(t)&&n.unshift(t),n.forEach((t,r)=>{if(ei(t)&&t.contentDocument){let i=e(t.contentDocument.body,!1);n.splice(r,1,...i)}}),n})(e,!0).filter(e=>!e.hasAttribute("data-focus-trap")):[]},f=()=>{let e=g();return e.length>0?e[0]:null};(0,i.EH)(()=>{if(i.S$)return;let e=t();if(!e)return;rL.add(o);let r=er(e);if(!et(e,r)){let t=new CustomEvent(rE,rM);e.addEventListener(rE,a),e.dispatchEvent(t),t.defaultPrevented||setTimeout(()=>{eu(f()),er(e)===r&&eu(e)},0)}(0,i.Ki)(()=>{e.removeEventListener(rE,a),setTimeout(()=>{let n=new CustomEvent(rT,rM);(()=>{let e=t();if(!e)return!1;let r=er(e);return!(!r||et(e,r))&&ey(r)})()&&n.preventDefault(),e.addEventListener(rT,d),e.dispatchEvent(n),n.defaultPrevented||eu(r??u().body),e.removeEventListener(rT,d),rL.remove(o)},0)})}),(0,i.EH)(()=>{if(i.S$)return;let n=t();if(!n||!s(e.trapFocus)||r())return;let o=e=>{let t=e.target;t?.closest(`[${e9}]`)||(et(n,t)?l=t:eu(l))},a=e=>{let t=e.relatedTarget??er(n);!t?.closest(`[${e9}]`)&&(et(n,t)||eu(l))};u().addEventListener("focusin",o),u().addEventListener("focusout",a),(0,i.Ki)(()=>{u().removeEventListener("focusin",o),u().removeEventListener("focusout",a)})}),(0,i.EH)(()=>{if(i.S$)return;let n=t();if(!n||!s(e.trapFocus)||r())return;let o=c();n.insertAdjacentElement("afterbegin",o);let l=c();function a(e){let t=f(),r=(()=>{let e=g();return e.length>0?e[e.length-1]:null})();e.relatedTarget===t?eu(r):eu(t)}n.insertAdjacentElement("beforeend",l),o.addEventListener("focusin",a),l.addEventListener("focusin",a);let d=new MutationObserver(e=>{for(let t of e)t.previousSibling===l&&(l.remove(),n.insertAdjacentElement("beforeend",l)),t.nextSibling===o&&(o.remove(),n.insertAdjacentElement("afterbegin",o))});d.observe(n,{childList:!0,subtree:!1}),(0,i.Ki)(()=>{o.removeEventListener("focusin",a),l.removeEventListener("focusin",a),o.remove(),l.remove(),d.disconnect()})})}({trapFocus:()=>h()&&n.isOpen(),onMountAutoFocus:e=>{void 0===o&&g.onOpenAutoFocus?.(e)},onUnmountAutoFocus:g.onCloseAutoFocus},()=>t);let y=e=>{g.onEscapeKeyDown?.(e),o?.setAutoFocusMenu(!1),n.close(!0)},b=e=>{g.onFocusOutside?.(e),r.isModal()&&e.preventDefault()};(0,i.EH)(()=>(0,i.Ki)(n.registerContentId(g.id)));let m={ref:R(e=>{n.setContentRef(e),t=e},g.ref),role:"menu",get id(){return g.id},get tabIndex(){return v.tabIndex()},get"aria-labelledby"(){return n.triggerId()},onKeyDown:ed([g.onKeyDown,v.onKeyDown,e=>{if(et(e.currentTarget,e.target)&&("Tab"===e.key&&n.isOpen()&&e.preventDefault(),void 0!==o&&"true"!==e.currentTarget.getAttribute("aria-haspopup")))switch(e.key){case rX.next(a(),r.orientation()):e.stopPropagation(),e.preventDefault(),n.close(!0),o.setAutoFocusMenu(!0),o.nextMenu();break;case rX.previous(a(),r.orientation()):if(e.currentTarget.hasAttribute("data-closed"))break;e.stopPropagation(),e.preventDefault(),n.close(!0),o.setAutoFocusMenu(!0),o.previousMenu()}}]),onMouseDown:ed([g.onMouseDown,v.onMouseDown]),onFocusIn:ed([g.onFocusIn,v.onFocusIn]),onFocusOut:ed([g.onFocusOut,v.onFocusOut]),onPointerEnter:e=>{es(e,g.onPointerEnter),n.isOpen()&&(n.parentMenuContext()?.listState().selectionManager().setFocused(!1),n.parentMenuContext()?.listState().selectionManager().setFocusedKey(void 0))},onPointerMove:e=>{if(es(e,g.onPointerMove),"mouse"!==e.pointerType)return;let t=e.target,r=p!==e.clientX;et(e.currentTarget,t)&&r&&(n.setPointerDir(e.clientX>p?"right":"left"),p=e.clientX)},get"data-orientation"(){return r.orientation()}};return(0,i.a0)(i.wv,{get when(){return n.contentPresent()},get children(){return(0,i.a0)(i.wv,{get when(){return void 0===l||null!=n.parentMenuContext()},get fallback(){return(0,i.a0)(eF,(0,i.v6)({as:"div"},()=>n.dataset(),m,f))},get children(){return(0,i.a0)(rl.Positioner,{get children(){return(0,i.a0)(ru,(0,i.v6)({get disableOutsidePointerEvents(){return(0,i.ph)(()=>!!h())()&&n.isOpen()},get excludedElements(){return[n.triggerRef]},bypassTopMostLayerCheck:!0,get style(){return Z({"--kb-menu-content-transform-origin":"var(--kb-popper-content-transform-origin)",position:"relative"},g.style)},onEscapeKeyDown:y,onFocusOutside:b,get onDismiss(){return n.close}},()=>n.dataset(),m,f))}})}})}})}function r5(e){let t,r=rj(),n=rU(),[o,l]=(0,i.rg)(e,["ref"]);return(e=>{let t=(0,i.v6)({element:null,enabled:!0,hideScrollbar:!0,preventScrollbarShift:!0,preventScrollbarShiftMode:"padding",restoreScrollPosition:!0,allowPinchZoom:!1},e),r=(0,i.Ds)(),n=[0,0],o=null,l=null;(0,i.EH)(()=>{e6(t.enabled)&&(rP(e=>[...e,r]),(0,i.Ki)(()=>{rP(e=>e.filter(e=>e!==r))}))}),(0,i.EH)(()=>{if(!e6(t.enabled)||!e6(t.hideScrollbar))return;let{body:e}=document,r=window.innerWidth-e.offsetWidth;if(e6(t.preventScrollbarShift)){let n={overflow:"hidden"},i=[];r>0&&("padding"===e6(t.preventScrollbarShiftMode)?n.paddingRight=`calc(${window.getComputedStyle(e).paddingRight} + ${r}px)`:n.marginRight=`calc(${window.getComputedStyle(e).marginRight} + ${r}px)`,i.push({key:"--scrollbar-width",value:`${r}px`}));let o=window.scrollY,l=window.scrollX;rA({key:"prevent-scroll",element:e,style:n,properties:i,cleanup:()=>{e6(t.restoreScrollPosition)&&r>0&&window.scrollTo(l,o)}})}else rA({key:"prevent-scroll",element:e,style:{overflow:"hidden"}})}),(0,i.EH)(()=>{rK().indexOf(r)===rK().length-1&&e6(t.enabled)&&(document.addEventListener("wheel",s,{passive:!1}),document.addEventListener("touchstart",a,{passive:!1}),document.addEventListener("touchmove",d,{passive:!1}),(0,i.Ki)(()=>{document.removeEventListener("wheel",s),document.removeEventListener("touchstart",a),document.removeEventListener("touchmove",d)}))});let a=e=>{n=rB(e),o=null,l=null},s=e=>{let r,n=e.target,i=e6(t.element),o=[(r=e).deltaX,r.deltaY],l=Math.abs(o[0])>Math.abs(o[1])?"x":"y",a="x"===l?o[0]:o[1],s=rH(n,l,a,i);i&&rR(i,n)&&s||!e.cancelable||e.preventDefault()},d=e=>{let r,i=e6(t.element),a=e.target;if(2===e.touches.length)r=!e6(t.allowPinchZoom);else{if(null==o||null===l){let t=rB(e).map((e,t)=>n[t]-e),r=Math.abs(t[0])>Math.abs(t[1])?"x":"y";o=r,l="x"===r?t[0]:t[1]}if("range"===a.type)r=!1;else{let e=rH(a,o,l,i);r=!(i&&rR(i,a))||!e}}r&&e.cancelable&&e.preventDefault()}})({element:()=>t??null,enabled:()=>n.contentPresent()&&r.preventScroll()}),(0,i.a0)(r2,(0,i.v6)({ref(e){let r=R(e=>{t=e},o.ref);"function"==typeof r&&r(e)}},l))}var r3=(0,i.q6)();function r4(e){let t=ex({id:rj().generateId(`group-${(0,i.Ds)()}`)},e),[r,n]=(0,i.n5)(),o={generateId:ee(()=>t.id),registerLabelId:eT(n)};return(0,i.a0)(r3.Provider,{value:o,get children(){return(0,i.a0)(eF,(0,i.v6)({as:"div",role:"group",get"aria-labelledby"(){return r()}},t))}})}function r6(e){let t=function(){let e=(0,i.NT)(r3);if(void 0===e)throw Error("[kobalte]: `useMenuGroupContext` must be used within a `Menu.Group` component");return e}(),r=ex({id:t.generateId("label")},e),[n,o]=(0,i.rg)(r,["id"]);return(0,i.EH)(()=>(0,i.Ki)(t.registerLabelId(n.id))),(0,i.a0)(eF,(0,i.v6)({as:"span",get id(){return n.id},"aria-hidden":"true"},o))}function r7(e){let t=rU(),r=ex({children:"▼"},e);return(0,i.a0)(eF,(0,i.v6)({as:"span","aria-hidden":"true"},()=>t.dataset(),r))}function r9(e){return(0,i.a0)(r_,(0,i.v6)({role:"menuitem",closeOnSelect:!0},e))}function r8(e){let t=rN(),r=ex({id:t.generateId("description")},e),[n,o]=(0,i.rg)(r,["id"]);return(0,i.EH)(()=>(0,i.Ki)(t.registerDescription(n.id))),(0,i.a0)(eF,(0,i.v6)({as:"div",get id(){return n.id}},()=>t.dataset(),o))}function ne(e){let t=rN(),r=ex({id:t.generateId("indicator")},e),[n,o]=(0,i.rg)(r,["forceMount"]);return(0,i.a0)(i.wv,{get when(){return n.forceMount||t.isChecked()},get children(){return(0,i.a0)(eF,(0,i.v6)({as:"div"},()=>t.dataset(),o))}})}function nt(e){let t=rN(),r=ex({id:t.generateId("label")},e),[n,o]=(0,i.rg)(r,["ref","id"]);return(0,i.EH)(()=>(0,i.Ki)(t.registerLabel(n.id))),(0,i.a0)(eF,(0,i.v6)({as:"div",ref(e){let r=R(t.setLabelRef,n.ref);"function"==typeof r&&r(e)},get id(){return n.id}},()=>t.dataset(),o))}function nr(e){let t=rU();return(0,i.a0)(i.wv,{get when(){return t.contentPresent()},get children(){return(0,i.a0)(i.ZL,e)}})}var nn=(0,i.q6)();function ni(e){let t=ex({id:rj().generateId(`radiogroup-${(0,i.Ds)()}`)},e),[r,n]=(0,i.rg)(t,["value","defaultValue","onChange","disabled"]),[o,l]=eP({value:()=>r.value,defaultValue:()=>r.defaultValue,onChange:e=>r.onChange?.(e)});return(0,i.a0)(nn.Provider,{value:{isDisabled:()=>r.disabled,isSelectedValue:e=>e===o(),setSelectedValue:l},get children(){return(0,i.a0)(r4,n)}})}function no(e){let t=function(){let e=(0,i.NT)(nn);if(void 0===e)throw Error("[kobalte]: `useMenuRadioGroupContext` must be used within a `Menu.RadioGroup` component");return e}(),r=ex({closeOnSelect:!1},e),[n,o]=(0,i.rg)(r,["value","onSelect"]);return(0,i.a0)(r_,(0,i.v6)({role:"menuitemradio",get checked(){return t.isSelectedValue(n.value)},onSelect:()=>{n.onSelect?.(),t.setSelectedValue(n.value)}},o))}function nl(e){var t;let r=rj(),n=(0,i.NT)(eG),o=(0,i.NT)(rG),l=rZ(),a=(0,i.NT)(r1),d=ex({placement:"horizontal"===r.orientation()?"bottom-start":"right-start"},e),[u,c]=(0,i.rg)(d,["open","defaultOpen","onOpenChange"]),g=0,f=null,p="right",[h,v]=(0,i.n5)(),[y,b]=(0,i.n5)(),[m,w]=(0,i.n5)(),[x,k]=(0,i.n5)(),[$,S]=(0,i.n5)(!0),[C,q]=(0,i.n5)(c.placement),[E,T]=(0,i.n5)([]),[M,L]=(0,i.n5)([]),{DomCollectionProvider:F}=function(e={}){let[t,r]=function(e){let[t,r]=eP(e);return[()=>t()??[],r]}({value:()=>s(e.items),onChange:t=>e.onItemsChange?.(t)});!function(e,t){if("function"!=typeof IntersectionObserver)return(0,i.EH)(()=>{let r=setTimeout(()=>{eY(e(),t)});(0,i.Ki)(()=>clearTimeout(r))});let r=[];(0,i.EH)(()=>{let n=new IntersectionObserver(()=>{let n=!!r.length;r=e(),n&&eY(e(),t)},{root:function(e){let t=e[0],r=e[e.length-1]?.ref(),n=t?.ref()?.parentElement;for(;n;){if(r&&n.contains(r))return n;n=n.parentElement}return en(n).body}(e())});for(let t of e()){let e=t.ref();e&&n.observe(e)}(0,i.Ki)(()=>n.disconnect())})}(t,r);let n=e=>(r(t=>{let r=function(e,t){let r=t.ref();if(!r)return -1;let n=e.length;if(!n)return -1;for(;n--;){let t=e[n]?.ref();if(t&&eU(t,r))return n+1}return 0}(t,e);return function(e,t,r=-1){return r in e?[...e.slice(0,r),t,...e.slice(r)]:[...e,t]}(t,e,r)}),()=>{r(t=>{let r=t.filter(t=>t.ref()!==e.ref());return t.length===r.length?t:r})});return{DomCollectionProvider:e=>(0,i.a0)(eG.Provider,{value:{registerItem:n},get children(){return e.children}})}}({items:M,onItemsChange:L}),D=rc({open:()=>u.open,defaultOpen:()=>u.defaultOpen,onOpenChange:e=>u.onOpenChange?.(e)}),{present:z}=e7({show:()=>r.forceMount()||D.isOpen(),element:()=>x()??null}),A=function(e){let t=function(e){let t=ex({selectionMode:"none",selectionBehavior:"toggle"},e),[r,n]=(0,i.n5)(!1),[o,l]=(0,i.n5)(),[a,d]=function(e){let[t,r]=eP(e);return[()=>t()??new e0,r]}({value:(0,i.To)(()=>{let e=s(t.selectedKeys);return null!=e?new e0(e):e}),defaultValue:(0,i.To)(()=>{let e=s(t.defaultSelectedKeys);return null!=e?new e0(e):new e0}),onChange:e=>t.onSelectionChange?.(e)}),[u,c]=(0,i.n5)(s(t.selectionBehavior));return(0,i.EH)(()=>{let e=a();"replace"===s(t.selectionBehavior)&&"toggle"===u()&&"object"==typeof e&&0===e.size&&c("replace")}),(0,i.EH)(()=>{c(s(t.selectionBehavior)??"toggle")}),{selectionMode:()=>s(t.selectionMode),disallowEmptySelection:()=>s(t.disallowEmptySelection)??!1,selectionBehavior:u,setSelectionBehavior:c,isFocused:r,setFocused:n,focusedKey:o,setFocusedKey:l,selectedKeys:a,setSelectedKeys:e=>{(s(t.allowDuplicateSelectionEvents)||!function(e,t){if(e.size!==t.size)return!1;for(let r of e)if(!t.has(r))return!1;return!0}(e,a()))&&d(e)}}}(e),r=function(e,t=[]){return(0,i.To)(()=>{let r=function e(t){let r=t.startIndex??0,n=t.startLevel??0,i=[],o=e=>{if(null==e)return"";let r=t.getKey??"key",n=J(r)?e[r]:r(e);return null!=n?String(n):""},l=e=>{if(null==e)return"";let r=t.getTextValue??"textValue",n=J(r)?e[r]:r(e);return null!=n?String(n):""},a=e=>{if(null==e)return!1;let r=t.getDisabled??"disabled";return(J(r)?e[r]:r(e))??!1},s=e=>{if(null!=e)return J(t.getSectionChildren)?e[t.getSectionChildren]:t.getSectionChildren?.(e)};for(let d of t.dataSource){if(J(d)||"number"==typeof d){i.push({type:"item",rawValue:d,key:String(d),textValue:String(d),disabled:a(d),level:n,index:r}),r++;continue}if(null!=s(d)){i.push({type:"section",rawValue:d,key:"",textValue:"",disabled:!1,level:n,index:r}),r++;let o=s(d)??[];if(o.length>0){let l=e({dataSource:o,getKey:t.getKey,getTextValue:t.getTextValue,getDisabled:t.getDisabled,getSectionChildren:t.getSectionChildren,startIndex:r,startLevel:n+1});i.push(...l),r+=l.length}}else i.push({type:"item",rawValue:d,key:o(d),textValue:l(d),disabled:a(d),level:n,index:r}),r++}return i}({dataSource:s(e.dataSource),getKey:s(e.getKey),getTextValue:s(e.getTextValue),getDisabled:s(e.getDisabled),getSectionChildren:s(e.getSectionChildren)});for(let e=0;e<t.length;e++)t[e]();return e.factory(r)})}({dataSource:()=>s(e.dataSource),getKey:()=>s(e.getKey),getTextValue:()=>s(e.getTextValue),getDisabled:()=>s(e.getDisabled),getSectionChildren:()=>s(e.getSectionChildren),factory:t=>new e4(e.filter?e.filter(t):t)},[()=>e.filter]),n=new e3(r,t);return(0,i.KZ)(()=>{let e=t.focusedKey();null==e||r().getItem(e)||t.setFocusedKey(void 0)}),{collection:r,selectionManager:()=>n}}({selectionMode:"none",dataSource:M}),O=e=>{S(e),D.open()},I=(e=!1)=>{D.close(),e&&o&&o.close(!0)},K=()=>{let e=x();e&&(eu(e),A.selectionManager().setFocused(!0),A.selectionManager().setFocusedKey(void 0))},P=()=>{null!=a?setTimeout(()=>K()):K()},B=e=>{var t;return p===f?.side&&!!(t=f?.area)&&function(e,t){let[r,n]=e,i=!1,o=t.length;for(let e=0,l=o-1;e<o;l=e++){let[a,s]=t[e],[d,u]=t[l],[,c]=t[0===l?o-1:l-1]||[0,0],g=(s-u)*(r-a)-(a-d)*(n-s);if(u<s){if(n>=u&&n<s){if(0===g)return!0;g>0&&(n===u?n>c&&(i=!i):i=!i)}}else if(s<u){if(n>s&&n<=u){if(0===g)return!0;g<0&&(n===u?n<c&&(i=!i):i=!i)}}else if(n==s&&(r>=d&&r<=a||r>=a&&r<=d))return!0}return i}([e.clientX,e.clientY],t)};t={isDisabled:()=>!(null==o&&D.isOpen()&&r.isModal()),targets:()=>[x(),...E()].filter(Boolean)},(0,i.EH)(()=>{s(t.isDisabled)||(0,i.Ki)(function(e,t=document.body){let r=new Set(e),n=new Set,i=e=>{for(let t of e.querySelectorAll(`[data-live-announcer], [${e9}]`))r.add(t);let t=e=>{if(r.has(e)||e.parentElement&&n.has(e.parentElement)&&"row"!==e.parentElement.getAttribute("role"))return NodeFilter.FILTER_REJECT;for(let t of r)if(e.contains(t))return NodeFilter.FILTER_SKIP;return NodeFilter.FILTER_ACCEPT},i=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:t}),l=t(e);if(l===NodeFilter.FILTER_ACCEPT&&o(e),l!==NodeFilter.FILTER_REJECT){let e=i.nextNode();for(;null!=e;)o(e),e=i.nextNode()}},o=e=>{let t=rF.get(e)??0;("true"!==e.getAttribute("aria-hidden")||0!==t)&&(0===t&&e.setAttribute("aria-hidden","true"),n.add(e),rF.set(e,t+1))};rD.length&&rD[rD.length-1].disconnect(),i(t);let l=new MutationObserver(e=>{for(let t of e)if("childList"===t.type&&0!==t.addedNodes.length&&![...r,...n].some(e=>e.contains(t.target))){for(let e of t.removedNodes)e instanceof Element&&(r.delete(e),n.delete(e));for(let e of t.addedNodes)(e instanceof HTMLElement||e instanceof SVGElement)&&("true"===e.dataset.liveAnnouncer||"true"===e.dataset.reactAriaTopLayer)?r.add(e):e instanceof Element&&i(e)}});l.observe(t,{childList:!0,subtree:!0});let a={observe(){l.observe(t,{childList:!0,subtree:!0})},disconnect(){l.disconnect()}};return rD.push(a),()=>{for(let e of(l.disconnect(),n)){let t=rF.get(e);if(null==t)return;1===t?(e.removeAttribute("aria-hidden"),rF.delete(e)):rF.set(e,t-1)}a===rD[rD.length-1]?(rD.pop(),rD.length&&rD[rD.length-1].observe()):rD.splice(rD.indexOf(a),1)}}(s(t.targets),s(t.root)))}),(0,i.EH)(()=>{let e=x();if(!e||!o)return;let t=o.registerNestedMenu(e);(0,i.Ki)(()=>{t()})}),(0,i.EH)(()=>{void 0===o&&l?.registerMenu(r.value(),[x(),...E()])}),(0,i.EH)(()=>{void 0===o&&void 0!==l&&(l.value()===r.value()?(m()?.focus(),l.autoFocusMenu()&&O(!0)):I())}),(0,i.EH)(()=>{void 0===o&&void 0!==l&&D.isOpen()&&l.setValue(r.value())}),(0,i.Ki)(()=>{void 0===o&&l?.unregisterMenu(r.value())});let H={dataset:(0,i.To)(()=>({"data-expanded":D.isOpen()?"":void 0,"data-closed":D.isOpen()?void 0:""})),isOpen:D.isOpen,contentPresent:z,nestedMenus:E,currentPlacement:C,pointerGraceTimeoutId:()=>g,autoFocus:$,listState:()=>A,parentMenuContext:()=>o,triggerRef:m,contentRef:x,triggerId:h,contentId:y,setTriggerRef:w,setContentRef:k,open:O,close:I,toggle:e=>{S(e),D.toggle()},focusContent:P,onItemEnter:e=>{B(e)&&e.preventDefault()},onItemLeave:e=>{B(e)||P()},onTriggerLeave:e=>{B(e)&&e.preventDefault()},setPointerDir:e=>p=e,setPointerGraceTimeoutId:e=>g=e,setPointerGraceIntent:e=>f=e,registerNestedMenu:e=>{T(t=>[...t,e]);let t=o?.registerNestedMenu(e);return()=>{T(t=>X(t,e)),t?.()}},registerItemToParentDomCollection:n?.registerItem,registerTriggerId:eT(v),registerContentId:eT(b)};return(0,i.a0)(F,{get children(){return(0,i.a0)(rG.Provider,{value:H,get children(){return(0,i.a0)(i.wv,{when:void 0===a,get fallback(){return c.children},get children(){return(0,i.a0)(rl,(0,i.v6)({anchorRef:m,contentRef:x,onCurrentPlacementChange:q},c))}})}})}})}function na(e){let{direction:t}=eX();return(0,i.a0)(nl,(0,i.v6)({get placement(){return"rtl"===t()?"left-start":"right-start"},flip:!0},e))}var ns={close:(e,t)=>"ltr"===e?["horizontal"===t?"ArrowLeft":"ArrowUp"]:["horizontal"===t?"ArrowRight":"ArrowDown"]};function nd(e){let t=rU(),r=rj(),[n,o]=(0,i.rg)(e,["onFocusOutside","onKeyDown"]),{direction:l}=eX();return(0,i.a0)(r2,(0,i.v6)({onOpenAutoFocus:e=>{e.preventDefault()},onCloseAutoFocus:e=>{e.preventDefault()},onFocusOutside:e=>{n.onFocusOutside?.(e);let r=e.target;et(t.triggerRef(),r)||t.close()},onKeyDown:e=>{es(e,n.onKeyDown);let i=et(e.currentTarget,e.target),o=ns.close(l(),r.orientation()).includes(e.key),a=null!=t.parentMenuContext();i&&o&&a&&(t.close(),eu(t.triggerRef()))}},o))}var nu=["Enter"," "],nc={open:(e,t)=>"ltr"===e?[...nu,"horizontal"===t?"ArrowRight":"ArrowDown"]:[...nu,"horizontal"===t?"ArrowLeft":"ArrowUp"]};function ng(e){let t,r=rj(),n=rU(),o=ex({id:r.generateId(`sub-trigger-${(0,i.Ds)()}`)},e),[l,a]=(0,i.rg)(o,["ref","id","textValue","disabled","onPointerMove","onPointerLeave","onPointerDown","onPointerUp","onClick","onKeyDown","onMouseDown","onFocus"]),s=null,d=()=>{i.S$||(s&&window.clearTimeout(s),s=null)},{direction:u}=eX(),c=()=>l.id,g=()=>{let e=n.parentMenuContext();if(null==e)throw Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");return e.listState().selectionManager()},f=e5({key:c,selectionManager:g,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>l.disabled},()=>t),p=e=>{es(e,l.onClick),n.isOpen()||l.disabled||n.open(!0)},h=e=>{es(e,l.onKeyDown),!e.repeat&&!l.disabled&&nc.open(u(),r.orientation()).includes(e.key)&&(e.stopPropagation(),e.preventDefault(),g().setFocused(!1),g().setFocusedKey(void 0),n.isOpen()||n.open("first"),n.focusContent(),n.listState().selectionManager().setFocused(!0),n.listState().selectionManager().setFocusedKey(n.listState().collection().getFirstKey()))};return(0,i.EH)(()=>{if(null==n.registerItemToParentDomCollection)throw Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");let e=n.registerItemToParentDomCollection({ref:()=>t,type:"item",key:c(),textValue:l.textValue??t?.textContent??"",disabled:l.disabled??!1});(0,i.Ki)(e)}),(0,i.EH)((0,i.on)(()=>n.parentMenuContext()?.pointerGraceTimeoutId(),e=>{(0,i.Ki)(()=>{window.clearTimeout(e),n.parentMenuContext()?.setPointerGraceIntent(null)})})),(0,i.EH)(()=>(0,i.Ki)(n.registerTriggerId(l.id))),(0,i.Ki)(()=>{d()}),(0,i.a0)(eF,(0,i.v6)({as:"div",ref(e){let r=R(e=>{n.setTriggerRef(e),t=e},l.ref);"function"==typeof r&&r(e)},get id(){return l.id},role:"menuitem",get tabIndex(){return f.tabIndex()},"aria-haspopup":"true",get"aria-expanded"(){return n.isOpen()},get"aria-controls"(){return(0,i.ph)(()=>!!n.isOpen())()?n.contentId():void 0},get"aria-disabled"(){return l.disabled},get"data-key"(){return f.dataKey()},get"data-highlighted"(){return g().focusedKey()===c()?"":void 0},get"data-disabled"(){return l.disabled?"":void 0},get onPointerDown(){return ed([l.onPointerDown,f.onPointerDown])},get onPointerUp(){return ed([l.onPointerUp,f.onPointerUp])},get onClick(){return ed([p,f.onClick])},get onKeyDown(){return ed([h,f.onKeyDown])},get onMouseDown(){return ed([l.onMouseDown,f.onMouseDown])},get onFocus(){return ed([l.onFocus,f.onFocus])},onPointerMove:e=>{if(es(e,l.onPointerMove),"mouse"!==e.pointerType)return;let t=n.parentMenuContext();if(t?.onItemEnter(e),!e.defaultPrevented){if(l.disabled)return void t?.onItemLeave(e);n.isOpen()||s||(n.parentMenuContext()?.setPointerGraceIntent(null),s=window.setTimeout(()=>{n.open(!1),d()},100)),t?.onItemEnter(e),e.defaultPrevented||(n.listState().selectionManager().isFocused()&&(n.listState().selectionManager().setFocused(!1),n.listState().selectionManager().setFocusedKey(void 0)),eu(e.currentTarget),t?.listState().selectionManager().setFocused(!0),t?.listState().selectionManager().setFocusedKey(c()))}},onPointerLeave:e=>{if(es(e,l.onPointerLeave),"mouse"!==e.pointerType)return;d();let t=n.parentMenuContext(),r=n.contentRef();if(r){t?.setPointerGraceIntent({area:function(e,t,r){let n=e.split("-")[0],i=r.getBoundingClientRect(),o=[],l=t.clientX,a=t.clientY;switch(n){case"top":o.push([l,a+5]),o.push([i.left,i.bottom]),o.push([i.left,i.top]),o.push([i.right,i.top]),o.push([i.right,i.bottom]);break;case"right":o.push([l-5,a]),o.push([i.left,i.top]),o.push([i.right,i.top]),o.push([i.right,i.bottom]),o.push([i.left,i.bottom]);break;case"bottom":o.push([l,a-5]),o.push([i.right,i.top]),o.push([i.right,i.bottom]),o.push([i.left,i.bottom]),o.push([i.left,i.top]);break;case"left":o.push([l+5,a]),o.push([i.right,i.bottom]),o.push([i.left,i.bottom]),o.push([i.left,i.top]),o.push([i.right,i.top])}return o}(n.currentPlacement(),e,r),side:n.currentPlacement().split("-")[0]}),window.clearTimeout(t?.pointerGraceTimeoutId());let i=window.setTimeout(()=>{t?.setPointerGraceIntent(null)},300);t?.setPointerGraceTimeoutId(i)}else{if(t?.onTriggerLeave(e),e.defaultPrevented)return;t?.setPointerGraceIntent(null)}t?.onItemLeave(e)}},()=>n.dataset(),a))}function nf(e){let t=rZ(),r=ex({id:`menu-${(0,i.Ds)()}`,modal:!0},e),[n,o]=(0,i.rg)(r,["id","modal","preventScroll","forceMount","open","defaultOpen","onOpenChange","value","orientation"]),l=rc({open:()=>n.open,defaultOpen:()=>n.defaultOpen,onOpenChange:e=>n.onOpenChange?.(e)}),a={isModal:()=>n.modal??!0,preventScroll:()=>n.preventScroll??a.isModal(),forceMount:()=>n.forceMount??!1,generateId:ee(()=>n.id),value:()=>n.value,orientation:()=>n.orientation??t?.orientation()??"horizontal"};return(0,i.a0)(rV.Provider,{value:a,get children(){return(0,i.a0)(nl,(0,i.v6)({get open(){return l.isOpen()},get onOpenChange(){return l.setIsOpen}},o))}})}function np(e){let t,r=ex({orientation:"horizontal"},e),[n,o]=(0,i.rg)(r,["ref","orientation"]),l=eM(()=>t,()=>"hr");return(0,i.a0)(eF,(0,i.v6)({as:"hr",ref(e){let r=R(e=>t=e,n.ref);"function"==typeof r&&r(e)},get role(){return"hr"!==l()?"separator":void 0},get"aria-orientation"(){return"vertical"===n.orientation?"vertical":void 0},get"data-orientation"(){return n.orientation}},o))}eR({},{Root:()=>np,Separator:()=>nh});var nh=np,nv={};function ny(e){let t=rj(),r=rU(),[n,o]=(0,i.rg)(e,["onCloseAutoFocus","onInteractOutside"]),l=!1;return(0,i.a0)(r5,(0,i.v6)({onCloseAutoFocus:e=>{n.onCloseAutoFocus?.(e),l||eu(r.triggerRef()),l=!1,e.preventDefault()},onInteractOutside:e=>{n.onInteractOutside?.(e),(!t.isModal()||e.detail.isContextMenu)&&(l=!0)}},o))}function nb(e){let t=ex({id:`dropdownmenu-${(0,i.Ds)()}`},e);return(0,i.a0)(nf,t)}eR(nv,{Arrow:()=>rr,CheckboxItem:()=>rQ,Content:()=>ny,DropdownMenu:()=>nm,Group:()=>r4,GroupLabel:()=>r6,Icon:()=>r7,Item:()=>r9,ItemDescription:()=>r8,ItemIndicator:()=>ne,ItemLabel:()=>nt,Portal:()=>nr,RadioGroup:()=>ni,RadioItem:()=>no,Root:()=>nb,Separator:()=>np,Sub:()=>na,SubContent:()=>nd,SubTrigger:()=>ng,Trigger:()=>r0});var nm=Object.assign(nb,{Arrow:rr,CheckboxItem:rQ,Content:ny,Group:r4,GroupLabel:r6,Icon:r7,Item:r9,ItemDescription:r8,ItemIndicator:ne,ItemLabel:nt,Portal:nr,RadioGroup:ni,RadioItem:no,Separator:np,Sub:na,SubContent:nd,SubTrigger:ng,Trigger:r0}),nw={colors:{inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000000",white:"#ffffff",neutral:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},darkGray:{50:"#525c7a",100:"#49536e",200:"#414962",300:"#394056",400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318",900:"#0b0d10"},gray:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},blue:{25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},green:{25:"#F6FEF9",50:"#ECFDF3",100:"#D1FADF",200:"#A6F4C5",300:"#6CE9A6",400:"#32D583",500:"#12B76A",600:"#039855",700:"#027A48",800:"#05603A",900:"#054F31"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},yellow:{25:"#FFFCF5",50:"#FFFAEB",100:"#FEF0C7",200:"#FEDF89",300:"#FEC84B",400:"#FDB022",500:"#F79009",600:"#DC6803",700:"#B54708",800:"#93370D",900:"#7A2E0E"},purple:{25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},teal:{25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},pink:{25:"#fdf2f8",50:"#fce7f3",100:"#fbcfe8",200:"#f9a8d4",300:"#f472b6",400:"#ec4899",500:"#db2777",600:"#be185d",700:"#9d174d",800:"#831843",900:"#500724"},cyan:{25:"#ecfeff",50:"#cffafe",100:"#a5f3fc",200:"#67e8f9",300:"#22d3ee",400:"#06b6d4",500:"#0891b2",600:"#0e7490",700:"#155e75",800:"#164e63",900:"#083344"}},alpha:{100:"ff",90:"e5",80:"cc",70:"b3",60:"99",50:"80",40:"66",30:"4d",20:"33",10:"1a",0:"00"},font:{size:{"2xs":"calc(var(--tsqd-font-size) * 0.625)",xs:"calc(var(--tsqd-font-size) * 0.75)",sm:"calc(var(--tsqd-font-size) * 0.875)",md:"var(--tsqd-font-size)",lg:"calc(var(--tsqd-font-size) * 1.125)",xl:"calc(var(--tsqd-font-size) * 1.25)","2xl":"calc(var(--tsqd-font-size) * 1.5)","3xl":"calc(var(--tsqd-font-size) * 1.875)","4xl":"calc(var(--tsqd-font-size) * 2.25)","5xl":"calc(var(--tsqd-font-size) * 3)","6xl":"calc(var(--tsqd-font-size) * 3.75)","7xl":"calc(var(--tsqd-font-size) * 4.5)","8xl":"calc(var(--tsqd-font-size) * 6)","9xl":"calc(var(--tsqd-font-size) * 8)"},lineHeight:{xs:"calc(var(--tsqd-font-size) * 1)",sm:"calc(var(--tsqd-font-size) * 1.25)",md:"calc(var(--tsqd-font-size) * 1.5)",lg:"calc(var(--tsqd-font-size) * 1.75)",xl:"calc(var(--tsqd-font-size) * 2)","2xl":"calc(var(--tsqd-font-size) * 2.25)","3xl":"calc(var(--tsqd-font-size) * 2.5)","4xl":"calc(var(--tsqd-font-size) * 2.75)","5xl":"calc(var(--tsqd-font-size) * 3)","6xl":"calc(var(--tsqd-font-size) * 3.25)","7xl":"calc(var(--tsqd-font-size) * 3.5)","8xl":"calc(var(--tsqd-font-size) * 3.75)","9xl":"calc(var(--tsqd-font-size) * 4)"},weight:{thin:"100",extralight:"200",light:"300",normal:"400",medium:"500",semibold:"600",bold:"700",extrabold:"800",black:"900"}},breakpoints:{xs:"320px",sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px"},border:{radius:{none:"0px",xs:"calc(var(--tsqd-font-size) * 0.125)",sm:"calc(var(--tsqd-font-size) * 0.25)",md:"calc(var(--tsqd-font-size) * 0.375)",lg:"calc(var(--tsqd-font-size) * 0.5)",xl:"calc(var(--tsqd-font-size) * 0.75)","2xl":"calc(var(--tsqd-font-size) * 1)","3xl":"calc(var(--tsqd-font-size) * 1.5)",full:"9999px"}},size:{0:"0px",.25:"calc(var(--tsqd-font-size) * 0.0625)",.5:"calc(var(--tsqd-font-size) * 0.125)",1:"calc(var(--tsqd-font-size) * 0.25)",1.5:"calc(var(--tsqd-font-size) * 0.375)",2:"calc(var(--tsqd-font-size) * 0.5)",2.5:"calc(var(--tsqd-font-size) * 0.625)",3:"calc(var(--tsqd-font-size) * 0.75)",3.5:"calc(var(--tsqd-font-size) * 0.875)",4:"calc(var(--tsqd-font-size) * 1)",4.5:"calc(var(--tsqd-font-size) * 1.125)",5:"calc(var(--tsqd-font-size) * 1.25)",5.5:"calc(var(--tsqd-font-size) * 1.375)",6:"calc(var(--tsqd-font-size) * 1.5)",6.5:"calc(var(--tsqd-font-size) * 1.625)",7:"calc(var(--tsqd-font-size) * 1.75)",8:"calc(var(--tsqd-font-size) * 2)",9:"calc(var(--tsqd-font-size) * 2.25)",10:"calc(var(--tsqd-font-size) * 2.5)",11:"calc(var(--tsqd-font-size) * 2.75)",12:"calc(var(--tsqd-font-size) * 3)",14:"calc(var(--tsqd-font-size) * 3.5)",16:"calc(var(--tsqd-font-size) * 4)",20:"calc(var(--tsqd-font-size) * 5)",24:"calc(var(--tsqd-font-size) * 6)",28:"calc(var(--tsqd-font-size) * 7)",32:"calc(var(--tsqd-font-size) * 8)",36:"calc(var(--tsqd-font-size) * 9)",40:"calc(var(--tsqd-font-size) * 10)",44:"calc(var(--tsqd-font-size) * 11)",48:"calc(var(--tsqd-font-size) * 12)",52:"calc(var(--tsqd-font-size) * 13)",56:"calc(var(--tsqd-font-size) * 14)",60:"calc(var(--tsqd-font-size) * 15)",64:"calc(var(--tsqd-font-size) * 16)",72:"calc(var(--tsqd-font-size) * 18)",80:"calc(var(--tsqd-font-size) * 20)",96:"calc(var(--tsqd-font-size) * 24)"},shadow:{xs:(e="rgb(0 0 0 / 0.1)")=>"0 1px 2px 0 rgb(0 0 0 / 0.05)",sm:(e="rgb(0 0 0 / 0.1)")=>`0 1px 3px 0 ${e}, 0 1px 2px -1px ${e}`,md:(e="rgb(0 0 0 / 0.1)")=>`0 4px 6px -1px ${e}, 0 2px 4px -2px ${e}`,lg:(e="rgb(0 0 0 / 0.1)")=>`0 10px 15px -3px ${e}, 0 4px 6px -4px ${e}`,xl:(e="rgb(0 0 0 / 0.1)")=>`0 20px 25px -5px ${e}, 0 8px 10px -6px ${e}`,"2xl":(e="rgb(0 0 0 / 0.25)")=>`0 25px 50px -12px ${e}`,inner:(e="rgb(0 0 0 / 0.05)")=>`inset 0 2px 4px 0 ${e}`,none:()=>"none"},zIndices:{hide:-1,auto:"auto",base:0,docked:10,dropdown:1e3,sticky:1100,banner:1200,overlay:1300,modal:1400,popover:1500,skipLink:1600,toast:1700,tooltip:1800}},nx=(0,i.vs)('<svg width=14 height=14 viewBox="0 0 14 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M13 13L9.00007 9M10.3333 5.66667C10.3333 8.244 8.244 10.3333 5.66667 10.3333C3.08934 10.3333 1 8.244 1 5.66667C1 3.08934 3.08934 1 5.66667 1C8.244 1 10.3333 3.08934 10.3333 5.66667Z"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),nk=(0,i.vs)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6M10 10.5V15.5M14 10.5V15.5"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),n$=(0,i.vs)('<svg width=10 height=6 viewBox="0 0 10 6"fill=none xmlns=http://www.w3.org/2000/svg><path d="M1 1L5 5L9 1"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),nS=(0,i.vs)('<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 13.3333V2.66667M8 2.66667L4 6.66667M8 2.66667L12 6.66667"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),nC=(0,i.vs)('<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 2.66667V13.3333M8 13.3333L4 9.33333M8 13.3333L12 9.33333"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),nq=(0,i.vs)('<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69 4.9 19.104m12.786-1.414 1.414 1.414M22 12h-2m-3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nE=(0,i.vs)('<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M22 15.844a10.424 10.424 0 0 1-4.306.925c-5.779 0-10.463-4.684-10.463-10.462 0-1.536.33-2.994.925-4.307A10.464 10.464 0 0 0 2 11.538C2 17.316 6.684 22 12.462 22c4.243 0 7.896-2.526 9.538-6.156Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nT=(0,i.vs)('<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 21h8m-4-4v4m-5.2-4h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 14.72 22 13.88 22 12.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 3 18.88 3 17.2 3H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 5.28 2 6.12 2 7.8v4.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 17 5.12 17 6.8 17Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nM=(0,i.vs)('<svg stroke=currentColor fill=currentColor stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M0 0h24v24H0z"></path><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z">'),nL=(0,i.vs)('<svg stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M24 .01c0-.01 0-.01 0 0L0 0v24h24V.01zM0 0h24v24H0V0zm0 0h24v24H0V0z"></path><path d="M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4a9.793 9.793 0 00-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l1.99 2c1.24-1.24 2.67-2.16 4.2-2.77l2.24 2.24A9.684 9.684 0 005 13v.01L6.99 15a7.042 7.042 0 014.92-2.06L18.98 20l1.27-1.26L3.29 1.79 2 3.05zM9 17l3 3 3-3a4.237 4.237 0 00-6 0z">'),nF=(0,i.vs)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.3951 19.3711L9.97955 20.6856C10.1533 21.0768 10.4368 21.4093 10.7958 21.6426C11.1547 21.8759 11.5737 22.0001 12.0018 22C12.4299 22.0001 12.8488 21.8759 13.2078 21.6426C13.5667 21.4093 13.8503 21.0768 14.024 20.6856L14.6084 19.3711C14.8165 18.9047 15.1664 18.5159 15.6084 18.26C16.0532 18.0034 16.5678 17.8941 17.0784 17.9478L18.5084 18.1C18.9341 18.145 19.3637 18.0656 19.7451 17.8713C20.1265 17.6771 20.4434 17.3763 20.6573 17.0056C20.8715 16.635 20.9735 16.2103 20.9511 15.7829C20.9286 15.3555 20.7825 14.9438 20.5307 14.5978L19.684 13.4344C19.3825 13.0171 19.2214 12.5148 19.224 12C19.2239 11.4866 19.3865 10.9864 19.6884 10.5711L20.5351 9.40778C20.787 9.06175 20.933 8.65007 20.9555 8.22267C20.978 7.79528 20.8759 7.37054 20.6618 7C20.4479 6.62923 20.131 6.32849 19.7496 6.13423C19.3681 5.93997 18.9386 5.86053 18.5129 5.90556L17.0829 6.05778C16.5722 6.11141 16.0577 6.00212 15.6129 5.74556C15.17 5.48825 14.82 5.09736 14.6129 4.62889L14.024 3.31444C13.8503 2.92317 13.5667 2.59072 13.2078 2.3574C12.8488 2.12408 12.4299 1.99993 12.0018 2C11.5737 1.99993 11.1547 2.12408 10.7958 2.3574C10.4368 2.59072 10.1533 2.92317 9.97955 3.31444L9.3951 4.62889C9.18803 5.09736 8.83798 5.48825 8.3951 5.74556C7.95032 6.00212 7.43577 6.11141 6.9251 6.05778L5.49066 5.90556C5.06499 5.86053 4.6354 5.93997 4.25397 6.13423C3.87255 6.32849 3.55567 6.62923 3.34177 7C3.12759 7.37054 3.02555 7.79528 3.04804 8.22267C3.07052 8.65007 3.21656 9.06175 3.46844 9.40778L4.3151 10.5711C4.61704 10.9864 4.77964 11.4866 4.77955 12C4.77964 12.5134 4.61704 13.0137 4.3151 13.4289L3.46844 14.5922C3.21656 14.9382 3.07052 15.3499 3.04804 15.7773C3.02555 16.2047 3.12759 16.6295 3.34177 17C3.55589 17.3706 3.8728 17.6712 4.25417 17.8654C4.63554 18.0596 5.06502 18.1392 5.49066 18.0944L6.92066 17.9422C7.43133 17.8886 7.94587 17.9979 8.39066 18.2544C8.83519 18.511 9.18687 18.902 9.3951 19.3711Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><path d="M12 15C13.6568 15 15 13.6569 15 12C15 10.3431 13.6568 9 12 9C10.3431 9 8.99998 10.3431 8.99998 12C8.99998 13.6569 10.3431 15 12 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nD=(0,i.vs)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M16 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M11.5 12.5L17 7M17 7H12M17 7V12M6.2 21H8.8C9.9201 21 10.4802 21 10.908 20.782C11.2843 20.5903 11.5903 20.2843 11.782 19.908C12 19.4802 12 18.9201 12 17.8V15.2C12 14.0799 12 13.5198 11.782 13.092C11.5903 12.7157 11.2843 12.4097 10.908 12.218C10.4802 12 9.92011 12 8.8 12H6.2C5.0799 12 4.51984 12 4.09202 12.218C3.71569 12.4097 3.40973 12.7157 3.21799 13.092C3 13.5198 3 14.0799 3 15.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nz=(0,i.vs)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path class=copier d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round stroke=currentColor>'),nA=(0,i.vs)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M2.5 21.4998L8.04927 19.3655C8.40421 19.229 8.58168 19.1607 8.74772 19.0716C8.8952 18.9924 9.0358 18.901 9.16804 18.7984C9.31692 18.6829 9.45137 18.5484 9.72028 18.2795L21 6.99982C22.1046 5.89525 22.1046 4.10438 21 2.99981C19.8955 1.89525 18.1046 1.89524 17 2.99981L5.72028 14.2795C5.45138 14.5484 5.31692 14.6829 5.20139 14.8318C5.09877 14.964 5.0074 15.1046 4.92823 15.2521C4.83911 15.4181 4.77085 15.5956 4.63433 15.9506L2.5 21.4998ZM2.5 21.4998L4.55812 16.1488C4.7054 15.7659 4.77903 15.5744 4.90534 15.4867C5.01572 15.4101 5.1523 15.3811 5.2843 15.4063C5.43533 15.4351 5.58038 15.5802 5.87048 15.8703L8.12957 18.1294C8.41967 18.4195 8.56472 18.5645 8.59356 18.7155C8.61877 18.8475 8.58979 18.9841 8.51314 19.0945C8.42545 19.2208 8.23399 19.2944 7.85107 19.4417L2.5 21.4998Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nO=(0,i.vs)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nI=(0,i.vs)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 9L15 15M15 9L9 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke=#F04438 stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nK=(0,i.vs)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 xmlns=http://www.w3.org/2000/svg><rect class=list width=20 height=20 y=2 x=2 rx=2></rect><line class=list-item y1=7 y2=7 x1=6 x2=18></line><line class=list-item y2=12 y1=12 x1=6 x2=18></line><line class=list-item y1=17 y2=17 x1=6 x2=18>'),nP=(0,i.vs)('<svg viewBox="0 0 24 24"height=20 width=20 fill=none xmlns=http://www.w3.org/2000/svg><path d="M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V7.8Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nB=(0,i.vs)('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nH=(0,i.vs)('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><animateTransform attributeName=transform attributeType=XML type=rotate from=0 to=360 dur=2s repeatCount=indefinite>'),nR=(0,i.vs)('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nG=(0,i.vs)('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.5 15V9M14.5 15V9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),nU=(0,i.vs)('<svg version=1.0 viewBox="0 0 633 633"><linearGradient x1=-666.45 x2=-666.45 y1=163.28 y2=163.99 gradientTransform="matrix(633 0 0 633 422177 -103358)"gradientUnits=userSpaceOnUse><stop stop-color=#6BDAFF offset=0></stop><stop stop-color=#F9FFB5 offset=.32></stop><stop stop-color=#FFA770 offset=.71></stop><stop stop-color=#FF7373 offset=1></stop></linearGradient><circle cx=316.5 cy=316.5 r=316.5></circle><defs><filter x=-137.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=316.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=316.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=316.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=272.2 y=308 width=176.9 height=129.3 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=272.2 y=308 width=176.9 height=129.3 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><line x1=436 x2=431 y1=403.2 y2=431.8 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=291 x2=280 y1=341.5 y2=403.5 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=332.9 x2=328.6 y1=384.1 y2=411.2 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><linearGradient x1=-670.75 x2=-671.59 y1=164.4 y2=164.49 gradientTransform="matrix(-184.16 -32.472 -11.461 64.997 -121359 -32126)"gradientUnits=userSpaceOnUse><stop stop-color=#EE2700 offset=0></stop><stop stop-color=#FF008E offset=1></stop></linearGradient><path d="m344.1 363 97.7 17.2c5.8 2.1 8.2 6.1 7.1 12.1s-4.7 9.2-11 9.9l-106-18.7-57.5-59.2c-3.2-4.8-2.9-9.1 0.8-12.8s8.3-4.4 13.7-2.1l55.2 53.6z"clip-rule=evenodd fill-rule=evenodd></path><line x1=428.2 x2=429.1 y1=384.5 y2=378 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=395.2 x2=396.1 y1=379.5 y2=373 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=362.2 x2=363.1 y1=373.5 y2=367.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=324.2 x2=328.4 y1=351.3 y2=347.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=303.2 x2=307.4 y1=331.3 y2=327.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line></g><defs><filter x=73.2 y=113.8 width=280.6 height=317.4 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=73.2 y=113.8 width=280.6 height=317.4 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-672.16 x2=-672.16 y1=165.03 y2=166.03 gradientTransform="matrix(-100.18 48.861 97.976 200.88 -83342 -93.059)"gradientUnits=userSpaceOnUse><stop stop-color=#A17500 offset=0></stop><stop stop-color=#5D2100 offset=1></stop></linearGradient><path d="m192.3 203c8.1 37.3 14 73.6 17.8 109.1 3.8 35.4 2.8 75.1-3 119.2l61.2-16.7c-15.6-59-25.2-97.9-28.6-116.6s-10.8-51.9-22.1-99.6l-25.3 4.6"clip-rule=evenodd fill-rule=evenodd></path><g stroke=#2F8A00><linearGradient x1=-660.23 x2=-660.23 y1=166.72 y2=167.72 gradientTransform="matrix(92.683 4.8573 -2.0259 38.657 61680 -3088.6)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9s-12.6-22.1-36.5-29.9c-15.9-5.2-34.4-1.5-55.5 11.1 15.9 14.3 29.5 22.6 40.7 24.9 16.8 3.6 51.3-6.1 51.3-6.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-661.36 x2=-661.36 y1=164.18 y2=165.18 gradientTransform="matrix(110 5.7648 -6.3599 121.35 73933 -15933)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5s-47.5-8.5-83.2 15.7c-23.8 16.2-34.3 49.3-31.6 99.4 30.3-27.8 52.1-48.5 65.2-61.9 19.8-20.2 49.6-53.2 49.6-53.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.79 x2=-656.79 y1=165.15 y2=166.15 gradientTransform="matrix(62.954 3.2993 -3.5023 66.828 42156 -8754.1)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9c-0.8-21.9 6-38 20.6-48.2s29.8-15.4 45.5-15.3c-6.1 21.4-14.5 35.8-25.2 43.4s-24.4 14.2-40.9 20.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-663.07 x2=-663.07 y1=165.44 y2=166.44 gradientTransform="matrix(152.47 7.9907 -3.0936 59.029 101884 -4318.7)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c31.9-30 64.1-39.7 96.7-29s50.8 30.4 54.6 59.1c-35.2-5.5-60.4-9.6-75.8-12.1-15.3-2.6-40.5-8.6-75.5-18z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-662.57 x2=-662.57 y1=164.44 y2=165.44 gradientTransform="matrix(136.46 7.1517 -5.2163 99.533 91536 -11442)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c35.8-7.6 65.6-0.2 89.2 22s37.7 49 42.3 80.3c-39.8-9.7-68.3-23.8-85.5-42.4s-32.5-38.5-46-59.9z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.43 x2=-656.43 y1=163.86 y2=164.86 gradientTransform="matrix(60.866 3.1899 -8.7773 167.48 41560 -25168)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c-33.6 13.8-53.6 35.7-60.1 65.6s-3.6 63.1 8.7 99.6c27.4-40.3 43.2-69.6 47.4-88s5.6-44.1 4-77.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><path d="m196.5 182.3c-14.8 21.6-25.1 41.4-30.8 59.4s-9.5 33-11.1 45.1"fill=none stroke-linecap=round stroke-width=8></path><path d="m194.9 185.7c-24.4 1.7-43.8 9-58.1 21.8s-24.7 25.4-31.3 37.8"fill=none stroke-linecap=round stroke-width=8></path><path d="m204.5 176.4c29.7-6.7 52-8.4 67-5.1s26.9 8.6 35.8 15.9"fill=none stroke-linecap=round stroke-width=8></path><path d="m196.5 181.4c20.3 9.9 38.2 20.5 53.9 31.9s27.4 22.1 35.1 32"fill=none stroke-linecap=round stroke-width=8></path></g></g><defs><filter x=50.5 y=399 width=532 height=633 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=50.5 y=399 width=532 height=633 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-666.06 x2=-666.23 y1=163.36 y2=163.75 gradientTransform="matrix(532 0 0 633 354760 -102959)"gradientUnits=userSpaceOnUse><stop stop-color=#FFF400 offset=0></stop><stop stop-color=#3C8700 offset=1></stop></linearGradient><ellipse cx=316.5 cy=715.5 rx=266 ry=316.5></ellipse></g><defs><filter x=391 y=-24 width=288 height=283 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=391 y=-24 width=288 height=283 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-664.56 x2=-664.56 y1=163.79 y2=164.79 gradientTransform="matrix(227 0 0 227 151421 -37204)"gradientUnits=userSpaceOnUse><stop stop-color=#FFDF00 offset=0></stop><stop stop-color=#FF9D00 offset=1></stop></linearGradient><circle cx=565.5 cy=89.5 r=113.5></circle><linearGradient x1=-644.5 x2=-645.77 y1=342 y2=342 gradientTransform="matrix(30 0 0 1 19770 -253)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=427 x2=397 y1=89 y2=89 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-641.56 x2=-642.83 y1=196.02 y2=196.07 gradientTransform="matrix(26.5 0 0 5.5 17439 -1025.5)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=430.5 x2=404 y1=55.5 y2=50 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-643.73 x2=-645 y1=185.83 y2=185.9 gradientTransform="matrix(29 0 0 8 19107 -1361)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=431 x2=402 y1=122 y2=130 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-638.94 x2=-640.22 y1=177.09 y2=177.39 gradientTransform="matrix(24 0 0 13 15783 -2145)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=442 x2=418 y1=153 y2=166 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-633.42 x2=-634.7 y1=172.41 y2=173.31 gradientTransform="matrix(20 0 0 19 13137 -3096)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=464 x2=444 y1=180 y2=199 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-619.05 x2=-619.52 y1=170.82 y2=171.82 gradientTransform="matrix(13.83 0 0 22.85 9050 -3703.4)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=491.4 x2=477.5 y1=203 y2=225.9 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-578.5 x2=-578.63 y1=170.31 y2=171.31 gradientTransform="matrix(7.5 0 0 24.5 4860 -3953)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=524.5 x2=517 y1=219.5 y2=244 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=666.5 x2=666.5 y1=170.31 y2=171.31 gradientTransform="matrix(.5 0 0 24.5 231.5 -3944)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=564.5 x2=565 y1=228.5 y2=253 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12>');function nY(){return nx()}function nN(){return nk()}function nV(){return n$()}function nj(){return nS()}function n_(){return nC()}function nQ(){var e;return(e=nC()).style.setProperty("transform","rotate(90deg)"),e}function nW(){var e;return(e=nC()).style.setProperty("transform","rotate(-90deg)"),e}function nZ(){return nq()}function nX(){return nE()}function nJ(){return nT()}function n0(){return nM()}function n1(){return nL()}function n2(){return nF()}function n5(){return nD()}function n3(){return nz()}function n4(){return nA()}function n6(e){var t,r;return r=(t=nO()).firstChild,(0,i.gb)(()=>(0,i.Bq)(r,"stroke","dark"===e.theme?"#12B76A":"#027A48")),t}function n7(){return nI()}function n9(){return nK()}function n8(e){return[(0,i.a0)(i.wv,{get when(){return e.checked},get children(){var t=nO(),r=t.firstChild;return(0,i.gb)(()=>(0,i.Bq)(r,"stroke","dark"===e.theme?"#9B8AFB":"#6938EF")),t}}),(0,i.a0)(i.wv,{get when(){return!e.checked},get children(){var n=nP(),o=n.firstChild;return(0,i.gb)(()=>(0,i.Bq)(o,"stroke","dark"===e.theme?"#9B8AFB":"#6938EF")),n}})]}function ie(){return nB()}function it(){return nH()}function ir(){return nR()}function ii(){return nG()}function io(){var e,t,r,n,o,l,a,s,d,u,c,g,f,p,h,v,y,b,m,w,x,k,$,S,C,q,E,T,M,L,F,D,z,A,O,I,K,P,B,H,R,G,U,Y,N,V,j,_,Q,W,Z,X,J,ee,et,er,en,ei,eo,el,ea,es,ed,eu,ec,eg,ef,ep,eh,ev,ey,eb,em,ew,ex,ek,e$,eS,eC,eq,eE,eT,eM,eL,eF,eD,ez,eA,eO;let eI=(0,i.Ds)();return o=(n=(r=(t=(e=nU()).firstChild).nextSibling).nextSibling).firstChild,a=(l=n.nextSibling).firstChild,u=(d=(s=l.nextSibling).nextSibling).firstChild,g=(c=d.nextSibling).firstChild,h=(p=(f=c.nextSibling).nextSibling).firstChild,y=(v=p.nextSibling).firstChild,w=(m=(b=v.nextSibling).nextSibling).firstChild,k=(x=m.nextSibling).firstChild,C=(S=($=x.nextSibling).nextSibling).firstChild,E=(q=S.nextSibling).firstChild,L=(M=(T=q.nextSibling).nextSibling).firstChild,D=(F=M.nextSibling).firstChild,O=(A=(z=F.nextSibling).nextSibling).firstChild,K=(I=A.nextSibling).firstChild,H=(B=(P=I.nextSibling).firstChild.nextSibling.nextSibling.nextSibling).nextSibling,G=(R=P.nextSibling).firstChild,Y=(U=R.nextSibling).firstChild,eo=(ei=(en=(er=(et=(ee=(J=(X=(Z=(W=(Q=(_=(j=(V=(N=U.nextSibling).firstChild).nextSibling).nextSibling.firstChild).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling,ea=(el=N.nextSibling).firstChild,ed=(es=el.nextSibling).firstChild,eg=(ec=(eu=es.nextSibling).firstChild).nextSibling,ep=(ef=eu.nextSibling).firstChild,ev=(eh=ef.nextSibling).firstChild,eO=(eA=(ez=(eD=(eF=(eL=(eM=(eT=(eE=(eq=(eC=(eS=(e$=(ek=(ex=(ew=(em=(eb=(ey=eh.nextSibling).firstChild).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling,(0,i.Bq)(t,"id",`a-${eI}`),(0,i.Bq)(r,"fill",`url(#a-${eI})`),(0,i.Bq)(o,"id",`am-${eI}`),(0,i.Bq)(l,"id",`b-${eI}`),(0,i.Bq)(a,"filter",`url(#am-${eI})`),(0,i.Bq)(s,"mask",`url(#b-${eI})`),(0,i.Bq)(u,"id",`ah-${eI}`),(0,i.Bq)(c,"id",`k-${eI}`),(0,i.Bq)(g,"filter",`url(#ah-${eI})`),(0,i.Bq)(f,"mask",`url(#k-${eI})`),(0,i.Bq)(h,"id",`ae-${eI}`),(0,i.Bq)(v,"id",`j-${eI}`),(0,i.Bq)(y,"filter",`url(#ae-${eI})`),(0,i.Bq)(b,"mask",`url(#j-${eI})`),(0,i.Bq)(w,"id",`ai-${eI}`),(0,i.Bq)(x,"id",`i-${eI}`),(0,i.Bq)(k,"filter",`url(#ai-${eI})`),(0,i.Bq)($,"mask",`url(#i-${eI})`),(0,i.Bq)(C,"id",`aj-${eI}`),(0,i.Bq)(q,"id",`h-${eI}`),(0,i.Bq)(E,"filter",`url(#aj-${eI})`),(0,i.Bq)(T,"mask",`url(#h-${eI})`),(0,i.Bq)(L,"id",`ag-${eI}`),(0,i.Bq)(F,"id",`g-${eI}`),(0,i.Bq)(D,"filter",`url(#ag-${eI})`),(0,i.Bq)(z,"mask",`url(#g-${eI})`),(0,i.Bq)(O,"id",`af-${eI}`),(0,i.Bq)(I,"id",`f-${eI}`),(0,i.Bq)(K,"filter",`url(#af-${eI})`),(0,i.Bq)(P,"mask",`url(#f-${eI})`),(0,i.Bq)(B,"id",`m-${eI}`),(0,i.Bq)(H,"fill",`url(#m-${eI})`),(0,i.Bq)(G,"id",`ak-${eI}`),(0,i.Bq)(U,"id",`e-${eI}`),(0,i.Bq)(Y,"filter",`url(#ak-${eI})`),(0,i.Bq)(N,"mask",`url(#e-${eI})`),(0,i.Bq)(V,"id",`n-${eI}`),(0,i.Bq)(j,"fill",`url(#n-${eI})`),(0,i.Bq)(_,"id",`r-${eI}`),(0,i.Bq)(Q,"fill",`url(#r-${eI})`),(0,i.Bq)(W,"id",`s-${eI}`),(0,i.Bq)(Z,"fill",`url(#s-${eI})`),(0,i.Bq)(X,"id",`q-${eI}`),(0,i.Bq)(J,"fill",`url(#q-${eI})`),(0,i.Bq)(ee,"id",`p-${eI}`),(0,i.Bq)(et,"fill",`url(#p-${eI})`),(0,i.Bq)(er,"id",`o-${eI}`),(0,i.Bq)(en,"fill",`url(#o-${eI})`),(0,i.Bq)(ei,"id",`l-${eI}`),(0,i.Bq)(eo,"fill",`url(#l-${eI})`),(0,i.Bq)(ea,"id",`al-${eI}`),(0,i.Bq)(es,"id",`d-${eI}`),(0,i.Bq)(ed,"filter",`url(#al-${eI})`),(0,i.Bq)(eu,"mask",`url(#d-${eI})`),(0,i.Bq)(ec,"id",`u-${eI}`),(0,i.Bq)(eg,"fill",`url(#u-${eI})`),(0,i.Bq)(ep,"id",`ad-${eI}`),(0,i.Bq)(eh,"id",`c-${eI}`),(0,i.Bq)(ev,"filter",`url(#ad-${eI})`),(0,i.Bq)(ey,"mask",`url(#c-${eI})`),(0,i.Bq)(eb,"id",`t-${eI}`),(0,i.Bq)(em,"fill",`url(#t-${eI})`),(0,i.Bq)(ew,"id",`v-${eI}`),(0,i.Bq)(ex,"stroke",`url(#v-${eI})`),(0,i.Bq)(ek,"id",`aa-${eI}`),(0,i.Bq)(e$,"stroke",`url(#aa-${eI})`),(0,i.Bq)(eS,"id",`w-${eI}`),(0,i.Bq)(eC,"stroke",`url(#w-${eI})`),(0,i.Bq)(eq,"id",`ac-${eI}`),(0,i.Bq)(eE,"stroke",`url(#ac-${eI})`),(0,i.Bq)(eT,"id",`ab-${eI}`),(0,i.Bq)(eM,"stroke",`url(#ab-${eI})`),(0,i.Bq)(eL,"id",`y-${eI}`),(0,i.Bq)(eF,"stroke",`url(#y-${eI})`),(0,i.Bq)(eD,"id",`x-${eI}`),(0,i.Bq)(ez,"stroke",`url(#x-${eI})`),(0,i.Bq)(eA,"id",`z-${eI}`),(0,i.Bq)(eO,"stroke",`url(#z-${eI})`),e}var il=(0,i.vs)('<span><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 12L10 8L6 4"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),ia=(0,i.vs)('<button title="Copy object to clipboard">'),is=(0,i.vs)('<button title="Remove all items"aria-label="Remove all items">'),id=(0,i.vs)('<button title="Delete item"aria-label="Delete item">'),iu=(0,i.vs)('<button title="Toggle value"aria-label="Toggle value">'),ic=(0,i.vs)('<button title="Bulk Edit Data"aria-label="Bulk Edit Data">'),ig=(0,i.vs)("<div>"),ip=(0,i.vs)("<div><button> <span></span> <span> "),ih=(0,i.vs)("<input>"),iv=(0,i.vs)("<span>"),iy=(0,i.vs)("<div><span>:"),ib=(0,i.vs)("<div><div><button> [<!>...<!>]"),im=e=>{let t=S(),r=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,n=(0,i.To)(()=>"dark"===t()?iT(r):iE(r));return(()=>{var t=il();return(0,i.gb)(()=>(0,i.s7)(t,H(n().expander,r`
          transform: rotate(${90*!!e.expanded}deg);
        `,e.expanded&&r`
            & svg {
              top: -1px;
            }
          `))),t})()},iw=e=>{let t=S(),r=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,n=(0,i.To)(()=>"dark"===t()?iT(r):iE(r)),[o,l]=(0,i.n5)("NoCopy");return(()=>{var r=ia();return(0,i.q2)(r,"click","NoCopy"===o()?()=>{navigator.clipboard.writeText((0,i.As)(e.value)).then(()=>{l("SuccessCopy"),setTimeout(()=>{l("NoCopy")},1500)},e=>{l("ErrorCopy"),setTimeout(()=>{l("NoCopy")},1500)})}:void 0,!0),(0,i.Yr)(r,(0,i.a0)(i.dO,{get children(){return[(0,i.a0)(i.YG,{get when(){return"NoCopy"===o()},get children(){return(0,i.a0)(n3,{})}}),(0,i.a0)(i.YG,{get when(){return"SuccessCopy"===o()},get children(){return(0,i.a0)(n6,{get theme(){return t()}})}}),(0,i.a0)(i.YG,{get when(){return"ErrorCopy"===o()},get children(){return(0,i.a0)(n7,{})}})]}})),(0,i.gb)(e=>{var t=n().actionButton,l=`${"NoCopy"===o()?"Copy object to clipboard":"SuccessCopy"===o()?"Object copied to clipboard":"Error copying object to clipboard"}`;return t!==e.e&&(0,i.s7)(r,e.e=t),l!==e.t&&(0,i.Bq)(r,"aria-label",e.t=l),e},{e:void 0,t:void 0}),r})()},ix=e=>{let t=S(),r=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,n=(0,i.To)(()=>"dark"===t()?iT(r):iE(r)),o=m().client;return(()=>{var t=is();return t.$$click=()=>{let t=e.activeQuery.state.data,r=(0,i.zt)(t,e.dataPath,[]);o.setQueryData(e.activeQuery.queryKey,r)},(0,i.Yr)(t,(0,i.a0)(n9,{})),(0,i.gb)(()=>(0,i.s7)(t,n().actionButton)),t})()},ik=e=>{let t=S(),r=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,n=(0,i.To)(()=>"dark"===t()?iT(r):iE(r)),o=m().client;return(()=>{var t=id();return t.$$click=()=>{let t=e.activeQuery.state.data,r=(0,i.Dc)(t,e.dataPath);o.setQueryData(e.activeQuery.queryKey,r)},(0,i.Yr)(t,(0,i.a0)(nN,{})),(0,i.gb)(()=>(0,i.s7)(t,H(n().actionButton))),t})()},i$=e=>{let t=S(),r=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,n=(0,i.To)(()=>"dark"===t()?iT(r):iE(r)),o=m().client;return(()=>{var l=iu();return l.$$click=()=>{let t=e.activeQuery.state.data,r=(0,i.zt)(t,e.dataPath,!e.value);o.setQueryData(e.activeQuery.queryKey,r)},(0,i.Yr)(l,(0,i.a0)(n8,{get theme(){return t()},get checked(){return e.value}})),(0,i.gb)(()=>(0,i.s7)(l,H(n().actionButton,r`
          width: ${nw.size[3.5]};
          height: ${nw.size[3.5]};
        `))),l})()};function iS(e){return Symbol.iterator in e}function iC(e){var t;let r=S(),n=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,o=(0,i.To)(()=>"dark"===r()?iT(n):iE(n)),l=m().client,[a,s]=(0,i.n5)((e.defaultExpanded||[]).includes(e.label)),[d,u]=(0,i.n5)([]),c=(0,i.To)(()=>Array.isArray(e.value)?e.value.map((e,t)=>({label:t.toString(),value:e})):null!==e.value&&"object"==typeof e.value&&iS(e.value)&&"function"==typeof e.value[Symbol.iterator]?e.value instanceof Map?Array.from(e.value,([e,t])=>({label:e,value:t})):Array.from(e.value,(e,t)=>({label:t.toString(),value:e})):"object"==typeof e.value&&null!==e.value?Object.entries(e.value).map(([e,t])=>({label:e,value:t})):[]),g=(0,i.To)(()=>Array.isArray(e.value)?"array":null!==e.value&&"object"==typeof e.value&&iS(e.value)&&"function"==typeof e.value[Symbol.iterator]?"Iterable":"object"==typeof e.value&&null!==e.value?"object":typeof e.value),f=(0,i.To)(()=>(function(e,t){let r=0,n=[];for(;r<e.length;)n.push(e.slice(r,r+100)),r+=100;return n})(c(),100)),p=e.dataPath??[];return t=ig(),(0,i.Yr)(t,(0,i.a0)(i.wv,{get when(){return f().length},get children(){var h,v,y,b,w,x;return[(x=(w=(b=(y=(v=(h=ip()).firstChild).firstChild).nextSibling).nextSibling.nextSibling).firstChild,v.$$click=()=>s(e=>!e),(0,i.Yr)(v,(0,i.a0)(im,{get expanded(){return a()}}),y),(0,i.Yr)(b,()=>e.label),(0,i.Yr)(w,()=>"iterable"===String(g()).toLowerCase()?"(Iterable) ":"",x),(0,i.Yr)(w,()=>c().length,x),(0,i.Yr)(w,()=>c().length>1?"items":"item",null),(0,i.Yr)(h,(0,i.a0)(i.wv,{get when(){return e.editable},get children(){var k=ig();return(0,i.Yr)(k,(0,i.a0)(iw,{get value(){return e.value}}),null),(0,i.Yr)(k,(0,i.a0)(i.wv,{get when(){return e.itemsDeletable&&void 0!==e.activeQuery},get children(){return(0,i.a0)(ik,{get activeQuery(){return e.activeQuery},dataPath:p})}}),null),(0,i.Yr)(k,(0,i.a0)(i.wv,{get when(){return"array"===g()&&void 0!==e.activeQuery},get children(){return(0,i.a0)(ix,{get activeQuery(){return e.activeQuery},dataPath:p})}}),null),(0,i.Yr)(k,(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>!!e.onEdit)()&&!(0,i.lK)(e.value).meta},get children(){var $=ic();return $.$$click=()=>{e.onEdit?.()},(0,i.Yr)($,(0,i.a0)(n4,{})),(0,i.gb)(()=>(0,i.s7)($,o().actionButton)),$}}),null),(0,i.gb)(()=>(0,i.s7)(k,o().actions)),k}}),null),(0,i.gb)(e=>{var t=o().expanderButtonContainer,r=o().expanderButton,n=o().info;return t!==e.e&&(0,i.s7)(h,e.e=t),r!==e.t&&(0,i.s7)(v,e.t=r),n!==e.a&&(0,i.s7)(w,e.a=n),e},{e:void 0,t:void 0,a:void 0}),h),(0,i.a0)(i.wv,{get when(){return a()},get children(){return[(0,i.a0)(i.wv,{get when(){return 1===f().length},get children(){var C=ig();return(0,i.Yr)(C,(0,i.a0)(j,{get each(){return c()},by:e=>e.label,children:t=>(0,i.a0)(iC,{get defaultExpanded(){return e.defaultExpanded},get label(){return t().label},get value(){return t().value},get editable(){return e.editable},get dataPath(){return[...p,t().label]},get activeQuery(){return e.activeQuery},get itemsDeletable(){return"array"===g()||"Iterable"===g()||"object"===g()}})})),(0,i.gb)(()=>(0,i.s7)(C,o().subEntry)),C}}),(0,i.a0)(i.wv,{get when(){return f().length>1},get children(){var q=ig();return(0,i.Yr)(q,(0,i.a0)(i.jK,{get each(){return f()},children:(t,r)=>{var n,l,a,s,c,g;return(g=(c=(s=(a=(l=(n=ib()).firstChild).firstChild).firstChild).nextSibling).nextSibling.nextSibling).nextSibling,a.$$click=()=>u(e=>e.includes(r)?e.filter(e=>e!==r):[...e,r]),(0,i.Yr)(a,(0,i.a0)(im,{get expanded(){return d().includes(r)}}),s),(0,i.Yr)(a,100*r,c),(0,i.Yr)(a,100*r+100-1,g),(0,i.Yr)(l,(0,i.a0)(i.wv,{get when(){return d().includes(r)},get children(){var f=ig();return(0,i.Yr)(f,(0,i.a0)(j,{get each(){return t()},by:e=>e.label,children:t=>(0,i.a0)(iC,{get defaultExpanded(){return e.defaultExpanded},get label(){return t().label},get value(){return t().value},get editable(){return e.editable},get dataPath(){return[...p,t().label]},get activeQuery(){return e.activeQuery}})})),(0,i.gb)(()=>(0,i.s7)(f,o().subEntry)),f}}),null),(0,i.gb)(e=>{var t=o().entry,r=o().expanderButton;return t!==e.e&&(0,i.s7)(l,e.e=t),r!==e.t&&(0,i.s7)(a,e.t=r),e},{e:void 0,t:void 0}),n}})),(0,i.gb)(()=>(0,i.s7)(q,o().subEntry)),q}})]}})]}}),null),(0,i.Yr)(t,(0,i.a0)(i.wv,{get when(){return 0===f().length},get children(){var E=iy(),T=E.firstChild,M=T.firstChild;return(0,i.Yr)(T,()=>e.label,M),(0,i.Yr)(E,(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>!!(e.editable&&void 0!==e.activeQuery))()&&("string"===g()||"number"===g()||"boolean"===g())},get fallback(){var L;return L=iv(),(0,i.Yr)(L,()=>(0,i.KN)(e.value)),(0,i.gb)(()=>(0,i.s7)(L,o().value)),L},get children(){return[(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>!!(e.editable&&void 0!==e.activeQuery))()&&("string"===g()||"number"===g())},get children(){var F=ih();return F.addEventListener("change",t=>{let r=e.activeQuery.state.data,n=(0,i.zt)(r,p,"number"===g()?t.target.valueAsNumber:t.target.value);l.setQueryData(e.activeQuery.queryKey,n)}),(0,i.gb)(e=>{var t="number"===g()?"number":"text",r=H(o().value,o().editableInput);return t!==e.e&&(0,i.Bq)(F,"type",e.e=t),r!==e.t&&(0,i.s7)(F,e.t=r),e},{e:void 0,t:void 0}),(0,i.gb)(()=>F.value=e.value),F}}),(0,i.a0)(i.wv,{get when(){return"boolean"===g()},get children(){var D=iv();return(0,i.Yr)(D,(0,i.a0)(i$,{get activeQuery(){return e.activeQuery},dataPath:p,get value(){return e.value}}),null),(0,i.Yr)(D,()=>(0,i.KN)(e.value),null),(0,i.gb)(()=>(0,i.s7)(D,H(o().value,o().actions,o().editableInput))),D}})]}}),null),(0,i.Yr)(E,(0,i.a0)(i.wv,{get when(){return e.editable&&e.itemsDeletable&&void 0!==e.activeQuery},get children(){return(0,i.a0)(ik,{get activeQuery(){return e.activeQuery},dataPath:p})}}),null),(0,i.gb)(e=>{var t=o().row,r=o().label;return t!==e.e&&(0,i.s7)(E,e.e=t),r!==e.t&&(0,i.s7)(T,e.t=r),e},{e:void 0,t:void 0}),E}}),null),(0,i.gb)(()=>(0,i.s7)(t,o().entry)),t}var iq=(e,t)=>{let{colors:r,font:n,size:i,border:o}=nw,l=(t,r)=>"light"===e?t:r;return{entry:t`
      & * {
        font-size: ${n.size.xs};
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
      }
      position: relative;
      outline: none;
      word-break: break-word;
    `,subEntry:t`
      margin: 0 0 0 0.5em;
      padding-left: 0.75em;
      border-left: 2px solid ${l(r.gray[300],r.darkGray[400])};
      /* outline: 1px solid ${r.teal[400]}; */
    `,expander:t`
      & path {
        stroke: ${r.gray[400]};
      }
      & svg {
        width: ${i[3]};
        height: ${i[3]};
      }
      display: inline-flex;
      align-items: center;
      transition: all 0.1s ease;
      /* outline: 1px solid ${r.blue[400]}; */
    `,expanderButtonContainer:t`
      display: flex;
      align-items: center;
      line-height: ${i[4]};
      min-height: ${i[4]};
      gap: ${i[2]};
    `,expanderButton:t`
      cursor: pointer;
      color: inherit;
      font: inherit;
      outline: inherit;
      height: ${i[5]};
      background: transparent;
      border: none;
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: ${i[1]};
      position: relative;
      /* outline: 1px solid ${r.green[400]}; */

      &:focus-visible {
        border-radius: ${o.radius.xs};
        outline: 2px solid ${r.blue[800]};
      }

      & svg {
        position: relative;
        left: 1px;
      }
    `,info:t`
      color: ${l(r.gray[500],r.gray[500])};
      font-size: ${n.size.xs};
      margin-left: ${i[1]};
      /* outline: 1px solid ${r.yellow[400]}; */
    `,label:t`
      color: ${l(r.gray[700],r.gray[300])};
      white-space: nowrap;
    `,value:t`
      color: ${l(r.purple[600],r.purple[400])};
      flex-grow: 1;
    `,actions:t`
      display: inline-flex;
      gap: ${i[2]};
      align-items: center;
    `,row:t`
      display: inline-flex;
      gap: ${i[2]};
      width: 100%;
      margin: ${i[.25]} 0px;
      line-height: ${i[4.5]};
      align-items: center;
    `,editableInput:t`
      border: none;
      padding: ${i[.5]} ${i[1]} ${i[.5]} ${i[1.5]};
      flex-grow: 1;
      border-radius: ${o.radius.xs};
      background-color: ${l(r.gray[200],r.darkGray[500])};

      &:hover {
        background-color: ${l(r.gray[300],r.darkGray[600])};
      }
    `,actionButton:t`
      background-color: transparent;
      color: ${l(r.gray[500],r.gray[500])};
      border: none;
      display: inline-flex;
      padding: 0px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: ${i[3]};
      height: ${i[3]};
      position: relative;
      z-index: 1;

      &:hover svg {
        color: ${l(r.gray[600],r.gray[400])};
      }

      &:focus-visible {
        border-radius: ${o.radius.xs};
        outline: 2px solid ${r.blue[800]};
        outline-offset: 2px;
      }
    `}},iE=e=>iq("light",e),iT=e=>iq("dark",e);(0,i.z_)(["click"]);var iM=(0,i.vs)('<div><div aria-hidden=true></div><button type=button aria-label="Open Tanstack query devtools"class=tsqd-open-btn>'),iL=(0,i.vs)("<div>"),iF=(0,i.vs)('<aside aria-label="Tanstack query devtools"><div></div><button aria-label="Close tanstack query devtools">'),iD=(0,i.vs)("<select name=tsqd-queries-filter-sort>"),iz=(0,i.vs)("<select name=tsqd-mutations-filter-sort>"),iA=(0,i.vs)("<span>Asc"),iO=(0,i.vs)("<span>Desc"),iI=(0,i.vs)('<button aria-label="Open in picture-in-picture mode"title="Open in picture-in-picture mode">'),iK=(0,i.vs)("<div>Settings"),iP=(0,i.vs)("<span>Position"),iB=(0,i.vs)("<span>Top"),iH=(0,i.vs)("<span>Bottom"),iR=(0,i.vs)("<span>Left"),iG=(0,i.vs)("<span>Right"),iU=(0,i.vs)("<span>Theme"),iY=(0,i.vs)("<span>Light"),iN=(0,i.vs)("<span>Dark"),iV=(0,i.vs)("<span>System"),ij=(0,i.vs)("<span>Disabled Queries"),i_=(0,i.vs)("<span>Show"),iQ=(0,i.vs)("<span>Hide"),iW=(0,i.vs)("<div><div class=tsqd-queries-container>"),iZ=(0,i.vs)("<div><div class=tsqd-mutations-container>"),iX=(0,i.vs)('<div><div><div><button aria-label="Close Tanstack query devtools"><span>TANSTACK</span><span> v</span></button></div></div><div><div><div><input aria-label="Filter queries by query key"type=text placeholder=Filter name=tsqd-query-filter-input></div><div></div><button class=tsqd-query-filter-sort-order-btn></button></div><div><button aria-label="Clear query cache"></button><button>'),iJ=(0,i.vs)("<option>Sort by "),i0=(0,i.vs)("<div class=tsqd-query-disabled-indicator>disabled"),i1=(0,i.vs)("<div class=tsqd-query-static-indicator>static"),i2=(0,i.vs)("<button><div></div><code class=tsqd-query-hash>"),i5=(0,i.vs)("<div role=tooltip id=tsqd-status-tooltip>"),i3=(0,i.vs)("<span>"),i4=(0,i.vs)("<button><span></span><span>"),i6=(0,i.vs)("<button><span></span> Error"),i7=(0,i.vs)('<div><span></span>Trigger Error<select><option value=""disabled selected>'),i9=(0,i.vs)('<div class="tsqd-query-details-explorer-container tsqd-query-details-data-explorer">'),i8=(0,i.vs)("<form><textarea name=data></textarea><div><span></span><div><button type=button>Cancel</button><button>Save"),oe=(0,i.vs)('<div><div>Query Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span></span></div><div class=tsqd-query-details-observers-count><span>Observers:</span><span></span></div><div class=tsqd-query-details-last-updated><span>Last Updated:</span><span></span></div></div><div>Actions</div><div><button><span></span>Refetch</button><button><span></span>Invalidate</button><button><span></span>Reset</button><button><span></span>Remove</button><button><span></span> Loading</button></div><div>Data </div><div>Query Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">'),ot=(0,i.vs)("<option>"),or=(0,i.vs)('<div><div>Mutation Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span></span></div><div class=tsqd-query-details-last-updated><span>Submitted At:</span><span></span></div></div><div>Variables Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div>Context Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div>Data Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div>Mutations Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">'),[on,oi]=(0,i.n5)(null),[oo,ol]=(0,i.n5)(null),[oa,os]=(0,i.n5)(0),[od,ou]=(0,i.n5)(!1),oc=e=>{let t,r=S(),n=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,o=(0,i.To)(()=>"dark"===r()?oD(n):oF(n)),l=(0,i.To)(()=>m().onlineManager);(0,i.Rc)(()=>{let e=l().subscribe(e=>{ou(!e)});(0,i.Ki)(()=>{e()})});let a=k(),s=(0,i.To)(()=>m().buttonPosition||"bottom-right"),d=(0,i.To)(()=>"true"===e.localStore.open||"false"!==e.localStore.open&&(m().initialIsOpen||!1)),u=(0,i.To)(()=>e.localStore.position||m().position||p);(0,i.EH)(()=>{let r=t.parentElement,n=e.localStore.height||500,i=e.localStore.width||500,o=u();r.style.setProperty("--tsqd-panel-height",`${"top"===o?"-":""}${n}px`),r.style.setProperty("--tsqd-panel-width",`${"left"===o?"-":""}${i}px`)}),(0,i.Rc)(()=>{let e=()=>{let e=t.parentElement,r=getComputedStyle(e).fontSize;e.style.setProperty("--tsqd-font-size",r)};e(),window.addEventListener("focus",e),(0,i.Ki)(()=>{window.removeEventListener("focus",e)})});let c=(0,i.To)(()=>e.localStore.pip_open??"false");return[(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>!!a().pipWindow)()&&"true"==c()},get children(){return(0,i.a0)(i.ZL,{get mount(){return a().pipWindow?.document.body},get children(){return(0,i.a0)(og,{get children(){return(0,i.a0)(oh,e)}})}})}}),(()=>{var r=iL(),l=t;return"function"==typeof l?(0,i.Yx)(l,r):t=r,(0,i.Yr)(r,(0,i.a0)(Y,{name:"tsqd-panel-transition",get children(){return(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>!!(d()&&!a().pipWindow))()&&"false"==c()},get children(){return(0,i.a0)(op,{get localStore(){return e.localStore},get setLocalStore(){return e.setLocalStore}})}})}}),null),(0,i.Yr)(r,(0,i.a0)(Y,{name:"tsqd-button-transition",get children(){return(0,i.a0)(i.wv,{get when(){return!d()},get children(){var g=iM(),f=g.firstChild,p=f.nextSibling;return(0,i.Yr)(f,(0,i.a0)(io,{})),p.$$click=()=>e.setLocalStore("open","true"),(0,i.Yr)(p,(0,i.a0)(io,{})),(0,i.gb)(()=>(0,i.s7)(g,H(o().devtoolsBtn,o()[`devtoolsBtn-position-${s()}`],"tsqd-open-btn-container"))),g}})}}),null),(0,i.gb)(()=>(0,i.s7)(r,H(n`
            & .tsqd-panel-transition-exit-active,
            & .tsqd-panel-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
            }

            & .tsqd-panel-transition-exit-to,
            & .tsqd-panel-transition-enter {
              ${"top"===u()||"bottom"===u()?"transform: translateY(var(--tsqd-panel-height));":"transform: translateX(var(--tsqd-panel-width));"}
            }

            & .tsqd-button-transition-exit-active,
            & .tsqd-button-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
              opacity: 1;
            }

            & .tsqd-button-transition-exit-to,
            & .tsqd-button-transition-enter {
              transform: ${"relative"===s()?"none;":"top-left"===s()?"translateX(-72px);":"top-right"===s()?"translateX(72px);":"translateY(72px);"};
              opacity: 0;
            }
          `,"tsqd-transitions-container"))),r})()]},og=e=>{let t=k(),r=S(),n=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,o=(0,i.To)(()=>"dark"===r()?oD(n):oF(n));return(0,i.EH)(()=>{let e=t().pipWindow,r=()=>{e&&os(e.innerWidth)};e&&(e.addEventListener("resize",r),r()),(0,i.Ki)(()=>{e&&e.removeEventListener("resize",r)})}),(()=>{var t=iL();return t.style.setProperty("--tsqd-font-size","16px"),t.style.setProperty("max-height","100vh"),t.style.setProperty("height","100vh"),t.style.setProperty("width","100vw"),(0,i.Yr)(t,()=>e.children),(0,i.gb)(()=>(0,i.s7)(t,H(o().panel,(()=>{let{colors:e}=nw,t=(e,t)=>"dark"===r()?t:e;return 796>oa()?n`
        flex-direction: column;
        background-color: ${t(e.gray[300],e.gray[600])};
      `:n`
      flex-direction: row;
      background-color: ${t(e.gray[200],e.darkGray[900])};
    `})(),{[n`
            min-width: min-content;
          `]:700>oa()},"tsqd-main-panel"))),t})()},of=e=>{let t,r=S(),n=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,o=(0,i.To)(()=>"dark"===r()?oD(n):oF(n));return(0,i.Rc)(()=>{_(t,({width:e},r)=>{r===t&&os(e)})}),(()=>{var l=iL(),a=t;return"function"==typeof a?(0,i.Yx)(a,l):t=l,l.style.setProperty("--tsqd-font-size","16px"),(0,i.Yr)(l,()=>e.children),(0,i.gb)(()=>(0,i.s7)(l,H(o().parentPanel,(()=>{let{colors:e}=nw,t=(e,t)=>"dark"===r()?t:e;return 796>oa()?n`
        flex-direction: column;
        background-color: ${t(e.gray[300],e.gray[600])};
      `:n`
      flex-direction: row;
      background-color: ${t(e.gray[200],e.darkGray[900])};
    `})(),{[n`
            min-width: min-content;
          `]:700>oa()},"tsqd-main-panel"))),l})()},op=e=>{let t,r=S(),n=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,o=(0,i.To)(()=>"dark"===r()?oD(n):oF(n)),[l,a]=(0,i.n5)(!1),s=(0,i.To)(()=>e.localStore.position||m().position||p),d=t=>{let r=t.currentTarget.parentElement;if(!r)return;a(!0);let{height:n,width:o}=r.getBoundingClientRect(),d=t.clientX,u=t.clientY,c=0,g=(0,i.mO)(3.5),f=(0,i.mO)(12),p=t=>{if(t.preventDefault(),"left"===s()||"right"===s()){(c=Math.round(o+("right"===s()?d-t.clientX:t.clientX-d)))<f&&(c=f),e.setLocalStore("width",String(Math.round(c)));let n=r.getBoundingClientRect().width;Number(e.localStore.width)<n&&e.setLocalStore("width",String(n))}else(c=Math.round(n+("bottom"===s()?u-t.clientY:t.clientY-u)))<g&&(c=g,oi(null)),e.setLocalStore("height",String(Math.round(c)))},h=()=>{l()&&a(!1),document.removeEventListener("mousemove",p,!1),document.removeEventListener("mouseUp",h,!1)};document.addEventListener("mousemove",p,!1),document.addEventListener("mouseup",h,!1)};return(0,i.Rc)(()=>{_(t,({width:e},r)=>{r===t&&os(e)})}),(0,i.EH)(()=>{let r=t.parentElement?.parentElement?.parentElement;if(!r)return;let n=e.localStore.position||p,o=(0,i.zZ)("padding",n),l="left"===e.localStore.position||"right"===e.localStore.position,a=(({padding:e,paddingTop:t,paddingBottom:r,paddingLeft:n,paddingRight:i})=>({padding:e,paddingTop:t,paddingBottom:r,paddingLeft:n,paddingRight:i}))(r.style);r.style[o]=`${l?e.localStore.width:e.localStore.height}px`,(0,i.Ki)(()=>{Object.entries(a).forEach(([e,t])=>{r.style[e]=t})})}),(()=>{var l=iF(),a=l.firstChild,u=a.nextSibling,c=t;return"function"==typeof c?(0,i.Yx)(c,l):t=l,a.$$mousedown=d,u.$$click=()=>e.setLocalStore("open","false"),(0,i.Yr)(u,(0,i.a0)(nV,{})),(0,i.Yr)(l,(0,i.a0)(oh,e),null),(0,i.gb)(t=>{var d=H(o().panel,o()[`panel-position-${s()}`],(()=>{let{colors:e}=nw,t=(e,t)=>"dark"===r()?t:e;return 796>oa()?n`
        flex-direction: column;
        background-color: ${t(e.gray[300],e.gray[600])};
      `:n`
      flex-direction: row;
      background-color: ${t(e.gray[200],e.darkGray[900])};
    `})(),{[n`
            min-width: min-content;
          `]:700>oa()&&("right"===s()||"left"===s())},"tsqd-main-panel"),c="bottom"===s()||"top"===s()?`${e.localStore.height||500}px`:"auto",g="right"===s()||"left"===s()?`${e.localStore.width||500}px`:"auto",f=H(o().dragHandle,o()[`dragHandle-position-${s()}`],"tsqd-drag-handle"),p=H(o().closeBtn,o()[`closeBtn-position-${s()}`],"tsqd-minimize-btn");return d!==t.e&&(0,i.s7)(l,t.e=d),c!==t.t&&(null!=(t.t=c)?l.style.setProperty("height",c):l.style.removeProperty("height")),g!==t.a&&(null!=(t.a=g)?l.style.setProperty("width",g):l.style.removeProperty("width")),f!==t.o&&(0,i.s7)(a,t.o=f),p!==t.i&&(0,i.s7)(u,t.i=p),t},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),l})()},oh=e=>{let t;oS(),oE();let r=S(),n=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,o=(0,i.To)(()=>"dark"===r()?oD(n):oF(n)),l=k(),[a,s]=(0,i.n5)("queries"),d=(0,i.To)(()=>e.localStore.sort||v),u=(0,i.To)(()=>Number(e.localStore.sortOrder)||1),c=(0,i.To)(()=>e.localStore.mutationSort||y),g=(0,i.To)(()=>Number(e.localStore.mutationSortOrder)||1),f=(0,i.To)(()=>i.O$[d()]),p=(0,i.To)(()=>i.bs[c()]),h=(0,i.To)(()=>m().onlineManager),b=(0,i.To)(()=>m().client.getQueryCache()),w=(0,i.To)(()=>m().client.getMutationCache()),x=oC(e=>e().getAll().length,!1),$=(0,i.To)((0,i.on)(()=>[x(),e.localStore.filter,d(),u(),e.localStore.hideDisabledQueries],()=>{let t=b().getAll(),r=e.localStore.filter?t.filter(t=>T(t.queryHash,e.localStore.filter||"").passed):[...t];return"true"===e.localStore.hideDisabledQueries&&(r=r.filter(e=>!e.isDisabled())),f()?r.sort((e,t)=>f()(e,t)*u()):r})),C=oT(e=>e().getAll().length,!1),q=(0,i.To)((0,i.on)(()=>[C(),e.localStore.mutationFilter,c(),g()],()=>{let t=w().getAll(),r=e.localStore.mutationFilter?t.filter(t=>T(`${t.options.mutationKey?JSON.stringify(t.options.mutationKey)+" - ":""}${new Date(t.state.submittedAt).toLocaleString()}`,e.localStore.mutationFilter||"").passed):[...t];return p()?r.sort((e,t)=>p()(e,t)*g()):r})),E=t=>{e.setLocalStore("position",t)},M=e=>{let r=getComputedStyle(t).getPropertyValue("--tsqd-font-size");e.style.setProperty("--tsqd-font-size",r)};return[(()=>{var r=iX(),f=r.firstChild,p=f.firstChild,v=p.firstChild,y=v.firstChild,x=y.nextSibling,k=x.firstChild,S=f.nextSibling,C=S.firstChild,T=C.firstChild,L=T.firstChild,F=T.nextSibling,D=F.nextSibling,z=C.nextSibling,A=z.firstChild,O=A.nextSibling,I=t;return"function"==typeof I?(0,i.Yx)(I,r):t=r,v.$$click=()=>{if(!l().pipWindow&&!e.showPanelViewOnly)return void e.setLocalStore("open","false");e.onClose&&e.onClose()},(0,i.Yr)(x,()=>m().queryFlavor,k),(0,i.Yr)(x,()=>m().version,null),(0,i.Yr)(p,(0,i.a0)(rg.Root,{get class(){return H(o().viewToggle)},get value(){return a()},onChange:e=>{s(e),oi(null),ol(null)},get children(){return[(0,i.a0)(rg.Item,{value:"queries",class:"tsqd-radio-toggle",get children(){return[(0,i.a0)(rg.ItemInput,{}),(0,i.a0)(rg.ItemControl,{get children(){return(0,i.a0)(rg.ItemIndicator,{})}}),(0,i.a0)(rg.ItemLabel,{title:"Toggle Queries View",children:"Queries"})]}}),(0,i.a0)(rg.Item,{value:"mutations",class:"tsqd-radio-toggle",get children(){return[(0,i.a0)(rg.ItemInput,{}),(0,i.a0)(rg.ItemControl,{get children(){return(0,i.a0)(rg.ItemIndicator,{})}}),(0,i.a0)(rg.ItemLabel,{title:"Toggle Mutations View",children:"Mutations"})]}})]}}),null),(0,i.Yr)(f,(0,i.a0)(i.wv,{get when(){return"queries"===a()},get children(){return(0,i.a0)(ob,{})}}),null),(0,i.Yr)(f,(0,i.a0)(i.wv,{get when(){return"mutations"===a()},get children(){return(0,i.a0)(om,{})}}),null),(0,i.Yr)(T,(0,i.a0)(nY,{}),L),L.$$input=t=>{"queries"===a()?e.setLocalStore("filter",t.currentTarget.value):e.setLocalStore("mutationFilter",t.currentTarget.value)},(0,i.Yr)(F,(0,i.a0)(i.wv,{get when(){return"queries"===a()},get children(){var K=iD();return K.addEventListener("change",t=>{e.setLocalStore("sort",t.currentTarget.value)}),(0,i.Yr)(K,()=>Object.keys(i.O$).map(e=>(()=>{var t=iJ();return t.firstChild,t.value=e,(0,i.Yr)(t,e,null),t})())),(0,i.gb)(()=>K.value=d()),K}}),null),(0,i.Yr)(F,(0,i.a0)(i.wv,{get when(){return"mutations"===a()},get children(){var P=iz();return P.addEventListener("change",t=>{e.setLocalStore("mutationSort",t.currentTarget.value)}),(0,i.Yr)(P,()=>Object.keys(i.bs).map(e=>(()=>{var t=iJ();return t.firstChild,t.value=e,(0,i.Yr)(t,e,null),t})())),(0,i.gb)(()=>P.value=c()),P}}),null),(0,i.Yr)(F,(0,i.a0)(nV,{}),null),D.$$click=()=>{"queries"===a()?e.setLocalStore("sortOrder",String(-1*u())):e.setLocalStore("mutationSortOrder",String(-1*g()))},(0,i.Yr)(D,(0,i.a0)(i.wv,{get when(){return("queries"===a()?u():g())===1},get children(){return[iA(),(0,i.a0)(nj,{})]}}),null),(0,i.Yr)(D,(0,i.a0)(i.wv,{get when(){return("queries"===a()?u():g())===-1},get children(){return[iO(),(0,i.a0)(n_,{})]}}),null),A.$$click=()=>{"queries"===a()?(oM({type:"CLEAR_QUERY_CACHE"}),b().clear()):(oM({type:"CLEAR_MUTATION_CACHE"}),w().clear())},(0,i.Yr)(A,(0,i.a0)(nN,{})),O.$$click=()=>{h().setOnline(!h().isOnline())},(0,i.Yr)(O,(()=>{var e=(0,i.ph)(()=>!!od());return()=>e()?(0,i.a0)(n1,{}):(0,i.a0)(n0,{})})()),(0,i.Yr)(z,(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>!l().pipWindow)()&&!l().disabled},get children(){var B=iI();return B.$$click=()=>{l().requestPipWindow(Number(window.innerWidth),Number(e.localStore.height??500))},(0,i.Yr)(B,(0,i.a0)(n5,{})),(0,i.gb)(()=>(0,i.s7)(B,H(o().actionsBtn,"tsqd-actions-btn","tsqd-action-open-pip"))),B}}),null),(0,i.Yr)(z,(0,i.a0)(nv.Root,{gutter:4,get children(){return[(0,i.a0)(nv.Trigger,{get class(){return H(o().actionsBtn,"tsqd-actions-btn","tsqd-action-settings")},get children(){return(0,i.a0)(n2,{})}}),(0,i.a0)(nv.Portal,{ref:e=>M(e),get mount(){return(0,i.ph)(()=>!!l().pipWindow)()?l().pipWindow.document.body:document.body},get children(){return(0,i.a0)(nv.Content,{get class(){return H(o().settingsMenu,"tsqd-settings-menu")},get children(){return[(()=>{var e=iK();return(0,i.gb)(()=>(0,i.s7)(e,H(o().settingsMenuHeader,"tsqd-settings-menu-header"))),e})(),(0,i.a0)(i.wv,{get when(){return!e.showPanelViewOnly},get children(){return(0,i.a0)(nv.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[(0,i.a0)(nv.SubTrigger,{get class(){return H(o().settingsSubTrigger,"tsqd-settings-menu-sub-trigger","tsqd-settings-menu-sub-trigger-position")},get children(){return[iP(),(0,i.a0)(nV,{})]}}),(0,i.a0)(nv.Portal,{ref:e=>M(e),get mount(){return(0,i.ph)(()=>!!l().pipWindow)()?l().pipWindow.document.body:document.body},get children(){return(0,i.a0)(nv.SubContent,{get class(){return H(o().settingsMenu,"tsqd-settings-submenu")},get children(){return[(0,i.a0)(nv.Item,{onSelect:()=>{E("top")},as:"button",get class(){return H(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-top")},get children(){return[iB(),(0,i.a0)(nj,{})]}}),(0,i.a0)(nv.Item,{onSelect:()=>{E("bottom")},as:"button",get class(){return H(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-bottom")},get children(){return[iH(),(0,i.a0)(n_,{})]}}),(0,i.a0)(nv.Item,{onSelect:()=>{E("left")},as:"button",get class(){return H(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-left")},get children(){return[iR(),(0,i.a0)(nQ,{})]}}),(0,i.a0)(nv.Item,{onSelect:()=>{E("right")},as:"button",get class(){return H(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-right")},get children(){return[iG(),(0,i.a0)(nW,{})]}})]}})}})]}})}}),(0,i.a0)(nv.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[(0,i.a0)(nv.SubTrigger,{get class(){return H(o().settingsSubTrigger,"tsqd-settings-menu-sub-trigger","tsqd-settings-menu-sub-trigger-position")},get children(){return[iU(),(0,i.a0)(nV,{})]}}),(0,i.a0)(nv.Portal,{ref:e=>M(e),get mount(){return(0,i.ph)(()=>!!l().pipWindow)()?l().pipWindow.document.body:document.body},get children(){return(0,i.a0)(nv.SubContent,{get class(){return H(o().settingsMenu,"tsqd-settings-submenu")},get children(){return[(0,i.a0)(nv.Item,{onSelect:()=>{e.setLocalStore("theme_preference","light")},as:"button",get class(){return H(o().settingsSubButton,"light"===e.localStore.theme_preference&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-top")},get children(){return[iY(),(0,i.a0)(nZ,{})]}}),(0,i.a0)(nv.Item,{onSelect:()=>{e.setLocalStore("theme_preference","dark")},as:"button",get class(){return H(o().settingsSubButton,"dark"===e.localStore.theme_preference&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-bottom")},get children(){return[iN(),(0,i.a0)(nX,{})]}}),(0,i.a0)(nv.Item,{onSelect:()=>{e.setLocalStore("theme_preference","system")},as:"button",get class(){return H(o().settingsSubButton,"system"===e.localStore.theme_preference&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-left")},get children(){return[iV(),(0,i.a0)(nJ,{})]}})]}})}})]}}),(0,i.a0)(nv.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[(0,i.a0)(nv.SubTrigger,{get class(){return H(o().settingsSubTrigger,"tsqd-settings-menu-sub-trigger","tsqd-settings-menu-sub-trigger-disabled-queries")},get children(){return[ij(),(0,i.a0)(nV,{})]}}),(0,i.a0)(nv.Portal,{ref:e=>M(e),get mount(){return(0,i.ph)(()=>!!l().pipWindow)()?l().pipWindow.document.body:document.body},get children(){return(0,i.a0)(nv.SubContent,{get class(){return H(o().settingsMenu,"tsqd-settings-submenu")},get children(){return[(0,i.a0)(nv.Item,{onSelect:()=>{e.setLocalStore("hideDisabledQueries","false")},as:"button",get class(){return H(o().settingsSubButton,"true"!==e.localStore.hideDisabledQueries&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-show")},get children(){return[i_(),(0,i.a0)(i.wv,{get when(){return"true"!==e.localStore.hideDisabledQueries},get children(){return(0,i.a0)(ie,{})}})]}}),(0,i.a0)(nv.Item,{onSelect:()=>{e.setLocalStore("hideDisabledQueries","true")},as:"button",get class(){return H(o().settingsSubButton,"true"===e.localStore.hideDisabledQueries&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-hide")},get children(){return[iQ(),(0,i.a0)(i.wv,{get when(){return"true"===e.localStore.hideDisabledQueries},get children(){return(0,i.a0)(ie,{})}})]}})]}})}})]}})]}})}})]}}),null),(0,i.Yr)(r,(0,i.a0)(i.wv,{get when(){return"queries"===a()},get children(){var R=iW(),G=R.firstChild;return(0,i.Yr)(G,(0,i.a0)(j,{by:e=>e.queryHash,get each(){return $()},children:e=>(0,i.a0)(ov,{get query(){return e()}})})),(0,i.gb)(()=>(0,i.s7)(R,H(o().overflowQueryContainer,"tsqd-queries-overflow-container"))),R}}),null),(0,i.Yr)(r,(0,i.a0)(i.wv,{get when(){return"mutations"===a()},get children(){var U=iZ(),Y=U.firstChild;return(0,i.Yr)(Y,(0,i.a0)(j,{by:e=>e.mutationId,get each(){return q()},children:e=>(0,i.a0)(oy,{get mutation(){return e()}})})),(0,i.gb)(()=>(0,i.s7)(U,H(o().overflowQueryContainer,"tsqd-mutations-overflow-container"))),U}}),null),(0,i.gb)(e=>{var t=H(o().queriesContainer,796>oa()&&(on()||oo())&&n`
              height: 50%;
              max-height: 50%;
            `,796>oa()&&!(on()||oo())&&n`
              height: 100%;
              max-height: 100%;
            `,"tsqd-queries-container"),l=H(o().row,"tsqd-header"),s=o().logoAndToggleContainer,d=H(o().logo,"tsqd-text-logo-container"),c=H(o().tanstackLogo,"tsqd-text-logo-tanstack"),h=H(o().queryFlavorLogo,"tsqd-text-logo-query-flavor"),b=H(o().row,"tsqd-filters-actions-container"),m=H(o().filtersContainer,"tsqd-filters-container"),w=H(o().filterInput,"tsqd-query-filter-textfield-container"),k=H("tsqd-query-filter-textfield"),$=H(o().filterSelect,"tsqd-query-filter-sort-container"),q=`Sort order ${("queries"===a()?u():g())===-1?"descending":"ascending"}`,E=("queries"===a()?u():g())===-1,M=H(o().actionsContainer,"tsqd-actions-container"),I=H(o().actionsBtn,"tsqd-actions-btn","tsqd-action-clear-cache"),K=`Clear ${a()} cache`,P=H(o().actionsBtn,od()&&o().actionsBtnOffline,"tsqd-actions-btn","tsqd-action-mock-offline-behavior"),B=`${od()?"Unset offline mocking behavior":"Mock offline behavior"}`,R=od(),G=`${od()?"Unset offline mocking behavior":"Mock offline behavior"}`;return t!==e.e&&(0,i.s7)(r,e.e=t),l!==e.t&&(0,i.s7)(f,e.t=l),s!==e.a&&(0,i.s7)(p,e.a=s),d!==e.o&&(0,i.s7)(v,e.o=d),c!==e.i&&(0,i.s7)(y,e.i=c),h!==e.n&&(0,i.s7)(x,e.n=h),b!==e.s&&(0,i.s7)(S,e.s=b),m!==e.h&&(0,i.s7)(C,e.h=m),w!==e.r&&(0,i.s7)(T,e.r=w),k!==e.d&&(0,i.s7)(L,e.d=k),$!==e.l&&(0,i.s7)(F,e.l=$),q!==e.u&&(0,i.Bq)(D,"aria-label",e.u=q),E!==e.c&&(0,i.Bq)(D,"aria-pressed",e.c=E),M!==e.w&&(0,i.s7)(z,e.w=M),I!==e.m&&(0,i.s7)(A,e.m=I),K!==e.f&&(0,i.Bq)(A,"title",e.f=K),P!==e.y&&(0,i.s7)(O,e.y=P),B!==e.g&&(0,i.Bq)(O,"aria-label",e.g=B),R!==e.p&&(0,i.Bq)(O,"aria-pressed",e.p=R),G!==e.b&&(0,i.Bq)(O,"title",e.b=G),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0}),(0,i.gb)(()=>L.value="queries"===a()?e.localStore.filter||"":e.localStore.mutationFilter||""),r})(),(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>"queries"===a())()&&on()},get children(){return(0,i.a0)(ox,{})}}),(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>"mutations"===a())()&&oo()},get children(){return(0,i.a0)(ok,{})}})]},ov=e=>{let t=S(),r=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,n=(0,i.To)(()=>"dark"===t()?oD(r):oF(r)),{colors:o,alpha:l}=nw,a=(e,r)=>"dark"===t()?r:e,s=oC(t=>t().find({queryKey:e.query.queryKey})?.state,!0,t=>t.query.queryHash===e.query.queryHash),d=oC(t=>t().find({queryKey:e.query.queryKey})?.isDisabled()??!1,!0,t=>t.query.queryHash===e.query.queryHash),u=oC(t=>t().find({queryKey:e.query.queryKey})?.isStatic()??!1,!0,t=>t.query.queryHash===e.query.queryHash),c=oC(t=>t().find({queryKey:e.query.queryKey})?.isStale()??!1,!0,t=>t.query.queryHash===e.query.queryHash),g=oC(t=>t().find({queryKey:e.query.queryKey})?.getObserversCount()??0,!0,t=>t.query.queryHash===e.query.queryHash),f=(0,i.To)(()=>(0,i.MI)({queryState:s(),observerCount:g(),isStale:c()}));return(0,i.a0)(i.wv,{get when(){return s()},get children(){var p=i2(),h=p.firstChild,v=h.nextSibling;return p.$$click=()=>oi(e.query.queryHash===on()?null:e.query.queryHash),(0,i.Yr)(h,g),(0,i.Yr)(v,()=>e.query.queryHash),(0,i.Yr)(p,(0,i.a0)(i.wv,{get when(){return d()},get children(){return i0()}}),null),(0,i.Yr)(p,(0,i.a0)(i.wv,{get when(){return u()},get children(){return i1()}}),null),(0,i.gb)(t=>{var s=H(n().queryRow,on()===e.query.queryHash&&n().selectedQueryRow,"tsqd-query-row"),d=`Query key ${e.query.queryHash}`,u=H("gray"===f()?r`
        background-color: ${a(o[f()][200],o[f()][700])};
        color: ${a(o[f()][700],o[f()][300])};
      `:r`
      background-color: ${a(o[f()][200]+l[80],o[f()][900])};
      color: ${a(o[f()][800],o[f()][300])};
    `,"tsqd-query-observer-count");return s!==t.e&&(0,i.s7)(p,t.e=s),d!==t.t&&(0,i.Bq)(p,"aria-label",t.t=d),u!==t.a&&(0,i.s7)(h,t.a=u),t},{e:void 0,t:void 0,a:void 0}),p}})},oy=e=>{let t=S(),r=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,n=(0,i.To)(()=>"dark"===t()?oD(r):oF(r)),{colors:o,alpha:l}=nw,a=(e,r)=>"dark"===t()?r:e,s=oT(t=>{let r=t().getAll().find(t=>t.mutationId===e.mutation.mutationId);return r?.state}),d=oT(t=>{let r=t().getAll().find(t=>t.mutationId===e.mutation.mutationId);return!!r&&r.state.isPaused}),u=oT(t=>{let r=t().getAll().find(t=>t.mutationId===e.mutation.mutationId);return r?r.state.status:"idle"}),c=(0,i.To)(()=>(0,i.TH)({isPaused:d(),status:u()}));return(0,i.a0)(i.wv,{get when(){return s()},get children(){var g=i2(),f=g.firstChild,p=f.nextSibling;return g.$$click=()=>{ol(e.mutation.mutationId===oo()?null:e.mutation.mutationId)},(0,i.Yr)(f,(0,i.a0)(i.wv,{get when(){return"purple"===c()},get children(){return(0,i.a0)(ii,{})}}),null),(0,i.Yr)(f,(0,i.a0)(i.wv,{get when(){return"green"===c()},get children(){return(0,i.a0)(ie,{})}}),null),(0,i.Yr)(f,(0,i.a0)(i.wv,{get when(){return"red"===c()},get children(){return(0,i.a0)(ir,{})}}),null),(0,i.Yr)(f,(0,i.a0)(i.wv,{get when(){return"yellow"===c()},get children(){return(0,i.a0)(it,{})}}),null),(0,i.Yr)(p,(0,i.a0)(i.wv,{get when(){return e.mutation.options.mutationKey},get children(){return[(0,i.ph)(()=>JSON.stringify(e.mutation.options.mutationKey))," -"," "]}}),null),(0,i.Yr)(p,()=>new Date(e.mutation.state.submittedAt).toLocaleString(),null),(0,i.gb)(t=>{var s=H(n().queryRow,oo()===e.mutation.mutationId&&n().selectedQueryRow,"tsqd-query-row"),d=`Mutation submitted at ${new Date(e.mutation.state.submittedAt).toLocaleString()}`,u=H("gray"===c()?r`
        background-color: ${a(o[c()][200],o[c()][700])};
        color: ${a(o[c()][700],o[c()][300])};
      `:r`
      background-color: ${a(o[c()][200]+l[80],o[c()][900])};
      color: ${a(o[c()][800],o[c()][300])};
    `,"tsqd-query-observer-count");return s!==t.e&&(0,i.s7)(g,t.e=s),d!==t.t&&(0,i.Bq)(g,"aria-label",t.t=d),u!==t.a&&(0,i.s7)(f,t.a=u),t},{e:void 0,t:void 0,a:void 0}),g}})},ob=()=>{let e=oC(e=>e().getAll().filter(e=>"stale"===(0,i.lR)(e)).length),t=oC(e=>e().getAll().filter(e=>"fresh"===(0,i.lR)(e)).length),r=oC(e=>e().getAll().filter(e=>"fetching"===(0,i.lR)(e)).length),n=oC(e=>e().getAll().filter(e=>"paused"===(0,i.lR)(e)).length),o=oC(e=>e().getAll().filter(e=>"inactive"===(0,i.lR)(e)).length),l=S(),a=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,s=(0,i.To)(()=>"dark"===l()?oD(a):oF(a));return(()=>{var l=iL();return(0,i.Yr)(l,(0,i.a0)(ow,{label:"Fresh",color:"green",get count(){return t()}}),null),(0,i.Yr)(l,(0,i.a0)(ow,{label:"Fetching",color:"blue",get count(){return r()}}),null),(0,i.Yr)(l,(0,i.a0)(ow,{label:"Paused",color:"purple",get count(){return n()}}),null),(0,i.Yr)(l,(0,i.a0)(ow,{label:"Stale",color:"yellow",get count(){return e()}}),null),(0,i.Yr)(l,(0,i.a0)(ow,{label:"Inactive",color:"gray",get count(){return o()}}),null),(0,i.gb)(()=>(0,i.s7)(l,H(s().queryStatusContainer,"tsqd-query-status-container"))),l})()},om=()=>{let e=oT(e=>e().getAll().filter(e=>"green"===(0,i.TH)({isPaused:e.state.isPaused,status:e.state.status})).length),t=oT(e=>e().getAll().filter(e=>"yellow"===(0,i.TH)({isPaused:e.state.isPaused,status:e.state.status})).length),r=oT(e=>e().getAll().filter(e=>"purple"===(0,i.TH)({isPaused:e.state.isPaused,status:e.state.status})).length),n=oT(e=>e().getAll().filter(e=>"red"===(0,i.TH)({isPaused:e.state.isPaused,status:e.state.status})).length),o=S(),l=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,a=(0,i.To)(()=>"dark"===o()?oD(l):oF(l));return(()=>{var o=iL();return(0,i.Yr)(o,(0,i.a0)(ow,{label:"Paused",color:"purple",get count(){return r()}}),null),(0,i.Yr)(o,(0,i.a0)(ow,{label:"Pending",color:"yellow",get count(){return t()}}),null),(0,i.Yr)(o,(0,i.a0)(ow,{label:"Success",color:"green",get count(){return e()}}),null),(0,i.Yr)(o,(0,i.a0)(ow,{label:"Error",color:"red",get count(){return n()}}),null),(0,i.gb)(()=>(0,i.s7)(o,H(a().queryStatusContainer,"tsqd-query-status-container"))),o})()},ow=e=>{let t,r=S(),n=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,o=(0,i.To)(()=>"dark"===r()?oD(n):oF(n)),{colors:l,alpha:a}=nw,s=(e,t)=>"dark"===r()?t:e,[d,u]=(0,i.n5)(!1),[c,g]=(0,i.n5)(!1),f=(0,i.To)(()=>!(on()&&1024>oa()&&oa()>796||796>oa()));return(()=>{var r=i4(),p=r.firstChild,h=p.nextSibling,v=t;return"function"==typeof v?(0,i.Yx)(v,r):t=r,r.addEventListener("mouseleave",()=>{u(!1),g(!1)}),r.addEventListener("mouseenter",()=>u(!0)),r.addEventListener("blur",()=>g(!1)),r.addEventListener("focus",()=>g(!0)),(0,i.il)(r,(0,i.v6)({get disabled(){return f()},get class(){return H(o().queryStatusTag,!f()&&n`
            cursor: pointer;
            &:hover {
              background: ${s(l.gray[200],l.darkGray[400])}${a[80]};
            }
          `,"tsqd-query-status-tag",`tsqd-query-status-tag-${e.label.toLowerCase()}`)}},()=>d()||c()?{"aria-describedby":"tsqd-status-tooltip"}:{}),!1,!0),(0,i.Yr)(r,(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>!f())()&&(d()||c())},get children(){var y=i5();return(0,i.Yr)(y,()=>e.label),(0,i.gb)(()=>(0,i.s7)(y,H(o().statusTooltip,"tsqd-query-status-tooltip"))),y}}),p),(0,i.Yr)(r,(0,i.a0)(i.wv,{get when(){return f()},get children(){var b=i3();return(0,i.Yr)(b,()=>e.label),(0,i.gb)(()=>(0,i.s7)(b,H(o().queryStatusTagLabel,"tsqd-query-status-tag-label"))),b}}),h),(0,i.Yr)(h,()=>e.count),(0,i.gb)(t=>{var r=H(n`
            width: ${nw.size[1.5]};
            height: ${nw.size[1.5]};
            border-radius: ${nw.border.radius.full};
            background-color: ${nw.colors[e.color][500]};
          `,"tsqd-query-status-tag-dot"),a=H(o().queryStatusCount,e.count>0&&"gray"!==e.color&&n`
              background-color: ${s(l[e.color][100],l[e.color][900])};
              color: ${s(l[e.color][700],l[e.color][300])};
            `,"tsqd-query-status-tag-count");return r!==t.e&&(0,i.s7)(p,t.e=r),a!==t.t&&(0,i.s7)(h,t.t=a),t},{e:void 0,t:void 0}),r})()},ox=()=>{let e=S(),t=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,r=(0,i.To)(()=>"dark"===e()?oD(t):oF(t)),{colors:n}=nw,o=(t,r)=>"dark"===e()?r:t,l=m().client,[a,s]=(0,i.n5)(!1),[d,u]=(0,i.n5)("view"),[c,g]=(0,i.n5)(!1),f=(0,i.To)(()=>m().errorTypes||[]),p=oC(e=>e().getAll().find(e=>e.queryHash===on()),!1),h=oC(e=>e().getAll().find(e=>e.queryHash===on()),!1),v=oC(e=>e().getAll().find(e=>e.queryHash===on())?.state,!1),y=oC(e=>e().getAll().find(e=>e.queryHash===on())?.state.data,!1),b=oC(e=>{let t=e().getAll().find(e=>e.queryHash===on());return t?(0,i.lR)(t):"inactive"}),w=oC(e=>{let t=e().getAll().find(e=>e.queryHash===on());return t?t.state.status:"pending"}),x=oC(e=>e().getAll().find(e=>e.queryHash===on())?.getObserversCount()??0),k=(0,i.To)(()=>(0,i.ZZ)(b())),$=()=>{oM({type:"REFETCH",queryHash:p()?.queryHash});let e=p()?.fetch();e?.catch(()=>{})},C=e=>{let t=p();if(!t)return;oM({type:"TRIGGER_ERROR",queryHash:t.queryHash,metadata:{error:e?.name}});let r=e?.initializer(t)??Error("Unknown error from devtools"),n=t.options;t.setState({status:"error",error:r,fetchMeta:{...t.state.fetchMeta,__previousQueryOptions:n}})};return(0,i.EH)(()=>{"fetching"!==b()&&s(!1)}),(0,i.a0)(i.wv,{get when(){return(0,i.ph)(()=>!!p())()&&v()},get children(){var q=oe(),E=q.firstChild,T=E.nextSibling,M=T.firstChild,L=M.firstChild,F=L.firstChild,D=L.nextSibling,z=M.nextSibling,A=z.firstChild.nextSibling,O=z.nextSibling.firstChild.nextSibling,I=T.nextSibling,K=I.nextSibling,P=K.firstChild,R=P.firstChild,G=P.nextSibling,U=G.firstChild,Y=G.nextSibling,N=Y.firstChild,V=Y.nextSibling,j=V.firstChild,_=V.nextSibling,Q=_.firstChild,W=Q.nextSibling,Z=K.nextSibling;Z.firstChild;var X=Z.nextSibling,J=X.nextSibling;return(0,i.Yr)(F,()=>(0,i.KN)(p().queryKey,!0)),(0,i.Yr)(D,b),(0,i.Yr)(A,x),(0,i.Yr)(O,()=>new Date(v().dataUpdatedAt).toLocaleTimeString()),P.$$click=$,G.$$click=()=>{oM({type:"INVALIDATE",queryHash:p()?.queryHash}),l.invalidateQueries(p())},Y.$$click=()=>{oM({type:"RESET",queryHash:p()?.queryHash}),l.resetQueries(p())},V.$$click=()=>{oM({type:"REMOVE",queryHash:p()?.queryHash}),l.removeQueries(p()),oi(null)},_.$$click=()=>{if(p()?.state.data===void 0)s(!0),(()=>{let e=p();if(!e)return;oM({type:"RESTORE_LOADING",queryHash:e.queryHash});let t=e.state,r=e.state.fetchMeta?e.state.fetchMeta.__previousQueryOptions:null;e.cancel({silent:!0}),e.setState({...t,fetchStatus:"idle",fetchMeta:null}),r&&e.fetch(r)})();else{let e=p();if(!e)return;oM({type:"TRIGGER_LOADING",queryHash:e.queryHash});let t=e.options;e.fetch({...t,queryFn:()=>new Promise(()=>{}),gcTime:-1}),e.setState({data:void 0,status:"pending",fetchMeta:{...e.state.fetchMeta,__previousQueryOptions:t}})}},(0,i.Yr)(_,()=>"pending"===w()?"Restore":"Trigger",W),(0,i.Yr)(K,(0,i.a0)(i.wv,{get when(){return 0===f().length||"error"===w()},get children(){var ee=i6(),et=ee.firstChild,er=et.nextSibling;return ee.$$click=()=>{p().state.error?(oM({type:"RESTORE_ERROR",queryHash:p()?.queryHash}),l.resetQueries(p())):C()},(0,i.Yr)(ee,()=>"error"===w()?"Restore":"Trigger",er),(0,i.gb)(e=>{var r=H(t`
                  color: ${o(n.red[500],n.red[400])};
                `,"tsqd-query-details-actions-btn","tsqd-query-details-action-error"),l="pending"===w(),a=t`
                  background-color: ${o(n.red[500],n.red[400])};
                `;return r!==e.e&&(0,i.s7)(ee,e.e=r),l!==e.t&&(ee.disabled=e.t=l),a!==e.a&&(0,i.s7)(et,e.a=a),e},{e:void 0,t:void 0,a:void 0}),ee}}),null),(0,i.Yr)(K,(0,i.a0)(i.wv,{get when(){return 0!==f().length&&"error"!==w()},get children(){var en=i7(),ei=en.firstChild,eo=ei.nextSibling.nextSibling;return eo.firstChild,eo.addEventListener("change",e=>{C(f().find(t=>t.name===e.currentTarget.value))}),(0,i.Yr)(eo,(0,i.a0)(i.a,{get each(){return f()},children:e=>(()=>{var t=ot();return(0,i.Yr)(t,()=>e.name),(0,i.gb)(()=>t.value=e.name),t})()}),null),(0,i.Yr)(en,(0,i.a0)(nV,{}),null),(0,i.gb)(e=>{var n=H(r().actionsSelect,"tsqd-query-details-actions-btn","tsqd-query-details-action-error-multiple"),o=t`
                  background-color: ${nw.colors.red[400]};
                `,l="pending"===w();return n!==e.e&&(0,i.s7)(en,e.e=n),o!==e.t&&(0,i.s7)(ei,e.t=o),l!==e.a&&(eo.disabled=e.a=l),e},{e:void 0,t:void 0,a:void 0}),en}}),null),(0,i.Yr)(Z,()=>"view"===d()?"Explorer":"Editor",null),(0,i.Yr)(q,(0,i.a0)(i.wv,{get when(){return"view"===d()},get children(){var el=i9();return(0,i.Yr)(el,(0,i.a0)(iC,{label:"Data",defaultExpanded:["Data"],get value(){return y()},editable:!0,onEdit:()=>u("edit"),get activeQuery(){return p()}})),(0,i.gb)(e=>null!=(e=nw.size[2])?el.style.setProperty("padding",e):el.style.removeProperty("padding")),el}}),X),(0,i.Yr)(q,(0,i.a0)(i.wv,{get when(){return"edit"===d()},get children(){var ea=i8(),es=ea.firstChild,ed=es.nextSibling,eu=ed.firstChild,ec=eu.nextSibling,eg=ec.firstChild,ef=eg.nextSibling;return ea.addEventListener("submit",e=>{e.preventDefault();let t=new FormData(e.currentTarget).get("data");try{let e=JSON.parse(t);p().setState({...p().state,data:e}),u("view")}catch(e){g(!0)}}),es.addEventListener("focus",()=>g(!1)),(0,i.Yr)(eu,()=>c()?"Invalid Value":""),eg.$$click=()=>u("view"),(0,i.gb)(e=>{var l=H(r().devtoolsEditForm,"tsqd-query-details-data-editor"),a=r().devtoolsEditTextarea,s=c(),d=r().devtoolsEditFormActions,u=r().devtoolsEditFormError,g=r().devtoolsEditFormActionContainer,f=H(r().devtoolsEditFormAction,t`
                      color: ${o(n.gray[600],n.gray[300])};
                    `),p=H(r().devtoolsEditFormAction,t`
                      color: ${o(n.blue[600],n.blue[400])};
                    `);return l!==e.e&&(0,i.s7)(ea,e.e=l),a!==e.t&&(0,i.s7)(es,e.t=a),s!==e.a&&(0,i.Bq)(es,"data-error",e.a=s),d!==e.o&&(0,i.s7)(ed,e.o=d),u!==e.i&&(0,i.s7)(eu,e.i=u),g!==e.n&&(0,i.s7)(ec,e.n=g),f!==e.s&&(0,i.s7)(eg,e.s=f),p!==e.h&&(0,i.s7)(ef,e.h=p),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),(0,i.gb)(()=>es.value=JSON.stringify(y(),null,2)),ea}}),X),(0,i.Yr)(J,(0,i.a0)(iC,{label:"Query",defaultExpanded:["Query","queryKey"],get value(){return h()}})),(0,i.gb)(e=>{var l=H(r().detailsContainer,"tsqd-query-details-container"),s=H(r().detailsHeader,"tsqd-query-details-header"),d=H(r().detailsBody,"tsqd-query-details-summary-container"),u=H(r().queryDetailsStatus,"gray"===k()?t`
        background-color: ${o(n[k()][200],n[k()][700])};
        color: ${o(n[k()][700],n[k()][300])};
        border-color: ${o(n[k()][400],n[k()][600])};
      `:t`
      background-color: ${o(n[k()][100],n[k()][900])};
      color: ${o(n[k()][700],n[k()][300])};
      border-color: ${o(n[k()][400],n[k()][600])};
    `),c=H(r().detailsHeader,"tsqd-query-details-header"),g=H(r().actionsBody,"tsqd-query-details-actions-container"),f=H(t`
                color: ${o(n.blue[600],n.blue[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-refetch"),p="fetching"===b(),h=t`
                background-color: ${o(n.blue[600],n.blue[400])};
              `,v=H(t`
                color: ${o(n.yellow[600],n.yellow[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-invalidate"),y="pending"===w(),m=t`
                background-color: ${o(n.yellow[600],n.yellow[400])};
              `,x=H(t`
                color: ${o(n.gray[600],n.gray[300])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-reset"),$="pending"===w(),S=t`
                background-color: ${o(n.gray[600],n.gray[400])};
              `,C=H(t`
                color: ${o(n.pink[500],n.pink[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-remove"),M="fetching"===b(),L=t`
                background-color: ${o(n.pink[500],n.pink[400])};
              `,F=H(t`
                color: ${o(n.cyan[500],n.cyan[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-loading"),z=a(),A=t`
                background-color: ${o(n.cyan[500],n.cyan[400])};
              `,O=H(r().detailsHeader,"tsqd-query-details-header"),B=H(r().detailsHeader,"tsqd-query-details-header"),W=nw.size[2];return l!==e.e&&(0,i.s7)(q,e.e=l),s!==e.t&&(0,i.s7)(E,e.t=s),d!==e.a&&(0,i.s7)(T,e.a=d),u!==e.o&&(0,i.s7)(D,e.o=u),c!==e.i&&(0,i.s7)(I,e.i=c),g!==e.n&&(0,i.s7)(K,e.n=g),f!==e.s&&(0,i.s7)(P,e.s=f),p!==e.h&&(P.disabled=e.h=p),h!==e.r&&(0,i.s7)(R,e.r=h),v!==e.d&&(0,i.s7)(G,e.d=v),y!==e.l&&(G.disabled=e.l=y),m!==e.u&&(0,i.s7)(U,e.u=m),x!==e.c&&(0,i.s7)(Y,e.c=x),$!==e.w&&(Y.disabled=e.w=$),S!==e.m&&(0,i.s7)(N,e.m=S),C!==e.f&&(0,i.s7)(V,e.f=C),M!==e.y&&(V.disabled=e.y=M),L!==e.g&&(0,i.s7)(j,e.g=L),F!==e.p&&(0,i.s7)(_,e.p=F),z!==e.b&&(_.disabled=e.b=z),A!==e.T&&(0,i.s7)(Q,e.T=A),O!==e.A&&(0,i.s7)(Z,e.A=O),B!==e.O&&(0,i.s7)(X,e.O=B),W!==e.I&&(null!=(e.I=W)?J.style.setProperty("padding",W):J.style.removeProperty("padding")),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0,T:void 0,A:void 0,O:void 0,I:void 0}),q}})},ok=()=>{let e=S(),t=m().shadowDOMTarget?B.bind({target:m().shadowDOMTarget}):B,r=(0,i.To)(()=>"dark"===e()?oD(t):oF(t)),{colors:n}=nw,o=(t,r)=>"dark"===e()?r:t,l=oT(e=>{let t=e().getAll().find(e=>e.mutationId===oo());return!!t&&t.state.isPaused}),a=oT(e=>{let t=e().getAll().find(e=>e.mutationId===oo());return t?t.state.status:"idle"}),s=(0,i.To)(()=>(0,i.TH)({isPaused:l(),status:a()})),d=oT(e=>e().getAll().find(e=>e.mutationId===oo()),!1);return(0,i.a0)(i.wv,{get when(){return d()},get children(){var u=or(),c=u.firstChild,g=c.nextSibling,f=g.firstChild,p=f.firstChild,h=p.firstChild,v=p.nextSibling,y=f.nextSibling.firstChild.nextSibling,b=g.nextSibling,w=b.nextSibling,x=w.nextSibling,k=x.nextSibling,$=k.nextSibling,C=$.nextSibling,q=C.nextSibling,E=q.nextSibling;return(0,i.Yr)(h,(0,i.a0)(i.wv,{get when(){return d().options.mutationKey},fallback:"No mutationKey found",get children(){return(0,i.KN)(d().options.mutationKey,!0)}})),(0,i.Yr)(v,(0,i.a0)(i.wv,{get when(){return"purple"===s()},children:"pending"}),null),(0,i.Yr)(v,(0,i.a0)(i.wv,{get when(){return"purple"!==s()},get children(){return a()}}),null),(0,i.Yr)(y,()=>new Date(d().state.submittedAt).toLocaleTimeString()),(0,i.Yr)(w,(0,i.a0)(iC,{label:"Variables",defaultExpanded:["Variables"],get value(){return d().state.variables}})),(0,i.Yr)(k,(0,i.a0)(iC,{label:"Context",defaultExpanded:["Context"],get value(){return d().state.context}})),(0,i.Yr)(C,(0,i.a0)(iC,{label:"Data",defaultExpanded:["Data"],get value(){return d().state.data}})),(0,i.Yr)(E,(0,i.a0)(iC,{label:"Mutation",defaultExpanded:["Mutation"],get value(){return d()}})),(0,i.gb)(e=>{var l=H(r().detailsContainer,"tsqd-query-details-container"),a=H(r().detailsHeader,"tsqd-query-details-header"),d=H(r().detailsBody,"tsqd-query-details-summary-container"),f=H(r().queryDetailsStatus,"gray"===s()?t`
        background-color: ${o(n[s()][200],n[s()][700])};
        color: ${o(n[s()][700],n[s()][300])};
        border-color: ${o(n[s()][400],n[s()][600])};
      `:t`
      background-color: ${o(n[s()][100],n[s()][900])};
      color: ${o(n[s()][700],n[s()][300])};
      border-color: ${o(n[s()][400],n[s()][600])};
    `),p=H(r().detailsHeader,"tsqd-query-details-header"),h=nw.size[2],y=H(r().detailsHeader,"tsqd-query-details-header"),m=nw.size[2],S=H(r().detailsHeader,"tsqd-query-details-header"),T=nw.size[2],M=H(r().detailsHeader,"tsqd-query-details-header"),L=nw.size[2];return l!==e.e&&(0,i.s7)(u,e.e=l),a!==e.t&&(0,i.s7)(c,e.t=a),d!==e.a&&(0,i.s7)(g,e.a=d),f!==e.o&&(0,i.s7)(v,e.o=f),p!==e.i&&(0,i.s7)(b,e.i=p),h!==e.n&&(null!=(e.n=h)?w.style.setProperty("padding",h):w.style.removeProperty("padding")),y!==e.s&&(0,i.s7)(x,e.s=y),m!==e.h&&(null!=(e.h=m)?k.style.setProperty("padding",m):k.style.removeProperty("padding")),S!==e.r&&(0,i.s7)($,e.r=S),T!==e.d&&(null!=(e.d=T)?C.style.setProperty("padding",T):C.style.removeProperty("padding")),M!==e.l&&(0,i.s7)(q,e.l=M),L!==e.u&&(null!=(e.u=L)?E.style.setProperty("padding",L):E.style.removeProperty("padding")),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0}),u}})},o$=new Map,oS=()=>{let e=(0,i.To)(()=>m().client.getQueryCache()),t=e().subscribe(t=>{(0,i.vA)(()=>{for(let[r,n]of o$.entries())n.shouldUpdate(t)&&n.setter(r(e))})});return(0,i.Ki)(()=>{o$.clear(),t()}),t},oC=(e,t=!0,r=()=>!0)=>{let n=(0,i.To)(()=>m().client.getQueryCache()),[o,l]=(0,i.n5)(e(n),t?void 0:{equals:!1});return(0,i.EH)(()=>{l(e(n))}),o$.set(e,{setter:l,shouldUpdate:r}),(0,i.Ki)(()=>{o$.delete(e)}),o},oq=new Map,oE=()=>{let e=(0,i.To)(()=>m().client.getMutationCache()),t=e().subscribe(()=>{for(let[t,r]of oq.entries())queueMicrotask(()=>{r(t(e))})});return(0,i.Ki)(()=>{oq.clear(),t()}),t},oT=(e,t=!0)=>{let r=(0,i.To)(()=>m().client.getMutationCache()),[n,o]=(0,i.n5)(e(r),t?void 0:{equals:!1});return(0,i.EH)(()=>{o(e(r))}),oq.set(e,o),(0,i.Ki)(()=>{oq.delete(e)}),n},oM=({type:e,queryHash:t,metadata:r})=>{let n=new CustomEvent("@tanstack/query-devtools-event",{detail:{type:e,queryHash:t,metadata:r},bubbles:!0,cancelable:!0});window.dispatchEvent(n)},oL=(e,t)=>{let{colors:r,font:n,size:i,alpha:o,shadow:l,border:a}=nw,s=(t,r)=>"light"===e?t:r;return{devtoolsBtn:t`
      z-index: 100000;
      position: fixed;
      padding: 4px;
      text-align: left;

      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      box-shadow: ${l.md()};
      overflow: hidden;

      & div {
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        border-radius: 9999px;

        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        filter: blur(6px) saturate(1.2) contrast(1.1);
      }

      &:focus-within {
        outline-offset: 2px;
        outline: 3px solid ${r.green[600]};
      }

      & button {
        position: relative;
        z-index: 1;
        padding: 0;
        border-radius: 9999px;
        background-color: transparent;
        border: none;
        height: 40px;
        display: flex;
        width: 40px;
        overflow: hidden;
        cursor: pointer;
        outline: none;
        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }
    `,panel:t`
      position: fixed;
      z-index: 9999;
      display: flex;
      gap: ${nw.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${s(r.gray[300],r.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${s(r.gray[400],r.darkGray[300])};
      }
    `,parentPanel:t`
      z-index: 9999;
      display: flex;
      height: 100%;
      gap: ${nw.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${s(r.gray[300],r.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${s(r.gray[400],r.darkGray[300])};
      }
    `,"devtoolsBtn-position-bottom-right":t`
      bottom: 12px;
      right: 12px;
    `,"devtoolsBtn-position-bottom-left":t`
      bottom: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-left":t`
      top: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-right":t`
      top: 12px;
      right: 12px;
    `,"devtoolsBtn-position-relative":t`
      position: relative;
    `,"panel-position-top":t`
      top: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${i[14]};
      border-bottom: ${s(r.gray[400],r.darkGray[300])} 1px solid;
    `,"panel-position-bottom":t`
      bottom: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${i[14]};
      border-top: ${s(r.gray[400],r.darkGray[300])} 1px solid;
    `,"panel-position-right":t`
      bottom: 0;
      right: 0;
      top: 0;
      border-left: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      max-width: 90%;
    `,"panel-position-left":t`
      bottom: 0;
      left: 0;
      top: 0;
      border-right: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      max-width: 90%;
    `,closeBtn:t`
      position: absolute;
      cursor: pointer;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      background-color: ${s(r.gray[50],r.darkGray[700])};
      &:hover {
        background-color: ${s(r.gray[200],r.darkGray[500])};
      }
      &:focus-visible {
        outline: 2px solid ${r.blue[600]};
      }
      & svg {
        color: ${s(r.gray[600],r.gray[400])};
        width: ${i[2]};
        height: ${i[2]};
      }
    `,"closeBtn-position-top":t`
      bottom: 0;
      right: ${i[2]};
      transform: translate(0, 100%);
      border-right: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-left: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-top: none;
      border-bottom: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-radius: 0px 0px ${a.radius.sm} ${a.radius.sm};
      padding: ${i[.5]} ${i[1.5]} ${i[1]} ${i[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        bottom: 100%;
        left: -${i[2.5]};
        height: ${i[1.5]};
        width: calc(100% + ${i[5]});
      }

      & svg {
        transform: rotate(180deg);
      }
    `,"closeBtn-position-bottom":t`
      top: 0;
      right: ${i[2]};
      transform: translate(0, -100%);
      border-right: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-left: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-top: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-bottom: none;
      border-radius: ${a.radius.sm} ${a.radius.sm} 0px 0px;
      padding: ${i[1]} ${i[1.5]} ${i[.5]} ${i[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        top: 100%;
        left: -${i[2.5]};
        height: ${i[1.5]};
        width: calc(100% + ${i[5]});
      }
    `,"closeBtn-position-right":t`
      bottom: ${i[2]};
      left: 0;
      transform: translate(-100%, 0);
      border-right: none;
      border-left: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-top: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-bottom: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-radius: ${a.radius.sm} 0px 0px ${a.radius.sm};
      padding: ${i[1.5]} ${i[.5]} ${i[1.5]} ${i[1]};

      &::after {
        content: ' ';
        position: absolute;
        left: 100%;
        height: calc(100% + ${i[5]});
        width: ${i[1.5]};
      }

      & svg {
        transform: rotate(-90deg);
      }
    `,"closeBtn-position-left":t`
      bottom: ${i[2]};
      right: 0;
      transform: translate(100%, 0);
      border-left: none;
      border-right: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-top: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-bottom: ${s(r.gray[400],r.darkGray[300])} 1px solid;
      border-radius: 0px ${a.radius.sm} ${a.radius.sm} 0px;
      padding: ${i[1.5]} ${i[1]} ${i[1.5]} ${i[.5]};

      &::after {
        content: ' ';
        position: absolute;
        right: 100%;
        height: calc(100% + ${i[5]});
        width: ${i[1.5]};
      }

      & svg {
        transform: rotate(90deg);
      }
    `,queriesContainer:t`
      flex: 1 1 700px;
      background-color: ${s(r.gray[50],r.darkGray[700])};
      display: flex;
      flex-direction: column;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
    `,dragHandle:t`
      position: absolute;
      transition: background-color 0.125s ease;
      &:hover {
        background-color: ${r.purple[400]}${s("",o[90])};
      }
      z-index: 4;
    `,"dragHandle-position-top":t`
      bottom: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-bottom":t`
      top: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-right":t`
      left: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,"dragHandle-position-left":t`
      right: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,row:t`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${nw.size[2]} ${nw.size[2.5]};
      gap: ${nw.size[2.5]};
      border-bottom: ${s(r.gray[300],r.darkGray[500])} 1px solid;
      align-items: center;
      & > button {
        padding: 0;
        background: transparent;
        border: none;
        display: flex;
        gap: ${i[.5]};
        flex-direction: column;
      }
    `,logoAndToggleContainer:t`
      display: flex;
      gap: ${nw.size[3]};
      align-items: center;
    `,logo:t`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      gap: ${nw.size[.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
      &:focus-visible {
        outline-offset: 4px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${r.blue[800]};
      }
    `,tanstackLogo:t`
      font-size: ${n.size.md};
      font-weight: ${n.weight.bold};
      line-height: ${n.lineHeight.xs};
      white-space: nowrap;
      color: ${s(r.gray[600],r.gray[300])};
    `,queryFlavorLogo:t`
      font-weight: ${n.weight.semibold};
      font-size: ${n.size.xs};
      background: linear-gradient(
        to right,
        ${s("#ea4037, #ff9b11","#dd524b, #e9a03b")}
      );
      background-clip: text;
      -webkit-background-clip: text;
      line-height: 1;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    `,queryStatusContainer:t`
      display: flex;
      gap: ${nw.size[2]};
      height: min-content;
    `,queryStatusTag:t`
      display: flex;
      gap: ${nw.size[1.5]};
      box-sizing: border-box;
      height: ${nw.size[6.5]};
      background: ${s(r.gray[50],r.darkGray[500])};
      color: ${s(r.gray[700],r.gray[300])};
      border-radius: ${nw.border.radius.sm};
      font-size: ${n.size.sm};
      padding: ${nw.size[1]};
      padding-left: ${nw.size[1.5]};
      align-items: center;
      font-weight: ${n.weight.medium};
      border: ${s("1px solid "+r.gray[300],"1px solid transparent")};
      user-select: none;
      position: relative;
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${r.blue[800]};
      }
    `,queryStatusTagLabel:t`
      font-size: ${n.size.xs};
    `,queryStatusCount:t`
      font-size: ${n.size.xs};
      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${s(r.gray[500],r.gray[400])};
      background-color: ${s(r.gray[200],r.darkGray[300])};
      border-radius: 2px;
      font-variant-numeric: tabular-nums;
      height: ${nw.size[4.5]};
    `,statusTooltip:t`
      position: absolute;
      z-index: 1;
      background-color: ${s(r.gray[50],r.darkGray[500])};
      top: 100%;
      left: 50%;
      transform: translate(-50%, calc(${nw.size[2]}));
      padding: ${nw.size[.5]} ${nw.size[2]};
      border-radius: ${nw.border.radius.sm};
      font-size: ${n.size.xs};
      border: 1px solid ${s(r.gray[400],r.gray[600])};
      color: ${s(r.gray[600],r.gray[300])};

      &::before {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, -100%);
        position: absolute;
        border-color: transparent transparent
          ${s(r.gray[400],r.gray[600])} transparent;
        border-style: solid;
        border-width: 7px;
        /* transform: rotate(180deg); */
      }

      &::after {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, calc(-100% + 2px));
        position: absolute;
        border-color: transparent transparent
          ${s(r.gray[100],r.darkGray[500])} transparent;
        border-style: solid;
        border-width: 7px;
      }
    `,filtersContainer:t`
      display: flex;
      gap: ${nw.size[2]};
      & > button {
        cursor: pointer;
        padding: ${nw.size[.5]} ${nw.size[1.5]} ${nw.size[.5]}
          ${nw.size[2]};
        border-radius: ${nw.border.radius.sm};
        background-color: ${s(r.gray[100],r.darkGray[400])};
        border: 1px solid ${s(r.gray[300],r.darkGray[200])};
        color: ${s(r.gray[700],r.gray[300])};
        font-size: ${n.size.xs};
        display: flex;
        align-items: center;
        line-height: ${n.lineHeight.sm};
        gap: ${nw.size[1.5]};
        max-width: 160px;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${a.radius.xs};
          outline: 2px solid ${r.blue[800]};
        }
        & svg {
          width: ${nw.size[3]};
          height: ${nw.size[3]};
          color: ${s(r.gray[500],r.gray[400])};
        }
      }
    `,filterInput:t`
      padding: ${i[.5]} ${i[2]};
      border-radius: ${nw.border.radius.sm};
      background-color: ${s(r.gray[100],r.darkGray[400])};
      display: flex;
      box-sizing: content-box;
      align-items: center;
      gap: ${nw.size[1.5]};
      max-width: 160px;
      min-width: 100px;
      border: 1px solid ${s(r.gray[300],r.darkGray[200])};
      height: min-content;
      color: ${s(r.gray[600],r.gray[400])};
      & > svg {
        width: ${i[3]};
        height: ${i[3]};
      }
      & input {
        font-size: ${n.size.xs};
        width: 100%;
        background-color: ${s(r.gray[100],r.darkGray[400])};
        border: none;
        padding: 0;
        line-height: ${n.lineHeight.sm};
        color: ${s(r.gray[700],r.gray[300])};
        &::placeholder {
          color: ${s(r.gray[700],r.gray[300])};
        }
        &:focus {
          outline: none;
        }
      }

      &:focus-within {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${r.blue[800]};
      }
    `,filterSelect:t`
      padding: ${nw.size[.5]} ${nw.size[2]};
      border-radius: ${nw.border.radius.sm};
      background-color: ${s(r.gray[100],r.darkGray[400])};
      display: flex;
      align-items: center;
      gap: ${nw.size[1.5]};
      box-sizing: content-box;
      max-width: 160px;
      border: 1px solid ${s(r.gray[300],r.darkGray[200])};
      height: min-content;
      & > svg {
        color: ${s(r.gray[600],r.gray[400])};
        width: ${nw.size[2]};
        height: ${nw.size[2]};
      }
      & > select {
        appearance: none;
        color: ${s(r.gray[700],r.gray[300])};
        min-width: 100px;
        line-height: ${n.lineHeight.sm};
        font-size: ${n.size.xs};
        background-color: ${s(r.gray[100],r.darkGray[400])};
        border: none;
        &:focus {
          outline: none;
        }
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${r.blue[800]};
      }
    `,actionsContainer:t`
      display: flex;
      gap: ${nw.size[2]};
    `,actionsBtn:t`
      border-radius: ${nw.border.radius.sm};
      background-color: ${s(r.gray[100],r.darkGray[400])};
      border: 1px solid ${s(r.gray[300],r.darkGray[200])};
      width: ${nw.size[6.5]};
      height: ${nw.size[6.5]};
      justify-content: center;
      display: flex;
      align-items: center;
      gap: ${nw.size[1.5]};
      max-width: 160px;
      cursor: pointer;
      padding: 0;
      &:hover {
        background-color: ${s(r.gray[200],r.darkGray[500])};
      }
      & svg {
        color: ${s(r.gray[700],r.gray[300])};
        width: ${nw.size[3]};
        height: ${nw.size[3]};
      }
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${r.blue[800]};
      }
    `,actionsBtnOffline:t`
      & svg {
        stroke: ${s(r.yellow[700],r.yellow[500])};
        fill: ${s(r.yellow[700],r.yellow[500])};
      }
    `,overflowQueryContainer:t`
      flex: 1;
      overflow-y: auto;
      & > div {
        display: flex;
        flex-direction: column;
      }
    `,queryRow:t`
      display: flex;
      align-items: center;
      padding: 0;
      border: none;
      cursor: pointer;
      color: ${s(r.gray[700],r.gray[300])};
      background-color: ${s(r.gray[50],r.darkGray[700])};
      line-height: 1;
      &:focus {
        outline: none;
      }
      &:focus-visible {
        outline-offset: -2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${r.blue[800]};
      }
      &:hover .tsqd-query-hash {
        background-color: ${s(r.gray[200],r.darkGray[600])};
      }

      & .tsqd-query-observer-count {
        padding: 0 ${nw.size[1]};
        user-select: none;
        min-width: ${nw.size[6.5]};
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${n.size.xs};
        font-weight: ${n.weight.medium};
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom: 1px solid ${s(r.gray[300],r.darkGray[700])};
      }
      & .tsqd-query-hash {
        user-select: text;
        font-size: ${n.size.xs};
        display: flex;
        align-items: center;
        min-height: ${nw.size[6]};
        flex: 1;
        padding: ${nw.size[1]} ${nw.size[2]};
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        border-bottom: 1px solid ${s(r.gray[300],r.darkGray[400])};
        text-align: left;
        text-overflow: clip;
        word-break: break-word;
      }

      & .tsqd-query-disabled-indicator {
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 ${nw.size[2]};
        color: ${s(r.gray[800],r.gray[300])};
        background-color: ${s(r.gray[300],r.darkGray[600])};
        border-bottom: 1px solid ${s(r.gray[300],r.darkGray[400])};
        font-size: ${n.size.xs};
      }

      & .tsqd-query-static-indicator {
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 ${nw.size[2]};
        color: ${s(r.teal[800],r.teal[300])};
        background-color: ${s(r.teal[100],r.teal[900])};
        border-bottom: 1px solid ${s(r.teal[300],r.teal[700])};
        font-size: ${n.size.xs};
      }
    `,selectedQueryRow:t`
      background-color: ${s(r.gray[200],r.darkGray[500])};
    `,detailsContainer:t`
      flex: 1 1 700px;
      background-color: ${s(r.gray[50],r.darkGray[700])};
      color: ${s(r.gray[700],r.gray[300])};
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      display: flex;
      text-align: left;
    `,detailsHeader:t`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: ${s(r.gray[200],r.darkGray[600])};
      padding: ${nw.size[1.5]} ${nw.size[2]};
      font-weight: ${n.weight.medium};
      font-size: ${n.size.xs};
      line-height: ${n.lineHeight.xs};
      text-align: left;
    `,detailsBody:t`
      margin: ${nw.size[1.5]} 0px ${nw.size[2]} 0px;
      & > div {
        display: flex;
        align-items: stretch;
        padding: 0 ${nw.size[2]};
        line-height: ${n.lineHeight.sm};
        justify-content: space-between;
        & > span {
          font-size: ${n.size.xs};
        }
        & > span:nth-child(2) {
          font-variant-numeric: tabular-nums;
        }
      }

      & > div:first-child {
        margin-bottom: ${nw.size[1.5]};
      }

      & code {
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        margin: 0;
        font-size: ${n.size.xs};
        line-height: ${n.lineHeight.xs};
        max-width: 100%;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      & pre {
        margin: 0;
        display: flex;
        align-items: center;
      }
    `,queryDetailsStatus:t`
      border: 1px solid ${r.darkGray[200]};
      border-radius: ${nw.border.radius.sm};
      font-weight: ${n.weight.medium};
      padding: ${nw.size[1]} ${nw.size[2.5]};
    `,actionsBody:t`
      flex-wrap: wrap;
      margin: ${nw.size[2]} 0px ${nw.size[2]} 0px;
      display: flex;
      gap: ${nw.size[2]};
      padding: 0px ${nw.size[2]};
      & > button {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
        font-size: ${n.size.xs};
        padding: ${nw.size[1]} ${nw.size[2]};
        display: flex;
        border-radius: ${nw.border.radius.sm};
        background-color: ${s(r.gray[100],r.darkGray[600])};
        border: 1px solid ${s(r.gray[300],r.darkGray[400])};
        align-items: center;
        gap: ${nw.size[2]};
        font-weight: ${n.weight.medium};
        line-height: ${n.lineHeight.xs};
        cursor: pointer;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${a.radius.xs};
          outline: 2px solid ${r.blue[800]};
        }
        &:hover {
          background-color: ${s(r.gray[200],r.darkGray[500])};
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        & > span {
          width: ${i[1.5]};
          height: ${i[1.5]};
          border-radius: ${nw.border.radius.full};
        }
      }
    `,actionsSelect:t`
      font-size: ${n.size.xs};
      padding: ${nw.size[.5]} ${nw.size[2]};
      display: flex;
      border-radius: ${nw.border.radius.sm};
      overflow: hidden;
      background-color: ${s(r.gray[100],r.darkGray[600])};
      border: 1px solid ${s(r.gray[300],r.darkGray[400])};
      align-items: center;
      gap: ${nw.size[2]};
      font-weight: ${n.weight.medium};
      line-height: ${n.lineHeight.sm};
      color: ${s(r.red[500],r.red[400])};
      cursor: pointer;
      position: relative;
      &:hover {
        background-color: ${s(r.gray[200],r.darkGray[500])};
      }
      & > span {
        width: ${i[1.5]};
        height: ${i[1.5]};
        border-radius: ${nw.border.radius.full};
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${r.blue[800]};
      }
      & select {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        appearance: none;
        background-color: transparent;
        border: none;
        color: transparent;
        outline: none;
      }

      & svg path {
        stroke: ${nw.colors.red[400]};
      }
      & svg {
        width: ${nw.size[2]};
        height: ${nw.size[2]};
      }
    `,settingsMenu:t`
      display: flex;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
      flex-direction: column;
      gap: ${i[.5]};
      border-radius: ${nw.border.radius.sm};
      border: 1px solid ${s(r.gray[300],r.gray[700])};
      background-color: ${s(r.gray[50],r.darkGray[600])};
      font-size: ${n.size.xs};
      color: ${s(r.gray[700],r.gray[300])};
      z-index: 99999;
      min-width: 120px;
      padding: ${i[.5]};
    `,settingsSubTrigger:t`
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: ${nw.border.radius.xs};
      padding: ${nw.size[1]} ${nw.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      color: ${s(r.gray[700],r.gray[300])};
      & svg {
        color: ${s(r.gray[600],r.gray[400])};
        transform: rotate(-90deg);
        width: ${nw.size[2]};
        height: ${nw.size[2]};
      }
      &:hover {
        background-color: ${s(r.gray[200],r.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${r.blue[800]};
      }
      &.data-disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,settingsMenuHeader:t`
      padding: ${nw.size[1]} ${nw.size[1]};
      font-weight: ${n.weight.medium};
      border-bottom: 1px solid ${s(r.gray[300],r.darkGray[400])};
      color: ${s(r.gray[500],r.gray[400])};
      font-size: ${n.size.xs};
    `,settingsSubButton:t`
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: ${s(r.gray[700],r.gray[300])};
      font-size: ${n.size.xs};
      border-radius: ${nw.border.radius.xs};
      padding: ${nw.size[1]} ${nw.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      & svg {
        color: ${s(r.gray[600],r.gray[400])};
      }
      &:hover {
        background-color: ${s(r.gray[200],r.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${r.blue[800]};
      }
    `,themeSelectedButton:t`
      background-color: ${s(r.purple[100],r.purple[900])};
      color: ${s(r.purple[700],r.purple[300])};
      & svg {
        color: ${s(r.purple[700],r.purple[300])};
      }
      &:hover {
        background-color: ${s(r.purple[100],r.purple[900])};
      }
    `,viewToggle:t`
      border-radius: ${nw.border.radius.sm};
      background-color: ${s(r.gray[200],r.darkGray[600])};
      border: 1px solid ${s(r.gray[300],r.darkGray[200])};
      display: flex;
      padding: 0;
      font-size: ${n.size.xs};
      color: ${s(r.gray[700],r.gray[300])};
      overflow: hidden;

      &:has(:focus-visible) {
        outline: 2px solid ${r.blue[800]};
      }

      & .tsqd-radio-toggle {
        opacity: 0.5;
        display: flex;
        & label {
          display: flex;
          align-items: center;
          cursor: pointer;
          line-height: ${n.lineHeight.md};
        }

        & label:hover {
          background-color: ${s(r.gray[100],r.darkGray[500])};
        }
      }

      & > [data-checked] {
        opacity: 1;
        background-color: ${s(r.gray[100],r.darkGray[400])};
        & label:hover {
          background-color: ${s(r.gray[100],r.darkGray[400])};
        }
      }

      & .tsqd-radio-toggle:first-child {
        & label {
          padding: 0 ${nw.size[1.5]} 0 ${nw.size[2]};
        }
        border-right: 1px solid ${s(r.gray[300],r.darkGray[200])};
      }

      & .tsqd-radio-toggle:nth-child(2) {
        & label {
          padding: 0 ${nw.size[2]} 0 ${nw.size[1.5]};
        }
      }
    `,devtoolsEditForm:t`
      padding: ${i[2]};
      & > [data-error='true'] {
        outline: 2px solid ${s(r.red[200],r.red[800])};
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
      }
    `,devtoolsEditTextarea:t`
      width: 100%;
      max-height: 500px;
      font-family: 'Fira Code', monospace;
      font-size: ${n.size.xs};
      border-radius: ${a.radius.sm};
      field-sizing: content;
      padding: ${i[2]};
      background-color: ${s(r.gray[100],r.darkGray[800])};
      color: ${s(r.gray[900],r.gray[100])};
      border: 1px solid ${s(r.gray[200],r.gray[700])};
      resize: none;
      &:focus {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${s(r.blue[200],r.blue[800])};
      }
    `,devtoolsEditFormActions:t`
      display: flex;
      justify-content: space-between;
      gap: ${i[2]};
      align-items: center;
      padding-top: ${i[1]};
      font-size: ${n.size.xs};
    `,devtoolsEditFormError:t`
      color: ${s(r.red[700],r.red[500])};
    `,devtoolsEditFormActionContainer:t`
      display: flex;
      gap: ${i[2]};
    `,devtoolsEditFormAction:t`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      font-size: ${n.size.xs};
      padding: ${i[1]} ${nw.size[2]};
      display: flex;
      border-radius: ${a.radius.sm};
      background-color: ${s(r.gray[100],r.darkGray[600])};
      border: 1px solid ${s(r.gray[300],r.darkGray[400])};
      align-items: center;
      gap: ${i[2]};
      font-weight: ${n.weight.medium};
      line-height: ${n.lineHeight.xs};
      cursor: pointer;
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${r.blue[800]};
      }
      &:hover {
        background-color: ${s(r.gray[200],r.darkGray[500])};
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `}},oF=e=>oL("light",e),oD=e=>oL("dark",e);(0,i.z_)(["click","mousedown","input"])}}]);