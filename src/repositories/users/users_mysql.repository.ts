import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUserDto } from 'src/dto/register-users.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import {
  createUserInterface,
  UsersInterface,
} from 'src/interface/users-interface';

@Injectable()
export class UsersMysqlService {
  private readonly logger = new Logger(UsersMysqlService.name);
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async registerUser(data: registerUserDto): Promise<UsersInterface> {
    this.logger.log(`registering user data :${JSON.stringify(data)}`);
    const salt = await bcrypt.genSalt();
    const newUser = new UsersEntity();
    newUser.email = data.email;
    newUser.hash = await bcrypt.hash(data.password, salt);
    newUser.address = data.address;
    newUser.fullName = data.fullName;
    newUser.phoneNumber = data.phoneNumber;
    newUser.role = data.role;
    newUser.isDeleted = false;
    const user = await this.usersRepository.save(newUser);
    return createUserInterface(user);
  }
  async getAllUsers(data: getAllUsersDto) {
    this.logger.log(`get all users data: ${JSON.stringify(data)}`);
    const query = await this.usersRepository.createQueryBuilder();
    query.where('isDeleted=false');
    if (data.searchBy) {
      if (data.searchBy.fullName) {
        query.andWhere('fullName like :UsersFullName', {
          UsersFullName: `%${this.escapeLikeString(data.searchBy.fullName)}%`,
        });
      } else if (data.searchBy.email) {
        query.andWhere('email like :UsersEmail', {
          UsersEmail: `%${data.searchBy.email}%`,
        });
      } else if (data.searchBy.role) {
        query.andWhere('role like :UsersRole', {
          UsersRole: `%${this.escapeLikeString(data.searchBy.role)}%`,
        });
      }
    }

    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    let limit = 0;
    if (data.limit) {
      Math.min(data.limit, 25);
    }
    query.limit(data.limit);
    if (data.page) {
      const page = data.page - 1;
      query.offset(page * limit);
    }
    const result = await query.getMany();
    this.logger.log(`find all user:${JSON.stringify(result)}`);
    if (result) {
      return result.map((user) => createUserInterface(user));
    } else {
      this.logger.error(
        `users not found with given params:${JSON.stringify(data)}`,
      );
      return null;
    }
  }
  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }
  async getOneUser(id: number): Promise<UsersInterface> {
    this.logger.log(`getOne user id:${JSON.stringify(id)}`);
    const getOneUser = await this.usersRepository.findOne(id);
    this.logger.log(`find users with id: ${JSON.stringify(getOneUser)}`);
    if (!getOneUser) {
      this.logger.error(`could not find user`);
      return undefined;
    } else {
      return createUserInterface(getOneUser);
    }
  }

  async deleteUser(id: number): Promise<UsersInterface> {
    this.logger.log(`delete users id:${JSON.stringify(id)}`);
    const deleteUser = await this.usersRepository.save({ id, isDeleted: true });
    this.logger.log(`deleted user ${JSON.stringify(deleteUser)}`);
    if (!deleteUser) {
      this.logger.error(
        `could not deleted user wih given id: ${JSON.stringify(id)}`,
      );
      return null;
    }
    const findUser = await this.usersRepository.findOne(id);
    this.logger.log(`find deleted user: ${JSON.stringify(findUser)}`);
    if (findUser) {
      return createUserInterface(findUser);
    } else {
      return null;
    }
  }

  async updateUser(id: number, user: UsersInterface): Promise<UsersInterface> {
    this.logger.log(
      `updating users id:${JSON.stringify(id)} and interface : ${JSON.stringify(
        user,
      )}`,
    );
    const updated = await this.usersRepository.save({ id, user });
    this.logger.log(`updated user : ${JSON.stringify(updated)}`);
    if (!updated) {
      this.logger.error(`could not udated user`);
      return null;
    }
    const findUpdatedUser = await this.usersRepository.findOne(id);
    this.logger.log(`find updated user : ${JSON.stringify(findUpdatedUser)}`);
    if (!findUpdatedUser) {
      return null;
    }
    return createUserInterface(findUpdatedUser);
  }

  async findUserByEmailAndPassword(email: string, password: string) {
    this.logger.log(
      `check user by email and password:${JSON.stringify(
        email,
      )}and${JSON.stringify(password)}`,
    );
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    this.logger.log(`found user by email and password:${JSON.stringify(user)}`);
    if (!user) {
      this.logger.error(
        `user not found with email${JSON.stringify(
          email,
        )} and password${JSON.stringify(password)},user: ${JSON.stringify(
          user,
        )}`,
      );
      return null;
    }
    const isPasswordCorect = bcrypt.compare(password, user.hash);
    this.logger.log(`password is corect:${JSON.stringify(isPasswordCorect)}`);
    if (!isPasswordCorect) {
      this.logger.error(
        `password is not corect:${JSON.stringify(isPasswordCorect)}`,
      );
      return null;
    } else {
      return user;
    }
  }
}
