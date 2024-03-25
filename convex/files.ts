import { v } from "convex/values";
import { authMutation, authQuery } from "./util";

export const generateUploadUrl = authMutation({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = authQuery({
  args: { imageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.imageId);
  },
});
