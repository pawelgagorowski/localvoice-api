import { ZodError } from 'zod';
import {
  APIGatewayProxyEvent,
  ErrorMessage,
  errorResponse,
  LambdaResponse,
  response,
  ResponseStatusCode,
} from '../../shared';
import { userDBAdapter } from '../../user/adapters';
import { getUserById } from '../../user/domain';
import { UserAttributes } from '../../user/types';
import { JWTSessionAdapter } from '../adapters';
import { checkRefreshToken, createAccessToken } from '../domain';
import { RefreshToken, RefreshTokenRequest } from '../types';
import { RefreshTokenRequestValid } from '../validation';

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  try {
    const body: RefreshTokenRequest = JSON.parse(event.body);
    console.log('event', event);

    RefreshTokenRequestValid.parse(body);
    const { refreshToken: refreshTokenId, userId } = body;

    const user = await getUserById<{ refreshTokens: RefreshToken[]; business: string; email: string }>(userDBAdapter, {
      userId,
      userAttributesToFetch: [UserAttributes.REFRESH_TOKENS, UserAttributes.BUSINESS, UserAttributes.EMAIL],
    });
    if (user === null) return errorResponse(ErrorMessage.USER_DOES_NOT_EXIST, ResponseStatusCode.NOT_FOUND);

    const { refreshTokens } = user.Item;
    const boolean = checkRefreshToken(JWTSessionAdapter, refreshTokenId, refreshTokens);
    if (!boolean) errorResponse(ErrorMessage.REFREST_TOKEN_NOT_VALID, ResponseStatusCode.NOT_FOUND);

    const { business } = user.Item;
    const { email } = user.Item;
    const accessToken = createAccessToken(JWTSessionAdapter, { business, email, userId });
    const backendEnvironment = process.env.NODE_ENV;

    return response(
      { accessToken, refreshToken: refreshTokenId, userId, backendEnvironment },
      ResponseStatusCode.CREATED
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.issues[0];
      return errorResponse(message, ResponseStatusCode.NOT_FOUND);
    }
    return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);
  }
};
