import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

/**
 * I18n Service - Wrapper cho nestjs-i18n
 * Cung cấp các method tiện ích để translate messages
 */
@Injectable()
export class I18nServiceWrapper {
  constructor(private readonly i18n: I18nService) {}

  /**
   * Translate message với key và args
   * @param key - Translation key (e.g., 'auth.register_success')
   * @param args - Arguments để thay thế trong message
   * @param lang - Ngôn ngữ (optional, sẽ dùng từ request context)
   */
  translate(key: string, args?: any, lang?: string): string {
    return this.i18n.translate(key, {
      lang,
      args,
    });
  }

  /**
   * Translate success message
   */
  success(key: string, args?: any, lang?: string): string {
    return this.translate(`success.${key}`, args, lang);
  }

  /**
   * Translate error message
   */
  error(key: string, args?: any, lang?: string): string {
    return this.translate(`error.${key}`, args, lang);
  }

  /**
   * Translate validation message
   */
  validation(key: string, args?: any, lang?: string): string {
    return this.translate(`validation.${key}`, args, lang);
  }

  /**
   * Translate auth message
   */
  auth(key: string, args?: any, lang?: string): string {
    return this.translate(`auth.${key}`, args, lang);
  }

  /**
   * Translate user message
   */
  user(key: string, args?: any, lang?: string): string {
    return this.translate(`user.${key}`, args, lang);
  }

  /**
   * Translate email message
   */
  email(key: string, args?: any, lang?: string): string {
    return this.translate(`email.${key}`, args, lang);
  }

  /**
   * Get current language from request context
   */
  getCurrentLanguage(): string {
    return this.i18n.lang || 'en';
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(lang: string): boolean {
    const supportedLanguages = ['en', 'vi', 'th', 'id', 'ms'];
    return supportedLanguages.includes(lang);
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): string[] {
    return ['en', 'vi', 'th', 'id', 'ms'];
  }
}
