import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {

    constructor(
        private readonly postServe: PostService
    ){}

    @Get()
    async fetchAll(){
        return await this.postServe.getAllPost();
    }

    // Route becomes /post/:userId
    @Get(':userId')
    async fetchPostsByUserId(@Param('userId') userId: string) {
        return await this.postServe.getPostsByUserId(userId);
    }

    @Post()
    async uploadPost(@Body() request: string){
        return await this.postServe.createPost(request);
    }

    @Patch(':id/like')
    async updateLikes(@Param('id') id: string, @Body('userId') userId?: string){
        // Call service method
        return await this.postServe.toggleLike(id, userId);
    }
}
