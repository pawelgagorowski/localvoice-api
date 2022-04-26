import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export declare type ProjectionAttributeType = {
  [key: string]: string | string[];
};

type FilterExpression = {
  attr?: string;
  size?: string;
  eq?: string | number | boolean | null;
  ne?: string | number | boolean | null;
  lt?: string | number;
  lte?: string | number;
  gt?: string | number;
  gte?: string | number;
  between?: string[] | number[];
  beginsWith?: string;
  in?: any[];
  contains?: string;
  exists?: boolean;
  type?: string;
  or?: boolean;
  negate?: boolean;
  entity?: string;
};

export declare type ProjectionAttributes = string | ProjectionAttributeType | (string | ProjectionAttributeType)[];
export declare type FilterExpressions = FilterExpression | FilterExpression[] | FilterExpressions[];

export type getOptions = {
  consistent?: boolean;
  capacity?: DocumentClient.ReturnConsumedCapacity;
  attributes?: ProjectionAttributes;
  include?: string[];
  execute?: boolean;
  parse?: boolean;
};

export type queryOptions = {
  index?: string;
  limit?: number;
  reverse?: boolean;
  consistent?: boolean;
  capacity?: DocumentClient.ReturnConsumedCapacity;
  select?: DocumentClient.Select;
  eq?: string | number;
  lt?: string | number;
  lte?: string | number;
  gt?: string | number;
  gte?: string | number;
  between?: [string, string] | [number, number];
  beginsWith?: string;
  filters?: FilterExpressions;
  attributes?: ProjectionAttributes;
  startKey?: {};
  entity?: string;
  execute?: boolean;
  parse?: boolean;
};

export type deleteOptions = {
  conditions?: FilterExpressions;
  capacity?: DocumentClient.ReturnConsumedCapacity;
  metrics?: DocumentClient.ReturnItemCollectionMetrics;
  returnValues?: DocumentClient.ReturnValue;
  include?: string[];
  execute?: boolean;
  parse?: boolean;
};

export type putOptions = {
  conditions?: FilterExpressions;
  capacity?: DocumentClient.ReturnConsumedCapacity;
  metrics?: DocumentClient.ReturnItemCollectionMetrics;
  returnValues?: DocumentClient.ReturnValue;
  include?: string[];
  execute?: boolean;
  parse?: boolean;
};

export type updateOptions = {
  conditions?: FilterExpressions;
  capacity?: DocumentClient.ReturnConsumedCapacity;
  metrics?: DocumentClient.ReturnItemCollectionMetrics;
  returnValues?: DocumentClient.ReturnValue;
  include?: string[];
  execute?: boolean;
  parse?: boolean;
};
