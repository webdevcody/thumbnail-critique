import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { authMutation, authQuery } from "./util";

const FREE_CREDITS = 5;

export const getUser = authQuery({
  args: {},
  handler: async (ctx, args) => {
    return ctx.user;
  },
});

export const getUserById = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return user;
  },
});

export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    return {
      name: user?.name,
      profileImage: user?.profileImage,
    };
  },
});

export const createUser = internalMutation({
  args: {
    email: v.string(),
    userId: v.string(),
    name: v.string(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (user) return;

    await ctx.db.insert("users", {
      email: args.email,
      userId: args.userId,
      profileImage: args.profileImage,
      credits: FREE_CREDITS,
      name: args.name,
    });
  },
});

export const updateUser = internalMutation({
  args: { userId: v.string(), name: v.string(), profileImage: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("user not found");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      profileImage: args.profileImage,
    });
  },
});

export const updateSubscription = internalMutation({
  args: {
    subscriptionId: v.string(),
    userId: v.id("users"),
    endsOn: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("no user found with that user id");
    }

    await ctx.db.patch(user._id, {
      subscriptionId: args.subscriptionId,
      endsOn: args.endsOn,
    });
  },
});

export const updateSubscriptionBySubId = internalMutation({
  args: { subscriptionId: v.string(), endsOn: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_subscriptionId", (q) =>
        q.eq("subscriptionId", args.subscriptionId)
      )
      .first();

    if (!user) {
      throw new Error("no user found with that user id");
    }

    await ctx.db.patch(user._id, {
      endsOn: args.endsOn,
    });
  },
});

export const getMyUser = authQuery({
  args: {},
  async handler(ctx, args) {
    return ctx.user;
  },
});

export const updateMyUser = authMutation({
  args: { name: v.string() },
  async handler(ctx, args) {
    await ctx.db.patch(ctx.user._id, {
      name: args.name,
    });
  },
});
