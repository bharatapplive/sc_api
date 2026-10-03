import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Story } from './story.schema';

const AUTHOR_FIELDS = 'firstName lastName userName image';
const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class StoriesService {
    constructor(@InjectModel(Story.name) private storyModel: Model<Story>) { }

    async create(authorId: string, image: string, caption: string) {
        const story = await this.storyModel.create({ author: authorId, image, caption });
        return story.populate('author', AUTHOR_FIELDS);
    }

    // pichle 24 ghante ki stories, user ke hisaab se group karke
    async findActiveGrouped() {
        const since = new Date(Date.now() - DAY_MS);
        const stories = await this.storyModel
            .find({ createdAt: { $gte: since } })
            .sort({ createdAt: 1 })
            .populate('author', AUTHOR_FIELDS)
            .lean();

        const groups = new Map<string, { author: any; stories: any[] }>();
        for (const s of stories as any[]) {
            if (!s.author) continue; // author delete ho gaya ho toh skip
            const key = String(s.author._id);
            if (!groups.has(key)) groups.set(key, { author: s.author, stories: [] });
            groups.get(key)!.stories.push({
                _id: s._id,
                image: s.image,
                caption: s.caption,
                createdAt: s.createdAt,
            });
        }
        return [...groups.values()];
    }

    async remove(storyId: string, userId: string) {
        if (!Types.ObjectId.isValid(storyId)) throw new NotFoundException('Story not found');
        const story = await this.storyModel.findById(storyId);
        if (!story) throw new NotFoundException('Story not found');
        if (story.author.toString() !== userId) {
            throw new ForbiddenException('You can only delete your own stories');
        }
        await story.deleteOne();
        return { deleted: true };
    }
}