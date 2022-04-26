import AWS                                      from "aws-sdk";
import CustomError                              from "./errorResponse";
import { LessonType }                           from "../models/types";  
import { isAWSErrorMessage }                    from "../utils/helperFunctions";

AWS.config.update({ region: 'eu-central-1' });
const s3: AWS.S3 = new AWS.S3();

export default class S3Client {
    static async deleteObject(params: AWS.S3.DeleteObjectRequest, customErrorMessage: string): Promise<AWS.S3.DeleteObjectOutput> {
        const data: AWS.S3.DeleteObjectOutput | AWS.AWSError = await s3.deleteObject(params).promise();

        if(isAWSErrorMessage<AWS.S3.DeleteObjectOutput>(data)) throw CustomError.createCustomErrorMessage(customErrorMessage);
        return data;
    }

    static createPresignedPost(params: AWS.S3.PresignedPost.Params, customErrorMessage: string): AWS.S3.PresignedPost {
        const data: AWS.S3.PresignedPost | AWS.AWSError = s3.createPresignedPost(params);

        if(isAWSErrorMessage<AWS.S3.PresignedPost>(data)) throw CustomError.createCustomErrorMessage(customErrorMessage);
        return data;
    }

    static async deleteFolder(sourceBacket: string, directory: string, business: string, lesson: LessonType, env: string) {
        console.log("deleteFolder")
        console.log("lesson", lesson);
        try {
            const listParamsForDeletingFolder = {
                Bucket: sourceBacket,
                Prefix: `${business}/${directory}/${env}/${lesson.course}/${lesson.category}/${lesson.lesson}`
            };
            const listedObjectsFromTargetEnv = await s3.listObjects(listParamsForDeletingFolder).promise();
        
            if(!listedObjectsFromTargetEnv.Contents) return;
            const deletingObjectsPromises = listedObjectsFromTargetEnv.Contents.map(async (key) => { 
                if(!key.Key) return;
        
                const modifiedKey = modifyKey(key.Key, env);
                const paramsForDelete = {
                    Bucket : sourceBacket,
                    Key: modifiedKey
                };
                await s3.deleteObject(paramsForDelete).promise();
            });
            await Promise.all(deletingObjectsPromises)
        } catch(e) {
            console.log(e);
        }
        
    
    }
    
    
    static async copyFolder (sourceBacket: string, directory: string, business: string, lesson: any, sourceEnv: string, targetEnv: string) {
        console.log("copyFolder");
        console.log("lesson", lesson);
        console.log("targetEnv",targetEnv);
        console.log("path", `${business}/${directory}/${sourceEnv}/${lesson.course}/${lesson.category}/${lesson.lesson}`)
        try {
            const listParamsForCopyingFolder = {
                Bucket: sourceBacket,
                Prefix: `${business}/${directory}/${sourceEnv}/${lesson.course}/${lesson.category}/${lesson.lesson}`
            };
            const listedObjectsForCopyingFolder = await s3.listObjects(listParamsForCopyingFolder).promise();
            console.log("listedObjectsForCopyingFolder", listedObjectsForCopyingFolder);
            if(!listedObjectsForCopyingFolder.Contents) return;
            const copyingObjectsPromises = listedObjectsForCopyingFolder.Contents.map(async (key) => {
                if(!key.Key) return;
        
                const modifiedKey = modifyKey(key.Key, targetEnv);
                const paramsForCopy = {
                    Bucket : sourceBacket,
                    CopySource : `${sourceBacket}/${key.Key}`,
                    Key: modifiedKey
                };
                await s3.copyObject(paramsForCopy).promise();
            });
            await Promise.all(copyingObjectsPromises);
        } catch(e) {
            console.log(e);
        }
    
    }
}



const modifyKey = (key: string, env: string): string => {
    const keyAsArray = key.split('/');
    keyAsArray.splice(2,1, env);
    return keyAsArray.join("/");
}