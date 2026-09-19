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

export type ContentType = 'POST' | 'REEL' | 'STORY';

export const StorySchema = new mongoo.Schema({
    username:       {type: String, required: true},
    type:           { type: String, enum:['POST', 'REEL', 'STORY'], required: true, default: 'STORY'},
    author:         { type: AuthorSchema, required: true },
    mediaUrl:       { type: String, required: true },
    mediaType:      { type: String, required: true, enum: ['image', 'video'], default: 'image' },
    audio:          { type: AudioSchema, default: null },
    viewers:        [{ type: String, ref: 'User' }],
    viewsCount:     {type: Number, default: 0 },
    expiresAt:      {type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), index: { expires: 0 }},
    status:         { type: String, enum: ['active', 'archived', 'deleted'], default: 'active'}
},
  { timestamps: true }
);
// Indexes for fast feed filtering
StorySchema.index({ type: 1, createdAt: -1 });

export interface Story extends mongoo.Document{
    username:       string;
    type:           ContentType;
    author:         Author;
    mediaUrl:       string;
    mediaType:      'image' | 'video';
    audio?:         Audio | null;
    viewers:        string[];
    viewsCount:     number;
    expiresAt?:     Date | null;
    status:         string;
    createdAt?:     Date;
    updatedAt?:     Date;
}