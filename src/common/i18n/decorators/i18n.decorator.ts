import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

/**
 * Decorator để inject I18nService vào controller
 * Sử dụng: @I18n() i18n: I18nService
 */
export const I18n = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): I18nService => {
    const request = ctx.switchToHttp().getRequest();
    return request.i18nService;
  },
);

/**
 * Decorator để lấy ngôn ngữ hiện tại từ request
 * Sử dụng: @CurrentLanguage() lang: string
 */
export const CurrentLanguage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.i18nLang || 'en';
  },
);
