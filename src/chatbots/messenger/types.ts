import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Entity } from 'dynamodb-toolbox';
import { getOptions, updateOptions } from '../../shared/dynamodb/types';

/* eslint-disable no-use-before-define */
export type Postback = {
  title: string;
  payload: string;
  mid: string;
};

export type Message = {
  mid: string;
  text: string;
};

export type Messaging = {
  sender: {
    id: string;
  };
  recipient: {
    id: string;
  };
  timestamp: number;
  message?: Message;
  postback?: Postback;
};

export type Entry = {
  id: string;
  time: number;
  messaging: Messaging[];
};

export type MessengerBody = {
  object: string;
  entry: Entry[];
};

export type GenericTemplatePayloadButton = {
  type: string;
  title: string;
  payload: string;
};

export type GenericTemplatePayloadElement = {
  title: string;
  buttons: GenericTemplatePayloadButton[];
  subtitle: string;
};

export type GenericTemplatePayload = {
  template_type: string;
  elements: GenericTemplatePayloadElement[];
};

export type GenericTemplate = {
  attachment: {
    type: string;
    payload: GenericTemplatePayload;
  };
};

export type ResponseList = (GenericTemplate | { text: string })[];

export type SimpeTextMessage = {
  text: string;
};

export type MessengerLesson = {
  badResponseMessages: SimpeTextMessage[];
  messages: ResponseList;
};

export type MessengerActualLesson = {
  lesson: MessengerLesson[];
  progress: number;
  total: number;
};

export type MessengerUser = {
  pk: string;
  sk: string;
  firstName: string;
  business: string;
  email: string;
  actualLesson: MessengerActualLesson;
};

export type ActualLesson = {
  lesson: MessengerLesson[];
  progress: number;
};

// export type progress = {
//   $add: number;
// };

export type MessengerUserUpdate = {
  pk: string;
  sk: string;
  firstName: string;
  business: string;
  email: string;
  actualLesson: {
    $set?: {
      [K in keyof ActualLesson]?: ActualLesson[K] | { $add: number };
    };
  };
};

export type StartingQuestionResponseFactory = {
  ['Stop lesson']: () => Promise<ResponseList>;
  ['Continue lesson']: () => Promise<ResponseList | null>;
  ['Continue another lesson']: () => Promise<ResponseList | null>;
};

export type StartingQuestionResponse = keyof StartingQuestionResponseFactory;

export type PostbackType = {
  text: keyof PostbackResponseFactory;
};

export type EndingQuestionResponseFactory = {
  ['Stop lesson']: () => Promise<ResponseList>;
  ['Repeat lesson']: () => Promise<ResponseList | null>;
  ['Continue another lesson']: () => Promise<ResponseList | null>;
};

export type EndingQuestionResponse = keyof EndingQuestionResponseFactory;

export type PostbackPayloadData = {
  isGoodAnswer?: boolean;
  startingQuestionResponse?: StartingQuestionResponse;
  endingQuestionResponse?: EndingQuestionResponse;
};

export type PostbackPayload = {
  postbackType: keyof PostbackResponseFactory;
  data: PostbackPayloadData;
};

export type PostbackResponseFactory = {
  startingQuestion: (payloadData: PostbackPayloadData, recipientId: string) => Promise<ResponseList | null>;
  learningQuestion: (payloadData: PostbackPayloadData, recipientId: string) => Promise<ResponseList | null>;
  endingQuestion: (payloadData: PostbackPayloadData, recipientId: string) => Promise<ResponseList | null>;
};

export type DBAdapter = {
  getItem: <T extends { [key: string]: any }>({
    entity,
    key,
    options,
    params,
  }: {
    entity: Entity<any>;
    key: Partial<T>;
    options?: getOptions;
    params?: Partial<DocumentClient.GetItemInput>;
  }) => Promise<T | null>;
  updateItem: <T, K extends { [key: string]: any }>({
    entity,
    item,
    options,
    params,
  }: {
    entity: Entity<any>;
    item: Partial<T>;
    options?: updateOptions;
    params?: Partial<DocumentClient.UpdateItemInput>;
  }) => Promise<K | null>;
};
