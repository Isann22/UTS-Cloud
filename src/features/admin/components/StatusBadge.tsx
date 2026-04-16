import { ReportStatus } from '@/lib/db/schema';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: ReportStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusLabels = {
    PENDING: 'Menunggu',
    IN_PROGRESS: 'Dalam Proses',
    RESOLVED: 'Selesai',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm',
        {
          'bg-gradient-to-r from-red-100 to-red-200 text-red-800': status === 'PENDING',
          'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800': status === 'IN_PROGRESS',
          'bg-gradient-to-r from-green-100 to-green-200 text-green-800': status === 'RESOLVED',
        }
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
