import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  thumbnails: defineTable({
    title: v.string(),
    userId: v.string(),
    aImage: v.string(),
    aVotes: v.number(),
    bImage: v.string(),
    bVotes: v.number(),
    voteIds: v.array(v.string()),
  }),
});
