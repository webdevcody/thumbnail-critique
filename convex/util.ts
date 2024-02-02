import {
  ActionCtx,
  MutationCtx,
  QueryCtx,
  action,
  mutation,
} from "./_generated/server";
import {
  customQuery,
  customCtx,
  customMutation,
  customAction,
} from "convex-helpers/server/customFunctions";
import { query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    try {
      return { user: await getUserOrThrow(ctx) };
    } catch (err) {
      return { user: null };
    }
  })
);

export const authAction = customAction(
  action,
  customCtx(async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;

    if (!userId) {
      throw new ConvexError("must be logged in");
    }

    const user: any = await ctx.runQuery(internal.users.getUserById, {
      userId,
    });

    if (!user) {
      throw new ConvexError("user not found");
    }

    const _id: Id<"users"> = user._id;
    const isPremium: boolean = user.isPremium;

    return {
      user: {
        _id,
        userId,
        isPremium,
      },
    };
  })
);

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => ({ user: await getUserOrThrow(ctx) }))
);

export const adminAuthAction = customAction(
  action,
  customCtx(async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;

    if (!userId) {
      throw new ConvexError("must be logged in");
    }

    const user: any = await ctx.runQuery(internal.users.getUserById, {
      userId,
    });

    if (!user) {
      throw new ConvexError("user not found");
    }

    if (!user.isAdmin) {
      throw new ConvexError("must be admin to run this action");
    }

    const _id: Id<"users"> = user._id;

    return {
      user: {
        _id,
        userId,
      },
    };
  })
);

export const adminAuthMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await getUserOrThrow(ctx);

    if (!user.isAdmin) {
      throw new ConvexError("must be admin to run this mutation");
    }

    return { user };
  })
);

async function getUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const userId = (await ctx.auth.getUserIdentity())?.subject;

  if (!userId) {
    throw new ConvexError("must be logged in");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  if (!user) {
    throw new ConvexError("user not found");
  }

  return user;
}

export const getUser = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  return await ctx.auth.getUserIdentity();
};
