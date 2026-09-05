import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Auth } from './auth.model';
import { JwtService } from '@nestjs/jwt'; // 1. Import JwtService
import { Response, Request } from 'express';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel('Auths') private authModel: Model<Auth>,
        private readonly jwtService: JwtService // 2. Inject JwtService
    ){}

    // 1. Register New User...
    async userRegistration(request: any){
        try{
            // Check if email or username already exists
            const existingUser = await this.authModel.findOne({
                $or: [
                    { email: request.email }, 
                    { username: request.username }, 
                    { phoneNumber: request.phoneNumber }, 
                    { password: request.password}]
            });

            if (existingUser) {
                throw new BadRequestException('Email or username already exists');
            }

            // Hash the password before saving!
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(request.password, saltRounds);
            
            // Generate 6-digit OTP code & expiration (10 minutes)
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

            const newUser = new this.authModel({
                fullname: request.fullname,
                username: request.username,
                email: request.email,
                phoneNumber: request.phoneNumber || null,
                password: hashedPassword,
                avatarUrl: request.avatarUrl,
                bio: request.bio,
                isVerified: false,
                otpCode: generatedOtp,
                otpExpireAt: otpExpiry,
            })

            return await newUser.save();

        }
        catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error registering user');
        }
    }

    // 2. Verify OTP Method
    async verifyOtp(payload: { userId: string; otpCode: string }) {
        try {
            const { userId, otpCode } = payload;

            // Find user by id and explicitly select the hidden OTP fields
            const user = await this.authModel.findById(userId).select('+otp.code +otp.expiresAt');

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Check if OTP exists
            if (!user.otpCode) {
                throw new BadRequestException('No active OTP found. Please request a new one.');
            }

            // Check if OTP matches
            if (user.otpCode !== otpCode) {
                throw new BadRequestException('Invalid OTP code');
            }

            // Check if OTP has expired
            if (new Date() > new Date(user.otpExpireAt)) {
                throw new BadRequestException('OTP has expired. Please request a new one.');
            }

            // Perform actions based on OTP purpose
            user.isVerified = true;
            user.otpCode = null;
            user.otpExpireAt = null;

            return await user.save();

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error verifying OTP');
        }
    }

    // 3. Get Registered User..
    async userLogin(identity:string, password: string, res: Response){
        const user = await this.authModel.findOne({$or:[{email: identity}, {phoneNumber: identity}]});

        if(!user || !user.isVerified) { 
            throw new UnauthorizedException('Invalid Credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 3. Create payload for JWT
        const payload = { 
            sub: user._id, 
            username: user.username,
            email: user.email 
        };

        const jwt = await this.jwtService.signAsync(payload);

        res.cookie('jwt', jwt, {httpOnly:true})
        // 4. Sign token and omit sensitive fields from response
        const { password: _, otpCode: __, otpExpireAt: ___, ...userData } = user.toObject();

        return{
            message: 'Successfully Logged In',
            jwt,
            user: userData
        }
    }

    // 4. LogOut request..
    async logOut(response: Response){
        response.clearCookie('JSON_WT', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return{
            message: 'Logout successfully'
        }
    }
    
    // 4. Fetch the user by id..
    async getRegistered(request: any){
        // 1. Extract the user identity set by JwtStrategy
        const authUserID = request?.userId || request?.sub;

        if (!authUserID) {
            throw new ForbiddenException('User identity missing in request payload');
        }

        // 3. Query Mongoose database safely
        try {
            const user = await this.authModel.findById(authUserID);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // 4. Omit sensitive internal fields before sending the response
            const { password, otpCode, otpExpireAt, ...userData } = user.toObject();
            return userData;

        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new NotFoundException('Invalid User ID format');
        }
    }

    // 5. Fetch All user..
    async getAllData(){
        return await this.authModel.find();
    }

    async getRegisteredUser(id: string, userRequest: any) {
        // 1. Extract the user identity set by JwtStrategy
        const authUserID = userRequest?.userId || userRequest?.sub;

        if (!authUserID) {
            throw new ForbiddenException('User identity missing in request payload');
        }else{

            try{
                const user = await this.authModel.findById(id);
                if (!user) {
                    throw new NotFoundException('User not found');
                }

                // 4. Omit sensitive internal fields before sending the response
                const { password, otpCode, otpExpireAt, phoneNumber, isVerified, email, __v, _id, ...userData } = user.toObject();
                return userData;

            }catch(error){
                if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                    throw error;
                }
                throw new NotFoundException('Invalid User ID format');
            }
        }
    }

    // 6. Update the Profile image...
    async uploadImage(userId: string, imagePath: string){
        const updateAvatar = this.authModel.findByIdAndUpdate( 
            userId, 
            { avatarUrl:imagePath },
            { returnDocument: 'after' }
        ).exec();

        if(!updateAvatar){
            throw new NotFoundException('User not found');
        }

        return updateAvatar;
    }
}
