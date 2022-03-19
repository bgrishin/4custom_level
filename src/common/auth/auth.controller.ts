import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthRegisterDto } from '../../interfaces/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() AuthRegisterDto: AuthRegisterDto) {
    if (
      AuthRegisterDto.password.length < 8 ||
      !/[a-z]/.test(AuthRegisterDto.password) ||
      !/[A-Z]/.test(AuthRegisterDto.password) ||
      !/[0-9]/.test(AuthRegisterDto.password)
    ) {
      throw new BadRequestException('Password requirements not met.');
    }
    try {
      return await this.authService.register(AuthRegisterDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('authenticate')
  async authenticate(@Body() authenticateRequest: AuthCredentialsDto) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('verify')
  async verify(@Body() data) {
    try {
      return await this.authService.verify(data.name, data.code);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
