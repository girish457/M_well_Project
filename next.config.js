/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable persistent caching to prevent cache issues
    config.cache = false;
    return config;
  },
}

module.exports = nextConfig
