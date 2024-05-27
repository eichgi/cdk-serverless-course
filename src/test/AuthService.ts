import {Amplify, Auth} from "aws-amplify";
import {type CognitoUser} from "@aws-amplify/auth";

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: '',
    userPoolWebClientId: '',
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
});

export class AuthService {
  public async login(username: string, password: string) {
    const result = await Auth.signIn(username, password) as CognitoUser;
    return result;
  }
}