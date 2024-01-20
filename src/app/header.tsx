"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { useIsSubscribed } from "@/hooks/useIsSubscribed";
import { UpgradeButton } from "@/components/upgrade-button";

export function Header() {
  const isSubscriped = useIsSubscribed();

  return (
    <div className="border-b">
      <div className="h-16 container flex justify-between items-center">
        <Link href="/">ThumbnailRater</Link>

        <div className="flex gap-8">
          <SignedIn>
            <Link href="/dashboard" className="link">
              Dashboard
            </Link>
            <Link href="/create" className="link">
              Create
            </Link>
            <Link href="/explore" className="link">
              Explore
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/pricing" className="link">
              Pricing
            </Link>
            <Link href="/about" className="link">
              About
            </Link>
          </SignedOut>
        </div>

        <div className="flex gap-4 items-center">
          <SignedIn>
            {!isSubscriped && <UpgradeButton />}
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
