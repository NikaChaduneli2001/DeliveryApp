import { Module } from '@nestjs/common';
import { UsersMysqlModule } from 'src/repositories/users/users_mysql.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UsersMysqlModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, UsersModule],
})
export class UsersModule {}
