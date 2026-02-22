#!/usr/bin/env npx tsx
/**
 * Link orphan data (ingredients, recipes, dishes, menus, suppliers) to one or more user accounts.
 *
 * Usage:
 *   npx tsx scripts/link-data-to-users.ts --to <email>
 *   npx tsx scripts/link-data-to-users.ts --copy-to <email1>,<email2>,<email3>
 *   npx tsx scripts/link-data-to-users.ts --dry-run
 *
 * --to: Reassign all data with null user_id to this user
 * --copy-to: Copy all orphan data to each listed user (so all can see it)
 * --dry-run: Show what would be done without making changes
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function resolveUserByEmail(email: string): Promise<string | null> {
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) {
    console.error(`Failed to list users: ${error.message}`);
    return null;
  }
  const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  return user?.id ?? null;
}

async function ensureUserExists(email: string): Promise<string | null> {
  const userId = await resolveUserByEmail(email);
  if (userId) return userId;
  console.log(`User ${email} not found in Supabase Auth. Creating...`);
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { origin: 'link-data-script' },
  });
  if (error) {
    console.error(`Failed to create user ${email}: ${error.message}`);
    return null;
  }
  return data.user?.id ?? null;
}

async function reassignOrphanData(toEmail: string, dryRun: boolean) {
  const userId = await ensureUserExists(toEmail);
  if (!userId) {
    console.error('Cannot proceed without valid user');
    process.exit(1);
  }
  console.log(`Reassigning orphan data to ${toEmail} (${userId})`);

  const tables = [
    { name: 'suppliers', hasUserId: true },
    { name: 'ingredients', hasUserId: true },
    { name: 'recipes', hasUserId: true },
    { name: 'dishes', hasUserId: true },
    { name: 'menus', hasUserId: true },
  ] as const;

  for (const t of tables) {
    if (!t.hasUserId) continue;

    const { data: orphans, error } = await supabase.from(t.name).select('id').is('user_id', null);

    if (error) {
      console.warn(`  ⚠ ${t.name}: ${error.message} (may not have user_id column)`);
      continue;
    }

    const count = orphans?.length ?? 0;
    if (count === 0) {
      console.log(`  ○ ${t.name}: no orphan rows`);
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY] would update ${count} rows in ${t.name}`);
      continue;
    }

    const { error: updErr } = await supabase
      .from(t.name)
      .update({ user_id: userId })
      .is('user_id', null);
    if (updErr) {
      console.error(`  ✗ ${t.name}: ${updErr.message}`);
    } else {
      console.log(`  ✓ ${t.name}: updated ${count} rows`);
    }
  }
}

async function copyOrphanDataToUsers(emails: string[], dryRun: boolean) {
  const userIds: { email: string; id: string }[] = [];
  for (const email of emails) {
    const id = await ensureUserExists(email);
    if (!id) {
      console.error(`Skipping ${email}: could not resolve user`);
      continue;
    }
    userIds.push({ email, id });
  }
  if (userIds.length === 0) {
    console.error('No valid users to copy to');
    process.exit(1);
  }

  // Fetch all orphan data
  const { data: ingredients } = await supabase.from('ingredients').select('*').is('user_id', null);
  const { data: recipes } = await supabase.from('recipes').select('*').is('user_id', null);
  const { data: dishes } = await supabase.from('dishes').select('*').is('user_id', null);
  const { data: menus } = await supabase.from('menus').select('*').is('user_id', null);
  const { data: suppliers } = await supabase.from('suppliers').select('*');

  const hasSuppliersUser = suppliers && suppliers.length > 0 && 'user_id' in (suppliers[0] ?? {});
  const orphanSuppliers = hasSuppliersUser
    ? (suppliers ?? []).filter((s: { user_id?: string | null }) => !s.user_id)
    : (suppliers ?? []);

  const { data: recipeIngredients } = await supabase.from('recipe_ingredients').select('*');
  const { data: dishRecipes } = await supabase.from('dish_recipes').select('*');
  const { data: dishIngredients } = await supabase.from('dish_ingredients').select('*');
  const { data: menuItems } = await supabase.from('menu_items').select('*');

  if (!ingredients?.length && !recipes?.length && !dishes?.length && !menus?.length) {
    console.log('No orphan data to copy. Use --to to reassign existing data.');
    return;
  }

  console.log(`Copying to ${userIds.length} user(s)...`);

  for (const { email, id } of userIds) {
    console.log(`\n--- ${email} ---`);
    const ingMap = new Map<string, string>();
    const recipeMap = new Map<string, string>();
    const dishMap = new Map<string, string>();
    const menuMap = new Map<string, string>();
    const supplierMap = new Map<string, string>();

    if (dryRun) {
      console.log(
        `  [DRY] would copy ${ingredients?.length ?? 0} ingredients, ${recipes?.length ?? 0} recipes, etc.`,
      );
      continue;
    }

    // 1. Suppliers (if they have user_id)
    if (
      orphanSuppliers.length > 0 &&
      typeof (orphanSuppliers[0] as { user_id?: string })?.user_id !== 'undefined'
    ) {
      for (const s of orphanSuppliers as Array<Record<string, unknown> & { id: string }>) {
        const { id: _id, user_id: _u, ...rest } = s;
        const { data: inserted } = await supabase
          .from('suppliers')
          .insert({ ...rest, user_id: id })
          .select('id')
          .single();
        if (inserted) supplierMap.set(s.id, inserted.id);
      }
    }

    // 2. Ingredients
    for (const ing of ingredients ?? []) {
      const {
        id: _id,
        user_id: _u,
        created_at,
        updated_at,
        ...rest
      } = ing as Record<string, unknown> & { id: string };
      const { data: inserted } = await supabase
        .from('ingredients')
        .insert({ ...rest, user_id: id })
        .select('id')
        .single();
      if (inserted) ingMap.set(ing.id, inserted.id);
    }

    // 3. Recipes
    for (const rec of recipes ?? []) {
      const {
        id: _id,
        user_id: _u,
        created_at,
        updated_at,
        ...rest
      } = rec as Record<string, unknown> & { id: string };
      const { data: inserted } = await supabase
        .from('recipes')
        .insert({ ...rest, user_id: id })
        .select('id')
        .single();
      if (inserted) recipeMap.set(rec.id, inserted.id);
    }

    // 4. Recipe ingredients
    const riToInsert = (recipeIngredients ?? [])
      .filter(
        (ri: { recipe_id: string; ingredient_id: string }) =>
          recipeMap.has(ri.recipe_id) && ingMap.has(ri.ingredient_id),
      )
      .map((ri: { recipe_id: string; ingredient_id: string; quantity: number; unit?: string }) => ({
        recipe_id: recipeMap.get(ri.recipe_id)!,
        ingredient_id: ingMap.get(ri.ingredient_id)!,
        quantity: ri.quantity,
        unit: ri.unit,
      }));
    if (riToInsert.length > 0) {
      await supabase.from('recipe_ingredients').insert(riToInsert);
    }

    // 5. Dishes
    for (const d of dishes ?? []) {
      const {
        id: _id,
        user_id: _u,
        created_at,
        updated_at,
        ...rest
      } = d as Record<string, unknown> & { id: string };
      const { data: inserted } = await supabase
        .from('dishes')
        .insert({ ...rest, user_id: id })
        .select('id')
        .single();
      if (inserted) dishMap.set(d.id, inserted.id);
    }

    // 6. Dish recipes
    const drToInsert = (dishRecipes ?? [])
      .filter(
        (dr: { dish_id: string; recipe_id: string }) =>
          dishMap.has(dr.dish_id) && recipeMap.has(dr.recipe_id),
      )
      .map((dr: { dish_id: string; recipe_id: string; quantity: number }) => ({
        dish_id: dishMap.get(dr.dish_id)!,
        recipe_id: recipeMap.get(dr.recipe_id)!,
        quantity: dr.quantity,
      }));
    if (drToInsert.length > 0) {
      await supabase.from('dish_recipes').insert(drToInsert);
    }

    // 7. Dish ingredients
    const diToInsert = (dishIngredients ?? [])
      .filter(
        (di: { dish_id: string; ingredient_id: string }) =>
          dishMap.has(di.dish_id) && ingMap.has(di.ingredient_id),
      )
      .map((di: { dish_id: string; ingredient_id: string; quantity: number; unit?: string }) => ({
        dish_id: dishMap.get(di.dish_id)!,
        ingredient_id: ingMap.get(di.ingredient_id)!,
        quantity: di.quantity,
        unit: di.unit,
      }));
    if (diToInsert.length > 0) {
      await supabase.from('dish_ingredients').insert(diToInsert);
    }

    // 8. Menus
    for (const m of menus ?? []) {
      const {
        id: _id,
        user_id: _u,
        created_at,
        updated_at,
        ...rest
      } = m as Record<string, unknown> & { id: string };
      const { data: inserted } = await supabase
        .from('menus')
        .insert({ ...rest, user_id: id })
        .select('id')
        .single();
      if (inserted) menuMap.set(m.id, inserted.id);
    }

    // 9. Menu items (either dish_id or recipe_id required)
    const miToInsert = (menuItems ?? [])
      .filter((mi: { menu_id: string; dish_id?: string; recipe_id?: string }) => {
        if (!menuMap.has(mi.menu_id)) return false;
        if (mi.dish_id && dishMap.has(mi.dish_id)) return true;
        if (mi.recipe_id && recipeMap.has(mi.recipe_id)) return true;
        return false;
      })
      .map(
        (mi: {
          menu_id: string;
          dish_id?: string;
          recipe_id?: string;
          category: string;
          position: number;
        }) => {
          const newMenuId = menuMap.get(mi.menu_id)!;
          const newDishId = mi.dish_id && dishMap.has(mi.dish_id) ? dishMap.get(mi.dish_id)! : null;
          const newRecipeId =
            mi.recipe_id && recipeMap.has(mi.recipe_id) ? recipeMap.get(mi.recipe_id)! : null;
          return {
            menu_id: newMenuId,
            dish_id: newDishId,
            recipe_id: newRecipeId,
            category: mi.category,
            position: mi.position,
          };
        },
      );
    if (miToInsert.length > 0) {
      await supabase.from('menu_items').insert(miToInsert);
    }

    console.log(`  ✓ Copied ingredients, recipes, dishes, menus for ${email}`);
  }

  console.log('\nDone. Orphan rows (null user_id) are unchanged - use --to to reassign them.');
}

function main() {
  const args = process.argv.slice(2);
  const toIdx = args.indexOf('--to');
  const copyIdx = args.indexOf('--copy-to');
  const dryRun = args.includes('--dry-run');

  if (toIdx >= 0 && args[toIdx + 1]) {
    reassignOrphanData(args[toIdx + 1], dryRun);
  } else if (copyIdx >= 0 && args[copyIdx + 1]) {
    const emails = args[copyIdx + 1]
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);
    if (emails.length === 0) {
      console.error('--copy-to requires at least one email');
      process.exit(1);
    }
    copyOrphanDataToUsers(emails, dryRun);
  } else {
    console.log(`
Usage:
  npx tsx scripts/link-data-to-users.ts --to <email>           Reassign orphan data to one user
  npx tsx scripts/link-data-to-users.ts --copy-to <e1>,<e2>   Copy orphan data to multiple users
  npx tsx scripts/link-data-to-users.ts --dry-run             Preview without changes

Examples:
  npx tsx scripts/link-data-to-users.ts --to you@example.com
  npx tsx scripts/link-data-to-users.ts --copy-to test@example.com,you@example.com,admin@example.com
`);
    process.exit(0);
  }
}

main();
