import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './message.schema';
import { UsersService } from '../users/users.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        private usersService: UsersService,
        private chatGateway: ChatGateway,
    ) { }

    async send(fromId: string, toId: string, text: string) {
        const clean = text.trim();
        if (!clean) throw new BadRequestException('Message cannot be empty');
        if (fromId === toId) throw new BadRequestException("You can't message yourself");
        if (!Types.ObjectId.isValid(toId)) throw new NotFoundException('User not found');

        const receiver = await this.usersService.findById(toId);
        if (!receiver) throw new NotFoundException('User not found');

        const message = await this.messageModel.create({ from: fromId, to: toId, text: clean });

        // real-time: bhejne wale ka naam bhi saath bhejo (notification ke liye)
        const sender = await this.usersService.findPublic(fromId);
        this.chatGateway.notifyNewMessage({ ...message.toJSON(), sender: sender?.toJSON() });

        return message;
    }

    async conversation(meId: string, otherId: string, before?: string, limit = 50) {
        if (!Types.ObjectId.isValid(otherId)) throw new NotFoundException('User not found');
        const me = new Types.ObjectId(meId);
        const other = new Types.ObjectId(otherId);

        const filter: any = { $or: [{ from: me, to: other }, { from: other, to: me }] };
        if (before && !isNaN(Date.parse(before))) {
            filter.createdAt = { $lt: new Date(before) };
        }

        const messages = await this.messageModel.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
        await this.markRead(meId, otherId);
        return messages.reverse();
    }

    // otherId ke bheje hue messages "read" karo, aur usse real-time batao
    async markRead(meId: string, otherId: string) {
        if (!Types.ObjectId.isValid(otherId)) throw new NotFoundException('User not found');
        const result = await this.messageModel.updateMany(
            { from: new Types.ObjectId(otherId), to: new Types.ObjectId(meId), read: false },
            { read: true },
        );
        if (result.modifiedCount > 0) this.chatGateway.notifyRead(meId, otherId);
        return { updated: result.modifiedCount };
    }

    conversations(meId: string) {
        const me = new Types.ObjectId(meId);
        return this.messageModel.aggregate([
            { $match: { $or: [{ from: me }, { to: me }] } },
            { $sort: { createdAt: -1 } },
            { $addFields: { other: { $cond: [{ $eq: ['$from', me] }, '$to', '$from'] } } },
            {
                $group: {
                    _id: '$other',
                    lastMessage: { $first: '$text' },
                    lastAt: { $first: '$createdAt' },
                    lastFromMe: { $first: { $eq: ['$from', me] } },
                    unread: {
                        $sum: { $cond: [{ $and: [{ $eq: ['$to', me] }, { $eq: ['$read', false] }] }, 1, 0] },
                    },
                },
            },
            { $sort: { lastAt: -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { firstName: 1, lastName: 1, userName: 1, image: 1 } }],
                },
            },
            { $unwind: '$user' },
            { $project: { _id: 0, user: 1, lastMessage: 1, lastAt: 1, lastFromMe: 1, unread: 1 } },
        ]);
    }
}