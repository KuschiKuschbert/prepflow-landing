const fs = require('fs');
const path = require('path');

const reportsDir = path.join(process.cwd(), 'performance-reports', 'puppeteer');
const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.report.json'));

console.log('📊 Performance Audit Summary');
console.log('============================');

const summary = [];

files.forEach(file => {
  const filePath = path.join(reportsDir, file);
  try {
    const report = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const url = report.finalUrl;
    const performance = report.categories.performance.score * 100;
    const accessibility = report.categories.accessibility.score * 100;
    const bestPractices = report.categories['best-practices'].score * 100;
    const seo = report.categories.seo.score * 100;

    // Key Metrics
    const lcp = report.audits['largest-contentful-paint'].displayValue;
    const tbt = report.audits['total-blocking-time'].displayValue;
    const cls = report.audits['cumulative-layout-shift'].displayValue;

    summary.push({
      file,
      url,
      scores: {
        performance,
        accessibility,
        bestPractices,
        seo,
      },
      metrics: {
        lcp,
        tbt,
        cls,
      },
    });

    console.log(`\nURL: ${url}`);
    console.log(`Scores:`);
    console.log(`  Performance:    ${performance.toFixed(0)}`);
    console.log(`  Accessibility:  ${accessibility.toFixed(0)}`);
    console.log(`  Best Practices: ${bestPractices.toFixed(0)}`);
    console.log(`  SEO:            ${seo.toFixed(0)}`);
    console.log(`Metrics:`);
    console.log(`  LCP: ${lcp}`);
    console.log(`  TBT: ${tbt}`);
    console.log(`  CLS: ${cls}`);
  } catch (error) {
    console.error(`Error reading ${file}:`, error.message);
  }
});

// Generate Markdown Table
console.log('\nMarkdown Summary:');
console.log('| Page | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |');
console.log('|---|---|---|---|---|---|---|---|');
summary.forEach(item => {
  const name = item.file.replace('.report.json', '').replace(/-/g, ' ');
  console.log(
    `| ${name} | ${item.scores.performance.toFixed(0)} | ${item.scores.accessibility.toFixed(0)} | ${item.scores.bestPractices.toFixed(0)} | ${item.scores.seo.toFixed(0)} | ${item.metrics.lcp} | ${item.metrics.tbt} | ${item.metrics.cls} |`,
  );
});
