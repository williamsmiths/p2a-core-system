import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UserProfile } from '../database/entities/user-profile.entity';
import { UserRole } from '../common/enums';
import * as bcrypt from 'bcrypt';

/**
 * Script khởi tạo Super Admin và Admin users
 * Chạy: npm run script:init-admin
 */
async function initAdminUsers() {
  console.log('🚀 Bắt đầu khởi tạo Admin users...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Đảm bảo database schema đã được tạo
    console.log('🔄 Đang đồng bộ database schema...');
    console.log('📊 Database info:', {
      host: (dataSource.options as any).host,
      port: (dataSource.options as any).port,
      database: (dataSource.options as any).database,
    });
    
    await dataSource.synchronize();
    console.log('✅ Database schema đã được đồng bộ!');

    // Kiểm tra xem đã có Super Admin chưa
    const existingSuperAdmin = await dataSource
      .getRepository(User)
      .findOne({ where: { role: UserRole.SUPER_ADMIN } });

    if (existingSuperAdmin) {
      console.log('⚠️  Super Admin đã tồn tại, bỏ qua...');
    } else {
      // Tạo Super Admin
      const superAdminPassword = 'SuperAdmin@2025!';
      const superAdminPasswordHash = await bcrypt.hash(superAdminPassword, 12);

      const superAdmin = dataSource.getRepository(User).create({
        email: 'superadmin@p2a-asean.org',
        passwordHash: superAdminPasswordHash,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      });

      await dataSource.getRepository(User).save(superAdmin);

      // Tạo profile cho Super Admin
      const superAdminProfile = dataSource.getRepository(UserProfile).create({
        userId: superAdmin.id,
        user: superAdmin,
        fullName: 'Super Administrator',
        phoneNumber: '+84-xxx-xxx-xxxx',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'other',
        country: 'ASEAN',
        city: 'Regional',
        bio: 'Super Administrator của P2A ASEAN Platform',
        avatarUrl: null,
        linkedinUrl: 'https://linkedin.com/in/p2a-super-admin',
        websiteUrl: 'https://p2a-asean.org',
      });

      await dataSource.getRepository(UserProfile).save(superAdminProfile);

      console.log('✅ Đã tạo Super Admin thành công!');
      console.log(`📧 Email: superadmin@p2a-asean.org`);
      console.log(`🔑 Password: ${superAdminPassword}`);
    }

    // Kiểm tra xem đã có Admin chưa
    const existingAdmin = await dataSource
      .getRepository(User)
      .findOne({ where: { role: UserRole.ADMIN } });

    if (existingAdmin) {
      console.log('⚠️  Admin đã tồn tại, bỏ qua...');
    } else {
      // Tạo Admin
      const adminPassword = 'Admin@2025!';
      const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

      const admin = dataSource.getRepository(User).create({
        email: 'admin@p2a-asean.org',
        passwordHash: adminPasswordHash,
        role: UserRole.ADMIN,
        isActive: true,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      });

      await dataSource.getRepository(User).save(admin);

      // Tạo profile cho Admin
      const adminProfile = dataSource.getRepository(UserProfile).create({
        userId: admin.id,
        user: admin,
        fullName: 'System Administrator',
        phoneNumber: '+84-xxx-xxx-xxxx',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'other',
        country: 'ASEAN',
        city: 'Regional',
        bio: 'System Administrator của P2A ASEAN Platform',
        avatarUrl: null,
        linkedinUrl: 'https://linkedin.com/in/p2a-admin',
        websiteUrl: 'https://p2a-asean.org',
      });

      await dataSource.getRepository(UserProfile).save(adminProfile);

      console.log('✅ Đã tạo Admin thành công!');
      console.log(`📧 Email: admin@p2a-asean.org`);
      console.log(`🔑 Password: ${adminPassword}`);
    }

    console.log('\n🎉 Hoàn thành khởi tạo Admin users!');
    console.log('\n📋 Thông tin đăng nhập:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ SUPER ADMIN                                            │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ Email: superadmin@p2a-asean.org                       │');
    console.log('│ Password: SuperAdmin@2025!                             │');
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ ADMIN                                                  │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ Email: admin@p2a-asean.org                             │');
    console.log('│ Password: Admin@2025!                                  │');
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('\n⚠️  Lưu ý: Hãy đổi mật khẩu sau khi đăng nhập lần đầu!');

  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo Admin users:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Chạy script
initAdminUsers()
  .then(() => {
    console.log('✅ Script hoàn thành!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script thất bại:', error);
    process.exit(1);
  });
