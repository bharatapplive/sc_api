import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // POST http://localhost:3000/auth/register
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    // POST http://localhost:3000/auth/login
    @Post('login')
    @HttpCode(200)
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}