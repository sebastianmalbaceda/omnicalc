/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@omnicalc/shared-types'],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
