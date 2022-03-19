import { AuthConfig } from '../../config/auth.config';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthCredentialsDto, AuthRegisterDto } from '../../interfaces/auth';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    @Inject(forwardRef(() => AuthConfig))
    private readonly authConfig: AuthConfig,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async register(authRegisterRequest: AuthRegisterDto) {
    const { name, email, password } = authRegisterRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        name,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
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
