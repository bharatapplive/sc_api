import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type StoryDocument = HydratedDocument<Story>;

@Schema({ timestamps: true })
export class Story {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    author!: Types.ObjectId;

    @Prop({ required: true })
    image!: string;

    @Prop({ trim: true, maxlength: 200, default: '' })
    caption!: string;
}

export const StorySchema = SchemaFactory.createForClass(Story);

// 24 ghante (86400 sec) baad MongoDB story apne aap delete kar dega
StorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });