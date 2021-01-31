'use strict';

import AWS                                      from "aws-sdk";
import { ECSPropertiesType }                    from "../../models/types";
import { BodyRequestParams }                    from "../../models/interfaces";
import { getBodyProperty }                      from "../../utils/helperFunctions";
import { buildParamsForECS }                    from '../../utils/paramsForECS';
import CustomError                              from "../../classes/errorResponse";
import Response                                 from "../../classes/response";
import logger                                   from "../../config/logger";

AWS.config.update({ region: 'eu-central-1' });
const ECS = new AWS.ECS();

const handler = async (event: BodyRequestParams<ECSPropertiesType>) => {
  const generalErrorMessage = "there was an error while trying to generate pictures";
  
  try {
    logger("info", event, "event");
    const missingBodyProperties = "there was some missing body properties";
    const successResponse = "currently photos are generated";
    const { business, course, category, lesson, version } = getBodyProperty<ECSPropertiesType>(event.body, missingBodyProperties, "business", "course", "category", "lesson", "version");

    const ecsProperties = {} as ECSPropertiesType;
    ecsProperties.business = business;
    ecsProperties.course = course;
    ecsProperties.category = category;
    ecsProperties.lesson = lesson;
    ecsProperties.version = version;

    const params = buildParamsForECS(ecsProperties);
    ECS.runTask(params).promise();
    const response = Response.createResponseMessage(successResponse);
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
