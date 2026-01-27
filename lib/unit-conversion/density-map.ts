
/**
 * Ingredient Density Map
 * Maps normalized ingredient names (or core strings) to their density in g/ml.
 *
 * Default density for water is 1.0.
 * Salt (table) is approx 1.2 g/ml.
 * Sugar (granulated) is approx 0.85 g/ml.
 * Flour (all-purpose) is approx 0.5-0.6 g/ml (packed vs sifted varies, using standard 0.55).
 * Oil is approx 0.92 g/ml.
 */

export const INGREDIENT_DENSITIES: Record<string, number> = {
    // Basics
    'water': 1.0,
    'milk': 1.03,
    'cream': 1.01,
    'oil': 0.92,
    'vegetable oil': 0.92,
    'olive oil': 0.92,
    'honey': 1.42,
    'maple syrup': 1.37,
    'corn syrup': 1.48,
    'molasses': 1.4,
    'vinegar': 1.01,
    'soy sauce': 1.13,

    // Dry Goods
    'salt': 1.2, // Table salt
    'kosher salt': 0.8, // Flakier, lighter
    'sea salt': 1.1,
    'sugar': 0.85, // Granulated
    'brown sugar': 0.95, // Packed
    'powdered sugar': 0.6,
    'flour': 0.55, // AP Flour
    'bread flour': 0.55,
    'cake flour': 0.5,
    'cornstarch': 0.6,
    'cocoa powder': 0.5,
    'baking powder': 0.9,
    'baking soda': 1.0,  // Approx
    'rice': 0.85, // Uncooked
    'oats': 0.4, // Rolled

    // Fresh / Dairy
    'butter': 0.911,
    'margarine': 0.96,
    'yogurt': 1.03,
    'greek yogurt': 1.1,
    'sour cream': 0.96,
    'mayonnaise': 0.92,
    'cream cheese': 0.95,
    'cottage cheese': 0.96,
    'parmesan cheese': 0.45, // Grated
    'cheddar cheese': 0.7, // Shredded
    'mozarella cheese': 0.7, // Shredded

    // Nuts & Seeds
    'almonds': 0.6, // Whole
    'almond flour': 0.4,
    'walnuts': 0.5,
    'pecans': 0.5,
    'peanuts': 0.6,
    'chia seeds': 0.7,
    'flax seeds': 0.7,
    'sunflower seeds': 0.6,
    'sesame seeds': 0.6,
    'peanut butter': 1.1,

    // Spices (Ground) - Approx average 0.45
    'cinnamon': 0.45,
    'pepper': 0.6, // Ground black
    'paprika': 0.45,
    'cumin': 0.45,
    'turmeric': 0.6,
    'garlic powder': 0.32,
    'onion powder': 0.32,
    'oregano': 0.2, // Dried leaves light
    'basil': 0.15,

    // Grains & Legumes (Dry)
    'quinoa': 0.72,
    'lentils': 0.85,
    'couscous': 0.75,
    'chickpeas': 0.75,
    'beans': 0.75,
    'breadcrumbs': 0.45,
    'panko': 0.25,

    // Misc
    'tomato paste': 1.0,
    'pumpkin puree': 1.0,
    'apple sauce': 1.05,
    'jam': 1.35,
    'jelly': 1.3,
    'mustard': 1.05,
    'ketchup': 1.15,
    // Proteins (Raw/Cooked Diced Avg)
    'chicken': 1.04, // Diced/Cooked
    'chicken breast': 1.04,
    'chicken thighs': 1.04,
    'beef': 1.05, // Ground or diced
    'ground beef': 1.05,
    'pork': 1.05,
    'bacon': 0.5, // Fried chopped roughly
    'fish': 1.0,
    'salmon': 1.0,
    'tuna': 1.0, // Canned drained
    'shrimp': 1.0,
    'tofu': 0.95, // Cubed
    'egg': 1.03, // Liquid

    // Vegetables (Chopped/Diced Avg - often lighter due to air gaps)
    'onion': 0.6, // Diced
    'carrot': 0.65, // Diced
    'celery': 0.6,
    'potato': 0.7, // Diced
    'sweet potato': 0.7,
    'spinach': 0.08, // Raw leaves are very light!
    'fresh spinach': 0.08,
    'broccoli': 0.4, // Florets
    'cauliflower': 0.4,
    'bell pepper': 0.5,
    // 'pepper' is used for spice (black pepper), bell pepper should be explicit or handled via alias.
    // Removing ambient 'pepper' here to avoid conflict with spice.
    'tomato': 0.65, // Chopped
    'mushroom': 0.4, // Sliced
    'garlic': 0.5, // Minced
    'ginger': 0.5, // Minced

    // Starches (Dry)
    'pasta': 0.4, // Dry Short shapes (macaroni/penne) are very airy
    'macaroni': 0.4,
    'penne': 0.4,
    'spaghetti': 1.4, // Tightly packed bundle density is high, but "1 cup" is weird. Usually by weight.
    'noodles': 0.5, // Dry nests
    'rice noodles': 0.5,

    // Fruits (Chopped)
    'apple': 0.5,
    'banana': 0.6, // Sliced
    'strawberry': 0.6,
    'blueberry': 0.65,
    'lemon juice': 1.04,
    'lemon': 0.5,
    'lime juice': 1.04,

    // Australian Localizations (Aliases)
    // Ensures that parsed "Capsicum" finds the density of "Bell Pepper"
    'capsicum': 0.5, // = bell pepper
    'red capsicum': 0.5,
    'green capsicum': 0.5,
    'coriander': 0.08, // ~= fresh spinach/herbs light
    'rocket': 0.08, // = fresh spinach/arugula
    'zucchini': 0.6, // similar to cucumber/veg
    'eggplant': 0.6, // similar to veg
    'aubergine': 0.6,
    'spring onion': 0.5, // = scallion
    'rockmelon': 0.9, // melon
    'honeydew melon': 0.9,
    'sultana': 0.6, // dried fruit
    'biscuit': 0.5, // cookie/cracker
    'beef mince': 1.05, // = ground beef
    'pork mince': 1.05,
    'chicken mince': 1.04,
    'thickened cream': 1.01, // = heavy cream
    'icing sugar': 0.6, // = powdered sugar
    'bicarb soda': 1.0, // = baking soda
    'plain flour': 0.55, // = ap flour
    'baker\'s flour': 0.55, // = bread flour
    'self raising flour': 0.55,
    'cornflour': 0.6, // = cornstarch
    // 'canola oil' is already defined above? Let's check.
    // Actually, checking the top of the file, 'oil', 'vegetable oil', 'olive oil' are at lines 18-20.
    // So I should remove them from here.
};


/**
 * Get density for an ingredient name.
 * Returns null if no known density.
 */
export function getIngredientDensity(ingredientName: string): number | null {
    if (!ingredientName) return null;

    // 1. Try exact normalized match
    // Note: Assuming we move normalizeIngredient to shared spot or import it.
    // Ideally this file should be in lib/unit-conversion, but normalizeIngredient is in lib/
    // We should fix imports if needed.
    // For now, let's assume we pass a normalized name or use basic normalization.

    const lower = ingredientName.toLowerCase().trim();
    if (INGREDIENT_DENSITIES[lower]) return INGREDIENT_DENSITIES[lower];

    // 2. Try partial match against keys
    // "fine sea salt" -> should match "sea salt" or "salt"
    // Heuristic: iterate keys, check if ingredientName includes key
    // Prioritize longer keys (e.g. "kosher salt" before "salt")

    const sortedKeys = Object.keys(INGREDIENT_DENSITIES).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (lower.includes(key)) {
            return INGREDIENT_DENSITIES[key];
        }
    }

    return null;
}
