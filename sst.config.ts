import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "thumbnailcritique",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: "thumbnailcritique.com",
          domainAlias: "www.thumbnailcritique.com",
        },
        environment: {
          NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
          CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
          NEXT_PUBLIC_PLANNER_AI_FEEDBACK_URL:
            process.env.NEXT_PUBLIC_PLANNER_AI_FEEDBACK_URL,
          NEXT_PUBLIC_PLANNER_AI_PROJECT_ID:
            process.env.NEXT_PUBLIC_PLANNER_AI_PROJECT_ID,
        } as any,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
