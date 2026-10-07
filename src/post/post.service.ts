import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostModel } from './post.model';
import { AuthModel } from '../auth/auth.model';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

export interface CreatePostDto {
  userId: string;
  userName: string;
  userAvatar?: string;
  postLink: string;
  caption?: string;
  location?: string;
}

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<PostModel>,
    @InjectModel('Auth') private readonly authModel: Model<AuthModel>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createPost(data: CreatePostDto): Promise<PostModel> {
    try {
      let cloudinaryUrl = data.postLink;

      // Upload image to Cloudinary if it's base64 or a local data URI
      if (data.postLink && (data.postLink.startsWith('data:image') || !data.postLink.includes('cloudinary.com'))) {
        cloudinaryUrl = await this.cloudinaryService.uploadImage(data.postLink, 'social_circle/posts');
      }

      const newPost = new this.postModel({
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar || '',
        postLink: cloudinaryUrl,
        caption: data.caption || '',
        location: data.location || '',
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date(),
      });

      return await newPost.save();
    } catch (error: any) {
      console.error('[PostService] Error creating post:', error);
      throw new InternalServerErrorException(error?.message || 'Failed to create post');
    }
  }

  async getFeedPosts(limit: number = 30, skip: number = 0): Promise<PostModel[]> {
    try {
      return await this.postModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error: any) {
      console.error('[PostService] Error fetching feed posts:', error);
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  async getPostsByUser(userId: string): Promise<PostModel[]> {
    try {
      const matchCriteria: any[] = [{ userId }];
      if (mongoose.isValidObjectId(userId)) {
        matchCriteria.push({ userId: new mongoose.Types.ObjectId(userId) });
      }
      return await this.postModel
        .find({ $or: matchCriteria })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error: any) {
      console.error('[PostService] Error fetching user posts:', error);
      throw new InternalServerErrorException('Failed to fetch user posts');
    }
  }

  async updatePost(
    postId: string,
    updateData: { caption?: string; location?: string },
  ): Promise<PostModel> {
    try {
      const updated = await this.postModel.findByIdAndUpdate(
        postId,
        { $set: updateData },
        { new: true },
      );
      if (!updated) {
        throw new NotFoundException('Post not found');
      }
      return updated;
    } catch (error: any) {
      console.error('[PostService] Error updating post:', error);
      throw new InternalServerErrorException(error?.message || 'Failed to update post');
    }
  }

  async deletePost(postId: string): Promise<{ success: boolean; message: string }> {
    try {
      const deleted = await this.postModel.findByIdAndDelete(postId);
      if (!deleted) {
        throw new NotFoundException('Post not found');
      }
      return { success: true, message: 'Post deleted successfully' };
    } catch (error: any) {
      console.error('[PostService] Error deleting post:', error);
      throw new InternalServerErrorException(error?.message || 'Failed to delete post');
    }
  }

  async toggleLike(
    postId: string,
    userId: string,
  ): Promise<{ post: PostModel; isLiked: boolean; likesCount: number }> {
    try {
      const post = await this.postModel.findById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const uidStr = String(userId || '').trim();
      if (!uidStr) {
        throw new InternalServerErrorException('userId is required to like a post');
      }

      if (!Array.isArray(post.likedBy)) {
        post.likedBy = [];
      }

      const existingIndex = post.likedBy.findIndex(
        (id: any) => String(id).trim() === uidStr,
      );

      let isLiked = false;
      if (existingIndex > -1) {
        // Already liked -> unlike
        post.likedBy.splice(existingIndex, 1);
        isLiked = false;
      } else {
        // Not liked -> like
        post.likedBy.push(uidStr);
        isLiked = true;
      }

      post.likesCount = post.likedBy.length;
      await post.save();

      return {
        post,
        isLiked,
        likesCount: post.likesCount,
      };
    } catch (error: any) {
      console.error('[PostService] Error toggling like:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error?.message || 'Failed to toggle like');
    }
  }

  async getPostLikes(postId: string): Promise<{ users: any[]; count: number }> {
    try {
      const post = await this.postModel.findById(postId).exec();
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const likedBy = post.likedBy || [];
      if (likedBy.length === 0) {
        return { users: [], count: 0 };
      }

      const objectIds: mongoose.Types.ObjectId[] = [];
      const stringIds: string[] = [];

      for (const id of likedBy) {
        const s = String(id).trim();
        if (mongoose.isValidObjectId(s)) {
          objectIds.push(new mongoose.Types.ObjectId(s));
        }
        stringIds.push(s);
      }

      const users = await this.authModel
        .find({
          $or: [
            { _id: { $in: objectIds } },
            { userName: { $in: stringIds } },
          ],
        })
        .select('_id userName firstName lastName avatar bio')
        .exec();

      const userMap = new Map<string, any>();
      users.forEach((u) => {
        userMap.set(String(u._id), u);
        if (u.userName) userMap.set(u.userName.toLowerCase(), u);
      });

      const formatted = likedBy.map((id) => {
        const s = String(id).trim();
        const found = userMap.get(s) || userMap.get(s.toLowerCase());
        if (found) {
          const fullName = `${found.firstName || ''} ${found.lastName || ''}`.trim() || found.userName;
          return {
            id: String(found._id),
            userName: found.userName || 'user',
            fullName,
            avatar: found.avatar || 'assets/images/default-avatar.png',
            bio: found.bio || '',
          };
        }
        return {
          id: s,
          userName: s.startsWith('@') ? s.slice(1) : s,
          fullName: s,
          avatar: 'assets/images/default-avatar.png',
          bio: '',
        };
      });

      return {
        users: formatted,
        count: formatted.length,
      };
    } catch (error: any) {
      console.error('[PostService] Error getting post likes:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error?.message || 'Failed to get post likes');
    }
  }

  async getPostComments(postId: string): Promise<{ comments: any[]; count: number }> {
    try {
      const post = await this.postModel.findById(postId).exec();
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      const comments = post.comments || [];
      return {
        comments,
        count: comments.length,
      };
    } catch (error: any) {
      console.error('[PostService] Error getting post comments:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error?.message || 'Failed to get post comments');
    }
  }

  async addComment(
    postId: string,
    commentData: { userId?: string; userName: string; userAvatar?: string; text: string },
  ): Promise<{ success: boolean; comment: any; commentsCount: number }> {
    try {
      const post = await this.postModel.findById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (!post.comments) {
        post.comments = [];
      }

      const newComment = {
        userId: commentData.userId || '',
        userName: commentData.userName || 'User',
        userAvatar: commentData.userAvatar || '',
        text: (commentData.text || '').trim(),
        createdAt: new Date(),
      };

      post.comments.push(newComment as any);
      post.commentsCount = post.comments.length;
      await post.save();

      return {
        success: true,
        comment: newComment,
        commentsCount: post.commentsCount,
      };
    } catch (error: any) {
      console.error('[PostService] Error adding comment:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error?.message || 'Failed to add comment');
    }
  }
}
