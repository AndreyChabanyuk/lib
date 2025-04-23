import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    baseURL: process.env.NEXT_APP_DB_URL
  }

};

export default nextConfig;
