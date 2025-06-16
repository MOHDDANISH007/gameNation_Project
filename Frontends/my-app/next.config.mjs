/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'a.media-amazon.com',
      's3-ap-southeast-1.amazonaws.com',
      'zamve.com' // ✅ Add this line
    ]
  }
}

export default nextConfig
