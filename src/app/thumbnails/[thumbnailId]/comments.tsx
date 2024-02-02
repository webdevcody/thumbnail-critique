"use client";

import * as z from "zod";
import { useMutation, useQuery } from "convex/react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../../../convex/_generated/api";
import { formatDistance } from "date-fns";
import { useIsSubscribed } from "@/hooks/useIsSubscribed";
import { UpgradeButton } from "@/components/upgrade-button";
import { TrashIcon } from "lucide-react";
import { useSession } from "@/lib/utils";

const formSchema = z.object({
  text: z.string().min(1).max(500),
});

export function Comments({ thumbnail }: { thumbnail: Doc<"thumbnails"> }) {
  const { isAuthenticated } = useSession();
  const addComment = useMutation(api.thumbnails.addComment);
  const adminDeleteComment = useMutation(api.thumbnails.adminDeleteComment);
  const comments = useQuery(api.thumbnails.getComments, {
    thumbnailId: thumbnail._id,
  });
  const deleteComment = useMutation(api.thumbnails.deleteComment);
  const user = useQuery(
    api.users.getMyUser,
    !isAuthenticated ? "skip" : undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const { toast } = useToast();

  function onSubmit(values: z.infer<typeof formSchema>) {
    addComment({
      text: values.text,
      thumbnailId: thumbnail._id,
    })
      .then(() => {
        toast({
          title: "Comment Added",
          description: "Thanks for leaving your feedback",
          variant: "default",
        });
        form.reset();
      })
      .catch(() => {
        toast({
          title: "Something happened",
          description:
            "We could not leave a comment, try again laterThanks for leaving your feedback",
          variant: "destructive",
        });
      });
  }

  return (
    <div>
      <h2 className="mb-4 mt-12 text-2xl font-bold text-center">Comments</h2>

      <div className="max-w-4xl mx-auto mb-12 space-y-8">
        <div className="space-y-2">
          {comments?.map((comment) => {
            return (
              <div
                key={`${comment.text}_${comment.createdAt}`}
                className="border p-4 rounded relative bg-gray-50 dark:bg-gray-950"
              >
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={comment.profileUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-4 items-center">
                        <div className="font-bold">{comment.name}</div>
                        <div className="text-xs">
                          {formatDistance(
                            new Date(comment.createdAt),
                            new Date(),
                            {
                              addSuffix: true,
                            }
                          )}
                        </div>
                      </div>
                      <pre className="font-sans text-wrap">{comment.text}</pre>
                    </div>
                    <div className="flex flex-col gap-2">
                      {comment.userId === user?._id && (
                        <Button
                          className="flex gap-2"
                          variant={"destructive"}
                          size="sm"
                          onClick={() => {
                            deleteComment({
                              commentId: comment._id,
                            })
                              .then(() => {
                                toast({
                                  title: "Comment Deleted",
                                  description: "Your comment has been deleted",
                                  variant: "default",
                                });
                              })
                              .catch(() => {
                                toast({
                                  title: "Something happened",
                                  description:
                                    "We could not delete your comment",
                                  variant: "destructive",
                                });
                              });
                          }}
                        >
                          <TrashIcon size="14" /> Delete
                        </Button>
                      )}
                      {comment.userId !== user?._id && user?.isAdmin && (
                        <Button
                          className="flex gap-2"
                          variant={"destructive"}
                          size={"sm"}
                          onClick={() => {
                            adminDeleteComment({
                              commentId: comment._id,
                            });
                          }}
                        >
                          <TrashIcon size="14" /> Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    leave a comment to help the content creator improve their
                    thumbnail designs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Post Comment</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
