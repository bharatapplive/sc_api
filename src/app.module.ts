import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * AppModule - Root module of the application
 * This module configures the entire application including:
 * - Environment configuration via ConfigModule
 * - MongoDB connection via MongooseModule
 * - Controllers and providers
 */
@Module({
  imports: [
    // Configure environment variables globally
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available throughout the app
      envFilePath: '.env', // Load environment variables from .env file
    }),
    // Configure MongoDB connection asynchronously using ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');
        console.log('[AppModule] MongoDB URI loaded from config');
        return {
          uri: mongoUri, // Use MONGO_URI from environment variables
        };
      },
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),
  ],
  controllers: [AppController], // Register AppController
  providers: [AppService], // Register AppService
})
export class AppModule {
  constructor() {
    console.log('[AppModule] AppModule initialized');
  }
}
