import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { AsyncResult } from "@/lib/error/types";
import { db } from "../drizzle";
import { err, ok } from "neverthrow";
import { getErr } from "@/lib/error/utils";
import { usersTable } from "./users";

export type SessionType = "passwordReset" | "student" | "tutor" | "admin";

export const sessionTypeEnum = pgEnum("session_type", [
  "passwordReset",
  "student",
  "tutor",
  "admin",
]);

export const sessionsTable = pgTable("user_sessions", {
  token: text("token").notNull().unique().primaryKey(),
  uid: text("uid").references(() => usersTable.id), //how do we do this?
  expires: timestamp("expires").notNull(),
  type: sessionTypeEnum("type").notNull(),
});

export type SelectSession = typeof sessionsTable.$inferSelect;
export type InsertSession = typeof sessionsTable.$inferInsert;

export namespace SessionModel {
  export type CreateSessionErr = "No session inserted";
  export async function createOne(
    s: InsertSession,
  ): AsyncResult<boolean, CreateSessionErr> {
    try {
      const res = await db.insert(sessionsTable).values(s).returning();
      if (!res.length)
        return err({
          type: "No session inserted",
          message: "There were no sessions inserted into the db",
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
}
