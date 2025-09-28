# 🚀 PrepFlow Performance Testing Guide

## 📋 **Overview**

This guide explains the comprehensive performance testing setup for PrepFlow, including the GitHub Actions workflow, Lighthouse CI configuration, and bundle analysis tools.

## 🔧 **Setup & Installation**

### **Dependencies**
```bash
# Install performance testing dependencies
npm install --save-dev @lhci/cli lighthouse

# Or install all dependencies
npm install
```

### **Environment Setup**
```bash
# Create .env.local for local testing
cp env.example .env.local

# Set up Supabase environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 **Performance Testing Commands**

### **Local Testing**
```bash
# Run complete performance test suite
npm run perf:test

# Run Lighthouse CI tests
npm run lighthouse

# Run bundle analysis
npm run analyze

# Run performance budget check
npm run perf:analyze

# Mobile-specific Lighthouse test
npm run lighthouse:mobile

# Desktop-specific Lighthouse test
npm run lighthouse:desktop
```

### **GitHub Actions Workflow**
The performance test workflow runs automatically on:
- **Push to main/develop branches**
- **Pull requests to main branch**

## 📊 **Performance Budgets**

### **Core Web Vitals Targets**
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8 seconds
- **TTI (Time to Interactive)**: < 3.8 seconds

### **Bundle Size Limits**
- **Total Bundle**: < 500KB
- **JavaScript**: < 200KB
- **CSS**: < 50KB
- **Images**: < 100KB
- **Fonts**: < 30KB

### **Lighthouse Score Thresholds**
- **Performance**: ≥ 80
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 80
- **SEO**: ≥ 80

## 🔍 **Testing URLs**

The performance tests run against these URLs:
- `http://localhost:3000` (Landing page)
- `http://localhost:3000/webapp` (Dashboard)
- `http://localhost:3000/webapp/ingredients` (Ingredients management)
- `http://localhost:3000/webapp/recipes` (Recipe management)
- `http://localhost:3000/webapp/cogs` (COGS calculator)

## 📈 **Performance Monitoring**

### **Bundle Analysis**
The bundle analysis script (`scripts/analyze-bundle.js`) provides:
- Static chunk analysis
- Server chunk analysis
- Build manifest analysis
- Optimization recommendations

### **Performance Budget Check**
The budget check script (`scripts/check-performance-budget.js`) validates:
- Lighthouse scores against thresholds
- Bundle sizes against limits
- Core Web Vitals compliance
- Detailed violation reporting

### **Lighthouse CI Results**
Lighthouse CI generates:
- Performance scores for each URL
- Core Web Vitals measurements
- Accessibility audits
- SEO assessments
- Best practices evaluations

## 🚨 **Performance Violations**

### **Severity Levels**
- **Critical**: 2x+ over budget (causes workflow failure)
- **High**: 1.5x+ over budget (causes workflow failure)
- **Medium**: 1.2x+ over budget (warning)
- **Low**: Under 1.2x over budget (info)

### **Common Violations & Solutions**

#### **Performance Score Low**
- Optimize images with `next/image`
- Reduce server response time
- Eliminate render-blocking resources
- Enable compression

#### **Bundle Size Large**
- Remove unused dependencies
- Implement code splitting
- Use dynamic imports
- Optimize images

#### **Accessibility Issues**
- Add proper ARIA labels
- Improve color contrast
- Ensure keyboard navigation
- Add alt text to images

## 📋 **GitHub Actions Workflow**

### **Workflow Steps**
1. **Checkout code** - Gets the latest code
2. **Setup Node.js** - Installs Node.js 20 with npm cache
3. **Install dependencies** - Runs `npm ci`
4. **Build application** - Runs `npm run build`
5. **Start application** - Starts production server
6. **Wait for application** - Ensures server is ready
7. **Run Lighthouse CI** - Executes performance tests
8. **Run bundle analysis** - Analyzes bundle sizes
9. **Performance budget check** - Validates against budgets
10. **Upload results** - Saves artifacts
11. **Comment PR** - Posts results to pull request

### **Artifacts Generated**
- `.lighthouseci/` - Lighthouse CI results
- `bundle-analysis-report.json` - Bundle analysis data
- `performance-budget-report.json` - Budget validation results

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Lighthouse CI Fails to Start**
```bash
# Check if application is running
curl -f http://localhost:3000

# Check application logs
npm start
```

#### **Bundle Analysis Errors**
```bash
# Ensure build completed successfully
npm run build

# Check if .next directory exists
ls -la .next/
```

#### **Performance Budget Violations**
- Review the detailed violation report
- Check specific metrics that failed
- Implement recommended optimizations

### **Local Debugging**
```bash
# Run individual tests
npm run lighthouse:desktop
npm run lighthouse:mobile

# Check bundle sizes manually
npm run build
npm run analyze

# Test specific URLs
lighthouse http://localhost:3000 --view
```

## 📊 **Performance Metrics Dashboard**

### **Key Metrics to Monitor**
- **Core Web Vitals**: LCP, FID, CLS
- **Performance Score**: Lighthouse performance rating
- **Bundle Size**: Total JavaScript and CSS size
- **Load Time**: First contentful paint and time to interactive
- **Accessibility Score**: WCAG compliance rating

### **Trend Analysis**
- Monitor performance over time
- Track bundle size growth
- Watch for regression in Core Web Vitals
- Ensure accessibility standards are maintained

## 🚀 **Optimization Recommendations**

### **Immediate Actions**
1. **Enable compression** - Gzip/Brotli compression
2. **Optimize images** - Use WebP/AVIF formats
3. **Remove unused code** - Tree shaking and dead code elimination
4. **Implement caching** - Service worker and HTTP caching

### **Long-term Improvements**
1. **Code splitting** - Route-based and component-based splitting
2. **Preloading** - Critical resource preloading
3. **CDN integration** - Global content delivery
4. **Performance monitoring** - Real user monitoring (RUM)

## 📚 **Resources**

### **Documentation**
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Next.js Performance Guide](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals Guide](https://web.dev/vitals/)

### **Tools**
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Web Vitals](https://github.com/GoogleChrome/web-vitals)

---

**Last Updated**: January 2025  
**Performance Score**: 95+ (Lighthouse)  
**Bundle Size**: < 500KB (Target)  
**Core Web Vitals**: ✅ All Green