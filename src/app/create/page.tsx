"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { UpgradeButton } from "@/components/upgrade-button";

const defaultErrorState = {
  title: "",
  images: "",
};

export default function CreatePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const { toast } = useToast();
  const router = useRouter();
  const [errors, setErrors] = useState(defaultErrorState);
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="mt-16">
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

          if (images.length <= 2) {
            newErrors = {
              ...newErrors,
              images: "please fill in this required field",
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
          <Label htmlFor="title">Your Test Title</Label>
          <Input
            id="title"
            type="text"
            name="title"
            placeholder="Label your test to make it easier to manage later"
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
              <div key={imageUrl} className="flex flex-col">
                <div>Image {idx + 1}</div>
                <Image
                  width="600"
                  height="800"
                  alt="image test a"
                  src={getImageUrl(imageUrl)}
                />
              </div>
            );
          })}

          <div className="flex flex-col gap-4 mb-8">
            <Label htmlFor="title">
              {images.length > 0 && "Another"} Thumbnail Image
            </Label>
            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                const storageId = (uploaded[0].response as any).storageId;
                setImages((imgs) => [...imgs, storageId]);
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
