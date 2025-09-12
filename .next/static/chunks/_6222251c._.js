(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/GoogleAnalytics.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GoogleAnalytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// Default export with your correct measurement ID
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function GoogleAnalyticsInner(param) {
    let { measurementId } = param;
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const hasInitialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Initialize gtag function
    const initializeGtag = ()=>{
        if ("object" !== 'undefined' && !window.gtag) {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() {
                window.dataLayer.push(arguments);
            };
            // Initialize with current date
            window.gtag('js', new Date());
            // Configure with measurement ID
            window.gtag('config', measurementId, {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: false
            });
            hasInitialized.current = true;
            console.log('✅ Google Analytics initialized with ID:', measurementId);
        }
    };
    // Track page views
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GoogleAnalyticsInner.useEffect": ()=>{
            if (pathname && window.gtag && hasInitialized.current) {
                // Track page view
                window.gtag('event', 'page_view', {
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: pathname + (searchParams.toString() ? "?".concat(searchParams.toString()) : '')
                });
                console.log('📊 GA4 Page View tracked:', pathname);
            }
        }
    }["GoogleAnalyticsInner.useEffect"], [
        pathname,
        searchParams
    ]);
    // Initialize when component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GoogleAnalyticsInner.useEffect": ()=>{
            // Wait for scripts to load
            const checkGtag = {
                "GoogleAnalyticsInner.useEffect.checkGtag": ()=>{
                    if ("object" !== 'undefined' && typeof window.gtag === 'function') {
                        initializeGtag();
                    } else {
                        // Retry after a short delay
                        setTimeout(checkGtag, 100);
                    }
                }
            }["GoogleAnalyticsInner.useEffect.checkGtag"];
            checkGtag();
        }
    }["GoogleAnalyticsInner.useEffect"], [
        measurementId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                strategy: "afterInteractive",
                src: "https://www.googletagmanager.com/gtag/js?id=".concat(measurementId),
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "google-analytics-init",
                strategy: "afterInteractive",
                dangerouslySetInnerHTML: {
                    __html: "\n            window.dataLayer = window.dataLayer || [];\n            function gtag(){dataLayer.push(arguments);}\n            gtag('js', new Date());\n            gtag('config', '".concat(measurementId, "', {\n              page_title: document.title,\n              page_location: window.location.href,\n              send_page_view: false,\n            });\n            console.log('🔧 Google Analytics gtag function initialized');\n          ")
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
_s(GoogleAnalyticsInner, "8QhwqBAexA3F5L1MIRZLTdF6hcE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = GoogleAnalyticsInner;
function GoogleAnalytics(param) {
    let { measurementId } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GoogleAnalyticsInner, {
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
_c1 = GoogleAnalytics;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "GoogleAnalyticsInner");
__turbopack_context__.k.register(_c1, "GoogleAnalytics");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/GoogleAnalytics.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GoogleAnalyticsDefault",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"],
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GoogleAnalytics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/GoogleAnalytics.tsx [app-client] (ecmascript) <locals>");
}),
"[project]/components/GoogleTagManager.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GoogleTagManager,
    "pushToDataLayer",
    ()=>pushToDataLayer,
    "trackGTMConversion",
    ()=>trackGTMConversion,
    "trackGTMEngagement",
    ()=>trackGTMEngagement,
    "trackGTMEvent",
    ()=>trackGTMEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function GoogleTagManagerInner(param) {
    let { gtmId, ga4MeasurementId } = param;
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const hasInitialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Initialize data layer
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GoogleTagManagerInner.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                window.dataLayer = window.dataLayer || [];
                // Initialize data layer with page info
                if (!hasInitialized.current) {
                    window.dataLayer.push({
                        'gtm.start': new Date().getTime(),
                        event: 'gtm.js',
                        page_title: document.title,
                        page_location: window.location.href,
                        page_path: pathname
                    });
                    hasInitialized.current = true;
                    console.log('✅ GTM Data Layer initialized');
                }
            }
        }
    }["GoogleTagManagerInner.useEffect"], []);
    // Track page views
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GoogleTagManagerInner.useEffect": ()=>{
            if ("object" !== 'undefined' && window.dataLayer && hasInitialized.current) {
                // Push page view to data layer
                window.dataLayer.push({
                    event: 'page_view',
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: pathname + (searchParams.toString() ? "?".concat(searchParams.toString()) : ''),
                    page_referrer: document.referrer,
                    timestamp: Date.now()
                });
                console.log('📊 GTM Page View tracked:', pathname);
            }
        }
    }["GoogleTagManagerInner.useEffect"], [
        pathname,
        searchParams
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("noscript", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                    src: "https://www.googletagmanager.com/ns.html?id=".concat(gtmId),
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "gtm-script",
                strategy: "afterInteractive",
                dangerouslySetInnerHTML: {
                    __html: "\n            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n            })(window,document,'script','dataLayer','".concat(gtmId, "');\n          ")
                },
                onLoad: ()=>{
                    console.log('📥 Google Tag Manager loaded');
                    // Initialize gtag function for backward compatibility
                    if ("object" !== 'undefined' && !window.gtag) {
                        window.gtag = function() {
                            window.dataLayer.push(arguments);
                        };
                        console.log('🔧 gtag function initialized for GTM compatibility');
                    }
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
_s(GoogleTagManagerInner, "8QhwqBAexA3F5L1MIRZLTdF6hcE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = GoogleTagManagerInner;
function GoogleTagManager(param) {
    let { gtmId, ga4MeasurementId } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GoogleTagManagerInner, {
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
_c1 = GoogleTagManager;
function pushToDataLayer(data) {
    if ("object" !== 'undefined' && window.dataLayer) {
        window.dataLayer.push(data);
        console.log('📤 Data pushed to GTM:', data);
    }
}
function trackGTMEvent(eventName) {
    let parameters = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    pushToDataLayer({
        event: eventName,
        ...parameters,
        timestamp: Date.now()
    });
}
function trackGTMConversion(conversionType, value) {
    let parameters = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    pushToDataLayer({
        event: 'conversion',
        conversion_type: conversionType,
        value: value,
        ...parameters,
        timestamp: Date.now()
    });
}
function trackGTMEngagement(engagementType) {
    let parameters = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    pushToDataLayer({
        event: 'engagement',
        engagement_type: engagementType,
        ...parameters,
        timestamp: Date.now()
    });
}
var _c, _c1;
__turbopack_context__.k.register(_c, "GoogleTagManagerInner");
__turbopack_context__.k.register(_c1, "GoogleTagManager");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/ab-testing-analytics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// PrepFlow A/B Testing Analytics
// Tracks variant performance, user behavior, and statistical significance
__turbopack_context__.s([
    "abTestingAnalytics",
    ()=>abTestingAnalytics,
    "assignVariant",
    ()=>assignVariant,
    "getActiveTests",
    ()=>getActiveTests,
    "getCurrentVariant",
    ()=>getCurrentVariant,
    "getTestResults",
    ()=>getTestResults,
    "getVariantAssignmentInfo",
    ()=>getVariantAssignmentInfo,
    "getVariantInfo",
    ()=>getVariantInfo,
    "trackConversion",
    ()=>trackConversion,
    "trackEngagement",
    ()=>trackEngagement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
class ABTestingAnalytics {
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
        var _variants_find;
        console.log('🎯 Assigning variant for:', {
            testId,
            userId
        });
        const variants = this.tests.get(testId);
        if (!variants) {
            console.warn("AB test ".concat(testId, " not found"));
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
                variant_name: ((_variants_find = variants.find((v)=>v.id === assignedVariant)) === null || _variants_find === void 0 ? void 0 : _variants_find.name) || assignedVariant,
                is_control: assignedVariant === 'control',
                assignment_type: 'persistent',
                rotation_period: '1_month'
            }
        });
        return assignedVariant;
    }
    getPersistentVariant(userId) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const stored = localStorage.getItem("prepflow_variant_".concat(userId));
            if (!stored) {
                console.log('🔍 No persistent variant found for user:', userId);
                return null;
            }
            const variantData = JSON.parse(stored);
            const assignmentDate = new Date(variantData.assignedAt);
            const currentDate = new Date();
            const daysSinceAssignment = (currentDate.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24);
            console.log('🔍 Persistent variant check:', {
                userId,
                variantId: variantData.variantId,
                assignedAt: variantData.assignedAt,
                daysSinceAssignment: Math.round(daysSinceAssignment),
                isExpired: daysSinceAssignment >= 30
            });
            // If less than 30 days, return the assigned variant
            if (daysSinceAssignment < 30) {
                console.log('✅ Returning persistent variant:', variantData.variantId);
                return variantData.variantId;
            }
            // If more than 30 days, clear the assignment for rotation
            console.log('🔄 Variant expired, clearing for rotation');
            localStorage.removeItem("prepflow_variant_".concat(userId));
            return null;
        } catch (error) {
            console.warn('Error reading persistent variant:', error);
            return null;
        }
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const variantData = {
                variantId,
                assignedAt: new Date().toISOString(),
                testId: 'landing_page_variants'
            };
            localStorage.setItem("prepflow_variant_".concat(userId), JSON.stringify(variantData));
            console.log('💾 Stored persistent variant:', {
                userId,
                variantId,
                assignedAt: variantData.assignedAt,
                storageKey: "prepflow_variant_".concat(userId)
            });
        } catch (error) {
            console.warn('Error storing persistent variant:', error);
        }
    }
    getCurrentVariant(testId, userId) {
        return this.assignVariant(testId, userId);
    }
    trackEvent(event) {
        this.events.push(event);
        // Send to Google Analytics with variant context
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', event.eventType, {
                event_category: 'ab_testing',
                event_label: "".concat(event.testId, "_").concat(event.variantId),
                value: event.eventValue,
                custom_parameter_test_id: event.testId,
                custom_parameter_variant_id: event.variantId,
                custom_parameter_user_id: event.userId,
                custom_parameter_session_id: event.sessionId,
                custom_parameter_metadata: JSON.stringify(event.metadata)
            });
        }
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
        if ("TURBOPACK compile-time truthy", 1) {
            return sessionStorage.getItem('prepflow_session_id') || 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        //TURBOPACK unreachable
        ;
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
        return variants === null || variants === void 0 ? void 0 : variants.find((v)=>v.id === variantId);
    }
    getVariantAssignmentInfo(userId) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const stored = localStorage.getItem("prepflow_variant_".concat(userId));
            if (!stored) return null;
            const variantData = JSON.parse(stored);
            const assignmentDate = new Date(variantData.assignedAt);
            const currentDate = new Date();
            const daysSinceAssignment = (currentDate.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24);
            const daysRemaining = Math.max(0, 30 - daysSinceAssignment);
            return {
                variantId: variantData.variantId,
                assignedAt: variantData.assignedAt,
                daysRemaining: Math.round(daysRemaining),
                isPersistent: daysRemaining > 0
            };
        } catch (error) {
            console.warn('Error reading variant assignment info:', error);
            return null;
        }
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "tests", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "events", []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "userVariants", new Map()); // userId -> variantId
        this.initializeDefaultTests();
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/analytics.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// PrepFlow Analytics Service
// Tracks conversions, user behavior, and performance metrics
__turbopack_context__.s([
    "analytics",
    ()=>analytics,
    "getSessionId",
    ()=>getSessionId,
    "setUserId",
    ()=>setUserId,
    "trackConversion",
    ()=>trackConversion,
    "trackEvent",
    ()=>trackEvent,
    "trackPerformance",
    ()=>trackPerformance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
// Export A/B testing functions
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ab$2d$testing$2d$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ab-testing-analytics.ts [app-client] (ecmascript)");
;
class PrepFlowAnalytics {
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    loadUserId() {
        if ("TURBOPACK compile-time truthy", 1) {
            const storedUserId = localStorage.getItem('prepflow_user_id');
            this.userId = storedUserId || undefined;
            // Generate and store a stable user ID if none exists
            if (!this.userId) {
                this.userId = this.generateStableUserId();
                localStorage.setItem('prepflow_user_id', this.userId);
            }
        }
    }
    generateStableUserId() {
        // Generate a stable user ID that persists across sessions
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }
    initializeAnalytics() {
        if ("TURBOPACK compile-time truthy", 1) {
            // Track page views
            this.trackPageView();
            // Track performance metrics
            this.trackPerformance();
            // Track user interactions
            this.trackUserInteractions();
            // Track conversions
            this.trackConversions();
        }
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
                var _cta_textContent;
                const text = ((_cta_textContent = cta.textContent) === null || _cta_textContent === void 0 ? void 0 : _cta_textContent.trim()) || '';
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
                    if ("object" !== 'undefined' && window.gtag) {
                        window.gtag('event', 'begin_checkout', {
                            currency: 'AUD',
                            value: 29.00,
                            items: [
                                {
                                    item_id: 'prepflow_app',
                                    item_name: 'PrepFlow App',
                                    price: 29.00,
                                    quantity: 1
                                }
                            ]
                        });
                    }
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
                    this.trackEvent('scroll_depth', 'engagement', "".concat(maxScrollDepth, "%"));
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
                        if ("object" !== 'undefined' && window.gtag) {
                            if (sectionName === 'pricing') {
                                window.gtag('event', 'view_item_list', {
                                    item_list_id: 'pricing_section',
                                    item_list_name: 'Pricing Options'
                                });
                            } else if (sectionName === 'demo') {
                                window.gtag('event', 'view_item', {
                                    item_id: 'demo_video',
                                    item_name: 'PrepFlow Demo Video'
                                });
                            }
                        }
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
            page: ("TURBOPACK compile-time truthy", 1) ? window.location.pathname : "TURBOPACK unreachable",
            referrer: ("TURBOPACK compile-time truthy", 1) ? document.referrer : "TURBOPACK unreachable",
            userAgent: ("TURBOPACK compile-time truthy", 1) ? navigator.userAgent : "TURBOPACK unreachable"
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
            page: ("TURBOPACK compile-time truthy", 1) ? window.location.pathname : "TURBOPACK unreachable",
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
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', event.action, {
                event_category: event.category,
                event_label: event.label,
                value: event.value,
                custom_parameter_session_id: event.sessionId,
                custom_parameter_user_id: event.userId,
                custom_parameter_page: event.page,
                custom_parameter_referrer: event.referrer
            });
        }
    }
    sendConversionData(conversion) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('🎯 Conversion Event:', conversion);
        }
        // Send to Google Analytics 4
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'conversion', {
                event_category: 'conversion',
                event_label: conversion.type,
                value: 1,
                custom_parameter_element: conversion.element,
                custom_parameter_page: conversion.page,
                custom_parameter_session_id: conversion.sessionId,
                custom_parameter_user_id: conversion.userId,
                custom_parameter_metadata: JSON.stringify(conversion.metadata)
            });
        }
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
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('prepflow_user_id', userId);
        }
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "sessionId", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "userId", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "events", []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "conversions", []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "performance", []);
        this.sessionId = this.generateSessionId();
        this.loadUserId();
        this.initializeAnalytics();
    }
}
const analytics = new PrepFlowAnalytics();
const trackEvent = analytics.trackEvent.bind(analytics);
const trackConversion = analytics.trackConversion.bind(analytics);
const trackPerformance = analytics.trackPerformanceMetrics.bind(analytics);
const getSessionId = analytics.getSessionId.bind(analytics);
const setUserId = analytics.setUserId.bind(analytics);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/performance-budgets.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Performance Budgets Implementation for PrepFlow
// Automated performance budget enforcement with Lighthouse CI
// Performance budget configuration
__turbopack_context__.s([
    "PERFORMANCE_BUDGETS",
    ()=>PERFORMANCE_BUDGETS,
    "PerformanceBudgetManager",
    ()=>PerformanceBudgetManager,
    "alertPerformanceBudgetViolations",
    ()=>alertPerformanceBudgetViolations,
    "performanceBudgetManager",
    ()=>performanceBudgetManager,
    "trackPerformanceBudget",
    ()=>trackPerformanceBudget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
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
    static getInstance() {
        if (!PerformanceBudgetManager.instance) {
            PerformanceBudgetManager.instance = new PerformanceBudgetManager();
        }
        return PerformanceBudgetManager.instance;
    }
    // Check performance budget against metrics
    checkBudget(metrics) {
        let pageType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'landing';
        const violations = [];
        const pageBudgets = this.budgets.pages[pageType] || this.budgets.pages.landing;
        // Check Core Web Vitals
        if (metrics.lcp && metrics.lcp > pageBudgets.lcp) {
            violations.push({
                metric: 'lcp',
                actual: metrics.lcp,
                budget: pageBudgets.lcp,
                severity: this.getSeverity(metrics.lcp, pageBudgets.lcp),
                message: "LCP ".concat(metrics.lcp, "ms exceeds budget of ").concat(pageBudgets.lcp, "ms")
            });
        }
        if (metrics.fid && metrics.fid > pageBudgets.fid) {
            violations.push({
                metric: 'fid',
                actual: metrics.fid,
                budget: pageBudgets.fid,
                severity: this.getSeverity(metrics.fid, pageBudgets.fid),
                message: "FID ".concat(metrics.fid, "ms exceeds budget of ").concat(pageBudgets.fid, "ms")
            });
        }
        if (metrics.cls && metrics.cls > pageBudgets.cls) {
            violations.push({
                metric: 'cls',
                actual: metrics.cls,
                budget: pageBudgets.cls,
                severity: this.getSeverity(metrics.cls, pageBudgets.cls),
                message: "CLS ".concat(metrics.cls, " exceeds budget of ").concat(pageBudgets.cls)
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
                    message: "Total size ".concat(metrics.resources.totalSize, " bytes exceeds budget of ").concat(pageBudgets.totalSize, " bytes")
                });
            }
            if (metrics.resources.jsSize > pageBudgets.jsSize) {
                violations.push({
                    metric: 'jsSize',
                    actual: metrics.resources.jsSize,
                    budget: pageBudgets.jsSize,
                    severity: this.getSeverity(metrics.resources.jsSize, pageBudgets.jsSize),
                    message: "JavaScript size ".concat(metrics.resources.jsSize, " bytes exceeds budget of ").concat(pageBudgets.jsSize, " bytes")
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
    isWithinBudget(metrics) {
        let pageType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'landing';
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "violations", []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "budgets", PERFORMANCE_BUDGETS);
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(PerformanceBudgetManager, "instance", void 0);
const performanceBudgetManager = PerformanceBudgetManager.getInstance();
function trackPerformanceBudget(metrics) {
    let pageType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'landing';
    const result = performanceBudgetManager.checkBudget(metrics, pageType);
    if (!result.passed) {
        console.warn('🚨 Performance budget violations detected:', result.violations);
        // Send to analytics
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'performance_budget_violation', {
                event_category: 'performance',
                event_label: 'budget_violation',
                value: result.score,
                custom_parameter_violations: result.violations.length,
                custom_parameter_page_type: pageType,
                custom_parameter_score: result.score
            });
        }
    }
}
function alertPerformanceBudgetViolations(violations) {
    const criticalViolations = violations.filter((v)=>v.severity === 'critical');
    const highViolations = violations.filter((v)=>v.severity === 'high');
    if (criticalViolations.length > 0) {
        console.error('🚨 CRITICAL performance budget violations:', criticalViolations);
        // Send critical alert
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'critical_performance_violation', {
                event_category: 'performance',
                event_label: 'critical_violation',
                value: criticalViolations.length,
                custom_parameter_violations: criticalViolations.map((v)=>v.metric)
            });
        }
    }
    if (highViolations.length > 0) {
        console.warn('⚠️ HIGH performance budget violations:', highViolations);
        // Send high priority alert
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'high_performance_violation', {
                event_category: 'performance',
                event_label: 'high_violation',
                value: highViolations.length,
                custom_parameter_violations: highViolations.map((v)=>v.metric)
            });
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/advanced-rum.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Advanced Real User Monitoring (RUM) for PrepFlow
// Implements comprehensive performance monitoring with error tracking
// RUM configuration
__turbopack_context__.s([
    "AdvancedRUMManager",
    ()=>AdvancedRUMManager,
    "RUM_CONFIG",
    ()=>RUM_CONFIG,
    "advancedRUMManager",
    ()=>advancedRUMManager,
    "initializeRUM",
    ()=>initializeRUM,
    "trackCustomError",
    ()=>trackCustomError,
    "trackCustomInteraction",
    ()=>trackCustomInteraction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
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
    static getInstance() {
        if (!AdvancedRUMManager.instance) {
            AdvancedRUMManager.instance = new AdvancedRUMManager();
        }
        return AdvancedRUMManager.instance;
    }
    // Initialize RUM monitoring
    initialize() {
        if (this.isInitialized || "object" === 'undefined') return;
        console.log('🔍 Initializing Advanced RUM monitoring...');
        // Initialize performance monitoring
        this.initializePerformanceMonitoring();
        // Initialize error tracking
        this.initializeErrorTracking();
        // Initialize interaction tracking
        this.initializeInteractionTracking();
        // Initialize resource monitoring
        this.initializeResourceMonitoring();
        // Initialize navigation monitoring
        this.initializeNavigationMonitoring();
        // Initialize session management
        this.initializeSessionManagement();
        this.isInitialized = true;
        console.log('✅ Advanced RUM monitoring initialized');
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
            var _event_error;
            this.trackError({
                message: event.message,
                stack: (_event_error = event.error) === null || _event_error === void 0 ? void 0 : _event_error.stack,
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
            var _event_reason;
            this.trackError({
                message: "Unhandled Promise Rejection: ".concat(event.reason),
                stack: (_event_reason = event.reason) === null || _event_reason === void 0 ? void 0 : _event_reason.stack,
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
            console.warn("⚠️ Performance threshold exceeded: ".concat(metric, " = ").concat(value, "ms (threshold: ").concat(threshold, "ms)"));
        }
        // Send to analytics
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'performance_metric', {
                event_category: 'performance',
                event_label: metric,
                value: Math.round(value),
                custom_parameter_metric: metric,
                custom_parameter_value: Math.round(value),
                custom_parameter_threshold: threshold,
                custom_parameter_violation: isViolation
            });
        }
    }
    // Track error
    trackError(error) {
        if (this.errorCount >= RUM_CONFIG.errorTracking.maxErrors) return;
        this.data.errors.push(error);
        this.errorCount++;
        console.error('🚨 RUM Error tracked:', error);
        // Send to analytics
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'rum_error', {
                event_category: 'error',
                event_label: error.severity,
                value: 1,
                custom_parameter_error_message: error.message,
                custom_parameter_error_severity: error.severity,
                custom_parameter_error_filename: error.filename,
                custom_parameter_error_line: error.lineno
            });
        }
    }
    // Track interaction
    trackInteraction(interaction) {
        this.data.interactions.push(interaction);
        // Send to analytics
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'user_interaction', {
                event_category: 'interaction',
                event_label: interaction.type,
                value: 1,
                custom_parameter_interaction_type: interaction.type,
                custom_parameter_interaction_target: interaction.target
            });
        }
    }
    // Track resource
    trackResource(resource) {
        this.data.resources.push(resource);
        // Send to analytics
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'resource_load', {
                event_category: 'performance',
                event_label: resource.type,
                value: Math.round(resource.duration),
                custom_parameter_resource_name: resource.name,
                custom_parameter_resource_type: resource.type,
                custom_parameter_resource_duration: Math.round(resource.duration),
                custom_parameter_resource_size: resource.size,
                custom_parameter_resource_success: resource.success
            });
        }
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
        if (element.id) return "#".concat(element.id);
        if (element.className) return ".".concat(element.className.split(' ')[0]);
        return element.tagName.toLowerCase();
    }
    // Generate session ID
    generateSessionId() {
        return 'rum_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    // Initialize RUM data
    initializeRUMData() {
        var _connection, _connection1, _connection2;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            page: window.location.pathname,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: {
                effectiveType: ((_connection = navigator.connection) === null || _connection === void 0 ? void 0 : _connection.effectiveType) || 'unknown',
                downlink: ((_connection1 = navigator.connection) === null || _connection1 === void 0 ? void 0 : _connection1.downlink) || 0,
                rtt: ((_connection2 = navigator.connection) === null || _connection2 === void 0 ? void 0 : _connection2.rtt) || 0
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
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'rum_session_end', {
                event_category: 'performance',
                event_label: 'session_end',
                value: this.data.performance.lcp || 0,
                custom_parameter_session_id: this.data.sessionId,
                custom_parameter_page: this.data.page,
                custom_parameter_errors: this.data.errors.length,
                custom_parameter_interactions: this.data.interactions.length,
                custom_parameter_resources: this.data.resources.length,
                custom_parameter_lcp: this.data.performance.lcp,
                custom_parameter_fid: this.data.performance.fid,
                custom_parameter_cls: this.data.performance.cls
            });
        }
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "sessionId", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "userId", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "startTime", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "data", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "observers", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "errorCount", 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isInitialized", false);
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.data = this.initializeRUMData();
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(AdvancedRUMManager, "instance", void 0);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/performance-ab-testing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Performance-Based A/B Testing for PrepFlow
// Implements A/B testing with performance metrics as success criteria
// A/B testing configuration
__turbopack_context__.s([
    "AB_TEST_CONFIG",
    ()=>AB_TEST_CONFIG,
    "PerformanceABTestingManager",
    ()=>PerformanceABTestingManager,
    "getABTestVariant",
    ()=>getABTestVariant,
    "initializePerformanceABTesting",
    ()=>initializePerformanceABTesting,
    "performanceABTestingManager",
    ()=>performanceABTestingManager,
    "trackABTestPerformance",
    ()=>trackABTestPerformance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
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
        console.log("🧪 A/B test created: ".concat(test.name, " (").concat(id, ")"));
        return id;
    }
    // Start A/B test
    startTest(testId) {
        const test = this.activeTests.get(testId);
        if (!test) return false;
        test.status = 'running';
        test.startDate = Date.now();
        test.endDate = test.startDate + AB_TEST_CONFIG.testDuration;
        console.log("🚀 A/B test started: ".concat(test.name));
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
        var _this_testData_get;
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
        (_this_testData_get = this.testData.get(testId)) === null || _this_testData_get === void 0 ? void 0 : _this_testData_get.push(data);
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
        var _test_results, _test_results1;
        const test = this.activeTests.get(testId);
        if (!test) return;
        test.status = 'completed';
        test.results = this.calculateTestResults(testId);
        console.log("🏁 A/B test completed: ".concat(test.name));
        console.log("🏆 Winner: ".concat((_test_results = test.results) === null || _test_results === void 0 ? void 0 : _test_results.winner));
        console.log("📊 Confidence: ".concat((_test_results1 = test.results) === null || _test_results1 === void 0 ? void 0 : _test_results1.confidence, "%"));
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
        recommendations.push("Winner: ".concat(winner.variantId, " with score ").concat(winner.score.toFixed(2)));
        if (winner.score > 80) {
            recommendations.push('Consider implementing the winning variant as the default');
        } else if (winner.score < 60) {
            recommendations.push('Consider running additional tests or refining the variants');
        }
        const lowPerformingVariants = variantScores.filter((v)=>v.score < 50);
        if (lowPerformingVariants.length > 0) {
            recommendations.push("Consider removing low-performing variants: ".concat(lowPerformingVariants.map((v)=>v.variantId).join(', ')));
        }
        return recommendations;
    }
    // Track variant assignment
    trackVariantAssignment(testId, variantId, userId) {
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'ab_test_assignment', {
                event_category: 'ab_testing',
                event_label: testId,
                value: 1,
                custom_parameter_test_id: testId,
                custom_parameter_variant_id: variantId,
                custom_parameter_user_id: userId
            });
        }
    }
    // Track performance metric
    trackPerformanceMetric(testId, variantId, metrics, userId) {
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'ab_test_performance', {
                event_category: 'ab_testing',
                event_label: testId,
                value: metrics.score || 0,
                custom_parameter_test_id: testId,
                custom_parameter_variant_id: variantId,
                custom_parameter_user_id: userId,
                custom_parameter_lcp: metrics.lcp,
                custom_parameter_fid: metrics.fid,
                custom_parameter_cls: metrics.cls,
                custom_parameter_score: metrics.score
            });
        }
    }
    // Store user assignment
    storeUserAssignment(testId, userId, variantId) {
        const key = "ab_test_".concat(testId, "_").concat(userId);
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem(key, variantId);
        }
    }
    // Get user assignment
    getUserAssignment(testId, userId) {
        const key = "ab_test_".concat(testId, "_").concat(userId);
        if ("TURBOPACK compile-time truthy", 1) {
            return localStorage.getItem(key);
        }
        //TURBOPACK unreachable
        ;
    }
    // Get session ID
    getSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }
    // Generate test ID
    generateTestId() {
        return 'test_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "activeTests", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "testData", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "currentVariant", null);
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(PerformanceABTestingManager, "instance", void 0);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/performance-alerts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Performance Regression Alerts for PrepFlow
// Implements automated performance monitoring and alerting
// Alert configuration
__turbopack_context__.s([
    "ALERT_CONFIG",
    ()=>ALERT_CONFIG,
    "PerformanceAlertManager",
    ()=>PerformanceAlertManager,
    "checkPerformanceAndAlert",
    ()=>checkPerformanceAndAlert,
    "getPerformanceAlerts",
    ()=>getPerformanceAlerts,
    "initializePerformanceAlerts",
    ()=>initializePerformanceAlerts,
    "performanceAlertManager",
    ()=>performanceAlertManager,
    "resolvePerformanceAlert",
    ()=>resolvePerformanceAlert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
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
        url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.PERFORMANCE_WEBHOOK_URL || '',
        timeout: 5000,
        retries: 3
    },
    // Email configuration
    email: {
        to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.ALERT_EMAIL_TO || '',
        from: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.ALERT_EMAIL_FROM || 'alerts@prepflow.org',
        subject: 'PrepFlow Performance Alert'
    }
};
class PerformanceAlertManager {
    static getInstance() {
        if (!PerformanceAlertManager.instance) {
            PerformanceAlertManager.instance = new PerformanceAlertManager();
        }
        return PerformanceAlertManager.instance;
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
            message: "".concat(rule.name, ": ").concat(rule.metric, " = ").concat(value, " (threshold: ").concat(rule.threshold, ")"),
            timestamp: actualTimestamp,
            page,
            userId,
            sessionId: sessionId || this.generateSessionId(),
            resolved: false
        };
        this.alerts.set(alertId, alert);
        // Send alert
        this.sendAlert(alert);
        console.warn("🚨 Performance Alert: ".concat(alert.message));
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
            message: "Performance Regression: ".concat(regression.metric, " ").concat(regression.trend, " by ").concat(regression.changePercent.toFixed(1), "% (").concat(regression.currentValue, " vs ").concat(regression.previousValue, ")"),
            timestamp,
            page,
            sessionId: this.generateSessionId(),
            resolved: false
        };
        this.alerts.set(alertId, alert);
        // Send alert
        this.sendAlert(alert);
        console.warn("📉 Performance Regression: ".concat(alert.message));
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
        console.error("".concat(emoji, " ").concat(alert.message, " (").concat(alert.page, ")"));
    }
    // Send analytics alert
    sendAnalyticsAlert(alert) {
        if ("object" !== 'undefined' && window.gtag) {
            window.gtag('event', 'performance_alert', {
                event_category: 'performance',
                event_label: alert.type,
                value: Math.round(alert.currentValue),
                custom_parameter_alert_id: alert.id,
                custom_parameter_metric: alert.metric,
                custom_parameter_threshold: alert.threshold,
                custom_parameter_page: alert.page,
                custom_parameter_change_percent: alert.changePercent
            });
        }
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
        console.log("📧 Email alert would be sent: ".concat(alert.message));
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
        console.log("✅ Alert resolved: ".concat(alert.message));
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
    clearOldAlerts() {
        let maxAge = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 7 * 24 * 60 * 60 * 1000;
        const cutoff = Date.now() - maxAge;
        for (const [id, alert] of this.alerts){
            if (alert.timestamp < cutoff) {
                this.alerts.delete(id);
            }
        }
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "alerts", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "alertRules", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "performanceHistory", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "cooldowns", new Map());
        this.initializeDefaultRules();
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(PerformanceAlertManager, "instance", void 0);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AdvancedPerformanceTracker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdvancedPerformanceTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$budgets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/performance-budgets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$advanced$2d$rum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/advanced-rum.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$ab$2d$testing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/performance-ab-testing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$alerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/performance-alerts.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function AdvancedPerformanceTracker(param) {
    let { onMetrics, enabled = true, sampleRate = 0.1 // Default to 10% sampling
     } = param;
    _s();
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const hasTrackedInitial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasTrackedLCP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasTrackedFID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasTrackedCLS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const resourceObserver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lcpObserver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fidObserver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clsObserver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdvancedPerformanceTracker.useEffect": ()=>{
            if (!enabled || "object" === 'undefined') return;
            // Sample rate check
            if (Math.random() > sampleRate) {
                console.log('📊 PrepFlow Performance: User not sampled for performance tracking');
                return;
            }
            console.log('🚀 PrepFlow Performance: Starting advanced performance tracking');
            // Initialize performance tracking
            const initializeTracking = {
                "AdvancedPerformanceTracker.useEffect.initializeTracking": async ()=>{
                    try {
                        // Initialize advanced monitoring systems
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$advanced$2d$rum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeRUM"])();
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$ab$2d$testing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializePerformanceABTesting"])();
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$alerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializePerformanceAlerts"])();
                        // Track initial page load performance
                        await trackInitialPerformance();
                        // Track Core Web Vitals
                        trackCoreWebVitals();
                        // Track resource performance
                        trackResourcePerformance();
                        // Track user experience metrics
                        trackUserExperience();
                        // Track network information
                        trackNetworkInfo();
                        // Track memory usage
                        trackMemoryUsage();
                        console.log('✅ PrepFlow Performance: All tracking initialized');
                    } catch (error) {
                        console.error('❌ PrepFlow Performance: Initialization failed:', error);
                    }
                }
            }["AdvancedPerformanceTracker.useEffect.initializeTracking"];
            if (document.readyState === 'complete') {
                initializeTracking();
            } else {
                window.addEventListener('load', initializeTracking);
            }
            // Cleanup function
            return ({
                "AdvancedPerformanceTracker.useEffect": ()=>{
                    if (resourceObserver.current) resourceObserver.current.disconnect();
                    if (lcpObserver.current) lcpObserver.current.disconnect();
                    if (fidObserver.current) fidObserver.current.disconnect();
                    if (clsObserver.current) clsObserver.current.disconnect();
                }
            })["AdvancedPerformanceTracker.useEffect"];
        }
    }["AdvancedPerformanceTracker.useEffect"], [
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
            var _paint_find;
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
                fcp: ((_paint_find = paint.find((p)=>p.name === 'first-contentful-paint')) === null || _paint_find === void 0 ? void 0 : _paint_find.startTime) || null,
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackPerformance"])({
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
            if ("object" !== 'undefined' && window.gtag) {
                window.gtag('event', 'page_performance', {
                    event_category: 'performance',
                    event_label: 'initial_load',
                    value: Math.round(navigationMetrics.total),
                    custom_parameter_page_load_time: Math.round(navigationMetrics.total),
                    custom_parameter_dom_content_loaded: Math.round(navigationMetrics.dom),
                    custom_parameter_first_byte: Math.round(navigationMetrics.request),
                    custom_parameter_page: window.location.pathname
                });
            }
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
                                ...prev === null || prev === void 0 ? void 0 : prev.paint,
                                lcp
                            }
                        }));
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('lcp', 'performance', 'largest_contentful_paint', Math.round(lcp));
                    if ("object" !== 'undefined' && window.gtag) {
                        window.gtag('event', 'largest_contentful_paint', {
                            event_category: 'performance',
                            event_label: 'lcp_measured',
                            value: Math.round(lcp),
                            custom_parameter_lcp_value: Math.round(lcp),
                            custom_parameter_page: window.location.pathname
                        });
                    }
                    // Check performance budget and trigger alerts
                    const currentMetrics = {
                        lcp: Math.round(lcp),
                        fid: null,
                        cls: null,
                        fcp: null,
                        tti: null
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$budgets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackPerformanceBudget"])(currentMetrics, 'landing');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performance$2d$alerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkPerformanceAndAlert"])(currentMetrics, window.location.pathname, undefined, "session_".concat(Date.now()));
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
                                    ...prev === null || prev === void 0 ? void 0 : prev.ux,
                                    firstInputDelay: fid
                                }
                            }));
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('fid', 'performance', 'first_input_delay', Math.round(fid));
                        if ("object" !== 'undefined' && window.gtag) {
                            window.gtag('event', 'first_input_delay', {
                                event_category: 'performance',
                                event_label: 'fid_measured',
                                value: Math.round(fid),
                                custom_parameter_fid_value: Math.round(fid),
                                custom_parameter_page: window.location.pathname
                            });
                        }
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
                                ...prev === null || prev === void 0 ? void 0 : prev.ux,
                                cumulativeLayoutShift: clsValue
                            }
                        }));
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('cls', 'performance', 'cumulative_layout_shift', Math.round(clsValue * 1000));
                    if ("object" !== 'undefined' && window.gtag) {
                        window.gtag('event', 'cumulative_layout_shift', {
                            event_category: 'performance',
                            event_label: 'cls_measured',
                            value: Math.round(clsValue * 1000),
                            custom_parameter_cls_value: Math.round(clsValue * 1000),
                            custom_parameter_page: window.location.pathname
                        });
                    }
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
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('slow_resources', 'performance', 'slow_loading', slowResources.length);
                    if ("object" !== 'undefined' && window.gtag) {
                        window.gtag('event', 'slow_resources', {
                            event_category: 'performance',
                            event_label: 'slow_loading_detected',
                            value: slowResources.length,
                            custom_parameter_slow_resources_count: slowResources.length,
                            custom_parameter_page: window.location.pathname
                        });
                    }
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
                    ...prev === null || prev === void 0 ? void 0 : prev.ux,
                    timeToInteractive: tti
                }
            }));
        // Track user interactions
        const trackInteraction = ()=>{
            const interactionTime = performance.now();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('user_interaction', 'performance', 'interaction_timing', Math.round(interactionTime));
            if ("object" !== 'undefined' && window.gtag) {
                window.gtag('event', 'user_interaction', {
                    event_category: 'performance',
                    event_label: 'interaction_timing',
                    value: Math.round(interactionTime),
                    custom_parameter_time_since_load: Math.round(interactionTime),
                    custom_parameter_page: window.location.pathname
                });
            }
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('network_quality', 'performance', connection.effectiveType || 'unknown', 0);
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])('memory_usage', 'performance', 'memory_usage', Math.round(memoryUsagePercent));
        }
    };
    // This component doesn't render anything visible
    return null;
}
_s(AdvancedPerformanceTracker, "c2zKqWH4ZiG2RSifn9+a8j9VPDQ=");
_c = AdvancedPerformanceTracker;
var _c;
__turbopack_context__.k.register(_c, "AdvancedPerformanceTracker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ClientPerformanceTracker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientPerformanceTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AdvancedPerformanceTracker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AdvancedPerformanceTracker.tsx [app-client] (ecmascript)");
'use client';
;
;
function ClientPerformanceTracker() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AdvancedPerformanceTracker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/components/ClientPerformanceTracker.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
_c = ClientPerformanceTracker;
var _c;
__turbopack_context__.k.register(_c, "ClientPerformanceTracker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/WebVitalsTracker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WebVitalsTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$web$2d$vitals$2f$dist$2f$web$2d$vitals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/web-vitals/dist/web-vitals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/analytics.ts [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function WebVitalsTracker(param) {
    let { enabled = true, onMetric } = param;
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WebVitalsTracker.useEffect": ()=>{
            if (!enabled) return;
            // Track Core Web Vitals
            const trackWebVital = {
                "WebVitalsTracker.useEffect.trackWebVital": (metric)=>{
                    // Send to analytics
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["trackEvent"])(metric.name, 'web-vitals', metric.id, Math.round(metric.value));
                    // Send to Google Analytics
                    if ("object" !== 'undefined' && window.gtag) {
                        window.gtag('event', metric.name, {
                            event_category: 'Web Vitals',
                            event_label: metric.id,
                            value: Math.round(metric.value),
                            non_interaction: true,
                            custom_parameter_metric_name: metric.name,
                            custom_parameter_metric_value: Math.round(metric.value),
                            custom_parameter_metric_delta: Math.round(metric.delta),
                            custom_parameter_metric_rating: metric.rating,
                            custom_parameter_page: window.location.pathname
                        });
                    }
                    // Call custom callback if provided
                    if (onMetric) {
                        onMetric(metric);
                    }
                }
            }["WebVitalsTracker.useEffect.trackWebVital"];
            // Track all Core Web Vitals
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$web$2d$vitals$2f$dist$2f$web$2d$vitals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onCLS"])(trackWebVital);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$web$2d$vitals$2f$dist$2f$web$2d$vitals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onINP"])(trackWebVital);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$web$2d$vitals$2f$dist$2f$web$2d$vitals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onFCP"])(trackWebVital);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$web$2d$vitals$2f$dist$2f$web$2d$vitals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onLCP"])(trackWebVital);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$web$2d$vitals$2f$dist$2f$web$2d$vitals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onTTFB"])(trackWebVital);
        }
    }["WebVitalsTracker.useEffect"], [
        enabled,
        onMetric
    ]);
    return null;
}
_s(WebVitalsTracker, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = WebVitalsTracker;
var _c;
__turbopack_context__.k.register(_c, "WebVitalsTracker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_6222251c._.js.map