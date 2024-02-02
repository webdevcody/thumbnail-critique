"use client";

import React, { ReactNode, useEffect, useRef } from "react";

import Link from "next/link";

import { useClerk } from "@clerk/nextjs";
import { motion, useCycle } from "framer-motion";
import { MenuIcon } from "lucide-react";

const sidebar = {
  open: {
    clipPath: `inset(0% 0% 0% 0%)`,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
  closed: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

export default function MobileNav({
  isOpen,
  toggleOpen,
}: {
  isOpen: any;
  toggleOpen: any;
}) {
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const { signOut } = useClerk();

  return (
    <>
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        className={`flex justify-end w-full sm:hidden ${
          isOpen ? "" : "pointer-events-none"
        }`}
        ref={containerRef}
      >
        <motion.div
          className="absolute inset-0 top-16 left-0 w-full dark:bg-gray-900 bg-white z-50"
          variants={sidebar}
        />
        <motion.ul
          variants={variants}
          className="absolute inset-0 grid w-full gap-3 py-16 z-50 "
        >
          <div className="dark:text-white text-black flex flex-col items-center">
            <MenuItem className="my-3 h-px w-full bg-gray-300" />
            <MenuItem key="Dashboard">
              <Link
                href="/dashboard"
                onClick={() => toggleOpen()}
                className="flex w-full font-semibold capitalize"
              >
                Dashboard
              </Link>
            </MenuItem>
            <MenuItem className="my-3 h-px w-full bg-gray-300" />
            <MenuItem key="Create">
              <Link
                href="/create"
                onClick={() => toggleOpen()}
                className="flex w-full font-semibold capitalize"
              >
                Create
              </Link>
            </MenuItem>
            <MenuItem className="my-3 h-px w-full bg-gray-300" />
            <MenuItem key="Explore">
              <Link
                href="/explore"
                onClick={() => toggleOpen()}
                className="flex w-full font-semibold capitalize"
              >
                Explore
              </Link>
            </MenuItem>
            <MenuItem className="my-3 h-px w-full bg-gray-300" />

            <MenuItem key="Following">
              <Link
                href="/following"
                onClick={() => toggleOpen()}
                className="flex w-full font-semibold capitalize"
              >
                Following
              </Link>
            </MenuItem>
            <MenuItem className="my-3 h-px w-full bg-gray-300" />

            <MenuItem key="Account">
              <Link
                href="/account"
                onClick={() => toggleOpen()}
                className="flex w-full font-semibold capitalize"
              >
                Account
              </Link>
            </MenuItem>
            <MenuItem className="my-3 h-px w-full bg-gray-300" />

            <MenuItem key="SignOut">
              <Link
                href="/"
                onClick={() => {
                  signOut();
                  toggleOpen();
                }}
                className="flex w-full font-semibold capitalize"
              >
                Sign Out
              </Link>
            </MenuItem>
          </div>
        </motion.ul>
      </motion.nav>
    </>
  );
}

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return dimensions.current;
};

export const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={toggle}
    className="sm:hidden pointer-events-auto flex z-50 dark:text-white text-black mr-3"
  >
    <MenuIcon />
  </button>
);

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

export function useMobileNavState() {
  const [isOpen, toggleOpen] = useCycle(false, true);

  return { isOpen, toggleOpen };
}
