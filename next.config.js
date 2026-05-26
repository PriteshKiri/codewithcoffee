/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Skip the image-optimization server in dev. It tries to fetch every remote
    // image over HTTPS, which fails with UNABLE_TO_GET_ISSUER_CERT_LOCALLY on
    // machines behind a TLS-intercepting corporate proxy. Production builds
    // still get full optimization.
    unoptimized: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media2.dev.to',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
