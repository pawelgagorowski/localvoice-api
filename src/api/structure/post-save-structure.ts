'use strict';

import AWS                                             from "aws-sdk";
import { UserHeaderType, StructureRequestBody }        from "../../models/types";
import { BodyAndHeaderRequestInterface }               from "../../models/interfaces";
import { getHeaders, getBodyProperty }                 from "../../utils/helperFunctions";
import DynamoDB                                        from "../../classes/dynamoDB";
import getNameOfBusiness                               from "../../utils/getNameOfBusiness";
import CustomError                                     from "../../classes/errorResponse";
import Response                                        from "../../classes/response";
import logger                                          from "../../config/logger";

AWS.config.update({ region: 'eu-central-1' });

const handler = async (event: BodyAndHeaderRequestInterface<StructureRequestBody, UserHeaderType>) => {
  logger("info", event, "event")
  const generalErrorMessage = "there was an error while saving structure";

  try {
    const missingUserHeader = "there was missing business header";
    const noDataToSave = "there was no data to save";
    const dataBaseErrorMessage = "there was an error trying to save structure in database";
    const successResponse = "structure was successfully saved";

    const { ["x-user"]: user } = getHeaders<UserHeaderType>(event.headers, missingUserHeader, "x-user");
    const { structure } = getBodyProperty<StructureRequestBody>(event.body, noDataToSave, "structure");
    const business = await getNameOfBusiness(user);

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.STRUCTURE_TABLE,
      Item: {
        business: business,
        structure: structure
      }
    }
    const data = await DynamoDB.putItem(params, dataBaseErrorMessage);
    logger("info", data, "updated structure");
    const response = Response.createResponseMessage(successResponse, {});
    return response;
  } catch(error) {
    logger('error', error);

    const response = error.customErrorMessage ? CustomError.createCustomErrorResponse(404, error.customErrorMessage) : CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
