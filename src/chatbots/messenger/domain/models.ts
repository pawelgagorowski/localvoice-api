import { Entity } from 'dynamodb-toolbox';
import { PlatformTable } from '../../../shared/dynamodb/tables';
import { MessengerUser } from '../types';

export const PlatformUserModel = new Entity<MessengerUser>({
  name: 'MessengerUser',
  attributes: {
    pk: { partitionKey: true },
    sk: { sortKey: true },
    business: { required: true, type: 'string' },
    email: { required: true, type: 'string' },
    actualLesson: { type: 'map' },
  },

  table: PlatformTable,
});
