export const DISH_FIELDS_FULL = `
  id,
  dish_name,
  description,
  selling_price,
  allergens,
  is_vegetarian,
  is_vegan,
  dietary_confidence,
  dietary_method
`;

export const RECIPE_FIELDS_FULL = `
  id,
  name,
  description,
  yield,
  allergens,
  is_vegetarian,
  is_vegan,
  dietary_confidence,
  dietary_method
`;

export const DISH_FIELDS_NO_DIETARY = `
  id,
  dish_name,
  description,
  selling_price
`;

export const RECIPE_FIELDS_NO_DIETARY = `
  id,
  name,
  description,
  yield
`;

export const DISH_FIELDS_MINIMAL = `
  id,
  dish_name,
  selling_price
`;

export const RECIPE_FIELDS_MINIMAL = `
  id,
  recipe_name,
  yield
`;

export const MENU_ITEM_BASE_FIELDS = `
  id,
  dish_id,
  recipe_id,
  category,
  position,
  region
`;

export const MENU_ITEM_PRICING_FIELDS = `
  actual_selling_price,
  recommended_selling_price
`;
