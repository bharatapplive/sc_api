import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { FeedModule } from './feed/feed.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
// step 2 db connection string
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'socialCircleDB',
    }),
    JwtModule.register({
      secret: 'your-secret-key',
    }),
    LoginModule,
    AccountModule,
    AuthModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
