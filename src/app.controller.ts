import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { getServerHealth } from './utils/server_health';

/**
 * AppController - Handles root level HTTP requests
 * This controller manages the base endpoint of the application
 */
@Controller()
export class AppController {
  // Inject AppService to handle business logic
  constructor(private readonly appService: AppService) {}

  /**
   * GET / - Root endpoint
   * Returns a welcome message from the application
   * @returns {string} Welcome message
   */
  @Get()
  getHello(): string {
    console.log('[AppController] GET / endpoint called');
    const response = this.appService.getHello();
    console.log('[AppController] Response:', response);
    return response;
  }

  /**
   * GET /health - Health check endpoint
   * Returns the current health status of the server and database
   * @returns {ServerHealth} Server health status object
   */
  @Get('api/health')
  getHealth() {
    console.log('[AppController] GET /health endpoint called');
    const health = getServerHealth();
    console.log('[AppController] Health status:', health);
    return health;
  }
}
