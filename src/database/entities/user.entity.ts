import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';

/**
 * Entity User - Bảng users chứa thông tin xác thực
 * Quan hệ 1-N với UserProfile (1 user có thể có nhiều profile/role)
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @Index()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;


  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'email_verified_at', type: 'timestamptz', nullable: true })
  emailVerifiedAt: Date | null;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relations
  @OneToMany(() => UserProfile, (profile) => profile.user, {
    cascade: true,
  })
  profiles: UserProfile[];

  /**
   * Method để ẩn password khi serialize
   */
  toJSON() {
    const { passwordHash, ...rest } = this;
    return rest;
  }
}

