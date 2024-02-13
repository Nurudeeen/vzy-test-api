import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { StripeWebhookController } from 'src/stripe/stripe.controller';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),JwtModule.register({
        secret: process.env.JWT_SECRET
      }),
  ],
  controllers: [UsersController, StripeWebhookController],
  providers: [UsersService, StripeService],
})
export class UsersModule {}
