import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ReelService } from './reel.service';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';

@Controller('reel')
export class ReelController {
    constructor(
        private readonly reelServe: ReelService
    ){}

    // 1. Create Reel first..
    @Post()
    async uploadReel(@Body() request: string){
        return await this.reelServe.createReel(request);
    }

    // 2. Fetch all reels for feed page..
    @Get()
    async fetchAll(){
        return await this.reelServe.getAllReel();
    }

    // 3. Fetch reel as per userID..
    @UseGuards(JwtAuthGuard)
    @Get('user')
    async fetchPostsByUserId(@Request() request: any){
        return await this.reelServe.getReelsByUserId(request.user);
    }

    // 4. Delete the reels..
    @Delete(':id')
    async deletPostByID(@Param('id') id: any){
        return await this.reelServe.deleteReel(id);
    }

    // 5. Upadting and patching reel likes
    @UseGuards(JwtAuthGuard)
    @Patch(':id/like')
    async updateLikes(@Param('id') id: string, @Req() request: any){
        // Call service method
        return await this.reelServe.toggleLike(id, request.user);
    }

    // 5. Upadting and patching reel Comments..
    @Patch(':id/comment')
    async commentUpdate(@Param('id') post_Id: string){
        return await this.reelServe.updateComments(post_Id);
    }
}
