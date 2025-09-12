#!/usr/bin/env node

/**
 * Performance optimization script for PrepFlow
 * Analyzes bundle size, identifies optimization opportunities, and generates reports
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PerformanceOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.report = {
      timestamp: new Date().toISOString(),
      bundleAnalysis: {},
      recommendations: [],
      optimizations: [],
    };
  }

  async run() {
    console.log('🚀 Starting PrepFlow Performance Optimization...\n');

    try {
      await this.analyzeBundleSize();
      await this.analyzeImages();
      await this.analyzeFonts();
      await this.checkCriticalResources();
      await this.generateRecommendations();
      await this.generateReport();

      console.log('\n✅ Performance optimization complete!');
      console.log(`📊 Report generated: ${this.projectRoot}/performance-report.json`);
    } catch (error) {
      console.error('❌ Performance optimization failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeBundleSize() {
    console.log('📦 Analyzing bundle size...');

    try {
      // Run bundle analyzer
      execSync('npm run bundle:analyze', { stdio: 'pipe' });
      
      // Check if .next/analyze directory exists
      const analyzeDir = path.join(this.projectRoot, '.next/analyze');
      if (fs.existsSync(analyzeDir)) {
        const files = fs.readdirSync(analyzeDir);
        this.report.bundleAnalysis = {
          hasAnalysis: true,
          files: files,
          totalSize: this.calculateDirectorySize(analyzeDir),
        };
      }

      // Check main bundle sizes
      const staticDir = path.join(this.projectRoot, '.next/static');
      if (fs.existsSync(staticDir)) {
        const chunks = fs.readdirSync(staticDir).filter(f => f.includes('chunks'));
        const chunkSizes = chunks.map(chunk => ({
          name: chunk,
          size: this.calculateDirectorySize(path.join(staticDir, chunk)),
        }));
        
        this.report.bundleAnalysis.chunkSizes = chunkSizes;
        this.report.bundleAnalysis.totalChunkSize = chunkSizes.reduce((sum, chunk) => sum + chunk.size, 0);
      }

    } catch (error) {
      console.warn('⚠️ Bundle analysis failed:', error.message);
      this.report.bundleAnalysis = { error: error.message };
    }
  }

  async analyzeImages() {
    console.log('🖼️ Analyzing images...');

    const publicDir = path.join(this.projectRoot, 'public');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];
    
    if (fs.existsSync(publicDir)) {
      const images = this.findFiles(publicDir, imageExtensions);
      const imageAnalysis = images.map(img => ({
        path: path.relative(this.projectRoot, img),
        size: fs.statSync(img).size,
        extension: path.extname(img),
        optimized: img.includes('.webp') || img.includes('.avif'),
      }));

      this.report.imageAnalysis = {
        totalImages: images.length,
        totalSize: imageAnalysis.reduce((sum, img) => sum + img.size, 0),
        optimizedImages: imageAnalysis.filter(img => img.optimized).length,
        images: imageAnalysis,
      };
    }
  }

  async analyzeFonts() {
    console.log('🔤 Analyzing fonts...');

    const publicDir = path.join(this.projectRoot, 'public');
    const fontExtensions = ['.woff', '.woff2', '.ttf', '.otf', '.eot'];
    
    if (fs.existsSync(publicDir)) {
      const fonts = this.findFiles(publicDir, fontExtensions);
      const fontAnalysis = fonts.map(font => ({
        path: path.relative(this.projectRoot, font),
        size: fs.statSync(font).size,
        extension: path.extname(font),
        optimized: font.includes('.woff2'),
      }));

      this.report.fontAnalysis = {
        totalFonts: fonts.length,
        totalSize: fontAnalysis.reduce((sum, font) => sum + font.size, 0),
        optimizedFonts: fontAnalysis.filter(font => font.optimized).length,
        fonts: fontAnalysis,
      };
    }
  }

  async checkCriticalResources() {
    console.log('⚡ Checking critical resources...');

    const criticalChecks = {
      hasPreload: false,
      hasPrefetch: false,
      hasCriticalCSS: false,
      hasServiceWorker: false,
    };

    // Check layout.tsx for resource hints
    const layoutPath = path.join(this.projectRoot, 'app/layout.tsx');
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      criticalChecks.hasPreload = layoutContent.includes('preload');
      criticalChecks.hasPrefetch = layoutContent.includes('prefetch');
      criticalChecks.hasCriticalCSS = layoutContent.includes('critical');
    }

    // Check for service worker
    const swPath = path.join(this.projectRoot, 'public/sw.js');
    criticalChecks.hasServiceWorker = fs.existsSync(swPath);

    this.report.criticalResources = criticalChecks;
  }

  async generateRecommendations() {
    console.log('💡 Generating recommendations...');

    const recommendations = [];

    // Bundle size recommendations
    if (this.report.bundleAnalysis.totalChunkSize > 500000) { // 500KB
      recommendations.push({
        type: 'bundle-size',
        priority: 'high',
        title: 'Bundle size is large',
        description: `Total chunk size is ${Math.round(this.report.bundleAnalysis.totalChunkSize / 1024)}KB`,
        action: 'Consider code splitting and lazy loading',
      });
    }

    // Image optimization recommendations
    if (this.report.imageAnalysis && this.report.imageAnalysis.optimizedImages < this.report.imageAnalysis.totalImages * 0.5) {
      recommendations.push({
        type: 'image-optimization',
        priority: 'medium',
        title: 'Images not optimized',
        description: `Only ${this.report.imageAnalysis.optimizedImages}/${this.report.imageAnalysis.totalImages} images are optimized`,
        action: 'Convert images to WebP/AVIF format',
      });
    }

    // Font optimization recommendations
    if (this.report.fontAnalysis && this.report.fontAnalysis.optimizedFonts < this.report.fontAnalysis.totalFonts) {
      recommendations.push({
        type: 'font-optimization',
        priority: 'medium',
        title: 'Fonts not optimized',
        description: `${this.report.fontAnalysis.totalFonts - this.report.fontAnalysis.optimizedFonts} fonts are not in WOFF2 format`,
        action: 'Convert fonts to WOFF2 format',
      });
    }

    // Critical resource recommendations
    if (!this.report.criticalResources.hasPreload) {
      recommendations.push({
        type: 'resource-hints',
        priority: 'high',
        title: 'Missing resource preloading',
        description: 'No preload hints found for critical resources',
        action: 'Add preload hints for critical fonts and images',
      });
    }

    if (!this.report.criticalResources.hasServiceWorker) {
      recommendations.push({
        type: 'service-worker',
        priority: 'low',
        title: 'No service worker',
        description: 'Service worker not implemented',
        action: 'Implement service worker for caching and offline support',
      });
    }

    this.report.recommendations = recommendations;
  }

  async generateReport() {
    console.log('📊 Generating performance report...');

    const reportPath = path.join(this.projectRoot, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport();
    const markdownPath = path.join(this.projectRoot, 'PERFORMANCE_REPORT.md');
    fs.writeFileSync(markdownPath, markdownReport);
  }

  generateMarkdownReport() {
    const { recommendations, bundleAnalysis, imageAnalysis, fontAnalysis, criticalResources } = this.report;

    return `# PrepFlow Performance Report

Generated: ${this.report.timestamp}

## 📊 Bundle Analysis

${bundleAnalysis.error ? `❌ Error: ${bundleAnalysis.error}` : `
- **Total Chunk Size**: ${bundleAnalysis.totalChunkSize ? Math.round(bundleAnalysis.totalChunkSize / 1024) + 'KB' : 'N/A'}
- **Chunks**: ${bundleAnalysis.chunkSizes ? bundleAnalysis.chunkSizes.length : 0}
- **Bundle Analysis**: ${bundleAnalysis.hasAnalysis ? '✅ Available' : '❌ Not available'}
`}

## 🖼️ Image Analysis

${imageAnalysis ? `
- **Total Images**: ${imageAnalysis.totalImages}
- **Total Size**: ${Math.round(imageAnalysis.totalSize / 1024)}KB
- **Optimized Images**: ${imageAnalysis.optimizedImages}/${imageAnalysis.totalImages} (${Math.round(imageAnalysis.optimizedImages / imageAnalysis.totalImages * 100)}%)
` : 'No images found'}

## 🔤 Font Analysis

${fontAnalysis ? `
- **Total Fonts**: ${fontAnalysis.totalFonts}
- **Total Size**: ${Math.round(fontAnalysis.totalSize / 1024)}KB
- **Optimized Fonts**: ${fontAnalysis.optimizedFonts}/${fontAnalysis.totalFonts} (${Math.round(fontAnalysis.optimizedFonts / fontAnalysis.totalFonts * 100)}%)
` : 'No fonts found'}

## ⚡ Critical Resources

- **Preload Hints**: ${criticalResources.hasPreload ? '✅' : '❌'}
- **Prefetch Hints**: ${criticalResources.hasPrefetch ? '✅' : '❌'}
- **Critical CSS**: ${criticalResources.hasCriticalCSS ? '✅' : '❌'}
- **Service Worker**: ${criticalResources.hasServiceWorker ? '✅' : '❌'}

## 💡 Recommendations

${recommendations.map((rec, index) => `
### ${index + 1}. ${rec.title} ${rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'}

**Priority**: ${rec.priority.toUpperCase()}

**Issue**: ${rec.description}

**Action**: ${rec.action}
`).join('\n')}

## 🚀 Next Steps

1. Review recommendations above
2. Implement high-priority optimizations first
3. Test performance improvements
4. Monitor Core Web Vitals
5. Re-run this analysis after optimizations

---

*This report was generated by the PrepFlow Performance Optimizer*
`;
  }

  findFiles(dir, extensions) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        results = results.concat(this.findFiles(filePath, extensions));
      } else if (extensions.includes(path.extname(file).toLowerCase())) {
        results.push(filePath);
      }
    });
    
    return results;
  }

  calculateDirectorySize(dir) {
    let size = 0;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        size += this.calculateDirectorySize(filePath);
      } else {
        size += stat.size;
      }
    });
    
    return size;
  }
}

// Run the optimizer
if (require.main === module) {
  const optimizer = new PerformanceOptimizer();
  optimizer.run().catch(console.error);
}

module.exports = PerformanceOptimizer;
