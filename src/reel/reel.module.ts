import { Module } from '@nestjs/common';
import { ReelController } from './reel.controller';
import { ReelService } from './reel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReelSchema } from './reel.model';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Reels', schema:ReelSchema}])
  ],
  controllers: [ReelController],
  providers: [ReelService]
})
export class ReelModule {}
