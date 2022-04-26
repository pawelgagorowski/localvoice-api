// import AWS                                      from "aws-sdk";
// import CustomError                              from "../classes/errorResponse";
// import { LessonType }                           from "../models/types";
// import { isAWSErrorMessage }                    from "../utils/helperFunctions";
// import logger                                   from "../config/logger";

// const s3: AWS.S3 = new AWS.S3();
// AWS.config.update({ region: 'eu-central-1' });
// const docClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();



//   export default class DynamoDB {
//     static async queryItems<T>(params: AWS.DynamoDB.DocumentClient.QueryInput, listOfItems: T[], errorMessage: string): Promise<T[] | []> {
//         const data: AWS.DynamoDB.DocumentClient.QueryOutput | AWS.AWSError = await docClient.query(params).promise();

//         if(isAWSErrorMessage<AWS.DynamoDB.DocumentClient.QueryOutput>(data)) throw CustomError.createCustomErrorMessage(errorMessage);

//         if(data.Items && data.Items.length > 0) listOfItems = listOfItems.concat(data.Items as [])

//         if (data.LastEvaluatedKey) {
//             params.ExclusiveStartKey = data.LastEvaluatedKey;
//             return await DynamoDB.queryItems(params, listOfItems, errorMessage);
//         }
//         return listOfItems;
//     }


//     static async getItem<T>(params: AWS.DynamoDB.DocumentClient.GetItemInput, noItemErrorMessage: string): Promise<T | null> {
//         console.log("hello from get Dynamo!")

//         throw CustomError.createCustomErrorMessage(noItemErrorMessage);
//     }

//     static async deleteItem(params: AWS.DynamoDB.DocumentClient.DeleteItemInput, errorMessage: string): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
//         const data: AWS.DynamoDB.DocumentClient.DeleteItemOutput | AWS.AWSError = await docClient.delete(params).promise();

//         if(isAWSErrorMessage<AWS.DynamoDB.DocumentClient.GetItemOutput>(data)) throw CustomError.createCustomErrorMessage(errorMessage);
//         console.log("po throw!")
//         return data;
//     }

//     static async putItem(params: AWS.DynamoDB.DocumentClient.PutItemInput, errorMessage: string): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
//         const data: AWS.DynamoDB.DocumentClient.PutItemOutput | AWS.AWSError = await docClient.put(params).promise();

//         if(isAWSErrorMessage<AWS.DynamoDB.DocumentClient.PutItemOutput>(data)) throw CustomError.createCustomErrorMessage(errorMessage);
//         return data;
//     }

//     static async updateItem(params: AWS.DynamoDB.DocumentClient.UpdateItemInput, errorMessage: string): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
//         const data: AWS.DynamoDB.DocumentClient.UpdateItemOutput | AWS.AWSError = await docClient.update(params).promise();

//         if(isAWSErrorMessage<AWS.DynamoDB.DocumentClient.PutItemOutput>(data)) throw CustomError.createCustomErrorMessage(errorMessage);
//         return data;
//     }
// }


// const noItemErrorMessage = "no Item";

// const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
//     TableName: "localvoice-tables-test-SavedLessonsTable-AQYZBRH8FAQW",
//     Key: {
//       business: "business",
//       name: "hello"
//     }
//   };


//   (async () => {
//     try {
//         const lesson = await DynamoDB.getItem<LessonType>(params, noItemErrorMessage);
//     } catch(e) {
//         console.log("jesteśmy w e")
//         console.log(e);
//     }
//   })()

  


const array = [
    {
        name: "Paweł",
        value: "1"
    },
    {
        name: "Ania",
        value: "2"
    }
];

function dataIndex(array) {
    return array.reduce((acc, el) => {
        acc[el.name] = el.value
        return acc;
    }, {})
}

console.log(dataIndex(array));







