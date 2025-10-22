import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';

/**
 * Metadata key cho roles
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator để chỉ định roles được phép truy cập endpoint
 * Sử dụng cùng với RolesGuard
 * 
 * @example
 * @Roles(UserRole.ADMIN, UserRole.UNIVERSITY)
 * async createCourse() {}
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

