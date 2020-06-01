'use strict';
//
// Route : POST /lesson
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.LESSONS_TABLE;

exports.handler = function (event, context, callback) {
  console.log("event");
  console.log(event);
    const params = {
      TableName: tableName,
      Key: {
        category: event.category,
        name: event.name
        }
      }
  const myDoc = docClient.get(params).promise();
  return myDoc.then(function (data) {
    callback(null, data.Item)
  }).catch(function (e) {
    console.log("Nie udało się")
    callback(null, e)
  })
}
