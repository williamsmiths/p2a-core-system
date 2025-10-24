import { Controller, Post, Body, HttpCode, HttpStatus, Ip, Headers, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, RefreshTokenDto } from './dto';
import { Public, CurrentUser } from '../../common/decorators';
import { RequestUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

/**
 * Auth Controller - Xử lý các endpoint liên quan đến authentication
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Đăng ký tài khoản mới
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.register(registerDto, userAgent, ipAddress);
  }

  /**
   * POST /auth/login
   * Đăng nhập
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.login(loginDto, userAgent, ipAddress);
  }

  /**
   * POST /auth/verify-email
   * Xác thực email
   */
  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  /**
   * GET /auth/verify-email (để support link từ email)
   * Xác thực email qua query parameter
   */
  @Public()
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmailViaGet(@Query('token') token: string) {
    return this.authService.verifyEmail({ token });
  }

  /**
   * POST /auth/resend-verification
   * Gửi lại email xác thực
   */
  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  /**
   * POST /auth/refresh
   * Refresh access token
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  /**
   * POST /auth/logout
   * Đăng xuất
   */
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  /**
   * POST /auth/switch-role
   * Chuyển đổi role
   */
  @Post('switch-role')
  @HttpCode(HttpStatus.OK)
  async switchRole(@CurrentUser() user: RequestUser, @Body() body: { role: UserRole }) {
    const result = await this.authService.switchRole(user.userId, body.role);
    
    // Tạo JWT mới với role mới
    const userWithNewRole = await this.authService.findById(user.userId);
    if (userWithNewRole) {
      const newAccessToken = this.authService.generateAccessToken(userWithNewRole);
      return {
        ...result,
        accessToken: newAccessToken,
      };
    }
    
    return result;
  }

  /**
   * GET /auth/available-roles
   * Lấy danh sách roles có sẵn
   */
  @Get('available-roles')
  async getAvailableRoles(@CurrentUser() user: RequestUser) {
    return this.authService.getAvailableRoles(user.userId);
  }
}

