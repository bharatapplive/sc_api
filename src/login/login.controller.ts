import { Controller, Get, Param } from '@nestjs/common';
import { LoginService } from './login.service';

interface IUser {
  id: number;
  name: string;
  email: string;
}

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
 
  @Get()
  getAllUser(): IUser[] {
    return this.loginService.getAllUsers();
  }

   @Get(':id')
  getUserById(@Param('id') id: string): IUser {
    return this.loginService.getUserById(parseInt(id, 10));
  }
}
