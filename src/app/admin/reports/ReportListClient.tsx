'use client';

import { useState } from 'react';
import { Report, ReportStatus } from '@/lib/db/schema';
import ReportTable from '@/features/admin/components/ReportTable';
import StatusFilter from '@/features/admin/components/StatusFilter';

interface ReportListClientProps {
  reports: Report[];
}

export default function ReportListClient({ reports }: ReportListClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | 'ALL'>('ALL');

  const filteredReports = selectedStatus === 'ALL'
    ? reports
    : reports.filter((report) => report.status === selectedStatus);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <StatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
          {filteredReports.length} {filteredReports.length === 1 ? 'laporan' : 'laporan'}
        </div>
      </div>
      <ReportTable reports={filteredReports} />
    </div>
  );
}
