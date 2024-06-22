/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co'
      }
    ],
    dangerouslyAllowSVG: true
  },
}

module.exports = nextConfig
