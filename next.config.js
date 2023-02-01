const withBundleAnalyser = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYSE === 'true',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withBundleAnalyser({
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(?:glsl|vs|fs|vert|frag)$/u,
      exclude: /node_modules/u,
      use: {
        loader: 'webpack-glsl-minify',
        options: {
          preserveUniforms: true,
        },
      },
    });
    config.resolve.extensions.push('.glsl', '.vs', '.fs', '.vert', '.frag');
    return config;
  },
});

module.exports = nextConfig;
