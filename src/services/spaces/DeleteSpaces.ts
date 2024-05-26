import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {
  DeleteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

export async function deleteSpaces(event: APIGatewayProxyEvent, dynamoClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

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