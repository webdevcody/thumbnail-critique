/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    images: {
      unoptimized: true,
    },
    remotePatterns: [
      {
        hostname: "kindly-kookabura-369.convex.cloud",
      },
      {
        hostname: "silent-eel-513.convex.cloud",
      },
      {
        hostname: "thumbnailcritique.com",
      },
    ],
  },
};

module.exports = nextConfig;
