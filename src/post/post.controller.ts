import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';

@Controller('post')
export class PostController {

    constructor(
        private readonly postServe: PostService
    ){}

    // 1. Create the post..
    @Post()
    async uploadPost(@Body() request: string){
        return await this.postServe.createPost(request);
    }

    // 2. Fetch all post..
    @Get('user-post')
    async fetchAllPost(){
        return await this.postServe.getAllPost();
    }
    
    // 3. Fetch all Story..
    @Get('story')
    async fetchAllStory(){
        return await this.postServe.getAllStory();
    }

    // 4. Fetch Post by userID.
    @UseGuards(JwtAuthGuard)
    @Get('user')
    async fetchPostsByUserId(@Request() request: any){
        return await this.postServe.getPostsByUserId(request.user);
    }

    // 5. Delete the post as per requirement..
    @Delete(':id')
    async deletPostByID(@Param('id') id: any){
        return await this.postServe.deletePost(id);
    }

    // 6. Patching or updating Likes..
    @UseGuards(JwtAuthGuard)
    @Patch(':id/like')
    async updateLikes(@Param('id') id: string, @Req() request: any){
        // Call service method
        return await this.postServe.toggleLike(id, request.user);
    }

    // 7. Patching or updating commentcount..
    @Patch(':id/comment')
    async commentUpdate(@Param('id') post_Id: string){
        return await this.postServe.updateComments(post_Id);
    }

    // 8. Patching or updating author details...
    @UseGuards(JwtAuthGuard)
    @Patch('author')
    async updatePostAuthor(@Request() request: any, @Body() updateData: any){
        const userID = request.user?._id ||request.user?.id || request.user?.sub;

        if(!userID){
            throw new BadRequestException('User ID not found in request context.');
        }

        return await this.postServe.updateAuthor(userID, updateData);
    }
}
