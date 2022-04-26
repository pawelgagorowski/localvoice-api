import { ErrorMessage, LambdaResponse, ResponseStatusCode } from './types';

export function response(message: any, statusCode: ResponseStatusCode): LambdaResponse {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode,
    body: JSON.stringify({ message }),
  };
}

export function responseString(message: string, statusCode: ResponseStatusCode): LambdaResponse {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode,
    body: message,
  };
}

export function errorResponse(errorMessage: ErrorMessage | string, statusCode: ResponseStatusCode): LambdaResponse {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode,
    body: JSON.stringify({ errorMessage }),
  };
}
