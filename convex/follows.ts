import { ConvexError, v } from "convex/values";
import { authMutation, authQuery } from "./util";

export const unfollowUser = authMutation({
  args: { targetUserId: v.id("users") },
  handler: async (ctx, args) => {
    const targetUser = await ctx.db
      .query("follows")
      .withIndex("by_userId_targetUserId", (q) =>
        q.eq("userId", ctx.user._id).eq("targetUserId", args.targetUserId)
      )
      .first();

    if (!targetUser) {
      throw new ConvexError("you already unfollowed this user");
    }

    await ctx.db.delete(targetUser._id);
  },
});

export const followUser = authMutation({
  args: { targetUserId: v.id("users") },
  handler: async (ctx, args) => {
    const targetUser = await ctx.db
      .query("follows")
      .withIndex("by_userId_targetUserId", (q) =>
        q.eq("userId", ctx.user._id).eq("targetUserId", args.targetUserId)
      )
      .first();

    if (targetUser) {
      throw new ConvexError("you already follow this user");
    }

    await ctx.db.insert("follows", {
      targetUserId: args.targetUserId,
      userId: ctx.user._id,
    });
  },
});

export const getFollow = authQuery({
  args: { targetUserId: v.id("users") },
  handler: async (ctx, args) => {
    if (!ctx.user) return null;

    return await ctx.db
      .query("follows")
      .withIndex("by_userId_targetUserId", (q) =>
        q.eq("userId", ctx.user._id).eq("targetUserId", args.targetUserId)
      )
      .first();
  },
});

export const getPeers = authQuery({
  args: {},
  handler: async (ctx, args) => {
    if (!ctx.user) return [];

    const peers = await ctx.db
      .query("follows")
      .withIndex("by_userId_targetUserId", (q) => q.eq("userId", ctx.user._id))
      .collect();

    return Promise.all(
      peers.map(async (peer) => {
        const user = await ctx.db.get(peer.targetUserId);
        return {
          _id: user?._id,
          profileImage: user?.profileImage,
          name: user?.name,
        };
      })
    );
  },
});
