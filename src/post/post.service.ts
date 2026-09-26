import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.model';

@Injectable()
export class PostService {

    constructor(
        @InjectModel('Posts') private postModel: Model<Post>
    ){}

    // 1. Creating the Post...
    async createPost(request: any){
        try{
            let expiresAt: Date | null = null;
            if (request.type === 'STORY') {
                const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
                expiresAt = new Date(Date.now() + TWENTY_FOUR_HOURS);
            }

            const newPost = new this.postModel({
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

    // 2. Fetch the all Post..
    async getAllPost(page = 1, limit = 100){
        const skip = (page - 1) * limit;
        return await this.postModel.find({type:'POST'}).sort({createdAt: -1}).skip(skip).limit(limit).exec();
    }

    // 3. Fetch by userId
    async getPostsByUserId(request: any, page = 1, limit = 100) {

        const userId = request?.userId || request?.sub;

        if (!userId) {
            throw new ForbiddenException('User identity missing in request payload');
        }

        try{
            const skip = (page - 1) * limit;
            // Match against the schema field 'userId'
            return await this.postModel.find({ 'author.userId': userId }).sort({createdAt: -1}).skip(skip).limit(limit).exec();

        }catch(error){
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new NotFoundException('Invalid User ID format');
        }
    }

    // 4. Delete the Post
    async deletePost(id: any){
        return this.postModel.findByIdAndDelete(id);
    }

    // 5. Update or patch the Likes and counts
    async toggleLike(postId: string, userRequest: any){
        const userId = userRequest?.userId || userRequest?.sub;

        if (!userId) {
            throw new ForbiddenException('User identity missing in request payload');
        }else{
            const hasLiked = (await this.postModel.findById(postId)).likedBy.includes(userId);
        
            const updatedDoc = await this.postModel.findByIdAndUpdate(
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

    // 6. Update the comment counts..
    async updateComments(post_Id: string){
        return await this.postModel.findByIdAndUpdate(
            post_Id,
            {  
                $inc:{commentsCount: 1}
            },
            {new: true}
        ).exec();
    }

    // 7. Update Post Author..
    async updateAuthor(userID: any, updateData:  any){

        if(!userID){
            throw new BadRequestException(`Invalid Mongo User ID format: ${userID}`);
        }

        const updatePayload: Record<string, any> = {};
        if (updateData.authorName) updatePayload['author.authorName'] = updateData.authorName;
        if (updateData.avatarUrl) updatePayload['author.avatarUrl'] = updateData.avatarUrl;

        return await this.postModel.updateMany(
            { 'author.userId': userID }, // Fixed case sensitive key: userId
            { $set: updatePayload }
        ).exec();
    }

    // 8. Get All Story..
    async getAllStory(page = 1, limit = 100){
        const skip = (page - 1) * limit;
        return await this.postModel.find({type:'STORY'}).sort({createdAt: -1}).skip(skip).limit(limit).exec();
    }
}
