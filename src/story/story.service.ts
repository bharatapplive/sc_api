import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoryModel } from './story.model';

@Injectable()
export class StoryService {
	constructor(
		@InjectModel('Story') private readonly storyModel: Model<StoryModel>,
	) {}

	async createStory(storyData: StoryModel): Promise<StoryModel> {
        //4 created a new record in story collection and return the created story
		return this.storyModel.create(storyData);
	}
}
