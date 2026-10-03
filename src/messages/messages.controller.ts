import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './messages.dto';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) { }

    @Get('conversations')
    list(@Req() req: any) {
        return this.messagesService.conversations(req.user.sub);
    }

    @Get(':userId')
    chat(@Req() req: any, @Param('userId') userId: string, @Query('before') before?: string) {
        return this.messagesService.conversation(req.user.sub, userId, before);
    }

    @Post(':userId')
    send(@Req() req: any, @Param('userId') userId: string, @Body() dto: SendMessageDto) {
        return this.messagesService.send(req.user.sub, userId, dto.text);
    }

    // PATCH /messages/:userId/read — chat khuli ho aur naya message aaye, tab
    @Patch(':userId/read')
    markRead(@Req() req: any, @Param('userId') userId: string) {
        return this.messagesService.markRead(req.user.sub, userId);
    }
}