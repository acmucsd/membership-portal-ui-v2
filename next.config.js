/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['acmucsd.s3.us-west-1.amazonaws.com'],
  },
  poweredByHeader: false,
  trailingSlash: false,
  basePath: '',
  reactStrictMode: true,
  swcMinify: true,
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
