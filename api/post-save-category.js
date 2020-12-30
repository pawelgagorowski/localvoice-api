'use strict';

//
// Route: POST /category/save
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.CATEGORIES_TABLE;

exports.handler = async (event) => {
  const answer = {};
  const promises = [];
  try {
    console.log(event.body)
    console.log(`${table}_test`)
    const business = event.body.business;
    const env = event.body.env;
    const categories = event.body.categories;
    const process = categories.map(async (course) => {
      const list = [];
      const nameOfCourse = course.name;
      course.list.forEach((category) => {
        console.log(JSON.stringify(category, null, 2))
        const newCategory = {};
        if(category.title) {
          newCategory.title = category.title
        } else {
          throw "swinia"
        }
        if(category.image) {
          newCategory.image = category.image;
        } else {
          const message = "image"
          throw message;
        }
        newCategory.description = category.description;
        newCategory.alt = category.alt;
        list.push(newCategory)
      })
      const params = {
        TableName: `${table}_test`,
        Item: {
          client: business,
          name: nameOfCourse,
          list: list
        }
      }
      const myDoc = await docClient.put(params).promise();
    })
    await Promise.all(process);
    answer.ok = true;
    return answer;
  } catch(e) {
    console.log(e)
    throw e
    // return new Error({messaga: "dupa"})
  }
}
