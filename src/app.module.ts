import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Config
import { appConfig, databaseConfig, jwtConfig, mailConfig, validate } from './config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmailModule } from './modules/email/email.module';
import { I18nConfigModule } from './common/i18n/i18n.module';

// Guards
import { JwtAuthGuard } from './modules/auth/guards';

// Filters & Interceptors
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';

// Controllers
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    // Config Module - Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, mailConfig],
      validate,
      envFilePath: ['.env.local', '.env'],
    }),

    // TypeORM Module - Database connection với Master/Slave support
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database'),
    }),

    // Throttler Module - Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 10, // 10 requests
      },
    ]),

    // I18n Module - Internationalization
    I18nConfigModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [HealthController],
  providers: [
    // Global Guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Apply JWT guard globally
    },

    // Global Filters
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

