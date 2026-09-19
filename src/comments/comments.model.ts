import * as mongoo from 'mongoose';

export const CommentSchema = new mongoo.Schema({

    feedId:     {type: String, required: true, ref: 'Feed'},
    userID:     {type: String, required: true, ref: 'User'},
    parentID:   {type: String, required: false, ref: 'Comment'},
    content:    {type: String, required: true, trim: true, maxlength: 500},
    likeCount:  {type: Number, default:0},
    replyCount: {type: Number, default:0}
},
{
    timestamps: true
});

export interface Comment extends mongoo.Document{
    feedId:     string;
    userID:     string;
    parentID:   string | null;
    content:    string;
    likeCount:  number;
    replyCount: number;
    createdAt?:  Date;
    updatedAt?:  Date;
};