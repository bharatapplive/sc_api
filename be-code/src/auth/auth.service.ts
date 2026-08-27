import { Injectable } from '@nestjs/common';
import { AuthModel } from './auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    // step 4 DI of schema model
    @InjectModel('Auth') private readonly authModel: Model<AuthModel>,
  ) {}

  //step 5
  async create(requestData: any): Promise<AuthModel> {
    // stp 6 new row added wuth data
    const createdAuth = new this.authModel({
      ...requestData,
      // Store the local path or URL
    });

    //step 7 save a new row in db
    return await createdAuth.save();
  }
}
