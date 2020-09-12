'use strict';
//
// Route: PUT /text
//
require('dotenv').config({path: __dirname + '/../.env'})

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();

async function getLastListenExercise(text) {
    const params = {
      TableName: `${process.env.LIST_OF_LESSONS}`,
      Item: {
      name: "last_listening_comprehension",
      text: text
    }
  }
    const result = await docClient.put(params).promise();
    return result;
}

exports.handler = async (event) => {
  console.log("event", event)
  const text = event.body.text;
  try {
    await getLastListenExercise(text)
    return "ok"
  } catch(e) {
    console.log(e)
    return "something went wrong"
  }
}
