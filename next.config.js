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
      {
        hostname: "thumbnailcritique.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/changelog",
        destination:
          "https://projectplannerai.com/changelog/j57crafbck4rdrfsp64ydym2tx6j2b83",
      },
    ];
  },
};

module.exports = nextConfig;
