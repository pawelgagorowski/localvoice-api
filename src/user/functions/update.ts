import { ZodError } from 'zod';
import {
  APIGatewayProxyEvent,
  LambdaResponse,
  response,
  errorResponse,
  ErrorMessage,
  ResponseStatusCode,
} from '../../shared';
import { AuthTokenClaimsvalid } from '../../auth/validation';
import { PlatformUser, UserAttributesToUpdate } from '../types';
import { getUserById, update } from '../domain';
import { getUserAttributesToUpdate, userDBAdapter } from '../adapters';

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  try {
    const body: Partial<PlatformUser> = JSON.parse(event.body);

    AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);
    const { userId } = event.requestContext.authorizer.claims;

    const poosibleUserAttributesToUpdate = [
      UserAttributesToUpdate.BUSINESS,
      UserAttributesToUpdate.FIRSTNAME,
      UserAttributesToUpdate.LANGUAGE,
    ];
    const userAttributesToUpdate = getUserAttributesToUpdate(body, poosibleUserAttributesToUpdate);

    const results = await getUserById<PlatformUser>(userDBAdapter, { userId, userAttributesToFetch: [] });
    if (!results || !results.Item) return errorResponse(ErrorMessage.USER_DOES_NOT_EXIST, ResponseStatusCode.NOT_FOUND);

    const updatedUser = await update(userDBAdapter, { userId, userAttributesToUpdate });
    if (updatedUser === null) return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);

    console.log('updatedUser', updatedUser);
    return response('user has been successfully updated', ResponseStatusCode.NO_CONTENT);
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.issues[0];
      return errorResponse(message, ResponseStatusCode.NOT_FOUND);
    }
    return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);
  }
};
