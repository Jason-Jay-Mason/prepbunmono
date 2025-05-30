import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().basePath("/api/v1");

const route = app.get(
  "/hello",
  zValidator(
    "query",
    z.object({
      name: z.string(),
    }),
  ),
  async (c) => {
    return c.json({
      message: `hello api`,
    });
  },
);

export const GET = app.fetch;
export const POST = app.fetch;
export type HonoApp = typeof route;
