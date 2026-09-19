import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from './story.model';
import { Model } from 'mongoose';

@Injectable()
export class StoryService {

    constructor(
        @InjectModel('Storys') private storyModel: Model<Story>
    ){}

    async fetchAllStory(){
        return await this.storyModel.find().exec();
    }
}
