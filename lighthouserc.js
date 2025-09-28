// Lighthouse CI configuration for PrepFlow
// Optimized for restaurant profitability platform performance testing

module.exports = {
  ci: {
    collect: {
      // Test URLs
      url: [
        'http://localhost:3000',
        'http://localhost:3000/webapp',
        'http://localhost:3000/webapp/ingredients',
        'http://localhost:3000/webapp/recipes',
        'http://localhost:3000/webapp/cogs',
      ],
      
      // Number of runs for statistical significance
      numberOfRuns: 3,
      
      // Device settings
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    
    assert: {
      // Performance budgets based on PrepFlow requirements
      assertions: {
        // Core Web Vitals
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        
        // Core Web Vitals thresholds
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // Performance metrics
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'time-to-interactive': ['error', { maxNumericValue: 3800 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxNumericValue: 2 }],
        'unused-javascript': ['warn', { maxNumericValue: 2 }],
        'modern-image-formats': ['warn', { maxNumericValue: 1 }],
        'efficient-animated-content': ['warn', { maxNumericValue: 1 }],
        
        // SEO and accessibility
        'meta-description': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'button-name': 'error',
      },
    },
    
    upload: {
      // Upload results to Lighthouse CI server (optional)
      target: 'temporary-public-storage',
    },
    
    server: {
      // Local server configuration
      port: 9001,
      storage: {
        storageMethod: 'filesystem',
        storagePath: '.lighthouseci',
      },
    },
  },
};