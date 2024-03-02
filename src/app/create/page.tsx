"use client";

import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { cn, getImageUrl } from "@/lib/utils";
import { UpgradeButton } from "@/components/upgrade-button";
import { Id } from "../../../convex/_generated/dataModel";
import { TrashIcon, XIcon } from "lucide-react";

const defaultErrorState = {
  title: "",
  images: "",
};

export default function CreatePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThumbnail = useAction(api.thumbnails.createThumbnailAction);
  const { toast } = useToast();
  const router = useRouter();
  const [errors, setErrors] = useState(defaultErrorState);
  const [images, setImages] = useState<Id<"_storage">[]>([]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Create a Thumbnail Test</h1>

      <p className="text-lg max-w-md mb-8">
        Create your test so that other people can vote on their favorite
        thumbnail and help you redesign or pick the best options.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const title = formData.get("title") as string;
          let newErrors = {
            ...defaultErrorState,
          };

          if (!title) {
            newErrors = {
              ...newErrors,
              title: "please fill in this required field",
            };
          }

          if (images.length < 2) {
            newErrors = {
              ...newErrors,
              images: "you must upload at least 2 thumbnails",
            };
          }

          setErrors(newErrors);
          const hasErrors = Object.values(newErrors).some(Boolean);

          if (hasErrors) {
            toast({
              title: "Form Errors",
              description: "Please fill fields on the page",
              variant: "destructive",
            });
            return;
          }

          try {
            const thumbnailId = await createThumbnail({
              images,
              title,
            });

            router.push(`/thumbnails/${thumbnailId}`);
          } catch (err) {
            toast({
              title: "You ran out of a free credits",
              description: (
                <div>
                  You must <UpgradeButton /> in order to create more thumbnail
                  tests
                </div>
              ),
              variant: "destructive",
            });
          }
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">Youtube Title</Label>
          <Input
            id="title"
            type="text"
            name="title"
            placeholder="Put your example title of your YouTube video"
            className={clsx({
              border: errors.title,
              "border-red-500": errors.title,
            })}
          />
          {errors.title && <div className="text-red-500">{errors.title}</div>}
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {images.map((imageUrl, idx) => {
            return (
              <div key={imageUrl} className="flex flex-col relative">
                <div>Image {idx + 1}</div>
                <Button
                  size={"sm"}
                  variant="destructive"
                  className="absolute top-0 right-0 z-10"
                  onClick={() => {
                    setImages((imgs) => imgs.filter((img) => img !== imageUrl));
                  }}
                >
                  <XIcon className="w-4 h-4 mr-1" />
                </Button>
                <div className="relative aspect-[1280/720]">
                  <Image
                    alt="image test image"
                    className="object-cover"
                    src={getImageUrl(imageUrl)}
                    layout="fill"
                  />
                </div>
              </div>
            );
          })}

          <div className="flex flex-col gap-4 mb-8">
            <Label htmlFor="title">
              {images.length > 0 && "Another"} Thumbnail Images
            </Label>
            <UploadButton
              className={(combinedState) => {
                return cn(buttonVariants());
              }}
              content={(progress) =>
                progress === null || progress === 0
                  ? `Choose File(s)`
                  : "Uploading..."
              }
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              multiple
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImages((imgs) => [
                  ...imgs,
                  ...uploaded.map((file) => {
                    return (file.response as any).storageId as Id<"_storage">;
                  }),
                ]);
              }}
              onUploadError={(error: unknown) => {
                alert(`ERROR! ${error}`);
              }}
            />
            {errors.images && (
              <div className="text-red-500">{errors.images}</div>
            )}
          </div>
        </div>

        <Button>Upload Thumbnail Test</Button>
      </form>
    </div>
  );
}
