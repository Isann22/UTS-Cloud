import { pgTable, uuid, text, real, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const reportStatusEnum = pgEnum('report_status', [
  'PENDING',
  'IN_PROGRESS',
  'RESOLVED'
]);

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  status: reportStatusEnum('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;