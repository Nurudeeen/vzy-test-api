import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/schemas/user.schema';
import { databaseProviders } from './database/database.service';

@Module({
  imports: [...databaseProviders,
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
