import { ZodError } from 'zod';
import {
  APIGatewayProxyEvent,
  ErrorMessage,
  errorResponse,
  LambdaResponse,
  response,
  ResponseStatusCode,
} from '../../shared';
import { AuthTokenClaimsvalid } from '../../auth/validation';
import { getUserById } from '../domain';
import { userDBAdapter } from '../adapters';
import { UserAttributes, PlatformUserModelDto } from '../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  try {
    AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);
    const { userId } = event.requestContext.authorizer.claims;

    // eslint-disable-next-line no-undef
    const result = await getUserById<PlatformUserModelDto>(userDBAdapter, {
      userId,
      userAttributesToFetch: [
        UserAttributes.BUSINESS,
        UserAttributes.EMAIL,
        UserAttributes.FIRSTNAME,
        UserAttributes.PERMISSIONS,
        UserAttributes.SK,
        UserAttributes.LANGUAGE,
      ],
    });
    if (result === null) return errorResponse(ErrorMessage.USER_DOES_NOT_EXIST, ResponseStatusCode.NOT_FOUND);

    const user = result.Item;
    console.log('user', user);

    return response(user, ResponseStatusCode.OK);
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.issues[0];
      return errorResponse(message, ResponseStatusCode.NOT_FOUND);
    }
    return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);
  }
};
