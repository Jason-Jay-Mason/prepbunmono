import { db } from "@/lib/db/drizzle";
import { deleteme } from "@/lib/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
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
    const { name } = c.req.valid("query");
    const [message] = await db
      .selectDistinct()
      .from(deleteme)
      .where(eq(deleteme.id, 1));

    return c.json({
      message: `${message.message} ${name}`,
    });
  },
);

export const GET = app.fetch;
export const POST = app.fetch;
export type HonoApp = typeof route;
