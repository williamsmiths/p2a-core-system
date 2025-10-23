import { registerAs } from '@nestjs/config';

/**
 * Application Configuration
 */
export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  grpcPort: parseInt(process.env.GRPC_PORT || '50051', 10),
  name: process.env.APP_NAME || 'P2A Core System',
  url: process.env.APP_URL || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
  timezone: 'UTC', // Luôn sử dụng UTC
}));

