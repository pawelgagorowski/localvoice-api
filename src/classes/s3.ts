import AWS                                      from "aws-sdk";
import CustomError                              from "./errorResponse";      
import { isAWSErrorMessage }                    from "../utils/helperFunctions";

AWS.config.update({ region: 'eu-central-1' });
const s3: AWS.S3 = new AWS.S3();

export default class S3Client {
    static async deleteObject(params: AWS.S3.DeleteObjectRequest, customErrorMessage: string): Promise<void> {
        const data: AWS.S3.DeleteObjectOutput | AWS.AWSError = await s3.deleteObject(params).promise();

        if(isAWSErrorMessage<AWS.S3.DeleteObjectOutput>(data)) throw CustomError.createCustomErrorMessage(customErrorMessage);
    }

    static createPresignedPost(params: AWS.S3.PresignedPost.Params, customErrorMessage: string): AWS.S3.PresignedPost {
        const data: AWS.S3.PresignedPost | AWS.AWSError = s3.createPresignedPost(params);

        if(isAWSErrorMessage<AWS.S3.PresignedPost>(data)) throw CustomError.createCustomErrorMessage(customErrorMessage);
        return data;
    }
} 