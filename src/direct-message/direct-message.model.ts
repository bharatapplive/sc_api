import * as mongo from 'mongoose';
export const AuthorSchema = new mongo.Schema({
    userId:         { type: String, required: true, index: true },
    authorName:     { type: String, required: true, trim: true },
    avatarUrl:      { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' },
},{   
    _id: false 
});

export interface Author{
    userId:     string;
    authorName: string;
    avatarUrl:  string;
};

export const DirectMessageSchema = new mongo.Schema(
  {
    roomId: { type: String, required: true, index: true },
    senderId: { type: AuthorSchema, required: true },
    text: { type: String, required: true, trim: true },
    messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    mediaUrl: { type: String, default: null },
    readBy: [{ type: mongo.Schema.Types.ObjectId, ref: 'Auth' }],
  },
  { timestamps: true }
);

export interface DirectMessage extends mongo.Document {
  roomId: string;
  senderId: Author;
  text: string;
  messageType: 'text' | 'image' | 'file';
  mediaUrl?: string;
  readBy?: mongo.Types.ObjectId[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}