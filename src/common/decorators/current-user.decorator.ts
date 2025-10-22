import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Interface cho user object trong request
 */
export interface RequestUser {
  userId: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

/**
 * Decorator để lấy thông tin user hiện tại từ request
 * User được gắn vào request bởi JwtStrategy sau khi xác thực thành công
 * 
 * @example
 * async getProfile(@CurrentUser() user: RequestUser) {
 *   return user;
 * }
 * 
 * // Hoặc lấy một field cụ thể
 * async getProfile(@CurrentUser('userId') userId: string) {
 *   return userId;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

