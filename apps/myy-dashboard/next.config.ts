import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // 启用一些实验性功能，如果需要的话
  },
};

export default nextConfig;
