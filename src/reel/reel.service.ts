import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reel } from './reel.model';

@Injectable()
export class ReelService {

    constructor(
        @InjectModel('Reels') private reelModel: Model<Reel>
    ){}

    // 1. Create the Post...
    async createReel(request: any){
        try{
            let expiresAt: Date | null = null;
            if (request.type === 'STORY') {
                const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
                expiresAt = new Date(Date.now() + TWENTY_FOUR_HOURS);
            }

            const newPost = new this.reelModel({
                ...request,
                expiresAt,
            })

            return await newPost.save();

        }catch(err){
            if (err instanceof BadRequestException) {
                throw err;
            }
            throw new InternalServerErrorException('Error registering user');
        }
    }

    // 2. Delete the Post
    async deleteReel(id: any){
        return this.reelModel.findByIdAndDelete(id);
    }

    async getReelsByUserId(request: any, page = 1, limit = 10) {

        const userId = request?.userId || request?.sub;

        if (!userId) {
            throw new ForbiddenException('User identity missing in request payload');
        }

        try{
            const skip = (page - 1) * limit;
            // Match against the schema field 'userId'
            return await this.reelModel.find({ 'author.userId': userId }).sort({createdAt: -1}).skip(skip).limit(limit).exec();

        }catch(error){
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new NotFoundException('Invalid User ID format');
        }
    }

    async getAllReel(page = 1, limit =10){
        const skip = (page - 1) * limit;
        return await this.reelModel.find({type:'REEL'}).sort({createdAt: -1}).skip(skip).limit(limit).exec();
    }

    async toggleLike(postId: string, userRequest: any){
        const userId = userRequest?.userId || userRequest?.sub;

        if (!userId) {
            throw new ForbiddenException('User identity missing in request payload');
        }else{
            const hasLiked = (await this.reelModel.findById(postId)).likedBy.includes(userId);
        
            const updatedDoc = await this.reelModel.findByIdAndUpdate(
                postId, 
                hasLiked ? {
                    $pull:      {likedBy: userId},
                    $inc:       { likesCount: -1 }
                } : {
                    $addToSet:  { likedBy: userId },
                    $inc:       { likesCount: 1 }
                },
                {new: true}
            ).lean().exec();

            if (!updatedDoc) {
                throw new NotFoundException(`Post with ID ${postId} not found`);
            }

            // Return formatted response with isLiked evaluated for this specific user
            return {
                ...updatedDoc,
                // Fix count if it drops below 0 due to old edge cases
                likesCount: Math.max(0, updatedDoc.likesCount)
            };
        }
    }
}
