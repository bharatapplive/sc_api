import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true })
    firstName!: string;

    @Prop({ trim: true, default: '' })
    lastName!: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    userName!: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    email!: string;

    @Prop({ required: true, unique: true, trim: true })
    mobile!: string;

    @Prop({ required: true, select: false })
    password!: string;

    @Prop({ default: '' })
    image!: string;

    @Prop({ default: '' })
    bio!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);