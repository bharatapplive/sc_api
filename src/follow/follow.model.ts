import * as mongoo from 'mongoose';

//#region Follow Relationship Schema
export const FollowSchema = new mongoo.Schema({
    followerId: { type: String, required: true, index: true }, // The user initiating the follow
    followingId:{ type: String, required: true, index: true }  // The user being followed
}, {
    timestamps: true
});

// Ensure a user cannot follow the same target multiple times
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export interface Follow extends mongoo.Document {
    followerId:  string;
    followingId: string;
    createdAt?:  Date;
    updatedAt?:  Date;
}
//#endregion