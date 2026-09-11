import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedModel } from './feed.model';

@Injectable()
export class FeedService {
	constructor(
        // model mean u have complete table 
		@InjectModel('Feed') private readonly feedModel: Model<FeedModel>,
	) {}

	async findAll(): Promise<FeedModel[]> {
		return this.feedModel.find().exec();
        // it will give u all records from feed table
        //db-> service-> controller
	}
}
