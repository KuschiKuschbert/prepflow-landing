const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function findDeepNesting() {
  console.log('Scanning for deep nesting...');
  const files = await glob('{app,lib,components}/**/*.{ts,tsx}', {
    ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'],
  });

  const results = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let maxIndent = 0;

    for (const line of lines) {
      // Count leading spaces
      const match = line.match(/^(\s*)/);
      if (match) {
        const indent = match[1].length;
        // Assuming 2 spaces per indent.
        // If using tabs, you might need to adjust, but let's assume spaces or mixed.
        // 6 levels = 12 spaces.
        const levels = Math.floor(indent / 2);
        if (levels > maxIndent) maxIndent = levels;
      }
    }

    if (maxIndent >= 7) {
      results.push({ file, maxIndent });
    }
  }

  results.sort((a, b) => b.maxIndent - a.maxIndent);

  console.log('Files with strict nesting > 6 levels:');
  results.forEach(r => console.log(`${r.maxIndent} levels: ${r.file}`));
}

findDeepNesting();
