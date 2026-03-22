import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
        protocol: "https",
      },
      {
        hostname: "images.pexels.com",
        pathname: "/**",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
