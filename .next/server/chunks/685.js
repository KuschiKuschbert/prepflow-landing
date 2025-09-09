exports.id=685,exports.ids=[685],exports.modules={451:(a,b,c)=>{"use strict";c.d(b,{WH:()=>j,default:()=>i});var d=c(60687),e=c(72600),f=c(16189),g=c(43210);function h({gtmId:a,ga4MeasurementId:b}){return(0,f.usePathname)(),(0,f.useSearchParams)(),(0,g.useRef)(!1),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("noscript",{children:(0,d.jsx)("iframe",{src:`https://www.googletagmanager.com/ns.html?id=${a}`,height:"0",width:"0",style:{display:"none",visibility:"hidden"}})}),(0,d.jsx)(e.default,{id:"gtm-script",strategy:"afterInteractive",dangerouslySetInnerHTML:{__html:`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${a}');
          `},onLoad:()=>{console.log("\uD83D\uDCE5 Google Tag Manager loaded")},onError:()=>{console.error("❌ Failed to load Google Tag Manager")}})]})}function i({gtmId:a,ga4MeasurementId:b}){return(0,d.jsx)(g.Suspense,{fallback:null,children:(0,d.jsx)(h,{gtmId:a,ga4MeasurementId:b})})}function j(a,b={}){Date.now()}},13780:(a,b,c)=>{"use strict";c.d(b,{default:()=>e}),c(60687);var d=c(43210);function e(){let[a,b]=(0,d.useState)(!1),[c,e]=(0,d.useState)(!1);return null}},19259:(a,b,c)=>{Promise.resolve().then(c.bind(c,38562)),Promise.resolve().then(c.bind(c,36122)),Promise.resolve().then(c.bind(c,37646)),Promise.resolve().then(c.bind(c,50001)),Promise.resolve().then(c.bind(c,74042))},21460:(a,b,c)=>{"use strict";c.d(b,{default:()=>i});var d=c(60687),e=c(72600),f=c(16189),g=c(43210);function h({measurementId:a}){(0,f.usePathname)(),(0,f.useSearchParams)(),(0,g.useRef)(!1);let b=()=>{};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(e.default,{strategy:"afterInteractive",src:`https://www.googletagmanager.com/gtag/js?id=${a}`,onLoad:()=>{console.log("\uD83D\uDCE5 Google Analytics script loaded"),b()},onError:()=>{console.error("❌ Failed to load Google Analytics script")}}),(0,d.jsx)(e.default,{id:"google-analytics-init",strategy:"afterInteractive",dangerouslySetInnerHTML:{__html:`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${a}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: false,
            });
            console.log('🔧 Google Analytics gtag function initialized');
          `},onLoad:()=>{console.log("✅ Google Analytics initialization script loaded"),b()}})]})}function i({measurementId:a}){return(0,d.jsx)(g.Suspense,{fallback:null,children:(0,d.jsx)(h,{measurementId:a})})}c(21460)},24981:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,16133,23)),Promise.resolve().then(c.t.bind(c,16444,23)),Promise.resolve().then(c.t.bind(c,16042,23)),Promise.resolve().then(c.t.bind(c,49477,23)),Promise.resolve().then(c.t.bind(c,29345,23)),Promise.resolve().then(c.t.bind(c,12089,23)),Promise.resolve().then(c.t.bind(c,46577,23)),Promise.resolve().then(c.t.bind(c,31307,23)),Promise.resolve().then(c.t.bind(c,14817,23))},29875:(a,b,c)=>{Promise.resolve().then(c.bind(c,60252)),Promise.resolve().then(c.bind(c,21460)),Promise.resolve().then(c.bind(c,13780)),Promise.resolve().then(c.bind(c,451)),Promise.resolve().then(c.bind(c,46380))},36122:(a,b,c)=>{"use strict";c.d(b,{default:()=>e});var d=c(61369);let e=(0,d.registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/danielkuschmierz/prepflow-landing/components/GoogleAnalytics.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/danielkuschmierz/prepflow-landing/components/GoogleAnalytics.tsx","default");(0,d.registerClientReference)(function(){throw Error("Attempted to call GoogleAnalyticsDefault() from the server but GoogleAnalyticsDefault is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/danielkuschmierz/prepflow-landing/components/GoogleAnalytics.tsx","GoogleAnalyticsDefault")},37646:(a,b,c)=>{"use strict";c.d(b,{default:()=>d});let d=(0,c(61369).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/danielkuschmierz/prepflow-landing/components/GoogleAnalyticsTest.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/danielkuschmierz/prepflow-landing/components/GoogleAnalyticsTest.tsx","default")},38562:(a,b,c)=>{"use strict";c.d(b,{default:()=>d});let d=(0,c(61369).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/danielkuschmierz/prepflow-landing/components/ClientPerformanceTracker.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/danielkuschmierz/prepflow-landing/components/ClientPerformanceTracker.tsx","default")},46055:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>e});var d=c(31658);let e=async a=>[{type:"image/x-icon",sizes:"16x16",url:(0,d.fillMetadataSegment)(".",await a.params,"favicon.ico")+""}]},50001:(a,b,c)=>{"use strict";c.d(b,{default:()=>e});var d=c(61369);let e=(0,d.registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/danielkuschmierz/prepflow-landing/components/GoogleTagManager.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/danielkuschmierz/prepflow-landing/components/GoogleTagManager.tsx","default");(0,d.registerClientReference)(function(){throw Error("Attempted to call pushToDataLayer() from the server but pushToDataLayer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/danielkuschmierz/prepflow-landing/components/GoogleTagManager.tsx","pushToDataLayer"),(0,d.registerClientReference)(function(){throw Error("Attempted to call trackGTMEvent() from the server but trackGTMEvent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/danielkuschmierz/prepflow-landing/components/GoogleTagManager.tsx","trackGTMEvent"),(0,d.registerClientReference)(function(){throw Error("Attempted to call trackGTMConversion() from the server but trackGTMConversion is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/danielkuschmierz/prepflow-landing/components/GoogleTagManager.tsx","trackGTMConversion"),(0,d.registerClientReference)(function(){throw Error("Attempted to call trackGTMEngagement() from the server but trackGTMEngagement is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/danielkuschmierz/prepflow-landing/components/GoogleTagManager.tsx","trackGTMEngagement")},58014:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>o,metadata:()=>n});var d=c(37413),e=c(56389),f=c.n(e),g=c(51189),h=c.n(g);c(82704);var i=c(74042),j=c(36122),k=c(37646),l=c(50001),m=c(38562);let n={title:"PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights",description:"Your menu profitability tool built from 20 years of real kitchen experience. PrepFlow helps identify profit opportunities with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support. Start your profit journey now.",keywords:["restaurant COGS","menu profitability","contributing margin","gross profit optimization","global hospitality","international restaurants","multi-currency support","restaurant management","menu costing","profit analysis","worldwide restaurant software"],authors:[{name:"PrepFlow Team"}],creator:"PrepFlow",publisher:"PrepFlow",formatDetection:{email:!1,address:!1,telephone:!1},metadataBase:new URL("https://www.prepflow.org"),alternates:{canonical:"/"},openGraph:{title:"PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights",description:"Your menu profitability tool built from 20 years of real kitchen experience. PrepFlow helps identify profit opportunities with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support.",url:"https://www.prepflow.org",siteName:"PrepFlow",images:[{url:"/images/dashboard-screenshot.png",width:1200,height:630,alt:"PrepFlow Dashboard showing COGS metrics and profit analysis"}],locale:"en",type:"website"},twitter:{card:"summary_large_image",title:"PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights",description:"Your menu profitability tool built from 20 years of real kitchen experience. PrepFlow helps identify profit opportunities with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support.",images:["/images/dashboard-screenshot.png"]},robots:{index:!0,follow:!0,googleBot:{index:!0,follow:!0,"max-video-preview":-1,"max-image-preview":"large","max-snippet":-1}},icons:{icon:"/favicon.svg",apple:"/favicon.svg"}};function o({children:a}){return(0,d.jsxs)("html",{lang:"en",children:[(0,d.jsxs)("head",{children:[(0,d.jsx)("link",{rel:"manifest",href:"/manifest.json"}),(0,d.jsx)("meta",{name:"theme-color",content:"#29E7CD"}),(0,d.jsx)("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),(0,d.jsx)("meta",{name:"apple-mobile-web-app-status-bar-style",content:"black-translucent"}),(0,d.jsx)("meta",{name:"apple-mobile-web-app-title",content:"PrepFlow"}),(0,d.jsx)("link",{rel:"apple-touch-icon",href:"/icons/icon-192x192.png"}),(0,d.jsx)("link",{rel:"icon",type:"image/png",sizes:"32x32",href:"/icons/icon-32x32.png"}),(0,d.jsx)("link",{rel:"icon",type:"image/png",sizes:"16x16",href:"/icons/icon-16x16.png"})]}),(0,d.jsxs)("body",{className:`${f().variable} ${h().variable} antialiased`,children:[(0,d.jsx)(m.default,{}),a,(0,d.jsx)(i.Analytics,{}),(0,d.jsx)(j.default,{measurementId:"G-W1D5LQXGJT"}),(0,d.jsx)(l.default,{gtmId:"GTM-WQMV22RD",ga4MeasurementId:"G-W1D5LQXGJT"}),(0,d.jsx)(k.default,{}),(0,d.jsx)("script",{dangerouslySetInnerHTML:{__html:`
              // Initialize advanced optimizations
              (function() {
                // Critical CSS injection
                const criticalCSS = ${JSON.stringify(c(58783).mU)};
                const style = document.createElement('style');
                style.id = 'critical-css';
                style.textContent = criticalCSS;
                document.head.insertBefore(style, document.head.firstChild);
                
                // Resource hints initialization
                const resourceHints = ${JSON.stringify(c(61147).Zt)};
                
                // Preconnect to external domains
                resourceHints.preconnect.forEach(domain => {
                  const link = document.createElement('link');
                  link.rel = 'preconnect';
                  link.href = domain;
                  link.crossOrigin = 'anonymous';
                  document.head.appendChild(link);
                });
                
                // DNS prefetch for external domains
                resourceHints.dnsPrefetch.forEach(domain => {
                  const link = document.createElement('link');
                  link.rel = 'dns-prefetch';
                  link.href = domain;
                  document.head.appendChild(link);
                });
                
                // Preload critical resources
                resourceHints.critical.forEach(resource => {
                  const link = document.createElement('link');
                  link.rel = 'preload';
                  link.href = resource.href;
                  link.as = resource.as;
                  if (resource.type) link.type = resource.type;
                  if (resource.priority === 'high') link.setAttribute('fetchpriority', 'high');
                  document.head.appendChild(link);
                });
                
                // Font optimization
                const fontLink = document.createElement('link');
                fontLink.rel = 'preload';
                fontLink.as = 'style';
                fontLink.href = 'https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap';
                fontLink.onload = function() {
                  this.rel = 'stylesheet';
                };
                document.head.appendChild(fontLink);
                
                console.log('🚀 Advanced optimizations initialized');
              })();
            `}}),(0,d.jsx)("script",{dangerouslySetInnerHTML:{__html:`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('✅ PrepFlow SW: Registration successful');
                    })
                    .catch(function(error) {
                      console.log('❌ PrepFlow SW: Registration failed');
                    });
                });
              }
            `}})]})]})}},58783:(a,b,c)=>{"use strict";c.d(b,{mU:()=>d});let d=`
/* Critical CSS for PrepFlow Landing Page */
/* Above-the-fold content only */

/* Reset and base styles */
*,*::before,*::after{box-sizing:border-box}
html{line-height:1.15;-webkit-text-size-adjust:100%}
body{margin:0;font-family:var(--font-geist-sans),system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;color:#ffffff;background-color:#0a0a0a}

/* Critical layout styles */
.min-h-screen{min-height:100vh}
.bg-\\[\\#0a0a0a\\]{background-color:#0a0a0a}
.text-white{color:#ffffff}
.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}

/* Critical container styles */
.container{margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
@media (min-width:640px){.container{max-width:640px}}
@media (min-width:768px){.container{max-width:768px}}
@media (min-width:1024px){.container{max-width:1024px}}
@media (min-width:1280px){.container{max-width:1280px}}

/* Critical header styles */
.header{position:fixed;top:0;left:0;right:0;z-index:50;background-color:rgba(10,10,10,0.95);backdrop-filter:blur(10px);border-bottom:1px solid #2a2a2a}
.header-content{display:flex;align-items:center;justify-content:space-between;height:4rem;padding:0 1rem}

/* Critical hero section styles */
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%)}
.hero-content{max-width:1200px;width:100%;text-align:center}
.hero-title{font-size:3rem;font-weight:700;line-height:1.1;margin-bottom:1.5rem;background:linear-gradient(135deg,#29E7CD 0%,#D925C7 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
@media (min-width:768px){.hero-title{font-size:4rem}}
@media (min-width:1024px){.hero-title{font-size:5rem}}

/* Critical button styles */
.btn{display:inline-flex;align-items:center;justify-content:center;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:600;text-decoration:none;transition:all 0.2s;border:none;cursor:pointer}
.btn-primary{background:linear-gradient(135deg,#29E7CD 0%,#D925C7 100%);color:#000000}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(41,231,205,0.3)}
.btn-secondary{background-color:rgba(41,231,205,0.1);color:#29E7CD;border:1px solid rgba(41,231,205,0.2)}
.btn-secondary:hover{background-color:rgba(41,231,205,0.2)}

/* Critical image styles */
.hero-image{width:100%;height:auto;border-radius:0.75rem;border:1px solid #2a2a2a;margin-top:2rem}
@media (min-width:768px){.hero-image{max-width:800px}}

/* Critical navigation styles */
.nav{display:flex;align-items:center;gap:2rem}
.nav-link{color:#ffffff;text-decoration:none;font-weight:500;transition:color 0.2s}
.nav-link:hover{color:#29E7CD}

/* Critical mobile navigation */
.mobile-nav-toggle{display:none;background:none;border:none;color:#ffffff;cursor:pointer;padding:0.5rem}
@media (max-width:767px){.mobile-nav-toggle{display:block}}

/* Critical loading states */
.loading-skeleton{background:linear-gradient(90deg,#1f1f1f 25%,#2a2a2a 50%,#1f1f1f 75%);background-size:200% 100%;animation:loading 1.5s infinite}
@keyframes loading{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* Critical typography */
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.text-5xl{font-size:3rem;line-height:1}
.text-6xl{font-size:3.75rem;line-height:1}
.font-bold{font-weight:700}
.font-semibold{font-weight:600}
.leading-tight{line-height:1.25}
.leading-relaxed{line-height:1.625}

/* Critical spacing */
.mb-4{margin-bottom:1rem}
.mb-6{margin-bottom:1.5rem}
.mb-8{margin-bottom:2rem}
.mt-4{margin-top:1rem}
.mt-6{margin-top:1.5rem}
.mt-8{margin-top:2rem}
.p-4{padding:1rem}
.p-6{padding:1.5rem}
.p-8{padding:2rem}

/* Critical responsive utilities */
@media (max-width:767px){
  .hero-title{font-size:2.5rem}
  .hero{padding:1rem}
  .container{padding-left:0.5rem;padding-right:0.5rem}
}

/* Critical animations */
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.animate-fade-in-up{animation:fadeInUp 0.6s ease-out}
.animate-fade-in{animation:fadeIn 0.6s ease-out}

/* Critical focus styles */
.focus\\:ring-2:focus{outline:2px solid transparent;outline-offset:2px;box-shadow:0 0 0 2px #29E7CD}
.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}

/* Critical accessibility */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`;class e{static getInstance(){return e.instance||(e.instance=new e),e.instance}injectCriticalCSS(){}loadNonCriticalCSS(){}loadExternalCSS(a,b){return new Promise((a,b)=>{b(Error("CSS loading not available in server environment"))})}preloadCSS(a){}optimizeCSSLoading(a){}getCSSLoadingStatus(){return{critical:this.criticalCSSLoaded,nonCritical:this.nonCriticalCSSLoaded}}removeCriticalCSS(){}clearAllCSS(){}constructor(){this.criticalCSSLoaded=!1,this.nonCriticalCSSLoaded=!1}}e.getInstance()},60252:(a,b,c)=>{"use strict";c.d(b,{default:()=>f});var d=c(60687);let e=(0,c(30036).default)(async()=>{},{loadableGenerated:{modules:["components/ClientPerformanceTracker.tsx -> ./AdvancedPerformanceTracker"]},ssr:!1});function f(){return(0,d.jsx)(e,{})}},61147:(a,b,c)=>{"use strict";c.d(b,{Zt:()=>d});let d={critical:[{href:"/images/dashboard-screenshot.png",as:"image",type:"image/png",priority:"high"},{href:"/images/prepflow-logo.png",as:"image",type:"image/png",priority:"high"},{href:"/manifest.json",as:"manifest",type:"application/manifest+json",priority:"high"}],prefetch:[{href:"/images/recipe-screenshot.png",as:"image",type:"image/png"},{href:"/images/settings-screenshot.png",as:"image",type:"image/png"},{href:"/images/stocklist-screenshot.png",as:"image",type:"image/png"}],preconnect:["https://fonts.googleapis.com","https://fonts.gstatic.com","https://www.googletagmanager.com","https://www.google-analytics.com","https://vitals.vercel-insights.com"],dnsPrefetch:["https://dulkrqgjfohsuxhsmofo.supabase.co","https://api.stripe.com","https://js.stripe.com"],modulePreload:["/_next/static/chunks/vendors.js","/_next/static/chunks/webpack.js","/_next/static/chunks/main.js"]};class e{static getInstance(){return e.instance||(e.instance=new e),e.instance}initializeResourceHints(){}preconnectDomains(){d.preconnect.forEach(a=>{this.preconnect(a)})}dnsPrefetchDomains(){d.dnsPrefetch.forEach(a=>{this.dnsPrefetch(a)})}preloadCriticalResources(){d.critical.forEach(a=>{this.preload(a.href,a.as,a.type,a.priority)})}prefetchResources(){setTimeout(()=>{d.prefetch.forEach(a=>{this.prefetch(a.href,a.as,a.type)})},1e3)}modulePreloadResources(){d.modulePreload.forEach(a=>{this.modulePreload(a)})}preconnect(a){}dnsPrefetch(a){}preload(a,b,c,d="auto"){}prefetch(a,b,c){}modulePreload(a){}preloadFont(a,b,c="normal"){let d=`https://fonts.googleapis.com/css2?family=${a}:wght@${b}&display=swap`;this.preload(d,"style","text/css","high")}preloadImage(a,b,c="auto"){this.preload(a,"image",void 0,c);let d=document.createElement("link");d.rel="preload",d.as="image",d.href=a,d.setAttribute("imagesizes",b),d.setAttribute("imagesrcset",this.generateImageSrcSet(a)),document.head.appendChild(d)}generateImageSrcSet(a){return[640,750,828,1080,1200,1920].map(b=>`${a}?w=${b} ${b}w`).join(", ")}optimizeForConnection(a){}getLoadedHints(){return Array.from(this.loadedHints)}clearAllHints(){}trackResourceHintPerformance(a,b,c){}constructor(){this.loadedHints=new Set}}e.getInstance()},66837:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,25227,23)),Promise.resolve().then(c.t.bind(c,86346,23)),Promise.resolve().then(c.t.bind(c,27924,23)),Promise.resolve().then(c.t.bind(c,40099,23)),Promise.resolve().then(c.t.bind(c,38243,23)),Promise.resolve().then(c.t.bind(c,28827,23)),Promise.resolve().then(c.t.bind(c,62763,23)),Promise.resolve().then(c.t.bind(c,97173,23)),Promise.resolve().then(c.bind(c,25587))},82704:()=>{}};