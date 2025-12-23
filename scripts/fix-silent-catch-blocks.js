#!/usr/bin/env node

/**
 * Fix silent catch blocks - add logger.error before status checks
 */

const fs = require('fs');
const path = require('path');

function findFiles(dir, extensions = ['.ts', '.tsx']) {
  const files = [];

  function walkDir(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
          walkDir(fullPath);
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  walkDir(dir);
  return files;
}

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return false;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Skip if no catch blocks with status checks
  if (!/catch.*\{[\s\S]*if\s*\([^)]*\.status\)/.test(content)) {
    return false;
  }

  // Add logger import if missing and file has catch blocks
  if (!content.includes("from '@/lib/logger'") && /catch\s*\(/.test(content)) {
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      } else if (lines[i].trim() && !lines[i].trim().startsWith('//') && lastImportIndex >= 0) {
        break;
      }
    }

    if (lastImportIndex >= 0 && !content.includes("@/lib/logger")) {
      const newImport = "import { logger } from '@/lib/logger';";
      lines.splice(lastImportIndex + 1, 0, newImport);
      content = lines.join('\n');
      changed = true;
    }
  }

  // Extract endpoint name from file path for context
  const endpointMatch = filePath.match(/app\/api\/([^/]+)/);
  const endpoint = endpointMatch ? `/api/${endpointMatch[1]}` : filePath.replace('app/', '/');

  // Fix pattern: catch (err: any) { if (err.status) { return NextResponse.json(err, { status: err.status }); } }
  // Add logging before the if statement
  const pattern1 = /catch\s*\(([^)]+)\)\s*\{[\s]*if\s*\(\1\.status\)\s*\{[\s]*return\s+NextResponse\.json\(\1,\s*\{\s*status:\s*\1\.status[^}]*\}\);/g;
  content = content.replace(pattern1, (match, errVar) => {
    changed = true;
    const method = match.includes('POST') ? 'POST' : match.includes('PUT') ? 'PUT' : match.includes('DELETE') ? 'DELETE' : 'GET';
    return `catch (${errVar}) {
    logger.error('[API] Error with status:', {
      error: ${errVar} instanceof Error ? ${errVar}.message : String(${errVar}),
      status: ${errVar}.status,
      context: { endpoint: '${endpoint}', method: '${method}' },
    });
    if (${errVar}.status) {
      return NextResponse.json(${errVar}, { status: ${errVar}.status });`;
  });

  // Fix pattern: catch (err: any) { if (err && typeof err === 'object' && 'status' in err) { return NextResponse.json(err, { status: err.status || 500 }); } }
  content = content.replace(
    /catch\s*\(([^)]+)\)\s*\{[\s]*if\s*\(\1\s*&&\s*typeof\s+\1\s*===\s*['"]object['"]\s*&&\s*['"]status['"]\s+in\s+\1\)\s*\{[\s]*return\s+NextResponse\.json\(\1,\s*\{\s*status:\s*\1\.status[^}]*\}\);/g,
    (match, errVar) => {
      changed = true;
      const method = match.includes('POST') ? 'POST' : match.includes('PUT') ? 'PUT' : match.includes('DELETE') ? 'DELETE' : 'GET';
      return `catch (${errVar}) {
    logger.error('[API] Error with status:', {
      error: ${errVar} instanceof Error ? ${errVar}.message : String(${errVar}),
      status: ${errVar}?.status,
      context: { endpoint: '${endpoint}', method: '${method}' },
    });
    if (${errVar} && typeof ${errVar} === 'object' && 'status' in ${errVar}) {
      return NextResponse.json(${errVar}, { status: ${errVar}.status || 500 });`;
    }
  );

  // Fix pattern: catch (err: any) { if (err.status) return NextResponse.json(err, { status: err.status }); }
  content = content.replace(
    /catch\s*\(([^)]+)\)\s*\{[\s]*if\s*\(\1\.status\)\s+return\s+NextResponse\.json\(\1,\s*\{\s*status:\s*\1\.status[^}]*\}\);/g,
    (match, errVar) => {
      changed = true;
      const method = match.includes('POST') ? 'POST' : match.includes('PUT') ? 'PUT' : match.includes('DELETE') ? 'DELETE' : 'GET';
      return `catch (${errVar}) {
    logger.error('[API] Error with status:', {
      error: ${errVar} instanceof Error ? ${errVar}.message : String(${errVar}),
      status: ${errVar}.status,
      context: { endpoint: '${endpoint}', method: '${method}' },
    });
    if (${errVar}.status) return NextResponse.json(${errVar}, { status: ${errVar}.status });`;
    }
  );

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  console.log('Fixing silent catch blocks...\n');

  const apiFiles = findFiles('app/api', ['.ts']);
  const libFiles = findFiles('lib', ['.ts']);
  const allFiles = [...apiFiles, ...libFiles];

  let fixed = 0;
  const fixedFiles = [];

  for (const file of allFiles) {
    if (fixFile(file)) {
      fixed++;
      fixedFiles.push(file);
    }
  }

  if (fixed > 0) {
    console.log(`✓ Fixed ${fixed} files:\n`);
    fixedFiles.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log('No files needed fixing');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixFile };


