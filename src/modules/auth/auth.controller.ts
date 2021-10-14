import { Body, Controller, Logger, Post } from '@nestjs/common';
import { loginDto } from 'src/dto/login.dto';
import { getErrorMessage } from 'src/utils/response-functions.utils';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Post('/login')
  async login(@Body() data: loginDto) {
    try {
      const foundUser = await this.usersService.findUserByEmailAndPassword(
        data.email,
        data.password,
      );
      this.logger.log(`found user ${JSON.stringify(foundUser)}`);
      if (foundUser) {
        const jwtToken = await this.authService.loginUser(foundUser);
        this.logger.log(`users token: ${JSON.stringify(jwtToken)}`);
        return {
          status: 'success',
          data: {
            email: foundUser.email,
            fullName: foundUser.fullName,
            role: foundUser.role,
            jwtToken,
          },
        };
      } else {
        return getErrorMessage('user was not found');
      }
    } catch {
      return getErrorMessage('Password or Email is incorrect');
    }
  }
}
