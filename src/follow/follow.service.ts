import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from './follow.model';

@Injectable()
export class FollowService {

    constructor(
        @InjectModel('Follows') private readonly followModel: Model<Follow>
    ){}

    async createFollower(request: any){

        const newFollower = new this.followModel({
            ...request
        });

        return await newFollower.save();
    }

    async deleteFollowerByID(id: string){
        return await this.followModel.findByIdAndDelete(id).exec();
    }

    async getAllFollowers(){
        return await this.followModel.find().exec();
    }
}
