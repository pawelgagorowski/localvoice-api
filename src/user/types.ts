/* eslint-disable no-shadow */
import AWS from 'aws-sdk';
import { RefreshToken } from '../auth/types';
import { EmptyObject } from '../shared';

export enum UserPermissions {
  VOICEBOT = 1,
  CHATBOT,
}

export type PlatformUserModelDto = {
  sk: string;
  email: string;
  firstName: string;
  business: string;
  permissions: UserPermissions[];
  language: string;
};

export type DBGetResponse<T> = {
  Item: T;
} & AWS.DynamoDB.DocumentClient.GetItemOutput;

export type DBQueryResponse<T> = {
  Items: T[];
} & AWS.DynamoDB.DocumentClient.QueryOutput;

export type Status = 'active' | 'inactive';

export type UserPrimaryKey = {
  business: string;
  email: string;
};

export enum UserAttributes {
  BUSINESS = 'business',
  EMAIL = 'email',
  FIRSTNAME = 'firstName',
  PASSWORD = 'password',
  LANGUAGE = 'language',
  PERMISSIONS = 'permissions',
  SK = 'sk',
  REFRESH_TOKENS = 'refreshTokens',
}

export enum UserAttributesToUpdate {
  BUSINESS = 'business',
  FIRSTNAME = 'firstName',
  PASSWORD = 'password',
  LANGUAGE = 'language',
}

export type PlatformUser = {
  id: string;
  sk: string;
  firstName: string;
  business: string;
  email: string;
  permissions: UserPermissions[];
  language: string;
  password: string;
  status: Status;
  refreshTokens: { [key: string]: { refreshToken: RefreshToken }[] } | [];
};

export type DBAdapter = {
  getUserById<T>(userId: string, userAttributesToFetch: UserAttributes[] | []): Promise<DBGetResponse<T> | null>;
  getUserByAttributes<T>(
    email: string,
    userAttributesToFetch: UserAttributes[] | []
  ): Promise<DBQueryResponse<T> | null>;
  create(user: Partial<PlatformUser>): Promise<EmptyObject | null>;
  update(userId: string, userAttributesToUpdate: Partial<PlatformUser>): Promise<EmptyObject | null>;
  remove(userId: string): Promise<EmptyObject | null>;
};
