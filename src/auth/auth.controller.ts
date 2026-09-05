import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
    // step 3 DI
  constructor(private readonly authService: AuthService) {}

  
  // step 4 create api for user registration
  @Post('create')
  @Public()
  async create(@Body() requestData: any) {
    return this.authService.create(requestData);
  }

  @Post('login')
   @Public()
  async login(@Body() requestData: any) {
    return this.authService.login(requestData);
  }

}
