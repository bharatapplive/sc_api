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
            const senderUserId = message.senderId?.userId || message.senderId;
            const newMessage = new this.directMessage({
                ...message,
                readBy: senderUserId ? [senderUserId] : [],
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

    async getRoomMessage(roomId: string){
        try{
            if(!roomId) return [];
        
            const message = await this.directMessage.find({roomId: String(roomId)}).exec()
            return message;
        }
        catch (error) {
            console.error('Error fetching room messages:', error);
            throw new InternalServerErrorException('Failed to retrieve messages');
        }
    }

    async getAllRooms(){
        try{
            const rooms = await this.directMessage.aggregate([
                {
                    $sort: { createdAt: 1 } // Sort by createdAt in descending order
                },
                {
                    $group: {
                        _id: "$roomId",
                        lastMessage: { $last: "$$ROOT" }
                    }
                },
                {
                    $sort: { "lastMessage.createdAt": -1 }
                }
            ]);
            return rooms;
        }
        catch (error) {
            console.error('Error fetching all rooms:', error);
            throw new InternalServerErrorException('Failed to retrieve rooms');
        }
    }

    async markAsRead(roomId: string, userId: string){
        try{
            if(!roomId || !userId) throw new BadRequestException('Room ID and User ID are required');
            
            const result = await this.directMessage.updateMany(
                { roomId: roomId, readBy:{$ne: userId}},
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
