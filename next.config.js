/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Amplify
  output: 'standalone',
  
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  
  // Enable experimental features for Next.js 15
  experimental: {
    // Enable new features
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Disable telemetry
  telemetry: false,
};

module.exports = nextConfig;
