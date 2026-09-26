import * as mongoose from 'mongoose';

export const StorySchema = new mongoose.Schema({
  image: { type: String, required: true },
  text: { type: String, required: true },
  token: { type: String, required: true },
  user: { type: Object, required: true },
});

export interface StoryModel extends mongoose.Document {
  image: string;
  text: string;
  token: string;
  user: object;
}