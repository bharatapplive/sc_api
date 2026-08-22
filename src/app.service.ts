import { Injectable } from '@nestjs/common';

/**
 * AppService - Handles business logic for the application
 * This service contains core application logic and data processing
 */
@Injectable()
export class AppService {
  /**
   * getHello - Returns the welcome message
   * This method provides the main welcome message for the Social Circle application
   * @returns {string} Welcome message string
   */
  getHello(): string {
    console.log('[AppService] getHello() called');
    const message = 'Social Circle App By Sohrab';
    console.log('[AppService] Returning message:', message);
    return message;
  }
}
