import {AuthService} from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login('chatoso', 'P4ssw0rd.');
  console.log(loginResult.getSignInUserSession().getIdToken().getJwtToken());
}

testAuth();