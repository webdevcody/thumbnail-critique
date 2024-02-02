"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/utils";
import { SignIn, useSignIn } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, isLoading } = useSession();
  const signIn = useSignIn();

  return (
    <main className="">
      <section className="mt-24 flex flex-col items-center gap-8 pb-24">
        <Image
          src="/hero.jpeg"
          width="300"
          height="300"
          alt="hero banner"
          className="rounded-xl"
        />
        <h1 className="text-center max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
          The easiest way to get feedback on your thumbnails
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300 text-xl max-w-lg mx-auto">
          Upload your thumbnails variations and send links to your friends to
          help you hone in your design skills.
        </p>
        {!isLoading &&
          (isAuthenticated ? (
            <Button asChild>
              <Link href="/create">Create Thumbnail</Link>
            </Button>
          ) : (
            <SignInButton>
              <Button>Sign In to Get Started</Button>
            </SignInButton>
          ))}
      </section>
    </main>
  );
}
