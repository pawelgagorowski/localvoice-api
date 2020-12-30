'use strict';

//
// Route: POST /image
//


const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const versioningTable = process.env.LIST_OF_ALL_LESSONS_TABLE

exports.handler = async (event) => {
  console.log("jesteśmy w post-image-versining!!")
  console.log(event)
  console.log("event.body.business", event.body.business);
  console.log("event.body.name", event.body.key);
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
        business: event.body.business,
        key: event.body.key
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
