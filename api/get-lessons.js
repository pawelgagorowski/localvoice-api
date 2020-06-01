'use strict';

//
// Route: GET /lessons {name}
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
      IndexName: "tester-index",
      KeyConditionExpression: "tester = :tester",
      ExpressionAttributeValues: {
        ":tester": event.tester
      }
    }

  const myDoc = docClient.query(params).promise();
  return myDoc.then(function (data) {
    console.log("Udało się")
    callback(null, data)
  }).catch(function (e) {
    console.log("Nie udało się")
    callback(null, e)
  })

}
