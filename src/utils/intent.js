// 'use strict';
//
// require('dotenv').config({path: __dirname + '/../.env'})
//
// const AWS = require('aws-sdk');
// AWS.config.update({ region: 'eu-central-1' });
// const docClient = new AWS.DynamoDB.DocumentClient();
//
// const { dialogflow, Suggestions } = require('actions-on-google');
//
// const app = dialogflow();
//
// async function getLastListenExercise() {
//   try {
//     var params = {
//         TableName: `${process.env.LIST_OF_LESSONS}`,
//         Key: {
//             "name": process.env.KEY
//         }
//     };
//     const result = await docClient.get(params).promise();
//     console.log("result", result)
//     const textToRead = result.Item.text;
//     return textToRead
//   }
//   catch(e) {
//     console.log(e)
//   }
// }
//
// app.intent('Default Welcome Intent', (conv) => {
//   conv.data.sayyes = true;
//   conv.ask("You wanna read the lesson?")
//   conv.ask(new Suggestions(['Read the lesson']));
// });
//
//
// app.intent('Reading intent', async (conv) => {
//   // const text = await getLastListenExercise();
//   let text;
//   if(conv.data.sayyes) {
//     text = "yes"
//     conv.ask(text)
//   } else {
//     text = "no"
//     conv.ask(text)
//   }
//   conv.ask(new Suggestions(['Read the lesson']));
// });
//
//
// module.exports = {
//   app
// }



'use strict';

require('dotenv').config({path: __dirname + '/../.env'});

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();

const { dialogflow, Suggestions } = require('actions-on-google');

const app = dialogflow();

app.intent('Default Welcome Intent', (conv) => {
  conv.data.sayyes = true;
  conv.ask("just click the suggestion");
  conv.ask(new Suggestions(['checking context']));
});


app.intent('checking context intent', async (conv) => {
  let text;
  if(conv.data.sayyes) {
    text = "yes"
    conv.ask(text)
  } else {
    text = "no"
    conv.ask(text)
  }
});


module.exports = {
  app
}
