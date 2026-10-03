import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    // naya user banao
    create(data: Partial<User>) {
        return this.userModel.create(data);
    }

    // login ke liye: email, mobile ya username se user dhoondo (password ke saath)
    findForLogin(identifier: string) {
        const value = identifier.trim();
        return this.userModel
            .findOne({
                $or: [
                    { email: value.toLowerCase() },
                    { userName: value.toLowerCase() },
                    { mobile: value },
                ],
            })
            .select('+password');
    }

    // register se pehle check: ye email/mobile/username pehle se toh nahi hai?
    exists(email: string, mobile: string, userName: string) {
        return this.userModel.exists({
            $or: [
                { email: email.toLowerCase() },
                { userName: userName.toLowerCase() },
                { mobile },
            ],
        });
    }

    // token wale user ki details (password ke bina)
    findById(id: string) {
        return this.userModel.findById(id);
    }

    updateProfile(id: string, data: Partial<User>) {
        return this.userModel.findByIdAndUpdate(id, data, {
            returnDocument: 'after',
            runValidators: true,
        });
    }
}