import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            throw new HttpException('Email already exists', HttpStatus.CONFLICT);
          }
      throw new HttpException('Could not create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new HttpException('Could not find user', HttpStatus.BAD_REQUEST);
    }
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const updateFields = { ...updateUserDto };
    try {
         return this.userModel.findOneAndUpdate({id: userId}, updateFields, { new: true, runValidators: true }).exec();
    } catch (error) {
        throw new HttpException('Could not update user record', HttpStatus.INTERNAL_SERVER_ERROR);
    }
   
  }
}
