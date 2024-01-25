import { type ClassValue, clsx } from "clsx";
import { useConvexAuth } from "convex/react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imageId: string) {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${imageId}`;
}

export function useSession() {
  return useConvexAuth();
}
