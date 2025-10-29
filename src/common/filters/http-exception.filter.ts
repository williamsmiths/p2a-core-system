import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global Exception Filter
 * Bắt tất cả các exception và trả về response chuẩn
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Đã xảy ra lỗi trong quá trình xử lý';
    let errors: any = null;
    let code: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        errors = responseObj.errors || responseObj.error || null;
        code = responseObj.code || code;

        // Xử lý validation errors từ class-validator
        if (Array.isArray(message)) {
          errors = message;
          message = 'Dữ liệu không hợp lệ';
        }
      } else {
        message = exceptionResponse as string;
      }
    } else {
      // Log lỗi server nếu không phải HttpException
      this.logger.error(
        `Unhandled exception: ${exception?.message}`,
        exception?.stack,
      );
      // Suy diễn code cho lỗi không xác định
      code = code || 'INTERNAL_SERVER_ERROR';
    }

    // Nếu chưa có code, suy diễn từ HttpStatus
    if (!code) {
      const statusName = HttpStatus[status] as unknown as string | undefined;
      if (Array.isArray(errors)) {
        code = 'VALIDATION_ERROR';
      } else if (statusName) {
        code = statusName;
      } else {
        code = 'ERROR';
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      code,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log request lỗi để debug
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status}`,
        JSON.stringify(errorResponse),
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${status}: ${message}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}

