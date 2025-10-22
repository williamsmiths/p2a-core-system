import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { EmailVerificationStatus } from '../../common/enums';

/**
 * Entity EmailVerification - Bảng email_verifications
 * Lưu trữ token xác thực email của người dùng
 */
@Entity('email_verifications')
export class EmailVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  @Index()
  token: string;

  @Column({
    type: 'enum',
    enum: EmailVerificationStatus,
    default: EmailVerificationStatus.PENDING,
  })
  status: EmailVerificationStatus;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  /**
   * Kiểm tra token có hết hạn không
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Kiểm tra token có hợp lệ không
   */
  isValid(): boolean {
    return (
      this.status === EmailVerificationStatus.PENDING &&
      !this.isExpired()
    );
  }
}

