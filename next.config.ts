import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // set domain for images
  images: {
    domains: ['lemobucket.s3.eu-west-2.amazonaws.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
