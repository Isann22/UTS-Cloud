'use client';

import dynamic from 'next/dynamic';
import StatusBadge from './StatusBadge';
import StatusSelect from './StatusSelect';
import Image from 'next/image';
import type { ReportStatus } from '@/lib/db/schema';

// Dynamically import DetailMap to avoid SSR issues with Leaflet
const DetailMap = dynamic(() => import('./DetailMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
      <p className="text-gray-500">Memuat peta...</p>
    </div>
  ),
});

interface Report {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface ReportDetailClientProps {
  report: Report;
}

export default function ReportDetailClient({ report }: ReportDetailClientProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">Detail Laporan</h1>
          <p className="mt-1 text-sm text-blue-100">
            ID Laporan: {report.id}
          </p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Report Information */}
        <div className="space-y-6">
          {/* Description Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Deskripsi
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{report.description}</p>
          </div>

          {/* Photo Card */}
          {report.imageUrl && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Foto
              </h2>
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={report.imageUrl}
                  alt="Foto laporan"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Timestamps Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Waktu
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Dibuat</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(report.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Terakhir Diperbarui</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(report.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          {/* Status Update Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Perbarui Status
            </h2>
            <StatusSelect reportId={report.id} currentStatus={report.status} />
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lokasi
          </h2>
          <DetailMap latitude={report.latitude} longitude={report.longitude} />
          <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <span className="font-medium">Koordinat:</span> {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
}
