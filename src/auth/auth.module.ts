import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from './auth.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Auths', schema:AuthSchema}]),
    // Configure JWT Module
    JwtModule.register({
      global: true, // Makes JwtService available everywhere in your app
      secret: 'YOUR_SECRET_KEY', // Best practice: Use process.env.JWT_SECRET
      signOptions: { expiresIn: '7d' }, // Token expiration
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
