import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3 },
  lastName: { type: String, required: true, minlength: 3 },
  userName: { type: String, required: true, minlength: 3 },
  email: { type: String, required: false },
  mobile: { type: String, required: true, minlength: 10, maxLength: 10 },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user',
  },
  active: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
});

export interface AuthModel extends mongoose.Document {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  active: boolean;
  createdAt: Date;
}
