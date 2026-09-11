import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { FollowModule } from './follow/follow.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-auth/jwt.strategy';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { ReelModule } from './reel/reel.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'socialCircleDB',
    }),
    // Configure JWT Module
    JwtModule.register({
      global: true, // Makes JwtService available everywhere in your app
      secret: 'YOUR_SECRET_KEY', // Best practice: Use process.env.JWT_SECRET
      signOptions: { expiresIn: '1h' }, // Token expiration
    }),
    AuthModule,
    PostModule,
    FollowModule,
    ReelModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,     // 👈 Register Strategy as a provider
    JwtAuthGuard, 
  ],
})
export class AppModule {}
