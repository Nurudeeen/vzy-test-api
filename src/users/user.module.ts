import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),JwtModule.register({
        secret: process.env.JWT_SECRET
      }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}