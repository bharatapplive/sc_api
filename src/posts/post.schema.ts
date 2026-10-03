import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true, index: true })
    author!: Types.ObjectId;

    @Prop({ trim: true, maxlength: 2000, default: '' })
    text!: string;

    @Prop({ default: '' })
    image!: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: User.name }], default: [] })
    likes!: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ createdAt: -1 });