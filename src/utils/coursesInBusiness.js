'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

// const winston                                            = require('../../config/winston');

const docClient = new AWS.DynamoDB.DocumentClient();

class Courses {
  static async getCoursesFromTable() {
    console.log("getPreviousPreviousWinners");

      const params = {
        TableName:`${process.env.COURSES_IN_BUSINESS_TABLE}`
      }
      const result = await docClient.scan(params).promise();
      if(result.Items.length === 0) throw new Error();

      return result;
  }

  static extractListOfCoursesWithCorespondingBusiness(resultFromTable) {
    const listOfCoursesAndCorespondingBusiness = [];
    let course = {};

    resultFromTable.Items.forEach((record) => {
      record.listOfCourses.forEach((courseRow) => {
        course.business = record.business;
        course.course = courseRow;
        listOfCoursesAndCorespondingBusiness.push(course);
        course = {};
      })
    })

    return listOfCoursesAndCorespondingBusiness;
  }
}

module.exports = Courses;
