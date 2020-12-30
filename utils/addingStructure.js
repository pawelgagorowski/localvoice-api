'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const tableForCourseStructure = `${process.env.COURSES_TABLE}`;
const tableForCategoriesStructure = `${process.env.CATEGORIES_TABLE}`;
const tableForLessonsStructure = `${process.env.LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE}`;

class RemoveOldStructure {
  constructor(business, env) {
    this.business = business;
    this.env = env;
  }

  // remove all certain business records from list of categories in one course table
  // we do it to put new ones
  async removeCategories() {
    console.log("removeCategories table", tableForCategoriesStructure);

    const paramsForListOfCategoriesInOneCourseQuery = {
      TableName: tableForCategoriesStructure,
      KeyConditionExpression: "business = :business",
      ExpressionAttributeValues: {
        ":business": this.business
      }
    }

    const queryForListOfCategories = await docClient.query(paramsForListOfCategoriesInOneCourseQuery).promise();
      const deletingListOfCategoriesInOneCourseRecordsProcess = queryForListOfCategories.Items.map(async (item) => {
        const paramsForDeletingListOfCategoriesInOneCourse = {
          TableName: tableForCategoriesStructure,
          Key: {
            business: item.business,
            name: item.name
          }
        }
        const data = await docClient.delete(paramsForDeletingListOfCategoriesInOneCourse).promise()
      })
      await Promise.all(deletingListOfCategoriesInOneCourseRecordsProcess)
  }

  async removeLessons() {
    // remove all certain business records from list of lessons in one category table
    // we do it to put new ones

    const paramsForListOfLessonsInOneCategoryQuery = {
      TableName: tableForLessonsStructure,
      KeyConditionExpression: "business = :business",
      ExpressionAttributeValues: {
        ":business": this.business
      }
    }

    const queryForListOfLessonsInOneCategory = await docClient.query(paramsForListOfLessonsInOneCategoryQuery).promise();
    const deletingListOfLessonsRecordsProcess = queryForListOfLessonsInOneCategory.Items.map(async (item) => {
      const paramsForDeletingListOfLessonsInOneCategory = {
        TableName: tableForLessonsStructure,
        Key: {
          business: item.business,
          key: item.key
        }
      }
      const data = await docClient.delete(paramsForDeletingListOfLessonsInOneCategory).promise()
    })
    await Promise.all(deletingListOfLessonsRecordsProcess)
  }
}


class PutNewStructure {
  constructor(business, env) {
    this.business = business;
    this.env = env;
  }

  // adding courses
  async addCourse(courses) {
    const paramsForCourse = {
      TableName: tableForCourseStructure,
      Item: {
        business: this.business,
        list: courses.list
      }
    }
    const dataForCourse = await docClient.put(paramsForCourse).promise();
  }

  // adding categories
  async addCategories (categories) {
    const processForCategories = categories.map(async (course) => {
      const paramsForCategoriesTable = {
        TableName: tableForCategoriesStructure,
        Item: {
          business: this.business,
          name: course.name,
          list: course.list
        }
      }
      const data = await docClient.put(paramsForCategoriesTable).promise()
    })

    await Promise.all(processForCategories)

  }
  // adding lessons
  async addLessons(lessons) {
    let key;
    const processForLessons = lessons.map(async (course) => {
      console.log("jak wygląda course!!", course)
      course.forEach(async (category) => {
        key = `${category.course}_${category.name}`.toLowerCase();
        const paramsForLessonsTable = {
          TableName: tableForLessonsStructure,
          Item: {
            business: this.business,
            key: key,
            list: category.list,
            translatedCategoryName: category.translatedCategoryName
          }
        }
        const data = await docClient.put(paramsForLessonsTable).promise()
      })
    })
    await Promise.all(processForLessons)
  }
}



module.exports = {
  RemoveOldStructure,
  PutNewStructure
}
