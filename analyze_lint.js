import fs from 'fs';

let content = fs.readFileSync('lint_results.json', 'utf8');
const jsonStart = content.indexOf('[');
if (jsonStart !== -1) {
  content = content.substring(jsonStart);
}

const data = JSON.parse(content);
const counts = data.map(file => {
  const anyWarnings = (file.messages || []).filter(m => m.ruleId === '@typescript-eslint/no-explicit-any').length;
  return {
    filePath: file.filePath,
    anyWarnings
  };
}).filter(f => f.anyWarnings > 0)
  .sort((a, b) => b.anyWarnings - a.anyWarnings);

console.log(JSON.stringify(counts.slice(0, 30), null, 2));
