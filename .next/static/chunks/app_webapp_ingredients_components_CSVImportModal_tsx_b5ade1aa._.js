(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/webapp/ingredients/components/CSVImportModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CSVImportModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/text-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function CSVImportModal(param) {
    let { isOpen, onClose, onImport, loading = false } = param;
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [csvData, setCsvData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [parsedIngredients, setParsedIngredients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedIngredients, setSelectedIngredients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleFileUpload = (event)=>{
        var _event_target_files;
        const file = (_event_target_files = event.target.files) === null || _event_target_files === void 0 ? void 0 : _event_target_files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e)=>{
            var _e_target;
            const csvText = (_e_target = e.target) === null || _e_target === void 0 ? void 0 : _e_target.result;
            setCsvData(csvText);
            parseCSVWithAI(csvText);
        };
        reader.readAsText(file);
    };
    const parseCSVWithAI = (csvText)=>{
        try {
            const lines = csvText.split('\n').filter((line)=>line.trim());
            if (lines.length < 2) {
                setError('CSV must have at least a header row and one data row');
                return;
            }
            const headers = lines[0].split(',').map((h)=>h.trim().toLowerCase());
            const parsedData = [];
            for(let i = 1; i < lines.length; i++){
                const values = lines[i].split(',').map((v)=>v.trim());
                const ingredient = {};
                headers.forEach((header, index)=>{
                    const value = values[index] || '';
                    // AI-powered column mapping with capitalization
                    if (header.includes('name') || header.includes('ingredient')) {
                        ingredient.ingredient_name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatIngredientName"])(value);
                    } else if (header.includes('brand')) {
                        ingredient.brand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatBrandName"])(value);
                    } else if (header.includes('cost') || header.includes('price')) {
                        ingredient.cost_per_unit = parseFloat(value) || 0;
                    } else if (header.includes('unit')) {
                        ingredient.unit = value.toUpperCase();
                    } else if (header.includes('supplier')) {
                        ingredient.supplier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatSupplierName"])(value);
                    } else if (header.includes('code') || header.includes('sku')) {
                        ingredient.product_code = value;
                    } else if (header.includes('location') || header.includes('storage')) {
                        ingredient.storage_location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatStorageLocation"])(value);
                    } else if (header.includes('pack') || header.includes('size')) {
                        ingredient.pack_size = value || '1';
                    }
                });
                // Set defaults for required fields
                if (!ingredient.ingredient_name) continue; // Skip rows without ingredient name
                if (!ingredient.cost_per_unit) ingredient.cost_per_unit = 0;
                if (!ingredient.cost_per_unit_as_purchased) ingredient.cost_per_unit_as_purchased = ingredient.cost_per_unit || 0;
                if (!ingredient.cost_per_unit_incl_trim) ingredient.cost_per_unit_incl_trim = ingredient.cost_per_unit || 0;
                if (!ingredient.trim_peel_waste_percentage) ingredient.trim_peel_waste_percentage = 0;
                if (!ingredient.yield_percentage) ingredient.yield_percentage = 100;
                if (!ingredient.unit) ingredient.unit = 'GM';
                if (!ingredient.pack_size) ingredient.pack_size = '1';
                parsedData.push(ingredient);
            }
            setParsedIngredients(parsedData);
            setError(null);
        } catch (err) {
            setError('Failed to parse CSV file');
        }
    };
    const handleSelectIngredient = (index, selected)=>{
        const newSelected = new Set(selectedIngredients);
        if (selected) {
            newSelected.add(index);
        } else {
            newSelected.delete(index);
        }
        setSelectedIngredients(newSelected);
    };
    const handleSelectAll = (selected)=>{
        if (selected) {
            setSelectedIngredients(new Set(parsedIngredients.map((_, i)=>i.toString())));
        } else {
            setSelectedIngredients(new Set());
        }
    };
    const handleImport = async ()=>{
        try {
            const ingredientsToImport = parsedIngredients.filter((_, index)=>selectedIngredients.has(index.toString())).map((ingredient)=>({
                    ...ingredient,
                    ingredient_name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatIngredientName"])(ingredient.ingredient_name || ''),
                    brand: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatBrandName"])(ingredient.brand || ''),
                    supplier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatSupplierName"])(ingredient.supplier || ''),
                    storage_location: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatStorageLocation"])(ingredient.storage_location || '')
                }));
            await onImport(ingredientsToImport);
            // Reset state
            setCsvData('');
            setParsedIngredients([]);
            setSelectedIngredients(new Set());
            setError(null);
        } catch (err) {
            console.error('Failed to import ingredients:', err);
        }
    };
    const handleClose = ()=>{
        setCsvData('');
        setParsedIngredients([]);
        setSelectedIngredients(new Set());
        setError(null);
        onClose();
    };
    const formatCost = (cost)=>{
        if (cost < 1) {
            return cost.toFixed(3);
        } else if (cost < 10) {
            return cost.toFixed(2);
        } else {
            return cost.toFixed(2);
        }
    };
    const getDisplayCost = (ingredient)=>{
        const cost = ingredient.cost_per_unit || 0;
        const unit = ingredient.unit || '';
        const formattedCost = formatCost(cost);
        let packInfo = '';
        if (ingredient.pack_price && ingredient.pack_size && ingredient.pack_size_unit) {
            packInfo = "Pack: $".concat(ingredient.pack_price, " for ").concat(ingredient.pack_size).concat(ingredient.pack_size_unit);
        }
        return {
            cost,
            unit,
            formattedCost,
            packInfo
        };
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-[#2a2a2a]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-white",
                                children: "📁 Import Ingredients from CSV"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                lineNumber: 201,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleClose,
                                className: "p-2 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-400 hover:text-white transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-6 h-6",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M6 18L18 6M6 6l12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                    lineNumber: 199,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Upload CSV File"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "file",
                                    accept: ".csv",
                                    onChange: handleFileUpload,
                                    className: "w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-400 mt-1",
                                    children: "Supported columns: name, brand, cost, unit, supplier, code, location, pack_size"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                            lineNumber: 216,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                            lineNumber: 233,
                            columnNumber: 13
                        }, this),
                        parsedIngredients.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-medium text-white",
                                            children: [
                                                "Preview (",
                                                parsedIngredients.length,
                                                " ingredients found)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 242,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleSelectAll(true),
                                                    className: "text-sm text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors",
                                                    children: "Select All"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleSelectAll(false),
                                                    className: "text-sm text-gray-400 hover:text-white transition-colors",
                                                    children: "Clear All"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 245,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                    lineNumber: 241,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-h-60 overflow-y-auto border border-[#2a2a2a] rounded-lg",
                                    children: parsedIngredients.map((ingredient, index)=>{
                                        const displayCost = getDisplayCost(ingredient);
                                        const isSelected = selectedIngredients.has(index.toString());
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3 border-b border-[#2a2a2a] last:border-b-0 transition-colors ".concat(isSelected ? 'bg-[#29E7CD]/10' : 'hover:bg-[#2a2a2a]/20'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: isSelected,
                                                        onChange: (e)=>handleSelectIngredient(index.toString(), e.target.checked),
                                                        className: "w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                                        lineNumber: 274,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-white font-medium",
                                                                children: ingredient.ingredient_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-400",
                                                                children: [
                                                                    ingredient.brand && "Brand: ".concat(ingredient.brand, " • "),
                                                                    "Cost: $",
                                                                    displayCost.formattedCost,
                                                                    "/",
                                                                    displayCost.unit,
                                                                    displayCost.packInfo && " • ".concat(displayCost.packInfo)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                                                lineNumber: 284,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                                lineNumber: 273,
                                                columnNumber: 23
                                            }, this)
                                        }, index, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 267,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                    lineNumber: 261,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex justify-end space-x-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleClose,
                                            className: "px-4 py-2 text-gray-400 hover:text-white transition-colors",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 297,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleImport,
                                            disabled: loading || selectedIngredients.size === 0,
                                            className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: loading ? 'Importing...' : "Import Selected (".concat(selectedIngredients.size, ")")
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 303,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                    lineNumber: 296,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                            lineNumber: 240,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#2a2a2a]/30 p-4 rounded-lg border border-[#2a2a2a]/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "text-sm font-semibold text-white mb-2",
                                    children: "📋 CSV Format Instructions"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-gray-400 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "• First row should contain column headers"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 318,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "• Required columns: name (or ingredient), cost (or price), unit"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 319,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "• Optional columns: brand, supplier, code (or sku), location (or storage), pack_size"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "• Values will be automatically formatted and capitalized"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 321,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "• Empty rows will be skipped"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                            lineNumber: 322,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                            lineNumber: 315,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
            lineNumber: 197,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/webapp/ingredients/components/CSVImportModal.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, this);
}
_s(CSVImportModal, "QEyvyYNrUPY/kKkEMsbuWLYQ8dw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = CSVImportModal;
var _c;
__turbopack_context__.k.register(_c, "CSVImportModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/webapp/ingredients/components/CSVImportModal.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/webapp/ingredients/components/CSVImportModal.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_webapp_ingredients_components_CSVImportModal_tsx_b5ade1aa._.js.map