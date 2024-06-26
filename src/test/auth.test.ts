import {AuthService} from "./AuthService";
import {ListBucketsCommand, S3Client} from "@aws-sdk/client-s3";

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login('chatoso', 'P4ssw0rd.');
  console.log(loginResult.getSignInUserSession().getIdToken().getJwtToken());
  const credentials = await service.generateTemporaryCredentials(loginResult);
  console.log(credentials);
  const buckets = await listBuckets(credentials);
  console.log(buckets);
}

async function listBuckets(credentials: any) {
  //If not specified will use the cli credentials
  const client = new S3Client({
    credentials: credentials,
  });

  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth();