"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "@/lib/utils";
import Link from "next/link";
import { SkeletonCard } from "@/components/skeleton-card";
import { PictureInPictureIcon, SpeechIcon } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { ReactNode, useEffect } from "react";
import { timeFrom } from "@/util/time-from";
import { useRouter } from "next/navigation";

function Notification({
  notification,
  title,
  description,
  icon,
}: {
  notification: (typeof api.notification.getNotifications._returnType)[0];
  title: string;
  description: string;
  icon: ReactNode;
}) {
  const markAsRead = useMutation(api.notification.markAsRead);
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-4 border p-4 rounded"
      key={notification._id}
    >
      {icon}

      <div>
        <div className="font-bold mb-2">{title}</div>
        <div className="mb-2">{timeFrom(notification._creationTime)}</div>
        <div>
          <Link href={`/profile/${notification.from}`}>
            {notification.profile.name}{" "}
          </Link>
          {description}
        </div>
      </div>

      <Button
        variant={notification.isRead ? "outline" : "default"}
        className="ml-auto"
        onClick={async () => {
          if (!notification.isRead) {
            await markAsRead({
              notificationId: notification._id,
            });
          }
          router.push(`/thumbnails/${notification.thumbnailId}`);
        }}
      >
        {notification.isRead ? "View" : "Read"}
      </Button>
    </div>
  );
}

export default function NotificationsPage() {
  const { isAuthenticated } = useSession();

  const notifications = useQuery(
    api.notification.getNotifications,
    !isAuthenticated ? "skip" : undefined
  );

  return (
    <div className="">
      <h1 className="text-center text-4xl font-bold mb-12">Notifications</h1>

      {notifications === undefined && (
        <div className="animate-pulse mb-12 mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {notifications && notifications.length === 0 && (
        <div className="flex flex-col items-center gap-8">
          <Image
            className="rounded-lg bg-white p-12"
            src="/void.svg"
            alt="no found icon"
            width="400"
            height="400"
          />
          <div className="text-2xl font-bold">You have no notifications</div>
        </div>
      )}

      <div className="flex flex-col gap-8 max-w-xl mx-auto">
        {notifications?.map((notification) => {
          if (notification.type === "thumbnail") {
            return (
              <Notification
                key={notification._id}
                description=" uploaded a new thumbnail test!"
                icon={<PictureInPictureIcon className="h-14 w-14" />}
                title="New Thumbnail"
                notification={notification}
              />
            );
          } else if (notification.type === "comment") {
            return (
              <Notification
                key={notification._id}
                description=" left a comment on your thumbnail."
                icon={<SpeechIcon className="h-14 w-14" />}
                title="New Comment"
                notification={notification}
              />
            );
          } else {
            return (
              <Notification
                key={notification._id}
                description=" voted for one of your thumbnail images."
                icon={<PictureInPictureIcon className="h-14 w-14" />}
                title="New Vote"
                notification={notification}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
