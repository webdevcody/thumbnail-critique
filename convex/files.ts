import { authMutation } from "./util";

export const generateUploadUrl = authMutation({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});
