"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <section className="">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              The easiest way to get feedback on your thumbnails
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Upload your two thumbnails and send links to your friends to help
              you hone in your best design skills.
            </p>
            <Button asChild>
              <Link href="/create">Get Started</Link>
            </Button>
          </div>
          <div className="col-span-5">
            <Image
              priority
              src="/hero.jpeg"
              alt="mockup"
              width="600"
              className="w-full"
              height="400"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
