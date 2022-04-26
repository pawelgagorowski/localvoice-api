import { DBAdapter, PlatformUser, UserAttributes } from '../../types';

export const getUserById = async <T>(
  dbAdapter: DBAdapter,
  { userId, userAttributesToFetch }: { userId: string; userAttributesToFetch: UserAttributes[] | [] }
) => dbAdapter.getUserById<T>(userId, userAttributesToFetch);
export const getUserByAttributes = async <T>(
  dbAdapter: DBAdapter,
  { email, userAttributesToFetch }: { email: string; userAttributesToFetch: UserAttributes[] | [] }
) => dbAdapter.getUserByAttributes<T>(email, userAttributesToFetch);
export const create = async (dbAdapter: DBAdapter, user: Partial<PlatformUser>) => dbAdapter.create(user);
export const update = async (
  dbAdapter: DBAdapter,
  { userId, userAttributesToUpdate }: { userId: string; userAttributesToUpdate: Partial<PlatformUser> }
) => dbAdapter.update(userId, userAttributesToUpdate);
export const remove = async (dbAdapter: DBAdapter, userId: string) => dbAdapter.remove(userId);
