import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators';

/**
 * Health Check Controller
 * Endpoint để kiểm tra trạng thái service
 */
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'p2a-core-system',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

