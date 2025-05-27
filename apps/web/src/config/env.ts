import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PAYLOAD_SECRET: z.string().min(1),
    PAYLOAD_DATABASE_URI: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    POSTGRES_URI: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLIENT_URL: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_MAPS: z.string().min(1),
  },
  runtimeEnv: {
    JWT_SECRET: process.env.JWT_SECRET,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    PAYLOAD_DATABASE_URI: process.env.PAYLOAD_DATABASE_URI,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_GOOGLE_MAPS: process.env.NEXT_PUBLIC_GOOGLE_MAPS,
    POSTGRES_URI: process.env.POSTGRES_URI,
  },
});
