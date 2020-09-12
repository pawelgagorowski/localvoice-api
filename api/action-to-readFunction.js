// 'use strict';
// require('dotenv').config();
//
// const { app } = require('../utils/intent');
//
// function getError(err) {
//   var msg='';
//   if (typeof err === 'object') {
//     if (err.message) {
//       msg = ': Message : ' + err.message;
//     }
//     if (err.stack) {
//       msg += '\nStacktrace:';
//       msg += '\n====================\n';
//       msg += err.stack;
//     }
//   } else {
//     msg = err;
//     msg += ' - This error is not object';
//   }
//   return msg;
// };
//
// exports.handler = function(event, context, callback) {
//     // warunek abym mógł korzystać z obiektu z SYMULATORA jak i z logów funkcji lambda na aws
//     let data = event.body ? event.body : event;
//
//     app.handler(data, {}).then((res) => {
//
//         if (res.status != 200) {
//             return callback(null, {"fulfillmentText": `I got status code: ${res.status}`});
//         } else {
//           return callback(null, res.body);
//         }
//     }).catch((e) => {
//        return callback(null, {"fulfillmentText": `There was an error \n${e}\n` + getError(e)});
//   });
// };

'use strict';

const { app } = require('../utils/intent');

exports.handler = function(event, context, callback) {

  let data = event.body ? event.body : event;

  app.handler(data, {}).then((res) => {

      if (res.status != 200) {
          return callback(null, {"fulfillmentText": `I got status code: ${res.status}`});
      } else {
        return callback(null, res.body);
      }
  }).catch((e) => {
     return callback(null, {"fulfillmentText": `There was an error \n${e}`})
    });
  };
