import { getAllReports } from '@/lib/db/queries';
import ReportListClient from './ReportListClient';

export default async function ReportsPage() {
  const reports = await getAllReports();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Laporan Kebersihan</h1>
        <p className="mt-2 text-blue-100">
          Lihat dan kelola semua laporan masalah kebersihan
        </p>
      </div>
      <ReportListClient reports={reports} />
    </div>
  );
}
