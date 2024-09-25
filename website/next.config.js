/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://vaul-docs.vercel.app/:path*',
        assetPrefix: 'https://vaul-docs.vercel.app',
      },
    ];
  },
};

module.exports = nextConfig;
