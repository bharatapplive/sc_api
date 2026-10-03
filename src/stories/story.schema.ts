import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type StoryDocument = HydratedDocument<Story>;

@Schema({ timestamps: true })
export class Story {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true, index: true })
    author!: Types.ObjectId;

    @Prop({ required: true })
    image!: string;

    @Prop({ trim: true, maxlength: 200, default: '' })
    caption!: string;
}

export const StorySchema = SchemaFactory.createForClass(Story);
StorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });