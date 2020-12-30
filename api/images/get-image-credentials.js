'use strict';
//
// Route : GET /imageCredentials
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {

    console.log("GET /imageCredentials")
    console.log("X-Business", event.headers["X-Business"])
    const type = event.queryParams.type;
    const target = event.queryParams.target;
    const business = event.headers["X-Business"];

    const getRandomFilename = () =>	require("crypto").randomBytes(16).toString("hex");

    const fileName = `${getRandomFilename()}.${type}` // totally random
    const data = s3.createPresignedPost({
  		Bucket: process.env.AWS_S3_BUCKET_PICTURES,
  		Fields: {
  			Key: `${target}/${business}/${fileName}`,
  		},
      Conditions: [
        ["starts-with", "$Content-Type", "image/"]
      ]
    })
    const fullPath = `${data.url}/${target}/${business}/${fileName}`;
    console.log(fullPath)
    return {data, fullPath}
  } catch (e) {
    console.log(e);
  }
}
