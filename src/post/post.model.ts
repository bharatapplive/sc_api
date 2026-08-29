import * as mongoo from 'mongoose';

//#region Author Sub-schema..
export const AuthorSchema = new mongoo.Schema({
    userId:         { type: String, required: true, index: true },
    authorName:     { type: String, required: true, trim: true },
    avatarUrl:      { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' },
    isFollowing:    { type: Boolean, default: false},
    hasUnseenStory: { type: Boolean, default: false}
},{   
    _id: false 
});

export interface Author{
    userId:     string;
    authorName: string;
    avatarUrl:  string;
    isFollowing?: boolean;
    hasUnseenStory?: boolean;
};
//#endregion

//#region Audio Sub-Schema ----
export const AudioSchema = new mongoo.Schema({
    audioUrl: { type: String, required: true },
    title:    { type: String, default: '', maxlength: 150 },
    artist:   { type: String, default: '' },
    duration: { type: Number, default: 0 } // Duration in seconds
}, 
{   
    _id: false 
});

export interface Audio {
    audioUrl: string;
    title?: string;
    artist?: string;
    duration?: number;
}
//#endregion

//#region Post Schema....
export type ContentType = 'POST' | 'REEL' | 'STORY';

export const PostSchema = new mongoo.Schema({
    username:       { type: String, required: true, lowercase: true, trim: true },
    type:           { type: String, enum:['POST', 'REEL', 'STORY'], required: true, default: 'POST'},
    author:         { type: AuthorSchema, required: true },
    mediaUrl:       { type: String, required: true },
    mediaType:      { type: String, required: true, enum: ['image', 'video', 'audio'], default: 'image' },
    audio:          { type: AudioSchema, default: null },
    caption:        { type: String, default: null, maxlength: 2200 },
    time:           { type: Date, default: Date.now },
    likedBy:        [{ type: String }],
    isLiked:        { type: Boolean, default: false},
    likesCount:     { type: Number, default: 0 },
    commentsCount:  { type: Number, default: 0 },
    repostsCount:   { type: Number, default: 0 },
    sharesCount:    { type: Number, default: 0 },
    // Story Expiration (automatically deletes story documents after 24h)
    expiresAt:      { type: Date, default: null, index: { expires: 0 } }
}, {
    timestamps: true
});
// Indexes for fast feed filtering
PostSchema.index({ type: 1, createdAt: -1 });

export interface Post extends mongoo.Document{
    username:       string;
    type:           ContentType;
    author:         Author;
    mediaUrl:       string;
    mediaType:      'image' | 'video' | 'audio';
    audio?:         Audio | null;
    caption?:       string | null;
    time?:          Date;
    likedBy:        string[];
    isLiked?:       boolean;
    likesCount?:    number;
    commentsCount?: number;
    repostsCount?:  number;
    sharesCount?:   number;
    expiresAt?:     Date | null;
    createdAt?:     Date;
    updatedAt?:     Date;
}
//#endregion