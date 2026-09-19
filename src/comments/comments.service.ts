import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './comments.model';

@Injectable()
export class CommentsService {

    constructor(
        @InjectModel('Comments') private commentModel: Model<Comment>
    ){}

    // 1. Create Comment..
    async createComment(request: any){
        try{
            const comment = new this.commentModel({
            ...request,
            parentID: request.parentID || null
        })

        return await comment.save();
        }catch(err){
            if (err instanceof BadRequestException) {
                throw err;
            }
            throw new InternalServerErrorException('Error registering user');
        }
    }

    // 2. Comment call by feedID..
    async getCommentByFeed(feed_Id: string){
        try{
            return await this.commentModel.find({feedId: feed_Id})
            .sort({createdAt: -1}).exec();
        }catch(err){
            throw new InternalServerErrorException('Error fetching comments');
        }
    }

    // 3. Delete the Comment
    async deleteComment(id: any){
        return this.commentModel.findByIdAndDelete(id);
    }

    // 4. Call by default require..
    async getAllComment(){
        return await this.commentModel.find();
    }
}
