/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'a.media-amazon.com',
      's3-ap-southeast-1.amazonaws.com',
      'zamve.com' // ✅ Custom domain for external images
    ]
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ This prevents build from failing due to ESLint warnings
  },
};

export default nextConfig;
