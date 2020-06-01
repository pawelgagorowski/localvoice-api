'use strict';

//
// Route: POST /save
//
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const tableForLessons = process.env.LESSONS_TABLE;
const tableForWords = process.env.WORDS_TABLE;

exports.handler = async (event) => {
  try {
    const words = event.body.todaysLesson.words.words_to_repeat;
      const paramsForLesson = {
        TableName: tableForLessons,
        Item: {
          tester: event.headers["x-user"],
          course: event.body.course,
          category: event.body.category,
          name: event.body.name,
          translatedCategory: event.body.translatedCategory,
          translatedName: event.body.translatedName,
          todaysLesson: event.body.todaysLesson
          }
        }

    const myDoc = await docClient.put(paramsForLesson).promise();


    let wordsProcessed = words.map(async (record) => {
      let base = record.base;

      console.log(JSON.stringify(event, null, 2));

      //get file from s3
      const params = {
        TableName: tableForWords,
        Item: {
            word: record,
          }
        }
      let inputData = await docClient.put(params).promise();
    })

    await Promise.all(wordsProcessed);
    console.log("done");
    return "done";
  } catch (e) {
    console.log(e);
    return e
  }

}
