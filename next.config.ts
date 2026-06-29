import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@mediapipe/tasks-vision"],
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
