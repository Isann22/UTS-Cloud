import Link from 'next/link';
import { Button, Card } from '@/components/ui';

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-green-400 to-green-600 p-4 shadow-lg">
                <svg
                  className="h-16 w-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Laporan Berhasil Dikirim!</h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Terima kasih telah membantu meningkatkan kebersihan lingkungan. Laporan Anda telah kami terima dan akan segera ditinjau oleh administrator kami.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/reports/new">
                <Button className="shadow-lg hover:shadow-xl transition-shadow">
                  Kirim Laporan Lainnya
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
