import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception tùy chỉnh cho các lỗi business logic
 * Thay thế cho việc throw new Error() chung chung
 */
export class BusinessException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST, code?: string) {
    super(
      {
        success: false,
        statusCode,
        ...(code && { code }),
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

/**
 * Exception cho lỗi không tìm thấy tài nguyên
 */
export class NotFoundException extends BusinessException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} với ID "${identifier}" không tồn tại`
      : `${resource} không tồn tại`;
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND');
  }
}

/**
 * Exception cho lỗi xung đột dữ liệu (duplicate)
 */
export class ConflictException extends BusinessException {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, HttpStatus.CONFLICT, code);
  }
}

/**
 * Exception cho lỗi xác thực thất bại
 */
export class UnauthorizedException extends BusinessException {
  constructor(message: string = 'Xác thực thất bại', code: string = 'UNAUTHORIZED') {
    super(message, HttpStatus.UNAUTHORIZED, code);
  }
}

/**
 * Exception cho lỗi không có quyền truy cập
 */
export class ForbiddenException extends BusinessException {
  constructor(message: string = 'Bạn không có quyền truy cập tài nguyên này', code: string = 'FORBIDDEN') {
    super(message, HttpStatus.FORBIDDEN, code);
  }
}

/**
 * Exception cho lỗi validation
 */
export class ValidationException extends BusinessException {
  constructor(message: string, code: string = 'VALIDATION_ERROR') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, code);
  }
}

