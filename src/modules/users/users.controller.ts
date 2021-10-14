import {
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Delete } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import { registerUserDto } from 'src/dto/register-users.dto';
import { Role } from 'src/enums/role.enum';
import { UsersInterface } from 'src/interface/users-interface';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async registerUser(@Body() data: registerUserDto) {
    this.logger.log(`register user data: ${JSON.stringify(data)}`);
    try {
      const result = await this.usersService.register(data);
      this.logger.log(`registered user: ${JSON.stringify(result)}`);
      if (!result) {
        this.logger.error(`could not registered user`);
        return getErrorMessage('could not register user');
      }
      return getSuccessMessage(result);
    } catch (err) {
      this.logger.error(
        `could not register user with given params , data: ${JSON.stringify(
          data,
        )} error : ${JSON.stringify(err)}`,
      );
      return getErrorMessage('Could not register user with given params');
    }
  }
  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getAllUsers(@Query() data: getAllUsersDto) {
    try {
      const user = await this.usersService.getAllUsers(data);
      this.logger.log(`get all users: ${JSON.stringify(user)}`);
      if (!user) {
        this.logger.error(`could not find user with given params`);
        return getErrorMessage('Could not find all users');
      }
      return getSuccessMessage(user);
    } catch (err) {
      this.logger.error(
        `could not find user with given params : ${JSON.stringify(err)}`,
      );
      return getErrorMessage('Could not find all users with given params');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getOneUser(@Param('id') id: number) {
    this.logger.log(`find one users id: ${JSON.stringify(id)}`);
    try {
      const findUser = await this.usersService.getOneUser(id);
      this.logger.log(`find user : ${JSON.stringify(findUser)}`);
      if (!findUser) {
        this.logger.error(`could not found user`);
        return getErrorMessage('Could not find user');
      }
      return getSuccessMessage(findUser);
    } catch (err) {
      this.logger.error(
        `could not found user with given id: ${JSON.stringify(
          id,
        )}, error: ${JSON.stringify(err)}`,
      );
      return getErrorMessage('Could not find user with given params');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async delete(@Req() req) {
    this.logger.log(`deleting users req : ${JSON.stringify(req)}`);
    try {
      const { user } = req;
      const deleted = await this.usersService.deletedUser(user.userId);
      this.logger.log(`deleted users: ${JSON.stringify(deleted)}`);
      if (!deleted) {
        this.logger.error(`could not deleted user`);
        return getErrorMessage('Could not delete user');
      }
      return getSuccessMessage(deleted);
    } catch (err) {
      this.logger.error(
        `could not deleted user with given params req: ${JSON.stringify(
          req,
        )}, error : ${JSON.stringify(err)}`,
      );
      return getErrorMessage('Could not delete user with given params');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async updateUser(@Req() req, @Body() users: UsersInterface) {
    this.logger.log(
      `updating user req : ${JSON.stringify(
        req,
      )}, interfaces : ${JSON.stringify(users)}`,
    );
    try {
      const { user } = req;
      const updated = await this.usersService.updatedUser(user.userId, users);
      this.logger.log(`updated user : ${JSON.stringify(updated)}`);
      if (!updated) {
        this.logger.error(`could not updated user`);
        return getErrorMessage('Could not update user');
      }
      return getSuccessMessage(updated);
    } catch (err) {
      this.logger.error(
        `could not updated user with given params req: ${JSON.stringify(
          req,
        )}, error: ${JSON.stringify(err)}`,
      );
      return getErrorMessage('Could not update user with given params');
    }
  }
}
