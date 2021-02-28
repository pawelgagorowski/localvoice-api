'use strict';

import AWS                                       from "aws-sdk";
import { decodeString, getQueryParams, 
        getHeaders }                             from "../../utils/helperFunctions";
import { paramsFromRequest, 
        LessonType, 
        getSavedLessonQueryParams, BusinessHeaderType, ResponseType }              from "../../models/types";
import { HeadersAndParamsRequestInterface }      from "../../models/interfaces";
import CustomError                               from "../../classes/errorResponse";
import Response                                  from "../../classes/response";
import DynamoDB                                  from "../../classes/dynamoDB";
import logger                                    from "../../config/logger";        

AWS.config.update({ region: 'eu-central-1' });
const docClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

const handler = async (event: HeadersAndParamsRequestInterface<BusinessHeaderType, paramsFromRequest>) => {
  const generalErrorMessage = "there was an error while getting lesson";

  try {
    logger("info", event);
    
    const noItemErrorMessage = 'sorry but we could\'nt find that lesson in database';
    const missingParamsErrorMessage = 'there are some missing params while getting lesson';
    const missingBusinessHeaderErrorMessage = "there was business header missing in request";
    const successResponseMessage = "lesson was successfully retrieved";
    const noLessonResponse = "there is no such lesson in database";

    const { key: encodedKey } = getQueryParams<getSavedLessonQueryParams>(event.queryParams, missingParamsErrorMessage, "key");
    const { ['x-business']: business } = getHeaders<BusinessHeaderType>(event.headers, missingBusinessHeaderErrorMessage, "x-business");
    console.log(business)
    const key = decodeString(encodedKey);
    
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.LESSONS_FOR_TESTING,
      Key: {
        business: business,
        name: key
      }
    }

    const lesson = await DynamoDB.getItem<LessonType>(params, noItemErrorMessage);
    let response = {} as ResponseType;
    if(!lesson) response = Response.createResponseMessage(noLessonResponse, {});
    else response = Response.createResponseMessage(successResponseMessage, lesson);
    logger("info", response, "response");
    return response;
  } catch(error) {
    logger('error', error);

    const response = error.customErrorMessage ? CustomError.createCustomErrorResponse(404, error.customErrorMessage) : CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
