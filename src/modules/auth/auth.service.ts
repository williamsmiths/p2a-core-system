import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserProfile, EmailVerification, RefreshToken } from '../../database/entities';
import { EmailService } from '../email/email.service';
import {
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  ValidationException,
} from '../../common/exceptions';
import { EmailVerificationStatus, UserRole } from '../../common/enums';
import { RegisterDto, LoginDto, VerifyEmailDto, RefreshTokenDto } from './dto';

/**
 * Auth Service - Xử lý logic authentication và authorization
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profilesRepository: Repository<UserProfile>,
    @InjectRepository(EmailVerification)
    private emailVerificationsRepository: Repository<EmailVerification>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private i18n: I18nService,
  ) {}

  /**
   * Đăng ký tài khoản mới
   */
  async register(registerDto: RegisterDto, userAgent?: string, ipAddress?: string) {
    const { email, password, role, fullName } = registerDto;

    // Kiểm tra email + role đã tồn tại chưa
    const existingProfile = await this.profilesRepository.findOne({
      where: { 
        user: { email: email.toLowerCase() },
        role: role
      },
      relations: ['user']
    });

    if (existingProfile) {
      throw new ConflictException(this.i18n.translate('auth.email_role_already_exists'));
    }

    // Tìm user hiện tại (nếu có)
    let user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['profiles']
    });

    if (user) {
      // User đã tồn tại, kiểm tra password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException(this.i18n.translate('auth.invalid_credentials'));
      }
    } else {
      // Tạo user mới
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      user = this.usersRepository.create({
        email: email.toLowerCase(),
        passwordHash,
        isActive: true,
        isEmailVerified: false,
      });

      user = await this.usersRepository.save(user);
    }

    // Tạo profile mới với role
    const profile = this.profilesRepository.create({
      userId: user.id,
      fullName,
      role,
    });

    await this.profilesRepository.save(profile);

    // Tạo token xác thực email (chỉ cho user mới)
    if (!user.isEmailVerified) {
      await this.createEmailVerificationToken(user, profile);
    }

    this.logger.log(`New profile added for user: ${email} with role: ${role}`);

    // Không trả về password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
    };
  }

  /**
   * Đăng nhập
   */
  async login(loginDto: LoginDto, userAgent?: string, ipAddress?: string) {
    const { email, password, role } = loginDto;

    // Tìm user với profiles
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['profiles'],
    });

    if (!user) {
      throw new UnauthorizedException(this.i18n.translate('auth.invalid_credentials'));
    }

    // Kiểm tra tài khoản có bị khóa không
    if (!user.isActive) {
      throw new UnauthorizedException(this.i18n.translate('auth.account_locked'));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException(this.i18n.translate('auth.invalid_credentials'));
    }

    // Nếu có role được chỉ định, kiểm tra user có profile với role đó không
    if (role) {
      const profileWithRole = user.profiles?.find(p => p.role === role);
      if (!profileWithRole) {
        throw new UnauthorizedException(this.i18n.translate('auth.role_not_available'));
      }
    }

    // Cập nhật last login
    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, userAgent, ipAddress);

    // Lấy profile hiện tại (role đầu tiên hoặc role được chỉ định)
    const currentProfile = role 
      ? user.profiles?.find(p => p.role === role)
      : user.profiles?.[0];

    this.logger.log(`User logged in: ${email} with role: ${currentProfile?.role}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: currentProfile?.role,
        isEmailVerified: user.isEmailVerified,
        profile: currentProfile,
      },
    };
  }

  /**
   * Xác thực email
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    // Tìm token
    const verification = await this.emailVerificationsRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!verification) {
      throw new NotFoundException('Token', token);
    }

    // Kiểm tra token đã được sử dụng chưa
    if (verification.status === EmailVerificationStatus.USED) {
      throw new ValidationException(this.i18n.translate('auth.token_used'));
    }

    // Kiểm tra token hết hạn chưa
    if (verification.isExpired()) {
      verification.status = EmailVerificationStatus.EXPIRED;
      await this.emailVerificationsRepository.save(verification);
      throw new ValidationException(this.i18n.translate('auth.token_expired'));
    }

    // Cập nhật user
    verification.user.isEmailVerified = true;
    verification.user.emailVerifiedAt = new Date();
    await this.usersRepository.save(verification.user);

    // Cập nhật verification
    verification.status = EmailVerificationStatus.VERIFIED;
    verification.verifiedAt = new Date();
    await this.emailVerificationsRepository.save(verification);

    // Gửi email chào mừng
    try {
      const profile = await this.profilesRepository.findOne({
        where: { userId: verification.user.id },
      });
      await this.emailService.sendWelcomeEmail(verification.user.email, profile?.fullName || 'User');
    } catch (error) {
      this.logger.error('Failed to send welcome email', error);
    }

    this.logger.log(`Email verified: ${verification.user.email}`);

    return {};
  }

  /**
   * Gửi lại email xác thực
   */
  async resendVerificationEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User', email);
    }

    if (user.isEmailVerified) {
      throw new ValidationException(this.i18n.translate('auth.email_already_verified'));
    }

    // Vô hiệu hóa các token cũ
    await this.emailVerificationsRepository.update(
      { userId: user.id, status: EmailVerificationStatus.PENDING },
      { status: EmailVerificationStatus.EXPIRED },
    );

    // Tạo token mới
    await this.createEmailVerificationToken(user);

    return {};
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken: token } = refreshTokenDto;

    // Tìm refresh token
    const refreshToken = await this.refreshTokensRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException(this.i18n.translate('error.token_invalid'));
    }

    // Kiểm tra token có hợp lệ không
    if (!refreshToken.isValid()) {
      throw new UnauthorizedException(this.i18n.translate('error.token_expired'));
    }

    // Generate access token mới
    const accessToken = this.generateAccessToken(refreshToken.user);

    return {
      accessToken,
    };
  }

  /**
   * Logout - Thu hồi refresh token
   */
  async logout(refreshToken: string) {
    const token = await this.refreshTokensRepository.findOne({
      where: { token: refreshToken },
    });

    if (token) {
      token.isRevoked = true;
      token.revokedAt = new Date();
      await this.refreshTokensRepository.save(token);
    }

    return {};
  }

  /**
   * Chuyển đổi role cho user hiện tại
   */
  async switchRole(userId: string, newRole: UserRole) {
    // Tìm user với tất cả profiles
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['profiles'],
    });

    if (!user) {
      throw new NotFoundException('User', userId);
    }

    // Kiểm tra user có profile với role mới không
    const existingProfile = user.profiles?.find(p => p.role === newRole);

    if (!existingProfile) {
      throw new NotFoundException('Profile with role', newRole);
    }

    // Cập nhật current role trong JWT payload sẽ được xử lý ở controller
    this.logger.log(`User ${userId} switching to role: ${newRole}`);

    return {
      message: 'Role switched successfully',
      newRole,
      profile: existingProfile,
    };
  }

  /**
   * Lấy danh sách roles có sẵn cho user
   */
  async getAvailableRoles(userId: string) {
    const profiles = await this.profilesRepository.find({
      where: { userId },
      select: ['role', 'fullName', 'createdAt']
    });

    return {
      availableRoles: profiles.map(profile => ({
        role: profile.role,
        fullName: profile.fullName,
        createdAt: profile.createdAt
      }))
    };
  }

  /**
   * Tạo email verification token
   */
  private async createEmailVerificationToken(user: User, profile?: UserProfile) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Hết hạn sau 24h

    const verification = this.emailVerificationsRepository.create({
      userId: user.id,
      token,
      expiresAt,
      status: EmailVerificationStatus.PENDING,
    });

    await this.emailVerificationsRepository.save(verification);

    // Gửi email (không bắt buộc)
    try {
      const userProfile = profile || await this.profilesRepository.findOne({
        where: { userId: user.id },
      });
      await this.emailService.sendVerificationEmail(user.email, userProfile?.fullName || 'User', token);
      this.logger.log(`Verification email sent to: ${user.email}`);
    } catch (error) {
      this.logger.warn(`Failed to send verification email to ${user.email}:`, error.message);
      // Không throw error, chỉ log warning
      // User vẫn có thể đăng ký thành công và verify email sau
    }
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.profiles?.[0]?.role,
      isEmailVerified: user.isEmailVerified,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
  }

  /**
   * Generate refresh token
   */
  private async generateRefreshToken(
    user: User,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date();
    const expiresIn = this.configService.get<string>('jwt.refreshExpiresIn') || '30d';
    
    // Parse expires in (e.g., "30d" -> 30 days)
    const days = parseInt(expiresIn.replace('d', ''), 10);
    expiresAt.setDate(expiresAt.getDate() + days);

    const refreshToken = this.refreshTokensRepository.create({
      userId: user.id,
      token,
      expiresAt,
      userAgent,
      ipAddress,
    });

    await this.refreshTokensRepository.save(refreshToken);

    return token;
  }

  /**
   * Tìm user theo ID
   */
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['profiles'],
    });
  }
}

