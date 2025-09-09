(()=>{var a={};a.id=716,a.ids=[716],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},21411:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>E,patchFetch:()=>D,routeModule:()=>z,serverHooks:()=>C,workAsyncStorage:()=>A,workUnitAsyncStorage:()=>B});var d={};c.r(d),c.d(d,{POST:()=>y});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190);class v{constructor(){this.apiKey=process.env.RESEND_API_KEY||"",this.fromEmail=process.env.FROM_EMAIL||"hello@prepflow.org",this.fromName=process.env.FROM_NAME||"PrepFlow Team"}async sendSampleDashboardEmail(a){try{let b=this.getSampleDashboardTemplate(a),c=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({from:`${this.fromName} <${this.fromEmail}>`,to:[a.email],subject:b.subject,html:b.html,text:b.text})});if(!c.ok)throw Error(`Email API error: ${c.status} ${c.statusText}`);let d=await c.json();return console.log("\uD83D\uDCE7 Email sent successfully:",d),!0}catch(a){return console.error("\uD83D\uDCE7 Email sending failed:",a),!1}}getSampleDashboardTemplate(a){let b=`Your PrepFlow Sample Dashboard is Ready, ${a.name}! 📊`;return{subject:b,html:`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your PrepFlow Sample Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #29E7CD 0%, #3B82F6 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 12px 12px 0 0;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .dashboard-image {
            width: 100%;
            max-width: 500px;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #29E7CD 0%, #3B82F6 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(41, 231, 205, 0.3);
        }
        .feature-list {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .feature-list ul {
            margin: 0;
            padding-left: 20px;
        }
        .feature-list li {
            margin: 8px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .highlight {
            background: linear-gradient(135deg, #29E7CD 0%, #3B82F6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0; font-size: 28px;">Your PrepFlow Sample Dashboard</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Hi ${a.name}, here's what you've been waiting for! 🎉</p>
    </div>
    
    <div class="content">
        <h2 style="color: #2d3748; margin-top: 0;">See Your Menu's Profit Potential</h2>
        
        <p>Thanks for requesting the PrepFlow sample dashboard! This gives you a real taste of how PrepFlow can transform your menu profitability analysis.</p>
        
        <img src="https://prepflow.org/images/dashboard-screenshot.png" alt="PrepFlow Dashboard Preview" class="dashboard-image">
        
        <h3 style="color: #2d3748;">What You'll Discover:</h3>
        
        <div class="feature-list">
            <ul>
                <li><strong>Contributing Margin Analysis:</strong> See which dishes are actually profitable after all costs</li>
                <li><strong>COGS Tracking:</strong> Monitor ingredient costs and waste in real-time</li>
                <li><strong>Profit Optimization:</strong> Identify opportunities to increase your margins</li>
                <li><strong>Menu Planning:</strong> Make data-driven decisions about your menu</li>
            </ul>
        </div>
        
        <p>This sample shows you exactly how PrepFlow works with real restaurant data. You'll see the same insights that help independent restaurants like yours boost their profitability by 15-30%.</p>
        
        <div style="text-align: center;">
            <a href="https://7495573591101.gumroad.com/l/prepflow" class="cta-button">
                Get Your Full PrepFlow Dashboard →
            </a>
        </div>
        
        <h3 style="color: #2d3748;">Why PrepFlow Works:</h3>
        <p>Built from <span class="highlight">20+ years of real kitchen experience</span>, PrepFlow isn't just another spreadsheet. It's a complete profitability system that:</p>
        
        <ul>
            <li>Calculates true contributing margins (not just gross profit)</li>
            <li>Tracks prep time, waste, and complexity costs</li>
            <li>Provides actionable insights for menu optimization</li>
            <li>Works for caf\xe9s, food trucks, and small restaurants</li>
        </ul>
        
        <p><strong>Special Offer:</strong> Get PrepFlow for just <span class="highlight">AUD $29</span> - that's less than the cost of one good meal out, but it could save you thousands in menu optimization.</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #29E7CD;">
            <p style="margin: 0; color: #2d3748;"><strong>💡 Pro Tip:</strong> Start with your best-selling items. You might be surprised to find that your "star" dishes aren't your most profitable ones!</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Questions? Reply to this email - I'm here to help!</p>
        <p>PrepFlow Team<br>
        <a href="https://prepflow.org" style="color: #29E7CD;">prepflow.org</a></p>
        <p style="font-size: 12px; margin-top: 20px;">
            You received this email because you requested a sample dashboard.<br>
            No spam. No lock-in. Your data stays private.
        </p>
    </div>
</body>
</html>
    `,text:`
Your PrepFlow Sample Dashboard is Ready, ${a.name}! 📊

Hi ${a.name},

Thanks for requesting the PrepFlow sample dashboard! This gives you a real taste of how PrepFlow can transform your menu profitability analysis.

What You'll Discover:
• Contributing Margin Analysis: See which dishes are actually profitable after all costs
• COGS Tracking: Monitor ingredient costs and waste in real-time  
• Profit Optimization: Identify opportunities to increase your margins
• Menu Planning: Make data-driven decisions about your menu

This sample shows you exactly how PrepFlow works with real restaurant data. You'll see the same insights that help independent restaurants like yours boost their profitability by 15-30%.

Get Your Full PrepFlow Dashboard: https://7495573591101.gumroad.com/l/prepflow

Why PrepFlow Works:
Built from 20+ years of real kitchen experience, PrepFlow isn't just another spreadsheet. It's a complete profitability system that:
• Calculates true contributing margins (not just gross profit)
• Tracks prep time, waste, and complexity costs
• Provides actionable insights for menu optimization
• Works for caf\xe9s, food trucks, and small restaurants

Special Offer: Get PrepFlow for just AUD $29 - that's less than the cost of one good meal out, but it could save you thousands in menu optimization.

Pro Tip: Start with your best-selling items. You might be surprised to find that your "star" dishes aren't your most profitable ones!

Questions? Reply to this email - I'm here to help!

PrepFlow Team
prepflow.org

You received this email because you requested a sample dashboard.
No spam. No lock-in. Your data stays private.
    `}}}let w=new v,x=w.sendSampleDashboardEmail.bind(w);async function y(a){try{let{name:b,email:c}=await a.json();if(!b||!c)return u.NextResponse.json({error:"Name and email are required"},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c))return u.NextResponse.json({error:"Invalid email format"},{status:400});if(await x({name:b.trim(),email:c.trim().toLowerCase(),type:"sample_dashboard"}))return u.NextResponse.json({success:!0,message:"Sample dashboard email sent successfully"},{status:200});return u.NextResponse.json({error:"Failed to send email"},{status:500})}catch(a){return console.error("API Error:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}let z=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/send-sample-email/route",pathname:"/api/send-sample-email",filename:"route",bundlePath:"app/api/send-sample-email/route"},distDir:".next",projectDir:"",resolvedPagePath:"/workspace/app/api/send-sample-email/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:A,workUnitAsyncStorage:B,serverHooks:C}=z;function D(){return(0,g.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:B})}async function E(a,b,c){var d;let e="/api/send-sample-email/route";"/index"===e&&(e="/");let g=await z.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||z.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===z.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>z.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>z.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await z.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await z.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await z.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[985,55],()=>b(b.s=21411));module.exports=c})();