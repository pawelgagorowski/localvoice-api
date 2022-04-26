/* eslint-disable no-shadow */
import {
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda';

export type UserAttributes = 'custom:business' | 'email';
export type Attributes = { [P in UserAttributes]?: string | undefined } | null;

type HeaderOption = {
  'Access-Control-Allow-Origin': string;
};

export type Claims = {
  email: string;
  business: string;
  userId: string;
};

export type Authorizer = {
  authorizer: {
    principalId: string;
    claims: Claims;
  };
};

export type LambdaResponse = {
  headers: HeaderOption;
  statusCode: number;
  body: string;
};

export enum DatabasePrimaryKey {
  PLATFORM_USER = 'PLATFORM_USER',
  PLATFORM_MESSENGER = 'PLATFORM_MESSENGER',
  MESSENGER_USER = 'MESSENGER_USER',
}

export enum ResponseStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}

export enum ErrorMessage {
  USER_EXIST = 'user already exist',
  USER_DOES_NOT_EXIST = 'user does not exist',
  ERROR_OCCURED = 'error occured',
  WRONG_PASSWORD = 'wrong password',
  REFREST_TOKEN_NOT_VALID = 'refresh token is not valid',
}

export type EmptyObject = {};

export type APIGatewayProxyEvent = {
  body: string;
  headers: APIGatewayProxyEventHeaders;
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: APIGatewayProxyEventPathParameters | null;
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null;
  requestContext: Authorizer;
};

export type CourseStatus = 'production' | 'test' | 'saved';
