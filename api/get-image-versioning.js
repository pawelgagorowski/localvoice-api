'use strict';

//
// Route: GET /image
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const versioningTable = process.env.VERSIONING_TABLE

exports.handler = async (event) => {
  console.log(event.queryParams.category)
  console.log(event.queryParams.name)
  const params = {
    TableName: versioningTable,
    Key: {
      category: event.queryParams.category,
      name: event.queryParams.name
    }
  }

  try {
    const data = await docClient.get(params).promise();
    console.log(data)
    return data.Item.counter;
  } catch(e) {
    console.log(e)
  }
}
