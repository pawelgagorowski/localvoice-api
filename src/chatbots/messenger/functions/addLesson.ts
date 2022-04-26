/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
import { ZodError } from 'zod';
import { getItem, updateItem } from '../domain/ports';
import dynamoDbAdapter from '../adapters/dynamoDbAdapter';
import dynamodbHandler from '../../../shared/dynamodb/wrapper';
import { APIGatewayProxyEvent, response } from '../../../shared';
import { MessengerUser, MessengerUserUpdate } from '../types';
import { PlatformUserModel } from '../domain/models';
import lesson from '../domain/shared/messages';
import { PlatformTable } from '../../../shared/dynamodb/tables';

export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    // const result = await getItem<MessengerUser>(dynamoDbAdapter, {
    //   entity: PlatformUserModel,
    //   key: {
    //     pk: 'MESSENGER_USER',
    //     sk: 'RECIPIENT#${recipientId}#SENDER#{senderId}',
    //   },
    // });
    // console.log('result', result);

    const result = await updateItem<MessengerUserUpdate, MessengerUser>(dynamoDbAdapter, {
      entity: PlatformUserModel,
      item: {
        pk: 'MESSENGER_USER',
        sk: 'RECIPIENT#${recipientId}#SENDER#{senderId}',
        actualLesson: {
          $set: {
            lesson,
          },
        },
      },
      options: {
        returnValues: 'ALL_NEW',
      },
    });

    console.log('result', result);

    return response(result, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.issues[0];
      console.log('error', message);
    }
    console.log('error', error);
    return response({}, 404);
  }
};
