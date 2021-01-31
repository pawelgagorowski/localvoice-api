'use strict';

import { ListOfLessonsStructureType, 
        CategoryInStructureType,
        CoursesInStructureType, CourseInStructureType }          from "../models/types";

class ValidateStructure {
  environment!: string

  constructor(public env: string) {
    this.env = env
    this.environment;
    this.setUpEnv()
  }

  setUpEnv() {
    if(this.env == "test") {
      this.environment = "testować lekcje";
    } else {
      this.environment = "upublicznić lekcje";
    }
  }

  validateCourses(courses: CoursesInStructureType) {
    const messages: string[] = [];
    let message;
    courses.list.forEach((course) => {
      if(!course.title) {
        message = `Aby móc ${this.environment} musisz uzupełnić pole 'nazwa kursu' dla wszystkich kursów`
        messages.push(message);
      }
      if(!course.description) {
        message = `Aby móc ${this.environment} musisz uzupełnić pole 'opis kursu' dla wszystkich kursów`
        messages.push(message);
      }
      if(!course.image) {
        message = `Aby móc ${this.environment} musisz dodać zdjęcie kursu`
        messages.push(message);
      }
    })
    const uniqMessages = [...new Set(messages)];
    return uniqMessages
  }

  validateCategories(categories: CourseInStructureType[]) {
    const messages: string[] = [];
    let message;

    categories.forEach((course) => {
      if(!course.name) {
        message = `Aby móc ${this.environment} musisz uzupełnić pole 'nazwa kursu' dla wszystkich kursów`;
        messages.push(message);
        return messages
      }

      if(course.list.length < 2) {
        message = `Aby móc ${this.environment} musisz stworzyć conajmniej dwie kategorie`;
        messages.push(message);
        return messages
      }

      if(course.list.length > 30) {
        message = `Aby móc ${this.environment} możesz mieć maksymalnie 30 kategorii do każdego kursu`;
        messages.push(message);
        return messages
      }

      course.list.forEach((category) => {
        if(!category.title) {
          message = `Aby móc ${this.environment} musisz uzupełnić pole 'nazwa kategorii' dla wszystkich stworzonych kategorii`
          messages.push(message);
        }

        if(!category.description) {
          message = `Aby móc ${this.environment} musisz uzupełnić pola 'opis kategorii' dla wszystkich stworzonych kategorii`
          messages.push(message);
        }

        if(!category.image) {
          message = `Aby móc ${this.environment} musisz dodać zdjęcia kategorii dla wszystkich stworzonych kategorii`
          messages.push(message);
        }
      })
    })
    const uniqMessages = [...new Set(messages)];
    return uniqMessages
  }

  validateLessons(lessons: ListOfLessonsStructureType) {
    const messages: string[] = [];
    let message;

    if(lessons.length <= 0) {
      message = `Aby móc ${this.environment} dodać stworzyć lekcje do kursu`
      messages.push(message)
      return messages;
    }

    lessons.forEach((course) => {
      course.forEach((category) => {
        if(category.list.length < 2) {
          message = `Aby móc ${this.environment} musisz stworzyć conajmniej dwie lekcje do każdej stworzonej kategorii`
          messages.push(message);
          return messages
        }

        if(category.list.length > 13) {
          message = `Aby móc ${this.environment} możesz mieć maksymalnie 13 lekcji do każdej kategorii`
          messages.push(message);
          return messages
        }

        category.list.forEach((lesson) => {
          if(!lesson.title) {
            message = `Aby móc ${this.environment} musisz uzupełnić pole 'nazwa lekcji' dla wszystkich stworzonych lekcji`
            messages.push(message);
          }
          if(!lesson.description) {
            message = `Aby móc ${this.environment} musisz uzupełnić wszystkie pola 'opis lekcji' dla wszystkich stworzonych lekcji`
            messages.push(message);
          }
          if(!lesson.image) {
            message = `Aby móc ${this.environment} musisz dodać zdjęcia lekcji dla wszystkich stworzonych lekcji`
            messages.push(message);
          }
        })
      })
    })
    const uniqMessages = [...new Set(messages)];
    return uniqMessages
  }
}

export { ValidateStructure };
