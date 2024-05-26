import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {marshall} from "@aws-sdk/util-dynamodb";
import {validateAsSpaceEntry} from "../shared/Validator";
import {createRandomId, parseJSON} from "../shared/Utils";

export async function postSpaces(event: APIGatewayProxyEvent, dynamoClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const randomId = createRandomId();
  const item = parseJSON(event.body);
  item.id = randomId;

  validateAsSpaceEntry(item);

  const result = dynamoClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    /*Item: {
      id: {
        S: randomId
      },
      location: {
        S: item.location
      }
    }*/
    Item: marshall(item),
  }));

  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({id: randomId}),
  }
}