import { integer, boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { getErr } from "@/lib/error/utils";
import { AsyncErr } from "@/lib/error/types";

export const usersTable = pgTable("users", {
  id: uuid("id").notNull().primaryKey().unique(),
  email: text("email").notNull().unique(),
  emailConfirmed: boolean("email_confirmed").notNull().default(false),
  // Email confirmation
  confirmationToken: text("confirmation_token"),
  confirmationTokenExpires: text("confirmation_token_expires"),

  // Password reset
  passwordResetToken: text("password_reset_token"),
  passwordResetTokenExpires: text("password_reset_token_expires"),

  password: text("password").notNull(),
  loginAttempts: integer("login_attempts").default(0).notNull(),
  lastLoginAttempt: text("last_login_attempt"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type CreateUserErr = "Email taken" | "Id taken";
async function createUser(u: InsertUser): AsyncErr<InsertUser, CreateUserErr> {
  try {
    const res = await db.insert(usersTable).values(u).returning();
    return ok(res[0]);
  } catch (unsafe) {
    //TODO: I need to figure out what the error looks like when the email is already taken
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      cause: e,
      context: e.stack,
    });
  }
}

export type GetUserWithCredsErr = "User nonexistent";
async function getUserByEmail(
  email: string,
): AsyncErr<SelectUser, GetUserWithCredsErr> {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where((user) => eq(user.email, email));
    if (!users.length) {
      return err({
        type: "User nonexistent",
      });
    }
    return ok(users[0]);
  } catch (unsafe) {
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      cause: e,
      context: e.stack,
    });
  }
}

export type SetLoginAtteptsErr = "Fatal: user not found";
async function setLoginAttempts(
  uid: string,
  num: number,
): AsyncErr<boolean, SetLoginAtteptsErr> {
  try {
    const d = new Date().toISOString();
    const res = await db
      .update(usersTable)
      .set({ lastLoginAttempt: d, loginAttempts: num })
      .where(eq(usersTable.id, uid));

    //This is a fatal error because we should always be passing in a valid uid here
    if (!res.rows.length) {
      return err({
        type: "Fatal: user not found",
        message: "User not found in setLoginAttemps users model method",
        context: new Error().stack,
      });
    }
    return ok(true);
  } catch (unsafe) {
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      cause: e,
      context: e.stack,
    });
  }
}

export const users = {
  setLoginAttempts,
  getUserByEmail,
  createUser,
};
