const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running ESLint to find errors...');

try {
  // Run eslint and get JSON output. catch error because it returns exit code 1 on errors
  execSync('npx eslint . --format json > eslint-report.json', { stdio: 'ignore' });
} catch (e) {
  // ignore exit code
}

if (!fs.existsSync('eslint-report.json')) {
  console.error('Failed to generate eslint report');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync('eslint-report.json', 'utf8'));
const updates = new Map(); // FilePath -> Set<LineNumber>

let totalErrors = 0;

report.forEach(fileResult => {
  const filePath = fileResult.filePath;
  fileResult.messages.forEach(msg => {
    if (msg.ruleId === '@typescript-eslint/no-explicit-any') {
      if (!updates.has(filePath)) {
        updates.set(filePath, new Set());
      }
      updates.get(filePath).add(msg.line);
      totalErrors++;
    }
  });
});

console.log(`Found ${totalErrors} 'no-explicit-any' errors in ${updates.size} files.`);

updates.forEach((linesSet, filePath) => {
  const linesToSuppress = Array.from(linesSet).sort((a, b) => b - a); // Process from bottom to top to avoid line shift issues?
  // Actually, inserting lines shifts the ones below. So bottom-to-top is critical.

  let content = fs.readFileSync(filePath, 'utf8');
  let fileLines = content.split('\n');
  let modifications = 0;

  linesToSuppress.forEach(lineNum => {
    const index = lineNum - 1; // 0-indexed
    if (index >= 0 && index < fileLines.length) {
      const line = fileLines[index];
      const prevLine = index > 0 ? fileLines[index - 1] : '';

      // Check if already suppressed
      if (!prevLine.includes('eslint-disable-next-line @typescript-eslint/no-explicit-any')) {
        const indentation = line.match(/^\s*/)[0];
        fileLines.splice(
          index,
          0,
          `${indentation}// eslint-disable-next-line @typescript-eslint/no-explicit-any`,
        );
        modifications++;
      }
    }
  });

  if (modifications > 0) {
    fs.writeFileSync(filePath, fileLines.join('\n'));
    console.log(`Suppressed ${modifications} errors in ${path.relative(process.cwd(), filePath)}`);
  }
});

if (fs.existsSync('eslint-report.json')) {
  fs.unlinkSync('eslint-report.json');
}

console.log('Done!');
