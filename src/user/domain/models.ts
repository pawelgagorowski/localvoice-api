import { Entity } from 'dynamodb-toolbox';
import { PlatformTable } from '../../shared/dynamodb/tables';
import { PlatformUser } from '../types';

export const PlatformUserModel = new Entity<PlatformUser>({
  name: 'Platform_User',
  attributes: {
    id: { partitionKey: true },
    sk: { sortKey: true },
    firstName: { required: true, type: 'string' },
    business: { required: true, type: 'string' },
    email: { required: true, type: 'string' },
    permissions: { type: 'set', setType: 'number' },
    refreshTokens: { type: 'list' },
    status: { type: 'string', required: true },
    password: { type: 'string', required: true },
    language: { type: 'string', required: true },
    added: { type: 'string' },
    updated: { type: 'string' },
  },
  table: PlatformTable,
});
