import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
    // kisne post kiya (User se link)
    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    author!: Types.ObjectId;

    @Prop({ trim: true, maxlength: 2000, default: '' })
    text!: string;

    @Prop({ default: '' })
    image!: string;

    // jin users ne like kiya, unki IDs
    @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
    likes!: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ createdAt: -1 }); // naye posts jaldi milein