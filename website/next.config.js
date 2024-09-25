/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: `/_next/:path*/:path*/:path*`,
          destination: `https://vaul-docs.vercel.app/_next/:path*/:path*/:path*`,
        },
      ],
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
