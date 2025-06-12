import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { db } from "../drizzle";
import { eq, or } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { getErr } from "@/lib/error/utils";
import { AsyncResult } from "@/lib/error/types";
import { siteConfig } from "@/config/site";
import { SelectUser } from "./users";

export const pendingUsersTable = pgTable("pending_users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  // Email confirmation
  confirmationToken: text("confirmation_token"),
  confirmationTokenExpires: timestamp("confirmation_token_expires"),
  sessionToken: text("token").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type SelectPendingUser = typeof pendingUsersTable.$inferSelect;
export type SelectPendingUserSafe = Omit<SelectPendingUser, "password">;
export type InsertPendingUser = typeof pendingUsersTable.$inferInsert;

export namespace PendingUserModel {
  export async function readByEmail(
    email: string,
  ): AsyncResult<SelectPendingUser | null, "Unknown error"> {
    try {
      const res = await db
        .select()
        .from(pendingUsersTable)
        .where(eq(pendingUsersTable.email, email));
      if (!res.length) return ok(null);
      return ok(res[0]);
    } catch (unsafe) {
      const e = getErr(unsafe);
      return err({
        type: "Unknown error",
        cause: e,
        context: e.stack,
      });
    }
  }

  export type CreatePendingUserErr = "Pending email taken" | "Pending id taken";
  export async function createOne(
    p: InsertPendingUser,
  ): AsyncResult<InsertPendingUser, CreatePendingUserErr> {
    try {
      const [user] = await db
        .select()
        .from(pendingUsersTable)
        .where(
          or(
            eq(pendingUsersTable.email, p.email),
            eq(pendingUsersTable.id, p.id),
          ),
        )
        .limit(1);

      if (user) {
        if (user.email === p.email) {
          return err({ type: "Pending email taken" });
        }
        if (user.id === p.id) {
          return err({ type: "Pending id taken" });
        }
      }
      await db.insert(pendingUsersTable).values(p);
      return ok(p);
    } catch (unsafe) {
      const e = getErr(unsafe);
      return err({
        type: "Unknown error",
        cause: e,
        context: e.stack,
      });
    }
  }

  export async function readPendingUserByUid(
    uid: string,
  ): AsyncResult<SelectPendingUser, "No pending user found"> {
    try {
      const res = await db
        .select()
        .from(pendingUsersTable)
        .where(eq(pendingUsersTable.id, uid))
        .limit(1);
      if (!res.length)
        return err({
          type: "No pending user found",
          message: "No pending user found",
        });

      return ok(res[0]);
    } catch (unsafe) {
      const e = getErr(unsafe);
      return err({
        type: "Unknown error",
        cause: e,
        context: e.stack,
      });
    }
  }

  export async function updateConfirmationAndSessionTokenByUid(
    uid: string,
    confirmationToken: string,
    sessionToken: string,
  ): AsyncResult<InsertPendingUser, never> {
    try {
      const user = await db
        .update(pendingUsersTable)
        .set({
          confirmationToken: confirmationToken,
          confirmationTokenExpires: new Date(
            Date.now() + siteConfig.auth.confirmationCodeTtl,
          ),
          sessionToken: sessionToken,
          expiresAt: new Date(Date.now() + siteConfig.auth.pendingUserTtl),
        })
        .where(eq(pendingUsersTable.id, uid))
        .returning();
      return ok(user[0]);
    } catch (unsafe) {
      const e = getErr(unsafe);
      return err({
        type: "Unknown error",
        cause: e,
        context: e.stack,
      });
    }
  }

  export async function deleteByUid(uid: string): AsyncResult<InsertPendingUser, "No pending user found"> {
    try {
      const user = await db.delete(pendingUsersTable).where(eq(pendingUsersTable.id, uid)).returning();
      if (!user.length) {
        return err({
          type: "No pending user found",
          message: "No pending user found",
        });
      }
      return ok(user[0]);
    } catch (unsafe) {
      const e = getErr(unsafe);
      return err({
        type: "Unknown error",
        cause: e,
        context: e.stack,
      });
    }
  }

  export async function updateConfirmationAndSessionTokensByEmail(
    confirmationToken: string,
    sessionToken: string,
    email: string,
  ): AsyncResult<InsertPendingUser, never> {
    try {
      const user = await db
        .update(pendingUsersTable)
        .set({
          confirmationToken: confirmationToken,
          confirmationTokenExpires: new Date(
            Date.now() + siteConfig.auth.confirmationCodeTtl,
          ),
          sessionToken: sessionToken,
          expiresAt: new Date(Date.now() + siteConfig.auth.pendingUserTtl),
        })
        .where(eq(pendingUsersTable.email, email))
        .returning();
      return ok(user[0]);
    } catch (unsafe) {
      const e = getErr(unsafe);
      return err({
        type: "Unknown error",
        cause: e,
        context: e.stack,
      });
    }
  }
}
