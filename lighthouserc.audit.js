module.exports = {
  ci: {
    collect: {
      startServerCommand: process.env.CI ? undefined : 'npm start',
      startServerReadyPattern: 'ready - started server',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      url: [
        'http://localhost:3000/webapp/recipes',
        'http://localhost:3000/webapp/recipes#ingredients',
        'http://localhost:3000/webapp/recipes#dishes',
        'http://localhost:3000/webapp/recipes#menu-builder',
      ],
      settings: {
        // Use desktop config as requested by user context implies internal tool usage
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        // Skip auditing for PWA features as this is a webapp
        skipAudits: ['pwa-cross-browser', 'pwa-page-transitions', 'pwa-each-page-has-url'],
      },
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './performance-reports/lighthouse',
    },
  },
};
