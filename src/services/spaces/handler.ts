import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {postSpaces} from "./PostSpaces";
import {getSpaces} from "./GetSpaces";
import {updateSpaces} from "./UpdateSpaces";
import {deleteSpaces} from "./DeleteSpaces";
import {JsonError, MissingFieldError} from "../shared/Validator";

const dynamoClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let message: string;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = getSpaces(event, dynamoClient);
        return getResponse;
      case 'POST':
        const postResponse = await postSpaces(event, dynamoClient);
        return postResponse;
      case 'PUT':
        const putResponse = await updateSpaces(event, dynamoClient);
        console.log(putResponse);
        return putResponse;
      case 'DELETE':
        const deleteResponse = await deleteSpaces(event, dynamoClient);
        console.log(deleteResponse);
        return deleteResponse;
      default:
        break;
    }
  } catch (error) {
    console.log(error);

    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: error.message,
      }
    }

    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: error.message
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    }
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  }
  console.log(event);
  return response;
}

export {handler};