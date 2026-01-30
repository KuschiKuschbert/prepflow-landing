export const AU_NAME_MAP: Record<string, string> = {
  // US -> AU
  'bell pepper': 'Capsicum',
  'red bell pepper': 'Red Capsicum',
  'green bell pepper': 'Green Capsicum',
  cilantro: 'Coriander',
  arugula: 'Rocket',
  zucchini: 'Zucchini', // Same
  eggplant: 'Eggplant', // AU often uses Eggplant too, UK implies Aubergine. Keep Eggplant.
  scallion: 'Spring Onion',
  'green onion': 'Spring Onion',
  cantaloupe: 'Rockmelon',
  honeydew: 'Honeydew Melon',
  raisin: 'Sultana', // Often distinct but commonly mapped
  'golden raisin': 'Sultana',
  cookie: 'Biscuit',
  cracker: 'Biscuit', // Context dependent
  'ground beef': 'Beef Mince',
  'ground pork': 'Pork Mince',
  'ground chicken': 'Chicken Mince',
  'heavy cream': 'Thickened Cream',
  'powdered sugar': 'Icing Sugar',
  'confectioners sugar': 'Icing Sugar',
  'baking soda': 'Bicarb Soda',
  'all-purpose flour': 'Plain Flour',
  'bread flour': "Baker's Flour",
  'self-rising flour': 'Self Raising Flour',
  cornstarch: 'Cornflour',
  'graham cracker': 'Digestive Biscuit',
  'canola oil': 'Canola Oil', // Same
  'vegetable oil': 'Vegetable Oil',
};

export function localizeIngredientName(name: string): string {
  const lower = name.toLowerCase();

  // Check for exact matches first
  if (AU_NAME_MAP[lower]) return AU_NAME_MAP[lower];

  // Check against keys for partial replacement?
  // "chopped bell pepper" -> "chopped Capsicum"
  // Heuristic: Iterate keys, replace if found.

  let localized = name;
  for (const [us, au] of Object.entries(AU_NAME_MAP)) {
    const regex = new RegExp(`\\b${us}\\b`, 'gi');
    if (regex.test(localized)) {
      localized = localized.replace(regex, au);
    }
  }

  return localized;
}
