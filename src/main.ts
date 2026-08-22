import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * bootstrap - Application entry point
 * This function initializes and starts the NestJS application
 */
async function bootstrap() {
  console.log('[Main] Starting application bootstrap...');
  
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);
  console.log('[Main] NestJS application created');
  
  // Get the port from environment variables or default to 3000
  const port = process.env.PORT ?? 3000;
  console.log('[Main] Application will listen on port:', port);
  
  // Start listening for incoming HTTP requests
  await app.listen(port);
  console.log(`[Main] Application is running on http://localhost:${port}`);
}

// Start the application
bootstrap().catch((error) => {
  console.error('[Main] Failed to start application:', error);
  process.exit(1);
});
