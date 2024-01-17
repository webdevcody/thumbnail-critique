/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "kindly-kookabura-369.convex.cloud",
      },
    ],
  },
};

module.exports = nextConfig;
