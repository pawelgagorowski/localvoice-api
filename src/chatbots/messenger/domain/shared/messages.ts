import { MessengerLesson } from '../../types';

const lessonList: MessengerLesson[] = [
  {
    badResponseMessages: [
      {
        text: 'Niestety ale to jest zła odpowiedź, text 1',
      },
      {
        text: 'Niestety ale to jest zła odpowiedź, text 2',
      },
    ],
    messages: [
      {
        text: 'przede wszystkim musisz wiedzieć jak to się robi',
      },
      {
        text: 'A dopiero teraz możesz możesz przejść do zadań',
      },
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this __ color?',
                subtitle: 'Czy to jest niebieski kolor?',
                buttons: [
                  {
                    type: 'postback',
                    title: 'blue',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: true,
                      },
                    }),
                  },
                  {
                    type: 'postback',
                    title: 'red',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: false,
                      },
                    }),
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    badResponseMessages: [
      {
        text: 'Niestety ale to jest zła odpowiedź, text 1',
      },
      {
        text: 'Niestety ale to jest zła odpowiedź, text 2',
      },
    ],
    messages: [
      {
        text: 'przede wszystkim musisz wiedzieć jak to się robi',
      },
      {
        text: 'A dopiero teraz możesz możesz przejść do zadań',
      },
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this __ color?',
                subtitle: 'Czy to jest niebieski kolor?',
                buttons: [
                  {
                    type: 'postback',
                    title: 'blue',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: true,
                      },
                    }),
                  },
                  {
                    type: 'postback',
                    title: 'red',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: false,
                      },
                    }),
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    badResponseMessages: [
      {
        text: 'Niestety ale to jest zła odpowiedź, text 1',
      },
      {
        text: 'Niestety ale to jest zła odpowiedź, text 2',
      },
    ],
    messages: [
      {
        text: 'przede wszystkim musisz wiedzieć jak to się robi',
      },
      {
        text: 'A dopiero teraz możesz możesz przejść do zadań',
      },
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this __ color?',
                subtitle: 'Czy to jest niebieski kolor?',
                buttons: [
                  {
                    type: 'postback',
                    title: 'blue',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: true,
                      },
                    }),
                  },
                  {
                    type: 'postback',
                    title: 'red',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: false,
                      },
                    }),
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    badResponseMessages: [
      {
        text: 'Niestety ale to jest zła odpowiedź, text 1',
      },
      {
        text: 'Niestety ale to jest zła odpowiedź, text 2',
      },
    ],
    messages: [
      {
        text: 'przede wszystkim musisz wiedzieć jak to się robi',
      },
      {
        text: 'A dopiero teraz możesz możesz przejść do zadań',
      },
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this __ color?',
                subtitle: 'Czy to jest niebieski kolor?',
                buttons: [
                  {
                    type: 'postback',
                    title: 'blue',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: true,
                      },
                    }),
                  },
                  {
                    type: 'postback',
                    title: 'red',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: false,
                      },
                    }),
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    badResponseMessages: [
      {
        text: 'Niestety ale to jest zła odpowiedź, text 1',
      },
      {
        text: 'Niestety ale to jest zła odpowiedź, text 2',
      },
    ],
    messages: [
      {
        text: 'przede wszystkim musisz wiedzieć jak to się robi',
      },
      {
        text: 'A dopiero teraz możesz możesz przejść do zadań',
      },
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this __ color?',
                subtitle: 'Czy to jest niebieski kolor?',
                buttons: [
                  {
                    type: 'postback',
                    title: 'blue',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: true,
                      },
                    }),
                  },
                  {
                    type: 'postback',
                    title: 'red',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: false,
                      },
                    }),
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    badResponseMessages: [
      {
        text: 'Niestety ale to jest zła odpowiedź, text 1',
      },
      {
        text: 'Niestety ale to jest zła odpowiedź, text 2',
      },
    ],
    messages: [
      {
        text: 'przede wszystkim musisz wiedzieć jak to się robi',
      },
      {
        text: 'A dopiero teraz możesz możesz przejść do zadań',
      },
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this __ color?',
                subtitle: 'Czy to jest niebieski kolor?',
                buttons: [
                  {
                    type: 'postback',
                    title: 'blue',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: true,
                      },
                    }),
                  },
                  {
                    type: 'postback',
                    title: 'red',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: false,
                      },
                    }),
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    badResponseMessages: [
      {
        text: 'Niestety ale to jest zła odpowiedź, text 1',
      },
      {
        text: 'Niestety ale to jest zła odpowiedź, text 2',
      },
    ],
    messages: [
      {
        text: 'przede wszystkim musisz wiedzieć jak to się robi',
      },
      {
        text: 'A dopiero teraz możesz możesz przejść do zadań',
      },
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this __ color?',
                subtitle: 'Czy to jest niebieski kolor?',
                buttons: [
                  {
                    type: 'postback',
                    title: 'blue',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: true,
                      },
                    }),
                  },
                  {
                    type: 'postback',
                    title: 'red',
                    payload: JSON.stringify({
                      postbackType: 'learningQuestion',
                      data: {
                        isGoodAnswer: false,
                      },
                    }),
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
];

export default lessonList;
