"use client";

import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { isSignedIn } = useSession();

  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);

  return (
    <main className="">
      {isSignedIn ? <SignOutButton /> : <SignInButton />}

      {isSignedIn && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const title = formData.get("title") as string;
            await createThumbnail({
              title,
            });
            form.reset();
          }}
        >
          <label>Title</label>
          <input name="title" className="text-black"></input>
          <button>Create</button>
        </form>
      )}

      {thumbnails?.map((thumbnail) => {
        return <div key={thumbnail._id}>{thumbnail.title}</div>;
      })}
    </main>
  );
}
