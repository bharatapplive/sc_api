import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  userName: {
    type: String,
    required: true,
  },
  userAvatar: {
    type: String,
    required: false,
    default: '',
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Auth',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userAvatar: {
    type: String,
    required: false,
    default: '',
  },
  postLink: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [CommentSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface PostComment {
  _id?: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date;
}

export interface PostModel extends mongoose.Document {
  userId: mongoose.Types.ObjectId | string;
  userName: string;
  userAvatar?: string;
  postLink: string;
  caption?: string;
  location?: string;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  comments: PostComment[];
  createdAt: Date;
}
