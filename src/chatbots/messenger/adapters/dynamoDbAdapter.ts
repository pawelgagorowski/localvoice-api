import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Entity } from 'dynamodb-toolbox';
import { getOptions, updateOptions } from '../../../shared/dynamodb/types';
import { isAWSErrorMessage } from '../../../shared/dynamodb/wrapper';

const dynamoDbAdapter = {
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
  updateItem: async <T, K extends { [key: string]: any }>({
    entity,
    item,
    options,
    params,
  }: {
    entity: Entity<any>;
    item: Partial<T>;
    options?: updateOptions;
    params?: Partial<DocumentClient.UpdateItemInput>;
  }): Promise<K | null> => {
    const data = (await entity.update(item, options, params)) as
      | AWS.DynamoDB.DocumentClient.UpdateItemOutput
      | AWS.AWSError;
    if (isAWSErrorMessage<AWS.DynamoDB.DocumentClient.UpdateItemOutput>(data)) return null;
    if (!data.Attributes) return null;
    return data.Attributes as K;
  },
  //   putItem: async <T>(
  //     entity: Entity<any>,
  //     item: Partial<T>,
  //     options?: putOptions,
  //     params?: Partial<DocumentClient.PutItemInput>
  //   ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput | null> => {
  //     const data: AWS.DynamoDB.DocumentClient.PutItemOutput | AWS.AWSError = await entity.put(item, options, params);

  //     if (isAWSErrorMessage<AWS.DynamoDB.DocumentClient.PutItemOutput>(data)) return null;
  //     return data;
  //   },
};

export default dynamoDbAdapter;
