'use strict';
//
// Route : DELETE /lesson
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const listOfSavedlLessonsTable = process.env.LESSONS_FOR_TESTING;

exports.handler = async (event) => {
  const response = {};
  try {
    console.log("get save lesson")
    console.log("event", event);
    const business = event.queryParams.business
    const key = event.queryParams.key
      const params = {
        TableName: listOfSavedlLessonsTable,
        Key: {
          business: business,
          name: key
        }
      }
    // const data = await docClient.get(params).promise();
    // if(data) response.answer = "Lekcja została usunięta";
    // return response
    return {answer: "udało się"}
  } catch(e) {
    console.log(e);
    response.answer = "Wystąpił błąd podczas usuwania lekcji";
    return response;
  }
}
