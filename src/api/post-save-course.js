'use strict';

//
// Route: POST /courses/save
//


const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.COURSES_TABLE;
const business = process.env.BUSINESS_TABLE;
const name = "list of courses";

exports.handler = async (event) => {
  const answer = {}
  try {
    const list = [];
    const courses = event.body.courses;
    const business = event.body.business;
    const env = event.body.env;
    console.log("courses", courses);
    console.log("business", business);
    console.log("env", env);
    console.log(`${business}_${env}`);
    console.log(`${table}_${env}`);
    for(let i = 0; i < courses.length; i++) {
      try {
      const course = {};
        course.title = courses[i].title;
        course.description = courses[i].description;
        course.image = courses[i].image;
        course.alt = courses[i].alt;
        list.push(course)
      } catch(e) {
        answer.message = "Aby testować kurs musisz wypełnić wszystkie stworzone pola i dodać zdjęcia"
        return answer;
      }
    }
    const params = {
      TableName: `${table}_${env}`,
      Item: {
        business: business,
        name: name,
        list: list
      }
    }
    const myDoc = await docClient.put(params).promise();
    answer.ok = true;
    return answer;
  } catch(e) {
    console.log(e);
    answer.message = "Wystąpił błąd podczas przesyłania nazw kursów. Proszę skontaktować się z administratorem";
    return answer;
  }
}
