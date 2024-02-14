import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User, UserDocument } from './schemas/user.schema';
import Stripe from 'stripe';

@Injectable()
export class UsersService {
  private readonly stripe: Stripe

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      const customerId = await this.customerCreate(createUserDto);
      createdUser.customerId = customerId
      return await createdUser.save();
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            throw new HttpException('Email already exists', HttpStatus.CONFLICT);
          }
          console.log(error)
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

  async findByCustomerId(id: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ customerId: id }).exec();
    } catch (error) {
      throw new HttpException('Could not find user', HttpStatus.BAD_REQUEST);
    }
  }

  async findByUserId(id: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ id }).exec();
    } catch (error) {
      throw new HttpException('Could not find user', HttpStatus.FORBIDDEN);
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

  async customerCreate(createCustomerDto: CreateUserDto): Promise<string> {
  
    const customer = await this.stripe.customers.create({
      email: createCustomerDto.email,
      name: createCustomerDto.firstName
    })

    return customer.id;
}
}
