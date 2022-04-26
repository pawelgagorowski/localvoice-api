'use strict';

import AWS                                       from "aws-sdk";
import { LessonType, UserHeaderType, 
  ECSPictureOperations }            from "../../models/types";
import LessonValidation                          from "../../utils/validateLesson";
import { BodyAndHeaderRequestInterface }         from "../../models/interfaces";
import { getBodyProperty }                       from "../../utils/helperFunctions";
import CustomError                               from "../../classes/errorResponse";
import DynamoDB                                  from "../../classes/dynamoDB";
import { buildParamsForECSPictureOperations }    from '../../utils/paramsForECS';
import Response                                  from "../../classes/response";
import Params                                    from "../../classes/params";
import logger                                    from "../../config/logger";     

AWS.config.update({ region: 'eu-central-1' });
const docClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient(); 
const ECS = new AWS.ECS();

const handler = async (event: BodyAndHeaderRequestInterface<LessonType, UserHeaderType>) => {
  const generalErrorMessage = "there was an error while adding lesson to the database before testing";
  try {
    const ECSOperationName = "pictureOperations";
    const successMessageResponse = "lesson was successfully added to tesing environment";
    const successMessageResponseForProduction = "lesson was successfully added to production environment";
    const updateItemErrorMessage = "there was an error while updating lesson in database";
    const queryItemsErrorMessage = "there was an error with quering challenges while adding lesson to testing environment";
    const putChallengesErrorMessage = "there was an error with adding challenges to database while adding lesson to testing environment";
    const missingBodyPropertyErrorMessage = "there are some missing body property request";
    const noEnvFound = "there is environemnt missing in the body";

    const arrayOfComments = LessonValidation.validateLesson(event.body);

    let response = {};
    if(arrayOfComments.length > 0 ) {
      const comments = arrayOfComments.join(',');
      response = Response.createResponseMessage(comments, {});
      return response;
    }

    const { env } = getBodyProperty<LessonType>(event.body, missingBodyPropertyErrorMessage, "env");
    response = {} as ResponseType;
    if(!env) return response = Response.createResponseMessage(noEnvFound, {});
    const updateParams = Params.createParamsToUpdateTestingLessons(event.body, event.business, env);
    const updatedLesson = await DynamoDB.updateItem(updateParams, updateItemErrorMessage);
    logger("info", updatedLesson, "updated lesson");

    const queryParams = Params.createParamsToQueryAllChallenges(event.body, event.business, env);
    const lessonsWithChallenges = await DynamoDB.queryItems<LessonType>(queryParams, [], queryItemsErrorMessage);
    const allChallenges = retrievingQuestionsFromLessons(lessonsWithChallenges);
    logger("info", allChallenges, "allChallenges");
    
    const putParams = Params.createParamsToPutChallenges(allChallenges, event.body, event.business, env);
    await DynamoDB.putItem(putParams, putChallengesErrorMessage);
    console.log("env", env);

    if (env === "production") {
      const ecsProperties = {} as ECSPictureOperations;
      ecsProperties.business = event.business;
      ecsProperties.course = event.body.course;
      ecsProperties.category = event.body.category;
      ecsProperties.lesson = event.body.lesson;
      ecsProperties.operationName = ECSOperationName;

      const params = buildParamsForECSPictureOperations(ecsProperties);
      console.log("params for ECS", JSON.stringify(params, null, 2));
      await ECS.runTask(params).promise();
      return response = Response.createResponseMessage(successMessageResponseForProduction, {});
    }

    response = Response.createResponseMessage(successMessageResponse, {});

    logger("info", response, "response");
    return response;
  } catch (error) {
      logger('error', error);

      const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
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
