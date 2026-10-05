import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';

@Controller('direct-message')
export class DirectMessageController {

    constructor(
        private readonly directServe: DirectMessageService
    ){}

    @Get('room/:roomId')
    async getRooms(@Param('roomId') roomId: string){
        try {
            return await this.directServe.getRoomMessage(roomId);
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

    @Patch('rooms/:roomId/read')
    async getRoomMessages(@Param('roomId') roomId: string, @Body('userId') userId: string){
        try{
            return await this.directServe.markAsRead(roomId, userId);
        } catch (error) {
            console.error('Controller Error on markAsRead:', error);
        }
    }

    @Delete('rooms/:roomId')
    async deleteMessage(@Param('roomid') roomId: string){
        try{
            const deleteMsg= await this.directServe.deleteRoomMessages(roomId);
            return deleteMsg;
        }
        catch(error){
            console.error('Failed to delete msg:', error);
        }
    }
}
