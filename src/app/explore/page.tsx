"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  useConvexAuth,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "../../../convex/_generated/dataModel";
import { useSession } from "@clerk/nextjs";
import { SkeletonCard } from "@/components/skeleton-card";
import { TrashIcon } from "lucide-react";
import { getTotalVotes } from "@/util/getTotalVotes";

export default function ExplorePage() {
  const {
    results: thumbnails,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.thumbnails.getRecentThumbnails,
    {},
    { initialNumItems: 10 }
  );

  const session = useSession();
  const { isAuthenticated } = useConvexAuth();

  const user = useQuery(
    api.users.getMyUser,
    !isAuthenticated ? "skip" : undefined
  );

  function hasVoted(thumbnail: Doc<"thumbnails">) {
    if (!session.session) return false;
    if (!user) return false;
    if (user._id === thumbnail.userId) return true;
    return thumbnail.voteIds.includes(user._id);
  }

  const deleteThumbail = useMutation(api.thumbnails.deleteThumbnail);

  return (
    <div className="">
      <h1 className="text-center text-4xl font-bold mb-12">Community Review</h1>

      {isLoading && (
        <div className="animate-pulse mb-12 mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-40">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!isLoading && thumbnails.length === 0 && (
        <div className="flex flex-col items-center gap-8">
          <Image
            className="rounded-lg bg-white p-12"
            src="/void.svg"
            alt="no found icon"
            width="400"
            height="400"
          />
          <div className="text-2xl font-bold">No thumbnails to display</div>
        </div>
      )}

      {thumbnails.length > 0 && (
        <div className="mb-12 mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {thumbnails.map((thumbnail) => {
            return (
              <Card key={thumbnail._id}>
                <div className="flex flex-col justify-between">
                  <div>
                    <CardHeader className="relative">
                      {user?.isAdmin && (
                        <Button
                          onClick={() => {
                            deleteThumbail({
                              thumbnailId: thumbnail._id,
                            });
                          }}
                          className="absolute right-2 top-2 z-10"
                        >
                          <TrashIcon />
                        </Button>
                      )}
                      <div className="relative aspect-[1280/720]">
                        {thumbnail.urls[0] && (
                          <Image
                            alt="image test"
                            className="object-cover"
                            src={thumbnail.urls[0]}
                            layout="fill"
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 items-center mb-2">
                        <Link href={`/profile/${thumbnail.userId}`}>
                          <Avatar>
                            <AvatarImage src={thumbnail.profileImage} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </Link>

                        <div>
                          <p>{thumbnail.name}</p>

                          <p>
                            {formatDistance(
                              new Date(thumbnail._creationTime),
                              new Date(),
                              {
                                addSuffix: true,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <p>{thumbnail.title}</p>

                      <p>votes: {getTotalVotes(thumbnail)}</p>
                    </CardContent>
                  </div>

                  <CardFooter>
                    <Button
                      variant={hasVoted(thumbnail) ? "outline" : "default"}
                      className="w-full"
                      asChild
                    >
                      <Link href={`/thumbnails/${thumbnail._id}`}>
                        {hasVoted(thumbnail) ? "View Results" : "Vote"}
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {status === "CanLoadMore" && (
        <Button
          className="w-full mb-24"
          onClick={() => {
            loadMore(10);
          }}
        >
          Load More
        </Button>
      )}
    </div>
  );
}
