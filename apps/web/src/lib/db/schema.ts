import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const deleteme = pgTable("deleteme", {
  id: integer("id").primaryKey(),
  message: text("message").notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").notNull(),
});

export const sessions = pgTable("session", {
  uid: uuid("uid")
    .references(() => users.id)
    .primaryKey()
    .unique(),
  expires: timestamp("expires").notNull(),
  token: text("token").notNull(),
});
