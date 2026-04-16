'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Report } from '@/lib/db/schema';

// Dynamically import GlobalMap to avoid SSR issues with Leaflet
const GlobalMap = dynamic(() => import('@/features/admin/components/GlobalMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Memuat peta...</p>
    </div>
  ),
});

interface MapViewClientProps {
  reports: Report[];
}

export default function MapViewClient({ reports }: MapViewClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Memuat peta...</p>
      </div>
    );
  }

  return <GlobalMap reports={reports} />;
}
