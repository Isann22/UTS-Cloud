import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { AdminSession } from '@/features/admin/types';

export async function requireAuth(): Promise<AdminSession> {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return session;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  return getSession();
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
