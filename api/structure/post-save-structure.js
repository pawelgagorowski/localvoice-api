'use strict';

//
// Route: POST /save/structure
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.STRUCTURE_TABLE;

exports.handler = async (event) => {
  const fail = {}
  try {
    console.log("event", event)
    const business = event.body.business;
    const elements = event.body.elements;
    // console.log("elements", JSON.stringify(elements, null, 2))
    if(!business) {
      fail.answer = "Wystąpił błąd podczas identyfikacji. Skontaktuj się z administratorem";
      return fail;
    }
    if(!elements) {
      fail.answer = "Brak danych do zapisania";
      return fail
    }
    const params = {
      TableName: table,
      Item: {
        business: business,
        structure: elements
      }
    }
    const data = await docClient.put(params).promise();
    fail.answer = "Dane zostały zapisane";
    return fail;
  } catch(e) {
    console.log(e);
    fail.answer = "Wystąpił błąd. Skontaktuj się z administratorem albo spróbuj później";
    return fail;
  }
}
