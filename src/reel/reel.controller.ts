import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ReelService } from './reel.service';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';

@Controller('reel')
export class ReelController {
    constructor(
        private readonly reelServe: ReelService
    ){}

    @Get()
    async fetchAll(){
        return await this.reelServe.getAllReel();
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    async fetchPostsByUserId(@Request() request: any){
        return await this.reelServe.getReelsByUserId(request.user);
    }

    @Post()
    async uploadPost(@Body() request: string){
        return await this.reelServe.createReel(request);
    }

    @Delete(':id')
    async deletPostByID(@Param('id') id: any){
        return await this.reelServe.deleteReel(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/like')
    async updateLikes(@Param('id') id: string, @Req() request: any){
        // Call service method
        return await this.reelServe.toggleLike(id, request.user);
    }
}
