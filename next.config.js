const env = process.env.NODE_ENV;
const isDevelopment = env !== 'production';

const runtimeCaching = require('next-pwa/cache');

// By default, next-pwa serves from the cache while updating the cache with a
// network request. This results in faster page loads, but the data will be
// stale, most notable when checking into an event (membership points will be
// out of date) or enabling "Preview store as member" on the admin page. Note
// that this only applies to static routes (e.g. /store but not /u/[uuid]).
//
// This makes it fetch data from the server (then falling back to the cache if
// the user is offline). This will result in slower page loads, but the data
// will always be up-to-date.
// https://github.com/vercel/next.js/discussions/52024#discussioncomment-6325542
const nextData = runtimeCaching.find(entry => entry.options.cacheName === 'next-data');
if (nextData) {
  nextData.handler = 'NetworkFirst';
}

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching,
  register: true,
  skipWaiting: true,
  disable: isDevelopment,
});

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
      'acmucsd.s3-us-west-1.amazonaws.com',
      'acmucsd.s3.us-west-1.amazonaws.com',
      // This one's for Sumeet Bansal
      'acmucsd.s3-us-west-1.amazonaws.com',
      'acmucsd-membership-portal.s3.us-west-1.amazonaws.com',
      // The dev backend test data uses image URLs outside the allowlist
      ...(isDevelopment
        ? ['i.imgur.com', 'i.pinimg.com', 'i.etsystatic.com', 'www.google.com']
        : []),
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
  experimental: {
    appDocumentPreloading: true,
  },
};

module.exports = withPWA(nextConfig);
