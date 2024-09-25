/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: 'https://vaul-docs.vercel.app',
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://vaul-docs.vercel.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
