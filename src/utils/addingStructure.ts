'use strict';

import AWS                                             from "aws-sdk";
import { ListOfCategoriesTableType, 
        ListOfLessonsInSpecificCategory, 
        ListOfCoursesType, ListOfLessonsStructureType, 
        CategoryInStructureType, CoursesInStructureType }                            from "../models/types";
import DynamoDB                                        from "../classes/dynamoDB";
import logger                                          from "../config/logger";


AWS.config.update({ region: 'eu-central-1' });
require('dotenv').config({path: __dirname + '/../../.env'})

class RemoveOldStructure {
  queryItemsInRemovingCategoryErrorMessage: string;
  deleteItemErrorMessage: string;
  queryItemsInRemovingLessonErrorMessage: string;
  deleteItemInRemovingLessonErrorMessage: string;

  constructor(public business: string, public env: string) {
    this.business = business;
    this.env = env;
    this.queryItemsInRemovingCategoryErrorMessage = "there was an error with quering database during removing categories";
    this.deleteItemErrorMessage = "there was an error with deleting item in database during removing categories";
    this.queryItemsInRemovingLessonErrorMessage = "there was an error with quering database during removing lessons";
    this.deleteItemInRemovingLessonErrorMessage = "there was an error with deleting item in database during removing lessons";
  }

  // remove all certain business records from list of categories in one course table
  // we do it to put new ones
  async removeCategories() {
    console.log("removeCategories table", process.env.CATEGORIES_TABLE);

    const paramsForListOfCategoriesInOneCourseQuery: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.CATEGORIES_TABLE,
      KeyConditionExpression: "business = :business",
      ExpressionAttributeValues: {
        ":business": this.business
      }
    }

    const queryForListOfCategories = await DynamoDB.queryItems<ListOfCategoriesTableType>(paramsForListOfCategoriesInOneCourseQuery, [], this.queryItemsInRemovingCategoryErrorMessage)
      const deletingListOfCategoriesInOneCourseRecordsProcess = (queryForListOfCategories as ListOfCategoriesTableType[]).map(async (item: ListOfCategoriesTableType) => {
        const paramsForDeletingListOfCategoriesInOneCourse: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
          TableName: process.env.CATEGORIES_TABLE,
          Key: {
            business: item.business,
            name: item.name
          }
        }
        const data = await DynamoDB.deleteItem(paramsForDeletingListOfCategoriesInOneCourse, this.deleteItemErrorMessage);
      })
      await Promise.all(deletingListOfCategoriesInOneCourseRecordsProcess)
  }

  async removeLessons() {
    // remove all certain business records from list of lessons in one category table
    // we do it to put new ones

    const paramsForListOfLessonsInOneCategoryQuery: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE,
      KeyConditionExpression: "business = :business",
      ExpressionAttributeValues: {
        ":business": this.business
      }
    }

    const queryForListOfLessonsInOneCategory = await DynamoDB.queryItems<ListOfLessonsInSpecificCategory>(paramsForListOfLessonsInOneCategoryQuery, [], this.queryItemsInRemovingLessonErrorMessage);
    const deletingListOfLessonsRecordsProcess = (queryForListOfLessonsInOneCategory as ListOfLessonsInSpecificCategory[]).map(async (item) => {
      const paramsForDeletingListOfLessonsInOneCategory = {
        TableName: process.env.LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE,
        Key: {
          business: item.business,
          key: item.key
        }
      }
      const data = await DynamoDB.deleteItem(paramsForDeletingListOfLessonsInOneCategory, this.deleteItemInRemovingLessonErrorMessage)
    })
    await Promise.all(deletingListOfLessonsRecordsProcess)
  }
}


class PutNewStructure {
  putItemToCoursesTableErrorMessage: string;
  putItemToBusinessTableErrorMessage: string;
  putItemToListOfCategoriesTableErrorMessage: string;
  putItemToListOfLessonsOfSpecificCategoryErrorMessage: string


  constructor(public business: string, public env: string) {
    this.business = business;
    this.env = env;
    this.putItemToCoursesTableErrorMessage = "there was an error while putting course to ListOfCourses table in PutNewStructure";
    this.putItemToBusinessTableErrorMessage = "there was an error while putting course name to CoursesInBusiness table in PutNewStructure";
    this.putItemToListOfCategoriesTableErrorMessage = "there was an error while putting categories to ListOfCategories table in PutNewStructure";
    this.putItemToListOfLessonsOfSpecificCategoryErrorMessage = "there was an error while putting lesson to ListOfLessons in PutNewStructure"
  }

  // adding courses
  async addCourse(courses: CoursesInStructureType) {
    const paramsForCourse: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.COURSES_TABLE,
      Item: {
        business: this.business,
        list: courses.list
      }
    }
    const dataForCourse = await DynamoDB.putItem(paramsForCourse, this.putItemToCoursesTableErrorMessage);
  }

  async addCoursesToBusinessTable(courses: CoursesInStructureType) {
    const listOfCourses: string[] = [];
    courses.list.forEach((course) => {
      listOfCourses.push(course.title)
    })
    const params:AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.COURSES_IN_BUSINESS_TABLE,
      Item: {
        business: this.business,
        listOfCourses: listOfCourses
      }
    }

    const result = await DynamoDB.putItem(params, this.putItemToBusinessTableErrorMessage);
  }

  // adding categories
  async addCategories (categories: ListOfCategoriesTableType[]) {
    const processForCategories = categories.map(async (course) => {
      const paramsForCategoriesTable = {
        TableName: process.env.CATEGORIES_TABLE,
        Item: {
          business: this.business,
          name: course.name,
          list: course.list
        }
      }
      const data = await DynamoDB.putItem(paramsForCategoriesTable, this.putItemToListOfCategoriesTableErrorMessage)
    })

    await Promise.all(processForCategories)

  }
  // adding lessons
  async addLessons(lessons: ListOfLessonsStructureType) {
    let key;
    const processForLessons = lessons.map(async (course: CategoryInStructureType[]) => {
      course.forEach(async (category: CategoryInStructureType) => {
        key = `${category.course}_${category.name}`.toLowerCase();
        const paramsForLessonsTable: AWS.DynamoDB.DocumentClient.PutItemInput = {
          TableName: process.env.LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE,
          Item: {
            business: this.business,
            key: key,
            list: category.list,
            translatedCategoryName: category.translatedCategoryName
          }
        }
        const data = await DynamoDB.putItem(paramsForLessonsTable, this.putItemToListOfLessonsOfSpecificCategoryErrorMessage)
      })
    })
    await Promise.all(processForLessons)
  }
}



export {
  RemoveOldStructure,
  PutNewStructure
}
