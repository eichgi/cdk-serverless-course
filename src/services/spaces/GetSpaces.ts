import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {DynamoDBClient, GetItemCommand, ScanCommand} from "@aws-sdk/client-dynamodb";
import {unmarshall} from "@aws-sdk/util-dynamodb";

export async function getSpaces(event: APIGatewayProxyEvent, dynamoClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  if (event.queryStringParameters) {
    if ('id' in event.queryStringParameters) {
      const spaceId = event.queryStringParameters['id'];
      const getItemResponse = await dynamoClient.send(new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          'id': {S: spaceId}
        }
      }));

      if (getItemResponse.Item) {
        const unmarshalled = unmarshall(getItemResponse.Item);
        console.log(unmarshalled);
        return {
          statusCode: 200,
          body: JSON.stringify(unmarshalled),
        }
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify('Space ID not found!')
        }
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify('ID required!')
      }
    }
  }

  const result = await dynamoClient.send(new ScanCommand({
    TableName: process.env.TABLE_NAME
  }));

  const unmarshalledItems = result.Items?.map(item => unmarshall(item));
  console.log(unmarshalledItems);

  return {
    statusCode: 201,
    body: JSON.stringify(unmarshalledItems),
  }
}