#!/usr/bin/env node

/**
 * Fix remaining silent catch blocks - add logger.error for catch blocks that add to error arrays
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  {
    file: 'app/api/db/populate-empty-dishes/helpers/populateDishes.ts',
    pattern: /catch\s*\(err\)\s*\{[\s\S]*errors\.push\(/,
    hasLogger: true,
  },
  {
    file: 'app/api/db/populate-empty-dishes/helpers/populateRecipes.ts',
    pattern: /catch\s*\(err\)\s*\{[\s\S]*errors\.push\(/,
    hasLogger: true,
  },
];

function fixFile(filePath, hasLogger) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix catch blocks that push to errors array but don't log
  // Pattern: catch (err) { errors.push({ ... error: err.message ... }); }
  // Add logger.error before errors.push
  content = content.replace(
    /catch\s*\(err\)\s*\{[\s]*const\s+recipeName\s*=.*?errors\.push\(/gs,
    match => {
      if (!match.includes('logger.error')) {
        changed = true;
        return match.replace(
          /catch\s*\(err\)\s*\{/,
          `catch (err) {
      logger.error('[Populate Empty Dishes] Error processing recipe:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        recipeId: recipe.id,
      });`,
        );
      }
      return match;
    },
  );

  content = content.replace(
    /catch\s*\(err\)\s*\{[\s]*errors\.push\(\{[\s]*dish_id:\s*dish\.id,/gs,
    match => {
      if (!match.includes('logger.error')) {
        changed = true;
        return match.replace(
          /catch\s*\(err\)\s*\{/,
          `catch (err) {
      logger.error('[Populate Empty Dishes] Error processing dish:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        dishId: dish.id,
        dishName: dish.dish_name,
      });`,
        );
      }
      return match;
    },
  );

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  console.log('Fixing remaining silent catch blocks...\n');

  let fixed = 0;
  for (const { file, hasLogger } of filesToFix) {
    if (fixFile(file, hasLogger)) {
      console.log(`✓ Fixed: ${file}`);
      fixed++;
    }
  }

  console.log(`\n✓ Fixed ${fixed} files`);
}

if (require.main === module) {
  main();
}

module.exports = { fixFile };
