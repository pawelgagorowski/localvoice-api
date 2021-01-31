'use strict';
//
// Route: POST /registration
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.USERS_TABLE;

exports.handler = async (event) => {
    const params = {
      TableName: tableName,
      Item: {
        email: event.email,
        name: event.name,
        surname: event.surname,
        timestamp: Date.now(),
        }
      }

    try {
      const result = await docClient.put(params).promise();
        return result;
    } catch (e) {
      console.log(e)
      const response = {
         statusCode: 404
      }
      return e
    }
}
