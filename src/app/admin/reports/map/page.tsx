import { getAllReports } from '@/lib/db/queries';
import MapViewClient from './MapViewClient';

export default async function MapViewPage() {
  const reports = await getAllReports();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Tampilan Peta</h1>
        <p className="text-blue-100 mt-2">
          Lihat semua laporan pada peta interaktif
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Tidak ada laporan untuk ditampilkan pada peta.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Menunggu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Dalam Proses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Selesai</span>
            </div>
          </div>
          <MapViewClient reports={reports} />
        </div>
      )}
    </div>
  );
}
