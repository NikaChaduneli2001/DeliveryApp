import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(user: UsersEntity) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sub: user.id,
    };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
