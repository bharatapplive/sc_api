import { Controller } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';

// step 2 crete controller for direct message
@Controller('direct-message')
export class DirectMessageController {
  constructor(private readonly directMessageService: DirectMessageService) {}
}
