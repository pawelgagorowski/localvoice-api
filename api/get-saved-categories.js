'use strict';

//
// Route: GET /category/saved
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.STRUCTURE_TABLE;

exports.handler = async (event) => {
  try {
    const business = event.queryParams.business;
    const courses = event.queryParams.course.split(',');
    console.log(courses);
    const categories = [];
    const process = courses.map(async (course) => {
      const params = {
        TableName: table,
        Key: {
          business: business,
          name: course
        }
      }
      const data = await docClient.get(params).promise();
      console.log("data", data)
      console.log(data.Item.list)
      const result = data.Item && data.Item.list ? data.Item.list : [];
      console.log("result", result)
      console.log("length", result.length)
      if(result.length > 0) {
        categories.push(result)
      }
    })
    await Promise.all(process);
    return categories;
  } catch(e) {
    console.log(e);
    return false;
  }
}
