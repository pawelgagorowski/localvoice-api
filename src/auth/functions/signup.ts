import { ZodError } from 'zod';
import {
  APIGatewayProxyEvent,
  ErrorMessage,
  errorResponse,
  LambdaResponse,
  response,
  ResponseStatusCode,
} from '../../shared';
import { create, getUserByAttributes } from '../../user/domain';
import { userDBAdapter } from '../../user/adapters';
import { PlatformUser, UserPermissions } from '../../user/types';
import { SignUpUserRequest } from '../types';
import { SignUpUserRequestValid } from '../validation';

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  try {
    const body: SignUpUserRequest = JSON.parse(event.body);
    console.log('event', event);

    SignUpUserRequestValid.parse(body);
    const { email, business, firstName, password, language } = body;
    const permissions = [UserPermissions.CHATBOT, UserPermissions.VOICEBOT];

    const result = await getUserByAttributes<PlatformUser>(userDBAdapter, { email, userAttributesToFetch: [] });
    if (result !== null) return errorResponse(ErrorMessage.USER_EXIST, ResponseStatusCode.NOT_FOUND);

    const createdUser = await create(userDBAdapter, { email, business, firstName, permissions, password, language });
    if (createdUser === null) return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);
    return response('user has been successfully registered', ResponseStatusCode.CREATED);
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.issues[0];
      return errorResponse(message, ResponseStatusCode.NOT_FOUND);
    }
    return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);
  }
};
