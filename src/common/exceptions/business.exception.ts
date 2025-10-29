import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorCodeString } from '@common';

/**
 * Exception tùy chỉnh cho các lỗi business logic
 * Thay thế cho việc throw new Error() chung chung
 */
export class BusinessException extends HttpException {
  constructor(statusCode: HttpStatus, code: ErrorCodeString) {
    super(
      {
        success: false,
        statusCode,
        code,
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
  constructor(_resource?: string, _identifier?: string) {
    super(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
  }
}

/**
 * Exception cho lỗi xung đột dữ liệu (duplicate)
 */
export class ConflictException extends BusinessException {
  constructor(code: ErrorCodeString = ErrorCode.CONFLICT) {
    super(HttpStatus.CONFLICT, code);
  }
}

/**
 * Exception cho lỗi xác thực thất bại
 */
export class UnauthorizedException extends BusinessException {
  constructor(code: ErrorCodeString = ErrorCode.UNAUTHORIZED) {
    super(HttpStatus.UNAUTHORIZED, code);
  }
}

/**
 * Exception cho lỗi không có quyền truy cập
 */
export class ForbiddenException extends BusinessException {
  constructor(code: ErrorCodeString = ErrorCode.FORBIDDEN) {
    super(HttpStatus.FORBIDDEN, code);
  }
}

/**
 * Exception cho lỗi validation
 */
export class ValidationException extends BusinessException {
  constructor(code: ErrorCodeString = ErrorCode.VALIDATION_ERROR) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, code);
  }
}

