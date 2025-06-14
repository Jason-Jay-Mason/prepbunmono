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
import { AsyncResult } from "@/lib/error/types";

export const usersTable = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  emailConfirmed: boolean("email_confirmed").notNull().default(false),

  // Password reset
  passwordResetToken: text("password_reset_token"),
  passwordResetTokenExpires: timestamp("password_reset_token_expires"),

  loginAttempts: integer("login_attempts").default(0).notNull(),
  lastLoginAttempt: timestamp("last_login_attempt"),

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});



export type SelectUser = typeof usersTable.$inferSelect;
export type ClientUser = Pick<SelectUser, 'id' | 'email' >;
export type InsertUser = typeof usersTable.$inferInsert;

export namespace UserModel {
  export async function updatePasswordResetToken(
    uid: string,
    token: string,
    expires: Date,
  ): AsyncResult<boolean, "User not found"> {
    try {
      const res = await db
        .update(usersTable)
        .set({ passwordResetToken: token, passwordResetTokenExpires: expires })
        .where(eq(usersTable.id, uid))
        .returning();
      if (!res.length) {
        return err({
          type: "User not found",
          message: "User not found when trying to update password reset token",
          stack: new Error("User not found").stack,
        });
      }
      return ok(res.length > 0);
    } catch (unsafe) {
      const e = getErr(unsafe);
      return err({
        type: "Unknown error",
        cause: e,
        context: e.stack,
      });
    }
  }

  export async function createOne(
    u: InsertUser,
  ): AsyncResult<InsertUser, "Email taken" | "Id taken"> {
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

  export async function emailIsUnique(
    email: string,
  ): AsyncResult<boolean, never> {
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

  export async function readByEmail(
    email: string,
  ): AsyncResult<SelectUser, "User nonexistent"> {
    try {
      const users = await db
        .select()
        .from(usersTable)
        .where((user) => eq(user.email, email))
        .limit(1);
      if (!users.length) {
        return err({
          type: "User nonexistent",
          message: "User nonexistent",
          context: new Error().stack,
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

  export async function setLoginAttempts(
    uid: string,
    num: number,
  ): AsyncResult<boolean, "User not found"> {
    try {
      const d = new Date();
      const res = await db
        .update(usersTable)
        .set({ lastLoginAttempt: d, loginAttempts: num })
        .where(eq(usersTable.id, uid))
        .returning();

      //This is a fatal error because we should always be passing in a valid uid here
      if (!res.length) {
        return err({
          type: "User not found",
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
}
