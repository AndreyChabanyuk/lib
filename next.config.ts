import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    baseURL: process.env.NEXT_APP_DB_URL,
  },
};
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "82.202.137.19",
        port: "",
        pathname: "/static/**",
      },
    ],
  },
};
export default nextConfig;
