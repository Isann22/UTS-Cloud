'use client';

import { useState } from 'react';
import { ReportStatus } from '@/lib/db/schema';
import { updateStatus } from '@/features/admin/actions/updateStatus';
import { useRouter } from 'next/navigation';

interface StatusSelectProps {
  reportId: string;
  currentStatus: ReportStatus;
}

export default function StatusSelect({ reportId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleStatusChange = async (newStatus: ReportStatus) => {
    if (newStatus === status) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateStatus(reportId, newStatus);

      if (result.success) {
        setStatus(newStatus);
        setMessage({ type: 'success', text: 'Status berhasil diperbarui' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal memperbarui status' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Ubah Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as ReportStatus)}
          disabled={isLoading}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <option value="PENDING">Menunggu</option>
          <option value="IN_PROGRESS">Dalam Proses</option>
          <option value="RESOLVED">Selesai</option>
        </select>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Transisi yang valid:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Menunggu → Dalam Proses</li>
          <li>Dalam Proses → Selesai</li>
          <li>Selesai → Menunggu</li>
        </ul>
      </div>
    </div>
  );
}
