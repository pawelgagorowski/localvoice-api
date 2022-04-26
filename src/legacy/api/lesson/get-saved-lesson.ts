'use strict';

import AWS                                       from "aws-sdk";
import { decodeString, getQueryParams }          from "../../utils/helperFunctions";
import { paramsFromRequest, 
        LessonType, 
        UserHeaderType, KeyHeaderType }           from "../../models/types";
import { HeadersAndParamsRequestInterface }      from "../../models/interfaces";
import CustomError                               from "../../classes/errorResponse";
import DynamoDB                                  from "../../classes/dynamoDB";
import logger                                    from "../../config/logger";        
import { AuthTokenClaimsvalid } from "../../../auth/validation";
import { errorResponse, response, ResponseStatusCode } from "../../../shared";

AWS.config.update({ region: 'eu-central-1' });
const docClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

const handler = async (event: HeadersAndParamsRequestInterface<UserHeaderType, paramsFromRequest>) => {
  const generalErrorMessage = "there was an error while getting lesson";

  try {
    logger("info", event);

    AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);
    const { business } = event.requestContext.authorizer.claims;
    
    const noItemErrorMessage = 'sorry but we could\'nt find that lesson in database';
    const missingParamsErrorMessage = 'there are some missing params while getting lesson';
    const successResponseMessage = "lesson was successfully retrieved";
    const noLessonResponse = "there is no such lesson in database";

    const { key: encodedKey } = getQueryParams<KeyHeaderType>(event.multiValueQueryStringParameters, missingParamsErrorMessage, "key");
    const key = decodeString(encodedKey);
    console.log("key", key)
    
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.LESSONS_FOR_TESTING,
      Key: {
        business: business,
        name: key
      }
    }

    const lesson = await DynamoDB.getItem<LessonType>(params, noItemErrorMessage);
    
    if(!lesson) return errorResponse(noLessonResponse, ResponseStatusCode.NOT_FOUND)
    return response(lesson, ResponseStatusCode.OK);
  } catch(error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
