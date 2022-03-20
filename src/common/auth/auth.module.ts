import { Module } from '@nestjs/common';
import { AuthConfig } from '../../config/auth.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [AuthService, AuthConfig],
  controllers: [AuthController],
})
export class AuthModule {}
