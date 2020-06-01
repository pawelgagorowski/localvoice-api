'use strict';

//
// Route: POST /image
//


const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const versioningTable = process.env.LESSONS_FOR_TESTING

exports.handler = async (event) => {
  console.log(event)
    const version = 'versionOfTest';
    console.log(versioningTable)
    const params = {
      TableName: versioningTable,
      ReturnValues: "UPDATED_NEW",
      ExpressionAttributeValues: {
        ":inc": 1,
        ":init": parseInt(process.env.INIT_VERSION, 10)
      },
      ExpressionAttributeNames: {
        "#c": version
      },
      UpdateExpression: "set #c = if_not_exists(#c, :init) + :inc",
      Key: {
        "category": event.body.category,
        "name": event.body.name
      }
    }

  try {
    const data = await docClient.update(params).promise();
    console.log(data)
    return data.Attributes.versionOfTest;
  } catch (e) {
    console.log("nie udało się")
    console.log(e)
  }
}
