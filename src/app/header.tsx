"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { useSession } from "@/lib/utils";
import MobileNav, { MenuToggle, useMobileNavState } from "./mobile-nav";
import Image from "next/image";
import { BellIcon, MessageCircleHeart } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Feedback from "./feedback";

const NotificationIcon = () => {
  const hasUnread = useQuery(api.notification.hasUnread);

  return (
    <Link href="/notifications" className="relative">
      <BellIcon />
      {hasUnread && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
      )}
    </Link>
  );
};

export function Header() {
  const { isLoading, isAuthenticated } = useSession();

  const { isOpen, toggleOpen } = useMobileNavState();

  return (
    <div className="border-b dark:bg-gray-900">
      <MobileNav isOpen={isOpen} toggleOpen={toggleOpen} />

      <div className="h-16 container flex justify-between items-center">
        <Link
          href="/"
          className="flex gap-2 items-center relative flex-shrink-0"
        >
          <Image
            className="rounded"
            src="/hero.jpeg"
            alt="logo"
            width="40"
            height="40"
          />
          <span className="text-xs md:text-base hidden sm:block">
            ThumbnailCritique
          </span>
        </Link>

        <div className="gap-4 hidden md:flex md:gap-8 text-xs md:text-base">
          {!isLoading && isAuthenticated && (
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
        </div>

        <div className="flex gap-4 items-center">
          {!isLoading && (
            <>
              {isAuthenticated && (
                <>
                  <Feedback
                    triggerContent={
                      <button>
                        <MessageCircleHeart />
                      </button>
                    }
                  />

                  <NotificationIcon />

                  <UserButton />
                </>
              )}
              {!isAuthenticated && <SignInButton />}
            </>
          )}

          <ModeToggle />

          <MenuToggle toggle={toggleOpen} />
        </div>
      </div>
    </div>
  );
}
