import AWS                                      from "aws-sdk";

export type LessonType = {
    business: string,
    name: string,
    category: string,
    course: string,
    lesson: string,
    tester: string,
    todaysLesson: todaysLesson
    translatedCategory: string,
    translatedLesson: string,
    key: string
}

type todaysLesson = {
    challengeForToday?: [],
    chat?: [],
    chatDescription?: string,
    translate?: [],
    translatedChatDescription?: string,
    words?: any
}



export type paramsFromRequest = {
    [key: string] : string
}

export type requestEventType = {
    method: string,
    body: {},
    headers: {},
    queryParams: any,
    pathParams: string,
    isOffline?: boolean,
    stageVariables: {}
}

export type getSavedLessonRequestType = {
    method: string,
    body: {},
    headers: any,
    queryParams: getSavedLessonQueryParams,
    pathParams: string,
    isOffline?: boolean,
    stageVariables: {}
}

export type getListOfLessonsRequestType = {
    tester: string,
    ifOffline?: boolean,
    stageVariables: {}
}

export type getSavedLessonQueryParams = {
    business: string,
    key: string
}

export type listOfLessonsArrayType =  listOfLessonsType []


export type listOfLessonsType = {
    course?: string,
    category?: string,
    lesson?: string
}

export type CustomErrorMessageType = {
    customErrorMessage: string
}

export type ResponseType = {
    statusCode: number,
    answer: string,
    body?: string
    headers?: any
}

export type GeneralHeadersType = {
    Host: string,
    Accept: string,
    "Accept-Language": string,
    "Accept-Encoding": string,
    "Content-Type": string,
    "Content-Length": string,
    Origin: string,
    Connection: string,
}

export type UserHeaderType = {
    "x-user": string
}

export type BusinessHeaderType = {
    "x-business": string
}

export type HeadersType = {
    [key: string] : string
}

export type DeleteLittleImageRequestParamsType = {
    filename: string,
    target: string
}

export type GetImageCredentialsRequestParamsType = {
    target: string,
    type: string
}

export type GetImageVersioningparamsType = {
    category: string,
    name: string
}

export type CounterType = {
    counter: string;
}

export type GetImageCredentialsResponse = {
    credentials: AWS.S3.PresignedPost,
    fullPath: string
}

export type PostImageVersioning = {
    business: string,
    key: string
}

export type versionOfTestType = {
    versionOfTest: string
}

export type ECSPropertiesType = {
    business: string,
    course: string,
    category: string,
    lesson: string,
    version: string
}

export type StructureItemDatabaseType = {
    business: string,
    structure: StructureType[]
}

export type StructureType = {
    categories: {
        [key: string] : {
            list: ItemStructure[]
        }
    },
    englishCourseName: string,
    image: string,
    polishCourseName: string
}

export type ItemStructure = {
    alt: string,
    description: string,
    image: string,
    title: string
}

export type StructureRequestBody = {
    structure: StructureType
}

export type ListOfCategoriesTableType = {
    business: string,
    name: string,
    list: ItemStructure[]
}

export type ListOfLessonsInSpecificCategory = {
    business: string,
    key: string,
    list: ItemStructure[]
}

export type ListOfCoursesType = {
    business: string,
    list: ItemStructure[]
}

export type ListOfCoursesStructureSaveType = {
    [key: string] : string
}

export type ListOfLessonsStructureType = [CategoryInStructureType[]]

export type CategoryInStructureType = {
    course: string,
    name: string,
    translatedCategoryName: string,
    list: ItemStructure[]
}

export type CoursesInStructureType = {
    list: ItemStructure[]
}

export type ListOfCoursesInStructureType = [CourseInStructureType[]]

export type CourseInStructureType = {
    list: ItemStructure[],
    name: string
}

export type StructureToTestBodyRequest = {
    categories: ListOfCategoriesTableType[],
    courses: CoursesInStructureType,
    lessons: ListOfLessonsStructureType,
    env: string
}

export type FinaleCommentsType = {
    answer: string[]
}






export type loggerLevelType = "info" | "error";
