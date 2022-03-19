import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as CognitoExpress from 'cognito-express';
import { AuthConfig } from '../../config/auth.config';

@Injectable()
export class AuthJWT {
  constructor(
    @Inject(forwardRef(() => AuthConfig))
    private readonly authConfig: AuthConfig,
  ) {}
  use(req, res, next) {
    const cognitoExpress = new CognitoExpress({
      region: this.authConfig.region,
      cognitoUserPoolId: this.authConfig.userPoolId,
      tokenUse: 'access',
    });
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      const token = req.headers.authorization.split(' ')[1];
      cognitoExpress.validate(token, function (err) {
        if (err) {
          res.status(401).send(err);
        } else {
          next();
        }
      });
    } else {
      res.status(401).send('No token provided.');
    }
  }
}
