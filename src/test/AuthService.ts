import {Amplify, Auth} from "aws-amplify";
import {type CognitoUser} from "@aws-amplify/auth";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

const awsRegion = 'us-east-1';

Amplify.configure({
  Auth: {
    region: awsRegion,
    userPoolId: '',
    userPoolWebClientId: '',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    identityPoolId: ''
  }
});

export class AuthService {
  public async login(username: string, password: string) {
    const result = await Auth.signIn(username, password) as CognitoUser;
    return result;
  }

  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_D6InDPp43`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: '',
        logins: {
          [cognitoIdentityPool]: jwtToken,
        }
      })
    });
    const credentials = await cognitoIdentity.config.credentials();

    return credentials;
  }
}