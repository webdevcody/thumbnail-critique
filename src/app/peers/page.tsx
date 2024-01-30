"use client";

import { useSession } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export default function PeersPage() {
  const { isAuthenticated } = useSession();

  const peers = useQuery(
    api.follows.getPeers,
    !isAuthenticated ? "skip" : undefined
  );

  return (
    <div>
      <h1 className="text-4xl mt-12 font-bold">Your Peers</h1>

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
    </div>
  );
}
