import { Module } from '@nestjs/common';
import { DirectMessageController } from './direct-message.controller';
import { DirectMessageService } from './direct-message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectMessageSchema } from './direct-message.model';
import { DirectMessageGateway } from './direct-message.gateway';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'DirectMessages', schema:DirectMessageSchema}])
  ],
  controllers: [DirectMessageController],
  providers: [DirectMessageService, DirectMessageGateway]
})
export class DirectMessageModule {}
