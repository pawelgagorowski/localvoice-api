'use strict';

import AWS                                      from "aws-sdk";
import { ECSGeneratePictures, UserHeaderType }  from "../../models/types";
import { BodyAndHeaderRequestInterface }        from "../../models/interfaces";
import { getBodyProperty }                      from "../../utils/helperFunctions";
import { buildParamsForECSGeneratePictures }    from '../../utils/paramsForECS';
import CustomError                              from "../../classes/errorResponse";
import Response                                 from "../../classes/response";
import logger                                   from "../../config/logger";

AWS.config.update({ region: 'eu-central-1' });
const ECS = new AWS.ECS();

const handler = async (event: BodyAndHeaderRequestInterface<UserHeaderType, ECSGeneratePictures>) => {
  const generalErrorMessage = "there was an error while trying to generate pictures";
  
  try {
    logger("info", event, "event");
    const missingBodyProperties = "there was some missing body properties";
    const successResponse = "currently photos are generated and you can test new app version in a few minutes";
    const ECSOperationName = "generatePicture";
    const { course, category, lesson, version } = getBodyProperty<ECSGeneratePictures>(event.body, missingBodyProperties,  "course", "category", "lesson", "version");

    const ecsProperties = {} as ECSGeneratePictures;
    ecsProperties.business = event.business;
    ecsProperties.course = course;
    ecsProperties.category = category;
    ecsProperties.lesson = lesson;
    ecsProperties.version = version;
    ecsProperties.operationName = ECSOperationName;

    const params = buildParamsForECSGeneratePictures(ecsProperties);
    console.log("params", JSON.stringify(params, null, 2));
    await ECS.runTask(params).promise();
    const response = Response.createResponseMessage(successResponse);
    console.log("response", response);
    return response;
  } catch(error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
