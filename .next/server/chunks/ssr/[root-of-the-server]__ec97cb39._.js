module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>GoogleAnalytics
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
// Default export with your correct measurement ID
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <module evaluation>");
'use client';
;
;
;
;
function GoogleAnalyticsInner({ measurementId }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const hasInitialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Initialize gtag function
    const initializeGtag = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    };
    // Track page views
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (pathname && window.gtag && hasInitialized.current) {
            // Track page view
            window.gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
            });
            console.log('📊 GA4 Page View tracked:', pathname);
        }
    }, [
        pathname,
        searchParams
    ]);
    // Initialize when component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Wait for scripts to load
        const checkGtag = ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            else {
                // Retry after a short delay
                setTimeout(checkGtag, 100);
            }
        };
        checkGtag();
    }, [
        measurementId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                strategy: "afterInteractive",
                src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
                onLoad: ()=>{
                    console.log('📥 Google Analytics script loaded');
                    initializeGtag();
                },
                onError: ()=>{
                    console.error('❌ Failed to load Google Analytics script');
                }
            }, void 0, false, {
                fileName: "[project]/components/GoogleAnalytics.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "google-analytics-init",
                strategy: "afterInteractive",
                dangerouslySetInnerHTML: {
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: false,
            });
            console.log('🔧 Google Analytics gtag function initialized');
          `
                },
                onLoad: ()=>{
                    console.log('✅ Google Analytics initialization script loaded');
                    initializeGtag();
                }
            }, void 0, false, {
                fileName: "[project]/components/GoogleAnalytics.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function GoogleAnalytics({ measurementId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GoogleAnalyticsInner, {
            measurementId: measurementId
        }, void 0, false, {
            fileName: "[project]/components/GoogleAnalytics.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/GoogleAnalytics.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <locals>");
}),
"[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GoogleAnalyticsDefault": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"],
    "default": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
});
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <locals>");
}),
"[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GoogleAnalyticsDefault": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GoogleAnalyticsDefault"],
    "default": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$exports$3e$__["default"]
});
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-ssr] (ecmascript) <exports>");
}),
"[project]/components/GoogleAnalyticsTest.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>GoogleAnalyticsTest
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function GoogleAnalyticsTest() {
    const [isGtagAvailable, setIsGtagAvailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [testEventSent, setTestEventSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if gtag is available
        const checkGtag = ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            else {
                console.log('⏳ Waiting for gtag function...');
                setTimeout(checkGtag, 500);
            }
        };
        checkGtag();
    }, []);
    const sendTestEvent = ()=>{
        if (window.gtag) {
            window.gtag('event', 'test_event', {
                event_category: 'testing',
                event_label: 'ga4_integration_test',
                value: 1,
                custom_parameter_test: 'true',
                custom_parameter_timestamp: Date.now()
            });
            setTestEventSent(true);
            console.log('🧪 Test event sent to Google Analytics');
            // Also test our analytics service
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
    };
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-sm z-50 max-w-xs",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "font-semibold mb-2",
                children: "🔍 GA4 Test Panel"
            }, void 0, false, {
                fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "gtag Available:"
                            }, void 0, false, {
                                fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: isGtagAvailable ? 'text-green-400' : 'text-red-400',
                                children: isGtagAvailable ? '✅' : '❌'
                            }, void 0, false, {
                                fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Test Event:"
                            }, void 0, false, {
                                fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: testEventSent ? 'text-green-400' : 'text-gray-400',
                                children: testEventSent ? '✅ Sent' : '⏳ Pending'
                            }, void 0, false, {
                                fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: sendTestEvent,
                        disabled: !isGtagAvailable,
                        className: "w-full mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-xs transition-colors",
                        children: "Send Test Event"
                    }, void 0, false, {
                        fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-400 mt-2",
                        children: "Check console for detailed logs"
                    }, void 0, false, {
                        fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/GoogleAnalyticsTest.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/GoogleAnalyticsTest.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/GoogleTagManager.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>GoogleTagManager,
    "pushToDataLayer": ()=>pushToDataLayer,
    "trackGTMConversion": ()=>trackGTMConversion,
    "trackGTMEngagement": ()=>trackGTMEngagement,
    "trackGTMEvent": ()=>trackGTMEvent
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function GoogleTagManagerInner({ gtmId, ga4MeasurementId }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const hasInitialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Initialize data layer
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    // Track page views
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        pathname,
        searchParams
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("noscript", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                    src: `https://www.googletagmanager.com/ns.html?id=${gtmId}`,
                    height: "0",
                    width: "0",
                    style: {
                        display: 'none',
                        visibility: 'hidden'
                    }
                }, void 0, false, {
                    fileName: "[project]/components/GoogleTagManager.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/GoogleTagManager.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "gtm-script",
                strategy: "afterInteractive",
                dangerouslySetInnerHTML: {
                    __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `
                },
                onLoad: ()=>{
                    console.log('📥 Google Tag Manager loaded');
                    // Initialize gtag function for backward compatibility
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                },
                onError: ()=>{
                    console.error('❌ Failed to load Google Tag Manager');
                }
            }, void 0, false, {
                fileName: "[project]/components/GoogleTagManager.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function GoogleTagManager({ gtmId, ga4MeasurementId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GoogleTagManagerInner, {
            gtmId: gtmId,
            ga4MeasurementId: ga4MeasurementId
        }, void 0, false, {
            fileName: "[project]/components/GoogleTagManager.tsx",
            lineNumber: 109,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/GoogleTagManager.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
function pushToDataLayer(data) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function trackGTMEvent(eventName, parameters = {}) {
    pushToDataLayer({
        event: eventName,
        ...parameters,
        timestamp: Date.now()
    });
}
function trackGTMConversion(conversionType, value, parameters = {}) {
    pushToDataLayer({
        event: 'conversion',
        conversion_type: conversionType,
        value: value,
        ...parameters,
        timestamp: Date.now()
    });
}
function trackGTMEngagement(engagementType, parameters = {}) {
    pushToDataLayer({
        event: 'engagement',
        engagement_type: engagementType,
        ...parameters,
        timestamp: Date.now()
    });
}
}),
"[project]/lib/ab-testing-analytics.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// PrepFlow A/B Testing Analytics
// Tracks variant performance, user behavior, and statistical significance
__turbopack_context__.s({
    "abTestingAnalytics": ()=>abTestingAnalytics,
    "assignVariant": ()=>assignVariant,
    "getActiveTests": ()=>getActiveTests,
    "getCurrentVariant": ()=>getCurrentVariant,
    "getTestResults": ()=>getTestResults,
    "getVariantAssignmentInfo": ()=>getVariantAssignmentInfo,
    "getVariantInfo": ()=>getVariantInfo,
    "trackConversion": ()=>trackConversion,
    "trackEngagement": ()=>trackEngagement
});
class ABTestingAnalytics {
    tests = new Map();
    events = [];
    userVariants = new Map();
    constructor(){
        this.initializeDefaultTests();
    }
    initializeDefaultTests() {
        // Define your A/B test variants
        this.addTest('landing_page_variants', [
            {
                id: 'control',
                name: 'Control',
                description: 'Original landing page',
                trafficSplit: 25,
                isControl: true
            },
            {
                id: 'variant_a',
                name: 'Variant A',
                description: 'Alternative hero section',
                trafficSplit: 25,
                isControl: false
            },
            {
                id: 'variant_b',
                name: 'Variant B',
                description: 'Different pricing layout',
                trafficSplit: 25,
                isControl: false
            },
            {
                id: 'variant_c',
                name: 'Variant C',
                description: 'New CTA positioning',
                trafficSplit: 25,
                isControl: false
            }
        ]);
    }
    addTest(testId, variants) {
        this.tests.set(testId, variants);
    }
    assignVariant(testId, userId) {
        console.log('🎯 Assigning variant for:', {
            testId,
            userId
        });
        const variants = this.tests.get(testId);
        if (!variants) {
            console.warn(`AB test ${testId} not found`);
            return 'control';
        }
        // Check for existing persistent variant assignment
        const persistentVariant = this.getPersistentVariant(userId);
        if (persistentVariant) {
            console.log('🎯 Returning existing persistent variant:', persistentVariant);
            return persistentVariant;
        }
        // Assign new persistent variant based on traffic split
        const assignedVariant = this.assignNewPersistentVariant(testId, userId, variants);
        console.log('🎯 Assigned new persistent variant:', assignedVariant);
        // Track variant assignment
        this.trackEvent({
            testId,
            variantId: assignedVariant,
            userId,
            sessionId: this.getSessionId(),
            eventType: 'variant_assigned',
            timestamp: Date.now(),
            metadata: {
                variant_name: variants.find((v)=>v.id === assignedVariant)?.name || assignedVariant,
                is_control: assignedVariant === 'control',
                assignment_type: 'persistent',
                rotation_period: '1_month'
            }
        });
        return assignedVariant;
    }
    getPersistentVariant(userId) {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
    assignNewPersistentVariant(testId, userId, variants) {
        // Assign variant based on traffic split
        const random = Math.random() * 100;
        let cumulativeSplit = 0;
        for (const variant of variants){
            cumulativeSplit += variant.trafficSplit;
            if (random <= cumulativeSplit) {
                const assignedVariant = variant.id;
                // Store persistent assignment
                this.storePersistentVariant(userId, assignedVariant);
                return assignedVariant;
            }
        }
        // Fallback to control
        const assignedVariant = 'control';
        this.storePersistentVariant(userId, assignedVariant);
        return assignedVariant;
    }
    storePersistentVariant(userId, variantId) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
    getCurrentVariant(testId, userId) {
        return this.assignVariant(testId, userId);
    }
    trackEvent(event) {
        this.events.push(event);
        // Send to Google Analytics with variant context
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Log in development
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('🧪 AB Test Event:', event);
        }
    }
    trackConversion(testId, userId, value, metadata) {
        const variantId = this.getCurrentVariant(testId, userId);
        this.trackEvent({
            testId,
            variantId,
            userId,
            sessionId: this.getSessionId(),
            eventType: 'conversion',
            eventValue: value,
            timestamp: Date.now(),
            metadata
        });
    }
    trackEngagement(testId, userId, engagementType, metadata) {
        const variantId = this.getCurrentVariant(testId, userId);
        this.trackEvent({
            testId,
            variantId,
            userId,
            sessionId: this.getSessionId(),
            eventType: 'engagement',
            timestamp: Date.now(),
            metadata: {
                engagement_type: engagementType,
                ...metadata
            }
        });
    }
    getTestResults(testId) {
        const variants = this.tests.get(testId);
        if (!variants) return [];
        const results = [];
        for (const variant of variants){
            const variantEvents = this.events.filter((e)=>e.testId === testId && e.variantId === variant.id);
            const totalUsers = new Set(variantEvents.map((e)=>e.userId)).size;
            const conversions = variantEvents.filter((e)=>e.eventType === 'conversion').length;
            const conversionRate = totalUsers > 0 ? conversions / totalUsers * 100 : 0;
            const conversionEvents = variantEvents.filter((e)=>e.eventType === 'conversion');
            const totalValue = conversionEvents.reduce((sum, e)=>sum + (e.eventValue || 0), 0);
            const averageOrderValue = conversions > 0 ? totalValue / conversions : 0;
            results.push({
                testId,
                variantId: variant.id,
                totalUsers,
                conversions,
                conversionRate,
                averageOrderValue,
                revenue: totalValue,
                statisticalSignificance: this.calculateStatisticalSignificance(testId, variant.id)
            });
        }
        return results.sort((a, b)=>b.conversionRate - a.conversionRate);
    }
    calculateStatisticalSignificance(testId, variantId) {
        // Simplified statistical significance calculation
        // In production, you'd want to use a proper statistical library
        const variantEvents = this.events.filter((e)=>e.testId === testId && e.variantId === variantId);
        const controlEvents = this.events.filter((e)=>e.testId === testId && e.variantId === 'control');
        const variantConversions = variantEvents.filter((e)=>e.eventType === 'conversion').length;
        const variantTotal = variantEvents.length;
        const controlConversions = controlEvents.filter((e)=>e.eventType === 'conversion').length;
        const controlTotal = controlEvents.length;
        if (variantTotal === 0 || controlTotal === 0) return 0;
        const variantRate = variantConversions / variantTotal;
        const controlRate = controlConversions / controlTotal;
        // Basic significance calculation (simplified)
        const difference = Math.abs(variantRate - controlRate);
        const significance = Math.min(difference * 100, 100); // 0-100 scale
        return Math.round(significance);
    }
    getSessionId() {
        // Generate or retrieve session ID
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return 'server_session_' + Date.now();
    }
    exportData() {
        return {
            tests: this.tests,
            events: this.events,
            userVariants: this.userVariants
        };
    }
    getActiveTests() {
        return Array.from(this.tests.keys());
    }
    getVariantInfo(testId, variantId) {
        const variants = this.tests.get(testId);
        return variants?.find((v)=>v.id === variantId);
    }
    getVariantAssignmentInfo(userId) {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
}
const abTestingAnalytics = new ABTestingAnalytics();
const assignVariant = abTestingAnalytics.assignVariant.bind(abTestingAnalytics);
const getCurrentVariant = abTestingAnalytics.getCurrentVariant.bind(abTestingAnalytics);
const trackConversion = abTestingAnalytics.trackConversion.bind(abTestingAnalytics);
const trackEngagement = abTestingAnalytics.trackEngagement.bind(abTestingAnalytics);
const getTestResults = abTestingAnalytics.getTestResults.bind(abTestingAnalytics);
const getActiveTests = abTestingAnalytics.getActiveTests.bind(abTestingAnalytics);
const getVariantInfo = abTestingAnalytics.getVariantInfo.bind(abTestingAnalytics);
const getVariantAssignmentInfo = abTestingAnalytics.getVariantAssignmentInfo.bind(abTestingAnalytics);
}),
"[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

// PrepFlow Analytics Service
// Tracks conversions, user behavior, and performance metrics
__turbopack_context__.s({
    "analytics": ()=>analytics,
    "getSessionId": ()=>getSessionId,
    "setUserId": ()=>setUserId,
    "trackConversion": ()=>trackConversion,
    "trackEvent": ()=>trackEvent,
    "trackPerformance": ()=>trackPerformance
});
// Export A/B testing functions
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ab$2d$testing$2d$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ab-testing-analytics.ts [app-ssr] (ecmascript)");
class PrepFlowAnalytics {
    sessionId;
    userId;
    events = [];
    conversions = [];
    performance = [];
    constructor(){
        this.sessionId = this.generateSessionId();
        this.loadUserId();
        this.initializeAnalytics();
    }
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    loadUserId() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    generateStableUserId() {
        // Generate a stable user ID that persists across sessions
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }
    initializeAnalytics() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    trackPageView() {
        const event = {
            action: 'page_view',
            category: 'navigation',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        };
        this.events.push(event);
        this.sendToAnalytics(event);
    }
    trackPerformance() {
        if ('performance' in window) {
            const observer = new PerformanceObserver((list)=>{
                for (const entry of list.getEntries()){
                    if (entry.entryType === 'navigation') {
                        const navEntry = entry;
                        const metrics = {
                            pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
                            firstContentfulPaint: 0,
                            largestContentfulPaint: 0,
                            firstInputDelay: 0,
                            cumulativeLayoutShift: 0,
                            timestamp: Date.now(),
                            page: window.location.pathname,
                            sessionId: this.sessionId
                        };
                        this.performance.push(metrics);
                        this.sendPerformanceMetrics(metrics);
                    }
                }
            });
            observer.observe({
                entryTypes: [
                    'navigation'
                ]
            });
        }
    }
    trackUserInteractions() {
        // Track CTA clicks
        document.addEventListener('click', (e)=>{
            const target = e.target;
            const cta = target.closest('a, button');
            if (cta) {
                const text = cta.textContent?.trim() || '';
                const href = cta.href;
                // Track Gumroad purchase links
                if (href && href.includes('gumroad.com/l/prepflow')) {
                    this.trackConversion({
                        type: 'cta_click',
                        element: 'gumroad_purchase',
                        page: window.location.pathname,
                        timestamp: Date.now(),
                        sessionId: this.sessionId,
                        userId: this.userId,
                        metadata: {
                            href,
                            text,
                            action: 'purchase_start'
                        }
                    });
                    // Send enhanced GA4 event
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                }
                // Track demo/watch buttons
                if (text.includes('Watch Demo') || text.includes('Demo')) {
                    this.trackConversion({
                        type: 'demo_watch',
                        element: text,
                        page: window.location.pathname,
                        timestamp: Date.now(),
                        sessionId: this.sessionId,
                        userId: this.userId,
                        metadata: {
                            href,
                            text,
                            action: 'demo_start'
                        }
                    });
                }
                // Track general CTA clicks
                if (text.includes('Get Started') || text.includes('Start')) {
                    this.trackConversion({
                        type: 'cta_click',
                        element: text,
                        page: window.location.pathname,
                        timestamp: Date.now(),
                        sessionId: this.sessionId,
                        userId: this.userId,
                        metadata: {
                            href,
                            text,
                            action: 'cta_click'
                        }
                    });
                }
            }
        });
        // Track scroll depth and key sections
        let maxScrollDepth = 0;
        const keySections = [
            '#features',
            '#demo',
            '#pricing',
            '#faq'
        ];
        window.addEventListener('scroll', ()=>{
            const scrollDepth = Math.round(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                if (maxScrollDepth % 25 === 0) {
                    this.trackEvent('scroll_depth', 'engagement', `${maxScrollDepth}%`);
                }
            }
            // Track key section visibility
            keySections.forEach((sectionId)=>{
                const section = document.querySelector(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible && !section.hasAttribute('data-tracked')) {
                        section.setAttribute('data-tracked', 'true');
                        const sectionName = sectionId.replace('#', '');
                        this.trackEvent('section_view', 'engagement', sectionName);
                        // Send enhanced GA4 event for key sections
                        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                        ;
                    }
                }
            });
        });
    }
    trackConversions() {
        // Track demo video views
        const demoVideo = document.querySelector('iframe[src*="youtube"]');
        if (demoVideo) {
            // YouTube iframe tracking would require YouTube API integration
            // For now, we'll track when the demo section comes into view
            const observer = new IntersectionObserver((entries)=>{
                entries.forEach((entry)=>{
                    if (entry.isIntersecting) {
                        this.trackConversion({
                            type: 'demo_watch',
                            element: 'demo_section',
                            page: window.location.pathname,
                            timestamp: Date.now(),
                            sessionId: this.sessionId,
                            userId: this.userId,
                            metadata: {
                                section: 'demo'
                            }
                        });
                        observer.disconnect();
                    }
                });
            });
            observer.observe(demoVideo);
        }
    }
    trackEvent(action, category, label, value) {
        const event = {
            action,
            category,
            label,
            value,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            page: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '/',
            referrer: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined,
            userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined
        };
        this.events.push(event);
        this.sendToAnalytics(event);
    }
    trackConversion(conversion) {
        this.conversions.push(conversion);
        this.sendConversionData(conversion);
        // Also track as a regular event
        this.trackEvent('conversion', 'business', conversion.type, 1);
    }
    trackPerformanceMetrics(metrics) {
        const fullMetrics = {
            pageLoadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0,
            timestamp: Date.now(),
            page: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '/',
            sessionId: this.sessionId,
            ...metrics
        };
        this.performance.push(fullMetrics);
        this.sendPerformanceMetrics(fullMetrics);
    }
    sendToAnalytics(event) {
        // Send to Vercel Analytics (automatic)
        // Send to custom analytics endpoint if needed
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('📊 Analytics Event:', event);
        }
        // Send to Google Analytics 4
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    sendConversionData(conversion) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('🎯 Conversion Event:', conversion);
        }
        // Send to Google Analytics 4
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    // Send to conversion tracking endpoints
    // Example: Facebook Pixel, Google Ads, etc.
    }
    sendPerformanceMetrics(metrics) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('⚡ Performance Metrics:', metrics);
        }
    // Send to performance monitoring services
    // Example: Sentry, LogRocket, etc.
    }
    getSessionId() {
        return this.sessionId;
    }
    getUserId() {
        return this.userId;
    }
    setUserId(userId) {
        this.userId = userId;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    getEvents() {
        return [
            ...this.events
        ];
    }
    getConversions() {
        return [
            ...this.conversions
        ];
    }
    getPerformance() {
        return [
            ...this.performance
        ];
    }
    exportData() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            events: this.events,
            conversions: this.conversions,
            performance: this.performance
        };
    }
}
const analytics = new PrepFlowAnalytics();
const trackEvent = analytics.trackEvent.bind(analytics);
const trackConversion = analytics.trackConversion.bind(analytics);
const trackPerformance = analytics.trackPerformanceMetrics.bind(analytics);
const getSessionId = analytics.getSessionId.bind(analytics);
const setUserId = analytics.setUserId.bind(analytics);
;
}),
"[project]/lib/analytics.ts [app-ssr] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ab$2d$testing$2d$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ab-testing-analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>");
}),
"[project]/lib/performance-budgets.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Performance Budgets Implementation for PrepFlow
// Automated performance budget enforcement with Lighthouse CI
// Performance budget configuration
__turbopack_context__.s({
    "PERFORMANCE_BUDGETS": ()=>PERFORMANCE_BUDGETS,
    "PerformanceBudgetManager": ()=>PerformanceBudgetManager,
    "alertPerformanceBudgetViolations": ()=>alertPerformanceBudgetViolations,
    "performanceBudgetManager": ()=>performanceBudgetManager,
    "trackPerformanceBudget": ()=>trackPerformanceBudget
});
const PERFORMANCE_BUDGETS = {
    // Core Web Vitals budgets
    coreWebVitals: {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        fcp: 1800,
        tti: 3800,
        si: 3000,
        tbt: 300
    },
    // Resource budgets
    resources: {
        totalSize: 500000,
        jsSize: 200000,
        cssSize: 50000,
        imageSize: 100000,
        fontSize: 30000,
        thirdPartySize: 100000
    },
    // Network budgets
    network: {
        totalRequests: 50,
        jsRequests: 10,
        cssRequests: 3,
        imageRequests: 15,
        fontRequests: 5,
        thirdPartyRequests: 10
    },
    // Performance scores
    scores: {
        performance: 80,
        accessibility: 90,
        bestPractices: 80,
        seo: 80
    },
    // Page-specific budgets
    pages: {
        landing: {
            lcp: 2000,
            fid: 80,
            cls: 0.08,
            totalSize: 400000,
            jsSize: 150000
        },
        webapp: {
            lcp: 3000,
            fid: 100,
            cls: 0.1,
            totalSize: 600000,
            jsSize: 250000
        },
        auth: {
            lcp: 1500,
            fid: 60,
            cls: 0.05,
            totalSize: 200000,
            jsSize: 100000
        }
    }
};
class PerformanceBudgetManager {
    static instance;
    violations = [];
    budgets = PERFORMANCE_BUDGETS;
    static getInstance() {
        if (!PerformanceBudgetManager.instance) {
            PerformanceBudgetManager.instance = new PerformanceBudgetManager();
        }
        return PerformanceBudgetManager.instance;
    }
    // Check performance budget against metrics
    checkBudget(metrics, pageType = 'landing') {
        const violations = [];
        const pageBudgets = this.budgets.pages[pageType] || this.budgets.pages.landing;
        // Check Core Web Vitals
        if (metrics.lcp && metrics.lcp > pageBudgets.lcp) {
            violations.push({
                metric: 'lcp',
                actual: metrics.lcp,
                budget: pageBudgets.lcp,
                severity: this.getSeverity(metrics.lcp, pageBudgets.lcp),
                message: `LCP ${metrics.lcp}ms exceeds budget of ${pageBudgets.lcp}ms`
            });
        }
        if (metrics.fid && metrics.fid > pageBudgets.fid) {
            violations.push({
                metric: 'fid',
                actual: metrics.fid,
                budget: pageBudgets.fid,
                severity: this.getSeverity(metrics.fid, pageBudgets.fid),
                message: `FID ${metrics.fid}ms exceeds budget of ${pageBudgets.fid}ms`
            });
        }
        if (metrics.cls && metrics.cls > pageBudgets.cls) {
            violations.push({
                metric: 'cls',
                actual: metrics.cls,
                budget: pageBudgets.cls,
                severity: this.getSeverity(metrics.cls, pageBudgets.cls),
                message: `CLS ${metrics.cls} exceeds budget of ${pageBudgets.cls}`
            });
        }
        // Check resource budgets
        if (metrics.resources) {
            if (metrics.resources.totalSize > pageBudgets.totalSize) {
                violations.push({
                    metric: 'totalSize',
                    actual: metrics.resources.totalSize,
                    budget: pageBudgets.totalSize,
                    severity: this.getSeverity(metrics.resources.totalSize, pageBudgets.totalSize),
                    message: `Total size ${metrics.resources.totalSize} bytes exceeds budget of ${pageBudgets.totalSize} bytes`
                });
            }
            if (metrics.resources.jsSize > pageBudgets.jsSize) {
                violations.push({
                    metric: 'jsSize',
                    actual: metrics.resources.jsSize,
                    budget: pageBudgets.jsSize,
                    severity: this.getSeverity(metrics.resources.jsSize, pageBudgets.jsSize),
                    message: `JavaScript size ${metrics.resources.jsSize} bytes exceeds budget of ${pageBudgets.jsSize} bytes`
                });
            }
        }
        // Store violations
        this.violations.push(...violations);
        return {
            passed: violations.length === 0,
            violations,
            score: this.calculateScore(violations),
            timestamp: Date.now(),
            pageType
        };
    }
    // Get severity level for violation
    getSeverity(actual, budget) {
        const ratio = actual / budget;
        if (ratio >= 2) return 'critical';
        if (ratio >= 1.5) return 'high';
        if (ratio >= 1.2) return 'medium';
        return 'low';
    }
    // Calculate performance score
    calculateScore(violations) {
        if (violations.length === 0) return 100;
        const criticalViolations = violations.filter((v)=>v.severity === 'critical').length;
        const highViolations = violations.filter((v)=>v.severity === 'high').length;
        const mediumViolations = violations.filter((v)=>v.severity === 'medium').length;
        const lowViolations = violations.filter((v)=>v.severity === 'low').length;
        // Calculate score based on violation severity
        const score = Math.max(0, 100 - (criticalViolations * 25 + highViolations * 15 + mediumViolations * 10 + lowViolations * 5));
        return Math.round(score);
    }
    // Get all violations
    getViolations() {
        return [
            ...this.violations
        ];
    }
    // Get violations by severity
    getViolationsBySeverity(severity) {
        return this.violations.filter((v)=>v.severity === severity);
    }
    // Clear violations
    clearViolations() {
        this.violations = [];
    }
    // Generate budget report
    generateBudgetReport() {
        const totalViolations = this.violations.length;
        const criticalViolations = this.getViolationsBySeverity('critical').length;
        const highViolations = this.getViolationsBySeverity('high').length;
        const mediumViolations = this.getViolationsBySeverity('medium').length;
        const lowViolations = this.getViolationsBySeverity('low').length;
        return {
            totalViolations,
            criticalViolations,
            highViolations,
            mediumViolations,
            lowViolations,
            score: this.calculateScore(this.violations),
            violations: this.violations,
            timestamp: Date.now()
        };
    }
    // Check if budget is within acceptable limits
    isWithinBudget(metrics, pageType = 'landing') {
        const result = this.checkBudget(metrics, pageType);
        return result.passed;
    }
    // Get budget recommendations
    getBudgetRecommendations(violations) {
        const recommendations = [];
        violations.forEach((violation)=>{
            switch(violation.metric){
                case 'lcp':
                    recommendations.push('Optimize images, reduce server response time, or eliminate render-blocking resources');
                    break;
                case 'fid':
                    recommendations.push('Reduce JavaScript execution time or break up long tasks');
                    break;
                case 'cls':
                    recommendations.push('Add size attributes to images and videos, avoid inserting content above existing content');
                    break;
                case 'totalSize':
                    recommendations.push('Enable compression, remove unused code, or optimize images');
                    break;
                case 'jsSize':
                    recommendations.push('Code splitting, tree shaking, or remove unused JavaScript');
                    break;
                case 'cssSize':
                    recommendations.push('Remove unused CSS or inline critical CSS');
                    break;
                case 'imageSize':
                    recommendations.push('Optimize images, use modern formats (WebP/AVIF), or implement lazy loading');
                    break;
                case 'fontSize':
                    recommendations.push('Font subsetting, preloading, or use system fonts');
                    break;
            }
        });
        return [
            ...new Set(recommendations)
        ]; // Remove duplicates
    }
}
const performanceBudgetManager = PerformanceBudgetManager.getInstance();
function trackPerformanceBudget(metrics, pageType = 'landing') {
    const result = performanceBudgetManager.checkBudget(metrics, pageType);
    if (!result.passed) {
        console.warn('🚨 Performance budget violations detected:', result.violations);
        // Send to analytics
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
}
function alertPerformanceBudgetViolations(violations) {
    const criticalViolations = violations.filter((v)=>v.severity === 'critical');
    const highViolations = violations.filter((v)=>v.severity === 'high');
    if (criticalViolations.length > 0) {
        console.error('🚨 CRITICAL performance budget violations:', criticalViolations);
        // Send critical alert
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    if (highViolations.length > 0) {
        console.warn('⚠️ HIGH performance budget violations:', highViolations);
        // Send high priority alert
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
}
}),
"[project]/lib/advanced-rum.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Advanced Real User Monitoring (RUM) for PrepFlow
// Implements comprehensive performance monitoring with error tracking
// RUM configuration
__turbopack_context__.s({
    "AdvancedRUMManager": ()=>AdvancedRUMManager,
    "RUM_CONFIG": ()=>RUM_CONFIG,
    "advancedRUMManager": ()=>advancedRUMManager,
    "initializeRUM": ()=>initializeRUM,
    "trackCustomError": ()=>trackCustomError,
    "trackCustomInteraction": ()=>trackCustomInteraction
});
const RUM_CONFIG = {
    // Sampling rates
    sampling: {
        performance: 0.1,
        errors: 1.0,
        userInteractions: 0.05,
        resourceTiming: 0.2
    },
    // Performance thresholds
    thresholds: {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        fcp: 1800,
        tti: 3800,
        si: 3000,
        tbt: 300
    },
    // Error tracking
    errorTracking: {
        enabled: true,
        maxErrors: 100,
        errorTimeout: 5000
    },
    // Session tracking
    session: {
        timeout: 30 * 60 * 1000,
        maxDuration: 24 * 60 * 60 * 1000
    }
};
class AdvancedRUMManager {
    static instance;
    sessionId;
    userId;
    startTime;
    data;
    observers = new Map();
    errorCount = 0;
    isInitialized = false;
    static getInstance() {
        if (!AdvancedRUMManager.instance) {
            AdvancedRUMManager.instance = new AdvancedRUMManager();
        }
        return AdvancedRUMManager.instance;
    }
    constructor(){
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.data = this.initializeRUMData();
    }
    // Initialize RUM monitoring
    initialize() {
        if (this.isInitialized || "undefined" === 'undefined') return;
        //TURBOPACK unreachable
        ;
    }
    // Initialize performance monitoring
    initializePerformanceMonitoring() {
        if (Math.random() > RUM_CONFIG.sampling.performance) return;
        // LCP Observer
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list)=>{
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    this.data.performance.lcp = lastEntry.startTime;
                    this.trackPerformanceMetric('lcp', lastEntry.startTime);
                }
            });
            lcpObserver.observe({
                entryTypes: [
                    'largest-contentful-paint'
                ]
            });
            this.observers.set('lcp', lcpObserver);
        }
        // FID Observer
        if ('PerformanceObserver' in window) {
            const fidObserver = new PerformanceObserver((list)=>{
                list.getEntries().forEach((entry)=>{
                    const fid = entry.processingStart - entry.startTime;
                    this.data.performance.fid = fid;
                    this.trackPerformanceMetric('fid', fid);
                });
            });
            fidObserver.observe({
                entryTypes: [
                    'first-input'
                ]
            });
            this.observers.set('fid', fidObserver);
        }
        // CLS Observer
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list)=>{
                list.getEntries().forEach((entry)=>{
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
            });
            clsObserver.observe({
                entryTypes: [
                    'layout-shift'
                ]
            });
            this.observers.set('cls', clsObserver);
            // Track CLS after a delay
            setTimeout(()=>{
                this.data.performance.cls = clsValue;
                this.trackPerformanceMetric('cls', clsValue);
            }, 5000);
        }
        // Memory monitoring
        if ('memory' in performance) {
            const memory = performance.memory;
            this.data.performance.memory = {
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit
            };
        }
    }
    // Initialize error tracking
    initializeErrorTracking() {
        if (!RUM_CONFIG.errorTracking.enabled) return;
        // Global error handler
        window.addEventListener('error', (event)=>{
            this.trackError({
                message: event.message,
                stack: event.error?.stack,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: Date.now(),
                severity: this.getErrorSeverity(event.error),
                context: {
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }
            });
        });
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event)=>{
            this.trackError({
                message: `Unhandled Promise Rejection: ${event.reason}`,
                stack: event.reason?.stack,
                timestamp: Date.now(),
                severity: 'high',
                context: {
                    url: window.location.href,
                    userAgent: navigator.userAgent
                }
            });
        });
    }
    // Initialize interaction tracking
    initializeInteractionTracking() {
        if (Math.random() > RUM_CONFIG.sampling.userInteractions) return;
        const interactionTypes = [
            'click',
            'scroll',
            'keydown',
            'resize',
            'focus',
            'blur'
        ];
        interactionTypes.forEach((type)=>{
            window.addEventListener(type, (event)=>{
                this.trackInteraction({
                    type: type,
                    target: this.getElementSelector(event.target),
                    timestamp: Date.now(),
                    x: event.clientX,
                    y: event.clientY,
                    key: event.key,
                    deltaX: event.deltaX,
                    deltaY: event.deltaY
                });
            });
        });
    }
    // Initialize resource monitoring
    initializeResourceMonitoring() {
        if (Math.random() > RUM_CONFIG.sampling.resourceTiming) return;
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list)=>{
                list.getEntries().forEach((entry)=>{
                    if (entry.entryType === 'resource') {
                        this.trackResource({
                            name: entry.name,
                            type: entry.initiatorType,
                            duration: entry.duration,
                            size: entry.transferSize || 0,
                            startTime: entry.startTime,
                            endTime: entry.startTime + entry.duration,
                            success: entry.transferSize > 0,
                            error: entry.transferSize === 0 ? 'Failed to load' : undefined
                        });
                    }
                });
            });
            resourceObserver.observe({
                entryTypes: [
                    'resource'
                ]
            });
            this.observers.set('resource', resourceObserver);
        }
    }
    // Initialize navigation monitoring
    initializeNavigationMonitoring() {
        if ('PerformanceObserver' in window) {
            const navObserver = new PerformanceObserver((list)=>{
                list.getEntries().forEach((entry)=>{
                    if (entry.entryType === 'navigation') {
                        this.data.navigation = {
                            type: entry.type,
                            startTime: entry.startTime,
                            endTime: entry.loadEventEnd,
                            duration: entry.loadEventEnd - entry.startTime,
                            redirectCount: entry.redirectCount,
                            transferSize: entry.transferSize,
                            encodedBodySize: entry.encodedBodySize,
                            decodedBodySize: entry.decodedBodySize
                        };
                    }
                });
            });
            navObserver.observe({
                entryTypes: [
                    'navigation'
                ]
            });
            this.observers.set('navigation', navObserver);
        }
    }
    // Initialize session management
    initializeSessionManagement() {
        // Session timeout
        setTimeout(()=>{
            this.endSession();
        }, RUM_CONFIG.session.timeout);
        // Page visibility change
        document.addEventListener('visibilitychange', ()=>{
            if (document.hidden) {
                this.pauseSession();
            } else {
                this.resumeSession();
            }
        });
        // Page unload
        window.addEventListener('beforeunload', ()=>{
            this.endSession();
        });
    }
    // Track performance metric
    trackPerformanceMetric(metric, value) {
        const threshold = RUM_CONFIG.thresholds[metric];
        const isViolation = threshold && value > threshold;
        if (isViolation) {
            console.warn(`⚠️ Performance threshold exceeded: ${metric} = ${value}ms (threshold: ${threshold}ms)`);
        }
        // Send to analytics
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Track error
    trackError(error) {
        if (this.errorCount >= RUM_CONFIG.errorTracking.maxErrors) return;
        this.data.errors.push(error);
        this.errorCount++;
        console.error('🚨 RUM Error tracked:', error);
        // Send to analytics
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Track interaction
    trackInteraction(interaction) {
        this.data.interactions.push(interaction);
        // Send to analytics
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Track resource
    trackResource(resource) {
        this.data.resources.push(resource);
        // Send to analytics
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Get error severity
    getErrorSeverity(error) {
        if (error.name === 'ChunkLoadError' || error.name === 'Loading chunk failed') {
            return 'critical';
        }
        if (error.name === 'TypeError' || error.name === 'ReferenceError') {
            return 'high';
        }
        if (error.name === 'SyntaxError') {
            return 'medium';
        }
        return 'low';
    }
    // Get element selector
    getElementSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    }
    // Generate session ID
    generateSessionId() {
        return 'rum_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    // Initialize RUM data
    initializeRUMData() {
        if ("TURBOPACK compile-time truthy", 1) {
            // Server-side fallback
            return {
                sessionId: this.sessionId,
                userId: this.userId,
                page: '/',
                timestamp: Date.now(),
                userAgent: 'Server',
                viewport: {
                    width: 0,
                    height: 0
                },
                connection: {
                    effectiveType: 'unknown',
                    downlink: 0,
                    rtt: 0
                },
                performance: {},
                errors: [],
                interactions: [],
                resources: [],
                navigation: {
                    type: 'navigate',
                    startTime: 0,
                    endTime: 0,
                    duration: 0,
                    redirectCount: 0,
                    transferSize: 0,
                    encodedBodySize: 0,
                    decodedBodySize: 0
                }
            };
        }
        //TURBOPACK unreachable
        ;
    }
    // Pause session
    pauseSession() {
        console.log('⏸️ RUM session paused');
    }
    // Resume session
    resumeSession() {
        console.log('▶️ RUM session resumed');
    }
    // End session
    endSession() {
        console.log('🏁 RUM session ended');
        // Send final data
        this.sendRUMData();
        // Clean up observers
        this.observers.forEach((observer)=>observer.disconnect());
        this.observers.clear();
    }
    // Send RUM data
    sendRUMData() {
        // Send to analytics
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Get RUM data
    getRUMData() {
        return {
            ...this.data
        };
    }
    // Set user ID
    setUserId(userId) {
        this.userId = userId;
        this.data.userId = userId;
    }
    // Get session ID
    getSessionId() {
        return this.sessionId;
    }
}
const advancedRUMManager = AdvancedRUMManager.getInstance();
function initializeRUM() {
    advancedRUMManager.initialize();
}
function trackCustomError(message, context) {
    advancedRUMManager['trackError']({
        message,
        timestamp: Date.now(),
        severity: 'medium',
        context
    });
}
function trackCustomInteraction(type, target, data) {
    advancedRUMManager['trackInteraction']({
        type: type,
        target,
        timestamp: Date.now(),
        ...data
    });
}
}),
"[project]/lib/performance-ab-testing.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Performance-Based A/B Testing for PrepFlow
// Implements A/B testing with performance metrics as success criteria
// A/B testing configuration
__turbopack_context__.s({
    "AB_TEST_CONFIG": ()=>AB_TEST_CONFIG,
    "PerformanceABTestingManager": ()=>PerformanceABTestingManager,
    "getABTestVariant": ()=>getABTestVariant,
    "initializePerformanceABTesting": ()=>initializePerformanceABTesting,
    "performanceABTestingManager": ()=>performanceABTestingManager,
    "trackABTestPerformance": ()=>trackABTestPerformance
});
const AB_TEST_CONFIG = {
    // Test variants
    variants: {
        control: {
            name: 'Control',
            weight: 0.25
        },
        variant_a: {
            name: 'Variant A',
            weight: 0.25
        },
        variant_b: {
            name: 'Variant B',
            weight: 0.25
        },
        variant_c: {
            name: 'Variant C',
            weight: 0.25
        }
    },
    // Performance metrics to track
    performanceMetrics: [
        'lcp',
        'fid',
        'cls',
        'fcp',
        'tti',
        'si',
        'tbt'
    ],
    // Success criteria
    successCriteria: {
        lcp: {
            threshold: 2500,
            weight: 0.3
        },
        fid: {
            threshold: 100,
            weight: 0.2
        },
        cls: {
            threshold: 0.1,
            weight: 0.2
        },
        fcp: {
            threshold: 1800,
            weight: 0.15
        },
        tti: {
            threshold: 3800,
            weight: 0.1
        },
        si: {
            threshold: 3000,
            weight: 0.05
        }
    },
    // Test duration and sample size
    testDuration: 14 * 24 * 60 * 60 * 1000,
    minSampleSize: 100,
    maxSampleSize: 10000,
    // Statistical significance
    confidenceLevel: 0.95,
    power: 0.8
};
class PerformanceABTestingManager {
    static instance;
    activeTests = new Map();
    testData = new Map();
    currentVariant = null;
    static getInstance() {
        if (!PerformanceABTestingManager.instance) {
            PerformanceABTestingManager.instance = new PerformanceABTestingManager();
        }
        return PerformanceABTestingManager.instance;
    }
    // Create new A/B test
    createTest(test) {
        const id = this.generateTestId();
        const newTest = {
            ...test,
            id,
            startDate: Date.now(),
            status: 'draft'
        };
        this.activeTests.set(id, newTest);
        this.testData.set(id, []);
        console.log(`🧪 A/B test created: ${test.name} (${id})`);
        return id;
    }
    // Start A/B test
    startTest(testId) {
        const test = this.activeTests.get(testId);
        if (!test) return false;
        test.status = 'running';
        test.startDate = Date.now();
        test.endDate = test.startDate + AB_TEST_CONFIG.testDuration;
        console.log(`🚀 A/B test started: ${test.name}`);
        return true;
    }
    // Assign user to variant
    assignVariant(testId, userId) {
        const test = this.activeTests.get(testId);
        if (!test || test.status !== 'running') return null;
        // Check if user already assigned
        const existingAssignment = this.getUserAssignment(testId, userId);
        if (existingAssignment) return existingAssignment;
        // Assign based on weights
        const variant = this.selectVariant(test.variants);
        if (!variant) return null;
        // Store assignment
        this.storeUserAssignment(testId, userId, variant.id);
        // Track assignment
        this.trackVariantAssignment(testId, variant.id, userId);
        return variant.id;
    }
    // Track performance metrics for variant
    trackPerformance(testId, variantId, metrics, userId) {
        const test = this.activeTests.get(testId);
        if (!test || test.status !== 'running') return;
        // Store performance data
        const data = {
            testId,
            variantId,
            userId,
            metrics,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        };
        this.testData.get(testId)?.push(data);
        // Update variant performance
        this.updateVariantPerformance(testId, variantId, metrics);
        // Check if test should end
        this.checkTestCompletion(testId);
        // Track performance
        this.trackPerformanceMetric(testId, variantId, metrics, userId);
    }
    // Get current variant for user
    getCurrentVariant(testId, userId) {
        return this.getUserAssignment(testId, userId);
    }
    // Get test results
    getTestResults(testId) {
        const test = this.activeTests.get(testId);
        if (!test || !test.results) return null;
        return test.results;
    }
    // Get all active tests
    getActiveTests() {
        return Array.from(this.activeTests.values()).filter((test)=>test.status === 'running');
    }
    // Select variant based on weights
    selectVariant(variants) {
        const random = Math.random();
        let cumulative = 0;
        for (const variant of variants){
            cumulative += variant.weight;
            if (random <= cumulative) {
                return variant;
            }
        }
        return variants[0]; // Fallback to first variant
    }
    // Update variant performance
    updateVariantPerformance(testId, variantId, metrics) {
        const test = this.activeTests.get(testId);
        if (!test) return;
        const variant = test.variants.find((v)=>v.id === variantId);
        if (!variant) return;
        // Update performance metrics
        Object.keys(metrics).forEach((key)=>{
            const value = metrics[key];
            if (typeof value === 'number') {
                variant.performance[key] = value;
            }
        });
        // Calculate performance score
        variant.performance.score = this.calculatePerformanceScore(metrics);
    }
    // Calculate performance score
    calculatePerformanceScore(metrics) {
        let score = 0;
        let totalWeight = 0;
        Object.keys(AB_TEST_CONFIG.successCriteria).forEach((metric)=>{
            const criteria = AB_TEST_CONFIG.successCriteria[metric];
            const value = metrics[metric];
            if (typeof value === 'number') {
                const normalizedValue = Math.min(value / criteria.threshold, 1);
                score += normalizedValue * criteria.weight;
                totalWeight += criteria.weight;
            }
        });
        return totalWeight > 0 ? score / totalWeight * 100 : 0;
    }
    // Check if test should complete
    checkTestCompletion(testId) {
        const test = this.activeTests.get(testId);
        if (!test) return;
        const data = this.testData.get(testId) || [];
        const totalUsers = data.length;
        // Check if minimum sample size reached
        if (totalUsers < AB_TEST_CONFIG.minSampleSize) return;
        // Check if test duration exceeded
        if (Date.now() > test.endDate) {
            this.completeTest(testId);
            return;
        }
        // Check if maximum sample size reached
        if (totalUsers >= AB_TEST_CONFIG.maxSampleSize) {
            this.completeTest(testId);
            return;
        }
        // Check if statistical significance reached
        if (this.isStatisticallySignificant(testId)) {
            this.completeTest(testId);
            return;
        }
    }
    // Complete test and calculate results
    completeTest(testId) {
        const test = this.activeTests.get(testId);
        if (!test) return;
        test.status = 'completed';
        test.results = this.calculateTestResults(testId);
        console.log(`🏁 A/B test completed: ${test.name}`);
        console.log(`🏆 Winner: ${test.results?.winner}`);
        console.log(`📊 Confidence: ${test.results?.confidence}%`);
    }
    // Calculate test results
    calculateTestResults(testId) {
        const test = this.activeTests.get(testId);
        if (!test) return {};
        const data = this.testData.get(testId) || [];
        const variants = test.variants;
        // Calculate performance scores for each variant
        const variantScores = variants.map((variant)=>{
            const variantData = data.filter((d)=>d.variantId === variant.id);
            const avgScore = variantData.length > 0 ? variantData.reduce((sum, d)=>sum + (d.metrics.score || 0), 0) / variantData.length : 0;
            return {
                variantId: variant.id,
                score: avgScore,
                sampleSize: variantData.length
            };
        });
        // Find winner
        const winner = variantScores.reduce((prev, current)=>current.score > prev.score ? current : prev);
        // Calculate statistical significance
        const confidence = this.calculateConfidence(variantScores);
        const pValue = this.calculatePValue(variantScores);
        const effectSize = this.calculateEffectSize(variantScores);
        // Generate recommendations
        const recommendations = this.generateRecommendations(test, variantScores);
        return {
            winner: winner.variantId,
            confidence,
            pValue,
            effectSize,
            sampleSize: data.length,
            duration: Date.now() - test.startDate,
            recommendations
        };
    }
    // Calculate confidence level
    calculateConfidence(variantScores) {
        // Simplified confidence calculation
        // In a real implementation, you'd use proper statistical tests
        const scores = variantScores.map((v)=>v.score);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const range = maxScore - minScore;
        return range > 0 ? Math.min(95, range / maxScore * 100) : 50;
    }
    // Calculate p-value
    calculatePValue(variantScores) {
        // Simplified p-value calculation
        // In a real implementation, you'd use proper statistical tests
        const scores = variantScores.map((v)=>v.score);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const range = maxScore - minScore;
        return range > 0 ? Math.max(0.01, 1 - range / maxScore) : 0.5;
    }
    // Calculate effect size
    calculateEffectSize(variantScores) {
        // Simplified effect size calculation
        const scores = variantScores.map((v)=>v.score);
        const mean = scores.reduce((sum, score)=>sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score)=>sum + Math.pow(score - mean, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);
        return stdDev > 0 ? (Math.max(...scores) - Math.min(...scores)) / stdDev : 0;
    }
    // Check if results are statistically significant
    isStatisticallySignificant(testId) {
        const test = this.activeTests.get(testId);
        if (!test) return false;
        const data = this.testData.get(testId) || [];
        const variants = test.variants;
        // Simplified significance check
        // In a real implementation, you'd use proper statistical tests
        const variantScores = variants.map((variant)=>{
            const variantData = data.filter((d)=>d.variantId === variant.id);
            return variantData.length > 0 ? variantData.reduce((sum, d)=>sum + (d.metrics.score || 0), 0) / variantData.length : 0;
        });
        const maxScore = Math.max(...variantScores);
        const minScore = Math.min(...variantScores);
        const range = maxScore - minScore;
        return range > 10 && data.length >= AB_TEST_CONFIG.minSampleSize;
    }
    // Generate recommendations
    generateRecommendations(test, variantScores) {
        const recommendations = [];
        const winner = variantScores.reduce((prev, current)=>current.score > prev.score ? current : prev);
        recommendations.push(`Winner: ${winner.variantId} with score ${winner.score.toFixed(2)}`);
        if (winner.score > 80) {
            recommendations.push('Consider implementing the winning variant as the default');
        } else if (winner.score < 60) {
            recommendations.push('Consider running additional tests or refining the variants');
        }
        const lowPerformingVariants = variantScores.filter((v)=>v.score < 50);
        if (lowPerformingVariants.length > 0) {
            recommendations.push(`Consider removing low-performing variants: ${lowPerformingVariants.map((v)=>v.variantId).join(', ')}`);
        }
        return recommendations;
    }
    // Track variant assignment
    trackVariantAssignment(testId, variantId, userId) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Track performance metric
    trackPerformanceMetric(testId, variantId, metrics, userId) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Store user assignment
    storeUserAssignment(testId, userId, variantId) {
        const key = `ab_test_${testId}_${userId}`;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Get user assignment
    getUserAssignment(testId, userId) {
        const key = `ab_test_${testId}_${userId}`;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return null;
    }
    // Get session ID
    getSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }
    // Generate test ID
    generateTestId() {
        return 'test_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
}
const performanceABTestingManager = PerformanceABTestingManager.getInstance();
function initializePerformanceABTesting() {
    console.log('🧪 Initializing Performance-based A/B Testing...');
    // Create example tests
    const testId = performanceABTestingManager.createTest({
        name: 'Landing Page Performance Optimization',
        description: 'Test different landing page configurations for performance',
        endDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
        variants: [
            {
                id: 'control',
                name: 'Control',
                weight: 0.25,
                config: {},
                performance: {},
                users: 0,
                conversions: 0,
                conversionRate: 0
            },
            {
                id: 'variant_a',
                name: 'Variant A',
                weight: 0.25,
                config: {},
                performance: {},
                users: 0,
                conversions: 0,
                conversionRate: 0
            },
            {
                id: 'variant_b',
                name: 'Variant B',
                weight: 0.25,
                config: {},
                performance: {},
                users: 0,
                conversions: 0,
                conversionRate: 0
            },
            {
                id: 'variant_c',
                name: 'Variant C',
                weight: 0.25,
                config: {},
                performance: {},
                users: 0,
                conversions: 0,
                conversionRate: 0
            }
        ],
        successCriteria: {
            primary: 'lcp',
            secondary: [
                'fid',
                'cls'
            ],
            threshold: 2500,
            weight: 0.3
        }
    });
    // Start the test
    performanceABTestingManager.startTest(testId);
    console.log('✅ Performance-based A/B Testing initialized');
}
function trackABTestPerformance(testId, variantId, metrics, userId) {
    performanceABTestingManager.trackPerformance(testId, variantId, metrics, userId);
}
function getABTestVariant(testId, userId) {
    return performanceABTestingManager.getCurrentVariant(testId, userId);
}
}),
"[project]/lib/performance-alerts.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Performance Regression Alerts for PrepFlow
// Implements automated performance monitoring and alerting
// Alert configuration
__turbopack_context__.s({
    "ALERT_CONFIG": ()=>ALERT_CONFIG,
    "PerformanceAlertManager": ()=>PerformanceAlertManager,
    "checkPerformanceAndAlert": ()=>checkPerformanceAndAlert,
    "getPerformanceAlerts": ()=>getPerformanceAlerts,
    "initializePerformanceAlerts": ()=>initializePerformanceAlerts,
    "performanceAlertManager": ()=>performanceAlertManager,
    "resolvePerformanceAlert": ()=>resolvePerformanceAlert
});
const ALERT_CONFIG = {
    // Alert thresholds
    thresholds: {
        lcp: {
            warning: 2000,
            critical: 3000
        },
        fid: {
            warning: 80,
            critical: 120
        },
        cls: {
            warning: 0.08,
            critical: 0.12
        },
        fcp: {
            warning: 1500,
            critical: 2000
        },
        tti: {
            warning: 3000,
            critical: 4000
        },
        si: {
            warning: 2500,
            critical: 3500
        },
        tbt: {
            warning: 200,
            critical: 300
        }
    },
    // Regression detection
    regression: {
        sensitivity: 0.15,
        minSamples: 10,
        timeWindow: 24 * 60 * 60 * 1000
    },
    // Alert channels
    channels: {
        console: true,
        analytics: true,
        webhook: false,
        email: false
    },
    // Webhook configuration
    webhook: {
        url: process.env.PERFORMANCE_WEBHOOK_URL || '',
        timeout: 5000,
        retries: 3
    },
    // Email configuration
    email: {
        to: process.env.ALERT_EMAIL_TO || '',
        from: process.env.ALERT_EMAIL_FROM || 'alerts@prepflow.org',
        subject: 'PrepFlow Performance Alert'
    }
};
class PerformanceAlertManager {
    static instance;
    alerts = new Map();
    alertRules = new Map();
    performanceHistory = new Map();
    cooldowns = new Map();
    static getInstance() {
        if (!PerformanceAlertManager.instance) {
            PerformanceAlertManager.instance = new PerformanceAlertManager();
        }
        return PerformanceAlertManager.instance;
    }
    constructor(){
        this.initializeDefaultRules();
    }
    // Initialize default alert rules
    initializeDefaultRules() {
        const defaultRules = [
            {
                id: 'lcp_critical',
                name: 'LCP Critical Alert',
                metric: 'lcp',
                condition: 'greater_than',
                threshold: ALERT_CONFIG.thresholds.lcp.critical,
                severity: 'critical',
                enabled: true,
                cooldown: 30 * 60 * 1000
            },
            {
                id: 'lcp_warning',
                name: 'LCP Warning Alert',
                metric: 'lcp',
                condition: 'greater_than',
                threshold: ALERT_CONFIG.thresholds.lcp.warning,
                severity: 'warning',
                enabled: true,
                cooldown: 15 * 60 * 1000
            },
            {
                id: 'fid_critical',
                name: 'FID Critical Alert',
                metric: 'fid',
                condition: 'greater_than',
                threshold: ALERT_CONFIG.thresholds.fid.critical,
                severity: 'critical',
                enabled: true,
                cooldown: 30 * 60 * 1000
            },
            {
                id: 'cls_critical',
                name: 'CLS Critical Alert',
                metric: 'cls',
                condition: 'greater_than',
                threshold: ALERT_CONFIG.thresholds.cls.critical,
                severity: 'critical',
                enabled: true,
                cooldown: 30 * 60 * 1000
            }
        ];
        defaultRules.forEach((rule)=>{
            this.alertRules.set(rule.id, rule);
        });
    }
    // Check performance metrics and trigger alerts
    checkPerformance(metrics, page, userId, sessionId) {
        const currentTime = Date.now();
        const actualSessionId = sessionId || this.generateSessionId();
        // Store performance data
        this.storePerformanceData(page, metrics, currentTime);
        // Check alert rules
        this.alertRules.forEach((rule)=>{
            if (!rule.enabled) return;
            const value = metrics[rule.metric];
            if (typeof value !== 'number') return;
            // Check cooldown
            if (this.isInCooldown(rule.id, currentTime)) return;
            // Check condition
            if (this.evaluateCondition(value, rule.condition, rule.threshold)) {
                this.triggerAlert(rule, value, page, userId, actualSessionId, currentTime);
                this.setCooldown(rule.id, currentTime + rule.cooldown);
            }
        });
        // Check for regressions
        this.checkRegressions(page, metrics, currentTime);
    }
    // Check for performance regressions
    checkRegressions(page, metrics, timestamp) {
        const history = this.performanceHistory.get(page) || [];
        const recentHistory = history.filter((data)=>timestamp - data.timestamp < ALERT_CONFIG.regression.timeWindow);
        if (recentHistory.length < ALERT_CONFIG.regression.minSamples) return;
        // Calculate baseline performance
        const baseline = this.calculateBaseline(recentHistory);
        // Check each metric for regression
        Object.keys(metrics).forEach((metric)=>{
            const currentValue = metrics[metric];
            if (typeof currentValue !== 'number') return;
            const baselineValue = baseline[metric];
            if (typeof baselineValue !== 'number') return;
            const changePercent = (currentValue - baselineValue) / baselineValue * 100;
            if (Math.abs(changePercent) >= ALERT_CONFIG.regression.sensitivity * 100) {
                const regression = {
                    metric,
                    currentValue,
                    previousValue: baselineValue,
                    changePercent,
                    severity: this.getRegressionSeverity(changePercent),
                    trend: changePercent > 0 ? 'degrading' : 'improving',
                    confidence: this.calculateRegressionConfidence(recentHistory, metric)
                };
                this.triggerRegressionAlert(regression, page, timestamp);
            }
        });
    }
    // Calculate baseline performance
    calculateBaseline(history) {
        const baseline = {};
        // Group by metric
        const metrics = {};
        history.forEach((data)=>{
            Object.keys(data.metrics).forEach((metric)=>{
                const value = data.metrics[metric];
                if (typeof value === 'number') {
                    if (!metrics[metric]) metrics[metric] = [];
                    metrics[metric].push(value);
                }
            });
        });
        // Calculate median for each metric
        Object.keys(metrics).forEach((metric)=>{
            const values = metrics[metric].sort((a, b)=>a - b);
            const mid = Math.floor(values.length / 2);
            baseline[metric] = values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
        });
        return baseline;
    }
    // Get regression severity
    getRegressionSeverity(changePercent) {
        const absChange = Math.abs(changePercent);
        if (absChange >= 50) return 'critical';
        if (absChange >= 30) return 'high';
        if (absChange >= 15) return 'medium';
        return 'low';
    }
    // Calculate regression confidence
    calculateRegressionConfidence(history, metric) {
        const values = history.map((data)=>data.metrics[metric]).filter((value)=>typeof value === 'number');
        if (values.length < 3) return 0.5;
        // Calculate coefficient of variation
        const mean = values.reduce((sum, val)=>sum + val, 0) / values.length;
        const variance = values.reduce((sum, val)=>sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / mean;
        // Higher confidence for lower variation
        return Math.max(0.5, 1 - cv);
    }
    // Trigger alert
    triggerAlert(rule, value, page, userId, sessionId, timestamp) {
        const alertId = this.generateAlertId();
        const actualTimestamp = timestamp || Date.now();
        const alert = {
            id: alertId,
            type: rule.severity,
            metric: rule.metric,
            currentValue: value,
            threshold: rule.threshold,
            message: `${rule.name}: ${rule.metric} = ${value} (threshold: ${rule.threshold})`,
            timestamp: actualTimestamp,
            page,
            userId,
            sessionId: sessionId || this.generateSessionId(),
            resolved: false
        };
        this.alerts.set(alertId, alert);
        // Send alert
        this.sendAlert(alert);
        console.warn(`🚨 Performance Alert: ${alert.message}`);
    }
    // Trigger regression alert
    triggerRegressionAlert(regression, page, timestamp) {
        const alertId = this.generateAlertId();
        const alert = {
            id: alertId,
            type: 'regression',
            metric: regression.metric,
            currentValue: regression.currentValue,
            threshold: regression.previousValue,
            previousValue: regression.previousValue,
            changePercent: regression.changePercent,
            message: `Performance Regression: ${regression.metric} ${regression.trend} by ${regression.changePercent.toFixed(1)}% (${regression.currentValue} vs ${regression.previousValue})`,
            timestamp,
            page,
            sessionId: this.generateSessionId(),
            resolved: false
        };
        this.alerts.set(alertId, alert);
        // Send alert
        this.sendAlert(alert);
        console.warn(`📉 Performance Regression: ${alert.message}`);
    }
    // Send alert through configured channels
    sendAlert(alert) {
        // Console alert
        if (ALERT_CONFIG.channels.console) {
            this.sendConsoleAlert(alert);
        }
        // Analytics alert
        if (ALERT_CONFIG.channels.analytics) {
            this.sendAnalyticsAlert(alert);
        }
        // Webhook alert
        if (ALERT_CONFIG.channels.webhook && ALERT_CONFIG.webhook.url) {
            this.sendWebhookAlert(alert);
        }
        // Email alert
        if (ALERT_CONFIG.channels.email && ALERT_CONFIG.email.to) {
            this.sendEmailAlert(alert);
        }
    }
    // Send console alert
    sendConsoleAlert(alert) {
        const emoji = alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : '📉';
        console.error(`${emoji} ${alert.message} (${alert.page})`);
    }
    // Send analytics alert
    sendAnalyticsAlert(alert) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Send webhook alert
    sendWebhookAlert(alert) {
        if (!ALERT_CONFIG.webhook.url) return;
        fetch(ALERT_CONFIG.webhook.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(alert)
        }).catch((error)=>{
            console.error('Failed to send webhook alert:', error);
        });
    }
    // Send email alert
    sendEmailAlert(alert) {
        // In a real implementation, you'd use an email service
        console.log(`📧 Email alert would be sent: ${alert.message}`);
    }
    // Evaluate alert condition
    evaluateCondition(value, condition, threshold) {
        switch(condition){
            case 'greater_than':
                return value > threshold;
            case 'less_than':
                return value < threshold;
            case 'equals':
                return value === threshold;
            case 'not_equals':
                return value !== threshold;
            default:
                return false;
        }
    }
    // Check if rule is in cooldown
    isInCooldown(ruleId, currentTime) {
        const cooldownEnd = this.cooldowns.get(ruleId);
        return cooldownEnd ? currentTime < cooldownEnd : false;
    }
    // Set cooldown for rule
    setCooldown(ruleId, cooldownEnd) {
        this.cooldowns.set(ruleId, cooldownEnd);
    }
    // Store performance data
    storePerformanceData(page, metrics, timestamp) {
        const data = {
            metrics,
            timestamp
        };
        const history = this.performanceHistory.get(page) || [];
        history.push(data);
        // Keep only recent data
        const cutoff = timestamp - ALERT_CONFIG.regression.timeWindow;
        const recentHistory = history.filter((d)=>d.timestamp > cutoff);
        this.performanceHistory.set(page, recentHistory);
    }
    // Generate alert ID
    generateAlertId() {
        return 'alert_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    // Generate session ID
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }
    // Get all alerts
    getAlerts() {
        return Array.from(this.alerts.values());
    }
    // Get active alerts
    getActiveAlerts() {
        return Array.from(this.alerts.values()).filter((alert)=>!alert.resolved);
    }
    // Resolve alert
    resolveAlert(alertId) {
        const alert = this.alerts.get(alertId);
        if (!alert) return false;
        alert.resolved = true;
        alert.resolvedAt = Date.now();
        console.log(`✅ Alert resolved: ${alert.message}`);
        return true;
    }
    // Add custom alert rule
    addAlertRule(rule) {
        this.alertRules.set(rule.id, rule);
    }
    // Remove alert rule
    removeAlertRule(ruleId) {
        return this.alertRules.delete(ruleId);
    }
    // Get alert rules
    getAlertRules() {
        return Array.from(this.alertRules.values());
    }
    // Get performance history
    getPerformanceHistory(page) {
        return this.performanceHistory.get(page) || [];
    }
    // Clear old alerts
    clearOldAlerts(maxAge = 7 * 24 * 60 * 60 * 1000) {
        const cutoff = Date.now() - maxAge;
        for (const [id, alert] of this.alerts){
            if (alert.timestamp < cutoff) {
                this.alerts.delete(id);
            }
        }
    }
}
const performanceAlertManager = PerformanceAlertManager.getInstance();
function initializePerformanceAlerts() {
    console.log('🚨 Initializing Performance Alerts...');
    // Clear old alerts on startup
    performanceAlertManager.clearOldAlerts();
    console.log('✅ Performance Alerts initialized');
}
function checkPerformanceAndAlert(metrics, page, userId, sessionId) {
    performanceAlertManager.checkPerformance(metrics, page, userId, sessionId);
}
function getPerformanceAlerts() {
    return performanceAlertManager.getAlerts();
}
function resolvePerformanceAlert(alertId) {
    return performanceAlertManager.resolveAlert(alertId);
}
}),
"[project]/components/AdvancedPerformanceTracker.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>AdvancedPerformanceTracker
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$budgets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/performance-budgets.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$advanced$2d$rum$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/advanced-rum.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$ab$2d$testing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/performance-ab-testing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/performance-alerts.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function AdvancedPerformanceTracker({ onMetrics, enabled = true, sampleRate = 0.1 // Default to 10% sampling
 }) {
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const hasTrackedInitial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasTrackedLCP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasTrackedFID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasTrackedCLS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const resourceObserver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lcpObserver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fidObserver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clsObserver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        // Initialize performance tracking
        const initializeTracking = undefined;
    }, [
        enabled,
        sampleRate
    ]);
    // Track initial page load performance
    const trackInitialPerformance = async ()=>{
        if (hasTrackedInitial.current) return;
        hasTrackedInitial.current = true;
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        if (navigation) {
            const navigationMetrics = {
                dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcp: navigation.connectEnd - navigation.connectStart,
                request: navigation.responseStart - navigation.requestStart,
                response: navigation.responseEnd - navigation.responseStart,
                dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                load: navigation.loadEventEnd - navigation.loadEventStart,
                total: navigation.loadEventEnd - navigation.fetchStart
            };
            const paintMetrics = {
                fcp: paint.find((p)=>p.name === 'first-contentful-paint')?.startTime || null,
                lcp: null
            };
            // Update metrics
            setMetrics((prev)=>({
                    ...prev,
                    navigation: navigationMetrics,
                    paint: paintMetrics,
                    lcp: null,
                    fid: null,
                    cls: null,
                    resources: {
                        slowResources: [],
                        totalResources: 0,
                        averageLoadTime: 0
                    },
                    ux: {
                        timeToInteractive: null,
                        firstInputDelay: null,
                        cumulativeLayoutShift: null
                    },
                    network: {
                        effectiveType: null,
                        downlink: null,
                        rtt: null
                    },
                    memory: {
                        usedJSHeapSize: null,
                        totalJSHeapSize: null,
                        jsHeapSizeLimit: null
                    }
                }));
            // Track performance metrics
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackPerformance"])({
                pageLoadTime: navigationMetrics.total,
                firstContentfulPaint: paintMetrics.fcp || 0,
                largestContentfulPaint: 0,
                firstInputDelay: 0,
                cumulativeLayoutShift: 0,
                timestamp: Date.now(),
                page: window.location.pathname,
                sessionId: 'session_' + Math.random().toString(36).substr(2, 9)
            });
            // Send to Google Analytics
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (onMetrics) {
                onMetrics(metrics);
            }
        }
    };
    // Track Core Web Vitals
    const trackCoreWebVitals = ()=>{
        // LCP Observer
        if ('PerformanceObserver' in window && !hasTrackedLCP.current) {
            lcpObserver.current = new PerformanceObserver((list)=>{
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry && !hasTrackedLCP.current) {
                    hasTrackedLCP.current = true;
                    const lcp = lastEntry.startTime;
                    setMetrics((prev)=>({
                            ...prev,
                            lcp,
                            paint: {
                                ...prev?.paint,
                                lcp
                            }
                        }));
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('lcp', 'performance', 'largest_contentful_paint', Math.round(lcp));
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    // Check performance budget and trigger alerts
                    const currentMetrics = {
                        lcp: Math.round(lcp),
                        fid: null,
                        cls: null,
                        fcp: null,
                        tti: null
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$budgets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackPerformanceBudget"])(currentMetrics, 'landing');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkPerformanceAndAlert"])(currentMetrics, window.location.pathname, undefined, `session_${Date.now()}`);
                }
            });
            lcpObserver.current.observe({
                entryTypes: [
                    'largest-contentful-paint'
                ]
            });
        }
        // FID Observer
        if ('PerformanceObserver' in window && !hasTrackedFID.current) {
            fidObserver.current = new PerformanceObserver((list)=>{
                const entries = list.getEntries();
                entries.forEach((entry)=>{
                    if (!hasTrackedFID.current) {
                        hasTrackedFID.current = true;
                        const fid = entry.processingStart - entry.startTime;
                        setMetrics((prev)=>({
                                ...prev,
                                fid,
                                ux: {
                                    ...prev?.ux,
                                    firstInputDelay: fid
                                }
                            }));
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('fid', 'performance', 'first_input_delay', Math.round(fid));
                        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                        ;
                    }
                });
            });
            fidObserver.current.observe({
                entryTypes: [
                    'first-input'
                ]
            });
        }
        // CLS Observer
        if ('PerformanceObserver' in window && !hasTrackedCLS.current) {
            let clsValue = 0;
            clsObserver.current = new PerformanceObserver((list)=>{
                const entries = list.getEntries();
                entries.forEach((entry)=>{
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
            });
            clsObserver.current.observe({
                entryTypes: [
                    'layout-shift'
                ]
            });
            // Track CLS after a delay
            setTimeout(()=>{
                if (!hasTrackedCLS.current && clsValue > 0) {
                    hasTrackedCLS.current = true;
                    setMetrics((prev)=>({
                            ...prev,
                            cls: clsValue,
                            ux: {
                                ...prev?.ux,
                                cumulativeLayoutShift: clsValue
                            }
                        }));
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('cls', 'performance', 'cumulative_layout_shift', Math.round(clsValue * 1000));
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                }
            }, 5000);
        }
    };
    // Track resource performance
    const trackResourcePerformance = ()=>{
        if ('PerformanceObserver' in window) {
            const slowResources = [];
            let totalResources = 0;
            let totalLoadTime = 0;
            resourceObserver.current = new PerformanceObserver((list)=>{
                list.getEntries().forEach((entry)=>{
                    if (entry.entryType === 'resource') {
                        totalResources++;
                        totalLoadTime += entry.duration;
                        if (entry.duration > 1000) {
                            slowResources.push({
                                name: entry.name,
                                duration: Math.round(entry.duration),
                                size: entry.transferSize || 0,
                                type: entry.initiatorType
                            });
                        }
                    }
                });
                const averageLoadTime = totalResources > 0 ? totalLoadTime / totalResources : 0;
                setMetrics((prev)=>({
                        ...prev,
                        resources: {
                            slowResources,
                            totalResources,
                            averageLoadTime: Math.round(averageLoadTime)
                        }
                    }));
                // Track slow resources
                if (slowResources.length > 0) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('slow_resources', 'performance', 'slow_loading', slowResources.length);
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                }
            });
            resourceObserver.current.observe({
                entryTypes: [
                    'resource'
                ]
            });
        }
    };
    // Track user experience metrics
    const trackUserExperience = ()=>{
        // Time to Interactive (TTI) - simplified version
        const tti = performance.now();
        setMetrics((prev)=>({
                ...prev,
                ux: {
                    ...prev?.ux,
                    timeToInteractive: tti
                }
            }));
        // Track user interactions
        const trackInteraction = ()=>{
            const interactionTime = performance.now();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('user_interaction', 'performance', 'interaction_timing', Math.round(interactionTime));
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        };
        // Track first interaction
        document.addEventListener('click', trackInteraction, {
            once: true
        });
        document.addEventListener('scroll', trackInteraction, {
            once: true
        });
    };
    // Track network information
    const trackNetworkInfo = ()=>{
        if ('connection' in navigator) {
            const connection = navigator.connection;
            setMetrics((prev)=>({
                    ...prev,
                    network: {
                        effectiveType: connection.effectiveType || null,
                        downlink: connection.downlink || null,
                        rtt: connection.rtt || null
                    }
                }));
            // Track network quality
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('network_quality', 'performance', connection.effectiveType || 'unknown', 0);
        }
    };
    // Track memory usage
    const trackMemoryUsage = ()=>{
        if ('memory' in performance) {
            const memory = performance.memory;
            setMetrics((prev)=>({
                    ...prev,
                    memory: {
                        usedJSHeapSize: memory.usedJSHeapSize || null,
                        totalJSHeapSize: memory.totalJSHeapSize || null,
                        jsHeapSizeLimit: memory.jsHeapSizeLimit || null
                    }
                }));
            // Track memory usage
            const memoryUsagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('memory_usage', 'performance', 'memory_usage', Math.round(memoryUsagePercent));
        }
    };
    // This component doesn't render anything visible
    return null;
}
}),
"[project]/components/ClientPerformanceTracker.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ClientPerformanceTracker
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AdvancedPerformanceTracker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AdvancedPerformanceTracker.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function ClientPerformanceTracker() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AdvancedPerformanceTracker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/components/ClientPerformanceTracker.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__ec97cb39._.js.map