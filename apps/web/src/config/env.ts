import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PAYLOAD_SECRET: z.string().min(1),
    PAYLOAD_DATABASE_URI_DEV: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLIENT_URL: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
  },
  runtimeEnv: {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    PAYLOAD_DATABASE_URI_DEV: process.env.PAYLOAD_DATABASE_URI_DEV,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
});
