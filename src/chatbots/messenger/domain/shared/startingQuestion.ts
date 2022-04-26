import dynamodbHandler from '../../../../shared/dynamodb/wrapper';
import { MessengerUser, StartingQuestionResponseFactory } from '../../types';
import { PlatformUserModel } from '../models';
import standardMessages from './standardMessages';

export const startingQuestionResponseFactory = ({
  recipientId,
  senderId,
}: {
  recipientId: string;
  senderId: string;
}): StartingQuestionResponseFactory => ({
  'Stop lesson': async () => [
    {
      text: 'w takiem razie dziekuję',
    },
  ],
  'Continue lesson': async () => {
    // const result = await PlatformUserModel.query('MESSENGER_USER', {
    //   beginsWith: 'RECIPIENT#${recipientId}#SENDER#{senderId}',
    // });

    // const result = await PlatformUserModel.get({
    //   pk: 'MESSENGER_USER',
    //   sk: 'RECIPIENT#${recipientId}#SENDER#{senderId}',
    // });

    const result = await dynamodbHandler.getItem<MessengerUser>({
      entity: PlatformUserModel,
      key: {
        pk: 'MESSENGER_USER',
        sk: `RECIPIENT#${recipientId}#SENDER#${senderId}`,
      },
    });

    if (!result) return null;
    const { total } = result.actualLesson;

    const { progress } = result.actualLesson;
    if (total <= progress) return [standardMessages.endingQuestion];

    console.log('result', result);
    const { messages } = result.actualLesson.lesson[progress];
    console.log('messages', messages);
    return messages;
  },
  'Continue another lesson': async () => [
    {
      text: 'ok zaraz Ci wyślę liste dostępnych lekcji',
    },
  ],
});

export default startingQuestionResponseFactory;
