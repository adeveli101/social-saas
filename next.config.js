/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimized output
  output: 'standalone',

  // Optimize images for production
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: [
      'localhost',
      'picsum.photos',
      'images.clerk.dev',
      'img.clerk.com',
      'replicate.delivery',
    ],
    remotePatterns: [
      { protocol: 'https', hostname: '**.blob.core.windows.net' },
      { protocol: 'https', hostname: '**.replicate.com' },
    ],
  },

  // Production optimizations
  experimental: {
    optimizePackageImports: ['aos', 'lucide-react', 'framer-motion'],
    optimizeCss: true,
  },

  // Production webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    // Fallback for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
