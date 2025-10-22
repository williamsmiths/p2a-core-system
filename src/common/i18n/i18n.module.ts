import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';

/**
 * I18n Module - Hỗ trợ đa ngôn ngữ
 * Hỗ trợ: Vietnamese (vi), English (en), Thai (th), Indonesian (id), Malay (ms)
 */
@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en', // Ngôn ngữ mặc định
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true, // Auto reload khi thay đổi translation files
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // ?lang=vi
        AcceptLanguageResolver, // Accept-Language header
      ],
    }),
  ],
  exports: [I18nModule],
})
export class I18nConfigModule {}
