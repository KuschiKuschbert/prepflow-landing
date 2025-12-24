import { AVATAR_NAME_CATEGORIES } from '../../avatar-names';

/**
 * Match filename to appropriate name category
 */
export function matchFilenameToCategory(
  originalFilename: string,
  index: number,
  currentName: string,
): string {
  const lowerFilename = originalFilename.toLowerCase();

  if (lowerFilename.includes('chef') || lowerFilename.includes('cook')) {
    const chefIndex = index % AVATAR_NAME_CATEGORIES.CHEF_THEMED.length;
    return AVATAR_NAME_CATEGORIES.CHEF_THEMED[chefIndex];
  } else if (
    lowerFilename.includes('cat') ||
    lowerFilename.includes('dog') ||
    lowerFilename.includes('animal')
  ) {
    const punnyIndex = index % AVATAR_NAME_CATEGORIES.PUNNY_FOOD.length;
    return AVATAR_NAME_CATEGORIES.PUNNY_FOOD[punnyIndex];
  } else if (
    lowerFilename.includes('avocado') ||
    lowerFilename.includes('chili') ||
    lowerFilename.includes('pepper')
  ) {
    const foodIndex = index % AVATAR_NAME_CATEGORIES.PUNNY_FOOD.length;
    return AVATAR_NAME_CATEGORIES.PUNNY_FOOD[foodIndex];
  }

  return currentName;
}
