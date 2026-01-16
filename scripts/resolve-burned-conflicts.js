const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function resolveConflicts(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Regex to find conflict blocks
  // Matches <<<<<<< HEAD ... ======= ... >>>>>>> ...
  const conflictRegex = /<<<<<<< HEAD[\r\n]+([\s\S]*?)=======[\r\n]+([\s\S]*?)>>>>>>> [^\r\n]*/g;

  // Check if file has conflicts
  if (!content.match(conflictRegex)) {
    console.log(`No HEAD conflicts found in: ${filePath}`);
    return;
  }

  console.log(`Resolving conflicts in: ${filePath}`);

  // Replace with HEAD content (group 1)
  const newContent = content.replace(conflictRegex, (match, headContent, otherContent) => {
    // console.log('Keeping HEAD content, discarding:', otherContent.substring(0, 20) + '...');
    return headContent;
  });

  fs.writeFileSync(fullPath, newContent);
}

// Get files with conflicts using grep
try {
  const output = execSync('grep -r "<<<<<<< HEAD" app/api | cut -d: -f1 | sort | uniq').toString();
  const files = output.split('\n').filter(Boolean);

  console.log(`Found ${files.length} corrupted files.`);

  files.forEach(file => {
    resolveConflicts(file.trim());
  });

  console.log('Conflict resolution complete.');
} catch (error) {
  console.error('Error finding valid files or executing grep:', error.message);
}
