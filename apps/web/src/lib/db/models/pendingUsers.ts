import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { db } from "../drizzle";
import { eq, or } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { getErr } from "@/lib/error/utils";
import { AsyncErr } from "@/lib/error/types";
import { siteConfig } from "@/config/site";

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

async function readByEmail(
  email: string,
): AsyncErr<SelectPendingUser | null, "Unknown error"> {
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
async function createOne(
  p: InsertPendingUser,
): AsyncErr<InsertPendingUser, CreatePendingUserErr> {
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

async function readPendingUserByUid(
  uid: string,
): AsyncErr<SelectPendingUserSafe, "No pending user found"> {
  try {
    const res = await db
      .select()
      .from(pendingUsersTable)
      .where(eq(pendingUsersTable.id, uid));
    if (!res.length)
      return err({
        type: "No pending user found",
        message: "No pending user found",
      });

    const { password, ...userWithoutPassword } = res[0];
    return ok(userWithoutPassword);
  } catch (unsafe) {
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      cause: e,
      context: e.stack,
    });
  }
}

async function updateConfirmationAndSessionTokensByEmail(
  confirmationToken: string,
  sessionToken: string,
  email: string,
): AsyncErr<InsertPendingUser, any> {
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

export const pendingUsers = {
  updateConfirmationAndSessionTokensByEmail,
  createOne,
  readPendingUserByUid,
  readByEmail,
};
