'use strict';

//
// Route: POST /save
//
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const tableForLessons = process.env.LESSONS_FOR_TESTING
const tableForWords = process.env.WORDS_TABLE;

exports.handler = async (event) => {
  console.log("post-save-lesson");
  const response = {};
  console.log("sprawdzamy ebvent", event)
  try {
    const words = event.body.todaysLesson.words.words_to_repeat;
      const paramsForLesson = {
        TableName: tableForLessons,
        Item: {
          tester: event.headers["X-User"],
          course: event.body.course,
          business: event.body.business,
          category: event.body.category,
          translatedCategory: event.body.translatedCategory,
          lesson: event.body.lesson,
          translatedLesson: event.body.translatedLesson,
          name: event.body.key,
          todaysLesson: event.body.todaysLesson
          }
        }
    const myDoc = await docClient.put(paramsForLesson).promise();


    // let wordsProcessed = words.map(async (record) => {
    //   let base = record.base;
    //   console.log(JSON.stringify(event, null, 2));
    //   //get file from s3
    //   const params = {
    //     TableName: tableForWords,
    //     Item: {
    //         word: record,
    //       }
    //     }
    //   let inputData = await docClient.put(params).promise();
    // })
    //
    // await Promise.all(wordsProcessed);
    console.log("done");
    response.answer = "Dane zostały zapisane";
    return response;
  } catch (e) {
    console.log(e);
    return e
  }

}
