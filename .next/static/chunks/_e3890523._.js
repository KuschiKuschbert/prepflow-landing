(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/unit-conversion.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Unit conversion utilities for ingredient management
__turbopack_context__.s([
    "convertIngredientCost",
    ()=>convertIngredientCost,
    "convertUnit",
    ()=>convertUnit,
    "getAllUnits",
    ()=>getAllUnits,
    "isVolumeUnit",
    ()=>isVolumeUnit,
    "isWeightUnit",
    ()=>isWeightUnit
]);
// Common unit conversions
const CONVERSION_FACTORS = {
    // Weight conversions (base unit: grams)
    'g': {
        'g': 1,
        'kg': 0.001,
        'oz': 0.035274,
        'lb': 0.002205
    },
    'kg': {
        'g': 1000,
        'kg': 1,
        'oz': 35.274,
        'lb': 2.205
    },
    'oz': {
        'g': 28.3495,
        'kg': 0.0283495,
        'oz': 1,
        'lb': 0.0625
    },
    'lb': {
        'g': 453.592,
        'kg': 0.453592,
        'oz': 16,
        'lb': 1
    },
    // Volume conversions (base unit: milliliters)
    'ml': {
        'ml': 1,
        'l': 0.001,
        'tsp': 0.202884,
        'tbsp': 0.067628,
        'cup': 0.004227
    },
    'l': {
        'ml': 1000,
        'l': 1,
        'tsp': 202.884,
        'tbsp': 67.628,
        'cup': 4.227
    },
    'tsp': {
        'ml': 4.92892,
        'l': 0.00492892,
        'tsp': 1,
        'tbsp': 0.333333,
        'cup': 0.0208333
    },
    'tbsp': {
        'ml': 14.7868,
        'l': 0.0147868,
        'tsp': 3,
        'tbsp': 1,
        'cup': 0.0625
    },
    'cup': {
        'ml': 236.588,
        'l': 0.236588,
        'tsp': 48,
        'tbsp': 16,
        'cup': 1
    },
    // Piece conversions (base unit: pieces)
    'pc': {
        'pc': 1,
        'box': 0.01,
        'pack': 0.1,
        'bag': 0.05,
        'bottle': 0.1,
        'can': 0.1
    },
    'box': {
        'pc': 100,
        'box': 1,
        'pack': 10,
        'bag': 5,
        'bottle': 10,
        'can': 10
    },
    'pack': {
        'pc': 10,
        'box': 0.1,
        'pack': 1,
        'bag': 0.5,
        'bottle': 1,
        'can': 1
    },
    'bag': {
        'pc': 20,
        'box': 0.2,
        'pack': 2,
        'bag': 1,
        'bottle': 2,
        'can': 2
    },
    'bottle': {
        'pc': 10,
        'box': 0.1,
        'pack': 1,
        'bag': 0.5,
        'bottle': 1,
        'can': 1
    },
    'can': {
        'pc': 10,
        'box': 0.1,
        'pack': 1,
        'bag': 0.5,
        'bottle': 1,
        'can': 1
    }
};
function convertUnit(amount, fromUnit, toUnit) {
    if (!fromUnit || !toUnit) {
        return {
            conversionFactor: 1,
            isValid: false,
            error: 'Unit not specified'
        };
    }
    // Normalize units - handle common variations
    const normalizeUnit = (unit)=>{
        const normalized = unit.toLowerCase().trim();
        // Handle common unit variations
        if (normalized === 'gm') return 'g';
        if (normalized === 'ml') return 'ml';
        if (normalized === 'pc') return 'pc';
        return normalized;
    };
    const from = normalizeUnit(fromUnit);
    const to = normalizeUnit(toUnit);
    if (from === to) {
        return {
            conversionFactor: 1,
            isValid: true
        };
    }
    const fromFactors = CONVERSION_FACTORS[from];
    if (!fromFactors) {
        return {
            conversionFactor: 1,
            isValid: false,
            error: "Unknown unit: ".concat(fromUnit)
        };
    }
    const conversionFactor = fromFactors[to];
    if (conversionFactor === undefined) {
        return {
            conversionFactor: 1,
            isValid: false,
            error: "Cannot convert from ".concat(fromUnit, " to ").concat(toUnit)
        };
    }
    return {
        conversionFactor,
        isValid: true
    };
}
function convertIngredientCost(cost, fromUnit, toUnit, ingredientName) {
    const conversion = convertUnit(1, fromUnit, toUnit);
    if (!conversion.isValid) {
        // Only log unique conversion errors to reduce console spam
        const errorKey = "".concat(fromUnit, "-").concat(toUnit);
        if (!conversionErrors.has(errorKey)) {
            console.warn("Conversion failed for ".concat(ingredientName, ": ").concat(conversion.error));
            conversionErrors.add(errorKey);
        }
        return cost;
    }
    return cost * conversion.conversionFactor;
}
// Track conversion errors to prevent spam
const conversionErrors = new Set();
function isVolumeUnit(unit) {
    const volumeUnits = [
        'ml',
        'l',
        'tsp',
        'tbsp',
        'cup'
    ];
    return volumeUnits.includes(unit.toLowerCase());
}
function isWeightUnit(unit) {
    const weightUnits = [
        'g',
        'kg',
        'oz',
        'lb'
    ];
    return weightUnits.includes(unit.toLowerCase());
}
function getAllUnits() {
    return Object.keys(CONVERSION_FACTORS);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/webapp/ingredients/components/IngredientTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IngredientTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/unit-conversion.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/LoadingSkeleton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function IngredientTable(param) {
    let { ingredients, displayUnit, onEdit, onDelete, selectedIngredients, onSelectIngredient, onSelectAll, loading = false } = param;
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [deletingId, setDeletingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleDelete = async (id)=>{
        if (window.confirm('Are you sure you want to delete this ingredient?')) {
            setDeletingId(id);
            try {
                await onDelete(id);
            } finally{
                setDeletingId(null);
            }
        }
    };
    const formatCurrency = (amount)=>{
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        }).format(amount);
    };
    const formatDate = (dateString)=>{
        return new Date(dateString).toLocaleDateString('en-AU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#1f1f1f] rounded-3xl p-6 border border-[#2a2a2a]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoadingSkeleton"], {
                variant: "table",
                rows: 5,
                columns: 6
            }, void 0, false, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this);
    }
    if (ingredients.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#1f1f1f] rounded-3xl p-6 border border-[#2a2a2a] text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-400 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-16 h-16 mx-auto mb-4",
                        fill: "currentColor",
                        viewBox: "0 0 20 20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            fillRule: "evenodd",
                            d: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z",
                            clipRule: "evenodd"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                            lineNumber: 95,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-semibold text-white mb-2",
                        children: "No Ingredients Found"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400",
                        children: "Start by adding your first ingredient to get started."
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1f1f1f] rounded-3xl border border-[#2a2a2a] overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-white",
                            children: [
                                "Ingredients (",
                                ingredients.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm text-gray-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: selectedIngredients.size === ingredients.length && ingredients.length > 0,
                                        onChange: (e)=>onSelectAll(e.target.checked),
                                        className: "w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, this),
                                    "Select All"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: selectedIngredients.size === ingredients.length && ingredients.length > 0,
                                            onChange: (e)=>onSelectAll(e.target.checked),
                                            className: "w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                            lineNumber: 130,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Brand"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Pack Size"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Cost/Unit"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Supplier"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Stock"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-[#2a2a2a]",
                            children: ingredients.map((ingredient)=>{
                                const convertedCost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertIngredientCost"])(ingredient.cost_per_unit, ingredient.unit || 'GM', displayUnit, ingredient.ingredient_name || 'Unknown');
                                const isLowStock = ingredient.min_stock_level && ingredient.current_stock && ingredient.current_stock <= ingredient.min_stock_level;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-[#2a2a2a]/20 transition-colors duration-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: selectedIngredients.has(ingredient.id),
                                                onChange: (e)=>onSelectIngredient(ingredient.id, e.target.checked),
                                                className: "w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                lineNumber: 178,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                            lineNumber: 177,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-medium text-white",
                                                    children: ingredient.ingredient_name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 21
                                                }, this),
                                                ingredient.product_code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-400",
                                                    children: ingredient.product_code
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                            lineNumber: 185,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                            children: ingredient.brand || '-'
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                            lineNumber: 195,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                            children: [
                                                ingredient.pack_size,
                                                " ",
                                                ingredient.pack_size_unit
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                            lineNumber: 198,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                            children: [
                                                formatCurrency(convertedCost),
                                                "/",
                                                displayUnit
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                            lineNumber: 201,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                            children: ingredient.supplier || '-'
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                            lineNumber: 204,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm ".concat(isLowStock ? 'text-red-400' : 'text-gray-300'),
                                                        children: [
                                                            ingredient.current_stock || 0,
                                                            " ",
                                                            ingredient.unit
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 23
                                                    }, this),
                                                    isLowStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900/20 text-red-400",
                                                        children: "Low Stock"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                lineNumber: 208,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                            lineNumber: 207,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>onEdit(ingredient),
                                                        className: "text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors",
                                                        "aria-label": "Edit ".concat(ingredient.ingredient_name),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-4 h-4",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                                lineNumber: 227,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                            lineNumber: 226,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDelete(ingredient.id),
                                                        disabled: deletingId === ingredient.id,
                                                        className: "text-red-400 hover:text-red-300 transition-colors disabled:opacity-50",
                                                        "aria-label": "Delete ".concat(ingredient.ingredient_name),
                                                        children: deletingId === ingredient.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                            lineNumber: 237,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-4 h-4",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                                lineNumber: 220,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                            lineNumber: 219,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, ingredient.id, true, {
                                    fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                                    lineNumber: 173,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/webapp/ingredients/components/IngredientTable.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s(IngredientTable, "2bYW9Y7f2yALwihB+ZEAnzKia+Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = IngredientTable;
var _c;
__turbopack_context__.k.register(_c, "IngredientTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/webapp/ingredients/components/IngredientTable.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/webapp/ingredients/components/IngredientTable.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_e3890523._.js.map