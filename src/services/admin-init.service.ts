import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UserProfile } from '../database/entities/user-profile.entity';
import { UserRole } from '../common/enums';
import * as bcrypt from 'bcrypt';

/**
 * Service để khởi tạo admin users tự động khi server khởi động
 */
@Injectable()
export class AdminInitService {
  private readonly logger = new Logger(AdminInitService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Khởi tạo admin users nếu chưa tồn tại
   */
  async initAdminUsers(): Promise<void> {
    this.logger.log('🔄 Đang kiểm tra và khởi tạo admin users...');

    try {
      // Đảm bảo database schema đã được đồng bộ
      await this.dataSource.synchronize();
      this.logger.log('✅ Database schema đã được đồng bộ');

      // Kiểm tra và tạo Super Admin
      await this.createSuperAdmin();
      
      // Kiểm tra và tạo Admin
      await this.createAdmin();

      this.logger.log('✅ Hoàn thành kiểm tra admin users');
    } catch (error) {
      this.logger.error('❌ Lỗi khi khởi tạo admin users:', error);
      throw error;
    }
  }

  /**
   * Tạo Super Admin nếu chưa tồn tại
   */
  private async createSuperAdmin(): Promise<void> {
    const existingSuperAdmin = await this.dataSource
      .getRepository(User)
      .findOne({ where: { role: UserRole.SUPER_ADMIN } });

    if (existingSuperAdmin) {
      this.logger.log('⚠️  Super Admin đã tồn tại, bỏ qua...');
      return;
    }

    // Tạo Super Admin
    const superAdminPassword = 'SuperAdmin@2025!';
    const superAdminPasswordHash = await bcrypt.hash(superAdminPassword, 12);

    const superAdmin = this.dataSource.getRepository(User).create({
      email: 'superadmin@p2a-asean.org',
      passwordHash: superAdminPasswordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });

    await this.dataSource.getRepository(User).save(superAdmin);

    // Tạo profile cho Super Admin
    const superAdminProfile = this.dataSource.getRepository(UserProfile).create({
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

    await this.dataSource.getRepository(UserProfile).save(superAdminProfile);

    this.logger.log('✅ Đã tạo Super Admin thành công!');
    this.logger.log(`📧 Email: superadmin@p2a-asean.org`);
    this.logger.log(`🔑 Password: ${superAdminPassword}`);
  }

  /**
   * Tạo Admin nếu chưa tồn tại
   */
  private async createAdmin(): Promise<void> {
    const existingAdmin = await this.dataSource
      .getRepository(User)
      .findOne({ where: { role: UserRole.ADMIN } });

    if (existingAdmin) {
      this.logger.log('⚠️  Admin đã tồn tại, bỏ qua...');
      return;
    }

    // Tạo Admin
    const adminPassword = 'Admin@2025!';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

    const admin = this.dataSource.getRepository(User).create({
      email: 'admin@p2a-asean.org',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });

    await this.dataSource.getRepository(User).save(admin);

    // Tạo profile cho Admin
    const adminProfile = this.dataSource.getRepository(UserProfile).create({
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

    await this.dataSource.getRepository(UserProfile).save(adminProfile);

    this.logger.log('✅ Đã tạo Admin thành công!');
    this.logger.log(`📧 Email: admin@p2a-asean.org`);
    this.logger.log(`🔑 Password: ${adminPassword}`);
  }
}
