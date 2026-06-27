import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    text: varchar({ length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
