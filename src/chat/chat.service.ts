import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MessageModel } from './chat.model';
import { AuthModel } from '../auth/auth.model';

const DEFAULT_AVATAR = 'assets/images/default-avatar.png';
const toId = (id: string) => new Types.ObjectId(id);

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<MessageModel>,
    @InjectModel('Auth') private readonly authModel: Model<AuthModel>,
  ) { }

  private formatUser(u: any) {
    return {
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      userName: u.userName,
      avatar: u.avatar || DEFAULT_AVATAR,
      bio: u.bio || '',
    };
  }

  async sendMessage(senderId: string, receiverId: string, text: string, mediaUrl?: string) {
    if (!senderId || !receiverId) {
      throw new BadRequestException('Sender and Receiver IDs are required');
    }
    if (!text?.trim()) {
      throw new BadRequestException('Message text cannot be empty');
    }

    return this.messageModel.create({
      senderId: toId(senderId),
      receiverId: toId(receiverId),
      text: text.trim(),
      mediaUrl: mediaUrl || '',
    });
  }

  async getMessages(userId1: string, userId2: string) {
    if (!userId1 || !userId2) return [];

    const a = toId(userId1);
    const b = toId(userId2);

    return this.messageModel
      .find({
        $or: [
          { senderId: a, receiverId: b },
          { senderId: b, receiverId: a },
        ],
      })
      .sort({ createdAt: 1 });
  }

  async markAsRead(userId: string, otherUserId: string) {
    if (!userId || !otherUserId) return { modifiedCount: 0 };

    const result = await this.messageModel.updateMany(
      { receiverId: toId(userId), senderId: toId(otherUserId), isRead: false },
      { $set: { isRead: true } },
    );

    return { modifiedCount: result.modifiedCount };
  }

  async getConversations(userId: string) {
    if (!userId) return [];

    const me = toId(userId);
    const messages = await this.messageModel
      .find({ $or: [{ senderId: me }, { receiverId: me }] })
      .sort({ createdAt: -1 });

    // newest message comes first, so the first one we see per partner is the last message
    const chats = new Map<string, { lastMessage: any; unreadCount: number }>();

    for (const msg of messages) {
      const sender = msg.senderId.toString();
      const receiver = msg.receiverId.toString();
      const partnerId = sender === userId ? receiver : sender;

      if (!chats.has(partnerId)) {
        chats.set(partnerId, {
          lastMessage: {
            text: msg.text,
            createdAt: msg.createdAt,
            senderId: sender,
            isRead: msg.isRead,
          },
          unreadCount: 0,
        });
      }

      if (receiver === userId && !msg.isRead) {
        chats.get(partnerId)!.unreadCount++;
      }
    }

    const partners = await this.authModel
      .find({ _id: { $in: Array.from(chats.keys()).map(toId) } })
      .select('firstName lastName userName avatar bio');

    const partnerMap = new Map(partners.map((p) => [p._id.toString(), p]));
    const result = [];

    for (const [partnerId, chat] of chats) {
      const partner = partnerMap.get(partnerId);
      if (partner) {
        result.push({ partnerId, partner: this.formatUser(partner), ...chat });
      }
    }

    return result;
  }

  async getChatUsers(currentUserId?: string, search?: string) {
    const query: any = {};

    if (currentUserId && Types.ObjectId.isValid(currentUserId)) {
      query._id = { $ne: toId(currentUserId) };
    }

    const term = search?.trim();
    if (term) {
      const match = { $regex: term, $options: 'i' };
      query.$or = [{ userName: match }, { firstName: match }, { lastName: match }];
    }

    const users = await this.authModel
      .find(query)
      .select('firstName lastName userName avatar bio email')
      .limit(30);

    return users.map((u) => ({ ...this.formatUser(u), email: u.email }));
  }
}