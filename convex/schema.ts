import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  thumbnails: defineTable({
    title: v.string(),
    userId: v.id("users"),
    images: v.array(v.string()),
    votes: v.array(v.number()),
    voteIds: v.array(v.id("users")),
    profileImage: v.optional(v.string()),
    name: v.optional(v.string()),
  }),
  comments: defineTable({
    userId: v.id("users"),
    thumbnailId: v.id("thumbnails"),
    text: v.string(),
    createdAt: v.number(),
    name: v.string(),
    profileUrl: v.string(),
  }).index("by_thumbnailnId", ["thumbnailId"]),
  follows: defineTable({
    userId: v.id("users"),
    targetUserId: v.id("users"),
  })
    .index("by_userId_targetUserId", ["userId", "targetUserId"])
    .index("by_targetUserId", ["targetUserId"]),
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    subscriptionId: v.optional(v.string()),
    endsOn: v.optional(v.number()),
    credits: v.number(),
    name: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
    profileImage: v.optional(v.string()),
    isPremium: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .index("by_subscriptionId", ["subscriptionId"]),
  notifications: defineTable({
    userId: v.id("users"),
    thumbnailId: v.id("thumbnails"),
    isRead: v.boolean(),
    type: v.union(
      v.literal("thumbnail"),
      v.literal("vote"),
      v.literal("comment")
    ),
    from: v.id("users"),
  }).index("by_userId", ["userId"]),
});
