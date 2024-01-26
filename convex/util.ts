import { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";

export const getUserId = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const getUser = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  return await ctx.auth.getUserIdentity();
};

export const getUserById = async (
  ctx: QueryCtx | MutationCtx,
  userId: string
) => {
  return ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
};
