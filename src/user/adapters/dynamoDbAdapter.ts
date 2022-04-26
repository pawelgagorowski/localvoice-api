import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PlatformUserModel } from '../domain/models';
import {
  DBGetResponse,
  PlatformUser,
  UserAttributes,
  UserPermissions,
  UserAttributesToUpdate,
  DBQueryResponse,
} from '../types';
import { DatabasePrimaryKey, EmptyObject } from '../../shared';

export const userDBAdapter = {
  async create({
    email,
    business,
    firstName,
    password,
    permissions,
    language,
  }: {
    email: string;
    business: string;
    firstName: string;
    password: string;
    permissions: UserPermissions[];
    language: string;
  }): Promise<EmptyObject | null> {
    console.log('permissione', permissions);
    const params: PlatformUser = {
      id: DatabasePrimaryKey.PLATFORM_USER,
      sk: uuidv4(),
      business,
      email,
      firstName,
      permissions,
      password: bcrypt.hashSync(password, 8),
      refreshTokens: [],
      language,
      status: 'active',
    };
    try {
      const result = await PlatformUserModel.put(params);
      console.log('result in created user', result);
      return result;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  },

  async update(userId: string, userAttributesToUpdate: Partial<PlatformUser>): Promise<EmptyObject | null> {
    const params: Partial<PlatformUser> = {
      id: DatabasePrimaryKey.PLATFORM_USER,
      sk: userId,
      ...userAttributesToUpdate,
    };

    try {
      const result: any = await PlatformUserModel.update(params);
      console.log('result in updated user', result);
      return result;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  },

  async remove(userId: string): Promise<EmptyObject | null> {
    const params = {
      id: DatabasePrimaryKey.PLATFORM_USER,
      sk: userId,
    };
    try {
      const result = await PlatformUserModel.delete(params);
      return result;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  },

  async getUserById<T>(userId: string, userAttributesToFetch: UserAttributes[] | []): Promise<DBGetResponse<T> | null> {
    const params = {
      id: DatabasePrimaryKey.PLATFORM_USER,
      sk: userId,
    };

    try {
      let result = await PlatformUserModel.get(params, { attributes: userAttributesToFetch });
      console.log('result in getUser', result);
      if (!result.Item) result = null;
      return result;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  },

  async getUserByAttributes<T>(
    email: string,
    userAttributesToFetch: UserAttributes[] | []
  ): Promise<DBQueryResponse<T> | null> {
    console.log('email', email);
    const params = {
      limit: 1,
      filters: [{ attr: UserAttributes.EMAIL, eq: email }],
      attributes: userAttributesToFetch,
    };

    try {
      let result = await PlatformUserModel.query(DatabasePrimaryKey.PLATFORM_USER, params);
      console.log('result in query', result);
      if (result.Items.length === 0) result = null;
      return result;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  },
};

export function getUserAttributesToUpdate(
  value: Partial<PlatformUser>,
  poosibleUserAttributesToUpdate: UserAttributesToUpdate[]
): Partial<PlatformUser> {
  console.log('value', value);
  return Object.keys(value).reduce((acc, it) => {
    if (poosibleUserAttributesToUpdate.indexOf(it as UserAttributesToUpdate) >= 0) {
      acc[it] = value[it as UserAttributesToUpdate];
    }
    return acc;
  }, {} as any);
}
