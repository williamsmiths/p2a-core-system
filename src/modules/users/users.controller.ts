import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Param,
  Query,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser, Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { RequestUser } from '../../common/decorators/current-user.decorator';

/**
 * Users Controller - Xử lý các endpoint liên quan đến user và profile
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/me
   * Lấy thông tin profile của user hiện tại
   */
  @Get('me')
  async getMyProfile(@CurrentUser() user: RequestUser) {
    return this.usersService.getMyProfile(user.userId);
  }

  /**
   * PATCH /users/me
   * Cập nhật profile của user hiện tại
   */
  @Patch('me')
  async updateMyProfile(@CurrentUser() user: RequestUser, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateMyProfile(user.userId, updateProfileDto);
  }

  /**
   * POST /users/me/change-password
   * Đổi mật khẩu
   */
  @Post('me/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@CurrentUser() user: RequestUser, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(user.userId, changePasswordDto);
  }

  /**
   * GET /users/:id
   * Lấy thông tin user theo ID (public profile hoặc admin)
   */
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  /**
   * GET /users
   * Lấy danh sách tất cả users (admin only)
   */
  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.usersService.getAllUsers(page, limit);
  }

  /**
   * POST /users/:id/deactivate
   * Khóa tài khoản user (admin only)
   */
  @Post(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deactivateUser(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }

  /**
   * POST /users/:id/activate
   * Kích hoạt lại tài khoản user (admin only)
   */
  @Post(':id/activate')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async activateUser(@Param('id') id: string) {
    return this.usersService.activateUser(id);
  }
}

