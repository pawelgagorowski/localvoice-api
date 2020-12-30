'use strict';

//
// Route: GET /business
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.BUSINESS_TABLE;


exports.handler = async (event) => {
  console.log("get-name-of-business");
  try {
    console.log("event", event.headers["x-user"])
    const response = {};
    const params = {
      TableName: tableName,
      Key: {
        email: event.headers["x-user"]
      }
    }
    const data = await docClient.get(params).promise();
    console.log("data", data)
    if (!data.Item.business) {
      return false
    } else {
      response.business = data.Item.business;
      console.log("data.Item.business",data.Item.business)
      return response;
    }
  } catch(e) {
    console.log(e)
    return e;
  }
}
