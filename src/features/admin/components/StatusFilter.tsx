'use client';

import { ReportStatus } from '@/lib/db/schema';

interface StatusFilterProps {
  selectedStatus: ReportStatus | 'ALL';
  onStatusChange: (status: ReportStatus | 'ALL') => void;
}

export default function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
        Filter status:
      </label>
      <select
        id="status-filter"
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value as ReportStatus | 'ALL')}
        className="block rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm py-2 px-4 border bg-white"
      >
        <option value="ALL">Semua Laporan</option>
        <option value="PENDING">Menunggu</option>
        <option value="IN_PROGRESS">Dalam Proses</option>
        <option value="RESOLVED">Selesai</option>
      </select>
    </div>
  );
}
