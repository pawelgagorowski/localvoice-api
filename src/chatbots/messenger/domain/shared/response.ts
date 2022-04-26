import request from 'request';
import { ResponseList } from '../../types';

const accessToken =
  'EAATTlRRRDAIBAD8k129jKjoai0aMRgiiC5OtSpVvSxNkVKChZBt2TEmLRzrPWFWziYcQBGK2jUadHyUy0SSBbDcVVvbRjeh3IH2gtPAJJg7ZCqqb9HSF7dw1TQuw1LLjNWosgVj5pPdpZC0k3x0wynVKiE8iYT1P9u0dzFeLAExyr8VOWw2';

export const sendResponse = (senderId: string, response: ResponseList) => {
  response.forEach((message, index) => {
    const messageBody = {
      recipient: {
        id: senderId,
      },
      message,
    };

    console.log('request_body', messageBody);
    setTimeout(() => {
      request(
        {
          uri: 'https://graph.facebook.com/v2.6/me/messages',
          qs: { access_token: accessToken },
          method: 'POST',
          json: messageBody,
        },
        (err, response1) => {
          console.log('response', response1.statusCode);
          if (!err) {
            console.log('message sent!');
          } else {
            console.error(`Unable to send message:${err}`);
          }
        }
      );
    }, index * 3000);
  });
};
