import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {

    constructor(
        private readonly followServe: FollowService
    ){}

    @Post()
    async createNewFollower(@Body() request: any)
    {
        return await this.followServe.createFollower(request);
    }

    @Delete(':id/delete')
    async deleteByID(@Param('id') id: string){
        return await this.followServe.deleteFollowerByID(id);
    }

    @Get()
    async fetchFollowers(){
        return await this.followServe.getAllFollowers();
    }
}
