/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'picsum.photos'],
    unoptimized: true
  },
  experimental: {
    esmExternals: 'loose'
  }
}

export default nextConfig
