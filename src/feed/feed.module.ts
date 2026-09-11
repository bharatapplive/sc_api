import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { FeedSchema } from './feed.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Feed', schema: FeedSchema }]),
    // step 3
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
