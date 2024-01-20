import { v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  query,
} from "./_generated/server";
import { getUserId } from "./util";

const FREE_CREDITS = 5;

export const getUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return undefined;
    }

    return getFullUser(ctx, userId);
  },
});

export const isUserSubscribed = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getUserId(ctx);

  if (!userId) {
    return false;
  }

  const userToCheck = await getFullUser(ctx, userId);

  return (userToCheck?.endsOn ?? 0) > Date.now();
};

export const createUser = internalMutation({
  args: { email: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      email: args.email,
      userId: args.userId,
      credits: FREE_CREDITS,
    });
  },
});

export const updateSubscription = internalMutation({
  args: { subscriptionId: v.string(), userId: v.string(), endsOn: v.number() },
  handler: async (ctx, args) => {
    const user = await getFullUser(ctx, args.userId);

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

export function getFullUser(ctx: QueryCtx | MutationCtx, userId: string) {
  return ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}
