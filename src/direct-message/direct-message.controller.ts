import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';

// step 2 crete controller for direct message
@Controller('direct-message')
export class DirectMessageController {

  constructor(
        private readonly directServe: DirectMessageService
    ){}

    @Get('room/:receivedId')
    async getRooms(@Param('receivedId') receivedId: string){
        try {
            return await this.directServe.getMessage(receivedId);
        } catch (error) {
            console.error('Controller Error on getRooms:', error);
        }
    }

    @Get('rooms')
    async getAllRooms(){
        try {
            return await this.directServe.getAllRooms();
        } catch (error) {
            console.error('Controller Error on getAllRooms:', error);
        }
    }

    @Patch('rooms/:recID/read')
    async getRoomMessages(@Param('recID') recID: string, @Body('userId') userId: string){
        try{
            return await this.directServe.markAsRead(userId);
        } catch (error) {
            console.error('Controller Error on markAsRead:', error);
        }
    }
}
