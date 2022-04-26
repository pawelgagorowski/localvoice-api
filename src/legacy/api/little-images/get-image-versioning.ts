'use strict';

import AWS                                       from "aws-sdk";
import { GetImageVersioningparamsType,
         CounterType }                           from "../../models/types";
import { ParamsRequestInterface }                from "../../models/interfaces";
import { getQueryParams }                        from "../../utils/helperFunctions";
import CustomError                               from "../../classes/errorResponse";
import DynamoDB                                  from "../../classes/dynamoDB";
import Response                                  from "../../classes/response";
import logger                                    from "../../config/logger";

const handler = async (event: ParamsRequestInterface<GetImageVersioningparamsType>) => {
  logger("info", event, "event");
  
  const missingParamsErrorMessage = "there are some missing params while get image versioning";
  const getCounterErrorMessage = "there was an error with getting counter while get image versioning";
  const successResponse = "version of image was successfully retrieved";
  const generalErrorMessage = "there was an error while getting image version";
  
  try {
    const { category, name } = getQueryParams<GetImageVersioningparamsType>(event.queryParams, missingParamsErrorMessage, "category", "name");
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.VERSIONING_TABLE,
      Key: {
        category: category,
        name: name
      }
    }
    
    const data = await DynamoDB.getItem<CounterType>(params, getCounterErrorMessage);
    const counter = (data as CounterType).counter ? (data as CounterType).counter : '';
    const response = Response.createResponseMessage<CounterType>(successResponse, {counter: counter});
    return response;
  } catch(error) {
    logger('error', error);
    
    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
