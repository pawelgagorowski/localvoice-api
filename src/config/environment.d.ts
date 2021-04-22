declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'dev' | 'test' | 'prod',
        STRUCTURE_TABLE: string,
        LESSONS_FOR_TESTING: string,
        LIST_OF_ALL_LESSONS_TABLE: string,
        MONTHLY_CHALLENGE_TABLE: string,
        BUSINESS_TABLE: string,
        AWS_S3_BUCKET_PICTURES: string,
        VERSIONING_TABLE: string,
        LIST_OF_ALL_LESSONS_TABLE: string,
        INIT_VERSION: string,
        ECS_CLUSTER_NAME: string,
        ECS_TASK_DEFINITION: string,
        ECS_TASK_VPC_SUBNET_1: string,
        ECS_TASK_VPC_SUBNET_2: string,
        CATEGORIES_TABLE: string,
        LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE: string,
        COURSES_TABLE: string,
        COURSES_IN_BUSINESS_TABLE: string,
        USERS_TABLE: string,
        AUTH0_CLIENT_SECRET: string
      }
    }
  }
  export {};