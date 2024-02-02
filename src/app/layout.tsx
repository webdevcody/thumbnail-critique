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
      <body className={inter.className}>
        <Script
          src="https://beamanalytics.b-cdn.net/beam.min.js"
          data-token="a07e2826-5910-4684-9e69-0ec4388a0509"
          async
        ></Script>
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
