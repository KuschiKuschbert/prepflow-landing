(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/webapp/ingredients/components/IngredientActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IngredientActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function IngredientActions(param) {
    let { selectedIngredients, filteredIngredients, onAddIngredient, onImportCSV, onExportCSV, onBulkDelete, onBulkUpdate, loading = false } = param;
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [bulkActionLoading, setBulkActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBulkMenu, setShowBulkMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const selectedCount = selectedIngredients.size;
    const selectedIngredientsData = filteredIngredients.filter((ingredient)=>selectedIngredients.has(ingredient.id));
    const handleBulkDelete = async ()=>{
        if (selectedCount === 0) return;
        const confirmMessage = "Are you sure you want to delete ".concat(selectedCount, " ingredient").concat(selectedCount > 1 ? 's' : '', "?");
        if (!window.confirm(confirmMessage)) return;
        setBulkActionLoading(true);
        try {
            await onBulkDelete(Array.from(selectedIngredients));
        } finally{
            setBulkActionLoading(false);
            setShowBulkMenu(false);
        }
    };
    const handleBulkUpdateSupplier = async ()=>{
        if (selectedCount === 0) return;
        const newSupplier = window.prompt("Enter new supplier for ".concat(selectedCount, " ingredient").concat(selectedCount > 1 ? 's' : '', ":"));
        if (!(newSupplier === null || newSupplier === void 0 ? void 0 : newSupplier.trim())) return;
        setBulkActionLoading(true);
        try {
            await onBulkUpdate(Array.from(selectedIngredients), {
                supplier: newSupplier.trim()
            });
        } finally{
            setBulkActionLoading(false);
            setShowBulkMenu(false);
        }
    };
    const handleBulkUpdateStorage = async ()=>{
        if (selectedCount === 0) return;
        const newStorage = window.prompt("Enter new storage location for ".concat(selectedCount, " ingredient").concat(selectedCount > 1 ? 's' : '', ":"));
        if (!(newStorage === null || newStorage === void 0 ? void 0 : newStorage.trim())) return;
        setBulkActionLoading(true);
        try {
            await onBulkUpdate(Array.from(selectedIngredients), {
                storage_location: newStorage.trim()
            });
        } finally{
            setBulkActionLoading(false);
            setShowBulkMenu(false);
        }
    };
    const handleBulkUpdateWastage = async ()=>{
        if (selectedCount === 0) return;
        const wastageInput = window.prompt("Enter wastage percentage (0-100) for ".concat(selectedCount, " ingredient").concat(selectedCount > 1 ? 's' : '', ":"));
        if (!wastageInput) return;
        const wastage = parseFloat(wastageInput);
        if (isNaN(wastage) || wastage < 0 || wastage > 100) {
            alert('Please enter a valid percentage between 0 and 100');
            return;
        }
        setBulkActionLoading(true);
        try {
            await onBulkUpdate(Array.from(selectedIngredients), {
                trim_peel_waste_percentage: wastage,
                yield_percentage: 100 - wastage
            });
        } finally{
            setBulkActionLoading(false);
            setShowBulkMenu(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap gap-3 mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onAddIngredient,
                className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium",
                children: "+ Add Ingredient"
            }, void 0, false, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onImportCSV,
                className: "bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] text-white px-4 py-2 rounded-lg hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium",
                children: "📁 Import CSV"
            }, void 0, false, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onExportCSV,
                className: "bg-gradient-to-r from-[#D925C7] to-[#3B82F6] text-white px-4 py-2 rounded-lg hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium",
                children: "📤 Export CSV"
            }, void 0, false, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            selectedCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowBulkMenu(!showBulkMenu),
                        className: "bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-500/80 hover:to-red-500/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium",
                        children: [
                            "⚡ Bulk Actions (",
                            selectedCount,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this),
                    showBulkMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-full left-0 mt-2 w-64 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg shadow-xl z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-gray-400 px-3 py-2 border-b border-[#2a2a2a]",
                                    children: [
                                        selectedCount,
                                        " ingredient",
                                        selectedCount > 1 ? 's' : '',
                                        " selected"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                                    lineNumber: 164,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1 mt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleBulkDelete,
                                            disabled: bulkActionLoading,
                                            className: "w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50",
                                            children: "🗑️ Delete Selected"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                                            lineNumber: 169,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleBulkUpdateSupplier,
                                            disabled: bulkActionLoading,
                                            className: "w-full text-left px-3 py-2 text-gray-300 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50",
                                            children: "🏪 Update Supplier"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                                            lineNumber: 177,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleBulkUpdateStorage,
                                            disabled: bulkActionLoading,
                                            className: "w-full text-left px-3 py-2 text-gray-300 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50",
                                            children: "📍 Update Storage Location"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                                            lineNumber: 185,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleBulkUpdateWastage,
                                            disabled: bulkActionLoading,
                                            className: "w-full text-left px-3 py-2 text-gray-300 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50",
                                            children: "🎯 Update Wastage %"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                                            lineNumber: 193,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                                    lineNumber: 168,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                            lineNumber: 163,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                        lineNumber: 162,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                lineNumber: 153,
                columnNumber: 9
            }, this),
            (loading || bulkActionLoading) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-gray-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-4 h-4 border-2 border-[#29E7CD] border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm",
                        children: bulkActionLoading ? 'Processing...' : 'Loading...'
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                lineNumber: 209,
                columnNumber: 9
            }, this),
            selectedCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-sm text-gray-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Selected:"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[#29E7CD] font-medium",
                        children: selectedCount
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                        lineNumber: 221,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "of"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white font-medium",
                        children: filteredIngredients.length
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
                lineNumber: 219,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/webapp/ingredients/components/IngredientActions.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
_s(IngredientActions, "tC2HEfOWFW1vOvs4fUm4HPwVGjs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = IngredientActions;
var _c;
__turbopack_context__.k.register(_c, "IngredientActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/webapp/ingredients/components/IngredientActions.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/webapp/ingredients/components/IngredientActions.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_webapp_ingredients_components_IngredientActions_tsx_1f8f229b._.js.map