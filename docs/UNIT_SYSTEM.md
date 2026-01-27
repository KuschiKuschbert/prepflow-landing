# Standard Unit System

This document outlines the logic used in PrepFlow for normalizing, converting, and displaying ingredient quantities. This system ensures consistency across recipes, inventory, and shopping lists.

## 1. Unit Normalization
All incoming ingredient strings are parsed to extract structured data.
- **Library:** [`lib/recipe-normalization/ingredient-parser.ts`](../lib/recipe-normalization/ingredient-parser.ts)
- **Logic:**
    - Detects fractions (`1 1/2`) and converts to decimals (`1.5`).
    - identifying units (`cup`, `oz`, `lb`) and normalizes to standard keys (`cup`, `oz`, `lb`).
    - Handles "package" logic (e.g. `1 (15oz) can` -> `15 oz`).

## 2. Standard Units
The system enforces Metric units for storage and calculation.
- **Reference:** [`lib/unit-conversion/standardUnitConversions.ts`](../lib/unit-conversion/standardUnitConversions.ts)
- **Mappings:**
    - **Weight:** Stores as `g` (Grams). Input `kg`, `lb`, `oz` -> converted to `g`.
    - **Volume:** Stores as `ml` (Milliliters). Input `l`, `cup`, `tbsp`, `tsp` -> converted to `ml`.
    - **Piece:** Stores as `pc`. Used for whole items (`1 apple`).

### Base Conversion Factors
We use the following standard conversions (US Customary to Metric). defined in [`lib/unit-conversion/unitMappings.ts`](../lib/unit-conversion/unitMappings.ts):
- **Volume:**
    - 1 gallon = 3.785 L
    - 1 quart = 946.353 ml
    - 1 pint = 473.176 ml
    - 1 cup = 236.588 ml
    - 1 stick (butter) = 118.294 ml
    - 1 fl oz = 29.574 ml
    - 1 tbsp = 14.787 ml
    - 1 tsp = 4.929 ml
    - **International:**
        - 1 Imperial Gallon = 4.546 L
        - 1 Imperial Pint = 568.261 ml
        - 1 Metric Cup = 250 ml
- **Weight:**
    - 1 lb = 453.592 g
    - 1 oz = 28.35 g

## 3. Density-Based Conversion
To solve the "Solid vs Liquid" issue (e.g. "5 ml Salt"), the system handles physical state conversions.
- **Library:** [`lib/unit-conversion/density-map.ts`](../lib/unit-conversion/density-map.ts)
- **Logic:** Maps ingredient names to g/ml density.
    - **Basics:** Salt, Sugar, Flour, Water, Oil
    - **Dairy:** Butter, Yogurt, Cheese, Sour Cream
    - **Nuts/Seeds:** Almonds, Walnuts, Chia, Flax
    - **Spices:** Cinnamon, Pepper, Paprika, etc.
    - **Pantry:** Rice, Oats, Quinoa, Tomato Paste, Honey
- **Behavior:** If a recipe requests a *Volume* of a known *Solid* ingredient (and we have its density), it is automatically converted to *Weight* (grams).
    - Example: `5 ml Salt` -> `6 g Salt`.

## 4. Chef Normal Rounding
To prevent "computer numbers" (e.g. `55.00001 g`) and mimic professional kitchen standards.
- **Library:** [`lib/unit-conversion/rounding.ts`](../lib/unit-conversion/rounding.ts)
- **Rules:**
    - **< 10g:** Round to nearest **0.5g** (e.g. `2.5g`, `6g`). Precision for spices.
    - **10g - 100g:** Round to nearest **1g** (e.g. `12g`, `55g`). Standard scale precision.
    - **> 100g:** Round to nearest **5g** (e.g. `125g`, `450g`). Bulk precision.

## 5. Usage
To use this system in new features:
```typescript
import { convertToStandardUnit } from '@/lib/unit-conversion';

// 1. Basic Conversion
const result = convertToStandardUnit(1, 'lb');
// -> { value: 454, unit: 'g' }

// 2. Density-Aware Conversion (Pass the name!)
const result = convertToStandardUnit(5, 'ml', 'Salt');
// -> { value: 6, unit: 'g' }
```
