/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Disable static generation for routes that use client-side hooks
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Ignore ESLint during build (we'll fix warnings later)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

