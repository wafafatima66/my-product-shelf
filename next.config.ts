import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product photos are served by our own /media route (see src/app/media).
  images: { unoptimized: true },
};

export default nextConfig;
