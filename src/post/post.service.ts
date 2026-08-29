import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.model';

@Injectable()
export class PostService {

    constructor(
        @InjectModel('Posts') private postModel: Model<Post>
    ){}

    // 1. Create the Post...
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

            const savedPost = await newPost.save();

            return{
                message:'Post saved succesfully at',
                _id: savedPost.author.userId
            }

        }catch(err){
            if (err instanceof BadRequestException) {
                throw err;
            }
            throw new InternalServerErrorException('Error registering user');
        }
    }

    async getPostsByUserId(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        // Match against the schema field 'userId'
        return await this.postModel.find({ 'author.userId': userId }).sort({createdAt: -1}).skip(skip).limit(limit).exec();
    }

    async getAllPost(page = 1, limit = 10){
        const skip = (page - 1) * limit;
        return await this.postModel.find().sort({createdAt: -1}).skip(skip).limit(limit).exec();
    }
}
