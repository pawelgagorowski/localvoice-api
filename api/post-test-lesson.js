'use strict';

//
// Route: POST /save
//
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.LESSONS_FOR_TESTING;

exports.handler = async (event) => {
  console.log(event)
  try {
      const category = event.body.category;
      // const params = {
      //   TableName: tableName,
      //   Item: {
      //     course: event.body.course,
      //     category: event.body.category,
      //     tester: event.headers["x-user"],
      //     name: event.body.name,
      //     translatedCategory: event.body.translatedCategory,
      //     translatedName: event.body.translatedName,
      //     todaysLesson: event.body.todaysLesson
      //     }
      //   }

      const params = {
        TableName: tableName,
        ReturnValues:"UPDATED_NEW",

        ExpressionAttributeValues: {
          ":course": event.body.course,
          ":translatedCategory": event.body.translatedCategory,
          ":translatedName": event.body.translatedName,
          ":todaysLesson": event.body.todaysLesson
        },
        ExpressionAttributeNames: {
          "#course": 'course',
          "#translatedCategory": 'translatedCategory',
          "#translatedName": 'translatedName',
          "#todaysLesson": 'todaysLesson'
        },
          UpdateExpression: "set #course = :course, #translatedCategory = :translatedCategory, #translatedName = :translatedName, #todaysLesson = :todaysLesson",
        Key: {
          "category": event.body.category,
          "name": event.body.name
          }
        }
        const data = await docClient.update(params).promise();
        const resultForCheckForQuestionsFromAllLessons = await checkForQuestionsFromAllLessons(category);
        const result = await sendAllQuestionsToTable(resultForCheckForQuestionsFromAllLessons, category);
    } catch (e) {
      console.log(e);
      console.log("Nie udało się")
    }
  }

  async function checkForQuestionsFromAllLessons (category) {
    const params = {
      TableName: `${process.env.LESSONS_FOR_TESTING}`,
      KeyConditionExpression: "#category = :category",
      ExpressionAttributeValues: {
      ":category": category
    },
     ExpressionAttributeNames: {
       "#category": "category"
     }
  }
    const data = await docClient.query(params).promise();
    const result = retrievingQuestionsFromLessons(data)
    return result;
  }

  async function sendAllQuestionsToTable(data, category) {
    const params = {
      TableName: `${process.env.CHALLENGE_DB}`,
      Item: {
      name: category,
      montlyChallenge: data
        }
      }
      const myDoc = await docClient.put(params).promise();
      return myDoc;

    }

  async function retrievingQuestionsFromLessons(data) {
    console.log("jesteśmy w retrievingQuestionsFromLessons")
    let array = [];
    for(let i = 0; i < data.Items.length; i++) {
      let currentElement = data.Items[i].todaysLesson.challengeForToday;
      currentElement.forEach((el) => {
        array.push(el);
      })
    }
    console.log(array);
    return array;
  }
