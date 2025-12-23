#!/usr/bin/env node

/**
 * Fix Broken Error Handling (Precise)
 * Fixes files where error handling was inserted in the middle of query chains
 */

const fs = require('fs');
const path = require('path');

const FILES_TO_FIX = [
  'app/api/employees/[id]/qualifications/route.ts',
  'app/api/equipment-maintenance/route.ts',
  'app/api/ingredients/helpers/updateIngredient.ts',
  'app/api/navigation-optimization/patterns/route.ts',
  'app/api/navigation-optimization/preferences/route.ts',
  'app/api/order-lists/[id]/route.ts',
  'app/api/par-levels/helpers/updateParLevel.ts',
  'app/api/performance/helpers/upsertSalesData.ts',
  'app/api/prep-lists/helpers/updatePrepList.ts',
  'app/api/qualification-types/route.ts',
  'app/api/recipe-share/route.ts',
  'app/api/recipes/ingredients/batch/route.ts',
  'app/api/suppliers/helpers/updateSupplier.ts',
  'app/api/temperature-equipment/[id]/route.ts',
  'app/api/temperature-equipment/route.ts',
  'app/api/temperature-logs/helpers/createTemperatureLog.ts',
  'app/api/user/avatar/helpers/updateAvatar.ts',
  'lib/allergens/ai-allergen-detection.ts',
  'lib/square/config.ts',
  'lib/square/sync/orders.ts',
];

function fixBrokenPattern(content) {
  const lines = content.split('\n');
  const newLines = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this is a broken pattern: const { data, error } = await supabaseAdmin followed by if (error) before .from(
    if (/const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabaseAdmin/.test(line)) {
      // Check if next line has error handling before query chain
      if (i + 1 < lines.length && /if\s*\(error\)/.test(lines[i + 1])) {
        // This is broken - collect the error handling block
        const errorBlockLines = [];
        let j = i + 1;
        let braceCount = 0;

        while (j < lines.length) {
          const currentLine = lines[j];
          errorBlockLines.push(currentLine);
          braceCount += (currentLine.match(/\{/g) || []).length;
          braceCount -= (currentLine.match(/\}/g) || []).length;
          j++;
          if (braceCount === 0 && currentLine.includes('}')) {
            break;
          }
        }

        // Now collect the query lines until semicolon
        const queryLines = [line];
        while (j < lines.length) {
          const currentLine = lines[j];
          queryLines.push(currentLine);
          if (currentLine.trim().endsWith(';')) {
            j++;
            break;
          }
          j++;
        }

        // Reconstruct: query first, then error handling
        newLines.push(...queryLines);
        newLines.push('');
        newLines.push(...errorBlockLines);

        i = j;
        continue;
      }
    }

    newLines.push(line);
    i++;
  }

  return newLines.join('\n');
}

function main() {
  let fixed = 0;
  let skipped = 0;

  console.log(`Fixing ${FILES_TO_FIX.length} files...\n`);

  FILES_TO_FIX.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${filePath} (not found)`);
      skipped++;
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixBrokenPattern(content);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✓ Fixed ${filePath}`);
      fixed++;
    } else {
      console.log(`- ${filePath} (no changes needed)`);
    }
  });

  console.log(`\n✓ Fixed ${fixed} files, skipped ${skipped}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixBrokenPattern };



