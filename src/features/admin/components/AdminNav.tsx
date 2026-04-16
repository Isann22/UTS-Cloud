'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin/reports') {
      return pathname === '/admin/reports' || pathname?.startsWith('/admin/reports/') && !pathname.includes('/map');
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="flex space-x-4">
      <Link
        href="/admin/reports"
        className={clsx(
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          isActive('/admin/reports')
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
        )}
      >
        Daftar Laporan
      </Link>
      <Link
        href="/admin/reports/map"
        className={clsx(
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          isActive('/admin/reports/map')
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
        )}
      >
        Tampilan Peta
      </Link>
    </nav>
  );
}
