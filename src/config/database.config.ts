import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { User, UserProfile, EmailVerification, RefreshToken, Country, City, District } from '@entities';

/**
 * Cấu hình Database với hỗ trợ PostgreSQL Master/Slave Replication
 * 
 * - Master: Xử lý tất cả các thao tác WRITE (INSERT, UPDATE, DELETE)
 * - Slave(s): Xử lý tất cả các thao tác READ (SELECT)
 * 
 * TypeORM tự động route các query đến đúng database
 */
export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const hasSlave = Boolean(process.env.DB_SLAVE_HOST);

    // Cấu hình cơ bản cho cả master và slave
    const baseConfig = {
      type: 'postgres' as const,
      entities: [User, UserProfile, EmailVerification, RefreshToken, Country, City, District],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      extra: {
        timezone: 'UTC', // Luôn dùng UTC
        // Connection pool settings
        max: 20,
        min: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    };

    // Nếu có slave, sử dụng replication mode
    if (hasSlave) {
      return {
        ...baseConfig,
        replication: {
          master: {
            host: process.env.DB_MASTER_HOST,
            port: parseInt(process.env.DB_MASTER_PORT || '5432', 10),
            username: process.env.DB_MASTER_USERNAME,
            password: process.env.DB_MASTER_PASSWORD,
            database: process.env.DB_MASTER_DATABASE,
          },
          slaves: [
            {
              host: process.env.DB_SLAVE_HOST,
              port: parseInt(process.env.DB_SLAVE_PORT || '5432', 10),
              username: process.env.DB_SLAVE_USERNAME,
              password: process.env.DB_SLAVE_PASSWORD,
              database: process.env.DB_SLAVE_DATABASE,
            },
            // Có thể thêm nhiều slave khác ở đây nếu cần
          ],
        },
      } as TypeOrmModuleOptions;
    }

    // Nếu không có slave, chỉ dùng master cho cả read và write
    return {
      ...baseConfig,
      host: process.env.DB_MASTER_HOST,
      port: parseInt(process.env.DB_MASTER_PORT || '5432', 10),
      username: process.env.DB_MASTER_USERNAME,
      password: process.env.DB_MASTER_PASSWORD,
      database: process.env.DB_MASTER_DATABASE,
    } as TypeOrmModuleOptions;
  },
);

/**
 * Data source configuration cho TypeORM CLI
 * Sử dụng khi chạy migrations (nếu cần trong tương lai)
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_MASTER_HOST || 'localhost',
  port: parseInt(process.env.DB_MASTER_PORT || '5432', 10),
  username: process.env.DB_MASTER_USERNAME || 'p2a_user',
  password: process.env.DB_MASTER_PASSWORD || 'p2a_password',
  database: process.env.DB_MASTER_DATABASE || 'p2a_core',
  entities: [User, UserProfile, EmailVerification, RefreshToken],
  synchronize: false,
  logging: false,
  extra: {
    timezone: 'UTC',
  },
};

