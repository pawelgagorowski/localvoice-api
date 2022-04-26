import AWS from 'aws-sdk';
import { Entity } from 'dynamodb-toolbox';
import { AttributeMap, DocumentClient } from 'aws-sdk/clients/dynamodb';
import { deleteOptions, getOptions, putOptions, queryOptions, updateOptions } from './types';

export const isAWSErrorMessage = <T>(toBeDetermined: T | AWS.AWSError): toBeDetermined is AWS.AWSError => {
  if ((toBeDetermined as AWS.AWSError).message) {
    return true;
  }
  return false;
};

const dynamodbHandlerFactory = () => ({
  getItem: async <T extends { [key: string]: any }>({
    entity,
    key,
    options,
    params,
  }: {
    entity: Entity<any>;
    key: Partial<T>;
    options?: getOptions;
    params?: Partial<DocumentClient.GetItemInput>;
  }): Promise<T | null> => {
    try {
      const data: AWS.DynamoDB.DocumentClient.GetItemOutput | AWS.AWSError = await entity.get(key, options, params);
      if (isAWSErrorMessage<AWS.DynamoDB.DocumentClient.GetItemOutput>(data)) return null;
      if (!data.Item) {
        return null;
      }
      return data.Item as T;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  },
  queryItems: async <T extends AttributeMap>({
    entity,
    partitionKey,
    options,
    params,
  }: {
    entity: Entity<any>;
    partitionKey: any;
    options: queryOptions;
    params?: Partial<DocumentClient.QueryInput>;
  }): Promise<T[] | null> => {
    const data: AWS.DynamoDB.DocumentClient.QueryOutput | AWS.AWSError = await entity.query(
      partitionKey,
      options,
      params
    );

    if (isAWSErrorMessage<AWS.DynamoDB.DocumentClient.QueryOutput>(data)) return null;
    if (data.Items && data.Items.length > 0) return data.Items as T[];

    return null;
  },
  deleteItem: async <T>(
    entity: Entity<any>,
    key: Partial<T>,
    options?: deleteOptions,
    params?: Partial<DocumentClient.DeleteItemInput>
  ): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput | null> => {
    const data: AWS.DynamoDB.DocumentClient.DeleteItemOutput | AWS.AWSError = await entity.get(key, options, params);

    if (isAWSErrorMessage<AWS.DynamoDB.DocumentClient.GetItemOutput>(data)) return null;
    return data;
  },
  putItem: async <T>(
    entity: Entity<any>,
    item: Partial<T>,
    options?: putOptions,
    params?: Partial<DocumentClient.PutItemInput>
  ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput | null> => {
    const data: AWS.DynamoDB.DocumentClient.PutItemOutput | AWS.AWSError = await entity.put(item, options, params);

    if (isAWSErrorMessage<AWS.DynamoDB.DocumentClient.PutItemOutput>(data)) return null;
    return data;
  },
  updateItem: async <T, K extends { [key: string]: any }>(
    entity: Entity<any>,
    item: Partial<T>,
    options?: updateOptions,
    params?: Partial<DocumentClient.UpdateItemInput>
  ): Promise<K | null> => {
    const data = (await entity.update(item, options, params)) as
      | AWS.DynamoDB.DocumentClient.UpdateItemOutput
      | AWS.AWSError;
    if (isAWSErrorMessage<AWS.DynamoDB.DocumentClient.UpdateItemOutput>(data)) return null;
    if (!data.Attributes) return null;
    return data.Attributes as K;
  },
});

const dynamodbHandler = dynamodbHandlerFactory();
export default dynamodbHandler;
