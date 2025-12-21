import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
      serverActions: {
          bodySizeLimit: "1000mb"
      }
  }
};

export default nextConfig;
