import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "./footer";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thumbnail Critique",
  description: "Get feedback for your thumbnails by your peers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <meta name="viewport" content="width=device-width, user-scalable=no" /> */}
        {/* App icons */}
        {/* <link
          rel="icon"
          href="../../icon.png"
          type="image/png"
          sizes="256x256"
        />
        <link
          rel="apple-touch-icon"
          href="../../apple-icon.png"
          type="image/png"
          sizes="256x256"
        />

        <meta property="og:url" content="https://projectplannerai.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ProjectPlannerAI" />
        <meta
          property="og:description"
          content="Best way to create plans for side projects."
        />
        <meta
          property="og:image"
          content="https://projectplannerai.com/opengraph-image.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="projectplannerai.com" />
        <meta property="twitter:url" content="https://projectplannerai.com/" />
        <meta name="twitter:title" content="ProjectPlannerAI" />
        <meta
          name="twitter:description"
          content="Best way to create plans for side projects."
        />
        <meta
          name="twitter:image"
          content="https://projectplannerai.com/twitter-image.png"
        ></meta> */}

        <Script
          src="https://beamanalytics.b-cdn.net/beam.min.js"
          data-token="97571696-c451-45e7-b454-fc262ce1e677"
          async
        ></Script>
      </head>

      <body className={inter.className}>
        <Providers>
          <NextTopLoader />
          <Header />
          <div className="bg-gray-100 dark:bg-black pb-12">
            <div className="container min-h-screen pt-12">{children}</div>
          </div>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
