import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';
@Controller('feed')
export class FeedController {
	constructor(private readonly feedService: FeedService) {}

	@Get()
	async getAllFeeds() {
		return this.feedService.findAll();
        // recived all recods from table and send to user
	}
}
