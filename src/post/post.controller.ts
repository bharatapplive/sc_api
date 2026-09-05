import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';

@Controller('post')
export class PostController {

    constructor(
        private readonly postServe: PostService
    ){}

    @Get()
    async fetchAll(){
        return await this.postServe.getAllPost();
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    async fetchPostsByUserId(@Request() request: any){
        return await this.postServe.getPostsByUserId(request.user);
    }

    @Post()
    async uploadPost(@Body() request: string){
        return await this.postServe.createPost(request);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/like')
    async updateLikes(@Param('id') id: string, @Req() request: any){
        // Call service method
        return await this.postServe.toggleLike(id, request.user);
    }
}
