'use strict';

import AWS from "aws-sdk";
import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse, response } from '../../shared';
import DynamoDB from "../../classes/dynamoDB";
import CustomError from "../../classes/errorResponse";
import Response from "../../classes/response";
import { getQueryParams } from "../../utils/helperFunctions";
import logger from "../../config/logger";
import { checkCognito, getUserAttributes } from "../../shared/cognito";
import { UserAttributes } from "../../shared/types";

AWS.config.update({ region: 'eu-central-1' });

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {

    return response({errorMessage: "hello from lambda"}, 200);
};
