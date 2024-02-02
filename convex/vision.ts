import OpenAI from "openai";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

const openai = new OpenAI();

export const generateAIComment = internalAction({
  args: {
    imageIds: v.array(v.id("_storage")),
    thumbnailId: v.id("thumbnails"),
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const images = await Promise.all(
      args.imageIds.map(async (imageId) => ({
        type: "image_url",
        image_url: {
          url: await ctx.storage.getUrl(imageId),
        },
      }))
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Pick which Thumbnails Looks the Best:",
            },
            ...(images as any),
          ],
        },
      ],
    });

    const content = response.choices[0].message.content;

    await ctx.runMutation(internal.thumbnails.addCommentInternal, {
      thumbnailId: args.thumbnailId,
      text: content ?? "",
      userId: args.userId,
    });
  },
});
