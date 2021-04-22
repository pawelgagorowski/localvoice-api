'use strict';

import AWS                                      from "aws-sdk";
import { ECSPropertiesType, UserHeaderType }    from "../../models/types";
import { BodyAndHeaderRequestInterface }        from "../../models/interfaces";
import { getBodyProperty, getHeaders }          from "../../utils/helperFunctions";
import { buildParamsForECS }                    from '../../utils/paramsForECS';
import CustomError                              from "../../classes/errorResponse";
import Response                                 from "../../classes/response";
import logger                                   from "../../config/logger";

AWS.config.update({ region: 'eu-central-1' });
const ECS = new AWS.ECS();

const handler = async (event: BodyAndHeaderRequestInterface<UserHeaderType, ECSPropertiesType>) => {
  const generalErrorMessage = "there was an error while trying to generate pictures";
  
  try {
    logger("info", event, "event");
    const missingBodyProperties = "there was some missing body properties";
    const successResponse = "currently photos are generated and you can test new app version in a few minutes";
    const { course, category, lesson, version } = getBodyProperty<ECSPropertiesType>(event.body, missingBodyProperties,  "course", "category", "lesson", "version");

    const ecsProperties = {} as ECSPropertiesType;
    ecsProperties.business = event.business;
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
