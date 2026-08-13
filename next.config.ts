import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['trycloudflare.com', '*.trycloudflare.com', 'loca.lt'],
};

export default nextConfig;
