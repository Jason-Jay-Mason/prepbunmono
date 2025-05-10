import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    //WARN: these need to be added to prodution environment
    PAYLOAD_DATABASE_URI: z.string().min(1),
    PAYLOAD_DATABASE_DEV_URI: z.string().min(1),
    PAYLOAD_DATABASE_BACKUP_URI: z.string().min(1),
    PAYLOAD_SECRET: z.string().min(1),
    NEXT_INTERNAL_URL: z.string().min(1).default("http://localhost:3000"),
    //WARN:

    //These of for lsp
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    LOG_LEVEL: z
      .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
      .default("info"),
    SESSION_SECRET: z.string().min(1).optional(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    //WARN: these need to be added to prodution environment
    NEXT_PUBLIC_CLIENT_URL: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
    //WARN:

    //These of for lsp
    NEXT_PUBLIC_NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnv: process.env,
});
