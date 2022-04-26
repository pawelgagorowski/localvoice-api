import dynamodbHandler from '../../../../shared/dynamodb/wrapper';
import { EndingQuestionResponseFactory, MessengerUser, MessengerUserUpdate } from '../../types';
import { PlatformUserModel } from '../models';
import standardMessages from './standardMessages';

const endingQuestionResponseFactory = ({
  recipientId,
  senderId,
}: {
  recipientId: string;
  senderId: string;
}): EndingQuestionResponseFactory => ({
  'Stop lesson': async () => [
    {
      text: 'w takiem razie dziekuję',
    },
  ],
  'Continue another lesson': async () => [
    {
      text: 'ok zaraz Ci wyślę liste dostępnych lekcji',
    },
  ],
  'Repeat lesson': async () => {
    console.log('Repeat lesson');
    const result = await dynamodbHandler.updateItem<MessengerUserUpdate, MessengerUser>(
      PlatformUserModel,
      {
        pk: 'MESSENGER_USER',
        sk: `RECIPIENT#${recipientId}#SENDER#${senderId}`,
        actualLesson: {
          $set: {
            progress: 0,
          },
        },
      },
      {
        returnValues: 'ALL_NEW',
      }
    );

    console.log('result', result);
    if (!result) return null;
    const { total } = result.actualLesson;

    const { progress } = result.actualLesson;
    if (total <= progress) return [standardMessages.endingQuestion];

    console.log('lesson', result.actualLesson.lesson[progress]);
    const { messages } = result.actualLesson.lesson[progress];
    return messages;
  },
});

export default endingQuestionResponseFactory;
