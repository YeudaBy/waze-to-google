import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  api: {
    bodyParser: false,
    responseLimit: false,
    externalResolver: true,
  },
};

export default nextConfig;
