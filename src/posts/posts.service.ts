import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './post.schema';

// author ki sirf ye details bhejni hain (email/mobile nahi)
const AUTHOR_FIELDS = 'firstName lastName userName image';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }

    async create(authorId: string, text: string, image: string) {
        const post = await this.postModel.create({ author: authorId, text, image });
        return post.populate('author', AUTHOR_FIELDS);
    }

    // feed: naye posts pehle, ek baar mein thode-thode (pagination)
    findFeed(page: number, limit: number) {
        return this.postModel
            .find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('author', AUTHOR_FIELDS);
    }

    // like hai toh hatao, nahi hai toh lagao
    async toggleLike(postId: string, userId: string) {
        const post = await this.findOrFail(postId);
        const uid = new Types.ObjectId(userId);
        const alreadyLiked = post.likes.some((id) => id.equals(uid));

        const updated = await this.postModel.findByIdAndUpdate(
            postId,
            alreadyLiked ? { $pull: { likes: uid } } : { $addToSet: { likes: uid } },
            { returnDocument: 'after' },
        );
        return { liked: !alreadyLiked, likesCount: updated?.likes.length ?? 0 };
    }

    // sirf apni post delete kar sakte ho
    async remove(postId: string, userId: string) {
        const post = await this.findOrFail(postId);
        if (post.author.toString() !== userId) {
            throw new ForbiddenException('You can only delete your own posts');
        }
        await post.deleteOne();
        return { deleted: true };
    }

    private async findOrFail(postId: string) {
        if (!Types.ObjectId.isValid(postId)) throw new NotFoundException('Post not found');
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException('Post not found');
        return post;
    }
}