import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blvdguide.swafifilms.com",
      },
    ],
    domains: [
      "blvdguide.swafifilms.com",
      "images.unsplash.com",
      "localhost",
      "127.0.0.1",
    ],
  },
};

export default nextConfig;
