import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './message.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        private usersService: UsersService,
    ) { }

    async send(fromId: string, toId: string, text: string) {
        const clean = text.trim();
        if (!clean) throw new BadRequestException('Message cannot be empty');
        if (fromId === toId) throw new BadRequestException("You can't message yourself");
        if (!Types.ObjectId.isValid(toId)) throw new NotFoundException('User not found');

        const receiver = await this.usersService.findById(toId);
        if (!receiver) throw new NotFoundException('User not found');

        return this.messageModel.create({ from: fromId, to: toId, text: clean });
    }

    // do logon ki chat (purane pehle). Jo messages mujhe aaye the, unhe "read" mark karo
    async conversation(meId: string, otherId: string, before?: string, limit = 50) {
        if (!Types.ObjectId.isValid(otherId)) throw new NotFoundException('User not found');
        const me = new Types.ObjectId(meId);
        const other = new Types.ObjectId(otherId);

        const filter: any = { $or: [{ from: me, to: other }, { from: other, to: me }] };
        if (before && !isNaN(Date.parse(before))) {
            filter.createdAt = { $lt: new Date(before) }; // purane messages load karne ke liye
        }

        const messages = await this.messageModel.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
        await this.messageModel.updateMany({ from: other, to: me, read: false }, { read: true });
        return messages.reverse();
    }

    // chats ki list: har insaan ke saath aakhri message + kitne unread
    conversations(meId: string) {
        const me = new Types.ObjectId(meId);
        return this.messageModel.aggregate([
            { $match: { $or: [{ from: me }, { to: me }] } },
            { $sort: { createdAt: -1 } },
            // "doosra insaan" kaun hai: agar maine bheja toh receiver, warna sender
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