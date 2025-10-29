import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserProfile } from '@entities';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import { NotFoundException, UnauthorizedException, ValidationException } from '@common';
import { ErrorCode } from '@common';

/**
 * Users Service - Xử lý logic liên quan đến user và profile
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profilesRepository: Repository<UserProfile>,
  ) {}

  /**
   * Lấy thông tin profile của user hiện tại
   */
  async getMyProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException();
    }

    // Không trả về password hash
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
    };
  }

  /**
   * Cập nhật profile của user hiện tại
   */
  async updateMyProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException();
    }

    // Cập nhật các field được cung cấp
    Object.assign(profile, updateProfileDto);

    const updatedProfile = await this.profilesRepository.save(profile);

    this.logger.log(`Profile updated for user: ${userId}`);

    return {
      profile: updatedProfile,
    };
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException();
    }

    // Verify mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorCode.USER_PASSWORD_INVALID);
    }

    // Kiểm tra mật khẩu mới không được giống mật khẩu cũ
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);

    if (isSamePassword) {
      throw new ValidationException(ErrorCode.USER_PASSWORD_SAME);
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    await this.usersRepository.save(user);

    this.logger.log(`Password changed for user: ${userId}`);

    return {};
  }

  /**
   * Lấy thông tin user theo ID (cho admin hoặc public profile)
   */
  async getUserById(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException();
    }

    // Không trả về password hash
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
    };
  }

  /**
   * Lấy danh sách tất cả users (cho admin)
   */
  async getAllUsers(page: number = 1, limit: number = 10) {
    const [users, total] = await this.usersRepository.findAndCount({
      relations: ['profile'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    // Loại bỏ password hash
    const usersWithoutPassword = users.map((user) => {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      users: usersWithoutPassword,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Deactivate user (cho admin)
   */
  async deactivateUser(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException();
    }

    user.isActive = false;
    await this.usersRepository.save(user);

    this.logger.log(`User deactivated: ${userId}`);

    return {};
  }

  /**
   * Activate user (cho admin)
   */
  async activateUser(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User', userId);
    }

    user.isActive = true;
    await this.usersRepository.save(user);

    this.logger.log(`User activated: ${userId}`);

    return {};
  }

  /**
   * Tìm user theo ID (cho gRPC)
   */
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  /**
   * Tìm user theo email (cho gRPC)
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
  }

  /**
   * Tìm nhiều users theo IDs (cho gRPC)
   */
  async findByIds(ids: string[]): Promise<User[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    return this.usersRepository.find({
      where: ids.map(id => ({ id })),
      relations: ['profile'],
    });
  }
}

