import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const deleteme = pgTable("deleteme", {
  id: integer("id").primaryKey(),
  message: text("message").notNull(),
});
