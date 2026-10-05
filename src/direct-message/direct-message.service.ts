import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DirectMessage } from './direct-message.model';

// step 3 create service for direct message
@Injectable()
export class DirectMessageService {
    constructor(
        @InjectModel('DirectMessages') private directMessage: Model<DirectMessage>
    ){}

    // Step 1. Generate Message....
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

    // Step 2. Call the message
    async getMessage(receiverID: string){
        try{
            if(!receiverID) return [];
        
            const message = await this.directMessage.find({receiverId: String(receiverID)}).exec()
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
            if(!userId) throw new BadRequestException('Room ID and User ID are required');
            
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
}
