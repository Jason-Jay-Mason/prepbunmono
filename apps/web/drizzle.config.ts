import { env } from "@/config/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/models/*",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URI,
  },
});
