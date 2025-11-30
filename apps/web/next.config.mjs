/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Disable static generation for routes that use client-side hooks
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;

