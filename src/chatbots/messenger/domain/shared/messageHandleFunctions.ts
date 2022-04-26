/* eslint-disable no-use-before-define */
import { MessengerBody, Messaging, Message, Postback, ResponseList, PostbackPayload } from '../../types';
import standardMessages from './standardMessages';
import postbackResponseFactory from './postback';

export const isDedicatedToPage = (body: MessengerBody): boolean => body.object === 'page';
export const getSenderId = (messaging: Messaging): string => {
  console.log('messaging', messaging);
  return messaging.sender.id;
};

export const getRecipientId = (messaging: Messaging): string => {
  console.log('messaging', messaging);
  return messaging.recipient.id;
};

export const isSimpleMessage = (message: Message | Postback): message is Message =>
  (message as Message).text !== undefined;

export const getResponseFromSimpleText = (text: string): ResponseList => {
  console.log('getAnswerFromSimpleText');
  console.log('text', text);
  // const result = await PlatformUserModel.query('MESSENGER_USER', {
  //   beginsWith: 'RECIPIENT#${recipientId}#SENDER#{senderId}',
  // });

  // console.log('result', result);
  // const [firstItem] = result.Items;
  // const [firstLesson] = firstItem.actualLesson.lesson;
  // const { messages } = firstLesson;

  return [standardMessages.startQuestion];
};

export const getResponseFromPostback = async (
  postback: Postback,
  {
    recipientId,
    senderId,
  }: {
    recipientId: string;
    senderId: string;
  }
): Promise<ResponseList | null> => {
  console.log('handlePostback');
  const payload: PostbackPayload = JSON.parse(postback.payload);
  console.log('payload', payload);
  const getResponseFromSpecificPostback = postbackResponseFactory({ recipientId, senderId });
  const response = await getResponseFromSpecificPostback[payload.postbackType](payload.data, recipientId);
  return response;
};
