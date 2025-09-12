(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/webapp/components/RecentActivity.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RecentActivity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function RecentActivity() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecentActivity.useEffect": ()=>{
            const fetchRecentActivity = {
                "RecentActivity.useEffect.fetchRecentActivity": async ()=>{
                    try {
                        // Fetch recent ingredients
                        const { data: ingredients, error: ingredientsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('ingredients').select('id, ingredient_name, created_at, updated_at').order('updated_at', {
                            ascending: false
                        }).limit(3);
                        // Fetch recent recipes
                        const { data: recipes, error: recipesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').select('id, recipe_name, created_at, updated_at').order('updated_at', {
                            ascending: false
                        }).limit(3);
                        // Fetch recent menu dishes
                        const { data: menuDishes, error: menuDishesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('menu_dishes').select('id, dish_name, created_at, updated_at').order('updated_at', {
                            ascending: false
                        }).limit(3);
                        // Check for errors and handle gracefully
                        if (ingredientsError || recipesError || menuDishesError) {
                            console.error('Error fetching recent activity:', {
                                ingredientsError,
                                recipesError,
                                menuDishesError
                            });
                            // If tables don't exist yet, just show empty state instead of error
                            setActivities([]);
                            return;
                        }
                        // Combine and format activities with proper type checking
                        const allActivities = [
                            ...(ingredients || []).filter({
                                "RecentActivity.useEffect.fetchRecentActivity": (item)=>item && typeof item === 'object' && 'id' in item
                            }["RecentActivity.useEffect.fetchRecentActivity"]).map({
                                "RecentActivity.useEffect.fetchRecentActivity": (item)=>({
                                        id: String(item.id),
                                        type: 'ingredient',
                                        name: String(item.ingredient_name || 'Unknown'),
                                        action: 'updated',
                                        created_at: item.updated_at || item.created_at || new Date().toISOString()
                                    })
                            }["RecentActivity.useEffect.fetchRecentActivity"]),
                            ...(recipes || []).filter({
                                "RecentActivity.useEffect.fetchRecentActivity": (item)=>item && typeof item === 'object' && 'id' in item
                            }["RecentActivity.useEffect.fetchRecentActivity"]).map({
                                "RecentActivity.useEffect.fetchRecentActivity": (item)=>({
                                        id: String(item.id),
                                        type: 'recipe',
                                        name: String(item.recipe_name || 'Unknown'),
                                        action: 'updated',
                                        created_at: item.updated_at || item.created_at || new Date().toISOString()
                                    })
                            }["RecentActivity.useEffect.fetchRecentActivity"]),
                            ...(menuDishes || []).filter({
                                "RecentActivity.useEffect.fetchRecentActivity": (item)=>item && typeof item === 'object' && 'id' in item
                            }["RecentActivity.useEffect.fetchRecentActivity"]).map({
                                "RecentActivity.useEffect.fetchRecentActivity": (item)=>({
                                        id: String(item.id),
                                        type: 'menu_dish',
                                        name: String(item.dish_name || 'Unknown'),
                                        action: 'updated',
                                        created_at: item.updated_at || item.created_at || new Date().toISOString()
                                    })
                            }["RecentActivity.useEffect.fetchRecentActivity"])
                        ];
                        // Sort by date and take the 5 most recent
                        const sortedActivities = allActivities.sort({
                            "RecentActivity.useEffect.fetchRecentActivity.sortedActivities": (a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                        }["RecentActivity.useEffect.fetchRecentActivity.sortedActivities"]).slice(0, 5);
                        setActivities(sortedActivities);
                    } catch (error) {
                    // Handle error gracefully
                    } finally{
                        setLoading(false);
                    }
                }
            }["RecentActivity.useEffect.fetchRecentActivity"];
            fetchRecentActivity();
        }
    }["RecentActivity.useEffect"], []);
    const getActivityIcon = (type)=>{
        switch(type){
            case 'ingredient':
                return '🥘';
            case 'recipe':
                return '📖';
            case 'menu_dish':
                return '🍽️';
            default:
                return '📝';
        }
    };
    const getActivityColor = (type)=>{
        switch(type){
            case 'ingredient':
                return 'text-[#29E7CD]';
            case 'recipe':
                return 'text-[#3B82F6]';
            case 'menu_dish':
                return 'text-[#D925C7]';
            default:
                return 'text-gray-400';
        }
    };
    const formatDate = (dateString)=>{
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return "".concat(diffInHours, "h ago");
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString();
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-6 bg-[#2a2a2a] rounded-xl w-1/3 mb-4"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            ...Array(5)
                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 bg-[#2a2a2a] rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                        lineNumber: 130,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-4 bg-[#2a2a2a] rounded w-3/4 mb-2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                                lineNumber: 132,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-3 bg-[#2a2a2a] rounded w-1/2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                                lineNumber: 133,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                lineNumber: 129,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                lineNumber: 125,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/webapp/components/RecentActivity.tsx",
            lineNumber: 124,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold text-white mb-2",
                        children: "📈 Recent Activity"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400",
                        children: "Latest updates to your kitchen data"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            activities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-4xl mb-4",
                        children: "📝"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-white mb-2",
                        children: "No Recent Activity"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400",
                        children: "Start by adding ingredients or creating recipes"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                lineNumber: 151,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: activities.map((activity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-4 p-3 rounded-xl hover:bg-[#2a2a2a]/30 transition-colors duration-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] flex items-center justify-center ".concat(getActivityColor(activity.type)),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-lg",
                                    children: getActivityIcon(activity.type)
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                    lineNumber: 161,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                lineNumber: 160,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-white font-medium truncate",
                                        children: activity.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                        lineNumber: 165,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400",
                                        children: [
                                            activity.type.replace('_', ' '),
                                            " ",
                                            activity.action
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                        lineNumber: 168,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                lineNumber: 164,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-500",
                                children: formatDate(activity.created_at)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                                lineNumber: 173,
                                columnNumber: 15
                            }, this)
                        ]
                    }, activity.id, true, {
                        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                        lineNumber: 159,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/webapp/components/RecentActivity.tsx",
                lineNumber: 157,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/webapp/components/RecentActivity.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_s(RecentActivity, "g88d+aducx4vgwhC2Sz3TqcolWI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = RecentActivity;
var _c;
__turbopack_context__.k.register(_c, "RecentActivity");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/webapp/components/RecentActivity.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/webapp/components/RecentActivity.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_webapp_components_RecentActivity_tsx_032717d1._.js.map