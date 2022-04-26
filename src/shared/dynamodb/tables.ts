import { Table } from 'dynamodb-toolbox';
import DynamoDB from 'aws-sdk/clients/dynamodb';

const DocumentClient = new DynamoDB.DocumentClient();

export const PlatformTable = new Table({
  name: 'Localvoice-Table_test',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: {
    'LSI-business': { sortKey: 'business' },
    'LSI-status': { sortKey: 'status' },
  },
  DocumentClient,
});
