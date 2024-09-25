/** @type {import('next').NextConfig} */
const nextConfig = {
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
