import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  // =========================
  // REGISTRATION API
  // =========================

  @Post('create')
  async create(@Body() requestData: any) {
    return this.authService.create(requestData);
  }

  // =========================
  // LOGIN API
  // =========================

  @Post('login')
  async login(@Body() requestData: any) {
    return this.authService.login(requestData);
  }
}