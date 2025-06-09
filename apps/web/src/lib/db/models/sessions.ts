import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { AsyncErr } from "@/lib/error/types";
import { db } from "../drizzle";
import { err, ok } from "neverthrow";
import { getErr } from "@/lib/error/utils";

export const sessionTypeEnum = pgEnum("session_type", [
  "passwordReset",
  "user",
]);

export const sessionsTable = pgTable("user_sessions", {
  uid: text("uid")
    .references(() => usersTable.id)
    .primaryKey(),
  expires: timestamp("expires").notNull(),
  token: text("token").notNull().unique(),
  type: sessionTypeEnum("type").notNull(),
});

export type SelectSession = typeof sessionsTable.$inferSelect;
export type InsertSession = typeof sessionsTable.$inferInsert;

export type CreateSessionErr = "No rows inserted";
async function createSession(
  s: InsertSession,
): AsyncErr<boolean, CreateSessionErr> {
  try {
    const res = await db.insert(sessionsTable).values(s);
    if (!res.rows.length)
      return err({
        type: "No rows inserted",
        message: "There were no rows inserted into the db",
        context: { stack: new Error("").stack, dbRes: JSON.stringify(res) },
      });
    return ok(true);
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

export const sessions = {
  createSession,
};
