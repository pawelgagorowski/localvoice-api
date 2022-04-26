'use strict';

import { ListOfLessonsStructureType, 
        CategoryInStructureType, ItemStructure, CourseInStructureType }          from "../models/types";


class UniversalFields {
  addGoBackToCategoryButton(lessons: ListOfLessonsStructureType) {
    const goBackToCategoryItem = {
      title: "Go back to categories",
      description: "Powrót do kategorii",
      image: "https://english-project.s3.eu-central-1.amazonaws.com/icons/universal/go-back.png",
      alt: "sign to go back"
    }
    lessons.forEach((course) => {
      course.forEach((category) => {
        category.list.splice(0,0, goBackToCategoryItem);
      })
    })
  }

  addMonthlyChallengeButton(lessons: ListOfLessonsStructureType) {
    const monthlyChallengeItem = {
      title: "Monthly Challenge",
      description: "Weź udział w miesięcznym wyzwaniu i zgarniaj nagrody!",
      image: "https://english-project.s3.eu-central-1.amazonaws.com/icons/universal/winner.png",
      alt: "Monthly Challenge image"
    }
    lessons.forEach((course) => {
      course.forEach((category) => {
        category.list.push(monthlyChallengeItem);
      })
    })
  }

  addIntelligentReplaysButton(lessons: ListOfLessonsStructureType) {
    const intelligentReplays = {
      title: "Intelligent Replays",
      description: "Powtórz frazy które sprawiały Ci problemy!",
      image: "https://english-project.s3.eu-central-1.amazonaws.com/icons/universal/inteligent-replays.png",
      alt: "intelligent replay image"
    }
    lessons.forEach((course) => {
      course.forEach((category) => {
        category.list.push(intelligentReplays);
      })
    })
  }

  addChallengeButtons(lessons: ListOfLessonsStructureType) {
    let challengeObject;
    let myArray: ItemStructure[] = []
    lessons.forEach((course: CategoryInStructureType[]) => {
      course.forEach((category: CategoryInStructureType) => {
        category.list.forEach((lesson: ItemStructure) => {
          challengeObject = {
            title: `Challenge for ${lesson.title}`,
            description: `Wyzwanie dla lekcji ${lesson.title}`,
            image: 'https://english-project.s3.eu-central-1.amazonaws.com/icons/universal/classroom.png',
            alt: lesson.title
          }
          myArray.push(lesson)
          myArray.push(challengeObject)
        });
        category.list = myArray;
        myArray = [];
      })
    })
  }



  addSignInButton(category: CourseInStructureType[]) {
    const signInItem = {
      title:"sign in",
      description: "Zaloguj się aby móc korzystać ze wszystkich funkcji",
      image: "https://d24xp1bilplfor.cloudfront.net/icons/log-in.png",
      alt: "sign in"
    }
    category.forEach((course: CourseInStructureType) => {
      course.list.splice(0, 0, signInItem)
    })
  }
}

export { UniversalFields };
