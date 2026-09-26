import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowSchema } from './follow.model';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Follows', schema:FollowSchema}])
  ],
  controllers: [FollowController],
  providers: [FollowService]
})
export class FollowModule {}
