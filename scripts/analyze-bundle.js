const fs = require('fs');
const path = require('path');

console.log('📦 Analyzing bundle composition...');

function analyzeBundle() {
  const nextDir = '.next';
  
  if (!fs.existsSync(nextDir)) {
    console.log('❌ .next directory not found. Run "npm run build" first.');
    return;
  }

  const staticDir = path.join(nextDir, 'static');
  if (!fs.existsSync(staticDir)) {
    console.log('❌ Static directory not found in .next');
    return;
  }

  let totalSize = 0;
  let chunkSizes = {};
  let fileCount = 0;

  function analyzeDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        analyzeDirectory(fullPath, relativePath);
      } else if (item.endsWith('.js') || item.endsWith('.css')) {
        const size = stat.size;
        totalSize += size;
        fileCount++;
        
        // Categorize by chunk type
        if (item.includes('chunk')) {
          chunkSizes[item] = size;
        }
      }
    }
  }

  analyzeDirectory(staticDir);

  console.log('\n📊 Bundle Analysis Results:');
  console.log(`   Total files: ${fileCount}`);
  console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Average file size: ${(totalSize / fileCount / 1024).toFixed(1)}KB`);

  // Sort chunks by size
  const sortedChunks = Object.entries(chunkSizes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  console.log('\n🔍 Largest chunks:');
  sortedChunks.forEach(([name, size]) => {
    const sizeKB = (size / 1024).toFixed(1);
    console.log(`   ${name}: ${sizeKB}KB`);
  });

  // Recommendations
  console.log('\n💡 Optimization Recommendations:');
  
  if (totalSize > 2000000) { // 2MB
    console.log('   ⚠️  Bundle size is large (>2MB)');
    console.log('   • Implement more aggressive code splitting');
    console.log('   • Consider lazy loading non-critical routes');
    console.log('   • Remove unused dependencies');
  }
  
  if (Object.keys(chunkSizes).length > 50) {
    console.log('   ⚠️  High number of chunks detected');
    console.log('   • Consider combining small chunks');
    console.log('   • Optimize dynamic imports');
  }

  const largestChunk = sortedChunks[0];
  if (largestChunk && largestChunk[1] > 500000) { // 500KB
    console.log(`   ⚠️  Largest chunk is ${(largestChunk[1] / 1024).toFixed(1)}KB`);
    console.log('   • Split large chunks into smaller modules');
    console.log('   • Use dynamic imports for heavy components');
  }

  return {
    totalSize,
    fileCount,
    chunkCount: Object.keys(chunkSizes).length,
    largestChunk: largestChunk ? largestChunk[1] : 0
  };
}

analyzeBundle();