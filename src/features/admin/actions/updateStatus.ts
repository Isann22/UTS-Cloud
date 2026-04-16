'use server';

import { updateReportStatus } from '@/lib/db/queries';
import { ReportStatus } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

export async function updateStatus(
  reportId: string,
  status: ReportStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate status
    const validStatuses: ReportStatus[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
    if (!validStatuses.includes(status)) {
      return { success: false, error: 'Invalid status value' };
    }

    // Update the report status in the database
    const updatedReport = await updateReportStatus(reportId, status);

    if (!updatedReport) {
      return { success: false, error: 'Report not found' };
    }

    // Revalidate the report detail page and list pages
    revalidatePath(`/admin/reports/${reportId}`);
    revalidatePath('/admin/reports');
    revalidatePath('/admin/reports/map');

    return { success: true };
  } catch (error) {
    console.error('Error updating report status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}
