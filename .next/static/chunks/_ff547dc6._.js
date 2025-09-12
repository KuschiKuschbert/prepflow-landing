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
    const from = fromUnit.toLowerCase();
    const to = toUnit.toLowerCase();
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
        console.warn("Conversion failed for ".concat(ingredientName, ": ").concat(conversion.error));
        return cost;
    }
    return cost * conversion.conversionFactor;
}
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
"[project]/app/webapp/ingredients/components/IngredientForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IngredientForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/text-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/unit-conversion.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function IngredientForm(param) {
    let { ingredient, suppliers, availableUnits, onSave, onCancel, loading = false } = param;
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        ingredient_name: '',
        brand: '',
        pack_size: '',
        pack_size_unit: 'GM',
        pack_price: 0,
        unit: 'GM',
        cost_per_unit: 0,
        cost_per_unit_as_purchased: 0,
        cost_per_unit_incl_trim: 0,
        trim_peel_waste_percentage: 0,
        yield_percentage: 100,
        supplier: '',
        product_code: '',
        storage_location: '',
        min_stock_level: 0,
        current_stock: 0,
        ...ingredient
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Calculate cost per unit from pack price and pack size
    const calculateCostPerUnit = (packPrice, packSize, packSizeUnit, targetUnit)=>{
        if (packPrice === 0 || packSize === 0) return 0;
        const conversion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertUnit"])(1, packSizeUnit, targetUnit);
        const packSizeInTargetUnit = packSize * conversion.conversionFactor;
        return packPrice / packSizeInTargetUnit;
    };
    // Auto-calculate cost per unit when pack price or pack size changes
    const updateCostPerUnit = ()=>{
        if (formData.pack_price && formData.pack_size && formData.pack_size_unit && formData.unit) {
            const calculatedCost = calculateCostPerUnit(formData.pack_price, parseFloat(formData.pack_size), formData.pack_size_unit, formData.unit);
            setFormData((prev)=>({
                    ...prev,
                    cost_per_unit: calculatedCost,
                    cost_per_unit_as_purchased: calculatedCost,
                    cost_per_unit_incl_trim: calculatedCost
                }));
        }
    };
    const handleInputChange = (field, value)=>{
        const formattedValue = typeof value === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTextInput"])(value) : value;
        setFormData((prev)=>({
                ...prev,
                [field]: formattedValue
            }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev)=>({
                    ...prev,
                    [field]: ''
                }));
        }
        // Auto-calculate cost per unit for relevant fields
        if ([
            'pack_price',
            'pack_size',
            'pack_size_unit',
            'unit'
        ].includes(field)) {
            setTimeout(updateCostPerUnit, 100);
        }
    };
    const validateForm = ()=>{
        var _formData_ingredient_name;
        const newErrors = {};
        if (!((_formData_ingredient_name = formData.ingredient_name) === null || _formData_ingredient_name === void 0 ? void 0 : _formData_ingredient_name.trim())) {
            newErrors.ingredient_name = 'Ingredient name is required';
        }
        if (!formData.pack_price || formData.pack_price <= 0) {
            newErrors.pack_price = 'Pack price must be greater than 0';
        }
        if (!formData.pack_size || parseFloat(formData.pack_size) <= 0) {
            newErrors.pack_size = 'Pack size must be greater than 0';
        }
        if (!formData.unit) {
            newErrors.unit = 'Unit is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving ingredient:', error);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1f1f1f] rounded-3xl p-6 border border-[#2a2a2a]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold text-white mb-6",
                children: ingredient ? 'Edit Ingredient' : 'Add New Ingredient'
            }, void 0, false, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Ingredient Name *"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 169,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.ingredient_name || '',
                                        onChange: (e)=>handleInputChange('ingredient_name', e.target.value),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., Tomatoes",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 172,
                                        columnNumber: 13
                                    }, this),
                                    errors.ingredient_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-red-400 text-sm mt-1",
                                        children: errors.ingredient_name
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Brand"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 186,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.brand || '',
                                        onChange: (e)=>handleInputChange('brand', e.target.value),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., Coles"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 189,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Pack Size *"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.01",
                                        value: formData.pack_size || '',
                                        onChange: (e)=>handleInputChange('pack_size', e.target.value),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., 5",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this),
                                    errors.pack_size && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-red-400 text-sm mt-1",
                                        children: errors.pack_size
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 215,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Pack Size Unit"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 220,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: formData.pack_size_unit || 'GM',
                                        onChange: (e)=>handleInputChange('pack_size_unit', e.target.value),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        children: availableUnits.map((unit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: unit,
                                                children: unit
                                            }, unit, false, {
                                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                                lineNumber: 229,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Pack Price *"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 235,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.01",
                                        value: formData.pack_price || '',
                                        onChange: (e)=>handleInputChange('pack_price', parseFloat(e.target.value) || 0),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., 12.50",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this),
                                    errors.pack_price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-red-400 text-sm mt-1",
                                        children: errors.pack_price
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 234,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Cost Per Unit *"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 256,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.01",
                                        value: formData.cost_per_unit || '',
                                        onChange: (e)=>handleInputChange('cost_per_unit', parseFloat(e.target.value) || 0),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "Auto-calculated",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this),
                                    errors.cost_per_unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-red-400 text-sm mt-1",
                                        children: errors.cost_per_unit
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 269,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Unit *"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: formData.unit || 'GM',
                                        onChange: (e)=>handleInputChange('unit', e.target.value),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        required: true,
                                        children: availableUnits.map((unit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: unit,
                                                children: unit
                                            }, unit, false, {
                                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                                lineNumber: 284,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 277,
                                        columnNumber: 13
                                    }, this),
                                    errors.unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-red-400 text-sm mt-1",
                                        children: errors.unit
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 288,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Supplier"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 296,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.supplier || '',
                                        onChange: (e)=>handleInputChange('supplier', e.target.value),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., Coles"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 299,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Storage Location"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 309,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.storage_location || '',
                                        onChange: (e)=>handleInputChange('storage_location', e.target.value),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., Coolroom"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 312,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 308,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Trim/Peel Waste (%)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 325,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.1",
                                        min: "0",
                                        max: "100",
                                        value: formData.trim_peel_waste_percentage || 0,
                                        onChange: (e)=>handleInputChange('trim_peel_waste_percentage', parseFloat(e.target.value) || 0),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., 10"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 328,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 324,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Yield (%)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.1",
                                        min: "0",
                                        max: "100",
                                        value: formData.yield_percentage || 100,
                                        onChange: (e)=>handleInputChange('yield_percentage', parseFloat(e.target.value) || 100),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., 90"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 340,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                        lineNumber: 323,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Min Stock Level"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 360,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.01",
                                        min: "0",
                                        value: formData.min_stock_level || 0,
                                        onChange: (e)=>handleInputChange('min_stock_level', parseFloat(e.target.value) || 0),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., 5"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 363,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 359,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: "Current Stock"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 375,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.01",
                                        min: "0",
                                        value: formData.current_stock || 0,
                                        onChange: (e)=>handleInputChange('current_stock', parseFloat(e.target.value) || 0),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., 10"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                        lineNumber: 378,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 374,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                        lineNumber: 358,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 pt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: loading,
                                className: "flex-1 bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-[#29E7CD]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                                children: loading ? 'Saving...' : ingredient ? 'Update Ingredient' : 'Add Ingredient'
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 392,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onCancel,
                                className: "flex-1 bg-[#2a2a2a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#3a3a3a] transition-all duration-300",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                        lineNumber: 391,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/webapp/ingredients/components/IngredientForm.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
_s(IngredientForm, "G8heQU39lsCCUAJryPPkzKxoWM4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = IngredientForm;
var _c;
__turbopack_context__.k.register(_c, "IngredientForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/webapp/ingredients/components/IngredientForm.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/webapp/ingredients/components/IngredientForm.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_ff547dc6._.js.map