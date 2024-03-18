import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";

export default {
  config(_input) {
    return {
      name: "thumbnailcritique",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const cfnWebACL = new wafv2.CfnWebACL(stack, "MyCDKWebAcl", {
        defaultAction: {
          allow: {},
        },
        scope: "CLOUDFRONT",
        visibilityConfig: {
          metricName: "MetricForWebACLCDK",
          cloudWatchMetricsEnabled: true,
          sampledRequestsEnabled: true,
        },
        name: "MyCDKWebAcl",
        rules: [
          {
            name: "LimitRequests",
            priority: 1,
            action: {
              block: {},
            },
            statement: {
              rateBasedStatement: {
                limit: 10000,
                aggregateKeyType: "IP",
              },
            },
            visibilityConfig: {
              sampledRequestsEnabled: true,
              cloudWatchMetricsEnabled: true,
              metricName: "LimitRequests",
            },
          },
        ],
      });

      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: "thumbnailcritique.com",
          domainAlias: "www.thumbnailcritique.com",
        },
        cdk: {
          distribution: {
            webAclId: cfnWebACL.attrArn,
          },
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
