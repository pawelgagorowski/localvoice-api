'use strict';

//
// Route: POST /synonyms
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SYNONYMS_TABLE;

exports.handler = async (event) => {
  let synonymsProcessed = event.map(async (record) => {
    let base = record.base;
    let synonym = record.synonym;

    console.log(JSON.stringify(event, null, 2));

    //get file from s3
    const params = {
      TableName: process.env.SYNONYMS_TABLE,
      Item: {
          base: base,
          synonym: synonym
        }
      }
    let inputData = await docClient.put(params).promise();
  })

  await Promise.all(synonymsProcessed);
  console.log("done");
  return "done";
}
