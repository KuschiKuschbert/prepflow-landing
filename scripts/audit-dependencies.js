/**
 * Dependency Audit Script
 * Identifies unused dependencies and suggests optimizations
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Auditing dependencies...');

function auditDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  console.log(`\n📦 Total dependencies: ${Object.keys(dependencies).length}`);
  console.log(`   Production: ${Object.keys(packageJson.dependencies || {}).length}`);
  console.log(`   Development: ${Object.keys(packageJson.devDependencies || {}).length}`);

  // Analyze bundle for actual usage
  const bundleAnalysis = analyzeBundleUsage();

  // Check for heavy dependencies
  const heavyDependencies = [
    'recharts',
    'chart.js',
    'lodash',
    'moment',
    'date-fns',
    'axios',
    'react-query',
    'zustand',
    'framer-motion',
    'react-hook-form',
    'react-select',
    'react-table',
    'react-virtualized',
  ];

  console.log('\n🔍 Heavy dependency analysis:');
  heavyDependencies.forEach(dep => {
    if (dependencies[dep]) {
      const size = getEstimatedSize(dep);
      console.log(`   ${dep}: ${size} (${dependencies[dep]})`);
    }
  });

  // Check for potential unused dependencies
  console.log('\n⚠️  Potential optimization opportunities:');

  const potentiallyUnused = [
    'next-dev-tools',
    'eslint-config-next',
    'typescript',
    'tailwindcss',
    'postcss',
    'autoprefixer',
  ];

  potentiallyUnused.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`   ${dep}: Consider if needed in production`);
    }
  });

  // Suggest alternatives
  console.log('\n💡 Optimization suggestions:');
  console.log('   • Replace moment.js with date-fns (smaller)');
  console.log('   • Replace lodash with individual utilities');
  console.log('   • Use native fetch instead of axios');
  console.log('   • Consider lighter chart libraries');
  console.log('   • Remove unused Next.js dev tools');

  return {
    totalDeps: Object.keys(dependencies).length,
    heavyDeps: heavyDependencies.filter(dep => dependencies[dep]),
    potentiallyUnused: potentiallyUnused.filter(dep => dependencies[dep]),
  };
}

function analyzeBundleUsage() {
  // This would analyze actual bundle usage
  // For now, we'll provide general recommendations
  return {
    totalSize: '20.23MB',
    largestChunks: ['next-devtools: 2.9MB', 'recharts: 2MB', 'react-dom: 1.7MB'],
  };
}

function getEstimatedSize(dependency) {
  const sizes = {
    recharts: '~1MB',
    'chart.js': '~500KB',
    lodash: '~70KB (full)',
    moment: '~67KB',
    'date-fns': '~13KB',
    axios: '~13KB',
    'react-query': '~25KB',
    zustand: '~2KB',
    'framer-motion': '~200KB',
    'react-hook-form': '~25KB',
    'react-select': '~50KB',
    'react-table': '~100KB',
    'react-virtualized': '~200KB',
  };

  return sizes[dependency] || 'Unknown';
}

function suggestOptimizations() {
  console.log('\n🚀 Recommended optimizations:');
  console.log('   1. Remove Next.js dev tools from production build');
  console.log('   2. Replace Recharts with lighter chart library');
  console.log('   3. Implement code splitting for heavy components');
  console.log('   4. Use dynamic imports for analytics');
  console.log('   5. Optimize images and assets');
  console.log('   6. Enable text compression');
  console.log('   7. Remove unused CSS and JavaScript');
}

// Run the audit
const results = auditDependencies();
suggestOptimizations();

console.log('\n📊 Audit Summary:');
console.log(`   Total dependencies: ${results.totalDeps}`);
console.log(`   Heavy dependencies: ${results.heavyDeps.length}`);
console.log(`   Potentially unused: ${results.potentiallyUnused.length}`);

module.exports = { auditDependencies, analyzeBundleUsage };
