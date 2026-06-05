import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheLife: {
    max: {
      stale: 0,
      revalidate: 0,
      expire: 86400,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "vikna.tv",
      },
      {
        protocol: "https",
        hostname: "cdn4.suspilne.media",
      },
      {
        protocol: "https",
        hostname: "tvmtm.online",
      },
      {
        protocol: "https",
        hostname: "np.pl.ua",
      },
      {
        protocol: "https",
        hostname: "www.stopcor.org",
      },
      {
        protocol: "https",
        hostname: "armyinform.com.ua",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
