import { getReportById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import ReportDetailClient from '@/features/admin/components/ReportDetailClient';

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
