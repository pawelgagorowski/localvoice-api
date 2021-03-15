'use strict';

import AWS                                       from "aws-sdk";
import { BusinessTableType }                     from "../models/types";
import CustomError                               from "../classes/errorResponse";
import DynamoDB                                  from "../classes/dynamoDB";
import logger                                    from "../config/logger";

const getNameOfBusiness = async (user: string) => {

    const missingBusinessHeaderErrorMessasge = "there is no business coresponding with the user while getting name of business";
    const noBusinessError = "there was no business coresponding with the user. Contact to admin";

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: process.env.BUSINESS_TABLE,
        Key: {
            email: user
        }
    }
    const result = await DynamoDB.getItem<BusinessTableType>(params, missingBusinessHeaderErrorMessasge);
    logger("info", result, "getNameOfBusiness result");
    if(!result) throw CustomError.createCustomErrorMessage(noBusinessError);
    return result.business;
}

export default getNameOfBusiness;