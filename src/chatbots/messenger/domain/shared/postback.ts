import dynamoDbAdapter from '../../adapters/dynamoDbAdapter';
import { MessengerUser, MessengerUserUpdate, PostbackResponseFactory } from '../../types';
import { PlatformUserModel } from '../models';
import { getItem, updateItem } from '../ports';
import endingQuestionResponseFactory from './endingQuestion';
import standardMessages from './standardMessages';
import { startingQuestionResponseFactory } from './startingQuestion';

export const postbackResponseFactory = ({
  recipientId,
  senderId,
}: {
  recipientId: string;
  senderId: string;
}): PostbackResponseFactory => ({
  startingQuestion: async (payloadData) => {
    console.log('payloadData', payloadData);
    if (payloadData.startingQuestionResponse) {
      const startingQuestionResponse = startingQuestionResponseFactory({ recipientId, senderId });
      const response = await startingQuestionResponse[payloadData.startingQuestionResponse]();
      console.log('response', response);
      return response;
    }
    return null;
  },
  learningQuestion: async (payloadData) => {
    console.log('learningQuestion');
    const { isGoodAnswer } = payloadData;

    console.log('isGoodAnswer', isGoodAnswer);
    if (isGoodAnswer) {
      const result = await updateItem<MessengerUserUpdate, MessengerUser>(dynamoDbAdapter, {
        entity: PlatformUserModel,
        item: {
          pk: 'MESSENGER_USER',
          sk: `RECIPIENT#${recipientId}#SENDER#${senderId}`,
          actualLesson: {
            $set: {
              progress: { $add: 1 },
            },
          },
        },
        options: {
          returnValues: 'ALL_NEW',
        },
      });

      console.log('result', result);
      if (!result) return null;
      const { total } = result.actualLesson;

      const { progress } = result.actualLesson;
      if (total <= progress) return [standardMessages.endingQuestion];

      console.log('lesson', result.actualLesson.lesson[progress]);
      const { messages } = result.actualLesson.lesson[progress];
      return messages;
    }

    const result = await getItem<MessengerUser>(dynamoDbAdapter, {
      entity: PlatformUserModel,
      key: {
        pk: 'MESSENGER_USER',
        sk: `RECIPIENT#${recipientId}#SENDER#${senderId}`,
      },
    });
    if (!result) return null;
    const { progress } = result.actualLesson;

    console.log('lesson', result.actualLesson.lesson[progress]);
    const { messages } = result.actualLesson.lesson[progress];
    const badAnswerResponse = result.actualLesson.lesson[progress].badResponseMessages[0];
    return [badAnswerResponse, ...messages];
  },
  endingQuestion: async (payloadData) => {
    console.log('payloadData', payloadData);
    console.log('payloadData.endingQuestionResponse', payloadData.endingQuestionResponse);
    if (payloadData.endingQuestionResponse) {
      const endingQuestionAction = endingQuestionResponseFactory({ recipientId, senderId });
      const response = await endingQuestionAction[payloadData.endingQuestionResponse]();
      console.log('response', response);
      return response;
    }
    return null;
  },
});

export default postbackResponseFactory;
