(()=>{var a={};a.id=8542,a.ids=[8542],a.modules={87:(a,b,c)=>{"use strict";c.d(b,{E2:()=>h,Ye:()=>g});var d=c(82461);let e="https://dulkrqgjfohsuxhsmofo.supabase.co",f="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bGtycWdqZm9oc3V4aHNtb2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzYwMDMsImV4cCI6MjA3MjU1MjAwM30.b_P98mAantymNfWy1Qz18SaR-LwrPjuaebO2Uj_5JK8";if(!e||!f)throw Error("Missing Supabase environment variables. Please check your .env.local file.");function g(){let a=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!a)throw Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");if(!e)throw Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");return(0,d.UU)(e,a)}(0,d.UU)(e,f);let h=g()},261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:a=>{"use strict";a.exports=require("punycode")},13354:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>C,patchFetch:()=>B,routeModule:()=>x,serverHooks:()=>A,workAsyncStorage:()=>y,workUnitAsyncStorage:()=>z});var d={};c.r(d),c.d(d,{POST:()=>w});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641),v=c(87);async function w(a){try{if(!v.E2)return u.NextResponse.json({error:"Database connection not available",message:"Supabase admin client not initialized"},{status:500});console.log("Creating database tables...");let a=[],b=[];for(let c of[{name:"ingredients",sql:`CREATE TABLE IF NOT EXISTS ingredients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          ingredient_name VARCHAR(255) NOT NULL,
          brand VARCHAR(255),
          pack_size VARCHAR(100),
          unit VARCHAR(50) NOT NULL,
          cost_per_unit DECIMAL(10,4) NOT NULL,
          cost_per_unit_as_purchased DECIMAL(10,4),
          cost_per_unit_incl_trim DECIMAL(10,4),
          trim_peel_waste_percentage DECIMAL(5,2) DEFAULT 0,
          yield_percentage DECIMAL(5,2) DEFAULT 100,
          supplier VARCHAR(255),
          storage VARCHAR(255),
          product_code VARCHAR(100),
          category VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"recipes",sql:`CREATE TABLE IF NOT EXISTS recipes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          recipe_name VARCHAR(255) NOT NULL,
          description TEXT,
          yield INTEGER NOT NULL DEFAULT 1,
          yield_unit VARCHAR(50) NOT NULL DEFAULT 'servings',
          instructions TEXT,
          prep_time_minutes INTEGER,
          cook_time_minutes INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"recipe_ingredients",sql:`CREATE TABLE IF NOT EXISTS recipe_ingredients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"temperature_equipment",sql:`CREATE TABLE IF NOT EXISTS temperature_equipment (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          equipment_type VARCHAR(50) NOT NULL,
          location VARCHAR(255),
          min_temp_celsius DECIMAL(5,2),
          max_temp_celsius DECIMAL(5,2),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"temperature_logs",sql:`CREATE TABLE IF NOT EXISTS temperature_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          equipment_id UUID REFERENCES temperature_equipment(id) ON DELETE CASCADE,
          temperature_celsius DECIMAL(5,2) NOT NULL,
          recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          recorded_by VARCHAR(255),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"cleaning_areas",sql:`CREATE TABLE IF NOT EXISTS cleaning_areas (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          area_name VARCHAR(255) NOT NULL,
          description TEXT,
          cleaning_frequency VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"cleaning_tasks",sql:`CREATE TABLE IF NOT EXISTS cleaning_tasks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          area_id UUID REFERENCES cleaning_areas(id) ON DELETE CASCADE,
          task_name VARCHAR(255) NOT NULL,
          description TEXT,
          frequency VARCHAR(50),
          estimated_duration_minutes INTEGER,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"suppliers",sql:`CREATE TABLE IF NOT EXISTS suppliers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          supplier_name VARCHAR(255) NOT NULL,
          contact_person VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(50),
          address TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"compliance_types",sql:`CREATE TABLE IF NOT EXISTS compliance_types (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          type_name VARCHAR(255) NOT NULL,
          description TEXT,
          frequency VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"compliance_records",sql:`CREATE TABLE IF NOT EXISTS compliance_records (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          compliance_type_id UUID REFERENCES compliance_types(id) ON DELETE CASCADE,
          record_date DATE NOT NULL,
          status VARCHAR(50) NOT NULL,
          notes TEXT,
          recorded_by VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"par_levels",sql:`CREATE TABLE IF NOT EXISTS par_levels (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          minimum_level DECIMAL(10,3) NOT NULL,
          maximum_level DECIMAL(10,3) NOT NULL,
          current_stock DECIMAL(10,3) DEFAULT 0,
          unit VARCHAR(50) NOT NULL,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"order_lists",sql:`CREATE TABLE IF NOT EXISTS order_lists (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          order_date DATE NOT NULL DEFAULT CURRENT_DATE,
          supplier_id UUID REFERENCES suppliers(id),
          status VARCHAR(50) DEFAULT 'pending',
          total_amount DECIMAL(10,2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"order_items",sql:`CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          order_list_id UUID REFERENCES order_lists(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity_ordered DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          unit_price DECIMAL(10,4),
          total_price DECIMAL(10,2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"kitchen_sections",sql:`CREATE TABLE IF NOT EXISTS kitchen_sections (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          section_name VARCHAR(255) NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"prep_lists",sql:`CREATE TABLE IF NOT EXISTS prep_lists (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          prep_date DATE NOT NULL DEFAULT CURRENT_DATE,
          section_id UUID REFERENCES kitchen_sections(id),
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"prep_list_items",sql:`CREATE TABLE IF NOT EXISTS prep_list_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          prep_list_id UUID REFERENCES prep_lists(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity_needed DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          is_completed BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"ai_specials",sql:`CREATE TABLE IF NOT EXISTS ai_specials (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          special_name VARCHAR(255) NOT NULL,
          description TEXT,
          suggested_price DECIMAL(10,2),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"ai_specials_ingredients",sql:`CREATE TABLE IF NOT EXISTS ai_specials_ingredients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          ai_special_id UUID REFERENCES ai_specials(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`},{name:"users",sql:`CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255),
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          business_name VARCHAR(255),
          subscription_status VARCHAR(50) DEFAULT 'trial',
          subscription_expires TIMESTAMP WITH TIME ZONE,
          stripe_customer_id VARCHAR(255),
          email_verified BOOLEAN DEFAULT FALSE,
          email_verification_token VARCHAR(255),
          email_verification_expires TIMESTAMP WITH TIME ZONE,
          password_reset_token VARCHAR(255),
          password_reset_expires TIMESTAMP WITH TIME ZONE,
          failed_login_attempts INTEGER DEFAULT 0,
          locked_until TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`}])try{console.log(`Creating table: ${c.name}`);let{data:d,error:e}=await v.E2.from(c.name).select("id").limit(1);if(d&&d.length>0){a.push({table:c.name,status:"already_exists",message:"Table already exists"});continue}let{data:f,error:g}=await v.E2.from(c.name).insert({}).select();g&&"PGRST116"===g.code?a.push({table:c.name,status:"needs_manual_creation",message:"Table needs to be created manually in Supabase dashboard",sql:c.sql}):g?b.push({table:c.name,error:g.message,code:g.code}):(f&&f.length>0&&await v.E2.from(c.name).delete().eq("id",f[0].id),a.push({table:c.name,status:"exists",message:"Table exists and is accessible"}))}catch(a){b.push({table:c.name,error:a instanceof Error?a.message:"Unknown error"})}return u.NextResponse.json({success:0===b.length,message:0===b.length?"Database table check completed successfully!":"Database table check completed with some issues",results:a,errors:b,instructions:{note:"Some tables may need to be created manually in Supabase dashboard.",nextSteps:["Go to Supabase Dashboard > SQL Editor","Copy and paste the COMPLETE_DATABASE_FIX.sql script","Execute the script manually","Then run /api/setup-database to populate sample data"],manualTables:a.filter(a=>"needs_manual_creation"===a.status).map(a=>({name:a.table,sql:a.sql}))}})}catch(a){return console.error("Unexpected error during database setup:",a),u.NextResponse.json({error:"Internal server error",message:"Failed to setup database",details:a instanceof Error?a.message:"Unknown error",instructions:{note:"Automatic setup failed. Please create tables manually.",steps:["Go to Supabase Dashboard > SQL Editor","Copy and paste the COMPLETE_DATABASE_FIX.sql script","Execute the script manually","Then run /api/setup-database to populate sample data"]}},{status:500})}}let x=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/create-database-tables/route",pathname:"/api/create-database-tables",filename:"route",bundlePath:"app/api/create-database-tables/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/Users/danielkuschmierz/prepflow-landing/app/api/create-database-tables/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:y,workUnitAsyncStorage:z,serverHooks:A}=x;function B(){return(0,g.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:z})}async function C(a,b,c){var d;let e="/api/create-database-tables/route";"/index"===e&&(e="/");let g=await x.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:y,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!y){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||x.isDev||y||(G="/index"===(G=D)?"/":G);let H=!0===x.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>x.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>x.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await x.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await x.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await x.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},27910:a=>{"use strict";a.exports=require("stream")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55591:a=>{"use strict";a.exports=require("https")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{"use strict";a.exports=require("zlib")},78335:()=>{},79551:a=>{"use strict";a.exports=require("url")},81630:a=>{"use strict";a.exports=require("http")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[4586,1692,2461],()=>b(b.s=13354));module.exports=c})();