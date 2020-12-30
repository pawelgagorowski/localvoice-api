'use strict';

//
// Route: POST /save
//
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.LIST_OF_ALL_LESSONS_TABLE;


exports.handler = async (event) => {
  console.log(event)
  console.log("process.env.LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE",process.env.LIST_OF_ALL_LESSONS_TABLE)
  const result = {};
  try {
      console.log("sprawdamy event", event);
      const category = event.body.category;
      const business = event.body.business;
      const course = event.body.course;
      const params = {
        TableName: tableName,
        ReturnValues:"UPDATED_NEW",

        ExpressionAttributeValues: {
          ":course": event.body.course,
          ":lesson": event.body.lesson,
          ":translatedLesson": event.body.translatedLesson,
          ":category": event.body.category,
          ":translatedCategory": event.body.translatedCategory,
          ":todaysLesson": event.body.todaysLesson,
          ":categoryKey": `${event.body.course}_${event.body.category}`
        },
        ExpressionAttributeNames: {
          "#course": 'course',
          "#lesson": 'lesson',
          "#translatedLesson": 'translatedLesson',
          "#category": "category",
          "#translatedCategory": 'translatedCategory',
          "#todaysLesson": 'todaysLesson',
          "#categoryKey": 'categoryKey'

        },
        UpdateExpression: "set #course = :course, #lesson = :lesson, #translatedLesson = :translatedLesson, #category = :category, #translatedCategory = :translatedCategory,  #todaysLesson = :todaysLesson, #categoryKey = :categoryKey",
        Key: {
          "business": event.body.business,
          "key": event.body.key
          }
        }
        const data = await docClient.update(params).promise();
        const resultForCheckForQuestionsFromAllLessons = await checkForQuestionsFromAllLessons(category, business, course);
        await sendAllQuestionsToTable(resultForCheckForQuestionsFromAllLessons, category, business);
        result.answer = "Dane zostały zapisane"
        return result;
    } catch (e) {
      console.log(e);
      result.answer = "Wystąpił błąd i dane nie zostałt zapisane";
      return result;
    }
  }

  async function checkForQuestionsFromAllLessons (category, business, course) {
    console.log("checkForQuestionsFromAllLessons");
    console.log("{process.env.LIST_OF_ALL_LESSONS_TABLE", process.env.LIST_OF_ALL_LESSONS_TABLE);
    const params = {
      TableName: `${process.env.LIST_OF_ALL_LESSONS_TABLE}`,
      IndexName: "category-index",
      KeyConditionExpression: "#categoryKey = :categoryKey AND #business = :business",
      ExpressionAttributeValues: {
      ":categoryKey": `${course}_${category}`,
      ":business": business
    },
     ExpressionAttributeNames: {
       "#categoryKey": "categoryKey",
       "#business": "business"
     }
  }
    const data = await docClient.query(params).promise();
    const result = retrievingQuestionsFromLessons(data);
    return result;
  }

  async function sendAllQuestionsToTable(data, category, business) {
    const params = {
      TableName: "localvoice-tables-test-MonthlyChallengeTable-4DS2W9NYWJXR",
      Item: {
      business: business,
      category: category,
      montlyChallenge: data
        }
      }
      const myDoc = await docClient.put(params).promise();
      return myDoc;
    }

  function retrievingQuestionsFromLessons(data) {
    console.log("jesteśmy w retrievingQuestionsFromLessons")
    let array = [];
    console.log("items", data.Items);
    for(let i = 0; i < data.Items.length; i++) {
      let currentElement = data.Items[i].todaysLesson.challengeForToday;
      currentElement.forEach((el) => {
        array.push(el);
      })
    }
    console.log(array);
    return array;
  }
