import { Inject, Injectable } from '@nestjs/common';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
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

  confirmUser(confirm: { email: string; code: string }) {
    const { email, code } = confirm;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  authenticateUser(user: { email: string; password: string }) {
    const { email, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return cognitoUser.authenticateUser(authenticationDetails, {
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
