import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getFullUser, isUserSubscribed } from "./users";
import { getUser, getUserId } from "./util";

export const createThumbnail = mutation({
  args: {
    title: v.string(),
    aImage: v.string(),
    bImage: v.string(),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("you must be logged in to create a thumbnail");
    }

    const isSubscribed = await isUserSubscribed(ctx);

    const user = await getFullUser(ctx, userId);

    if (!user) {
      throw new Error("no user with that id found");
    }

    if (!isSubscribed && user.credits <= 0) {
      throw new Error("you must be subscribed to create a thumbnail");
    }

    await ctx.db.patch(user._id, {
      credits: Math.max(0, user.credits - 1),
    });

    return await ctx.db.insert("thumbnails", {
      title: args.title,
      userId,
      aImage: args.aImage,
      bImage: args.bImage,
      aVotes: 0,
      bVotes: 0,
      voteIds: [],
      profileImage: args.profileImage,
      comments: [],
    });
  },
});

export const addComment = mutation({
  args: { thumbnailId: v.id("thumbnails"), text: v.string() },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    console.log("user", user);

    if (!user) {
      throw new Error("you must be logged in to leave a comment");
    }

    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      throw new Error("thumbnail by id did not exist");
    }

    if (!thumbnail.comments) {
      thumbnail.comments = [];
    }

    thumbnail.comments.unshift({
      createdAt: Date.now(),
      text: args.text,
      userId: user.subject,
      name: user.name ?? "Annoymous",
      profileUrl: user.pictureUrl ?? "",
    });

    await ctx.db.patch(thumbnail._id, {
      comments: thumbnail.comments,
    });
  },
});

export const getThumbnail = query({
  args: { thumbnailId: v.id("thumbnails") },
  handler: async (ctx, args) => {
    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      return null;
    }

    const isSubscribed = await isUserSubscribed(ctx);

    let comments =
      thumbnail.comments.length === 0 ? [] : [thumbnail.comments[0]];

    if (isSubscribed) {
      comments = thumbnail.comments;
    }

    return {
      ...thumbnail,
      comments,
    };
  },
});

export const getRecentThumbnails = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("thumbnails")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getThumbnailsForUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("thumbnails")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const voteOnThumbnail = mutation({
  args: {
    thumbnailId: v.id("thumbnails"),
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("you must be logged in to vote");
    }

    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      throw new Error("invalid thumbnail id");
    }

    if (thumbnail.voteIds.includes(userId)) {
      throw new Error("you've already voted");
    }

    if (thumbnail.aImage === args.imageId) {
      thumbnail.aVotes++;
      await ctx.db.patch(thumbnail._id, {
        aVotes: thumbnail.aVotes,
        voteIds: [...thumbnail.voteIds, userId],
      });
    } else {
      thumbnail.bVotes++;
      await ctx.db.patch(thumbnail._id, {
        bVotes: thumbnail.bVotes,
        voteIds: [...thumbnail.voteIds, userId],
      });
    }
  },
});
