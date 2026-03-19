/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-83c5db439b40468498f97946200806f7.r2.dev",
      },
    ],
  },
};

export default nextConfig;
