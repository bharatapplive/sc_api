import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DirectMessage } from './direct-message.model';

@Injectable()
export class DirectMessageService {

    constructor(
        @InjectModel('DirectMessages') private directMessage: Model<DirectMessage>
    ){}

    async createMessage(message: any){
        try{
            // Extract user ID string for the readBy array
            const newMessage = new this.directMessage({
                ...message,
                readBy: message.senderId
            });

            return await newMessage.save();
        }
        catch(err){
            if (err instanceof BadRequestException) {
                throw err;
            }
            throw new InternalServerErrorException('Error registering user');
        }
    }

    async getRoomMessage(recId: string){
        try{
            if(!recId) return [];
        
            const message = await this.directMessage.find({receiverId: String(recId)}).exec()
            return message;
        }
        catch (error) {
            console.error('Error fetching room messages:', error);
            throw new InternalServerErrorException('Failed to retrieve messages');
        }
    }

    async getAllRooms(){
        try{
            const rooms = await this.directMessage.find();
            return rooms;
        }
        catch (error) {
            console.error('Error fetching all rooms:', error);
            throw new InternalServerErrorException('Failed to retrieve rooms');
        }
    }

    async markAsRead(userId: string){
        try{
            if( !userId) throw new BadRequestException('Room ID and User ID are required');
            
            const result = await this.directMessage.updateMany(
                { readBy:{$ne: userId}},
                { $addToSet:{readBy: userId}}
            );

            return result.modifiedCount;
        }
        catch (error) {
            console.error('Error marking messages as read:', error);
            throw new InternalServerErrorException('Failed to mark messages as read');
        }
    }

    async deleteRoomMessages(roomId: string){
        try{
            const results = await this.directMessage.deleteMany({roomId: String(roomId)});
            return results.deletedCount;
        }
        catch (error) {
            console.error('Error deleting room messages:', error);
            throw new InternalServerErrorException('Failed to delete messages');
        }
    }
}
