/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/socket',
        destination: '/api/socket',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache globally to prevent ENOENT errors
    config.cache = false;

    // Optimize memory usage
    config.optimization = {
      ...config.optimization,
      minimize: !dev,
      runtimeChunk: isServer ? false : 'single',
      splitChunks: isServer ? false : {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              try {
                const match = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                const packageName = match?.[1] || 'vendor';
                return `npm.${packageName.replace('@', '')}`;
              } catch (error) {
                console.warn('Failed to parse module name:', error);
                return 'vendor';
              }
            },
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true,
            priority: 1,
          },
        },
      },
    };

    // Add memory-related environment variables
    config.plugins.push(
      new (require('webpack').EnvironmentPlugin)({
        NODE_OPTIONS: '--max-old-space-size=4096'
      })
    );

    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    optimizeCss: true,
    webpackBuildWorker: true,
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;