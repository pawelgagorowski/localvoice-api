'use strict';

require('dotenv').config({path: __dirname + '/../../.env'})

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const Month                                              = require('./month');
// const winston                                            = require('../../config/logger');


const docClient = new AWS.DynamoDB.DocumentClient();

class CourseParticipants {

  static async getParticipantsFromGivenMonthAndCourse(month, course, business) {
   console.log("getCourseParticipants");
    console.log( `${process.env.LOCALVOICE_PHRASE_TABLE}-${process.env.NODE_ENV}-result-for-${month}`);
    const params = {
      TableName: `${process.env.LOCALVOICE_PHRASE_TABLE}-${process.env.NODE_ENV}-result-for-${month}`,
      IndexName: "course-index",
      KeyConditionExpression: "course = :course AND business = :business",
      ExpressionAttributeValues: {
        ":course": course,
        ":business": business
      }
    }

    const result = await docClient.query(params).promise();
    const listOfParticipants = result.Items ? result.Items : [];

    return listOfParticipants;
  }


  static async getCourseParticipantsBasedOnListFromPreviousMonth(listOfCoursesAndCorespondingBusinesses) {
    const previousMonth = Month.getPreviousMonthAndIndex();

    const task = listOfCoursesAndCorespondingBusinesses.map(async (record) => {
      const params = {
        TableName: `${process.env.LOCALVOICE_PHRASE_TABLE}-${process.env.NODE_ENV}-result-for-${previousMonth.month}`,
        IndexName: "course-index",
        KeyConditionExpression: "course = :course AND business = :business",
        ExpressionAttributeValues: {
          ":course": record.course,
          ":business": record.business
        }
      }
      const course = {};
      const result = await docClient.query(params).promise();
      course.courseParticipants = result;
      course.course = record.course;

      return course;
    })

    const listOfCourseParticipants = await Promise.all(task);
    return listOfCourseParticipants;
  }

  static getCoursesFromObject(listOfCoursesWithCorespondingBusinesses) {
    const listOfCourses = [];
    listOfCoursesWithCorespondingBusinesses.forEach(({course, business}) => {
      listOfCourses.push(course)
    })
    return listOfCourses;
  }


}

module.exports = CourseParticipants;
