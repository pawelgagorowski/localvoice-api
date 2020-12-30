'use strict';

//
// Route: GET /course/saved
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.STRUCTURE_TABLE;
const name = "list of courses";

exports.handler = async (event) => {
  try {
    const business = event.queryParams.business;
    const params = {
      TableName: table,
      Key: {
        business: business,
        name: name
      }
    }
    const data = await docClient.get(params).promise();
    const result = data.Item && data.Item.list ? data.Item.list : [];
    console.log(result);
    return result;
  } catch(e) {
    console.log(e);
    return false;
  }
}
