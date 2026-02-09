#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure reports directory exists
const reportsDir = path.join(process.cwd(), 'performance-reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

console.log('🚀 Starting Performance Audit for Recipes App...');
console.log('   Targeting: Recipes, Dishes, Menu Builder');

try {
  // Check if build exists, if not run it
  if (!fs.existsSync(path.join(process.cwd(), '.next'))) {
    console.log('📦 Building application...');
    execSync('npm run build', { stdio: 'inherit' });
  }

  // Run Lighthouse CI with custom config
  console.log('🔍 Running Lighthouse Audit...');
  execSync('lhci autorun --config=./lighthouserc.audit.js', { stdio: 'inherit' });

  console.log('✅ Audit Complete!');
  console.log(`📊 Reports generated in: ${path.join(reportsDir, 'lighthouse')}`);

  // Parse results to generate a summary
  const manifestPath = path.join(reportsDir, 'lighthouse', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('\n📈 Validation Summary:');

    manifest.forEach(run => {
      console.log(`\nURL: ${run.url}`);
      console.log(`Report: ${run.htmlPath}`);
    });
  }
} catch (error) {
  console.error('❌ Audit Failed:', error.message);
  process.exit(1);
}
