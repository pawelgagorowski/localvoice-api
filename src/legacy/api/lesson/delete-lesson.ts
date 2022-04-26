'use strict';

import AWS                                         from "aws-sdk";
import { decodeString, getQueryParams }            from "../../utils/helperFunctions";
import { UserHeaderType, getSavedLessonQueryParams, 
        KeyParamsType, 
        KeyHeaderType}                            from "../../models/types";
import { HeadersAndParamsRequestInterface }        from "../../models/interfaces";
import CustomError                                 from "../../classes/errorResponse";
import DynamoDB                                    from "../../classes/dynamoDB";
import Response                                    from "../../classes/response";
import logger                                      from "../../config/logger";
import { AuthTokenClaimsvalid } from "../../../auth/validation";
import { response, ResponseStatusCode } from "../../../shared";

 const handler = async (event: HeadersAndParamsRequestInterface<UserHeaderType, KeyParamsType>) => {
  const generalErrorMessage = "there was an error while deleting item";
  const deleteItemErrorMessage = "Error while deleting item";
  const deleteItemSuccessMessage = "Item was deleted";

  try {
    logger("info", event, "event");
    
    const missingParamsErrorMessage = "there are some missing params while deleting lesson";
    AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);
    const { business } = event.requestContext.authorizer.claims;
    
    const { key: encodedKey } = getQueryParams<KeyHeaderType>(event.multiValueQueryStringParameters, missingParamsErrorMessage, "key");
    const key = decodeString(encodedKey);
    console.log("key", key)
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: process.env.LESSONS_FOR_TESTING,
      Key: {
        business,
        name: key
      }
    }
    // TODO change it
    // await DynamoDB.deleteItem(params, deleteItemErrorMessage);
    return response(deleteItemSuccessMessage, ResponseStatusCode.OK);
  } catch(error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
