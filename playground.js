'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = `results_for_october_test`;

  const params = {
    TableName: tableName
  }

  const myDoc = docClient.scan(params).promise();
  return myDoc.then(function (data) {
    console.log("Udało się");
    let myArray = [];
    console.log(data);
    const items = data.Items;
    for(let i = 0; i < items.length; i++) {
      const item = items[i];
        let tempObjectForResults = {};
        if (true) {
          tempObjectForResults.user = true
        } else {
          tempObjectForResults.user = false;
        }
        tempObjectForResults.name = item.name
        let score = item.score
        tempObjectForResults.result = score;
        let given_name = item.given_name
        tempObjectForResults.given_name = given_name;
        myArray.push(tempObjectForResults);
      }
      console.log("udało się")
      console.log(myArray)
      return myArray
    }).catch(function (e) {
        console.log("Nie udało się")
    })


  function getCurrentMonth() {
    const month_array = ["january", "february", "march", "april", "mai", "juni", "juli", "august", 'september', 'october', 'november', 'december']
    const d = new Date();
    const n = d.getMonth();

    return month_array[n]
}
