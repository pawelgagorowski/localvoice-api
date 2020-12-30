'use strict';


class UniversalFields {

  addGoBackToCategoryButton(lessons) {
    const goBackToCategoryItem = {
      title: "Go back to categories",
      description: "Powrót do kategorii",
      image: "https://english-project.s3.eu-central-1.amazonaws.com/icons/uniwersal/go-back.png",
      alt: "sign to go back"
    }
    lessons.forEach((course) => {
      course.forEach((category) => {
        category.list.splice(0,0, goBackToCategoryItem);
      })
    })
  }

  addMonthlyChallengeButton(lessons) {
    const monthlyChallengeItem = {
      title: "Monthly Challenge",
      description: "Weź udział w miesięcznym wyzwaniu i zgarniaj nagrody!",
      image: "https://english-project.s3.eu-central-1.amazonaws.com/icons/uniwersal/winner.png",
      alt: "Monthly Challenge image"
    }
    lessons.forEach((course) => {
      course.forEach((category) => {
        category.list.push(monthlyChallengeItem);
      })
    })
  }

  addChallengeButtons(lessons) {
    let challengeObject;
    let myArray = []
    lessons.forEach((course) => {
      course.forEach((category) => {
        category.list.forEach((lesson) => {
          challengeObject = {
            title: `Challenge for ${lesson.title}`,
            description: `Wyzwanie dla lekcji ${lesson.title}`,
            image: 'https://english-project.s3.eu-central-1.amazonaws.com/icons/uniwersal/classroom.png',
            alt: lesson.title
          }
          myArray.push(lesson)
          myArray.push(challengeObject)
        });
        category.list = myArray;
        myArray = []
      })
    })
  }

  addSignInButton(category) {
    const signInItem = {
      title:"sign in",
      description: "Zaloguj się aby móc korzystać ze wszystkich funkcji",
      image: "https://d24xp1bilplfor.cloudfront.net/icons/log-in.png",
      alt: "sign in"
    }
    category.forEach((course) => {
      course.list.splice(0, 0, signInItem)
    })
  }
}

module.exports = {
  UniversalFields
}
