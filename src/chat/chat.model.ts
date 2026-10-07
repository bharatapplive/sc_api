import * as mongoose from 'mongoose';

const userRef = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Auth',
  required: true,
};

export const MessageSchema = new mongoose.Schema({
  senderId: userRef,
  receiverId: userRef,
  text: { type: String, required: true, trim: true },
  mediaUrl: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });
MessageSchema.index({ receiverId: 1, isRead: 1 });

export interface MessageModel extends mongoose.Document {
  senderId: mongoose.Types.ObjectId | string;
  receiverId: mongoose.Types.ObjectId | string;
  text: string;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: Date;
}