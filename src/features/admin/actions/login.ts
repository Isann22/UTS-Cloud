'use server';

import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    if (!username || !password) {
      return {
        success: false,
        error: 'Nama pengguna dan kata sandi wajib diisi',
      };
    }

    // Trim whitespace
    username = username.trim();

    // Query admin by username
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);

    const admin = result[0];

    // If admin not found or password doesn't match, return generic error
    if (!admin) {
      return {
        success: false,
        error: 'Nama pengguna atau kata sandi salah',
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Nama pengguna atau kata sandi salah',
      };
    }

    // Create session
    await createSession(admin.id, admin.username);

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat login. Silakan coba lagi.',
    };
  }
}
