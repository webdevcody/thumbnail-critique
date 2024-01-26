"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { SkeletonCard } from "@/components/skeleton-card";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserThumbnails() {
  const params = useParams<{ userId: string }>();
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser, {
    userId: params.userId,
  });

  const sortedThumbnails = [...(thumbnails ?? [])].reverse();

  return (
    <div>
      {thumbnails === undefined && (
        <div className="animate-pulse mb-12 mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {thumbnails && thumbnails.length === 0 && (
        <div className="flex flex-col items-center gap-8">
          <Image
            className="rounded-lg bg-white p-12"
            src="/void.svg"
            alt="no found icon"
            width="400"
            height="400"
          />
          <div className="text-2xl font-bold">You have no thumbnail tests</div>

          <Button asChild>
            <Link href="/create">Create a Thumbnail Test</Link>
          </Button>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sortedThumbnails?.map((thumbnail) => {
          return (
            <Card key={thumbnail._id}>
              <CardHeader>
                <Image
                  src={getImageUrl(thumbnail.aImage)}
                  width="600"
                  height="600"
                  alt="thumbnail image"
                />
              </CardHeader>
              <CardContent>
                <p>{thumbnail.title}</p>
                <p>
                  {formatDistance(
                    new Date(thumbnail._creationTime),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </p>
                <p>votes: {thumbnail.aVotes + thumbnail.bVotes}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/thumbnails/${thumbnail._id}`}>
                    View Results
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams<{ userId: string }>();
  const profile = useQuery(api.users.getProfile, {
    userId: params.userId,
  });

  return (
    <div className="grid grid-cols-3 mt-12">
      <div className="flex flex-col gap-2 items-center">
        <Avatar className="w-40 h-40">
          <AvatarImage src={profile?.profileImage} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <h1 className="text-2xl">{profile?.name}</h1>
      </div>
      <div className="col-span-2">
        <h1 className="text-4xl font-bold">Thumbnails</h1>

        <UserThumbnails />
      </div>
    </div>
  );
}
