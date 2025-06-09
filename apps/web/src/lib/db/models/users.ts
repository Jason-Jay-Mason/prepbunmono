import {
  integer,
  boolean,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { getErr } from "@/lib/error/utils";
import { AsyncErr } from "@/lib/error/types";

export const usersTable = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  emailConfirmed: boolean("email_confirmed").notNull().default(false),

  // Email confirmation
  confirmationToken: text("confirmation_token"),
  confirmationTokenExpires: timestamp("confirmation_token_expires"),

  // Password reset
  passwordResetToken: text("password_reset_token"),
  passwordResetTokenExpires: timestamp("password_reset_token_expires"),

  loginAttempts: integer("login_attempts").default(0).notNull(),
  lastLoginAttempt: timestamp("last_login_attempt"),

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

async function updatePasswordResetToken(
  uid: string,
  token: string,
  expires: Date,
): AsyncErr<boolean, "Unknown error"> {
  try {
    const res = await db
      .update(usersTable)
      .set({ passwordResetToken: token, passwordResetTokenExpires: expires })
      .where(eq(usersTable.id, uid));
    return ok(res.rows.length > 0);
  } catch (unsafe) {
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      cause: e,
      context: e.stack,
    });
  }
}

export type CreateUserErr = "Email taken" | "Id taken";
async function createOne(u: InsertUser): AsyncErr<InsertUser, CreateUserErr> {
  try {
    const res = await db.insert(usersTable).values(u).returning();
    return ok(res[0]);
  } catch (unsafe) {
    const e = getErr(unsafe);
    if (e.message.search("user_email_unique")) {
      return err({
        type: "Email taken",
        cause: e,
        context: e.stack,
      });
    }

    return err({
      type: "Unknown error",
      cause: e,
      context: e.stack,
    });
  }
}

async function emailIsUnique(email: string): AsyncErr<boolean, any> {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return ok(users.length <= 0);
  } catch (unsafe) {
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      cause: e,
      context: e.stack,
    });
  }
}

export type GetUserByEmailErr = "User nonexistent";
async function readByEmail(
  email: string,
): AsyncErr<SelectUser | null, GetUserByEmailErr> {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where((user) => eq(user.email, email));
    if (!users.length) {
      return ok(null);
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
    const d = new Date();
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
  readByEmail,
  createOne,
  emailIsUnique,
  updatePasswordResetToken,
};
