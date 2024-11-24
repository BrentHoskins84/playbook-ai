/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the output: 'export' since we're using middleware
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
