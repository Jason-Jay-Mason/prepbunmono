import { authRoutes } from "@/lib/api/auth";
import { Hono } from "hono";
import posthog from "posthog-js";

const app = new Hono().basePath("/api/v1");

app.onError((err, c) => {
  console.error(err);
  posthog.captureException(err);
  return c.json(
    {
      error: "Internal server error",
      message: "An error occurred",
      data: null,
    },
    500,
  );
});

const routes = app.route("/auth", authRoutes);

export const GET = app.fetch;
export const POST = app.fetch;
export type HonoApp = typeof routes;
