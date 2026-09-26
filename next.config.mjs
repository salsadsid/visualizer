/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
