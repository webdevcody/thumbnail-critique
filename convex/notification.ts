import { getProfile } from "./users";
import { authMutation, authQuery } from "./util";

export const markAllRead = authMutation({
  args: {},
  handler: async (ctx) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    await Promise.all(
      unreadNotifications.map(async (notification) => {
        return await ctx.db.patch(notification._id, {
          isRead: true,
        });
      })
    );
  },
});

export const hasUnread = authQuery({
  args: {},
  handler: async (ctx) => {
    if (!ctx.user) return false;

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    return unreadNotifications.length > 0;
  },
});

export const getNotifications = authQuery({
  args: {},
  handler: async (ctx) => {
    if (!ctx.user) return [];

    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), ctx.user._id))
      .order("desc")
      .collect();

    return Promise.all(
      notifications.map(async (notification) => {
        return {
          ...notification,
          thumbnail: await ctx.db.get(notification.thumbnailId),
          profile: await getProfile(ctx, { userId: notification.userId }),
        };
      })
    );
  },
});
