import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {

    constructor(
        private readonly commentServe: CommentsService
    ){}

    // 1. Pass the Commentment here..
    @Post()
    async createComment(@Body() request: any){
        return await this.commentServe.createComment(request);
    }

    // 2. Fetch the comment by feed...
    @Get(':feedId')
    async getCommentsByFeed(@Param('feedId') feedId: string) {
        return await this.commentServe.getCommentByFeed(feedId);
    }

    // 3. Remove the comment...
    @Delete(':id')
    async deleteCommentByID(@Param('id') id: string){
        return await this.commentServe.deleteComment(id);
    }

    //Default call..
    @Get()
    async fetchComment(){
        return await this.commentServe.getAllComment();
    }
}
