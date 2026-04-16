import { db } from '../src/lib/db';
import { admins } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  const defaultUsername = 'admin';
  const defaultPassword = 'admin123';

  try {
    console.log('🌱 Memulai seeding admin default...\n');

    // Check if admin already exists
    const existing = await db
      .select()
      .from(admins)
      .where(eq(admins.username, defaultUsername))
      .limit(1);

    if (existing.length > 0) {
      console.log('ℹ️  Admin default sudah ada!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`👤 Username: ${existing[0].username}`);
      console.log(`🆔 ID: ${existing[0].id}`);
      console.log(`📅 Dibuat: ${existing[0].createdAt}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n💡 Gunakan kredensial berikut untuk login:');
      console.log(`   Username: ${defaultUsername}`);
      console.log(`   Password: ${defaultPassword}`);
      process.exit(0);
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // Insert admin user
    const result = await db
      .insert(admins)
      .values({
        username: defaultUsername,
        passwordHash,
      })
      .returning();

    console.log('✅ Admin default berhasil dibuat!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 Username: ${result[0].username}`);
    console.log(`🔑 Password: ${defaultPassword}`);
    console.log(`🆔 ID: ${result[0].id}`);
    console.log(`📅 Dibuat: ${result[0].createdAt}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Gunakan kredensial ini untuk login ke dashboard admin');
    console.log('🔗 URL Login: http://localhost:3000/admin/login');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedAdmin();
