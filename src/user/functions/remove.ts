import {
  APIGatewayProxyEvent,
  ErrorMessage,
  errorResponse,
  LambdaResponse,
  response,
  ResponseStatusCode,
} from '../../shared';
import { remove } from '../domain';
import { userDBAdapter } from '../adapters';
import { AuthTokenClaimsvalid } from '../../auth/validation';

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);
  const { userId } = event.requestContext.authorizer.claims;

  const result = await remove(userDBAdapter, userId);
  if (result === null) return errorResponse(ErrorMessage.USER_DOES_NOT_EXIST, ResponseStatusCode.NOT_FOUND);
  return response('user has been successfully removed', ResponseStatusCode.NO_CONTENT);
};
