import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key cho public routes
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator để đánh dấu endpoint không cần xác thực
 * Bỏ qua JwtAuthGuard khi có decorator này
 * 
 * @example
 * @Public()
 * @Post('login')
 * async login() {}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

