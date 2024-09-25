/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `https://vaul-docs.vercel.app/:path*`,
        },
        {
          source: '/:path*/:path*/:path*/:path*',
          destination: `https://vaul-docs.vercel.app/:path*/:path*/:path*/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
