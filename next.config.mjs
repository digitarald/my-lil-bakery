/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only ignore linting/type errors in development for faster iteration
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // Enable image optimization for better performance
  images: {
    domains: ['placeholder.com', 'via.placeholder.com'], // Add your image domains here
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
