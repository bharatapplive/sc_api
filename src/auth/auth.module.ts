import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from './auth.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt-auth/jwt.strategy';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Auths', schema:AuthSchema}]),
    // Configure JWT Module
    JwtModule.register({
      global: true, // Makes JwtService available everywhere in your app
      secret: 'YOUR_SECRET_KEY', // Best practice: Use process.env.JWT_SECRET
      signOptions: { expiresIn: '1h' }, // Token expiration
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,     // 👈 Register Strategy as a provider
    JwtAuthGuard,    // 👈 Register Guard as a provider (optional if imported directly)
    ]
})
export class AuthModule {}
