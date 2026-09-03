import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  // step 3 DI
  constructor(private readonly authService: AuthService) {}

  // step 2
  @Post('create')
  async create(@Body() requestData: any) {
    return this.authService.create(requestData);
  }

  @Post('login')
  async login(@Body() requestData: any) {
    return this.authService.login(requestData);
  }
}
