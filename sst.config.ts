import { type SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

const config: SSTConfig = {
  config(input) {
    return {
      name: "ProjectManagementApp",
      region: input.region || "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Stack({ stack }) {
      const site = new NextjsSite(stack, "site", {
        path: ".",
        environment: {
          // Supabase Environment Variables
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          DATABASE_URL: process.env.DATABASE_URL || "",
          DIRECT_URL: process.env.DIRECT_URL || "",
          JWT_SECRET: process.env.JWT_SECRET || "",

          // NextAuth Variables
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
          NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
};

export default config;