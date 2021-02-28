import { ECSPropertiesType }                     from "../models/types";
require('dotenv').config({path: __dirname + '/../../.env'})


const buildParamsForECS = ({ business, course, category, lesson, version }: ECSPropertiesType): AWS.ECS.RunTaskRequest => {
  const params: AWS.ECS.RunTaskRequest = {
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
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.CONTAINER_NAME,
          environment: [
            {
              name: 'AWS_S3_BUCKET',
              value: process.env.AWS_S3_BUCKET_PICTURES
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

export { buildParamsForECS };
