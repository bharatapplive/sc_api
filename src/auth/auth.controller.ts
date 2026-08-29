import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authServe : AuthService
    ){}

    @Post('register')
    async createUser(@Body() request: any){
        return await this.authServe.userRegistration(request);
    }

    @Post('login')
    async fetchUser(@Body() body:{identity: string, password:string}){
        return await this.authServe.userLogin(body.identity, body.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('verify-otp')
    async verifyTheOtp(@Body() body: { userId: string; otpCode: string }) {
        return await this.authServe.verifyOtp(body);
    }

    @Get(':id')
    async getUserById(@Param('id') id:string){
        return await this.authServe.getRegisteredId(id);
    }

    @Get()
    async getAllUser(){
        return await this.authServe.getAllData();
    }
    
}
