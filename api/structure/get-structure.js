'use strict';

//
// Route: GET /elements
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.STRUCTURE_TABLE;

exports.handler = async (event) => {
  console.log("get-structure")
  console.log("ebent", event);
  try {
    const fail = {}
    console.log("sp[rawdzamy business", event.queryParams.business)
    const business = event.queryParams.business ? event.queryParams.business : 'undefined';
    console.log("sp[rawdzamy business", business)
    if(!business) {
      fail.answer = "Wystąpił błąd podczas identyfikacji. Skontaktuj się z administratorem"
      return fail;
    }
    const params = {
      TableName: table,
      Key: {
        business: business,
      }
    }
    const data = await docClient.get(params).promise();
    console.log("data z bazy", data)
    const elements = data.Item && data.Item.structure ? data.Item.structure : [];
    return elements;
  } catch(e) {
    console.log(e);
    return false;
  }
}
