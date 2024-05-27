import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {
  DeleteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {hasAdminGroup} from "../shared/Utils";

export async function deleteSpaces(event: APIGatewayProxyEvent, dynamoClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  const isAuthorized = hasAdminGroup(event);
  if (!isAuthorized) {
    return {
      statusCode: 401,
      body: JSON.stringify("Unauthorized"),
    }
  }

  if (event.queryStringParameters && ('id' in event.queryStringParameters)) {

    const spaceId = event.queryStringParameters['id'];


    const deleteResult = await dynamoClient.send(new DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        'id': {S: spaceId}
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify("Deleted Space ID"),
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify("Please provide the rights args."),
  }

}