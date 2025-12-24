#!/usr/bin/env node

/**
 * Fix catch blocks that check err.status without logging
 * Add logger.error before returning err.status responses
 */

const fs = require('fs');

const filesToFix = [
  'app/api/cleaning-areas/route.ts',
  'app/api/cleaning-tasks/route.ts',
  'app/api/compliance-records/route.ts',
  'app/api/dishes/route.ts',
  'app/api/employees/[id]/route.ts',
  'app/api/employees/route.ts',
  'app/api/cleaning-tasks/standard-templates/route.ts',
  'app/api/cleanup-test-data/route.ts',
  'app/api/debug/auth/route.ts',
  'app/api/debug/token/route.ts',
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add logger import if missing
  if (!content.includes("from '@/lib/logger'") && /catch.*err.*status/.test(content)) {
    const lines = content.split('\n');
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        insertIndex = i;
        break;
      }
    }

    // Find last import line
    let lastImportIndex = insertIndex;
    for (let i = insertIndex; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      } else if (lines[i].trim() && !lines[i].trim().startsWith('//')) {
        break;
      }
    }

    const newImport = "import { logger } from '@/lib/logger';";

    if (!content.includes('@/lib/logger')) {
      lines.splice(lastImportIndex + 1, 0, newImport);
      content = lines.join('\n');
      changed = true;
    }
  }

  // Fix pattern: catch (err) { if (err.status) { return NextResponse.json(err, { status: err.status }); } }
  // Add logging before the return
  content = content.replace(
    /catch\s*\(([^)]+)\)\s*\{[\s]*if\s*\(\1\.status\)\s*\{[\s]*return\s+NextResponse\.json\(\1,\s*\{\s*status:\s*\1\.status[^}]*\}\);/g,
    (match, errVar) => {
      changed = true;
      return `catch (${errVar}) {
    logger.error('[API] Error with status:', {
      error: ${errVar} instanceof Error ? ${errVar}.message : String(${errVar}),
      status: ${errVar}.status,
      context: { endpoint: '${filePath.replace('app/api/', '/api/').replace('/route.ts', '')}' },
    });
    if (${errVar}.status) {
      return NextResponse.json(${errVar}, { status: ${errVar}.status });`;
    },
  );

  // Fix pattern: catch (err) { if (err && typeof err === 'object' && 'status' in err) { return NextResponse.json(err, { status: err.status || 500 }); } }
  content = content.replace(
    /catch\s*\(([^)]+)\)\s*\{[\s]*if\s*\(\1\s*&&\s*typeof\s+\1\s*===\s*['"]object['"]\s*&&\s*['"]status['"]\s+in\s+\1\)\s*\{[\s]*return\s+NextResponse\.json\(\1,\s*\{\s*status:\s*\1\.status[^}]*\}\);/g,
    (match, errVar) => {
      changed = true;
      return `catch (${errVar}) {
    logger.error('[API] Error with status:', {
      error: ${errVar} instanceof Error ? ${errVar}.message : String(${errVar}),
      status: ${errVar}?.status,
      context: { endpoint: '${filePath.replace('app/api/', '/api/').replace('/route.ts', '')}' },
    });
    if (${errVar} && typeof ${errVar} === 'object' && 'status' in ${errVar}) {
      return NextResponse.json(${errVar}, { status: ${errVar}.status || 500 });`;
    },
  );

  // Fix pattern: catch (err: any) { if (err.status) return NextResponse.json(err, { status: err.status }); }
  content = content.replace(
    /catch\s*\(([^)]+)\)\s*\{[\s]*if\s*\(\1\.status\)\s+return\s+NextResponse\.json\(\1,\s*\{\s*status:\s*\1\.status[^}]*\}\);/g,
    (match, errVar) => {
      changed = true;
      return `catch (${errVar}) {
    logger.error('[API] Error with status:', {
      error: ${errVar} instanceof Error ? ${errVar}.message : String(${errVar}),
      status: ${errVar}.status,
      context: { endpoint: '${filePath.replace('app/api/', '/api/').replace('/route.ts', '')}' },
    });
    if (${errVar}.status) return NextResponse.json(${errVar}, { status: ${errVar}.status });`;
    },
  );

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  console.log('Fixing status error handling patterns...\n');

  let fixed = 0;
  filesToFix.forEach(filePath => {
    if (fixFile(filePath)) {
      console.log(`✓ Fixed: ${filePath}`);
      fixed++;
    } else {
      console.log(`- Skipped: ${filePath} (no changes needed or file not found)`);
    }
  });

  console.log(`\n✓ Fixed ${fixed} files`);
}

if (require.main === module) {
  main();
}

module.exports = { fixFile };
