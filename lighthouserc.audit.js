module.exports = {
  ci: {
    collect: {
      startServerCommand:
        'AUTH0_BYPASS_DEV=true PERFORMANCE_TEST_TOKEN=perf-test-secret npm start -- -p 3005',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 120000,
      numberOfRuns: 1, // Dev server is slow, but we just need a baseline
      url: [
        'http://localhost:3005/',
        'http://localhost:3005/webapp',
        'http://localhost:3005/webapp/recipes',
        'http://localhost:3005/webapp/ingredients',
        'http://localhost:3005/webapp/menu-builder',
        'http://localhost:3005/webapp/performance',
        'http://localhost:3005/webapp/compliance',
        'http://localhost:3005/webapp/settings',
        'http://localhost:3005/webapp/staff',
        'http://localhost:3005/webapp/suppliers',
      ],
      chromeFlags:
        '--no-sandbox --disable-setuid-sandbox --ignore-certificate-errors --disable-dev-shm-usage --disable-gpu',
      extraHeaders: {
        Cookie: 'prepflow-perf-bypass=perf-test-secret',
        'x-prepflow-perf-bypass': 'perf-test-secret',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
