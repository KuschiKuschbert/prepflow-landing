import type { NextConfig } from 'next';

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Let Vercel handle compression automatically
  compress: false,

  // Performance optimizations
  poweredByHeader: false,
  generateEtags: true,

  // Image optimization with advanced settings
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90], // Support both default (75) and high quality (90)
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: [
      '@supabase/supabase-js',
      '@vercel/analytics',
      'recharts',
      'lucide-react',
      'framer-motion',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@tanstack/react-query',
    ],
    // Enable modern bundling (disabled for Turbopack compatibility)
    // esmExternals: true, // Disabled - causes module import errors with Turbopack
    // Optimize CSS loading to prevent unused preloads
    optimizeCss: true,
  },

  // Remove dev tools from production
  ...(process.env.NODE_ENV === 'production'
    ? {
        webpack: (config, { dev, isServer }) => {
          // Remove Next.js dev tools from production
          config.resolve.alias = {
            ...config.resolve.alias,
            'next/dist/compiled/next-dev-tools': false,
          };

          return config;
        },
      }
    : {}),

  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack configuration with advanced optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Advanced bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 150000, // Further reduced for better code splitting (was 200KB)
        cacheGroups: {
          // Vendor chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          // Analytics chunk
          analytics: {
            test: /[\\/]node_modules[\\/](@vercel\/analytics|gtag)[\\/]/,
            name: 'analytics',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Supabase chunk (async - only load when needed)
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'async', // Async loading - only load when Supabase is actually used
            priority: 15,
            reuseExistingChunk: true,
          },
          // React chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Framer Motion chunk (heavy animation library - lazy loaded in most places)
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'async', // Only load when needed (page transitions, arcade components)
            priority: 20,
            reuseExistingChunk: true,
          },
          // DnD Kit chunk (drag and drop library - only used in menu-builder)
          dndKit: {
            test: /[\\/]node_modules[\\/]@dnd-kit[\\/]/,
            name: 'dnd-kit',
            chunks: 'async', // Only load when needed (menu-builder route)
            priority: 20,
            reuseExistingChunk: true,
          },
          // Recharts chunk (charting library - already lazy loaded)
          // Higher priority and enforce single chunk to prevent splitting
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: 'recharts',
            chunks: 'async', // Only load when needed (lazy loaded)
            priority: 30, // Higher priority to ensure single chunk
            enforce: true, // Force single chunk (ignore maxSize)
            reuseExistingChunk: true,
          },
          // React Query chunk (data fetching library - can be async)
          reactQuery: {
            test: /[\\/]node_modules[\\/]@tanstack\/react-query[\\/]/,
            name: 'react-query',
            chunks: 'async', // Only load when React Query is used
            priority: 20,
            reuseExistingChunk: true,
          },
          // Server-only dependencies (exclude from client bundle)
          // Note: These are automatically excluded from client bundle by Next.js
          // No need for special webpack config - Next.js handles server/client separation
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Module concatenation
      config.optimization.concatenateModules = true;

      // CSS optimization to prevent unused preloads
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss|sass)$/,
        chunks: 'all',
        enforce: true,
        priority: 30,
      };
    }

    // Font optimization handled by Next.js built-in font optimization
    // Removed conflicting file-loader rule that was causing 404 errors

    return config;
  },

  // Redirects for SEO (301 permanent redirects for moved pages)
  async redirects() {
    return [
      {
        source: '/webapp/ingredients',
        destination: '/webapp/recipes#ingredients',
        permanent: true, // 301 redirect
      },
      {
        source: '/webapp/cogs',
        destination: '/webapp/recipes#dishes',
        permanent: true, // 301 redirect
      },
      {
        source: '/webapp/dish-builder',
        destination: '/webapp/recipes?builder=true#dishes',
        permanent: true, // 301 redirect
      },
    ];
  },

  // Headers for performance and security
  async headers() {
    const baseHeaders = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://va.vercel-scripts.com; connect-src 'self' https: wss: https://*.supabase.co wss://*.supabase.co https://vercel.live https://dev-7myakdl4itf644km.us.auth0.com; frame-src 'self' https://vercel.live https://dev-7myakdl4itf644km.us.auth0.com; frame-ancestors 'none'",
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ];

    // Development: Disable caching for webapp routes to prevent stale component issues
    // TEMPORARILY DISABLED - causing config compilation error
    // TODO: Re-enable with proper syntax after debugging
    // if (process.env.NODE_ENV === 'development') {
    //   baseHeaders.push({
    //     source: '/webapp/(.*)',
    //     headers: [
    //       {
    //         key: 'Cache-Control',
    //         value: 'no-cache, no-store, must-revalidate, max-age=0',
    //       },
    //       {
    //         key: 'Pragma',
    //         value: 'no-cache',
    //       },
    //       {
    //         key: 'Expires',
    //         value: '0',
    //       },
    //     ],
    //   });
    // }

    const headers = [
      ...baseHeaders,
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];

    // Add compression headers only in production
    if (process.env.NODE_ENV === 'production') {
      headers.forEach(headerGroup => {
        if (headerGroup.source === '/(.*)' || headerGroup.source === '/api/(.*)') {
          // Remove explicit compression headers - let Vercel handle compression automatically
          // headerGroup.headers.push({
          //   key: 'Content-Encoding',
          //   value: 'gzip, br',
          // });
        }
      });
    }

    return headers;
  },
};

export default withBundleAnalyzer(nextConfig);
