import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "./footer";

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
        <Providers>
          <Header />
          <div className="bg-gray-100 dark:bg-black">
            <div className="container min-h-screen pt-12">{children}</div>
          </div>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
