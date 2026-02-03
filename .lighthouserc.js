// Lighthouse CI configuration for PrepFlow
// Performance regression testing and monitoring

module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        'http://localhost:3000',
        'http://localhost:3000/webapp',
        'http://localhost:3000/webapp/ingredients',
        'http://localhost:3000/webapp/recipes',
        'http://localhost:3000/webapp/cogs',
      ],
      // Number of runs per URL
      numberOfRuns: 3,
      // Settings for each run
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        // Emulate mobile device
        emulatedFormFactor: 'mobile',
        // Throttling settings
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        // Screen emulation
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
        },
        // Bypass authentication for performance testing
        extraHeaders: process.env.PERFORMANCE_TEST_TOKEN
          ? { 'x-prepflow-perf-bypass': process.env.PERFORMANCE_TEST_TOKEN }
          : undefined,
      },
    },
    assert: {
      // Performance assertions
      assertions: {
        // Core Web Vitals
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],

        // Specific metrics
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        interactive: ['error', { maxNumericValue: 3800 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 0 }],
        'unused-javascript': ['warn', { maxLength: 0 }],
        'modern-image-formats': ['error', { maxLength: 0 }],
        'uses-optimized-images': ['error', { maxLength: 0 }],
        'uses-text-compression': ['error', { maxLength: 0 }],
        'uses-responsive-images': ['error', { maxLength: 0 }],

        // Bundle size
        'total-byte-weight': ['error', { maxNumericValue: 2000000 }], // 2MB
        'mainthread-work-breakdown': ['error', { maxNumericValue: 4000 }],

        // Accessibility
        'color-contrast': ['error', { maxLength: 0 }],
        'image-alt': ['error', { maxLength: 0 }],
        label: ['error', { maxLength: 0 }],
        'link-name': ['error', { maxLength: 0 }],

        // SEO
        'meta-description': ['error', { maxLength: 0 }],
        'document-title': ['error', { maxLength: 0 }],
        'crawlable-anchors': ['error', { maxLength: 0 }],
        'is-crawlable': ['error', { maxLength: 0 }],
      },
    },
    upload: {
      // Upload results to Lighthouse CI server (optional)
      target: 'temporary-public-storage',
    },
    // Performance budgets
    budgets: [
      {
        path: '/*',
        timings: [
          {
            metric: 'first-contentful-paint',
            budget: 1800,
          },
          {
            metric: 'largest-contentful-paint',
            budget: 2500,
          },
          {
            metric: 'speed-index',
            budget: 3000,
          },
          {
            metric: 'interactive',
            budget: 3800,
          },
        ],
        resourceSizes: [
          {
            resourceType: 'script',
            budget: 1500000, // 1.5MB
          },
          {
            resourceType: 'total',
            budget: 2000000, // 2MB
          },
        ],
        resourceCounts: [
          {
            resourceType: 'third-party',
            budget: 10,
          },
        ],
      },
    ],
  },
};
