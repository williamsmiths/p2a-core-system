import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface cho cấu trúc response chuẩn
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
}

/**
 * Interceptor để chuẩn hóa tất cả response trả về
 * Đảm bảo tất cả response đều có cấu trúc thống nhất
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        // Nếu data đã có định dạng response chuẩn, return luôn
        if (data && typeof data === 'object' && 'success' in data && 'statusCode' in data) {
          return data;
        }

        // Nếu không, wrap data vào response chuẩn
        const statusCode = response.statusCode || HttpStatus.OK;
        
        return {
          success: true,
          statusCode,
          data: data || null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  // Removed getDefaultMessage method - no success messages needed
}

