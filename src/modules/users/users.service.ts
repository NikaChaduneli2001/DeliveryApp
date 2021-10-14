import { Injectable } from '@nestjs/common';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import { registerUserDto } from 'src/dto/register-users.dto';
import { UsersInterface } from 'src/interface/users-interface';
import { UsersMysqlService } from 'src/repositories/users/users_mysql.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersMysqlService) {}

  async register(data: registerUserDto) {
    try {
      const user = await this.usersRepo.registerUser(data);
      if (user) {
        return user;
      } else {
        return false;
      }
    } catch {
      return null;
    }
  }

  async getAllUsers(data: getAllUsersDto) {
    try {
      const users = await this.usersRepo.getAllUsers(data);
      if (!users) {
        return false;
      } else {
        return users;
      }
    } catch {
      return null;
    }
  }

  async getOneUser(id: number) {
    try {
      const findUser = await this.usersRepo.getOneUser(id);
      if (!findUser) {
        return false;
      } else {
        return findUser;
      }
    } catch {
      return null;
    }
  }

  async deletedUser(id: number) {
    try {
      const deleted = await this.usersRepo.deleteUser(id);
      if (!deleted) {
        return false;
      }
      return deleted;
    } catch {
      return null;
    }
  }

  async updatedUser(id: number, user: UsersInterface) {
    try {
      const updated = await this.usersRepo.updateUser(id, user);
      if (!updated) {
        return false;
      }
      return updated;
    } catch {
      return null;
    }
  }
  async findUserByEmailAndPassword(email: string, password: string) {
    try {
      const findUser = await this.usersRepo.findUserByEmailAndPassword(
        email,
        password,
      );
      if (!findUser) {
        return false;
      }
      return findUser;
    } catch {
      return null;
    }
  }
}
