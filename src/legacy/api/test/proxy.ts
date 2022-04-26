import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse, response } from '../../shared';

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  return response({errorMessage: "hello from lambda"}, 200);
};