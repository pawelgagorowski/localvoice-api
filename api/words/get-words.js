'use strict';

//
// Route: GET /words
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.WORDS_TABLE;

exports.handler = async (event) => {

  const params = {
    TableName: tableName
    }

  try {
    const myDoc = await docClient.scan(params).promise();
    return myDoc
  } catch(e) {
    console.log(e)
  }

}
