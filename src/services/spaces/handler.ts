import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {postSpaces} from "./PostSpaces";
import {getSpaces} from "./GetSpaces";
import {updateSpaces} from "./UpdateSpaces";
import {deleteSpaces} from "./DeleteSpaces";
import {JsonError, MissingFieldError} from "../shared/Validator";
import {addCorsHeader} from "../shared/Utils";

const dynamoClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case 'GET':
        response = await getSpaces(event, dynamoClient);
        break;
      case 'POST':
        response = await postSpaces(event, dynamoClient);
        break;
      case 'PUT':
        response = await updateSpaces(event, dynamoClient);
        break;
      case 'DELETE':
        response = await deleteSpaces(event, dynamoClient);
        break;
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

  addCorsHeader(response);
  return response;
}

export {handler};