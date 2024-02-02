import OpenAI from "openai";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

const openai = new OpenAI();

export const generateAIComment = internalAction({
  args: {
    thumbnailId: v.id("thumbnails"),
  },
  async handler(ctx, args) {
    const thumbnail = await ctx.runQuery(api.thumbnails.getThumbnail, {
      thumbnailId: args.thumbnailId,
    });

    if (!thumbnail) {
      throw new Error("thumbnail by id did not exist");
    }

    const images = await Promise.all(
      thumbnail.images.map(async (imageId) => ({
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
              text: `Describe which thumbnail looks the best and might provide the highest click through rate:`,
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
      userId: thumbnail.userId,
    });
  },
});
