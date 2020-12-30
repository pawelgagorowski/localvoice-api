'use strict';

//
// Route: GET /lessons {name}
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.LESSONS_FOR_TESTING;

exports.handler = async (event) => {
  console.log("get-lessons")
  let allData = [];
  console.log("event");
  console.log(event);
  const params = {
    TableName: tableName,
    IndexName: "tester-index",
    KeyConditionExpression: "#tester = :tester",
    ExpressionAttributeValues: {
      ":tester": event.tester
    },
    ExpressionAttributeNames: {
      "#tester": "tester",
      "#course": "course",
      "#category": "category",
      "#lesson": "lesson"
    },
    Select: "SPECIFIC_ATTRIBUTES",
    ProjectionExpression: "#category,#lesson, #course"
  }
    const getAllData = async (params) => {

      console.log("Querying Table");
      let data = await docClient.query(params).promise();

      if(data['Items'].length > 0) {
          allData = allData.concat(data['Items'])
      }

      if (data.LastEvaluatedKey) {
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          return await getAllData(params);
      } else {
          return data;
      }
    }
  try {
        await getAllData(params);
        console.log("Processing Completed");
        console.log(allData)
        return allData
    } catch(error) {
        console.log(error);
    }
}
