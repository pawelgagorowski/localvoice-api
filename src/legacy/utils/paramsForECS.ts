import { ECSGeneratePictures, ECSPictureOperations }                     from "../models/types";
require('dotenv').config({path: __dirname + '/../../.env'})


const ECSConfig = {
  cluster: process.env.ECS_CLUSTER_NAME,
    launchType: 'FARGATE',
    taskDefinition: process.env.ECS_TASK_DEFINITION,
    count: 1,
    platformVersion:'LATEST',
    networkConfiguration: {
      awsvpcConfiguration: {
          subnets: [
              process.env.ECS_TASK_VPC_SUBNET_1,
              process.env.ECS_TASK_VPC_SUBNET_2
          ],
          assignPublicIp: 'ENABLED'
      }
    }
}


const buildParamsForECSPictureOperations = ({ business, course, category, lesson, operationName }: ECSPictureOperations): AWS.ECS.RunTaskRequest => {
  const params: AWS.ECS.RunTaskRequest = {
    ...ECSConfig,
    overrides: {
      containerOverrides: [
        {
          name: process.env.CONTAINER_NAME,
          environment: [
            {
              name: 'BUSINESS',
              value: business
            },
            {
              name: 'COURSE',
              value: course
            },
            {
              name: 'CATEGORY',
              value: category
            },
            {
              name: 'LESSON',
              value: lesson
            },
            {
              name: 'OPERATION_NAME',
              value: operationName
            }
          ]
        }
      ]
    }
  };

  return params;
}

const buildParamsForECSGeneratePictures = ({ business, course, category, lesson, version, operationName }: ECSGeneratePictures): AWS.ECS.RunTaskRequest => {
  const params: AWS.ECS.RunTaskRequest = {
    ...ECSConfig,
    overrides: {
      containerOverrides: [
        {
          name: process.env.CONTAINER_NAME,
          environment: [
            {
              name: 'AWS_S3_BUCKET_PICTURES',
              value: process.env.AWS_S3_BUCKET_PICTURES
            },
            {
              name: 'AWS_S3_BUCKET_PICTURES_URL',
              value: process.env.AWS_S3_BUCKET_PICTURES_URL
            },
            {
              name: 'LIST_OF_ALL_LESSONS_TABLE',
              value: process.env.LIST_OF_ALL_LESSONS_TABLE
            },
            {
              name: 'BUSINESS',
              value: business
            },
            {
              name: 'COURSE',
              value: course
            },
            {
              name: 'CATEGORY',
              value: category
            },
            {
              name: 'LESSON',
              value: lesson
            },
            {
              name: 'OPERATION_NAME',
              value: operationName
            },
            {
              name: 'VERSION',
              value: version.toString()
            }
          ]
        }
      ]
    }
  };

  return params;
}

export { buildParamsForECSGeneratePictures, 
        buildParamsForECSPictureOperations };
