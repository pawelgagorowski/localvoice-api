'use strict';

import AWS                                       from "aws-sdk";
import { UserHeaderType, KeyBodyType, 
        versionOfTestType }                      from "../../models/types";
import { BodyAndHeaderRequestInterface }         from "../../models/interfaces";
import { getBodyProperty }                       from "../../utils/helperFunctions";
import CustomError                               from "../../classes/errorResponse";
import Response                                  from "../../classes/response";
import logger                                    from "../../config/logger";
import DynamoDB                                  from "../../classes/dynamoDB";

const handler = async (event: BodyAndHeaderRequestInterface<UserHeaderType, KeyBodyType>) => {
  const generalErrorMessage = "there was an error while updating image version"; 
  try {
    const missingBodyPropertyErrorMessage = "there was some missing body properties while updating version of image";
    const updateErrorMessage = "there was an error with updating version of image while post image versioning";
    const successResponse = "version of image was successfully retrieved";

    const { key } = getBodyProperty<KeyBodyType>(event.body, missingBodyPropertyErrorMessage, "key");
    const version = 'versionOfTest';

    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.LIST_OF_ALL_LESSONS_TABLE,
      ReturnValues: "UPDATED_NEW",
      ExpressionAttributeValues: {
        ":inc": 1,
        ":init": parseInt(process.env.INIT_VERSION, 10)
      },
      ExpressionAttributeNames: {
        "#c": version
      },
      UpdateExpression: "set #c = if_not_exists(#c, :init) + :inc",
      Key: {
        business: `${event.business}_@test`,
        key: key
      }
    }
    // dodac walidację dla versionOfTest
    const data = await DynamoDB.updateItem(params, updateErrorMessage);
    const versionOfTest: string = data.Attributes!.versionOfTest;
    // const versionOfTest = getVersionOfTest(data.Attributes)
    const response = Response.createResponseMessage<versionOfTestType>(successResponse, { versionOfTest: versionOfTest });
    return response;
  } catch (error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
