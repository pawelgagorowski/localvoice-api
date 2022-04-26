const standardMessages = {
  startQuestion: {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Czy chcesz kontynuować naukę?',
            subtitle: 'fsdfs',
            buttons: [
              {
                type: 'postback',
                title: 'Tak',
                payload: JSON.stringify({
                  postbackType: 'startingQuestion',
                  data: {
                    startingQuestionResponse: 'Continue lesson',
                  },
                }),
              },
              {
                type: 'postback',
                title: 'Nie',
                payload: JSON.stringify({
                  postbackType: 'startingQuestion',
                  data: {
                    startingQuestionResponse: 'Stop lesson',
                  },
                }),
              },
              {
                type: 'postback',
                title: 'Tak, ale inną lekcję',
                payload: JSON.stringify({
                  postbackType: 'startingQuestion',
                  data: {
                    startingQuestionResponse: 'Continue another lesson',
                  },
                }),
              },
            ],
          },
        ],
      },
    },
  },
  endingQuestion: {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'To juz koniec tej lekcji. Co byś chciał teraz zrobić?',
            subtitle: 'fsdfs',
            buttons: [
              {
                type: 'postback',
                title: 'Wyświetl wszytskie dostępne lekcje',
                payload: JSON.stringify({
                  postbackType: 'endingQuestion',
                  data: {
                    endingQuestionResponse: 'Continue another lesson',
                  },
                }),
              },
              {
                type: 'postback',
                title: 'Powtórz lekcję',
                payload: JSON.stringify({
                  postbackType: 'endingQuestion',
                  data: {
                    endingQuestionResponse: 'Repeat lesson',
                  },
                }),
              },
              {
                type: 'postback',
                title: 'Koniec na dzisiaj',
                payload: JSON.stringify({
                  postbackType: 'endingQuestion',
                  data: {
                    endingQuestionResponse: 'Stop lesson',
                  },
                }),
              },
            ],
          },
        ],
      },
    },
  },
};

export default standardMessages;
