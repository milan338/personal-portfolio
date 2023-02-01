const withBundleAnalyser = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYSE === 'true',
});

const ContentSecurityPolicy = `
  default-src 'self';
  base-uri 'none';
  img-src 'self';
  style-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  object-src 'none';
  script-src-attr 'none';
  frame-ancestors 'none';
  form-action 'none';
  manifest-src 'self';
  require-trusted-types-for 'script';
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/gu, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp',
  },
  {
    key: 'Origin-Agent-Cluster',
    value: '?1',
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
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: `camera=(), display-capture(), microphone=(), geolocation=(),
    browsing-topics=(), serial=(), usb=(), payment=(), publickey-credentials-get=(),
    execution-while-out-of-viewport=(), execution-while-not-rendered=()`,
  },
];

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
  headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
});

module.exports = nextConfig;
