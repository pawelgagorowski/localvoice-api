'use strict';

//
// Route: GET /words
//

import AWS                  from 'aws-sdk';
AWS.config.update({ region: 'eu-central-1' });

const docClient:AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.WORDS_TABLE;

type paramsType = {
  TableName: string | undefined
}


exports.handler = async () => {

  const params: paramsType = {
    TableName: tableName
  }

  try {
    const myDoc = await docClient.scan(params).promise();
    return myDoc
  } catch(e) {
    console.log(e)
  }

}
