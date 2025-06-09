import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { AsyncErr } from "@/lib/error/types";
import { db } from "../drizzle";
import { err, ok } from "neverthrow";
import { getErr } from "@/lib/error/utils";
import { pendingUsersTable } from "./pendingUsers";
import { eq } from "drizzle-orm";

export const pendingUserSessionsTable = pgTable("pending_user_sessions", {
  uid: text("uid")
    .references(() => pendingUsersTable.id)
    .primaryKey(),
  sessionTokenExpires: timestamp("expires").notNull(),
  sessionTokentoken: text("token").notNull().unique(),
});

export type SelectPendingUserSession =
  typeof pendingUserSessionsTable.$inferSelect;
export type InsertPendingUserSession =
  typeof pendingUserSessionsTable.$inferInsert;

export type CreateSessionErr = "No rows inserted";
async function createOne(
  s: InsertPendingUserSession,
): AsyncErr<InsertPendingUserSession, CreateSessionErr> {
  try {
    const res = await db.insert(pendingUserSessionsTable).values(s).returning();
    if (!res.length)
      return err({
        type: "No rows inserted",
        message: "There were no rows inserted into the db",
        context: { stack: new Error("").stack, dbRes: JSON.stringify(res) },
      });
    return ok(res[0]);
  } catch (unsafe) {
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      message: "Unown error creating session in db",
      cause: e,
      context: e.stack,
    });
  }
}

async function getSessionByUid(
  uid: string,
): AsyncErr<SelectPendingUserSession, "No user session found"> {
  try {
    const res = await db
      .select()
      .from(pendingUserSessionsTable)
      .where(eq(pendingUserSessionsTable.uid, uid));
    if (!res.length)
      return err({
        type: "No user session found",
        message: "No user session found",
      });
    return ok(res[0]);
  } catch (unsafe) {
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      message: "Unown error getting session by uid in db",
      cause: e,
      context: e.stack,
    });
  }
}

export const pendingUserSession = {
  createOne,
  getSessionByUid,
};
