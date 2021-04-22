'use strict';

import AWS                                       from "aws-sdk";
import { LessonType, UserHeaderType }            from "../../models/types";
import LessonValidation                          from "../../utils/validateLesson";
import { BodyAndHeaderRequestInterface }         from "../../models/interfaces";
import CustomError                               from "../../classes/errorResponse";
import DynamoDB                                  from "../../classes/dynamoDB";
import Response                                  from "../../classes/response";
import Params                                    from "../../classes/params";
import logger                                    from "../../config/logger";        

AWS.config.update({ region: 'eu-central-1' });
const docClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

const handler = async (event: BodyAndHeaderRequestInterface<LessonType, UserHeaderType>) => {
  const generalErrorMessage = "there was an error while adding lesson to the database before testing";
  try {
    const successMessageResponse = "lesson was successfully added to tesing environment";
    const updateItemErrorMessage = "there was an error while updating lesson in database";
    const queryItemsErrorMessage = "there was an error with quering challenges while adding lesson to testing environment";
    const putChallengesErrorMessage = "there was an error with adding challenges to database while adding lesson to testing environment";

    const arrayOfComments = LessonValidation.validateLesson(event.body)

    if(arrayOfComments.length > 0 ) {
      const comments = arrayOfComments.join(',');
      const response = Response.createResponseMessage(comments, {});
      return response;
    }

    const updateParams = Params.createParamsToUpdateTestingLessons(event.body, event.business);
    const updatedLesson = await DynamoDB.updateItem(updateParams, updateItemErrorMessage);
    logger("info", updatedLesson, "updated lesson");

    const queryParams = Params.createParamsToQueryAllChallenges(event.body, event.business);
    const lessonsWithChallenges = await DynamoDB.queryItems<LessonType>(queryParams, [], queryItemsErrorMessage);
    const allChallenges = retrievingQuestionsFromLessons(lessonsWithChallenges);
    logger("info", allChallenges, "allChallenges");
    
    const putParams = Params.createParamsToPutChallenges(allChallenges, event.body, event.business);
    await DynamoDB.putItem(putParams, putChallengesErrorMessage);
    
    const response = Response.createResponseMessage(successMessageResponse, {});
    logger("info", response, "response");
    return response;
  } catch (error) {
    logger('error', error);

    const response = error.customErrorMessage ? CustomError.createCustomErrorResponse(404, error.customErrorMessage) : CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
    }
  }

  function retrievingQuestionsFromLessons(listOfLessons: LessonType[]): string[] {
    console.log("jesteśmy w retrievingQuestionsFromLessons");
    let array: string[] = [];

    listOfLessons.forEach((lesson: LessonType) => {
      let arrayOfChallenges: string[] = lesson.todaysLesson.challengeForToday ? lesson.todaysLesson.challengeForToday : [];
      if(arrayOfChallenges && arrayOfChallenges.length > 0) {
        arrayOfChallenges.forEach((el: string) => {
          array.push(el);
        })
      }
    })
    return array;
  }

  export { handler };
