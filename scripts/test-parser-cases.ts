import { parseIngredientString } from '../lib/recipe-normalization/ingredient-parser';

const cases = [
  '1 pound fresh hot italian sausages',
  '12 ounces fully cooked andouille sausages',
  '10-ounce container grape',
  '1 large onion',
  '-ounce container grape',
];

console.log('Testing parser cases:');
cases.forEach(c => {
  const res = parseIngredientString(c);
  console.log(`"${c}" ->`, JSON.stringify(res));
});
