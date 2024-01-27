import {
  ActionCtx,
  MutationCtx,
  QueryCtx,
  mutation,
} from "./_generated/server";
import {
  customQuery,
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => ({ user: await getUserOrThrow(ctx) }))
);

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => ({ user: await getUserOrThrow(ctx) }))
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

export const getUserById = async (
  ctx: QueryCtx | MutationCtx,
  userId: string
) => {
  return ctx.db;
};
