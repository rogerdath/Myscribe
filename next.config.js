/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['yt-dlp-exec'],
  },
}

module.exports = nextConfig
