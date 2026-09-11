import * as mongoose from 'mongoose';
//step 3 Collection/table sechma has been created
export const FeedSchema = new mongoose.Schema({
    fullName: { type: String, required: true, minlength: 3 },
    userName: { type: String, required: true, minlength: 3 },
    avatar  : { type: String, required: true },
    location: { type: String, required: true },
    media: { type: Array, required: true },
    caption: { type: String, required: true },
    likesCount: { type: Number, required: true, default: 0 },
    isLikedByMe: { type: Boolean, required: true, default: false },
    isBookmarkedByMe: { type: Boolean, required: true, default: false },
    commentsCount: { type: Number, required: true, default: 0 },
     createdAt: { type: Date, default: Date.now },
        
});

export interface FeedModel extends mongoose.Document {
    fullName: string;
    userName: string;
    avatar: string;
    location: string;
    media: Array<any>;
    caption: string;
    likesCount: number;
    isLikedByMe: boolean;
    isBookmarkedByMe: boolean;
    commentsCount: number;
    createdAt: Date;        
}
