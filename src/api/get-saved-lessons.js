'use strict';

//
// Route: GET /lesson/saved
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.STRUCTURE_TABLE;
const client = "business";

exports.handler = async (event) => {
  console.log("get-saved-lessons");
  const response = {};
  try {
    const courses = {};
    const lessons = {};
    let process;
    if(!event.queryParams.business) {
      response.answer = "zaloguj się aby ściągnąć lekcje";
      return response;
    }
    const business = event.queryParams.business;
    const queryParams = event.queryParams;
    for(let key in queryParams) {
      if(key != client) {
        const categories = event.queryParams[key].split(',');
        courses[key] = [];
        categories.map((el) => {
          courses[key].push(el);
        })
      }
    }
    for(let key in courses) {
      lessons[key] = {}
      process = courses[key].map(async (category) => {
        lessons[key][category] = [];
        const params = {
          TableName: table,
          Key: {
            business: business,
            name: `${business}_${key}_${category}`
          }
        }
        const data = await docClient.get(params).promise();
        const result = data.Item && data.Item.list ? data.Item.list : [];
        lessons[key][category].push(result);
      })
    }
    await Promise.all(process);
    console.log(JSON.stringify(lessons, null, 2));
    response.result = lessons;
    return response;
  } catch(e) {
    console.log(e);
    response.answer = "Wystąpił błąd podczas ściągania lekcji";
    return response;
  }
}
