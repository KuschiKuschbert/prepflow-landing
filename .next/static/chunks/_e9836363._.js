(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/lib/supabase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createSupabaseAdmin": ()=>createSupabaseAdmin,
    "supabase": ()=>supabase,
    "supabaseAdmin": ()=>supabaseAdmin
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
;
// Client-side Supabase client
const supabaseUrl = ("TURBOPACK compile-time value", "https://dulkrqgjfohsuxhsmofo.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bGtycWdqZm9oc3V4aHNtb2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzYwMDMsImV4cCI6MjA3MjU1MjAwM30.b_P98mAantymNfWy1Qz18SaR-LwrPjuaebO2Uj_5JK8");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
function createSupabaseAdmin() {
    const serviceRoleKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, serviceRoleKey);
}
const supabaseAdmin = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/unit-conversion.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Comprehensive Unit Conversion System for PrepFlow WebApp
__turbopack_context__.s({
    "convertIngredientCost": ()=>convertIngredientCost,
    "convertUnit": ()=>convertUnit,
    "formatQuantityWithConversion": ()=>formatQuantityWithConversion,
    "getAllUnits": ()=>getAllUnits,
    "getConversionFactor": ()=>getConversionFactor,
    "getIngredientDensity": ()=>getIngredientDensity,
    "isVolumeUnit": ()=>isVolumeUnit,
    "isWeightUnit": ()=>isWeightUnit
});
// Volume to Volume conversions (base unit: ml)
const volumeConversions = {
    'ml': 1,
    'milliliter': 1,
    'l': 1000,
    'liter': 1000,
    'litre': 1000,
    'tsp': 5,
    'teaspoon': 5,
    'tbsp': 15,
    'tablespoon': 15,
    'cup': 240,
    'cups': 240,
    'fl oz': 30,
    'fluid ounce': 30,
    'pint': 480,
    'quart': 960,
    'gallon': 3840
};
// Weight to Weight conversions (base unit: g)
const weightConversions = {
    'g': 1,
    'gm': 1,
    'gram': 1,
    'grams': 1,
    'kg': 1000,
    'kilogram': 1000,
    'oz': 28.35,
    'ounce': 28.35,
    'lb': 453.6,
    'pound': 453.6,
    'mg': 0.001,
    'milligram': 0.001
};
// Common ingredient densities (grams per ml) for volume to weight conversion
const densities = {
    // Liquids
    'water': 1.0,
    'milk': 1.03,
    'cream': 1.01,
    'oil': 0.92,
    'olive oil': 0.92,
    'vegetable oil': 0.92,
    'vinegar': 1.01,
    'honey': 1.42,
    'syrup': 1.33,
    // Flours and powders
    'flour': 0.59,
    'all-purpose flour': 0.59,
    'bread flour': 0.59,
    'cake flour': 0.59,
    'sugar': 0.85,
    'white sugar': 0.85,
    'brown sugar': 0.8,
    'powdered sugar': 0.6,
    'cocoa powder': 0.4,
    'baking powder': 0.6,
    'baking soda': 0.87,
    'salt': 1.2,
    'cornstarch': 0.6,
    // Nuts and seeds
    'almonds': 0.6,
    'walnuts': 0.65,
    'pecans': 0.7,
    'peanuts': 0.6,
    'sesame seeds': 0.6,
    'sunflower seeds': 0.5,
    // Dairy
    'butter': 0.91,
    'cheese': 1.1,
    'cream cheese': 1.0,
    'yogurt': 1.03,
    // Default density for unknown ingredients
    'default': 0.8
};
function getIngredientDensity(ingredientName) {
    if (!ingredientName) return densities.default;
    const lowerIngredient = ingredientName.toLowerCase();
    // Check for exact matches first
    if (densities[lowerIngredient]) {
        return densities[lowerIngredient];
    }
    // Check for partial matches
    for (const [key, density] of Object.entries(densities)){
        if (lowerIngredient.includes(key) || key.includes(lowerIngredient)) {
            return density;
        }
    }
    return densities.default;
}
function isVolumeUnit(unit) {
    const normalizedUnit = unit.toLowerCase().trim();
    return normalizedUnit in volumeConversions;
}
function isWeightUnit(unit) {
    const normalizedUnit = unit.toLowerCase().trim();
    return normalizedUnit in weightConversions;
}
function convertUnit(value, fromUnit, toUnit, ingredientName) {
    const from = fromUnit.toLowerCase().trim();
    const to = toUnit.toLowerCase().trim();
    // If same unit, return original value
    if (from === to) {
        return {
            convertedValue: value,
            convertedUnit: toUnit,
            originalValue: value,
            originalUnit: fromUnit,
            conversionFactor: 1
        };
    }
    const isFromVolume = isVolumeUnit(from);
    const isToVolume = isVolumeUnit(to);
    const isFromWeight = isWeightUnit(from);
    const isToWeight = isWeightUnit(to);
    let convertedValue;
    let conversionFactor;
    if (isFromVolume && isToVolume) {
        // Volume to Volume conversion
        const fromMl = value * volumeConversions[from];
        convertedValue = fromMl / volumeConversions[to];
        conversionFactor = volumeConversions[from] / volumeConversions[to];
    } else if (isFromWeight && isToWeight) {
        // Weight to Weight conversion
        const fromGrams = value * weightConversions[from];
        convertedValue = fromGrams / weightConversions[to];
        conversionFactor = weightConversions[from] / weightConversions[to];
    } else if (isFromVolume && isToWeight) {
        // Volume to Weight conversion
        const density = getIngredientDensity(ingredientName || '');
        const fromMl = value * volumeConversions[from];
        const grams = fromMl * density;
        convertedValue = grams / weightConversions[to];
        conversionFactor = volumeConversions[from] * density / weightConversions[to];
    } else if (isFromWeight && isToVolume) {
        // Weight to Volume conversion
        const density = getIngredientDensity(ingredientName || '');
        const fromGrams = value * weightConversions[from];
        const ml = fromGrams / density;
        convertedValue = ml / volumeConversions[to];
        conversionFactor = weightConversions[from] / (density * volumeConversions[to]);
    } else {
        // Unknown units - return original value
        return {
            convertedValue: value,
            convertedUnit: toUnit,
            originalValue: value,
            originalUnit: fromUnit,
            conversionFactor: 1
        };
    }
    return {
        convertedValue,
        convertedUnit: toUnit,
        originalValue: value,
        originalUnit: fromUnit,
        conversionFactor
    };
}
function convertIngredientCost(costPerUnit, fromUnit, toUnit, ingredientName) {
    const conversion = convertUnit(1, fromUnit, toUnit, ingredientName);
    return costPerUnit / conversion.conversionFactor;
}
function formatQuantityWithConversion(quantity, unit, targetUnit) {
    if (!targetUnit || unit.toLowerCase() === targetUnit.toLowerCase()) {
        return {
            value: quantity.toFixed(2),
            unit
        };
    }
    const conversion = convertUnit(quantity, unit, targetUnit);
    return {
        value: conversion.convertedValue.toFixed(2),
        unit: targetUnit,
        original: "".concat(quantity, " ").concat(unit)
    };
}
function getAllUnits() {
    return {
        volume: Object.keys(volumeConversions),
        weight: Object.keys(weightConversions)
    };
}
function getConversionFactor(fromUnit, toUnit, ingredientName) {
    const conversion = convertUnit(1, fromUnit, toUnit, ingredientName);
    return conversion.conversionFactor;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/text-utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * Text utility functions for consistent formatting across the webapp
 */ /**
 * Converts text to proper case with cooking-specific rules
 * Handles common cooking terms and maintains professional formatting
 * 
 * @param text - The text to format
 * @returns Properly formatted text
 * 
 * @example
 * toProperCase('fresh tomatoes and herbs') // 'Fresh Tomatoes and Herbs'
 * toProperCase('salt and pepper') // 'Salt and Pepper'
 * toProperCase('olive oil') // 'Olive Oil'
 */ __turbopack_context__.s({
    "formatBrandName": ()=>formatBrandName,
    "formatDishName": ()=>formatDishName,
    "formatIngredientName": ()=>formatIngredientName,
    "formatRecipeName": ()=>formatRecipeName,
    "formatStorageLocation": ()=>formatStorageLocation,
    "formatSupplierName": ()=>formatSupplierName,
    "formatTextInput": ()=>formatTextInput,
    "toProperCase": ()=>toProperCase,
    "toSentenceCase": ()=>toSentenceCase,
    "toTitleCase": ()=>toTitleCase
});
function toProperCase(text) {
    if (!text) return '';
    // Split by spaces and capitalize each word
    return text.split(' ').map((word)=>{
        // Handle special cases for common cooking terms
        const lowerWord = word.toLowerCase();
        if (lowerWord === 'and' || lowerWord === 'or' || lowerWord === 'the' || lowerWord === 'of' || lowerWord === 'in' || lowerWord === 'with' || lowerWord === 'for' || lowerWord === 'to' || lowerWord === 'from') {
            return lowerWord;
        }
        // Capitalize first letter of each word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}
function toTitleCase(text) {
    if (!text) return '';
    return text.split(' ').map((word)=>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
function toSentenceCase(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
function formatIngredientName(ingredientName) {
    return toProperCase(ingredientName);
}
function formatRecipeName(recipeName) {
    return toProperCase(recipeName);
}
function formatBrandName(brandName) {
    return toProperCase(brandName);
}
function formatSupplierName(supplierName) {
    return toProperCase(supplierName);
}
function formatStorageLocation(locationName) {
    return toProperCase(locationName);
}
function formatDishName(dishName) {
    return toProperCase(dishName);
}
function formatTextInput(text) {
    return toProperCase(text);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/webapp/cogs/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>COGSPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/unit-conversion.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/text-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function COGSPage() {
    _s();
    const [ingredients, setIngredients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recipes, setRecipes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedRecipe, setSelectedRecipe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [recipeIngredients, setRecipeIngredients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [calculations, setCalculations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddIngredient, setShowAddIngredient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recipeExists, setRecipeExists] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [checkingRecipe, setCheckingRecipe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dishNameLocked, setDishNameLocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingIngredient, setEditingIngredient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editQuantity, setEditQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [dishName, setDishName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [dishPortions, setDishPortions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [ingredientSearch, setIngredientSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showSuggestions, setShowSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedIngredient, setSelectedIngredient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newIngredient, setNewIngredient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        ingredient_id: '',
        quantity: 0,
        unit: 'kg'
    });
    // Costing Tool State
    const [targetGrossProfit, setTargetGrossProfit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(70); // Default 70% GP
    const [sellPriceExclGST, setSellPriceExclGST] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [sellPriceInclGST, setSellPriceInclGST] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pricingStrategy, setPricingStrategy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('charm');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "COGSPage.useEffect": ()=>{
            fetchData();
        }
    }["COGSPage.useEffect"], []);
    // Handle editing data from recipe book
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "COGSPage.useEffect": ()=>{
            const editingData = sessionStorage.getItem('editingRecipe');
            if (editingData) {
                try {
                    const { recipe, recipeId, calculations, dishName, dishPortions, dishNameLocked } = JSON.parse(editingData);
                    console.log('🔍 DEBUG: Loading from sessionStorage with recipeId:', {
                        dishName,
                        recipeId,
                        calculationsCount: calculations.length
                    });
                    // Set the editing data
                    setDishName(dishName);
                    setDishPortions(dishPortions);
                    setDishNameLocked(dishNameLocked);
                    setCalculations(calculations);
                    // Convert calculations back to recipeIngredients format
                    const recipeIngredientsData = calculations.map({
                        "COGSPage.useEffect.recipeIngredientsData": (calc)=>({
                                recipe_id: calc.recipeId,
                                ingredient_id: calc.ingredientId,
                                quantity: calc.quantity,
                                unit: calc.unit
                            })
                    }["COGSPage.useEffect.recipeIngredientsData"]);
                    setRecipeIngredients(recipeIngredientsData);
                    // Set recipe exists to true since we have the specific recipe
                    setRecipeExists(true);
                    // Clear the session storage
                    sessionStorage.removeItem('editingRecipe');
                    // Show success message
                    setSuccessMessage('Recipe "'.concat(dishName, '" loaded for editing!'));
                    setTimeout({
                        "COGSPage.useEffect": ()=>setSuccessMessage(null)
                    }["COGSPage.useEffect"], 3000);
                } catch (err) {
                    console.log('Failed to parse editing data:', err);
                }
            }
        }
    }["COGSPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "COGSPage.useEffect": ()=>{
            if (selectedRecipe) {
                fetchRecipeIngredients();
            }
        }
    }["COGSPage.useEffect"], [
        selectedRecipe
    ]);
    // Close suggestions when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "COGSPage.useEffect": ()=>{
            const handleClickOutside = {
                "COGSPage.useEffect.handleClickOutside": (event)=>{
                    const target = event.target;
                    // Don't close if clicking on suggestions or search input
                    if (!target.closest('.ingredient-search-container') && !target.closest('.suggestions-dropdown')) {
                        setShowSuggestions(false);
                    }
                }
            }["COGSPage.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "COGSPage.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["COGSPage.useEffect"];
        }
    }["COGSPage.useEffect"], []);
    const fetchData = async ()=>{
        try {
            // Fetch ingredients
            const { data: ingredientsData, error: ingredientsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('ingredients').select('*').order('ingredient_name');
            // Fetch recipes
            const { data: recipesData, error: recipesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').select('*').order('name');
            if (ingredientsError) {
                console.log('Ingredients table not found or empty:', ingredientsError.message);
                setIngredients([]); // Set empty array instead of showing error
            } else {
                console.log('Ingredients fetched:', (ingredientsData === null || ingredientsData === void 0 ? void 0 : ingredientsData.length) || 0, 'items');
                setIngredients(ingredientsData || []);
            }
            if (recipesError) {
                console.log('Recipes table not found or empty:', recipesError.message);
                setRecipes([]); // Set empty array instead of showing error
            } else {
                setRecipes(recipesData || []);
            }
        } catch (err) {
            setError('Failed to fetch data');
        } finally{
            setLoading(false);
        }
    };
    const fetchRecipeIngredients = async ()=>{
        if (!selectedRecipe) return;
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipe_ingredients').select('*').eq('recipe_id', selectedRecipe);
            if (error) {
                setError(error.message);
            } else {
                setRecipeIngredients(data || []);
                calculateCOGS(data || []);
            }
        } catch (err) {
            setError('Failed to fetch recipe ingredients');
        }
    };
    const calculateCOGS = (recipeIngredients)=>{
        const calculations = recipeIngredients.map((ri)=>{
            const ingredient = ingredients.find((i)=>i.id === ri.ingredient_id);
            if (!ingredient) return null;
            // Use the correct cost field - prefer cost_per_unit_incl_trim if available, otherwise cost_per_unit
            // Convert cost to the unit being used in the recipe
            const baseCostPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
            const costPerUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertIngredientCost"])(baseCostPerUnit, ingredient.unit || 'g', ri.unit || 'g', ingredient.ingredient_name);
            // Calculate base cost for the quantity used
            const totalCost = ri.quantity * costPerUnit;
            // Get waste and yield percentages
            const wastePercent = ingredient.trim_peel_waste_percentage || 0;
            const yieldPercent = ingredient.yield_percentage || 100;
            // Calculate waste-adjusted cost (if not already included in cost_per_unit_incl_trim)
            let wasteAdjustedCost = totalCost;
            if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
                wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
            }
            // Calculate yield-adjusted cost (final cost per usable portion)
            const yieldAdjustedCost = wasteAdjustedCost * (yieldPercent / 100);
            // Debug logging
            console.log("COGS Calculation for ".concat(ingredient.ingredient_name, ":"), {
                quantity: ri.quantity,
                unit: ri.unit || ingredient.unit,
                costPerUnit,
                totalCost,
                wastePercent,
                yieldPercent,
                wasteAdjustedCost,
                yieldAdjustedCost,
                hasInclTrim: !!ingredient.cost_per_unit_incl_trim
            });
            return {
                recipeId: ri.recipe_id || 'temp',
                ingredientId: ri.ingredient_id,
                ingredientName: ingredient.ingredient_name,
                quantity: ri.quantity,
                unit: ri.unit || ingredient.unit || 'kg',
                costPerUnit,
                totalCost,
                wasteAdjustedCost,
                yieldAdjustedCost
            };
        }).filter(Boolean);
        setCalculations(calculations);
    };
    // Load existing recipe ingredients
    const loadExistingRecipeIngredients = async (recipeId)=>{
        try {
            console.log('Loading ingredients for recipe:', recipeId);
            const { data: recipeIngredients, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipe_ingredients').select("\n          id,\n          quantity,\n          unit,\n          ingredients (\n            id,\n            ingredient_name,\n            cost_per_unit,\n            unit,\n            trim_peel_waste_percentage,\n            yield_percentage\n          )\n        ").eq('recipe_id', recipeId);
            if (error) {
                console.log('Error loading recipe ingredients:', error);
                return;
            }
            console.log('Loaded recipe ingredients:', recipeIngredients);
            // Convert to COGSCalculation format
            const loadedCalculations = recipeIngredients.map((ri)=>{
                const ingredient = ri.ingredients;
                const quantity = ri.quantity;
                // Convert cost to the unit being used in the recipe
                const baseCostPerUnit = ingredient.cost_per_unit;
                const costPerUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertIngredientCost"])(baseCostPerUnit, ingredient.unit || 'g', ri.unit || 'g', ingredient.ingredient_name);
                const totalCost = quantity * costPerUnit;
                // Apply waste and yield adjustments
                const wastePercent = ingredient.trim_peel_waste_percentage || 0;
                const yieldPercent = ingredient.yield_percentage || 100;
                const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
                const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
                return {
                    recipeId: recipeId,
                    ingredientId: ingredient.id,
                    ingredientName: ingredient.ingredient_name,
                    quantity: quantity,
                    unit: ri.unit,
                    costPerUnit: costPerUnit,
                    totalCost: totalCost,
                    wasteAdjustedCost: wasteAdjustedCost,
                    yieldAdjustedCost: yieldAdjustedCost
                };
            });
            console.log('Converted to calculations:', loadedCalculations);
            // Set the calculations to show existing ingredients
            setCalculations(loadedCalculations);
            // Also update recipeIngredients state so new ingredients can be added to existing ones
            const loadedRecipeIngredients = recipeIngredients.map((dbItem)=>({
                    recipe_id: recipeId,
                    ingredient_id: dbItem.ingredients.id,
                    quantity: dbItem.quantity,
                    unit: dbItem.unit
                }));
            setRecipeIngredients(loadedRecipeIngredients);
            // Also set the dish portions from the recipe
            const { data: recipeData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').select('yield').eq('id', recipeId).single();
            if (recipeData) {
                setDishPortions(recipeData.yield || 1);
            }
        } catch (err) {
            console.log('Error in loadExistingRecipeIngredients:', err);
        }
    };
    // Check if recipe exists
    const checkRecipeExists = async (recipeName)=>{
        if (!recipeName.trim()) {
            setRecipeExists(null);
            return;
        }
        setCheckingRecipe(true);
        try {
            console.log('Checking for recipe:', recipeName.trim());
            const { data: existingRecipes, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').select('id, name').ilike('name', recipeName.trim());
            const existingRecipe = existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;
            console.log('Recipe check result:', {
                existingRecipe,
                error
            });
            if (error && error.code === 'PGRST116') {
                // No rows found - recipe doesn't exist
                console.log('Recipe not found - PGRST116 error');
                setRecipeExists(false);
            } else if (existingRecipe) {
                // Recipe exists - load its ingredients
                console.log('Recipe found:', existingRecipe);
                setRecipeExists(true);
                // Load the existing recipe's ingredients
                await loadExistingRecipeIngredients(existingRecipe.id);
            } else {
                console.log('Recipe not found - no data returned');
                setRecipeExists(false);
            }
        } catch (err) {
            console.log('Error checking recipe:', err);
            setRecipeExists(null);
        } finally{
            setCheckingRecipe(false);
        }
    };
    // Debounced recipe check (only for manual dish name entry, not when editing from recipe book)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "COGSPage.useEffect": ()=>{
            const timeoutId = setTimeout({
                "COGSPage.useEffect.timeoutId": ()=>{
                    if (dishName.trim() && !dishNameLocked) {
                        console.log('🔍 DEBUG: Running recipe check for:', dishName);
                        checkRecipeExists(dishName);
                    } else if (!dishName.trim()) {
                        setRecipeExists(null);
                    } else {
                        console.log('🔍 DEBUG: Skipping recipe check - dish name locked (editing from recipe book)');
                    }
                }
            }["COGSPage.useEffect.timeoutId"], 500); // 500ms delay
            return ({
                "COGSPage.useEffect": ()=>clearTimeout(timeoutId)
            })["COGSPage.useEffect"];
        }
    }["COGSPage.useEffect"], [
        dishName,
        dishNameLocked
    ]);
    // Handle editing ingredient quantity
    const handleEditIngredient = (ingredientId, currentQuantity)=>{
        setEditingIngredient(ingredientId);
        setEditQuantity(currentQuantity);
    };
    // Save edited ingredient quantity
    const handleSaveEdit = ()=>{
        if (editingIngredient && editQuantity > 0) {
            setCalculations((prev)=>prev.map((calc)=>{
                    if (calc.ingredientId === editingIngredient) {
                        // Get the original ingredient data to recalculate properly
                        const ingredient = ingredients.find((ing)=>ing.id === editingIngredient);
                        if (ingredient) {
                            const newTotalCost = editQuantity * calc.costPerUnit;
                            const wastePercent = ingredient.trim_peel_waste_percentage || 0;
                            const yieldPercent = ingredient.yield_percentage || 100;
                            const newWasteAdjustedCost = newTotalCost * (1 + wastePercent / 100);
                            const newYieldAdjustedCost = newWasteAdjustedCost / (yieldPercent / 100);
                            return {
                                ...calc,
                                quantity: editQuantity,
                                totalCost: newTotalCost,
                                wasteAdjustedCost: newWasteAdjustedCost,
                                yieldAdjustedCost: newYieldAdjustedCost
                            };
                        }
                    }
                    return calc; // Return unchanged for other ingredients
                }));
        }
        setEditingIngredient(null);
        setEditQuantity(0);
    };
    // Cancel editing
    const handleCancelEdit = ()=>{
        setEditingIngredient(null);
        setEditQuantity(0);
    };
    // Remove ingredient from calculations
    const handleRemoveIngredient = (ingredientId)=>{
        setCalculations((prev)=>prev.filter((calc)=>calc.ingredientId !== ingredientId));
    };
    // Use centralized formatting utility
    const capitalizeRecipeName = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDishName"];
    // Use the comprehensive unit conversion utility from lib/unit-conversion.ts
    const handleSaveAsRecipe = async ()=>{
        if (calculations.length === 0) {
            setError('No calculations to save. Please calculate COGS first.');
            return;
        }
        const rawRecipeName = dishName || prompt('Enter a name for this recipe:');
        if (!rawRecipeName) return;
        const recipeName = capitalizeRecipeName(rawRecipeName);
        try {
            // Check if recipe already exists (case-insensitive)
            const { data: existingRecipes, error: checkError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').select('id, name').ilike('name', recipeName);
            console.log('Recipe check results:', {
                existingRecipes,
                checkError,
                recipeName
            });
            let recipeData;
            const existingRecipe = existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;
            console.log('Existing recipe found:', existingRecipe);
            if (existingRecipe && !checkError) {
                // Recipe exists - update it
                const recipePortions = dishPortions || 1;
                const { data: updatedRecipe, error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').update({
                    yield: recipePortions,
                    yield_unit: 'servings',
                    updated_at: new Date().toISOString()
                }).eq('id', existingRecipe.id).select().single();
                if (updateError) {
                    setError(updateError.message);
                    return;
                }
                recipeData = updatedRecipe;
            } else {
                // Recipe doesn't exist - create new one
                const recipePortions = dishPortions || 1;
                const { data: newRecipe, error: createError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').insert({
                    name: recipeName,
                    yield: recipePortions,
                    yield_unit: 'servings'
                }).select().single();
                if (createError) {
                    setError(createError.message);
                    return;
                }
                recipeData = newRecipe;
            }
            // Handle recipe ingredients
            const recipeIngredientInserts = calculations.map((calc)=>({
                    recipe_id: recipeData.id,
                    ingredient_id: calc.ingredientId,
                    quantity: calc.quantity,
                    unit: calc.unit
                }));
            if (existingRecipe && !checkError) {
                // Recipe exists - replace all ingredients (delete old ones first, then insert new ones)
                // First, delete all existing ingredients for this recipe
                const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipe_ingredients').delete().eq('recipe_id', existingRecipe.id);
                if (deleteError) {
                    setError(deleteError.message);
                    return;
                }
                // Then insert the current ingredients (complete updated recipe)
                const { error: ingredientsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipe_ingredients').insert(recipeIngredientInserts);
                if (ingredientsError) {
                    setError(ingredientsError.message);
                    return;
                }
            } else {
                // New recipe - insert all ingredients
                const { error: ingredientsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipe_ingredients').insert(recipeIngredientInserts);
                if (ingredientsError) {
                    setError(ingredientsError.message);
                    return;
                }
            }
            // Clear any existing error and show success message
            setError(null);
            const actionText = existingRecipe && !checkError ? 'updated' : 'saved';
            setSuccessMessage('Recipe "'.concat(recipeName, '" ').concat(actionText, " successfully to Recipe Book!"));
            // Unlock dish name after successful save
            setDishNameLocked(false);
            // Clear success message after 5 seconds
            setTimeout(()=>setSuccessMessage(null), 5000);
            // Refresh recipes list (don't let this error affect the success message)
            try {
                await fetchData();
            } catch (fetchErr) {
                console.log('Failed to refresh recipes list:', fetchErr);
            // Don't show error for this - the recipe was saved successfully
            }
        } catch (err) {
            console.log('Recipe save error:', err);
            setError('Failed to save recipe');
            setSuccessMessage(null); // Clear any success message if there was an error
            setDishNameLocked(false); // Unlock dish name on error
        }
    };
    // Pricing Calculation Functions
    const calculateRecommendedPrices = (foodCost, targetGP)=>{
        // Calculate sell price excluding GST based on target gross profit
        // GP% = (Sell Price - Food Cost) / Sell Price * 100
        // Solving for Sell Price: Sell Price = Food Cost / (1 - GP/100)
        const sellPriceExclGST = foodCost / (1 - targetGP / 100);
        // Calculate GST (10% in Australia) on the base price
        const gstAmount = sellPriceExclGST * 0.10;
        const sellPriceInclGST = sellPriceExclGST + gstAmount;
        // Apply pricing strategy to the GST-inclusive price (menu price)
        let finalPriceInclGST = sellPriceInclGST;
        switch(pricingStrategy){
            case 'charm':
                // Charm pricing: round to .95 or .99
                const charmRounded = Math.ceil(sellPriceInclGST);
                finalPriceInclGST = charmRounded - 0.01;
                break;
            case 'whole':
                // Whole number pricing: round up to nearest dollar
                finalPriceInclGST = Math.ceil(sellPriceInclGST);
                break;
            case 'real':
                // Real price: keep exact calculation
                finalPriceInclGST = sellPriceInclGST;
                break;
        }
        // Calculate the GST-exclusive price from the final menu price
        const finalPriceExclGST = finalPriceInclGST / 1.10;
        const finalGstAmount = finalPriceInclGST - finalPriceExclGST;
        // Calculate contributing margin (Revenue - Food Cost)
        const contributingMargin = finalPriceExclGST - foodCost;
        const contributingMarginPercent = contributingMargin / finalPriceExclGST * 100;
        return {
            sellPriceExclGST: finalPriceExclGST,
            sellPriceInclGST: finalPriceInclGST,
            gstAmount: finalGstAmount,
            actualGrossProfit: (finalPriceExclGST - foodCost) / finalPriceExclGST * 100,
            grossProfitDollar: finalPriceExclGST - foodCost,
            contributingMargin: contributingMargin,
            contributingMarginPercent: contributingMarginPercent
        };
    };
    const handleIngredientSelect = (ingredient)=>{
        console.log('Ingredient selected:', ingredient.ingredient_name);
        setSelectedIngredient(ingredient);
        setNewIngredient({
            ...newIngredient,
            ingredient_id: ingredient.id,
            unit: ingredient.unit || 'kg'
        });
        setIngredientSearch(ingredient.ingredient_name);
        setShowSuggestions(false);
    };
    const handleSearchChange = (value)=>{
        setIngredientSearch(value);
        setShowSuggestions(value.length > 0);
        setSelectedIngredient(null);
        setNewIngredient({
            ...newIngredient,
            ingredient_id: ''
        });
    };
    const handleAddIngredient = async (e)=>{
        e.preventDefault();
        if (!newIngredient.ingredient_id || !newIngredient.quantity) {
            setError('Please select an ingredient and enter a quantity');
            return;
        }
        try {
            // Check if ingredient already exists
            const existingIngredient = recipeIngredients.find((ri)=>ri.ingredient_id === newIngredient.ingredient_id);
            if (existingIngredient) {
                // Update existing ingredient quantity with automatic unit conversion
                const selectedIngredientData = ingredients.find((ing)=>ing.id === newIngredient.ingredient_id);
                if (selectedIngredientData) {
                    // Automatic unit conversion: convert user input to ingredient's base unit
                    let convertedQuantity = newIngredient.quantity;
                    let convertedUnit = newIngredient.unit || 'kg';
                    let conversionNote = '';
                    // If user entered volume units but ingredient is measured by weight (or vice versa)
                    const userUnit = (newIngredient.unit || 'kg').toLowerCase().trim();
                    const ingredientUnit = (selectedIngredientData.unit || 'kg').toLowerCase().trim();
                    // Volume units
                    const volumeUnits = [
                        'tsp',
                        'teaspoon',
                        'tbsp',
                        'tablespoon',
                        'cup',
                        'cups',
                        'ml',
                        'milliliter',
                        'l',
                        'liter',
                        'litre',
                        'fl oz',
                        'fluid ounce'
                    ];
                    // Weight units  
                    const weightUnits = [
                        'g',
                        'gm',
                        'gram',
                        'grams',
                        'kg',
                        'kilogram',
                        'oz',
                        'ounce',
                        'lb',
                        'pound',
                        'mg',
                        'milligram'
                    ];
                    const isUserVolume = volumeUnits.includes(userUnit);
                    const isUserWeight = weightUnits.includes(userUnit);
                    const isIngredientVolume = volumeUnits.includes(ingredientUnit);
                    const isIngredientWeight = weightUnits.includes(ingredientUnit);
                    // Convert if there's a mismatch between user input and ingredient base unit
                    if (isUserVolume && isIngredientWeight || isUserWeight && isIngredientVolume) {
                        const conversionResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertUnit"])(newIngredient.quantity, newIngredient.unit || 'kg', selectedIngredientData.unit || 'kg', selectedIngredientData.ingredient_name);
                        convertedQuantity = conversionResult.convertedValue;
                        convertedUnit = conversionResult.convertedUnit;
                        conversionNote = " (converted from ".concat(newIngredient.quantity, " ").concat(newIngredient.unit || 'kg', ")");
                    }
                    setRecipeIngredients((prev)=>prev.map((ri)=>ri.ingredient_id === newIngredient.ingredient_id ? {
                                ...ri,
                                quantity: ri.quantity + convertedQuantity
                            } : ri));
                    // Also update the calculations state to reflect the new quantity
                    setCalculations((prev)=>prev.map((calc)=>{
                            if (calc.ingredientId === newIngredient.ingredient_id) {
                                const newQuantity = calc.quantity + convertedQuantity;
                                const newTotalCost = newQuantity * calc.costPerUnit;
                                const newWasteAdjustedCost = newTotalCost * (1 + (calc.wasteAdjustedCost / calc.totalCost - 1));
                                const newYieldAdjustedCost = newWasteAdjustedCost / (calc.yieldAdjustedCost / calc.wasteAdjustedCost);
                                return {
                                    ...calc,
                                    ingredientName: calc.ingredientName.includes('(converted from') ? calc.ingredientName : calc.ingredientName + conversionNote,
                                    quantity: newQuantity,
                                    totalCost: newTotalCost,
                                    wasteAdjustedCost: newWasteAdjustedCost,
                                    yieldAdjustedCost: newYieldAdjustedCost
                                };
                            }
                            return calc;
                        }));
                }
            } else {
                // Add new ingredient with automatic unit conversion
                const selectedIngredientData = ingredients.find((ing)=>ing.id === newIngredient.ingredient_id);
                if (selectedIngredientData) {
                    // Automatic unit conversion: convert user input to ingredient's base unit
                    let convertedQuantity = newIngredient.quantity;
                    let convertedUnit = newIngredient.unit || 'kg';
                    let conversionNote = '';
                    // If user entered volume units but ingredient is measured by weight (or vice versa)
                    const userUnit = (newIngredient.unit || 'kg').toLowerCase().trim();
                    const ingredientUnit = (selectedIngredientData.unit || 'kg').toLowerCase().trim();
                    // Volume units
                    const volumeUnits = [
                        'tsp',
                        'teaspoon',
                        'tbsp',
                        'tablespoon',
                        'cup',
                        'cups',
                        'ml',
                        'milliliter',
                        'l',
                        'liter',
                        'litre',
                        'fl oz',
                        'fluid ounce'
                    ];
                    // Weight units  
                    const weightUnits = [
                        'g',
                        'gm',
                        'gram',
                        'grams',
                        'kg',
                        'kilogram',
                        'oz',
                        'ounce',
                        'lb',
                        'pound',
                        'mg',
                        'milligram'
                    ];
                    const isUserVolume = volumeUnits.includes(userUnit);
                    const isUserWeight = weightUnits.includes(userUnit);
                    const isIngredientVolume = volumeUnits.includes(ingredientUnit);
                    const isIngredientWeight = weightUnits.includes(ingredientUnit);
                    // Convert if there's a mismatch between user input and ingredient base unit
                    if (isUserVolume && isIngredientWeight || isUserWeight && isIngredientVolume) {
                        const conversionResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertUnit"])(newIngredient.quantity, newIngredient.unit || 'kg', selectedIngredientData.unit || 'kg', selectedIngredientData.ingredient_name);
                        convertedQuantity = conversionResult.convertedValue;
                        convertedUnit = conversionResult.convertedUnit;
                        conversionNote = " (converted from ".concat(newIngredient.quantity, " ").concat(newIngredient.unit || 'kg', ")");
                    }
                    const ingredientToAdd = {
                        recipe_id: selectedRecipe || 'temp',
                        ingredient_id: newIngredient.ingredient_id,
                        quantity: convertedQuantity,
                        unit: convertedUnit
                    };
                    setRecipeIngredients((prev)=>[
                            ...prev,
                            ingredientToAdd
                        ]);
                    // Also add to calculations state for immediate UI update
                    const quantity = convertedQuantity;
                    // Convert cost to the unit being used in the recipe
                    const baseCostPerUnit = selectedIngredientData.cost_per_unit;
                    const costPerUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertIngredientCost"])(baseCostPerUnit, selectedIngredientData.unit || 'g', convertedUnit, selectedIngredientData.ingredient_name);
                    const totalCost = quantity * costPerUnit;
                    // Apply waste and yield adjustments
                    const wastePercent = selectedIngredientData.trim_peel_waste_percentage || 0;
                    const yieldPercent = selectedIngredientData.yield_percentage || 100;
                    const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
                    const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
                    const newCalculation = {
                        recipeId: selectedRecipe || 'temp',
                        ingredientId: newIngredient.ingredient_id,
                        ingredientName: selectedIngredientData.ingredient_name + conversionNote,
                        quantity: quantity,
                        unit: convertedUnit,
                        costPerUnit: costPerUnit,
                        totalCost: totalCost,
                        wasteAdjustedCost: wasteAdjustedCost,
                        yieldAdjustedCost: yieldAdjustedCost
                    };
                    setCalculations((prev)=>[
                            ...prev,
                            newCalculation
                        ]);
                }
            }
            // Reset form
            setNewIngredient({
                ingredient_id: '',
                quantity: 0,
                unit: 'kg'
            });
            setIngredientSearch('');
            setSelectedIngredient(null);
            setShowSuggestions(false);
        } catch (err) {
            setError('Failed to add ingredient');
        }
    };
    const totalCOGS = calculations.reduce((sum, calc)=>sum + calc.yieldAdjustedCost, 0);
    const costPerPortion = dishPortions > 0 ? totalCOGS / dishPortions : 0;
    // Calculate pricing when COGS changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "COGSPage.useEffect": ()=>{
            if (costPerPortion > 0) {
                const pricing = calculateRecommendedPrices(costPerPortion, targetGrossProfit);
                setSellPriceExclGST(pricing.sellPriceExclGST);
                setSellPriceInclGST(pricing.sellPriceInclGST);
            }
        }
    }["COGSPage.useEffect"], [
        costPerPortion,
        targetGrossProfit,
        pricingStrategy
    ]);
    // Live search with Material Design 3 guidelines - instant filtering
    const filteredIngredients = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "COGSPage.useMemo[filteredIngredients]": ()=>{
            console.log('Filtering ingredients:', ingredients.length, 'total, search:', ingredientSearch);
            if (!ingredientSearch.trim()) {
                const result = ingredients.slice(0, 50); // Show first 50 ingredients when no search
                console.log('No search term, returning first 50:', result.length);
                return result;
            }
            const searchTerm = ingredientSearch.toLowerCase().trim();
            const filtered = ingredients.filter({
                "COGSPage.useMemo[filteredIngredients].filtered": (ingredient)=>ingredient.ingredient_name.toLowerCase().includes(searchTerm) || ingredient.unit && ingredient.unit.toLowerCase().includes(searchTerm)
            }["COGSPage.useMemo[filteredIngredients].filtered"]).sort({
                "COGSPage.useMemo[filteredIngredients].filtered": (a, b)=>{
                    // Prioritize exact matches and starts-with matches
                    const aName = a.ingredient_name.toLowerCase();
                    const bName = b.ingredient_name.toLowerCase();
                    if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
                    if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) return 1;
                    if (aName === searchTerm && bName !== searchTerm) return -1;
                    if (aName !== searchTerm && bName === searchTerm) return 1;
                    return aName.localeCompare(bName);
                }
            }["COGSPage.useMemo[filteredIngredients].filtered"]).slice(0, 20); // Limit to 20 results for performance
            console.log('Search results:', filtered.length, 'matches for', searchTerm);
            return filtered;
        }
    }["COGSPage.useMemo[filteredIngredients]"], [
        ingredients,
        ingredientSearch
    ]);
    // Debug suggestions visibility
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "COGSPage.useEffect": ()=>{
            console.log('Suggestions state:', {
                showSuggestions,
                ingredientSearch,
                filteredIngredientsCount: filteredIngredients.length,
                ingredientsCount: ingredients.length
            });
        }
    }["COGSPage.useEffect"], [
        showSuggestions,
        ingredientSearch,
        filteredIngredients.length,
        ingredients.length
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#0a0a0a] p-4 sm:p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 bg-[#2a2a2a] rounded-3xl w-1/2 mb-8"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 893,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                ...Array(3)
                            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 bg-[#2a2a2a] rounded-xl w-3/4 mb-3"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 897,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-3 bg-[#2a2a2a] rounded-xl w-1/2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 898,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                    lineNumber: 896,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 894,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/cogs/page.tsx",
                    lineNumber: 892,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/cogs/page.tsx",
                lineNumber: 891,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/webapp/cogs/page.tsx",
            lineNumber: 890,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] p-4 sm:p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold text-white mb-2",
                            children: "💰 COGS Calculator"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 913,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "Calculate Cost of Goods Sold and optimize your profit margins"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 916,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/cogs/page.tsx",
                    lineNumber: 912,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/webapp/cogs/page.tsx",
                    lineNumber: 920,
                    columnNumber: 9
                }, this),
                successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-green-400 text-white px-6 py-5 rounded-2xl mb-6 shadow-2xl animate-in slide-in-from-top-2 duration-500 transform scale-105 hover:scale-110 transition-all duration-300",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6 text-white",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 3,
                                            d: "M5 13l4 4L19 7"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 931,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                        lineNumber: 930,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                    lineNumber: 929,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                lineNumber: 928,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-lg text-white",
                                        children: successMessage
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                        lineNumber: 936,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-green-100 mt-1 font-medium",
                                        children: "🎉 Your recipe has been added to the Recipe Book and is ready to use!"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                        lineNumber: 937,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                lineNumber: 935,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSuccessMessage(null),
                                className: "flex-shrink-0 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200",
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
                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                        lineNumber: 944,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                    lineNumber: 943,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                lineNumber: 939,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/cogs/page.tsx",
                        lineNumber: 927,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/cogs/page.tsx",
                    lineNumber: 926,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg sm:text-xl font-semibold mb-6",
                                    children: "Create Dish"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                    lineNumber: 954,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "🍽️ Dish Name"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 958,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "Enter dish name (e.g., Chicken Curry)",
                                                    value: dishName,
                                                    onChange: (e)=>setDishName(capitalizeRecipeName(e.target.value)),
                                                    disabled: dishNameLocked,
                                                    className: "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ".concat(dishNameLocked ? 'border-blue-400 bg-[#1a1a1a] text-gray-300 cursor-not-allowed' : recipeExists === true ? 'border-orange-400 bg-[#0a0a0a] text-white focus:ring-orange-400 focus:border-orange-400' : recipeExists === false ? 'border-green-400 bg-[#0a0a0a] text-white focus:ring-green-400 focus:border-green-400' : 'border-[#2a2a2a] bg-[#0a0a0a] text-white focus:ring-[#29E7CD] focus:border-[#29E7CD]')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 962,
                                                    columnNumber: 13
                                                }, this),
                                                dishNameLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-3 top-1/2 transform -translate-y-1/2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-5 h-5 text-blue-400",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        viewBox: "0 0 24 24",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 981,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 980,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 979,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 961,
                                            columnNumber: 13
                                        }, this),
                                        dishName.trim() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 flex items-center space-x-2",
                                            children: checkingRecipe ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2 text-gray-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 992,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm",
                                                        children: "Checking..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 993,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                lineNumber: 991,
                                                columnNumber: 19
                                            }, this) : recipeExists === true ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2 text-orange-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-4 h-4",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        viewBox: "0 0 24 24",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 998,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 997,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium",
                                                        children: "⚠️ Recipe exists - ingredients loaded, will update existing recipe"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1000,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                lineNumber: 996,
                                                columnNumber: 19
                                            }, this) : recipeExists === false ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2 text-green-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-4 h-4",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        viewBox: "0 0 24 24",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M5 13l4 4L19 7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1005,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1004,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium",
                                                        children: "✅ New recipe - will create new recipe"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1007,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                lineNumber: 1003,
                                                columnNumber: 19
                                            }, this) : null
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 989,
                                            columnNumber: 15
                                        }, this),
                                        dishNameLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 flex items-center space-x-2 text-blue-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-4 h-4",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1017,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1016,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-medium",
                                                    children: "🔒 Dish name locked - editing ingredients"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1019,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 1015,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                    lineNumber: 957,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 rounded-2xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-xl font-semibold text-white mb-1",
                                                                    children: "🥘 Add Ingredients"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1030,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-400",
                                                                    children: "Add ingredients manually to build your dish"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1031,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-[#29E7CD] mt-1",
                                                                    children: "✨ Automatic unit conversion: Use any unit (tsp, tbsp, cups, ml, g, kg) - we'll convert to the ingredient's base unit!"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1032,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1029,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                setShowAddIngredient(!showAddIngredient);
                                                                // Lock dish name when starting to add ingredients
                                                                if (!showAddIngredient && dishName.trim()) {
                                                                    setDishNameLocked(true);
                                                                }
                                                                // Unlock dish name when canceling add ingredient
                                                                if (showAddIngredient) {
                                                                    setDishNameLocked(false);
                                                                }
                                                            },
                                                            className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-4 h-4",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1049,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1048,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: showAddIngredient ? 'Cancel' : 'Add Ingredient'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1051,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1034,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1028,
                                                    columnNumber: 13
                                                }, this),
                                                showAddIngredient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                    onSubmit: handleAddIngredient,
                                                    className: "space-y-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative ingredient-search-container",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                                    children: "🔍 Search & Select Ingredient"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1058,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            placeholder: "Type to search ingredients...",
                                                                            value: ingredientSearch,
                                                                            onChange: (e)=>handleSearchChange(e.target.value),
                                                                            onFocus: ()=>setShowSuggestions(ingredientSearch.length > 0),
                                                                            className: "w-full max-w-md pl-10 pr-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1062,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                className: "h-5 w-5 text-gray-400",
                                                                                fill: "none",
                                                                                stroke: "currentColor",
                                                                                viewBox: "0 0 24 24",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    strokeLinecap: "round",
                                                                                    strokeLinejoin: "round",
                                                                                    strokeWidth: 2,
                                                                                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1072,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1071,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1070,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        ingredientSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleSearchChange(''),
                                                                            className: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                className: "h-5 w-5",
                                                                                fill: "none",
                                                                                stroke: "currentColor",
                                                                                viewBox: "0 0 24 24",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    strokeLinecap: "round",
                                                                                    strokeLinejoin: "round",
                                                                                    strokeWidth: 2,
                                                                                    d: "M6 18L18 6M6 6l12 12"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1081,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1080,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1076,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1061,
                                                                    columnNumber: 21
                                                                }, this),
                                                                ingredientSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-2 text-xs text-gray-400",
                                                                    children: [
                                                                        filteredIngredients.length,
                                                                        " ingredient",
                                                                        filteredIngredients.length !== 1 ? 's' : '',
                                                                        " found"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1087,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1057,
                                                            columnNumber: 19
                                                        }, this),
                                                        showSuggestions && filteredIngredients.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute z-10 w-full max-w-md mt-1 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-lg max-h-60 overflow-y-auto suggestions-dropdown",
                                                            children: filteredIngredients.slice(0, 10).map((ingredient)=>{
                                                                const displayCost = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: (e)=>{
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        console.log('Button clicked for:', ingredient.ingredient_name);
                                                                        handleIngredientSelect(ingredient);
                                                                    },
                                                                    className: "w-full px-4 py-3 text-left hover:bg-[#2a2a2a] transition-colors border-b border-[#2a2a2a] last:border-b-0",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-white font-medium",
                                                                                        children: ingredient.ingredient_name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1111,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs text-gray-400",
                                                                                        children: [
                                                                                            ingredient.unit && "".concat(ingredient.unit, " • "),
                                                                                            "$",
                                                                                            displayCost.toFixed(2),
                                                                                            "/",
                                                                                            ingredient.unit || 'unit'
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1112,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1110,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[#29E7CD] text-sm",
                                                                                children: ingredient.trim_peel_waste_percentage ? "".concat(ingredient.trim_peel_waste_percentage, "% waste") : 'No waste'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1117,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1109,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, ingredient.id, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1098,
                                                                    columnNumber: 27
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1094,
                                                            columnNumber: 21
                                                        }, this),
                                                        showSuggestions && filteredIngredients.length === 0 && ingredientSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute z-10 w-full mt-1 p-3 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-lg",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-400 text-center",
                                                                    children: [
                                                                        '🔍 No ingredients found matching "',
                                                                        ingredientSearch,
                                                                        '"'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1130,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-gray-500 text-center mt-1",
                                                                    children: "Try a different search term or add the ingredient to your list first"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1133,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1129,
                                                            columnNumber: 21
                                                        }, this),
                                                        selectedIngredient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 p-3 bg-[#29E7CD]/10 border border-[#29E7CD]/20 rounded-lg",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[#29E7CD] font-medium",
                                                                                children: [
                                                                                    "✓ ",
                                                                                    selectedIngredient.ingredient_name
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1144,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-xs text-gray-400",
                                                                                children: [
                                                                                    "$",
                                                                                    (selectedIngredient.cost_per_unit_incl_trim || selectedIngredient.cost_per_unit || 0).toFixed(2),
                                                                                    "/",
                                                                                    selectedIngredient.unit || 'unit'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1145,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1143,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleSearchChange(''),
                                                                        className: "text-gray-400 hover:text-white transition-colors",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "h-4 w-4",
                                                                            fill: "none",
                                                                            stroke: "currentColor",
                                                                            viewBox: "0 0 24 24",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                strokeLinecap: "round",
                                                                                strokeLinejoin: "round",
                                                                                strokeWidth: 2,
                                                                                d: "M6 18L18 6M6 6l12 12"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1155,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1154,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1149,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1142,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1141,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                                                            children: "⚖️ Quantity"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1163,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            step: "0.01",
                                                                            min: "0",
                                                                            required: true,
                                                                            value: newIngredient.quantity,
                                                                            onChange: (e)=>setNewIngredient({
                                                                                    ...newIngredient,
                                                                                    quantity: parseFloat(e.target.value)
                                                                                }),
                                                                            onFocus: (e)=>{
                                                                                // Clear the field if it's 0 when focused
                                                                                if (newIngredient.quantity === 0) {
                                                                                    e.target.select(); // Select all text so user can type over it
                                                                                }
                                                                            },
                                                                            className: "w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md",
                                                                            placeholder: "0.00"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1166,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1162,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                                                            children: "📏 Unit"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1184,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "relative",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                    value: newIngredient.unit,
                                                                                    onChange: (e)=>setNewIngredient({
                                                                                            ...newIngredient,
                                                                                            unit: e.target.value
                                                                                        }),
                                                                                    className: "w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "kg",
                                                                                            children: "kg"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1193,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "g",
                                                                                            children: "g"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1194,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "L",
                                                                                            children: "L"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1195,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "mL",
                                                                                            children: "mL"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1196,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "pcs",
                                                                                            children: "pcs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1197,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "box",
                                                                                            children: "box"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1198,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "GM",
                                                                                            children: "GM"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1199,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "PC",
                                                                                            children: "PC"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1200,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "PACK",
                                                                                            children: "PACK"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1201,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "BAG",
                                                                                            children: "BAG"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1202,
                                                                                            columnNumber: 27
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1188,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                        className: "h-5 w-5 text-gray-400",
                                                                                        fill: "none",
                                                                                        stroke: "currentColor",
                                                                                        viewBox: "0 0 24 24",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                            strokeLinecap: "round",
                                                                                            strokeLinejoin: "round",
                                                                                            strokeWidth: 2,
                                                                                            d: "M19 9l-7 7-7-7"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1206,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1205,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1204,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1187,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1183,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1161,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "submit",
                                                            className: "w-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-6 py-3 rounded-xl hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center space-x-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1217,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1216,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Add Ingredient to Dish"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1219,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1212,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1056,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 1027,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 pt-4 border-t border-[#2a2a2a]/50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-gradient-to-r from-[#D925C7]/10 to-[#29E7CD]/10 border border-[#D925C7]/30 p-4 rounded-2xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-xl font-semibold text-white mb-1",
                                                                children: "📚 Or Select Existing Recipe"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1229,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-400",
                                                                children: "Choose a recipe to load ingredients automatically"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1230,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1228,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: selectedRecipe,
                                                        onChange: (e)=>setSelectedRecipe(e.target.value),
                                                        className: "w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D925C7] focus:border-[#D925C7] transition-all duration-200 shadow-sm hover:shadow-md",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Create new dish from scratch..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1237,
                                                                columnNumber: 19
                                                            }, this),
                                                            recipes.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: recipe.id,
                                                                    children: recipe.name
                                                                }, recipe.id, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1239,
                                                                    columnNumber: 21
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1232,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                lineNumber: 1227,
                                                columnNumber: 15
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 1226,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 pt-4 border-t border-[#2a2a2a]/50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "🍽️ Number of Portions"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1249,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            min: "1",
                                                            placeholder: "1",
                                                            value: dishPortions,
                                                            onChange: (e)=>setDishPortions(Number(e.target.value)),
                                                            className: "w-24 px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md text-center font-semibold"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1253,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-gray-400",
                                                            children: "portions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1261,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1252,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-2",
                                                    children: "This determines the cost per portion for your pricing calculations"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1263,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 1248,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                    lineNumber: 1026,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 953,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg sm:text-xl font-semibold mb-4",
                                    children: "Cost Analysis"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                    lineNumber: 1272,
                                    columnNumber: 11
                                }, this),
                                calculations.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "block md:hidden",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: calculations.map((calc, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-start mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-sm font-medium text-white",
                                                                        children: calc.ingredientName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1282,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center space-x-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm font-bold text-[#29E7CD]",
                                                                                children: [
                                                                                    "$",
                                                                                    calc.yieldAdjustedCost.toFixed(2)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1286,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>handleEditIngredient(calc.ingredientId, calc.quantity),
                                                                                className: "p-1 text-gray-400 hover:text-[#29E7CD] transition-colors duration-200",
                                                                                title: "Edit quantity",
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
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1295,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1294,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1289,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>handleRemoveIngredient(calc.ingredientId),
                                                                                className: "p-1 text-gray-400 hover:text-red-400 transition-colors duration-200",
                                                                                title: "Remove ingredient",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1304,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1303,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1298,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1285,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1281,
                                                                columnNumber: 23
                                                            }, this),
                                                            editingIngredient === calc.ingredientId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center space-x-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                value: editQuantity,
                                                                                onChange: (e)=>setEditQuantity(parseFloat(e.target.value) || 0),
                                                                                className: "w-20 px-2 py-1 text-sm border border-[#3a3a3a] bg-[#0a0a0a] text-white rounded focus:outline-none focus:ring-1 focus:ring-[#29E7CD]",
                                                                                step: "0.1",
                                                                                min: "0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1312,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-gray-400",
                                                                                children: calc.unit
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1320,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1311,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex space-x-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: handleSaveEdit,
                                                                                className: "px-3 py-1 text-xs bg-[#29E7CD] text-white rounded hover:bg-[#29E7CD]/80 transition-colors duration-200",
                                                                                children: "Save"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1323,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: handleCancelEdit,
                                                                                className: "px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors duration-200",
                                                                                children: "Cancel"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1329,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1322,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1310,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-400",
                                                                children: [
                                                                    calc.quantity,
                                                                    " ",
                                                                    calc.unit
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1338,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1280,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                lineNumber: 1278,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 1277,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hidden md:block overflow-x-auto",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "min-w-full divide-y divide-gray-200",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        className: "bg-gray-50",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase",
                                                                    children: "Ingredient"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1352,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase",
                                                                    children: "Qty"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1355,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase",
                                                                    children: "Cost"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1358,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase",
                                                                    children: "Actions"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                    lineNumber: 1361,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1351,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1350,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        className: "bg-[#1f1f1f] divide-y divide-gray-200",
                                                        children: calculations.map((calc, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "hover:bg-[#2a2a2a]/50 transition-colors duration-200",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-2 text-sm text-white",
                                                                        children: calc.ingredientName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1369,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-2 text-sm text-gray-500",
                                                                        children: editingIngredient === calc.ingredientId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center space-x-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    value: editQuantity,
                                                                                    onChange: (e)=>setEditQuantity(parseFloat(e.target.value) || 0),
                                                                                    className: "w-20 px-2 py-1 text-sm border border-[#3a3a3a] bg-[#0a0a0a] text-white rounded focus:outline-none focus:ring-1 focus:ring-[#29E7CD]",
                                                                                    step: "0.1",
                                                                                    min: "0"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1375,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs text-gray-400",
                                                                                    children: calc.unit
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1383,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1374,
                                                                            columnNumber: 29
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                calc.quantity,
                                                                                " ",
                                                                                calc.unit
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1386,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1372,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-2 text-sm text-gray-500",
                                                                        children: [
                                                                            "$",
                                                                            calc.yieldAdjustedCost.toFixed(2)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1389,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-2 text-sm",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center space-x-2",
                                                                            children: editingIngredient === calc.ingredientId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: handleSaveEdit,
                                                                                        className: "px-2 py-1 text-xs bg-[#29E7CD] text-white rounded hover:bg-[#29E7CD]/80 transition-colors duration-200",
                                                                                        children: "Save"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1396,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: handleCancelEdit,
                                                                                        className: "px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors duration-200",
                                                                                        children: "Cancel"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1402,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>handleEditIngredient(calc.ingredientId, calc.quantity),
                                                                                        className: "p-1 text-gray-400 hover:text-[#29E7CD] transition-colors duration-200",
                                                                                        title: "Edit quantity",
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
                                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                                lineNumber: 1417,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1416,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1411,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>handleRemoveIngredient(calc.ingredientId),
                                                                                        className: "p-1 text-gray-400 hover:text-red-400 transition-colors duration-200",
                                                                                        title: "Remove ingredient",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
                                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                                lineNumber: 1426,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1425,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1420,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1393,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1392,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, index, true, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1368,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1366,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                lineNumber: 1349,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 1348,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-t pt-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg font-medium text-white",
                                                            children: "Total COGS:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1441,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg font-bold text-[#29E7CD]",
                                                            children: [
                                                                "$",
                                                                totalCOGS.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1442,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1440,
                                                    columnNumber: 17
                                                }, this),
                                                dishPortions > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-gray-400",
                                                            children: "Cost per portion:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1448,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-medium text-white",
                                                            children: [
                                                                "$",
                                                                costPerPortion.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1449,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1447,
                                                    columnNumber: 19
                                                }, this),
                                                costPerPortion > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-6 pt-4 border-t border-[#2a2a2a]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-lg font-semibold text-white mb-3 flex items-center",
                                                                children: [
                                                                    "💰 Costing Tool",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "ml-2 w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1461,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1459,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                                                        children: "🎯 Target Gross Profit %"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1466,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex space-x-2",
                                                                        children: [
                                                                            60,
                                                                            65,
                                                                            70,
                                                                            75,
                                                                            80
                                                                        ].map((gp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setTargetGrossProfit(gp),
                                                                                className: "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ".concat(targetGrossProfit === gp ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'),
                                                                                children: [
                                                                                    gp,
                                                                                    "%"
                                                                                ]
                                                                            }, gp, true, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1471,
                                                                                columnNumber: 29
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1469,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1465,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                                                        children: "📊 Pricing Strategy"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1488,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-3 gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setPricingStrategy('charm'),
                                                                                className: "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ".concat(pricingStrategy === 'charm' ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'),
                                                                                children: "Charm ($19.95)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1492,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setPricingStrategy('whole'),
                                                                                className: "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ".concat(pricingStrategy === 'whole' ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'),
                                                                                children: "Whole ($20)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1502,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setPricingStrategy('real'),
                                                                                className: "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ".concat(pricingStrategy === 'real' ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'),
                                                                                children: "Real ($19.47)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1512,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1491,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1487,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 rounded-2xl",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs text-gray-500 uppercase tracking-wide mb-1",
                                                                                        children: "Food Cost"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1531,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xl font-bold text-white",
                                                                                        children: [
                                                                                            "$",
                                                                                            costPerPortion.toFixed(2)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1532,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs text-gray-400",
                                                                                        children: "per portion"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1535,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1530,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs text-gray-500 uppercase tracking-wide mb-1",
                                                                                        children: "Sell Price (Excl GST)"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1540,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xl font-bold text-[#29E7CD]",
                                                                                        children: [
                                                                                            "$",
                                                                                            sellPriceExclGST.toFixed(2)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1541,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs text-gray-400",
                                                                                        children: "for your records"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1544,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1539,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs text-gray-500 uppercase tracking-wide mb-1",
                                                                                        children: "Menu Price (Incl GST)"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1549,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xl font-bold text-[#D925C7]",
                                                                                        children: [
                                                                                            "$",
                                                                                            sellPriceInclGST.toFixed(2)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1550,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs text-gray-400",
                                                                                        children: "what customer pays"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1553,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1548,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs text-gray-500 uppercase tracking-wide mb-1",
                                                                                        children: "Gross Profit"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1558,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xl font-bold text-green-400",
                                                                                        children: [
                                                                                            "$",
                                                                                            (sellPriceExclGST - costPerPortion).toFixed(2)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1559,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs text-gray-400",
                                                                                        children: [
                                                                                            ((sellPriceExclGST - costPerPortion) / sellPriceExclGST * 100).toFixed(1),
                                                                                            "% margin"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                        lineNumber: 1562,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                lineNumber: 1557,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1528,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-4 pt-4 border-t border-[#2a2a2a]/50",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "bg-gradient-to-br from-[#D925C7]/20 to-[#29E7CD]/20 p-3 rounded-xl border border-[#D925C7]/30",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-xs text-gray-500 uppercase tracking-wide mb-1",
                                                                                            children: "Contributing Margin"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1573,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-xl font-bold text-[#D925C7]",
                                                                                            children: [
                                                                                                "$",
                                                                                                (sellPriceExclGST - costPerPortion).toFixed(2)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1574,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-xs text-gray-400",
                                                                                            children: [
                                                                                                ((sellPriceExclGST - costPerPortion) / sellPriceExclGST * 100).toFixed(1),
                                                                                                "% of revenue"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1577,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1572,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-xs text-gray-500 uppercase tracking-wide mb-1",
                                                                                            children: "Formula"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1584,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-sm text-gray-400",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                className: "text-[#D925C7]",
                                                                                                children: "Revenue - Food Cost"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                                lineNumber: 1586,
                                                                                                columnNumber: 33
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1585,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-xs text-gray-500 mt-1",
                                                                                            children: "Amount available to cover fixed costs and generate profit"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                            lineNumber: 1588,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1583,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1570,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1569,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-4 pt-3 border-t border-[#2a2a2a]/50",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex justify-between items-center text-sm",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-gray-400",
                                                                                    children: "GST Amount (10%):"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1598,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-white font-medium",
                                                                                    children: [
                                                                                        "$",
                                                                                        (sellPriceInclGST - sellPriceExclGST).toFixed(2)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                                    lineNumber: 1599,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                            lineNumber: 1597,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                        lineNumber: 1596,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/cogs/page.tsx",
                                                                lineNumber: 1527,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/cogs/page.tsx",
                                                        lineNumber: 1458,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1457,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 pt-4 border-t border-[#2a2a2a]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleSaveAsRecipe,
                                                            className: "w-full bg-gradient-to-r from-[#D925C7] to-[#29E7CD] text-white px-4 py-3 rounded-lg hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium",
                                                            children: "💾 Save as Recipe in Recipe Book"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1611,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-400 mt-2 text-center",
                                                            children: "This will save the current COGS calculation as a recipe in your Recipe Book"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                                            lineNumber: 1617,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                                    lineNumber: 1610,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/cogs/page.tsx",
                                            lineNumber: 1439,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                    lineNumber: 1275,
                                    columnNumber: 13
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8 text-gray-500",
                                    children: selectedRecipe ? 'No ingredients added to this recipe yet.' : 'Select a recipe to calculate COGS.'
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/cogs/page.tsx",
                                    lineNumber: 1624,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 1271,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/cogs/page.tsx",
                    lineNumber: 951,
                    columnNumber: 7
                }, this),
                recipes.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-gray-400 text-6xl mb-4",
                            children: "📊"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 1633,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-medium text-white mb-2",
                            children: "No recipes available"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 1634,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 mb-4",
                            children: "Create some recipes first to calculate their COGS."
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 1635,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/webapp/recipes",
                            className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-colors",
                            children: "Go to Recipes"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/cogs/page.tsx",
                            lineNumber: 1638,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/cogs/page.tsx",
                    lineNumber: 1632,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/cogs/page.tsx",
            lineNumber: 910,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/webapp/cogs/page.tsx",
        lineNumber: 909,
        columnNumber: 5
    }, this);
}
_s(COGSPage, "Y0rlAzjdVIDFqg0TGWpLN+/y4vc=");
_c = COGSPage;
var _c;
__turbopack_context__.k.register(_c, "COGSPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_e9836363._.js.map