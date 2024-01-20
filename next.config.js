/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "kindly-kookabura-369.convex.cloud",
      },
      {
        hostname: "silent-eel-513.convex.cloud",
      },
    ],
  },
};

module.exports = nextConfig;
