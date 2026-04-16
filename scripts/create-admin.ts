import { db } from '../src/lib/db';
import { admins } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';

  try {
    // Check if admin already exists
    const existing = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);

    if (existing.length > 0) {
      console.log('❌ Admin dengan username tersebut sudah ada!');
      console.log(`Username: ${existing[0].username}`);
      console.log(`ID: ${existing[0].id}`);
      process.exit(1);
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin user
    const result = await db
      .insert(admins)
      .values({
        username,
        passwordHash,
      })
      .returning();

    console.log('✅ Admin berhasil dibuat!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 Username: ${result[0].username}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🆔 ID: ${result[0].id}`);
    console.log(`📅 Dibuat: ${result[0].createdAt}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Gunakan kredensial ini untuk login ke dashboard admin');
  } catch (error) {
    console.error('❌ Error membuat admin:', error);
    process.exit(1);
  }

  process.exit(0);
}

createAdmin();
