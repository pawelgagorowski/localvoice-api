// 'use strict';

// import AWS from "aws-sdk";
// import { UserItemDatabaseType, requestEventType, EnvQueryParams, User } from "../../models/types";
// import DynamoDB from "../../classes/dynamoDB";
// import CustomError from "../../classes/errorResponse";
// import Response from "../../classes/response";
// import { getQueryParams } from "../../utils/helperFunctions";
// import logger from "../../config/logger";
// import { checkCognito, getUserAttributes } from "../../shared/cognito";
// import { UserAttributes } from "../../shared/types";
// import { APIGatewayProxyEvent } from 'aws-lambda';

// AWS.config.update({ region: 'eu-central-1' });

// const handler = async (event: requestEventType) => {
//   logger("error", event, "event");
//   const missingParamsErrorMessage = "there are some params missing";
//   const successResponse = "user was successfully retrieved";
//   const generalErrorMessage = "there was an error while fetching user";
//   const noUserInDatabase = "there is no such user in database";

//   const attributes = await checkCognito(event);
//   if( attributes instanceof Error) {
//     console.log("error", attributes);
//     return attributes;
//   }
//   const { email, business } = attributes;
//   // const { env } = getQueryParams<EnvQueryParams>(event.queryParams, missingParamsErrorMessage, "env");
//   const env = 'test';

//   try {
//     const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
//       TableName: process.env.USERS_TABLE,
//       Key: {
//         business: `${business}_@${env}`,
//         email: email
//       }
//     }

//     const data = await DynamoDB.getItem<UserItemDatabaseType>(params, noUserInDatabase);
//     // const structure = (data as StructureItemDatabaseType).structure ? (data as StructureItemDatabaseType).structure : [];
//     console.log("user data", data);
//     if(!data) return;
//     console.log("values", data.course.values);
//     const courses = data.course.values ? data.course.values : [];
//     const user: User = {
//         id: data._id,
//         email: data.email,
//         business: data.business,
//         courses: courses,
//         picture: data.picture ? data.picture : ""
//     }
//     const response = Response.createResponseMessage<User>(successResponse, user);
//     logger("info", response, "response");
//     return response;
//   } catch(error) {
//     console.log("errorrrerere", error);
//     logger('error', error);

//     const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
//     logger("error", response, "errorResponse");
//     return response;
//   }
// }

// export { handler }




import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse, response } from '../../shared';

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  return response({errorMessage: "hello from lambda"}, 200);
};
