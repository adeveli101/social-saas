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
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Build optimization
  swcMinify: true,
  
  // Disable telemetry
  telemetry: false,
};

module.exports = nextConfig;
