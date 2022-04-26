import AWS from 'aws-sdk';
import { paramsFromRequest, HeadersType } from '../models/types';
import CustomError from '../classes/errorResponse';

export const decodeString = (string: string): string => decodeURIComponent(string).replace(/@singlequotemark@/g, "'");

export const getRandomFilename = () => require('crypto').randomBytes(16).toString('hex');

export const isAWSErrorMessage = <T>(toBeDetermined: T | AWS.AWSError): toBeDetermined is AWS.AWSError => {
  if ((toBeDetermined as AWS.AWSError).message) {
    return true;
  }
  return false;
};

export const getQueryParams = <T>(
  paramsFromRequest: paramsFromRequest,
  missingParamsErrorMessage: string,
  ...queryParams: string[]
): T => {
  const result = {} as any;

  queryParams.forEach((el) => {
    if (paramsFromRequest[el] != undefined) result[el] = paramsFromRequest[el];
    else throw CustomError.createCustomErrorMessage(missingParamsErrorMessage);
  });

  return result;
};

export const getHeaders = <T>(
  headersFromEvent: HeadersType,
  missingHeaderErrorMessage: string,
  ...headers: string[]
): T => {
  const result = {} as any;

  headers.forEach((el) => {
    if (headersFromEvent[el]) result[el] = headersFromEvent[el];
    else throw CustomError.createCustomErrorMessage(missingHeaderErrorMessage);
  });

  return result;
};

export const getBodyProperty = <T>(body: any, missingBodyPropertyErrorMessage: string, ...properties: string[]): T => {
  const result = {} as any;

  properties.forEach((el) => {
    if (body[el]) result[el] = body[el];
    else throw CustomError.createCustomErrorMessage(missingBodyPropertyErrorMessage);
  });
  return result;
};

export const getAttributeFromUpdatedData = <T>(
  allAttributes: any,
  missingAttributeErrorMessage: string,
  ...attributes: string[]
) => {
  const result = {} as any;

  attributes.forEach((el) => {
    if (allAttributes[el]) result[el] = allAttributes[el];
    else throw CustomError.createCustomErrorMessage(missingAttributeErrorMessage);
  });
  return result;
};
