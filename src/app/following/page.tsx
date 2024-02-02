"use client";

import { useSession } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PeersPage() {
  const { isAuthenticated } = useSession();

  const peers = useQuery(
    api.follows.getPeers,
    !isAuthenticated ? "skip" : undefined
  );

  return (
    <div>
      {peers?.length === 0 && (
        <>
          <h1 className="text-4xl font-bold text-center mb-4">
            Who You Follow
          </h1>
          <div className="flex flex-col items-center justify-center gap-8">
            <Image
              className="rounded-lg bg-white p-12"
              src="/followers.svg"
              alt="no followers"
              width="400"
              height="400"
            />
            <div className="text-2xl font-bold">You have no followers</div>

            <Button asChild>
              <Link href="/explore">Go Follow Someone</Link>
            </Button>
          </div>
        </>
      )}

      {peers && peers.length > 0 && (
        <>
          <h1 className="text-4xl font-bold">Who You Follow</h1>

          <div className="grid grid-cols-4 mt-12">
            {peers?.map((peer) => {
              return (
                <Link key={peer._id} href={`/profile/${peer._id}`}>
                  <div className="flex flex-col gap-4">
                    <Avatar className="w-40 h-40">
                      <AvatarImage src={peer.profileImage} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <h1 className="text-2xl">{peer.name}</h1>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
