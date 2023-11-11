const env = process.env.NODE_ENV;
const isDevelopment = env !== 'production';

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
    domains: [
      'acmucsd.s3.us-west-1.amazonaws.com',
      'acmucsd.s3-us-west-1.amazonaws.com', // This one's for Sumeet Bansal
      'acmucsd-membership-portal.s3.us-west-1.amazonaws.com',
      // The dev backend test data uses image URLs outside the allowlist
      ...(isDevelopment ? ['i.imgur.com', 'i.pinimg.com', 'i.etsystatic.com'] : []),
    ],
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
