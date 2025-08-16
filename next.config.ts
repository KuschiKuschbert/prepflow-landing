import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Enable image optimization
  images: {
    unoptimized: false,
  },
  
  // Enable compression
  compress: true,
  
  // Enable powered by header for Vercel
  poweredByHeader: false,
};

export default nextConfig;
