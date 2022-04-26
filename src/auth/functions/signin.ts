import { ZodError } from 'zod';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrorMessage, errorResponse, LambdaResponse, response, ResponseStatusCode } from '../../shared';
import { userDBAdapter } from '../../user/adapters';
import { getUserByAttributes } from '../../user/domain';
import { UserAttributes } from '../../user/types';
import { checkPassword, createAccessToken, createRefreshToken, addRefreshToken } from '../domain/ports';
import { JWTSessionAdapter } from '../adapters';
import { SignInUserRequest } from '../types';
import { SignInUserRequestValid } from '../validation';

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  try {
    const body: SignInUserRequest = JSON.parse(event.body!);
    console.log('event', event);

    SignInUserRequestValid.parse(body);
    const { email, password } = body;

    const result = await getUserByAttributes<{ password: string; sk: string; business: string }>(userDBAdapter, {
      email,
      userAttributesToFetch: [
        UserAttributes.PASSWORD,
        UserAttributes.SK,
        UserAttributes.EMAIL,
        UserAttributes.BUSINESS,
      ],
    });
    if (result === null) return errorResponse(ErrorMessage.USER_DOES_NOT_EXIST, ResponseStatusCode.NOT_FOUND);

    const user = result.Items[0];
    const isPasswordValid = checkPassword(JWTSessionAdapter, password, user.password);
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) return errorResponse(ErrorMessage.WRONG_PASSWORD, ResponseStatusCode.NOT_FOUND);

    const userId = user.sk;
    const { business } = user;

    const accessToken = createAccessToken(JWTSessionAdapter, { business, email, userId });
    const refreshToken = createRefreshToken(JWTSessionAdapter, user.sk);

    const refreshTokenResult = await addRefreshToken(JWTSessionAdapter, user.sk, refreshToken);
    if (refreshTokenResult === null) return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);
    const backendEnvironment = process.env.NODE_ENV;

    const { refreshTokenId } = refreshToken;
    return response({ accessToken, refreshToken: refreshTokenId, backendEnvironment, userId }, ResponseStatusCode.OK);
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.issues[0];
      return errorResponse(message, ResponseStatusCode.NOT_FOUND);
    }
    return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);
  }
};
