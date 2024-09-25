/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `https://vaul-docs.vercel.app/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
