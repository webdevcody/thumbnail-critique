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
              text: `Describe which Thumbnails Looks the Best and be sure to output enough description so the use knows which thumbnail you are talking about.  Try to judge the thumbnail on the following criteria:
              
              - Does it have a good color balance?
              - Does it have a good contrast?
              - Does it have a good lighting?
              - Is it simple?
              - Does it stand out?
              - Is the main subject obvious?
              - Is the text engaging enough for users to click?

              `,
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
