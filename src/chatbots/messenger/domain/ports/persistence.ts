import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Entity } from 'dynamodb-toolbox';
import { getOptions, updateOptions } from '../../../../shared/dynamodb/types';
import { DBAdapter } from '../../types';

export const getItem = async <T extends { [key: string]: any }>(
  dbAdapter: DBAdapter,
  {
    entity,
    key,
    options,
    params,
  }: {
    entity: Entity<any>;
    key: Partial<T>;
    options?: getOptions;
    params?: Partial<DocumentClient.GetItemInput>;
  }
) => dbAdapter.getItem<T>({ entity, key, options, params });

export const updateItem = async <T, K extends { [key: string]: any }>(
  dbAdapter: DBAdapter,
  {
    entity,
    item,
    options,
    params,
  }: {
    entity: Entity<any>;
    item: Partial<T>;
    options?: updateOptions;
    params?: Partial<DocumentClient.UpdateItemInput>;
  }
) => dbAdapter.updateItem<T, K>({ entity, item, options, params });
