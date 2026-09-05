import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedService {
	private readonly feedList = [
		{
			id: 1,
			userName: 'john.doe',
			content: 'Welcome to Social Circle!',
			createdAt: '2026-09-03T10:00:00.000Z',
		},
		{
			id: 2,
			userName: 'jane.smith',
			content: 'Having a great day!',
			createdAt: '2026-09-03T11:00:00.000Z',
		},
	];

	findAll(): unknown[] {
		return this.feedList;
	}
}
