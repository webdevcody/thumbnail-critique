"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { shuffle } from "lodash";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { useRef } from "react";
import { Comments } from "./comments";

export default function ThumbnailPage() {
  const params = useParams<{ thumbnailId: Id<"thumbnails"> }>();
  const thumbnailId = params.thumbnailId;
  const voteOnThumbnail = useMutation(api.thumbnails.voteOnThumbnail);
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId,
  });
  const images = useRef<string[] | undefined>(undefined);

  const session = useSession();

  if (!thumbnail || !session.session) {
    return <div>Loading...</div>;
  }

  if (!images.current) {
    images.current = shuffle([thumbnail.aImage, thumbnail.bImage]);
  }
  const [firstImageId, secondImageId] = images.current;

  const hasVoted = thumbnail.voteIds.includes(session.session.user.id);

  function getVotesFor(imageId: string) {
    if (!thumbnail) return 0;
    return thumbnail.aImage === imageId ? thumbnail.aVotes : thumbnail?.bVotes;
  }

  function geVotePercent(imageId: string) {
    if (!thumbnail) return 0;
    const totalVotes = thumbnail.aVotes + thumbnail.bVotes;
    if (totalVotes === 0) return 0;
    return Math.round((getVotesFor(imageId) / totalVotes) * 100);
  }

  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            Test Image A
          </h2>

          <Image
            width="600"
            height="600"
            alt="image test a"
            className="w-full"
            src={getImageUrl(firstImageId)}
          />

          {hasVoted ? (
            <>
              <Progress
                value={geVotePercent(firstImageId)}
                className="w-full"
              />
              <div className="text-lg">{getVotesFor(firstImageId)} votes</div>
            </>
          ) : (
            <Button
              onClick={() => {
                voteOnThumbnail({
                  thumbnailId,
                  imageId: firstImageId,
                });
              }}
              size="lg"
              className="w-fit"
            >
              Vote A
            </Button>
          )}
        </div>

        <div className="flex items-center flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            Test Image B
          </h2>

          <Image
            width="600"
            height="600"
            alt="image test b"
            className="w-full"
            src={getImageUrl(secondImageId)}
          />

          {hasVoted ? (
            <>
              <Progress
                value={geVotePercent(secondImageId)}
                className="w-full"
              />
              <div className="text-lg">{getVotesFor(secondImageId)} votes</div>
            </>
          ) : (
            <Button
              onClick={() => {
                voteOnThumbnail({
                  thumbnailId,
                  imageId: secondImageId,
                });
              }}
              size="lg"
              className="w-fit"
            >
              Vote B
            </Button>
          )}
        </div>
      </div>

      <Comments thumbnail={thumbnail} />
    </div>
  );
}
