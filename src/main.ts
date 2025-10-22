import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

/**
 * Bootstrap function - Khởi tạo NestJS application
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Tạo NestJS application
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Get config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');
  const corsOrigin = configService.get<string[]>('app.corsOrigin', ['*']);

  // Global prefix cho tất cả routes
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Security middleware
  app.use(helmet());

  // Compression middleware
  app.use(compression());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các property không có trong DTO
      forbidNonWhitelisted: true, // Throw error nếu có property không hợp lệ
      transform: true, // Tự động transform type
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation (chỉ enable trong development)
  if (nodeEnv === 'development') {
    const config = new DocumentBuilder()
      .setTitle('P2A ASEAN Core System API')
      .setDescription('API documentation for P2A ASEAN Core System')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    logger.log('Swagger documentation available at /api/docs');
  }

  // Start server
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
  logger.log(`📝 Environment: ${nodeEnv}`);
  logger.log(`🌍 Timezone: ${process.env.TZ || 'UTC'}`);
  logger.log(`💚 Health check: http://localhost:${port}/api/health`);
}

// Set timezone to UTC (theo quy tắc trong Rule.md)
process.env.TZ = 'UTC';

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', error);
  process.exit(1);
});

