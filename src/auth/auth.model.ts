import * as mongo from 'mongoose';

export const AuthSchema = new mongo.Schema({
    fullname:       { type: String, required: true, trim: true },
    username:       { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phoneNumber:          { type: String, required: true},
    password:       { type: String, required: true },
    avatarUrl:      { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' },
    bio:            { type: String, default: '', maxlength: 150 },
    otpCode:        {type: String, default: null},
    otpExpireAt:    { type: Date, default: null},
    isVerified:     { type: Boolean, default: false },
});

export interface Auth extends mongo.Document{
    fullname: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    avatarUrl: string;
    bio?: string;
    isVerified: boolean;
    otpCode: string;
    otpExpireAt: string;
    createdAt?: Date;
    updatedAt?: Date;
}