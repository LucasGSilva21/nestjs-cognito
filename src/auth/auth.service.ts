import { Inject, Injectable } from '@nestjs/common';
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { AuthConfig } from './auth.config';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(
    @Inject(AuthConfig)
    private readonly authConfig: AuthConfig,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  registerUser(registerRequest: {
    name: string;
    email: string;
    password: string;
  }) {
    const { name, email, password } = registerRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'name', Value: name }),
          new CognitoUserAttribute({ Name: 'email', Value: email }),
        ],
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
}
