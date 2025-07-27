import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MY_AWS_S3_SECRET_KEY,
  region: process.env.MY_AWS_REGION,
});
// console.log('S3 Client Initialized:', s3.config);

export default s3;
