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
          "https://projectplannerai.com/changelog/bf1599a8807019b25000d8c1",
      },
      {
        source: "/changelog/:path*",
        destination:
          "https://projectplannerai.com/changelog/bf1599a8807019b25000d8c1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
