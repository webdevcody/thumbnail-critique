import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { adminAuthMutation, authMutation, authQuery } from "./util";

export const createThumbnail = authMutation({
  args: {
    title: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("thumbnails", {
      title: args.title,
      userId: ctx.user._id,
      images: args.images,
      votes: args.images.map(() => 0),
      voteIds: [],
      profileImage: ctx.user.profileImage,
      name: ctx.user.name,
    });
  },
});

export const getComments = query({
  args: { thumbnailId: v.id("thumbnails") },
  async handler(ctx, args) {
    return ctx.db
      .query("comments")
      .withIndex("by_thumbnailnId", (q) =>
        q.eq("thumbnailId", args.thumbnailId)
      )
      .collect();
  },
});

export const addComment = authMutation({
  args: { thumbnailId: v.id("thumbnails"), text: v.string() },
  handler: async (ctx, args) => {
    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      throw new Error("thumbnail by id did not exist");
    }

    await ctx.db.insert("comments", {
      createdAt: Date.now(),
      text: args.text,
      userId: ctx.user._id,
      thumbnailId: args.thumbnailId,
      name: ctx.user.name ?? "Annoymous",
      profileUrl: ctx.user.profileImage ?? "",
    });
  },
});

export const getThumbnail = query({
  args: { thumbnailId: v.id("thumbnails") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.thumbnailId);
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

export const getMyThumbnails = authQuery({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db
      .query("thumbnails")
      .filter((q) => q.eq(q.field("userId"), ctx.user._id))
      .collect();
  },
});

export const getThumbnailsForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("thumbnails")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const voteOnThumbnail = authMutation({
  args: {
    thumbnailId: v.id("thumbnails"),
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      throw new Error("invalid thumbnail id");
    }

    if (thumbnail.voteIds.includes(ctx.user._id)) {
      throw new Error("you've already voted");
    }

    const voteIdx = thumbnail.images.findIndex((i) => i === args.imageId);
    thumbnail.votes[voteIdx]++;
    thumbnail.voteIds.push(ctx.user._id);

    await ctx.db.patch(thumbnail._id, thumbnail);
  },
});

export const deleteThumbnail = adminAuthMutation({
  args: { thumbnailId: v.id("thumbnails") },
  async handler(ctx, args) {
    await ctx.db.delete(args.thumbnailId);
  },
});

export const adminDeleteComment = adminAuthMutation({
  args: { commentId: v.id("comments") },
  async handler(ctx, args) {
    await ctx.db.delete(args.commentId);
  },
});
