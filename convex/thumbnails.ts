import { ConvexError, v } from "convex/values";
import { QueryCtx, internalMutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { adminAuthMutation, authAction, authMutation, authQuery } from "./util";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { AI_PROFILE_NAME } from "./constants";

export const createThumbnail = internalMutation({
  args: {
    title: v.string(),
    images: v.array(v.id("_storage")),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError("User not found");
    }

    const id = await ctx.db.insert("thumbnails", {
      title: args.title,
      userId: user._id,
      images: args.images,
      votes: args.images.map(() => 0),
      voteIds: [],
      profileImage: user.profileImage,
      name: user.name,
    });

    const following = await ctx.db
      .query("follows")
      .withIndex("by_targetUserId", (q) => q.eq("targetUserId", user._id))
      .collect();

    await Promise.all(
      following.map(async (followingUser) => {
        return await ctx.db.insert("notifications", {
          userId: followingUser.userId,
          from: user._id,
          isRead: false,
          thumbnailId: id,
          type: "thumbnail",
        });
      })
    );

    return id;
  },
});

export const createThumbnailAction = authAction({
  args: {
    title: v.string(),
    images: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const thumbnailId: Id<"thumbnails"> = await ctx.runMutation(
      internal.thumbnails.createThumbnail,
      {
        images: args.images,
        title: args.title,
        userId: ctx.user._id,
      }
    );

    if (ctx.user.isPremium) {
      await ctx.scheduler.runAfter(0, internal.vision.generateAIComment, {
        thumbnailId: thumbnailId,
      });
    }

    return thumbnailId;
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

    if (ctx.user._id !== thumbnail.userId) {
      await ctx.db.insert("notifications", {
        from: ctx.user._id,
        isRead: false,
        thumbnailId: args.thumbnailId,
        type: "comment",
        userId: thumbnail.userId,
      });
    }
  },
});

export const addCommentInternal = internalMutation({
  args: {
    thumbnailId: v.id("thumbnails"),
    text: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      throw new Error("thumbnail by id did not exist");
    }

    await ctx.db.insert("comments", {
      createdAt: Date.now(),
      text: args.text,
      userId: args.userId,
      thumbnailId: args.thumbnailId,
      name: AI_PROFILE_NAME,
      profileUrl: "",
    });
  },
});

export const getThumbnail = query({
  args: { thumbnailId: v.id("thumbnails") },
  handler: async (ctx, args) => {
    const thumbnail = await ctx.db.get(args.thumbnailId);
    if (!thumbnail) {
      throw new ConvexError("Thumbnail not found");
    }
    return await attachUrlToThumbnail(ctx, thumbnail);
  },
});

async function attachUrlToThumbnail(
  ctx: QueryCtx,
  thumbnail: Doc<"thumbnails">
) {
  return {
    ...thumbnail,
    urls: await Promise.all(
      thumbnail.images.map((image) => ctx.storage.getUrl(image))
    ),
  };
}

export const getRecentThumbnails = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const thumbnails = await ctx.db
      .query("thumbnails")
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...thumbnails,
      page: await Promise.all(
        thumbnails.page.map((thumbnail) => attachUrlToThumbnail(ctx, thumbnail))
      ),
    };
  },
});

export const getMyThumbnails = authQuery({
  args: {},
  handler: async (ctx, args) => {
    if (!ctx.user) return [];
    const thumbnails = await ctx.db
      .query("thumbnails")
      .filter((q) => q.eq(q.field("userId"), ctx.user._id))
      .collect();

    return await Promise.all(
      thumbnails.map((thumbnail) => attachUrlToThumbnail(ctx, thumbnail))
    );
  },
});

export const getThumbnailsForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const thumbnails = await ctx.db
      .query("thumbnails")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return await Promise.all(
      thumbnails.map((thumbnail) => attachUrlToThumbnail(ctx, thumbnail))
    );
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

    await ctx.db.insert("notifications", {
      from: ctx.user._id,
      isRead: false,
      thumbnailId: args.thumbnailId,
      type: "vote",
      userId: thumbnail.userId,
    });

    await ctx.db.patch(thumbnail._id, thumbnail);
  },
});

export const deleteThumbnail = adminAuthMutation({
  args: { thumbnailId: v.id("thumbnails") },
  async handler(ctx, args) {
    await ctx.db.delete(args.thumbnailId);
  },
});

export const deleteComment = authMutation({
  args: { commentId: v.id("comments") },
  async handler(ctx, args) {
    const comment = await ctx.db.get(args.commentId);

    if (!comment) {
      throw new ConvexError("invalid comment id");
    }

    if (comment.userId !== ctx.user._id) {
      throw new ConvexError("you can only delete your own comments");
    }

    await ctx.db.delete(args.commentId);
  },
});

export const adminDeleteComment = adminAuthMutation({
  args: { commentId: v.id("comments") },
  async handler(ctx, args) {
    await ctx.db.delete(args.commentId);
  },
});
