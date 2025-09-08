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
"[project]/app/webapp/recipes/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>RecipesPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/unit-conversion.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/text-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function RecipesPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [recipes, setRecipes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Use centralized formatting utility
    const capitalizeRecipeName = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$text$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRecipeName"];
    // Calculate recommended selling price for a recipe
    const calculateRecommendedPrice = (recipe, ingredients)=>{
        if (!ingredients || ingredients.length === 0) return null;
        // Calculate total cost per serving
        let totalCostPerServing = 0;
        ingredients.forEach((ri)=>{
            const ingredient = ri.ingredients;
            const quantity = ri.quantity;
            // Convert cost to the unit being used in the recipe
            const baseCostPerUnit = ingredient.cost_per_unit;
            const costPerUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$unit$2d$conversion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertIngredientCost"])(baseCostPerUnit, ingredient.unit || 'g', ri.unit || 'g', ingredient.ingredient_name);
            const wastePercent = ingredient.trim_peel_waste_percentage || 0;
            const yieldPercent = ingredient.yield_percentage || 100;
            // Calculate cost with waste and yield adjustments
            const baseCost = quantity * costPerUnit;
            const wasteAdjustedCost = baseCost * (1 + wastePercent / 100);
            const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
            totalCostPerServing += yieldAdjustedCost;
        });
        // Apply 30% food cost target (industry standard)
        const targetFoodCostPercent = 30;
        const recommendedPrice = totalCostPerServing / (targetFoodCostPercent / 100);
        // Apply charm pricing (round to nearest .95)
        const charmPrice = Math.floor(recommendedPrice) + 0.95;
        return {
            costPerServing: totalCostPerServing,
            recommendedPrice: charmPrice,
            foodCostPercent: totalCostPerServing / charmPrice * 100
        };
    };
    const [showAddForm, setShowAddForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newRecipe, setNewRecipe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        yield: 1,
        yield_unit: 'servings',
        instructions: ''
    });
    const [selectedRecipe, setSelectedRecipe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [recipeIngredients, setRecipeIngredients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [aiInstructions, setAiInstructions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [generatingInstructions, setGeneratingInstructions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previewYield, setPreviewYield] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recipeToDelete, setRecipeToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedRecipes, setSelectedRecipes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recipePrices, setRecipePrices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecipesPage.useEffect": ()=>{
            fetchRecipes();
        }
    }["RecipesPage.useEffect"], []);
    // Listen for ingredient price changes and update recipe prices automatically
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecipesPage.useEffect": ()=>{
            if (recipes.length === 0) return;
            // Subscribe to ingredient table changes
            const subscription = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].channel('ingredient-price-changes').on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'ingredients',
                filter: 'cost_per_unit=neq.null' // Only trigger on cost_per_unit changes
            }, {
                "RecipesPage.useEffect.subscription": (payload)=>{
                    console.log('Ingredient price changed:', payload);
                    // Refresh recipe prices when any ingredient price changes
                    refreshRecipePrices();
                }
            }["RecipesPage.useEffect.subscription"]).subscribe();
            return ({
                "RecipesPage.useEffect": ()=>{
                    subscription.unsubscribe();
                }
            })["RecipesPage.useEffect"];
        }
    }["RecipesPage.useEffect"], [
        recipes
    ]);
    const fetchRecipes = async ()=>{
        try {
            const { data: recipesData, error: recipesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').select('*').order('name');
            if (recipesError) {
                setError(recipesError.message);
            } else {
                setRecipes(recipesData || []);
                // Calculate prices for each recipe
                await calculateAllRecipePrices(recipesData || []);
            }
        } catch (err) {
            setError('Failed to fetch recipes');
        } finally{
            setLoading(false);
        }
    };
    // Calculate prices for all recipes
    const calculateAllRecipePrices = async (recipesData)=>{
        const prices = {};
        for (const recipe of recipesData){
            try {
                const ingredients = await fetchRecipeIngredients(recipe.id);
                const priceData = calculateRecommendedPrice(recipe, ingredients);
                if (priceData) {
                    prices[recipe.id] = priceData;
                }
            } catch (err) {
                console.log("Failed to calculate price for recipe ".concat(recipe.id, ":"), err);
            }
        }
        setRecipePrices(prices);
    };
    // Refresh recipe prices (for auto-updates)
    const refreshRecipePrices = async ()=>{
        if (recipes.length === 0) return;
        try {
            await calculateAllRecipePrices(recipes);
        } catch (err) {
            console.log('Failed to refresh recipe prices:', err);
        }
    };
    const fetchRecipeIngredients = async (recipeId)=>{
        try {
            const { data: ingredientsData, error: ingredientsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipe_ingredients').select("\n          id,\n          recipe_id,\n          ingredient_id,\n          quantity,\n          unit,\n          ingredients (\n            id,\n            ingredient_name,\n            cost_per_unit,\n            unit,\n            trim_peel_waste_percentage,\n            yield_percentage\n          )\n        ").eq('recipe_id', recipeId);
            if (ingredientsError) {
                setError(ingredientsError.message);
                return [];
            }
            return ingredientsData || [];
        } catch (err) {
            setError('Failed to fetch recipe ingredients');
            return [];
        }
    };
    const handleAddRecipe = async (e)=>{
        e.preventDefault();
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').insert([
                newRecipe
            ]);
            if (error) {
                setError(error.message);
            } else {
                setShowAddForm(false);
                setNewRecipe({
                    name: '',
                    yield: 1,
                    yield_unit: 'servings',
                    instructions: ''
                });
                fetchRecipes();
            }
        } catch (err) {
            setError('Failed to add recipe');
        }
    };
    const handleEditRecipe = async (recipe)=>{
        try {
            // Fetch recipe ingredients
            const ingredients = await fetchRecipeIngredients(recipe.id);
            // Convert to COGSCalculation format
            const calculations = ingredients.map((ri)=>{
                const ingredient = ri.ingredients;
                const quantity = ri.quantity;
                const costPerUnit = ingredient.cost_per_unit;
                const totalCost = quantity * costPerUnit;
                // Apply waste and yield adjustments
                const wastePercent = ingredient.trim_peel_waste_percentage || 0;
                const yieldPercent = ingredient.yield_percentage || 100;
                const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
                const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
                return {
                    recipeId: recipe.id,
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
            // Store data in sessionStorage for COGS page
            sessionStorage.setItem('editingRecipe', JSON.stringify({
                recipe,
                calculations,
                dishName: recipe.name,
                dishPortions: recipe.yield,
                dishNameLocked: true
            }));
            // Navigate to COGS page
            router.push('/webapp/cogs');
        } catch (err) {
            setError('Failed to load recipe for editing');
        }
    };
    const handleEditFromPreview = ()=>{
        if (!selectedRecipe || !recipeIngredients.length) {
            setError('No recipe data available for editing');
            return;
        }
        try {
            console.log('🔍 DEBUG: Recipe ingredients from preview:', recipeIngredients);
            console.log('🔍 DEBUG: Selected recipe:', selectedRecipe);
            // Convert already loaded recipe ingredients to COGSCalculation format
            const calculations = recipeIngredients.map((ri)=>{
                const ingredient = ri.ingredients;
                const quantity = ri.quantity;
                const costPerUnit = ingredient.cost_per_unit;
                const totalCost = quantity * costPerUnit;
                // Apply waste and yield adjustments
                const wastePercent = ingredient.trim_peel_waste_percentage || 0;
                const yieldPercent = ingredient.yield_percentage || 100;
                const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
                const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
                console.log('🔍 DEBUG: Converting ingredient:', {
                    ingredientName: ingredient.ingredient_name,
                    quantity: quantity,
                    unit: ri.unit,
                    costPerUnit: costPerUnit
                });
                return {
                    recipeId: selectedRecipe.id,
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
            console.log('🔍 DEBUG: Final calculations array:', calculations);
            // Store data in sessionStorage for COGS page
            sessionStorage.setItem('editingRecipe', JSON.stringify({
                recipe: selectedRecipe,
                recipeId: selectedRecipe.id,
                calculations,
                dishName: selectedRecipe.name,
                dishPortions: selectedRecipe.yield,
                dishNameLocked: true
            }));
            // Close the preview modal
            setShowPreview(false);
            // Navigate to COGS page
            router.push('/webapp/cogs');
        } catch (err) {
            console.error('❌ Error in handleEditFromPreview:', err);
            setError('Failed to load recipe for editing');
        }
    };
    const handlePreviewRecipe = async (recipe)=>{
        try {
            console.log('🔍 DEBUG: Fetching ingredients for recipe:', recipe.name, recipe.id);
            const ingredients = await fetchRecipeIngredients(recipe.id);
            console.log('🔍 DEBUG: Fetched ingredients:', ingredients);
            setSelectedRecipe(recipe);
            setRecipeIngredients(ingredients);
            setPreviewYield(recipe.yield); // Initialize with original yield
            setShowPreview(true);
            // Generate AI instructions
            await generateAIInstructions(recipe, ingredients);
        } catch (err) {
            console.error('❌ Error in handlePreviewRecipe:', err);
            setError('Failed to load recipe preview');
        }
    };
    const calculateTotalCost = ()=>{
        return recipeIngredients.reduce((total, ri)=>{
            const ingredient = ri.ingredients;
            const quantity = ri.quantity;
            const costPerUnit = ingredient.cost_per_unit;
            const totalCost = quantity * costPerUnit;
            // Apply waste and yield adjustments
            const wastePercent = ingredient.trim_peel_waste_percentage || 0;
            const yieldPercent = ingredient.yield_percentage || 100;
            const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
            const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
            return total + yieldAdjustedCost;
        }, 0);
    };
    const calculateAdjustedQuantity = (originalQuantity)=>{
        if (!selectedRecipe) return originalQuantity;
        const multiplier = previewYield / selectedRecipe.yield;
        return originalQuantity * multiplier;
    };
    const formatQuantity = (quantity, unit)=>{
        const adjustedQuantity = calculateAdjustedQuantity(quantity);
        // Smart conversions for common units
        if (unit.toLowerCase() === 'gm' || unit.toLowerCase() === 'g' || unit.toLowerCase() === 'gram') {
            if (adjustedQuantity >= 1000) {
                return {
                    value: (adjustedQuantity / 1000).toFixed(1),
                    unit: 'kg',
                    original: "".concat(adjustedQuantity.toFixed(1), " ").concat(unit)
                };
            }
        }
        if (unit.toLowerCase() === 'ml' || unit.toLowerCase() === 'milliliter') {
            if (adjustedQuantity >= 1000) {
                return {
                    value: (adjustedQuantity / 1000).toFixed(1),
                    unit: 'L',
                    original: "".concat(adjustedQuantity.toFixed(1), " ").concat(unit)
                };
            }
        }
        if (unit.toLowerCase() === 'mg' || unit.toLowerCase() === 'milligram') {
            if (adjustedQuantity >= 1000) {
                return {
                    value: (adjustedQuantity / 1000).toFixed(1),
                    unit: 'g',
                    original: "".concat(adjustedQuantity.toFixed(1), " ").concat(unit)
                };
            }
        }
        if (unit.toLowerCase() === 'kg' || unit.toLowerCase() === 'kilogram') {
            if (adjustedQuantity >= 1000) {
                return {
                    value: (adjustedQuantity / 1000).toFixed(1),
                    unit: 'tonne',
                    original: "".concat(adjustedQuantity.toFixed(1), " ").concat(unit)
                };
            }
        }
        if (unit.toLowerCase() === 'l' || unit.toLowerCase() === 'liter' || unit.toLowerCase() === 'litre') {
            if (adjustedQuantity >= 1000) {
                return {
                    value: (adjustedQuantity / 1000).toFixed(1),
                    unit: 'kL',
                    original: "".concat(adjustedQuantity.toFixed(1), " ").concat(unit)
                };
            }
        }
        // For smaller quantities, show more precision
        if (adjustedQuantity < 1) {
            return {
                value: adjustedQuantity.toFixed(2),
                unit: unit,
                original: "".concat(adjustedQuantity.toFixed(2), " ").concat(unit)
            };
        }
        // Default formatting
        return {
            value: adjustedQuantity.toFixed(1),
            unit: unit,
            original: "".concat(adjustedQuantity.toFixed(1), " ").concat(unit)
        };
    };
    const generateAIInstructions = async (recipe, ingredients)=>{
        setGeneratingInstructions(true);
        try {
            // Analyze ingredients to determine cooking method
            const ingredientNames = ingredients.map((ri)=>ri.ingredients.ingredient_name.toLowerCase());
            const hasProtein = ingredientNames.some((name)=>name.includes('beef') || name.includes('chicken') || name.includes('pork') || name.includes('fish') || name.includes('lamb') || name.includes('mince'));
            const hasVegetables = ingredientNames.some((name)=>name.includes('carrot') || name.includes('onion') || name.includes('garlic') || name.includes('tomato') || name.includes('pepper') || name.includes('celery'));
            const hasDairy = ingredientNames.some((name)=>name.includes('cheese') || name.includes('milk') || name.includes('cream') || name.includes('butter') || name.includes('yogurt'));
            const hasGrains = ingredientNames.some((name)=>name.includes('rice') || name.includes('pasta') || name.includes('bread') || name.includes('flour') || name.includes('quinoa'));
            // Determine recipe type and cooking method
            let recipeType = 'general';
            let cookingMethod = 'stovetop';
            let primaryTechnique = 'sautéing';
            if (recipe.name.toLowerCase().includes('burger') || recipe.name.toLowerCase().includes('patty')) {
                recipeType = 'burger';
                cookingMethod = 'grill/pan';
                primaryTechnique = 'grilling/pan-frying';
            } else if (recipe.name.toLowerCase().includes('soup') || recipe.name.toLowerCase().includes('stew')) {
                recipeType = 'soup';
                cookingMethod = 'stovetop';
                primaryTechnique = 'simmering';
            } else if (recipe.name.toLowerCase().includes('salad')) {
                recipeType = 'salad';
                cookingMethod = 'cold prep';
                primaryTechnique = 'mixing';
            } else if (recipe.name.toLowerCase().includes('pasta') || recipe.name.toLowerCase().includes('noodle')) {
                recipeType = 'pasta';
                cookingMethod = 'stovetop';
                primaryTechnique = 'boiling/sautéing';
            }
            // Generate specific instructions based on recipe analysis
            let generatedInstructions = '';
            if (recipeType === 'burger') {
                var _ingredients_find, _ingredients_find1;
                generatedInstructions = "**Burger Preparation:**\n\n**Mise en Place:**\n1. Gather all ingredients and equipment\n2. Prepare work station with cutting board, knives, and mixing bowls\n3. Preheat ".concat(cookingMethod === 'grill/pan' ? 'grill or large skillet' : 'cooking surface', " to medium-high heat\n\n**Ingredient Prep:**\n").concat(hasProtein ? "1. Prepare protein: ".concat(((_ingredients_find = ingredients.find((ri)=>ri.ingredients.ingredient_name.toLowerCase().includes('beef') || ri.ingredients.ingredient_name.toLowerCase().includes('mince'))) === null || _ingredients_find === void 0 ? void 0 : _ingredients_find.ingredients.ingredient_name) || 'main protein', " - season and form into patties") : '', "\n").concat(hasVegetables ? "2. Prep vegetables: Wash, peel, and chop all vegetables as needed" : '', "\n").concat(hasDairy ? "3. Prepare dairy: ".concat(((_ingredients_find1 = ingredients.find((ri)=>ri.ingredients.ingredient_name.toLowerCase().includes('cheese'))) === null || _ingredients_find1 === void 0 ? void 0 : _ingredients_find1.ingredients.ingredient_name) || 'cheese', " - slice or grate as needed") : '', "\n\n**Cooking Method:**\n1. Heat cooking surface to medium-high (375°F/190°C)\n2. ").concat(hasProtein ? 'Cook protein patties for 4-5 minutes per side for medium doneness' : 'Cook main ingredients', "\n3. ").concat(hasVegetables ? 'Sauté vegetables until tender-crisp' : 'Cook vegetables as needed', "\n4. ").concat(hasDairy ? 'Add cheese in final 1-2 minutes of cooking' : 'Add finishing ingredients', "\n\n**Assembly & Service:**\n1. Toast buns if desired\n2. Layer ingredients: protein, vegetables, condiments\n3. Serve immediately while hot\n4. Yield: ").concat(recipe.yield, " ").concat(recipe.yield_unit, "\n\n**Professional Tips:**\n- Maintain consistent heat for even cooking\n- Don't press patties while cooking\n- Let meat rest 2-3 minutes before serving\n- Keep ingredients warm during assembly");
            } else if (recipeType === 'soup') {
                var _ingredients_find2, _ingredients_find3;
                generatedInstructions = "**Soup Preparation:**\n\n**Mise en Place:**\n1. Gather all ingredients and large pot\n2. Prepare cutting board and sharp knives\n3. Have stock or broth ready at room temperature\n\n**Ingredient Prep:**\n".concat(hasProtein ? "1. Prepare protein: Cut ".concat(((_ingredients_find2 = ingredients.find((ri)=>ri.ingredients.ingredient_name.toLowerCase().includes('beef') || ri.ingredients.ingredient_name.toLowerCase().includes('chicken'))) === null || _ingredients_find2 === void 0 ? void 0 : _ingredients_find2.ingredients.ingredient_name) || 'protein', " into bite-sized pieces") : '', "\n").concat(hasVegetables ? "2. Prep vegetables: Dice aromatics (onions, carrots, celery) uniformly" : '', "\n").concat(hasGrains ? "3. Prepare grains: ".concat(((_ingredients_find3 = ingredients.find((ri)=>ri.ingredients.ingredient_name.toLowerCase().includes('rice') || ri.ingredients.ingredient_name.toLowerCase().includes('pasta'))) === null || _ingredients_find3 === void 0 ? void 0 : _ingredients_find3.ingredients.ingredient_name) || 'grains', " - rinse if needed") : '', "\n\n**Cooking Method:**\n1. Heat large pot over medium heat\n2. ").concat(hasProtein ? 'Sear protein until browned, remove and set aside' : 'Start with aromatics', "\n3. ").concat(hasVegetables ? 'Sauté vegetables until softened (5-7 minutes)' : 'Cook base ingredients', "\n4. Add liquid and bring to boil, then reduce to simmer\n5. ").concat(hasProtein ? 'Return protein to pot' : 'Add main ingredients', "\n6. Simmer until all ingredients are tender (20-30 minutes)\n\n**Final Steps:**\n1. Taste and adjust seasoning\n2. Skim any excess fat from surface\n3. Serve hot with garnishes\n4. Yield: ").concat(recipe.yield, " ").concat(recipe.yield_unit, "\n\n**Professional Tips:**\n- Build layers of flavor (sauté aromatics first)\n- Simmer gently to avoid breaking ingredients\n- Taste frequently and adjust seasoning\n- Cool quickly if storing");
            } else {
                var _ingredients_find4, _ingredients_find5;
                // General recipe instructions
                generatedInstructions = "**".concat(recipe.name, " Preparation:**\n\n**Mise en Place:**\n1. Gather all ingredients and equipment\n2. Prepare work station with cutting board and knives\n3. Preheat cooking equipment as needed\n\n**Ingredient Prep:**\n").concat(hasProtein ? "1. Prepare protein: ".concat(((_ingredients_find4 = ingredients.find((ri)=>ri.ingredients.ingredient_name.toLowerCase().includes('beef') || ri.ingredients.ingredient_name.toLowerCase().includes('chicken') || ri.ingredients.ingredient_name.toLowerCase().includes('mince'))) === null || _ingredients_find4 === void 0 ? void 0 : _ingredients_find4.ingredients.ingredient_name) || 'main protein', " - cut, season, or prepare as needed") : '', "\n").concat(hasVegetables ? "2. Prep vegetables: Wash, peel, and cut vegetables uniformly" : '', "\n").concat(hasDairy ? "3. Prepare dairy: ".concat(((_ingredients_find5 = ingredients.find((ri)=>ri.ingredients.ingredient_name.toLowerCase().includes('cheese') || ri.ingredients.ingredient_name.toLowerCase().includes('milk'))) === null || _ingredients_find5 === void 0 ? void 0 : _ingredients_find5.ingredients.ingredient_name) || 'dairy products', " - prepare as needed") : '', "\n\n**Cooking Method:**\n1. Heat cooking surface to appropriate temperature\n2. ").concat(hasProtein ? 'Cook protein first, then remove and set aside' : 'Start with base ingredients', "\n3. ").concat(hasVegetables ? 'Cook vegetables until desired doneness' : 'Cook main ingredients', "\n4. ").concat(hasProtein ? 'Return protein to pan' : 'Combine all ingredients', "\n5. Season and finish cooking\n\n**Final Steps:**\n1. Taste and adjust seasoning\n2. Plate attractively for ").concat(recipe.yield, " ").concat(recipe.yield_unit, "\n3. Serve immediately while hot\n\n**Professional Tips:**\n- Maintain consistent heat throughout cooking\n- Use proper knife skills for uniform cuts\n- Keep work area clean and organized\n- Taste frequently and adjust seasoning");
            }
            setAiInstructions(generatedInstructions);
        } catch (err) {
            setError('Failed to generate cooking instructions');
        } finally{
            setGeneratingInstructions(false);
        }
    };
    const handlePrint = ()=>{
        window.print();
    };
    const handleDeleteRecipe = (recipe)=>{
        setRecipeToDelete(recipe);
        setShowDeleteConfirm(true);
    };
    const confirmDeleteRecipe = async ()=>{
        if (!recipeToDelete) return;
        try {
            // First delete all recipe ingredients
            const { error: ingredientsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipe_ingredients').delete().eq('recipe_id', recipeToDelete.id);
            if (ingredientsError) {
                setError(ingredientsError.message);
                return;
            }
            // Then delete the recipe
            const { error: recipeError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').delete().eq('id', recipeToDelete.id);
            if (recipeError) {
                setError(recipeError.message);
                return;
            }
            // Refresh the recipes list
            await fetchRecipes();
            // Show success message
            setSuccessMessage('Recipe "'.concat(capitalizeRecipeName(recipeToDelete.name), '" deleted successfully!'));
            setTimeout(()=>setSuccessMessage(null), 3000);
            // Close the confirmation modal
            setShowDeleteConfirm(false);
            setRecipeToDelete(null);
        } catch (err) {
            setError('Failed to delete recipe');
        }
    };
    const cancelDeleteRecipe = ()=>{
        setShowDeleteConfirm(false);
        setRecipeToDelete(null);
    };
    // Multi-selection functions
    const handleSelectRecipe = (recipeId)=>{
        setSelectedRecipes((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(recipeId)) {
                newSet.delete(recipeId);
            } else {
                newSet.add(recipeId);
            }
            return newSet;
        });
    };
    const handleSelectAll = ()=>{
        if (selectedRecipes.size === recipes.length) {
            setSelectedRecipes(new Set());
        } else {
            setSelectedRecipes(new Set(recipes.map((r)=>r.id)));
        }
    };
    const handleBulkDelete = ()=>{
        if (selectedRecipes.size === 0) return;
        setShowBulkDeleteConfirm(true);
    };
    const confirmBulkDelete = async ()=>{
        if (selectedRecipes.size === 0) return;
        try {
            const selectedRecipeIds = Array.from(selectedRecipes);
            // Delete all recipe ingredients for selected recipes
            const { error: ingredientsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipe_ingredients').delete().in('recipe_id', selectedRecipeIds);
            if (ingredientsError) {
                setError(ingredientsError.message);
                return;
            }
            // Delete all selected recipes
            const { error: recipesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recipes').delete().in('id', selectedRecipeIds);
            if (recipesError) {
                setError(recipesError.message);
                return;
            }
            // Refresh the recipes list
            await fetchRecipes();
            // Show success message
            setSuccessMessage("".concat(selectedRecipes.size, " recipe").concat(selectedRecipes.size > 1 ? 's' : '', " deleted successfully!"));
            setTimeout(()=>setSuccessMessage(null), 3000);
            // Clear selection and close modal
            setSelectedRecipes(new Set());
            setShowBulkDeleteConfirm(false);
        } catch (err) {
            setError('Failed to delete recipes');
        }
    };
    const cancelBulkDelete = ()=>{
        setShowBulkDeleteConfirm(false);
    };
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
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 790,
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
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 794,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-3 bg-[#2a2a2a] rounded-xl w-1/2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 795,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 793,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 791,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 789,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/recipes/page.tsx",
                lineNumber: 788,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/webapp/recipes/page.tsx",
            lineNumber: 787,
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/images/prepflow-logo.png",
                                    alt: "PrepFlow Logo",
                                    width: 40,
                                    height: 40,
                                    className: "rounded-lg",
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 811,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl font-bold text-white",
                                    children: "📖 Recipe Book"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 819,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 810,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "Manage your saved recipes and create new ones"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 823,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 809,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-3 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowAddForm(!showAddForm),
                            className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-6 py-3 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium",
                            children: showAddForm ? 'Cancel' : '+ Add Manual Recipe'
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 828,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/webapp/cogs",
                            className: "bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] text-white px-6 py-3 rounded-2xl hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium",
                            children: "Create Recipe from COGS"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 834,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setLoading(true);
                                fetchRecipes();
                            },
                            className: "bg-gradient-to-r from-[#D925C7] to-[#3B82F6] text-white px-6 py-3 rounded-2xl hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium",
                            children: "🔄 Refresh Recipes"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 840,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 827,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 sm:p-6 rounded-xl mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-white mb-2",
                            children: "How Recipe Book Works"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 853,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid md:grid-cols-2 gap-4 text-sm text-gray-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-medium text-[#3B82F6] mb-2",
                                            children: "✍️ Manual Recipes"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 856,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Add recipes manually with instructions and portion counts. Perfect for documenting cooking methods and procedures."
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 857,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 855,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-medium text-[#29E7CD] mb-2",
                                            children: "📊 From COGS Calculations"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 860,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Create cost calculations in the COGS screen, then save them as recipes. These recipes include all ingredient costs and portion calculations."
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 861,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 859,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 854,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 852,
                    columnNumber: 7
                }, this),
                selectedRecipes.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border border-[#ef4444]/30 p-4 rounded-xl mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white font-bold text-sm",
                                            children: selectedRecipes.size
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 872,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 871,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-white font-semibold",
                                                children: [
                                                    selectedRecipes.size,
                                                    " recipe",
                                                    selectedRecipes.size > 1 ? 's' : '',
                                                    " selected"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 875,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 text-sm",
                                                children: "Choose an action for the selected recipes"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 878,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 874,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 870,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleBulkDelete,
                                        className: "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-2 rounded-lg hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl",
                                        children: "🗑️ Delete Selected"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 882,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedRecipes(new Set()),
                                        className: "bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-lg hover:bg-[#3a3a3a] transition-all duration-200 font-medium",
                                        children: "Clear Selection"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 888,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 881,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/recipes/page.tsx",
                        lineNumber: 869,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 868,
                    columnNumber: 11
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 900,
                    columnNumber: 9
                }, this),
                successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-5 h-5 text-green-500 mr-2",
                                fill: "currentColor",
                                viewBox: "0 0 20 20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 909,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 908,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: successMessage
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 911,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/recipes/page.tsx",
                        lineNumber: 907,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 906,
                    columnNumber: 11
                }, this),
                showAddForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg sm:text-xl font-semibold mb-4",
                            children: "Add New Recipe"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 918,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleAddRecipe,
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-1",
                                            children: "Recipe Name *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 921,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            required: true,
                                            value: newRecipe.name,
                                            onChange: (e)=>setNewRecipe({
                                                    ...newRecipe,
                                                    name: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]",
                                            placeholder: "e.g., Chicken Stir-fry"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 924,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 920,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-1",
                                            children: "Yield Portions"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 934,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: "1",
                                            value: newRecipe.yield,
                                            onChange: (e)=>setNewRecipe({
                                                    ...newRecipe,
                                                    yield: parseInt(e.target.value)
                                                }),
                                            className: "w-full px-3 py-2 border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 937,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 933,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-1",
                                            children: "Instructions"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 946,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: newRecipe.instructions,
                                            onChange: (e)=>setNewRecipe({
                                                    ...newRecipe,
                                                    instructions: e.target.value
                                                }),
                                            rows: 4,
                                            className: "w-full px-3 py-2 border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]",
                                            placeholder: "Step-by-step cooking instructions..."
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 949,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 945,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors",
                                    children: "Add Recipe"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 957,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 919,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 917,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1f1f1f] rounded-lg shadow overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-0 z-10 bg-[#1f1f1f] px-4 sm:px-6 py-4 border-b border-[#2a2a2a]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-semibold text-white",
                                        children: [
                                            "Recipes (",
                                            recipes.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 971,
                                        columnNumber: 11
                                    }, this),
                                    selectedRecipes.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-6 h-6 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white font-bold text-xs",
                                                    children: selectedRecipes.size
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 977,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 976,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-300",
                                                children: [
                                                    selectedRecipes.size,
                                                    " selected"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 979,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 975,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 970,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 969,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "block md:hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "divide-y divide-[#2a2a2a]",
                                children: recipes.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 hover:bg-[#2a2a2a]/20 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedRecipes.has(recipe.id),
                                                                onChange: ()=>handleSelectRecipe(recipe.id),
                                                                className: "w-4 h-4 text-[#29E7CD] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2 mr-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 994,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-sm font-medium text-white cursor-pointer",
                                                                onClick: ()=>handlePreviewRecipe(recipe),
                                                                children: capitalizeRecipeName(recipe.name)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1000,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 993,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-500",
                                                        children: new Date(recipe.created_at).toLocaleDateString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1004,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 992,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1 text-xs text-gray-500 mb-3 ml-7",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Recommended Price:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1011,
                                                                columnNumber: 23
                                                            }, this),
                                                            recipePrices[recipe.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white font-semibold ml-1",
                                                                children: [
                                                                    "$",
                                                                    recipePrices[recipe.id].recommendedPrice.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1013,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500 ml-1",
                                                                children: "Calculating..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1017,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1010,
                                                        columnNumber: 19
                                                    }, this),
                                                    recipePrices[recipe.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Food Cost:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1022,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400 ml-1",
                                                                children: [
                                                                    recipePrices[recipe.id].foodCostPercent.toFixed(1),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1023,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1021,
                                                        columnNumber: 21
                                                    }, this),
                                                    recipe.instructions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Instructions:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1030,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-gray-400 line-clamp-2",
                                                                children: recipe.instructions
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1031,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1029,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1009,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2 ml-7",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleEditRecipe(recipe),
                                                        className: "flex-1 bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-3 py-2 rounded-lg text-xs font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200",
                                                        children: "✏️ Edit in COGS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1040,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDeleteRecipe(recipe),
                                                        className: "flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-3 py-2 rounded-lg text-xs font-medium hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200",
                                                        children: "🗑️ Delete"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1046,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1039,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, recipe.id, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 991,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 989,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 988,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:block overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "min-w-full divide-y divide-[#2a2a2a]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedRecipes.size === recipes.length && recipes.length > 0,
                                                                onChange: handleSelectAll,
                                                                className: "w-4 h-4 text-[#29E7CD] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1065,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2",
                                                                children: "Select"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1071,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1064,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1063,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                    children: "Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1074,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                    children: "Recommended Price"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1077,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                    children: "Instructions"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1080,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                    children: "Created"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1083,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                    children: "Actions"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1086,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 1062,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1061,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "bg-[#1f1f1f] divide-y divide-[#2a2a2a]",
                                        children: recipes.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "hover:bg-[#2a2a2a]/20 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-white",
                                                        onClick: (e)=>e.stopPropagation(),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: selectedRecipes.has(recipe.id),
                                                            onChange: ()=>handleSelectRecipe(recipe.id),
                                                            className: "w-4 h-4 text-[#29E7CD] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1095,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1094,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-white cursor-pointer",
                                                        onClick: ()=>handlePreviewRecipe(recipe),
                                                        children: capitalizeRecipeName(recipe.name)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1102,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300 cursor-pointer",
                                                        onClick: ()=>handlePreviewRecipe(recipe),
                                                        children: recipePrices[recipe.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-white font-semibold",
                                                                    children: [
                                                                        "$",
                                                                        recipePrices[recipe.id].recommendedPrice.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1108,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-gray-400",
                                                                    children: [
                                                                        recipePrices[recipe.id].foodCostPercent.toFixed(1),
                                                                        "% food cost"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1109,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1107,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-500",
                                                            children: "Calculating..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1114,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1105,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 text-sm text-gray-300 cursor-pointer",
                                                        onClick: ()=>handlePreviewRecipe(recipe),
                                                        children: recipe.instructions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "max-w-xs truncate",
                                                            children: recipe.instructions
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1119,
                                                            columnNumber: 23
                                                        }, this) : '-'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1117,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300 cursor-pointer",
                                                        onClick: ()=>handlePreviewRecipe(recipe),
                                                        children: new Date(recipe.created_at).toLocaleDateString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1126,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2",
                                                            onClick: (e)=>e.stopPropagation(),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleEditRecipe(recipe),
                                                                    className: "bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-3 py-1 rounded-lg text-xs font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200",
                                                                    children: "✏️ Edit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1131,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleDeleteRecipe(recipe),
                                                                    className: "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-3 py-1 rounded-lg text-xs font-medium hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200",
                                                                    children: "🗑️ Delete"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1137,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1130,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1129,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, recipe.id, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1093,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1091,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1060,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 1059,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 968,
                    columnNumber: 7
                }, this),
                recipes.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-gray-400 text-6xl mb-4",
                            children: "🍳"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 1154,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-medium text-white mb-2",
                            children: "No recipes yet"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 1155,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 mb-4",
                            children: "Start by adding your first recipe to begin managing your kitchen costs."
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 1156,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowAddForm(true),
                            className: "bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-colors",
                            children: "Add Your First Recipe"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/recipes/page.tsx",
                            lineNumber: 1159,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 1153,
                    columnNumber: 9
                }, this),
                showPreview && selectedRecipe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-b border-[#2a2a2a]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-start",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-bold text-white mb-2",
                                                    children: capitalizeRecipeName(selectedRecipe.name)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1176,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-4 mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400 text-sm",
                                                                    children: "Original Yield:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1181,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-white font-medium",
                                                                    children: [
                                                                        selectedRecipe.yield,
                                                                        " ",
                                                                        selectedRecipe.yield_unit
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1182,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1180,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400 text-sm",
                                                                    children: "Adjust for:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1186,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setPreviewYield(Math.max(1, previewYield - 1)),
                                                                            className: "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
                                                                            children: "−"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                            lineNumber: 1188,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            value: previewYield,
                                                                            onChange: (e)=>setPreviewYield(Math.max(1, parseInt(e.target.value) || 1)),
                                                                            className: "bg-[#0a0a0a] border border-[#2a2a2a] text-white text-center w-16 h-8 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                                            min: "1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                            lineNumber: 1194,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setPreviewYield(previewYield + 1),
                                                                            className: "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
                                                                            children: "+"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                            lineNumber: 1201,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1187,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-white font-medium",
                                                                    children: selectedRecipe.yield_unit
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1208,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1185,
                                                            columnNumber: 23
                                                        }, this),
                                                        previewYield !== selectedRecipe.yield && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-gray-400",
                                                                    children: "Scale:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1213,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium ".concat(previewYield > selectedRecipe.yield ? 'text-[#29E7CD]' : 'text-[#3B82F6]'),
                                                                    children: [
                                                                        previewYield > selectedRecipe.yield ? '+' : '',
                                                                        ((previewYield / selectedRecipe.yield - 1) * 100).toFixed(0),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1214,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1212,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1179,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 1175,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleEditFromPreview(),
                                                    className: "bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200",
                                                    children: "✏️ Edit Recipe"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1223,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handlePrint,
                                                    className: "bg-gradient-to-r from-[#D925C7] to-[#29E7CD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 transition-all duration-200",
                                                    children: "🖨️ Print"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1229,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowPreview(false),
                                                    className: "bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors",
                                                    children: "✕ Close"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1235,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 1222,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 1174,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1173,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-2xl",
                                                        children: "📋"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1250,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Ingredients",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-normal text-gray-400 ml-2",
                                                        children: [
                                                            "(",
                                                            recipeIngredients.length,
                                                            " item",
                                                            recipeIngredients.length !== 1 ? 's' : '',
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1252,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1249,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-[#0a0a0a] rounded-xl border border-[#2a2a2a]/50 overflow-hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-4 py-3 border-b border-[#2a2a2a]/50",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-12 gap-4 text-sm font-medium text-gray-300",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "col-span-1 text-center",
                                                                    children: "#"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1261,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "col-span-8",
                                                                    children: "Ingredient"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1262,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "col-span-3 text-center",
                                                                    children: "Quantity"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1263,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1260,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1259,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "divide-y divide-[#2a2a2a]/30",
                                                        children: recipeIngredients.map((ri, index)=>{
                                                            const ingredient = ri.ingredients;
                                                            const quantity = ri.quantity;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "px-4 py-3 hover:bg-[#2a2a2a]/20 transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-12 gap-4 items-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "col-span-1 text-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm text-gray-400 font-mono",
                                                                                children: String(index + 1).padStart(2, '0')
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                                lineNumber: 1278,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                            lineNumber: 1277,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "col-span-8",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-white font-medium",
                                                                                children: ingredient.ingredient_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                                lineNumber: 1285,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                            lineNumber: 1284,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "col-span-3 text-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-white font-medium",
                                                                                children: (()=>{
                                                                                    const formatted = formatQuantity(quantity, ri.unit);
                                                                                    const isConverted = formatted.unit !== ri.unit.toLowerCase();
                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                        children: [
                                                                                            formatted.value,
                                                                                            " ",
                                                                                            formatted.unit,
                                                                                            isConverted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-xs text-gray-400 mt-1",
                                                                                                children: [
                                                                                                    "(",
                                                                                                    formatted.original,
                                                                                                    ")"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                                                lineNumber: 1299,
                                                                                                columnNumber: 43
                                                                                            }, this),
                                                                                            previewYield !== selectedRecipe.yield && !isConverted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-xs text-gray-400 mt-1",
                                                                                                children: [
                                                                                                    "(orig: ",
                                                                                                    quantity,
                                                                                                    " ",
                                                                                                    ri.unit,
                                                                                                    ")"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                                                lineNumber: 1304,
                                                                                                columnNumber: 43
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true);
                                                                                })()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                                lineNumber: 1290,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                            lineNumber: 1289,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                    lineNumber: 1275,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, ri.id, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1274,
                                                                columnNumber: 27
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1268,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1257,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1248,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-white mb-4",
                                                children: "🤖 AI-Generated Cooking Method"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1323,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-[#0a0a0a] rounded-lg p-4",
                                                children: generatingInstructions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center py-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#29E7CD]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1327,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "ml-3 text-gray-400",
                                                            children: "Generating cooking instructions..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                                            lineNumber: 1328,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1326,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-gray-300 whitespace-pre-wrap",
                                                    children: aiInstructions
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1331,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1324,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1322,
                                        columnNumber: 17
                                    }, this),
                                    selectedRecipe.instructions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-white mb-4",
                                                children: "👨‍🍳 Manual Instructions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1341,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-[#0a0a0a] rounded-lg p-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-gray-300 whitespace-pre-wrap",
                                                    children: selectedRecipe.instructions
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1343,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1342,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1340,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1246,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/recipes/page.tsx",
                        lineNumber: 1171,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 1170,
                    columnNumber: 11
                }, this),
                showDeleteConfirm && recipeToDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-md w-full border border-[#2a2a2a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-b border-[#2a2a2a]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-6 h-6 text-white",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1363,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1362,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 1361,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-bold text-white",
                                                    children: "Delete Recipe"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1367,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-400 text-sm",
                                                    children: "This action cannot be undone"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1368,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 1366,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 1360,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1359,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-300 mb-6",
                                        children: [
                                            "Are you sure you want to delete ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: [
                                                    '"',
                                                    capitalizeRecipeName(recipeToDelete.name),
                                                    '"'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1376,
                                                columnNumber: 51
                                            }, this),
                                            "? This will permanently remove the recipe and all its ingredients from your Recipe Book."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1375,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: cancelDeleteRecipe,
                                                className: "flex-1 bg-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1382,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: confirmDeleteRecipe,
                                                className: "flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-3 rounded-xl hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl",
                                                children: "Delete Recipe"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1388,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1381,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1374,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/recipes/page.tsx",
                        lineNumber: 1357,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 1356,
                    columnNumber: 11
                }, this),
                showBulkDeleteConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-md w-full border border-[#2a2a2a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-b border-[#2a2a2a]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-6 h-6 text-white",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1409,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1408,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 1407,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-bold text-white",
                                                    children: "Delete Multiple Recipes"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1413,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-400 text-sm",
                                                    children: "This action cannot be undone"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                                    lineNumber: 1414,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/recipes/page.tsx",
                                            lineNumber: 1412,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/recipes/page.tsx",
                                    lineNumber: 1406,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1405,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-300 mb-6",
                                        children: [
                                            "Are you sure you want to delete ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: [
                                                    selectedRecipes.size,
                                                    " recipe",
                                                    selectedRecipes.size > 1 ? 's' : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1422,
                                                columnNumber: 51
                                            }, this),
                                            "? This will permanently remove all selected recipes and their ingredients from your Recipe Book."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1421,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#0a0a0a] rounded-lg p-4 mb-6 max-h-32 overflow-y-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-medium text-white mb-2",
                                                children: "Selected Recipes:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1428,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: Array.from(selectedRecipes).map((recipeId)=>{
                                                    const recipe = recipes.find((r)=>r.id === recipeId);
                                                    return recipe ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-400",
                                                        children: [
                                                            "• ",
                                                            capitalizeRecipeName(recipe.name)
                                                        ]
                                                    }, recipeId, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1433,
                                                        columnNumber: 25
                                                    }, this) : null;
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1429,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1427,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: cancelBulkDelete,
                                                className: "flex-1 bg-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1441,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: confirmBulkDelete,
                                                className: "flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-3 rounded-xl hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl",
                                                children: [
                                                    "Delete ",
                                                    selectedRecipes.size,
                                                    " Recipe",
                                                    selectedRecipes.size > 1 ? 's' : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1447,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1440,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1420,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/recipes/page.tsx",
                        lineNumber: 1403,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 1402,
                    columnNumber: 11
                }, this),
                selectedRecipe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden print-recipe-card print:block print:fixed print:inset-0 print:bg-white print:p-8 print:z-[9999] print:m-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "print:max-w-none print:w-full print:h-full print:overflow-visible print:m-0 print:p-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "print:flex print:justify-between print:items-center print:mb-8 print:border-b print:border-gray-300 print:pb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "print:text-3xl print:font-bold print:text-black print:mb-2",
                                                children: capitalizeRecipeName(selectedRecipe.name)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1466,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "print:text-lg print:text-gray-600",
                                                children: [
                                                    "Yield: ",
                                                    previewYield,
                                                    " ",
                                                    selectedRecipe.yield_unit,
                                                    previewYield !== selectedRecipe.yield && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "print:ml-2 print:text-sm print:text-gray-500",
                                                        children: [
                                                            "(scaled from ",
                                                            selectedRecipe.yield,
                                                            " ",
                                                            selectedRecipe.yield_unit,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1472,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1469,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1465,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "print:flex print:items-center print:gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "/images/prepflow-logo.png",
                                                alt: "PrepFlow",
                                                className: "print:w-16 print:h-16 print:object-contain"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1479,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "print:text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "print:text-sm print:font-semibold print:text-black",
                                                        children: "PrepFlow"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1485,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "print:text-xs print:text-gray-500",
                                                        children: "Kitchen Management"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1486,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1484,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1478,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1464,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "print:mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "print:text-2xl print:font-bold print:text-black print:mb-4 print:border-b print:border-gray-300 print:pb-2",
                                        children: "📋 Ingredients"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1493,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "print:space-y-2",
                                        children: recipeIngredients.map((ri, index)=>{
                                            const ingredient = ri.ingredients;
                                            const quantity = ri.quantity;
                                            const formatted = formatQuantity(quantity, ri.unit);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "print:flex print:justify-between print:items-center print:py-1 print:border-b print:border-gray-100 print:last:border-b-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "print:flex print:items-center print:gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "print:text-sm print:text-gray-500 print:font-mono print:w-6",
                                                                children: [
                                                                    String(index + 1).padStart(2, '0'),
                                                                    "."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1505,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "print:text-black print:font-medium",
                                                                children: ingredient.ingredient_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                                lineNumber: 1508,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1504,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "print:text-black print:font-semibold",
                                                        children: [
                                                            formatted.value,
                                                            " ",
                                                            formatted.unit
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                                        lineNumber: 1512,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, ri.id, true, {
                                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                                lineNumber: 1503,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1496,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1492,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "print:mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "print:text-2xl print:font-bold print:text-black print:mb-4 print:border-b print:border-gray-300 print:pb-2",
                                        children: "🤖 Cooking Instructions"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1523,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "print:text-black print:leading-relaxed print:whitespace-pre-line",
                                        children: aiInstructions
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1526,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1522,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "print:mt-12 print:pt-4 print:border-t print:border-gray-300 print:text-center print:text-xs print:text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Generated by PrepFlow Kitchen Management System"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1533,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "Printed on ",
                                            new Date().toLocaleDateString(),
                                            " at ",
                                            new Date().toLocaleTimeString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/recipes/page.tsx",
                                        lineNumber: 1534,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/recipes/page.tsx",
                                lineNumber: 1532,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/recipes/page.tsx",
                        lineNumber: 1462,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/recipes/page.tsx",
                    lineNumber: 1461,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/recipes/page.tsx",
            lineNumber: 807,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/webapp/recipes/page.tsx",
        lineNumber: 806,
        columnNumber: 5
    }, this);
}
_s(RecipesPage, "vmZmkuGpP7JLdTDfRpX1UPpBJwY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = RecipesPage;
var _c;
__turbopack_context__.k.register(_c, "RecipesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_2338a109._.js.map