rm -fr lambda_upload.zip
zip -r lambda_upload.zip api/action-to-readFunction.js utils/intent.js
aws lambda update-function-code --function-name ga-web-english-project-prod-put-text-to-readFunction --zip-file fileb://lambda_upload.zip
