import { varchar, text, vector } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const embeddings = pgTable("embeddings", {
  id: varchar("id", { length: 191 }).primaryKey(),
  resourceId: varchar("resource_id", { length: 191 }),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
});
