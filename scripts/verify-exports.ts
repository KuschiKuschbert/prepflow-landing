import fs from 'fs/promises';
import path from 'path';
import { generateHTML as generateMenuHTML } from '../app/api/menus/[id]/menu-display/export/helpers/generateHTML';
import { generateHTML as generateRecipeHTML } from '../app/api/menus/[id]/recipe-cards/export/helpers/generateHTML';

// Mock NextResponse if running in node environment where it might not be available globally matching Next.js
// But usually Next.js environment is needed.
// We will try to run this with ts-node/tsx. If NextResponse is not found we might need to mock it.

async function verify() {
  const outDir = path.join(process.cwd(), 'out-debug');
  await fs.mkdir(outDir, { recursive: true });

  // 1. Verify Recipe Cards
  console.log('Generating Recipe Cards...');
  const recipeData = [
    {
      id: '1',
      menuItemId: 'm1',
      menuItemName: 'Spicy Burger',
      title: 'Spicy Burger Patty',
      baseYield: 10,
      ingredients: [
        { name: 'Beef Mince', quantity: 2, unit: 'kg' },
        { name: 'Chili Flakes', quantity: 50, unit: 'g' },
        { name: 'Salt', quantity: 20, unit: 'g' },
      ],
      methodSteps: ['Mix meat and spices', 'Form patties', 'Grill for 5 mins each side'],
      notes: ['Keep chilled until use'],
      category: 'Main Prep',
    },
    {
      id: '2',
      menuItemId: 'm1',
      menuItemName: 'Spicy Burger',
      title: 'Burger Sauce',
      baseYield: 50,
      ingredients: [
        { name: 'Mayo', quantity: 1, unit: 'kg' },
        { name: 'Sriracha', quantity: 200, unit: 'ml' },
      ],
      methodSteps: ['Whisk together'],
      notes: [],
      category: 'Sauces',
    },
  ];

  try {
    const recipeRes = await generateRecipeHTML('Summer Menu', recipeData, false);
    const recipeHtml = await recipeRes.text();
    await fs.writeFile(path.join(outDir, 'recipe-cards.html'), recipeHtml);
    console.log('✓ Recipe Cards generated at out-debug/recipe-cards.html');
  } catch (e) {
    console.error('✗ Failed to generate Recipe Cards:', e);
  }

  // 2. Verify Menu Display
  console.log('Generating Menu Display...');
  const menuData = [
    {
      name: 'Spicy Burger',
      description: 'A fiery burger with chili flakes and sriracha mayo',
      price: 18.5,
      category: 'Burgers',
    },
    {
      name: 'Classic Cheeseburger',
      description: 'The timeless classic with cheddar and pickles',
      price: 16.0,
      category: 'Burgers',
    },
    {
      name: 'Truffle Fries',
      description: 'Crispy fries with parmesan and truffle oil',
      price: 9.0,
      category: 'Sides',
    },
  ];

  try {
    const menuRes = await generateMenuHTML('Summer Menu', menuData, false);
    const menuHtml = await menuRes.text();
    await fs.writeFile(path.join(outDir, 'menu-display.html'), menuHtml);
    console.log('✓ Menu Display generated at out-debug/menu-display.html');
  } catch (e) {
    console.error('✗ Failed to generate Menu Display:', e);
  }
  // 3. Verify Menu Density (40 items)
  console.log('Generating Dense Menu (40 items)...');
  const denseMenuData = Array.from({ length: 40 }, (_, i) => ({
    name: `Menu Item ${i + 1}`,
    description:
      i % 2 === 0 ? 'Delicious item with some description text to take up space.' : undefined,
    price: 15.0 + i,
    category: i < 20 ? 'Starters' : 'Mains',
  }));

  try {
    const denseRes = await generateMenuHTML('Large Menu', denseMenuData, false);
    const denseHtml = await denseRes.text();
    await fs.writeFile(path.join(outDir, 'menu-density-test.html'), denseHtml);
    console.log('✓ Dense Menu generated at out-debug/menu-density-test.html');
  } catch (e) {
    console.error('✗ Failed to generate Dense Menu:', e);
  }
}

verify();
