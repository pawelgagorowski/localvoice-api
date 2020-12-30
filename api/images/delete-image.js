'use strict';
//
// Route : DELETE /image
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const s3 = new AWS.S3();

async function deleteS3Object(fileName, business, target) {
  const key = `${target}/${business}/${fileName}`;
  var params = {
    Bucket: process.env.AWS_S3_BUCKET_PICTURES,
    Key: key
  }
  try {
    const data = await s3.deleteObject(params).promise()
    return data
  } catch (e) {
    console.log(e)
  }
}

exports.handler = async (event) => {
  console.log("DELETE /image")
  try {
    const business = event.headers["X-Business"];
    const fileName = event.queryParams.filename;
    const target = event.queryParams.target;
    console.log("fileName", fileName)
    console.log("business", business)
    const response = await deleteS3Object(fileName, business, target)
    return response
  } catch (e) {
    console.log(e)
    const response = {};
    response.answer = "Pojawił się błąd. Proszę przekazać to administratorowi";
    return response;
  }
}
