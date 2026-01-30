import fs from 'fs';
import { glob } from 'glob';

const files = glob.sync('{app,lib,components,utils,hooks}/**/*.{ts,tsx}', {
  ignore: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts', '**/node_modules/**'],
});

let magicCount = 0;
const IGNORED = new Set(['0', '1', '-1', '2', '10', '100', '1000']);

console.log('Scanning for magic numbers...');

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach(line => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('*') ||
      line.includes('console.log') ||
      line.includes('import ') ||
      line.includes('require(')
    )
      return;

    // Match standalone numbers
    const matches = line.match(/\b\d+\b/g);
    if (matches) {
      matches.forEach(m => {
        if (!IGNORED.has(m)) {
          // Filter out likely non-magic usages
          // - const X = 123; (Defined constants are OK)
          // - port: 3000 (Config objects are borderline but often OK, but we'll count strictly effectively)
          // - type X = 123; (Literal types)

          // Actually, the goal is to find *unnamed* literals in logic.
          // If it's a const declaration, strictly speaking it IS naming it, so it's NOT magic.
          if (
            !line.includes(`const `) &&
            !line.includes(`let `) &&
            !line.includes(`var `) &&
            !line.includes(`type `) &&
            !line.includes(`interface `) &&
            !line.includes(`readonly `)
          ) {
            magicCount++;
          }
        }
      });
    }
  });
}

console.log(`Magic Number Count: ${magicCount}`);
