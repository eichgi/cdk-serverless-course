import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {DynamoDBClient, UpdateItemCommand} from "@aws-sdk/client-dynamodb";

export async function updateSpaces(event: APIGatewayProxyEvent, dynamoClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  if (event.queryStringParameters && ('id' in event.queryStringParameters) && event.body) {
    const parsedBody = JSON.parse(event.body);
    const spaceId = event.queryStringParameters['id'];
    const requestBodyKey = Object.keys(parsedBody)[0];
    const requestBodyValue = parsedBody[requestBodyKey];

    const updateResult = await dynamoClient.send(new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        'id': {S: spaceId}
      },
      UpdateExpression: 'set #zzzNew = :new',
      ExpressionAttributeValues: {
        ':new': {
          S: requestBodyValue
        }
      },
      ExpressionAttributeNames: {
        '#zzzNew': requestBodyKey
      },
      ReturnValues: 'UPDATED_NEW'
    }));

    return {
      statusCode: 204,
      body: JSON.stringify(updateResult.Attributes),
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify("Please provide the rights args."),
  }

}