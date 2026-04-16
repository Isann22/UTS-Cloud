import { getReportById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import ReportDetailClient from '@/features/admin/components/ReportDetailClient';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ReportDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    notFound();
  }

  return <ReportDetailClient report={report} />;
}
