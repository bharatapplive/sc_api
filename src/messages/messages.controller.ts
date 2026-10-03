import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './messages.dto';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) { }

    // GET /messages/conversations — chats ki list
    // (ye ':userId' se PEHLE hona zaruri hai, warna "conversations" ko userId samjha jayega)
    @Get('conversations')
    list(@Req() req: any) {
        return this.messagesService.conversations(req.user.sub);
    }

    // GET /messages/:userId — us user ke saath chat
    @Get(':userId')
    chat(@Req() req: any, @Param('userId') userId: string, @Query('before') before?: string) {
        return this.messagesService.conversation(req.user.sub, userId, before);
    }

    // POST /messages/:userId — message bhejo
    @Post(':userId')
    send(@Req() req: any, @Param('userId') userId: string, @Body() dto: SendMessageDto) {
        return this.messagesService.send(req.user.sub, userId, dto.text);
    }
}