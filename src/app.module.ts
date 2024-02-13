import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders } from './database/database.service';
import { UsersModule } from './users/user.module';

@Module({
  imports: [...databaseProviders, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
