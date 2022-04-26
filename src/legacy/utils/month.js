require('dotenv').config({path: __dirname + '/../../.env'})

const AWS                                         = require('aws-sdk');
// const winston                                     = require('../../config/winston');

AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const month_array = ["", "january", "february", "march", "april", "may", "june", "july", "august", 'september', 'october', 'november', 'december'];

class Month {
  static getPreviousMonthAndIndex() {
    console.log("getPreviousMonth");

    const result = {};
    const currentMonth = new Date().toLocaleString("pl-PL", {timeZone: "Europe/Warsaw", month: 'numeric'});
    if(currentMonth == 1) {
      result.index = currentMonth;
      result.month = month_array[12];
      return result
    }

    result.index = currentMonth;
    result.month = month_array[currentMonth-1];
    return result;
  }

  static getPreviousPreviousMonthAndIndex() {
    console.log("getPreviousPreviousMonth")

    const result = {};
    const currentMonth = new Date().toLocaleString("pl-PL", {timeZone: "Europe/Warsaw", month: 'numeric'});
    
    if(currentMonth == 1) {
      result.index = currentMonth;
      result.month = month_array[11];
      return result;
    }

    if(currentMonth == 2) {
      result.index = currentMonth;
      result.month = month_array[12];
      return result;
    }
    result.index = currentMonth;
    result.month = month_array[currentMonth-2];
    return result;
  }

  static getCurrentMonth() {
    console.log("getCurrentMonth");

    const currentMonth = new Date().toLocaleString("en-US", {timeZone: "Europe/Warsaw", month: 'long'});
    return currentMonth.toLowerCase();
  }
}

module.exports = Month;
