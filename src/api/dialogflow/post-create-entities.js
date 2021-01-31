'use strict';
//
// Route : POST /entities
//
// ************************************************************************
// ta funkcjonalność pozwala na weryfikację całej lekcji pod kątem "wyjątków"
// i wrzuca je pod postacią odpowiednich plików do folderu "Entities"

// nazwy plików są generowane na podstawie nazwy lekcji + odpowiednich części lekcji
const fs = require('fs');
const dialogflow = require('dialogflow');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const credentials = require('./credentials.json');

const entitiesClient = new dialogflow.EntityTypesClient({
 credentials: credentials,
});

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const agentPath = entitiesClient.projectAgentPath(projectId);

exports.handler = function (event, context, callback) {
  const name = event.name;
    getLesson(name, function (boolean, data) {
      if(boolean) {
        callback(null, "done")
      } else {
        callback(null, data)
      }
    })
  }


function verify (chat, synonyms, callback) {
  let dialogArray = []
  for(let i = 0; i < chat.length; i++) {
    const newDialog = chat[i].replace(/[-+.^:,?&]/gi,"").toLowerCase().replace(/^i /gi, "I ").replace(/i'm/gi,"I'm").replace(/ i /gi, " I ").replace(/omega3/gi,"omega 3");

    const unit = {};
    let tempDialog;
    let anotherRound = false;
    let counting = true;

    unit.value = newDialog;
    unit.synonyms = [];
    unit.synonyms.push(newDialog);


    modifyingPhrases(anotherRound, newDialog, unit, tempDialog, synonyms, function (data) {
      // dodajemy tylko co drugi callback
        if(data.synonyms.length > 1 ) {
          console.log("Sprawdzamy obiekt unit")
          console.log(unit);
          // usuwamy powtarzające się synonimy
          let examples = data.synonyms;
          console.log("Sprawdzamy unit.synonyms");
          console.log(data.synonyms);
          let uniq = examples.reduce(function(a,b) {
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;
          },[]);

          console.log("sprawdzamy uniqe");
          console.log(data)
          data.synonyms = uniq;
          console.log("sprawdzamy unit po dodaniu unikalnych nazw");
          console.log(data);
          dialogArray.push(data);
          console.log("sprawdzamy dialogoArray po dodaniu unit");
          console.log(dialogArray);
          counting = false;
        }

    })
  }
  let uniqArray = dialogArray.reduce(function(a,b) {
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[]);
  callback(uniqArray);
}


function modifyString (string) {
  let newString;
  newString = `/${string}/gi`
  if(newString.indexOf("'") > 0) {
    console.log("jesteśmy w if");
    let number = newString.indexOf("'")
    let char = "\\"
    newString = newString.slice(0, number) + "\\" + newString.slice(number)

  }
  console.log(newString)
  return newString;
}



function modifyingPhrases (anotherRound, newDialog, unit, tempDialog, synonyms, insideCallback) {
  // let array = [{base: /ride/gi, synonym: "write"}, {base: /can not/gi, synonym: "can't"}, {base: /time/gi, synonym: "dupa"}]

  for(let i = 0; i < synonyms.length; i++) {
    const pattern = synonyms[i].base
    //let pattern = synonyms[i].base;
    let regExp = new RegExp(pattern, 'gi');
    // console.log("sprawdzamy pattern");
    // console.log(synonyms[i].base);
    // console.log(pattern);
    if(regExp.test(newDialog)) {
      tempDialog = newDialog.replace(regExp, synonyms[i].synonym);
      unit.synonyms.push(tempDialog);
      let newDialog1 = tempDialog;
      console.log("dialog 1")
      console.log(newDialog1)
      // if(anotherRound === false) {
      //   anotherRound = true;
      //   return modifyingPhrases (anotherRound, newDialog, unit, tempDialog, synonyms, insideCallback);
      // }

      for(let j = i; j < synonyms.length; j++) {
        const pattern1 = synonyms[j].base;
        //let pattern = synonyms[i].base;
        let regExp1 = new RegExp(pattern1, 'gi');

        if(regExp1.test(newDialog1)) {
          let tempDialog1 = newDialog1.replace(regExp1, synonyms[j].synonym);
          unit.synonyms.push(tempDialog1);
          // newDialog2 = tempDialog;
        }
        // anotherRound = false;
        // insideCallback(unit);
      }
    }
    anotherRound = false;
    insideCallback(unit);
  }

  // const pattern_1 = /it\'s/gi;
  // const pattern_2 = /it is/gi;
  // const pattern_3 = / ok/gi;
  // const pattern_4 = /bread/gi;
  // const pattern_5 = /can not/gi;
  // const pattern_6 = /right/gi;
  // const pattern_7 = /ride/gi;
  // const pattern_8 = /library/gi;
  // const pattern_9 = /I am/gi;
  // const pattern_10 = /I\'m/gi;
  // const pattern_11 = /don\'t/gi;
  // const pattern_12 = /do not/gi;
  // const pattern_13 = /that is/gi;
  // const pattern_14 = /that\'s/gi;
  // const pattern_15 = /omega3/gi;
  // const pattern_16 = /salmon/gi;
  // const pattern_17 = /what is/gi;
  // const pattern_18 = /what\'s/gi;
  // const pattern_19 = /brat/gi;


}


function beforeVerify(chat, challenge, words, name, lambdaCallback) {
  const challengeArrey = [];
  for(let i = 0; i < challenge.length; i++) {
    if(i % 2) {
      challengeArrey.push(challenge[i])
    }
  }
  // słowa i wyrażenia dla cześci z powtarzaniem słówek
  const wordsArrey = [];
  const nameOfWords = [];
  for(let i = 0; i < words.words_to_repeat.length; i++) {
    nameOfWords.push(words.words_to_repeat[i])
    wordsArrey.push(words.words_to_repeat[i])
  }

  for(let i = 0; i < nameOfWords.length; i++) {
    console.log(nameOfWords)
    const examplesForWord = words[nameOfWords[i]].examplesForWord;
    for(let i = 0; i < examplesForWord.length; i++) {
      wordsArrey.push(examplesForWord[i][2])
    }
    const sentencesForWord = words[nameOfWords[i]].sentences
    for(let j = 0; j < sentencesForWord.length; j++) {
      const sentencesForWordExamples = words[nameOfWords[i]].sentences[j].sentence_to_repead;
      for(let k = 0; k < sentencesForWordExamples.length; k++) {
        wordsArrey.push(sentencesForWordExamples[k])
      }
    }

  }


  const params = {
    TableName: "ga-web-english-project--synonyms_from_testers-prod",
    }
  const myDoc = docClient.scan(params).promise();
  return myDoc.then(function (data) {
    console.log(data)
    let synonyms = data.Items;
    console.log(synonyms)
     return myF(chat, challengeArrey, wordsArrey, synonyms, name, lambdaCallback)
  }).catch(function (e) {
    console.log("Nie udało się")
    console.log(e)
  })
}

function myF (chat, challenge, words, synonyms, name, lambdaCallback) {
  let modifyName = name.replace(/ /g,"-")
  verify(chat, synonyms, function (data) {
            let entityName = `chat_${modifyName}`
            if(entityName.length > 30) {
              entityName = entityName.slice(0,30)
            }
            createEntity(entityName, data, lambdaCallback)


  })

  verify (challenge, synonyms, function (data) {
            let entityName = `challenge_${modifyName}`
            if(entityName.length > 30) {
              entityName = entityName.slice(0,30)
            }
            createEntity(entityName, data, lambdaCallback)

  })
  verify (words, synonyms, function (data) {
            let entityName = `words_${modifyName}`;
            if(entityName.length > 30) {
              entityName = entityName.slice(0,30)
            }
            createEntity(entityName, data, lambdaCallback)
  })
}


function wordsGathering(words) {
  // słowa i wyrażenia dla cześci z powtarzaniem słówek
  const wordsArrey = [];
  const nameOfWords = [];
  for(let i = 0; i < words.words_to_repeat.length; i++) {
    nameOfWords.push(words.words_to_repeat[i])
    wordsArrey.push(words.words_to_repeat[i])
  }

  for(let i = 0; i < nameOfWords.length; i++) {
    console.log(nameOfWords)
    const examplesForWord = words[nameOfWords[i]].examplesForWord;
    for(let i = 0; i < examplesForWord.length; i++) {
      wordsArrey.push(examplesForWord[i][2])
    }
    const sentencesForWord = words[nameOfWords[i]].sentences
    for(let j = 0; j < sentencesForWord.length; j++) {
      const sentencesForWordExamples = words[nameOfWords[i]].sentences[j].sentence_to_repead;
      for(let k = 0; k < sentencesForWordExamples.length; k++) {
        wordsArrey.push(sentencesForWordExamples[k])
      }
    }

  }
  console.log(wordsArrey);
}


function createEntity (name, synonyms, lambdaCallback) {

  /** Define a custom error object to help control flow in our Promise chain. */
class EntityNotFoundError extends Error {};

  entitiesClient
     .listEntityTypes({parent: agentPath})
     .then((responses) => {
     // The array of EntityTypes is the 0th element of the response.
       const resources = responses[0];
       for (let i = 0; i < resources.length; i++) {
         const entity = resources[i];
         if (entity.displayName === name) {
           return entity;
         }
       }
       throw new EntityNotFoundError();
     }).then((data) => {
     console.log('Found entity: ', JSON.stringify(data));
     const updatedEntityList = synonyms;
     data.entities = updatedEntityList;

     const request = {
       entityType: data,
       updateMask: {
         paths: ['entities'],
       },
     };
     return entitiesClient.updateEntityType(request);
   })
   .then((responses) => {
     console.log('Updated entities:', JSON.stringify(responses[0]));
     })
  .catch((err) => {
     // If this is the error we throw earlier in the chain, log the
     // cause of the problem.
       if (err instanceof EntityNotFoundError) {
         const entityType = {
          displayName: name,
          kind: 'KIND_MAP',
          entities: synonyms,
         };

         const request = {
          parent: agentPath,
          entityType: entityType,
         };

         entitiesClient
            .createEntityType(request)
            .then((responses) => {
              console.log('Created new entity type:', JSON.stringify(responses[0]));
             }).catch((err) => {
              console.error('Error creating entity type:', err);
            });

       } else {
         lambdaCallback(false, err)
         console.error('Error updating entity type:', err);
       }
     });
     lambdaCallback(true)
  }


function getLesson(name, lambdaCallback) {

  const params = {
      TableName: `${process.env.LIST_OF_ALL_LESSONS_TABLE}`,
      Key:{
          "name": name
      }
    }

  const myDoc = docClient.get(params).promise();
  return myDoc.then(function(data) {

    const chat = data.Item.todaysLesson.chat;
    const challenge = data.Item.todaysLesson.challengeForToday;
    const words = data.Item.todaysLesson.words;
    const name = data.Item.name;

    beforeVerify(chat, challenge, words, name, lambdaCallback)
  })
}
