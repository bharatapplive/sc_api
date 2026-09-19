import { Controller, Get } from '@nestjs/common';
import { StoryService } from './story.service';

@Controller('story')
export class StoryController {

    constructor(
        private readonly storyServe: StoryService
    ){}

    @Get()
    async getAllStory(){
        return await this.storyServe.fetchAllStory();
    }
}
