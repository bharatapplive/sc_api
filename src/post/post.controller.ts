import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreatePostDto, PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(@Body() createPostDto: CreatePostDto) {
    const post = await this.postService.createPost(createPostDto);
    return {
      message: 'Post created successfully',
      post,
    };
  }

  @Get('feed')
  async getFeed(@Query('limit') limit?: number, @Query('skip') skip?: number) {
    const posts = await this.postService.getFeedPosts(
      limit ? Number(limit) : 30,
      skip ? Number(skip) : 0,
    );
    return {
      posts,
      total: posts.length,
    };
  }

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    const posts = await this.postService.getPostsByUser(userId);
    return {
      posts,
    };
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updateData: { caption?: string; location?: string },
  ) {
    const post = await this.postService.updatePost(id, updateData);
    return {
      message: 'Post updated successfully',
      post,
    };
  }

  @Post(':id/like')
  async toggleLike(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return await this.postService.toggleLike(id, userId);
  }

  @Get(':id/likes')
  async getPostLikes(@Param('id') id: string) {
    return await this.postService.getPostLikes(id);
  }

  @Get(':id/comments')
  async getPostComments(@Param('id') id: string) {
    return await this.postService.getPostComments(id);
  }

  @Post(':id/comment')
  async addComment(
    @Param('id') id: string,
    @Body() commentData: { userId?: string; userName: string; userAvatar?: string; text: string },
  ) {
    return await this.postService.addComment(id, commentData);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }
}

