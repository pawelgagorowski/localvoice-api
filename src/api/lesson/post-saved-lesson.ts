'use strict';

import AWS                                       from "aws-sdk";
import { LessonType, HeadersType }               from "../../models/types";
import LessonValidation                          from "../../utils/validateLesson";
import { BodyAndHeaderRequestInterface }         from "../../models/interfaces";
import CustomError                               from "../../classes/errorResponse";
import DynamoDB                                  from "../../classes/dynamoDB";
import Response                                  from "../../classes/response";
import logger                                    from "../../config/logger";        

AWS.config.update({ region: 'eu-central-1' });
const docClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

const handler = async (event: BodyAndHeaderRequestInterface<LessonType, HeadersType>) => {
  logger("info", event, "event");
  const generalErrorMessage = "sorry but there was an error while adding lesson to the database";
  
  try {
    const postErrorMessage = "there was an error with adding new lessons to database while saving lesson";
    const SuccessResponseMessage = "lesson was successfully saved";

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.LESSONS_FOR_TESTING,
      Item: {
        tester: event.email,
        course: event.body.course,
        business: event.business,
        category: event.body.category,
        translatedCategory: event.body.translatedCategory,
        lesson: event.body.lesson,
        translatedLesson: event.body.translatedLesson,
        name: event.body.key,
        todaysLesson: event.body.todaysLesson
      }
    }

    const updatedData = await DynamoDB.putItem(params, postErrorMessage);
    const response = Response.createResponseMessage(SuccessResponseMessage, {});
    logger("info", response, "response");
    return response;
  } catch (error) {
    logger('error', error);

    const response = error.customErrorMessage ? CustomError.createCustomErrorResponse(404, error.customErrorMessage) : CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };





// const words = event.body.todaysLesson.words.words_to_repeat ? event.body.todaysLesson.words.words_to_repeat : ""
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

    // console.log("done");
    // response.answer = "Dane zostały zapisane";
    // return response;
