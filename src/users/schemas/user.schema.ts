import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus } from 'src/enums/user-status.enum';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;


  @Prop({ required: true, enum: UserStatus, default: UserStatus.PENDING_PAYMENT })
  status: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });


