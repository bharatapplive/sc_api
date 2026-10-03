import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './story.schema';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }])],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule { }