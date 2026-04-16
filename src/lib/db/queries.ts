import { db } from './index';
import { reports, admins, type ReportStatus, type InsertReport } from './schema';
import { eq, desc } from 'drizzle-orm';

// Get all reports (admin)
export async function getAllReports() {
  return db.select().from(reports).orderBy(desc(reports.createdAt));
}

// Get report by ID
export async function getReportById(id: string) {
  const result = await db.select().from(reports).where(eq(reports.id, id));
  return result[0] || null;
}

// Get reports by status
export async function getReportsByStatus(status: ReportStatus) {
  return db.select().from(reports).where(eq(reports.status, status)).orderBy(desc(reports.createdAt));
}

// Create report
export async function createReport(data: InsertReport) {
  const result = await db.insert(reports).values(data).returning();
  return result[0];
}

// Update report status
export async function updateReportStatus(id: string, status: ReportStatus) {
  const result = await db.update(reports)
    .set({ status, updatedAt: new Date() })
    .where(eq(reports.id, id))
    .returning();
  return result[0];
}

// Get admin by username
export async function getAdminByUsername(username: string) {
  const result = await db.select().from(admins).where(eq(admins.username, username));
  return result[0] || null;
}