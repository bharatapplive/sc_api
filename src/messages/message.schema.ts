import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
    from!: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
    to!: Types.ObjectId;

    @Prop({ required: true, trim: true, maxlength: 2000 })
    text!: string;

    @Prop({ default: false })
    read!: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ from: 1, to: 1, createdAt: -1 });
MessageSchema.index({ to: 1, read: 1 });