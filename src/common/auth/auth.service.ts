import { AuthConfig } from '../../config/auth.config';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthCredentialsDto, AuthRegisterDto } from '../../interfaces/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    @Inject(forwardRef(() => AuthConfig))
    private readonly authConfig: AuthConfig,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async register(authRegisterRequest: AuthRegisterDto) {
    const { username, email, password, gender } = authRegisterRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        username,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            this.usersRepository.save({
              username: username,
              gender: gender,
              email: email,
              created_at: new Date(),
              updated_at: new Date(),
            });
            resolve({
              response: result.user,
              info: 'You need to verify your email! Check the email for code.',
            });
          }
        },
      );
    });
  }

  async verify(name, code) {
    const user = new CognitoUser({
      Username: name,
      Pool: this.userPool,
    });

    return new Promise((success, error) => {
      const callback = (err, result) => {
        if (err) {
          error(err);
          return;
        }
        success(result);
      };

      user.confirmRegistration(code, true, callback);
    });
  }

  async authenticateUser(user: AuthCredentialsDto) {
    const { name, password } = user;
    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });
    const userData = {
      Username: name,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
