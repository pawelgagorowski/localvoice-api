import { ZodError } from 'zod';
import {
  ErrorMessage,
  errorResponse,
  LambdaResponse,
  response,
  ResponseStatusCode,
  responseString,
} from '../../../shared';

export const handler = async (event: any): Promise<LambdaResponse> => {
  try {
    const VERIFY_TOKEN = 'dupa';

    // Parse the query params
    const mode = event.multiValueQueryStringParameters['hub.mode'][0];
    const token = event.multiValueQueryStringParameters['hub.verify_token'][0];
    const challenge = event.multiValueQueryStringParameters['hub.challenge'][0];

    // Checks if a token and mode is in the query string of the request
    console.log('mode', mode);
    console.log('token', token);
    console.log('VERIFY_TOKEN', VERIFY_TOKEN);
    console.log('challenge', challenge);

    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        return responseString(challenge, ResponseStatusCode.OK);
      }
      // Responds with '403 Forbidden' if verify tokens do not match
      return response({}, ResponseStatusCode.FORBIDDEN);
    }

    return response({}, ResponseStatusCode.FORBIDDEN);
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.issues[0];
      return errorResponse(message, ResponseStatusCode.NOT_FOUND);
    }
    return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);
  }
};
