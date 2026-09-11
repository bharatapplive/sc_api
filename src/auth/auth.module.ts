import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from './auth.model';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Auths', schema:AuthSchema}]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService   // 👈 Register Guard as a provider (optional if imported directly)
    ]
})
export class AuthModule {}
