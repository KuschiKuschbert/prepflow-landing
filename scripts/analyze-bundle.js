#!/usr/bin/env node

// Bundle analysis script for PrepFlow
// Analyzes bundle size, identifies optimization opportunities

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BUNDLE_ANALYSIS_CONFIG = {
  maxBundleSize: 500000, // 500KB
  maxChunkSize: 200000,  // 200KB
  maxAssetSize: 100000,  // 100KB
  criticalThreshold: 100000, // 100KB for critical assets
};

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function analyzeBundle() {
  log('🔍 PrepFlow Bundle Analysis Starting...', 'cyan');
  
  try {
    // Check if .next directory exists
    const nextDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(nextDir)) {
      log('❌ .next directory not found. Please run "npm run build" first.', 'red');
      process.exit(1);
    }
    
    // Analyze static chunks
    analyzeStaticChunks();
    
    // Analyze server chunks
    analyzeServerChunks();
    
    // Analyze build manifest
    analyzeBuildManifest();
    
    // Generate recommendations
    generateRecommendations();
    
    log('✅ Bundle analysis complete!', 'green');
    
  } catch (error) {
    log(`❌ Bundle analysis failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

function analyzeStaticChunks() {
  log('\n📊 Analyzing Static Chunks...', 'blue');
  
  const staticDir = path.join(process.cwd(), '.next/static');
  if (!fs.existsSync(staticDir)) {
    log('⚠️  No static directory found', 'yellow');
    return;
  }
  
  const chunks = [];
  const walkDir = (dir, basePath = '') => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.join(basePath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath, relativePath);
      } else if (file.endsWith('.js') || file.endsWith('.css')) {
        chunks.push({
          name: relativePath,
          size: stat.size,
          type: file.endsWith('.js') ? 'JavaScript' : 'CSS',
        });
      }
    });
  };
  
  walkDir(staticDir);
  
  // Sort by size
  chunks.sort((a, b) => b.size - a.size);
  
  // Display results
  log('\n📦 Largest Static Assets:', 'bold');
  chunks.slice(0, 10).forEach((chunk, index) => {
    const sizeKB = (chunk.size / 1024).toFixed(2);
    const color = chunk.size > BUNDLE_ANALYSIS_CONFIG.maxAssetSize ? 'red' : 
                  chunk.size > BUNDLE_ANALYSIS_CONFIG.maxAssetSize / 2 ? 'yellow' : 'green';
    
    log(`  ${index + 1}. ${chunk.name} (${sizeKB} KB) [${chunk.type}]`, color);
  });
  
  // Calculate totals
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const jsSize = chunks.filter(c => c.type === 'JavaScript').reduce((sum, chunk) => sum + chunk.size, 0);
  const cssSize = chunks.filter(c => c.type === 'CSS').reduce((sum, chunk) => sum + chunk.size, 0);
  
  log(`\n📈 Static Assets Summary:`, 'bold');
  log(`  Total Size: ${(totalSize / 1024).toFixed(2)} KB`, totalSize > BUNDLE_ANALYSIS_CONFIG.maxBundleSize ? 'red' : 'green');
  log(`  JavaScript: ${(jsSize / 1024).toFixed(2)} KB`, jsSize > BUNDLE_ANALYSIS_CONFIG.maxChunkSize ? 'red' : 'green');
  log(`  CSS: ${(cssSize / 1024).toFixed(2)} KB`, cssSize > BUNDLE_ANALYSIS_CONFIG.maxAssetSize ? 'red' : 'green');
  log(`  Asset Count: ${chunks.length}`, 'white');
}

function analyzeServerChunks() {
  log('\n🖥️  Analyzing Server Chunks...', 'blue');
  
  const serverDir = path.join(process.cwd(), '.next/server');
  if (!fs.existsSync(serverDir)) {
    log('⚠️  No server directory found', 'yellow');
    return;
  }
  
  const serverFiles = [];
  const walkDir = (dir, basePath = '') => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.join(basePath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath, relativePath);
      } else if (file.endsWith('.js')) {
        serverFiles.push({
          name: relativePath,
          size: stat.size,
        });
      }
    });
  };
  
  walkDir(serverDir);
  
  // Sort by size
  serverFiles.sort((a, b) => b.size - a.size);
  
  // Display results
  log('\n🖥️  Largest Server Files:', 'bold');
  serverFiles.slice(0, 10).forEach((file, index) => {
    const sizeKB = (file.size / 1024).toFixed(2);
    const color = file.size > BUNDLE_ANALYSIS_CONFIG.maxAssetSize ? 'red' : 
                  file.size > BUNDLE_ANALYSIS_CONFIG.maxAssetSize / 2 ? 'yellow' : 'green';
    
    log(`  ${index + 1}. ${file.name} (${sizeKB} KB)`, color);
  });
  
  const totalServerSize = serverFiles.reduce((sum, file) => sum + file.size, 0);
  log(`\n📈 Server Files Summary:`, 'bold');
  log(`  Total Size: ${(totalServerSize / 1024).toFixed(2)} KB`, 'white');
  log(`  File Count: ${serverFiles.length}`, 'white');
}

function analyzeBuildManifest() {
  log('\n📋 Analyzing Build Manifest...', 'blue');
  
  const manifestPath = path.join(process.cwd(), '.next/build-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    log('⚠️  No build manifest found', 'yellow');
    return;
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  log('\n📋 Build Manifest Analysis:', 'bold');
  
  // Analyze pages
  const pages = Object.keys(manifest.pages || {});
  log(`  Pages: ${pages.length}`, 'white');
  
  pages.forEach(page => {
    const assets = manifest.pages[page] || [];
    const jsAssets = assets.filter(asset => asset.endsWith('.js'));
    const cssAssets = assets.filter(asset => asset.endsWith('.css'));
    
    log(`    ${page}: ${jsAssets.length} JS, ${cssAssets.length} CSS`, 'white');
  });
  
  // Analyze app routes
  if (manifest.app) {
    const appRoutes = Object.keys(manifest.app);
    log(`  App Routes: ${appRoutes.length}`, 'white');
    
    appRoutes.forEach(route => {
      const assets = manifest.app[route] || [];
      const jsAssets = assets.filter(asset => asset.endsWith('.js'));
      const cssAssets = assets.filter(asset => asset.endsWith('.css'));
      
      log(`    ${route}: ${jsAssets.length} JS, ${cssAssets.length} CSS`, 'white');
    });
  }
}

function generateRecommendations() {
  log('\n💡 Optimization Recommendations:', 'magenta');
  
  const recommendations = [
    {
      category: 'Bundle Size',
      items: [
        'Consider code splitting for large components',
        'Use dynamic imports for non-critical features',
        'Optimize images with next/image',
        'Remove unused dependencies',
      ]
    },
    {
      category: 'Performance',
      items: [
        'Implement service worker for caching',
        'Use WebP/AVIF image formats',
        'Enable compression (gzip/brotli)',
        'Optimize font loading',
      ]
    },
    {
      category: 'SEO',
      items: [
        'Ensure proper meta tags',
        'Implement structured data',
        'Optimize for Core Web Vitals',
        'Use semantic HTML',
      ]
    },
    {
      category: 'Accessibility',
      items: [
        'Add proper ARIA labels',
        'Ensure keyboard navigation',
        'Check color contrast ratios',
        'Add alt text to images',
      ]
    }
  ];
  
  recommendations.forEach(rec => {
    log(`\n  ${rec.category}:`, 'bold');
    rec.items.forEach(item => {
      log(`    • ${item}`, 'white');
    });
  });
  
  log('\n🚀 Run "npm run analyze" to get detailed bundle analysis', 'cyan');
}

// Run analysis
if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };
