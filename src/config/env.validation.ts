import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { BusinessException } from '../common/exceptions';
import { ErrorCode } from '../common';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Class validation cho environment variables
 * Đảm bảo tất cả các biến môi trường cần thiết đều có sẵn
 */
class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  // Database Master
  @IsString()
  @IsNotEmpty()
  DB_MASTER_HOST: string;

  @IsNumber()
  @IsOptional()
  DB_MASTER_PORT: number = 5432;

  @IsString()
  @IsNotEmpty()
  DB_MASTER_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_MASTER_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_MASTER_DATABASE: string;

  // Database Slave (Optional)
  @IsString()
  @IsOptional()
  DB_SLAVE_HOST: string;

  @IsNumber()
  @IsOptional()
  DB_SLAVE_PORT: number = 5432;

  @IsString()
  @IsOptional()
  DB_SLAVE_USERNAME: string;

  @IsString()
  @IsOptional()
  DB_SLAVE_PASSWORD: string;

  @IsString()
  @IsOptional()
  DB_SLAVE_DATABASE: string;

  // JWT
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '7d';

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN: string = '30d';

  // Email
  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @IsNumber()
  @IsOptional()
  MAIL_PORT: number = 587;

  @IsString()
  @IsNotEmpty()
  MAIL_USER: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM: string;

  @IsString()
  @IsOptional()
  MAIL_FROM_NAME: string = 'P2A ASEAN Platform';

  @IsString()
  @IsOptional()
  EMAIL_VERIFICATION_URL: string;
}

/**
 * Hàm validate environment variables khi ứng dụng khởi động
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const details = errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('\n');
    throw new BusinessException(details, 500, ErrorCode.ENV_VALIDATION_ERROR);
  }

  return validatedConfig;
}

