/**
 * Avatar naming system for PrepFlow.
 * Provides funny, PrepFlow-style names for avatars based on their character/appearance.
 */

/**
 * Naming categories for different avatar types.
 */
export const AVATAR_NAME_CATEGORIES = {
  /** Chef/cooking themed names */
  CHEF_THEMED: [
    'Sous Chef Sam',
    'Spice Master',
    'The Prep Pro',
    'Chef de Cuisine',
    'The Flavor Wizard',
    'Master of Marinades',
    'The Seasoning Sage',
    'Knife Skills King',
    'The Recipe Ruler',
    'Culinary Commander',
  ],

  /** Punny food names */
  PUNNY_FOOD: [
    'Avocado Toast',
    'Cheese Please',
    'Egg-cellent Chef',
    'The Bread Winner',
    'Pasta La Vista',
    'Souper Chef',
    'The Grill Master',
    'Wok This Way',
    'Stir Fry Guy',
    'The Dough Boss',
  ],

  /** Kitchen personality types */
  KITCHEN_PERSONALITY: [
    'The Perfectionist',
    'The Improviser',
    'The Speed Demon',
    'The Meticulous One',
    'The Creative Cook',
    'The Organized Chef',
    'The Spontaneous Spice',
    'The Detail-Oriented',
    'The Quick Cook',
    'The Methodical Master',
  ],
} as const;

/**
 * Custom names for specific avatars based on their character/appearance.
 * These are hand-picked funny names that match each avatar's personality.
 * Based on actual avatar images from the processed set.
 *
 * Avatar order matches the alphabetical order of source PNG files:
 * - avatar-01: Messy chef with sauce stains (organized chaos)
 * - avatar-02: Blonde chef stirring pasta (skilled, focused)
 * - avatar-03: Dog in messy kitchen (exhausted, relatable)
 * - avatar-04: Male chef with shaka signs (friendly, laid-back)
 * - avatar-05: Cat looking at food bowls (curious, food-obsessed)
 * - avatar-06: Avocado chef (fresh, trendy)
 * - avatar-07: Blue heeler with sheep toy (organized, herding)
 * - avatar-08: Donkey chef (hardworking, determined)
 * - avatar-09: Chef with sunglasses (cool, stylish)
 * - avatar-10: Chef with floating hearts (passionate, loving)
 * - avatar-11: Chili pepper chef (fiery, energetic)
 * - avatar-12: Clown chef with PrepFlow logo (circus theme, intense)
 * - avatar-13: Trash panda named Ash (midnight snack inspector, kitchen chaos coordinator)
 */
const CUSTOM_AVATAR_NAMES: Record<number, string> = {
  0: 'Kitchen Kaos Kuschi', // Messy chef - "It's not a mess, it's organized chaos!"
  1: 'The Noodle Master', // Blonde chef stirring pasta - "Pasta la vista, hunger!" (placed next to Kitchen Kaos)
  2: 'The Tired Pooch', // Dog in messy kitchen - "Monday vibes, every single day"
  3: 'Surf\'s Up Chef', // Male chef with shaka signs - "Hang loose, dinner's ready!"
  4: 'The Snack Inspector', // avatar-05: Cat looking at food - "Quality control is my middle name"
  5: 'Guac & Roll', // avatar-06: Avocado chef - "Always fresh, never basic, totally extra"
  6: 'The Herding Chef', // avatar-07: Blue heeler with sheep - "Organizing chaos, one ingredient at a time"
  7: 'The Donkey Chef', // avatar-08: Donkey chef - "Work hard, cook harder, never give up"
  8: 'Shades of Flavor', // avatar-09: Chef with sunglasses - "Too cool to break a sweat"
  9: 'Heart & Soul Chef', // avatar-10: Chef with hearts - "Cooking with love, serving with passion"
  10: 'Hot Stuff', // Chili pepper chef - "Spice up your life, one dish at a time!"
  11: 'Kween Kaoz', // avatar-12: Clown chef with PrepFlow logo - "Juggling flavors, serving smiles!"
  12: 'Trash Panda', // avatar-13: Trash panda - "Midnight snack inspector, kitchen chaos coordinator"
};

/**
 * Generate a funny PrepFlow-style name for an avatar.
 * Uses custom names when available, otherwise falls back to category-based names.
 *
 * @param {number} index - Avatar index (0-based)
 * @param {string} originalFilename - Original filename (optional, for context)
 * @returns {string} Funny avatar name
 */
export function generateAvatarName(index: number, originalFilename?: string): string {
  // Use custom name if available
  if (CUSTOM_AVATAR_NAMES[index] !== undefined) {
    return CUSTOM_AVATAR_NAMES[index];
  }

  // Fallback to category-based names
  const categoryIndex = index % 3;
  const nameIndex = Math.floor(index / 3) % 10;

  let name: string;

  switch (categoryIndex) {
    case 0:
      // Chef themed
      name = AVATAR_NAME_CATEGORIES.CHEF_THEMED[nameIndex];
      break;
    case 1:
      // Punny food
      name = AVATAR_NAME_CATEGORIES.PUNNY_FOOD[nameIndex];
      break;
    case 2:
      // Kitchen personality
      name = AVATAR_NAME_CATEGORIES.KITCHEN_PERSONALITY[nameIndex];
      break;
    default:
      name = AVATAR_NAME_CATEGORIES.CHEF_THEMED[0];
  }

  // If we have filename context, try to match it to a more appropriate name
  if (originalFilename) {
    const lowerFilename = originalFilename.toLowerCase();

    // Match specific characters/items from filename
    if (lowerFilename.includes('chef') || lowerFilename.includes('cook')) {
      // Prefer chef-themed names
      const chefIndex = index % AVATAR_NAME_CATEGORIES.CHEF_THEMED.length;
      name = AVATAR_NAME_CATEGORIES.CHEF_THEMED[chefIndex];
    } else if (
      lowerFilename.includes('cat') ||
      lowerFilename.includes('dog') ||
      lowerFilename.includes('animal')
    ) {
      // Playful names for animal avatars
      const punnyIndex = index % AVATAR_NAME_CATEGORIES.PUNNY_FOOD.length;
      name = AVATAR_NAME_CATEGORIES.PUNNY_FOOD[punnyIndex];
    } else if (
      lowerFilename.includes('avocado') ||
      lowerFilename.includes('chili') ||
      lowerFilename.includes('pepper')
    ) {
      // Food-themed names for food avatars
      const foodIndex = index % AVATAR_NAME_CATEGORIES.PUNNY_FOOD.length;
      name = AVATAR_NAME_CATEGORIES.PUNNY_FOOD[foodIndex];
    }
  }

  return name;
}

/**
 * Generate names for multiple avatars.
 *
 * @param {number} count - Number of avatars
 * @param {string[]} originalFilenames - Original filenames (optional)
 * @returns {string[]} Array of avatar names
 */
export function generateAvatarNames(
  count: number,
  originalFilenames?: string[],
): string[] {
  return Array.from({ length: count }, (_, index) =>
    generateAvatarName(index, originalFilenames?.[index]),
  );
}
