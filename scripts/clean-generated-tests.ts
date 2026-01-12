import fs from 'fs';
import { glob } from 'glob';

const pattern = 'glob:{components,lib,utils,hooks}/**/*.{test,spec}.{ts,tsx,js,jsx}';
// Use manual glob pattern since different versions behave differently
const files = glob.sync('{components,lib,utils,hooks}/**/*.{test,spec}.{ts,tsx,js,jsx}');

console.log(`Scanning ${files.length} test files for cleanup...`);

let deleted = 0;

for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes("smoke test") || content.includes("needs implementation")) {
        fs.unlinkSync(file);
        console.log(`Deleted generated test: ${file}`);
        deleted++;
    }
}

console.log(`\nDeleted ${deleted} generated test files.`);
