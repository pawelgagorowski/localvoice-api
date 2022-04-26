/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
import { ZodError } from 'zod';
import {
  isDedicatedToPage,
  getSenderId,
  getResponseFromSimpleText,
  getResponseFromPostback,
  getRecipientId,
} from '../domain/shared/messageHandleFunctions';
import { MessengerBody, ResponseList } from '../types';
import { APIGatewayProxyEvent } from '../../../shared';
import { sendResponse } from '../domain/shared/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<void> => {
  try {
    const body: MessengerBody = JSON.parse(event.body);
    console.log('body', body);
    const isDedicated = isDedicatedToPage(body);
    if (!isDedicated) return;

    const [firstEntry] = body.entry;
    console.log('firstEntry', firstEntry);
    const [firstMessaging] = firstEntry.messaging;
    const senderId = getSenderId(firstMessaging);
    const recipientId = getRecipientId(firstMessaging);
    console.log('senderId', senderId);

    let responseList: ResponseList | null = [];
    if (firstMessaging.message) {
      responseList = getResponseFromSimpleText(firstMessaging.message.text);
    } else if (firstMessaging.postback) {
      responseList = await getResponseFromPostback(firstMessaging.postback, { recipientId, senderId });
    }
    if (responseList) sendResponse(senderId, responseList);
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.issues[0];
      console.log('error', message);
    }
    console.log('error', error);
  }
};
