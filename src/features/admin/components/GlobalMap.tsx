'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Report } from '@/lib/db/schema';
import Link from 'next/link';

// Create custom colored marker icons for different statuses
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.4 12.5 28.5 12.5 28.5S25 20.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
      </svg>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });
};

const statusIcons = {
  PENDING: createColoredIcon('#ef4444'), // red
  IN_PROGRESS: createColoredIcon('#eab308'), // yellow
  RESOLVED: createColoredIcon('#22c55e'), // green
};

interface GlobalMapProps {
  reports: Report[];
  onMarkerClick?: (reportId: string) => void;
}

export default function GlobalMap({ reports, onMarkerClick }: GlobalMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Calculate center based on all reports or default to world view
  const center: [number, number] = reports.length > 0
    ? [
        reports.reduce((sum, r) => sum + r.latitude, 0) / reports.length,
        reports.reduce((sum, r) => sum + r.longitude, 0) / reports.length,
      ]
    : [0, 0];

  const zoom = reports.length > 0 ? 10 : 2;

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={statusIcons[report.status]}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(report.id);
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <p className="font-semibold text-sm mb-1">
                  {report.description.substring(0, 100)}
                  {report.description.length > 100 ? '...' : ''}
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  Status: <span className={`font-medium ${
                    report.status === 'PENDING' ? 'text-red-600' :
                    report.status === 'IN_PROGRESS' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>{report.status}</span>
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/admin/reports/${report.id}`}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
