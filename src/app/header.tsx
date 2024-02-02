"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { useSession } from "@/lib/utils";
import MobileNav, { useMobileNavState } from "./mobile-nav";
import Image from "next/image";

export function Header() {
  const { isLoading, isAuthenticated } = useSession();

  const { isOpen, toggleOpen } = useMobileNavState();

  return (
    <div className="border-b dark:bg-gray-900">
      <div className="h-16 container flex justify-between items-center">
        <Link href="/" className="flex gap-2 items-center">
          <Image
            className="rounded"
            src="/hero.jpeg"
            width="40"
            height="40"
            alt="logo"
          />
          <span className="hidden sm:block text-xs md:text-md">
            ThumbnailCritique
          </span>
        </Link>

        <MobileNav isOpen={isOpen} toggleOpen={toggleOpen} />

        <div className="gap-4 md:gap-8 hidden sm:flex text-xs md:text-base">
          {!isLoading && (
            <>
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className="link">
                    Dashboard
                  </Link>
                  <Link href="/create" className="link">
                    Create
                  </Link>
                  <Link href="/explore" className="link">
                    Explore
                  </Link>
                  <Link href="/following" className="link">
                    Following
                  </Link>
                  <Link href="/account" className="link">
                    Account
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex gap-4 items-center">
          {!isLoading && (
            <>
              {isAuthenticated && (
                <>
                  <UserButton />
                </>
              )}
              {!isAuthenticated && <SignInButton />}
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
